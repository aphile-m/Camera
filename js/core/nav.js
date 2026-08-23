/* ==========================================================================
   nav.js — routing, and one definition of what "back" means.

   Back has to answer the same question in three places: the browser's back
   button, the Android hardware button, and the app's own "up" affordances.
   Answering it three times is how they drift, so it is answered once here.

   The rule, in order:
     1. an open sheet swallows it and closes           (you are in a layer)
     2. history we ourselves pushed is popped          (you came from somewhere)
     3. otherwise go up a level: lesson -> the path    (you arrived by deep link)
     4. at Today with nothing behind it, back leaves   (the app may exit)
   ========================================================================== */

/* Every entry we create is stamped with its depth. A plain counter would lie
   after a reload or a restore from bfcache; history.state travels with the
   entry, so it still tells the truth. */
const KEY = 'stopsDepth';
let current = 0;

export function parseRoute() {
  const raw = (location.hash || '#/').slice(2).split('?')[0];
  const [section, ...rest] = raw.split('/').filter(Boolean);
  return { section: section || '', param: rest[0] || null, rest };
}

/* How deep into the app this entry is. 0 means the entry we launched on:
   going back from there leaves the app, so we must not. */
export function depth() {
  const d = history.state?.[KEY];
  return Number.isInteger(d) ? d : current;
}

function stamp(d, url) {
  const state = { ...(history.state || {}), [KEY]: d };
  if (url === undefined) history.replaceState(state, '');
  else history.replaceState(state, '', url);
  current = d;
}

/* Called on every hash change, ours or the browser's. An entry that already
   carries a depth is one we are returning to; an unstamped one is new. */
function track() {
  const d = history.state?.[KEY];
  if (Number.isInteger(d)) current = d;
  else stamp(current + 1);
}

/* ---------- Layers ---------------------------------------------------------
   A sheet is not a page, so it must not be a history entry — pushing one would
   put a phantom stop in the trail that forward-navigation could resurrect on
   an empty screen. It registers here instead, and back closes it. */
const layers = [];

export function pushLayer(close) {
  const layer = { close };
  layers.push(layer);
  /* Returned so a sheet closed by any other means drops out of the stack. */
  return () => { const i = layers.indexOf(layer); if (i >= 0) layers.splice(i, 1); };
}

/* ---------- Up -------------------------------------------------------------
   Where a screen sits in the app, for when there is no history to pop. Opening
   a lesson from a notification or a shared link still needs a way out that is
   not "quit the app". */
export function parentOf({ section, param } = parseRoute()) {
  if (section === 'lesson') return '#/learn';
  if (section === 'drill' || section === 'review') return '#/practice';
  if (section === 'journal' && param) return '#/journal';
  if (section === 'tools' && param) return '#/tools';
  if (section === '') return null;
  return '#/';
}

/* ---------- Navigation ------------------------------------------------------ */

/* replace: true for a screen that should not be revisitable — the form you
   just saved, the entry you just deleted. Back should skip straight past it. */
export function go(hash, { replace = false } = {}) {
  if (hash === location.hash) return;
  if (replace) {
    stamp(current, hash);
    /* replaceState is silent, so nothing would repaint without this. */
    window.dispatchEvent(new Event('hashchange'));
  } else {
    location.hash = hash;
  }
}

/* Returns false when back has nowhere left to go, so a native caller knows it
   is now free to close the app. */
export function back() {
  if (layers.length) { layers.pop().close(); return true; }
  if (depth() > 0) { history.back(); return true; }
  const up = parentOf(parseRoute());
  /* Replace, so repeated presses walk up the tree instead of growing it. */
  if (up) { go(up, { replace: true }); return true; }
  return false;
}

/* ---------- Boot ------------------------------------------------------------ */

export function init() {
  window.addEventListener('hashchange', track);
  /* The entry we launched on. Without a hash the browser has not made one, so
     write it in place rather than pushing — otherwise the very first back goes
     to a hashless URL that immediately redirects here again, and back looks
     broken because nothing moves. */
  if (!location.hash) stamp(0, '#/');
  else stamp(0);
}
