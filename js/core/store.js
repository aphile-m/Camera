/* ==========================================================================
   store.js — everything the app remembers.
   A single observable state object in localStorage, plus an IndexedDB bucket
   for journal photographs (too big for localStorage's ~5MB).
   ========================================================================== */

import { DEFAULT_GEAR } from './photo.js';

/* Imported lazily: sync.js imports this module, so a static import would be a
   cycle. The nudge is fire-and-forget — sync decides whether it is even on. */
let nudge = () => {};
export const setSyncNudge = fn => { nudge = fn; };

const KEY = 'stops.state.v1';
const listeners = new Set();

const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const BLANK = {
  version: 1,
  createdAt: Date.now(),
  onboarded: false,
  profile: { name: '', units: 'metric', theme: 'auto', steadiness: 0 },
  gear: structuredClone(DEFAULT_GEAR),
  /* lessonId -> { read, quiz: {score, total, at}, at } */
  lessons: {},
  /* drillId -> { started, completed, at, reflection } */
  drills: {},
  /* cardId -> { due, interval, ease, reps, lapses } — Leitner/SM-2 hybrid */
  reviews: {},
  journal: [],
  activity: {},          // 'YYYY-MM-DD' -> { lessons, drills, frames, shot }
  streak: { current: 0, best: 0, last: null },
  location: null,        // { lat, lon, label }
  lastRoute: '#/',
  sharepoint: null,      // { clientId, tenant, folder, driveId, enabled, syncEnabled }
  uploadQueue: [],       // pending SharePoint uploads, survives a reload
  deleted: {},           // journal tombstones: id -> deletedAt, so a delete syncs
  settingsAt: 0,         // stamp for last-write-wins on profile/gear/location
  lastSyncAt: 0,
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(BLANK);
    const parsed = JSON.parse(raw);
    return migrate({ ...structuredClone(BLANK), ...parsed });
  } catch {
    return structuredClone(BLANK);
  }
}

const LEGACY_LENS_IDS = ['kit', 'tele', 'prime'];

function migrate(s) {
  s.gear = { ...structuredClone(DEFAULT_GEAR), ...(s.gear || {}) };

  /* The app shipped with a placeholder kit that included a 35mm f/1.8 nobody
     owns. If the stored lenses are still exactly that set, replace them — the
     advisor was giving advice for glass that does not exist. Anything the user
     has since added or edited is left untouched. */
  const ids = (s.gear.lenses || []).map(l => l.id).sort();
  if (ids.length === 3 && ids.every((id, i) => id === [...LEGACY_LENS_IDS].sort()[i])) {
    s.gear.lenses = structuredClone(DEFAULT_GEAR.lenses);
  }
  s.profile = { ...BLANK.profile, ...(s.profile || {}) };
  for (const k of ['lessons', 'drills', 'reviews', 'activity']) s[k] ||= {};
  s.journal ||= [];
  s.uploadQueue ||= [];
  s.deleted ||= {};
  return s;
}

let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Could not save — storage is full or blocked.', e); }
  }, 120);
}

export function get() { return state; }

/* Write through immediately, for the moments where a caller must be able to
   rely on what is on disk — a sync completing, or a test reading it back. */
export function flushWrites() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/* Fields whose last writer wins across devices. Touching any of them stamps
   the settings clock so the merge can order two devices' edits. */
const SETTINGS_KEYS = ['profile', 'gear', 'location'];

let muteNudge = false;
/* Apply changes that came *from* a sync. Without this, folding a merge back
   into the store looks like a local edit and schedules another sync, which
   reads its own write back — harmless but pointless traffic. */
export function updateQuietly(mutator) {
  muteNudge = true;
  try { return update(mutator); } finally { muteNudge = false; }
}

/* Mutate through here so every change notifies and persists exactly once. */
export function update(mutator) {
  const before = SETTINGS_KEYS.map(k => JSON.stringify(state[k]));
  mutator(state);
  if (SETTINGS_KEYS.some((k, i) => JSON.stringify(state[k]) !== before[i])) {
    state.settingsAt = Date.now();
  }
  persist();
  for (const fn of listeners) fn(state);
  if (!muteNudge) nudge();
  return state;
}

export function reset() {
  state = structuredClone(BLANK);
  persist();
  for (const fn of listeners) fn(state);
}

/* ---------- Activity & streak -------------------------------------------- */

export function touch(kind = 'visit', amount = 1) {
  update(s => {
    const key = todayKey();
    const day = (s.activity[key] ||= { lessons: 0, drills: 0, frames: 0, shot: false });
    if (kind === 'lesson') day.lessons += amount;
    if (kind === 'drill')  { day.drills += amount; day.shot = true; }
    if (kind === 'frames') { day.frames += amount; day.shot = true; }

    /* A streak counts days you did something real, not days you opened the app. */
    if (kind === 'visit') return;
    if (s.streak.last === key) return;
    const yesterday = todayKey(new Date(Date.now() - 86400000));
    s.streak.current = s.streak.last === yesterday ? s.streak.current + 1 : 1;
    s.streak.best = Math.max(s.streak.best, s.streak.current);
    s.streak.last = key;
  });
}

