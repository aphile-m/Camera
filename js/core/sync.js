/* ==========================================================================
   sync.js — keeping two devices honest.

   Same transport as the Trainer App: one JSON document in the Microsoft Graph
   app folder, written with optimistic concurrency so a concurrent write from
   another device is detected rather than silently clobbered.

   The merge is the interesting half. Naive last-write-wins would lose a lesson
   you read on the phone the moment the laptop pushed. So every collection has
   a rule chosen from what the data actually means:

     lessons   a lesson read anywhere is read everywhere; the earliest date
               wins, because that is when you actually read it
     drills    the same, plus the reflection from whichever side wrote last
     reviews   the later answer wins outright — it carries the newer schedule
     journal   per-entry, later `updatedAt` wins; deletions leave tombstones so
               a deleted entry cannot be resurrected by the other device
     activity  per day, the higher count of each kind
     streak    not synced — recomputed from the merged activity, so it can
               never disagree with the days behind it
     settings  last write wins, stamped as a whole

   Every function here is pure. The Graph calls live at the bottom.
   ========================================================================== */

import * as store from './store.js';
import * as sp from './sharepoint.js';

export const STATE_FILE = 'state';
const TOMBSTONE_TTL = 120 * 86400000;   // 120 days is far longer than any sync gap

const num = v => (typeof v === 'number' && isFinite(v) ? v : 0);
const laterOf = (a, b) => (num(a) >= num(b) ? a : b);

/* ---------- per-collection merges ------------------------------------------ */

export function mergeLessons(a = {}, b = {}) {
  const out = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id], y = b[id];
    if (!x || !y) { out[id] = x || y; continue; }
    /* Read once, read forever — and the honest date is the first one. */
    const at = Math.min(num(x.at) || Infinity, num(y.at) || Infinity);
    out[id] = {
      ...x, ...y,
      read: !!(x.read || y.read),
      at: isFinite(at) ? at : (x.at ?? y.at),
      quiz: laterOf(x.quiz?.at, y.quiz?.at) === y.quiz?.at ? (y.quiz ?? x.quiz) : (x.quiz ?? y.quiz),
    };
  }
  return out;
}

export function mergeDrills(a = {}, b = {}) {
  const out = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id], y = b[id];
    if (!x || !y) { out[id] = x || y; continue; }
    const newer = num(y.at) >= num(x.at) ? y : x;
    const at = Math.min(num(x.at) || Infinity, num(y.at) || Infinity);
    out[id] = {
      ...newer,
      completed: !!(x.completed || y.completed),
      at: isFinite(at) ? at : newer.at,
      /* Keep whichever reflection was written last, but never lose one to a
         blank — an empty edit should not erase what the other device wrote. */
      reflection: hasText(newer.reflection) ? newer.reflection
                : hasText(x.reflection) ? x.reflection : y.reflection,
    };
  }
  return out;
}

const hasText = r => r && Object.values(r).some(v => typeof v === 'string' && v.trim());

export function mergeReviews(a = {}, b = {}) {
  const out = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id], y = b[id];
    if (!x || !y) { out[id] = x || y; continue; }
    /* The most recent answer holds the correct interval and ease. */
    out[id] = num(y.last) >= num(x.last) ? y : x;
  }
  return out;
}

export function mergeJournal(a = [], b = [], tombstones = {}) {
  const byId = new Map();
  for (const e of [...a, ...b]) {
    const prev = byId.get(e.id);
    if (!prev || num(e.updatedAt ?? e.at) > num(prev.updatedAt ?? prev.at)) byId.set(e.id, e);
  }
  /* A tombstone only wins if the deletion happened after the last edit —
     otherwise editing an entry on device B after deleting it on A would lose
     the edit. */
  for (const [id, deletedAt] of Object.entries(tombstones)) {
    const e = byId.get(id);
    if (e && num(deletedAt) >= num(e.updatedAt ?? e.at)) byId.delete(id);
  }
  return [...byId.values()].sort((x, y) => num(y.at) - num(x.at));
}

export function mergeActivity(a = {}, b = {}) {
  const out = {};
  for (const day of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[day] || {}, y = b[day] || {};
    out[day] = {
      lessons: Math.max(num(x.lessons), num(y.lessons)),
      drills:  Math.max(num(x.drills),  num(y.drills)),
      frames:  Math.max(num(x.frames),  num(y.frames)),
      shot: !!(x.shot || y.shot),
    };
  }
  return out;
}

export function mergeTombstones(a = {}, b = {}) {
  const out = {}, cutoff = Date.now() - TOMBSTONE_TTL;
  for (const [id, ts] of [...Object.entries(a), ...Object.entries(b)]) {
    if (num(ts) < cutoff) continue;                 // long since propagated
    out[id] = Math.max(num(out[id]), num(ts));
  }
  return out;
}