/* The streak is stale if the last active day is older than yesterday. */
export function liveStreak() {
  const { last, current } = state.streak;
  if (!last) return 0;
  const y = todayKey(new Date(Date.now() - 86400000));
  return last === todayKey() || last === y ? current : 0;
}

export function activeDays(days = 84) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const k = todayKey(new Date(Date.now() - i * 86400000));
    out.push({ date: k, ...(state.activity[k] || { lessons: 0, drills: 0, frames: 0, shot: false }) });
  }
  return out;
}

/* ---------- Lessons ------------------------------------------------------- */

export const lessonState = id => state.lessons[id] || null;
export const isLessonDone = id => !!state.lessons[id]?.read;

export function markLessonRead(id) {
  if (isLessonDone(id)) return;
  update(s => { s.lessons[id] = { ...(s.lessons[id] || {}), read: true, at: Date.now() }; });
  touch('lesson');
}

export function recordQuiz(lessonId, score, total) {
  update(s => {
    s.lessons[lessonId] = { ...(s.lessons[lessonId] || {}), quiz: { score, total, at: Date.now() } };
  });
  /* Sitting a quiz is real work, so it counts towards the day even when the
     lesson itself was read earlier. `touch` already dedupes the streak. */
  touch('lesson');
}

/* ---------- Drills -------------------------------------------------------- */

export const drillState = id => state.drills[id] || null;

export function completeDrill(id, reflection = {}) {
  update(s => { s.drills[id] = { completed: true, at: Date.now(), reflection }; });
  touch('drill');
}

/* ---------- Spaced review ------------------------------------------------- */
/*  A trimmed SM-2. Getting something right pushes it further away; getting it
    wrong brings it back tomorrow. The point is that the ideas from lesson 3
    are still there when you need them in lesson 19.                          */

const DAY = 86400000;

export function scheduleCard(id, correct) {
  update(s => {
    const c = s.reviews[id] || { interval: 0, ease: 2.5, reps: 0, lapses: 0 };
    if (correct) {
      c.reps += 1;
      c.interval = c.reps === 1 ? 1 : c.reps === 2 ? 4 : Math.round(c.interval * c.ease);
      c.ease = Math.min(2.8, c.ease + 0.05);
    } else {
      c.reps = 0; c.lapses += 1; c.interval = 1;
      c.ease = Math.max(1.4, c.ease - 0.2);
    }
    c.due = Date.now() + c.interval * DAY;
    c.last = Date.now();
    s.reviews[id] = c;
  });
}

export function dueCards() {
  const now = Date.now();
  return Object.entries(state.reviews)
    .filter(([, c]) => c.due <= now)
    .map(([id]) => id);
}

/* ---------- Journal ------------------------------------------------------- */

export function addEntry(entry) {
  const now = Date.now();
  const record = { id: uid(), at: now, updatedAt: now, ...entry };
  update(s => { s.journal.unshift(record); });
  touch('frames', entry.frames || 1);
  return record;
}

export function updateEntry(id, patch) {
  update(s => {
    const i = s.journal.findIndex(e => e.id === id);
    if (i >= 0) s.journal[i] = { ...s.journal[i], ...patch, updatedAt: Date.now() };
  });
}

export function deleteEntry(id) {
  const entry = state.journal.find(e => e.id === id);
  update(s => {
    s.journal = s.journal.filter(e => e.id !== id);
    /* A tombstone, so the other device deletes it too rather than pushing it
       back on the next merge. */
    s.deleted = { ...s.deleted, [id]: Date.now() };
  });
  if (entry?.imageId) deleteImage(entry.imageId).catch(() => {});
  if (entry?.originalId) deleteImage(entry.originalId).catch(() => {});
}

/* ---------- Images (IndexedDB) -------------------------------------------- */

const DB_NAME = 'stops.images', STORE = 'images';
let dbPromise = null;

function db() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

const tx = async (mode, fn) => {
  const d = await db();
  return new Promise((resolve, reject) => {
    const t = d.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const putImage    = (id, blob) => tx('readwrite', s => s.put(blob, id));
export const getImage    = id         => tx('readonly',  s => s.get(id));
export const deleteImage = id         => tx('readwrite', s => s.delete(id));

/* Two copies with different jobs: a downscaled thumbnail that lives on the
   device forever and works offline, and — when cloud sync is on — the original
   file, held only until it has been uploaded and then discarded locally. */
export async function storeImageFile(file, { maxEdge = 1400, keepOriginal = false } = {}) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.82));

  const id = uid();
  await putImage(id, blob);

  let originalId = null;
  if (keepOriginal) {
    originalId = uid();
    await putImage(originalId, file);
  }
  return { id, originalId, width: w, height: h, originalName: file.name, originalSize: file.size };
}

/* ---------- Export / import ----------------------------------------------- */

export function exportJSON() {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('That file is not a Stops backup.');
  state = migrate({ ...structuredClone(BLANK), ...parsed });
  persist();
  for (const fn of listeners) fn(state);
}