/* Rebuild the streak from merged activity so it can never contradict it. */
export function recomputeStreak(activity = {}, best = 0) {
  const days = Object.entries(activity)
    .filter(([, d]) => d.lessons || d.drills || d.frames || d.shot)
    .map(([k]) => k).sort();
  if (!days.length) return { current: 0, best: num(best), last: null };

  let run = 1, longest = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = (Date.parse(days[i]) - Date.parse(days[i - 1])) / 86400000;
    run = gap === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const last = days.at(-1);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const sinceLast = Math.round((today - Date.parse(last)) / 86400000);
  return {
    current: sinceLast <= 1 ? run : 0,
    best: Math.max(longest, num(best)),
    last,
  };
}

/* ---------- the whole document --------------------------------------------- */

/* What actually travels. Anything device-specific stays behind. */
export function snapshot(s) {
  return {
    v: 1,
    lessons: s.lessons || {},
    drills: s.drills || {},
    reviews: s.reviews || {},
    journal: (s.journal || []).map(stripLocal),
    activity: s.activity || {},
    deleted: s.deleted || {},
    settings: {
      at: num(s.settingsAt),
      profile: s.profile,
      gear: s.gear,
      location: s.location,
    },
  };
}

/* imageId points at this device's IndexedDB and means nothing anywhere else.
   `remote` is the shared handle, so that is what crosses. */
const stripLocal = e => {
  const { imageId, originalId, ...rest } = e;
  return rest;
};

export function mergeState(local, remote) {
  if (!remote || remote.v !== 1) return { state: snapshot(local), changed: true };

  const deleted = mergeTombstones(local.deleted, remote.deleted);
  const activity = mergeActivity(local.activity, remote.activity);
  const localSettingsAt = num(local.settingsAt), remoteSettingsAt = num(remote.settings?.at);
  const settingsFromRemote = remoteSettingsAt > localSettingsAt;

  return {
    state: {
      v: 1,
      lessons: mergeLessons(local.lessons, remote.lessons),
      drills: mergeDrills(local.drills, remote.drills),
      reviews: mergeReviews(local.reviews, remote.reviews),
      journal: mergeJournal((local.journal || []).map(stripLocal), remote.journal, deleted),
      activity,
      deleted,
      settings: settingsFromRemote
        ? remote.settings
        : { at: localSettingsAt, profile: local.profile, gear: local.gear, location: local.location },
    },
    settingsFromRemote,
  };
}

/* Fold a merged document back into the live store, keeping this device's own
   image handles attached to the entries they belong to. */
export function applyMerged(merged, { settingsFromRemote }) {
  store.updateQuietly(s => {
    const localImages = new Map((s.journal || []).map(e => [e.id, { imageId: e.imageId, originalId: e.originalId }]));
    s.lessons = merged.lessons;
    s.drills = merged.drills;
    s.reviews = merged.reviews;
    s.activity = merged.activity;
    s.deleted = merged.deleted;
    s.journal = merged.journal.map(e => ({ ...e, ...(localImages.get(e.id) || {}) }));
    s.streak = recomputeStreak(merged.activity, s.streak?.best);
    if (settingsFromRemote && merged.settings) {
      s.profile = { ...s.profile, ...merged.settings.profile };
      s.gear = merged.settings.gear || s.gear;
      s.location = merged.settings.location ?? s.location;
      s.settingsAt = num(merged.settings.at);
    }
    s.lastSyncAt = Date.now();
  });
}

/* ---------- the round trip -------------------------------------------------- */

let running = false;

export function isAvailable() {
  return sp.isConfigured() && sp.isSignedIn() && sp.config().syncEnabled !== false;
}

export async function syncNow({ silent = false } = {}) {
  if (!isAvailable()) return { skipped: 'not connected' };
  if (running) return { skipped: 'already running' };
  if (!navigator.onLine) return { skipped: 'offline' };
  running = true;
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, etag } = await sp.readJson(STATE_FILE);
      const { state, settingsFromRemote } = mergeState(store.get(), data);
      try {
        await sp.writeJson(STATE_FILE, state, etag);
        /* Re-merge against the store as it is *now*, not as it was when the
           document was computed. A journal entry written while the upload was
           in flight would otherwise be overwritten by the older snapshot.
           Safe because merging is idempotent — the extra entry simply goes up
           on the next sync. */
        const settled = mergeState(store.get(), state);
        applyMerged(settled.state, { settingsFromRemote });
        store.flushWrites();
        announce({ ok: true, at: Date.now() });
        return { ok: true, entries: settled.state.journal.length };
      } catch (e) {
        if (e.message !== 'CONFLICT') throw e;
        /* Another device wrote between our read and our write. Re-read and
           re-merge rather than forcing — the whole point of the ETag. */
      }
    }
    throw new Error('Could not settle with the other device after three tries.');
  } catch (e) {
    if (!silent) announce({ error: e.message });
    return { error: e.message };
  } finally {
    running = false;
  }
}

const announce = detail => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('stops:sync', { detail }));
};

/* Changes arrive in bursts — reading a lesson touches three things — so settle
   before pushing. */
let debounce = null;
export function scheduleSync(delay = 4000) {
  if (!isAvailable()) return;
  clearTimeout(debounce);
  debounce = setTimeout(() => syncNow({ silent: true }), delay);
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => scheduleSync(1500));
  document.addEventListener?.('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleSync(800);
  });
}
