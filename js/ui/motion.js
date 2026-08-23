/* ==========================================================================
   motion.js — the launch sequence, view transitions and small celebrations.

   Kept in one place so the timings stay consistent, and so every one of them
   can be switched off together for anyone who asks not to see motion.
   ========================================================================== */

import { h } from './dom.js';
import { icon } from './icons.js';

export const reducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Launch ---------------------------------------------------------- */

let splashDone = false;

/* Hold the splash long enough for the blades to finish opening, but never
   long enough to feel like a wait. */
export function dismissSplash({ minimum = 1150 } = {}) {
  if (splashDone) return;
  splashDone = true;
  const el = document.getElementById('splash');
  if (!el) return;
  const wait = reducedMotion() ? 0 : Math.max(0, minimum - performance.now());
  setTimeout(() => {
    el.classList.add('done');
    setTimeout(() => el.remove(), 500);
  }, wait);
}

/* ---------- View transitions -------------------------------------------------- */

/* The platform does this properly where it exists; elsewhere the CSS
   arrival animations carry it, which is why this degrades to just calling the
   swap. */
export function transition(swap) {
  if (reducedMotion() || !document.startViewTransition) { swap(); return; }
  try { document.startViewTransition(swap); } catch { swap(); }
}

/* ---------- Numbers that arrive ----------------------------------------------- */

export function countUp(el, to, { duration = 750, format = n => String(Math.round(n)) } = {}) {
  if (reducedMotion() || to === 0) { el.textContent = format(to); return; }
  const from = 0, start = performance.now();
  const step = now => {
    const t = Math.min(1, (now - start) / duration);
    /* ease-out cubic: fast to begin, settles rather than stops */
    el.textContent = format(from + (to - from) * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Celebration -------------------------------------------------------- */

let celebrating = false;

/* Used when something is actually finished — a lesson read, a drill shot, a
   level completed. Deliberately rare: a reward that fires constantly is just
   an interruption. */
export function celebrate(message, { iconName = 'check', haptic = true } = {}) {
  if (celebrating) return;
  celebrating = true;

  if (haptic && navigator.vibrate && !reducedMotion()) navigator.vibrate([12, 40, 18]);

  const node = h('div', { id: 'celebrate' },
    h('div.burst', {},
      ...(reducedMotion() ? [] : [h('div.ring-pulse'), h('div.ring-pulse'), h('div.ring-pulse')]),
      h('div.msg', {}, icon(iconName, 18), message)));

  document.body.appendChild(node);
  setTimeout(() => {
    node.classList.add('out');
    setTimeout(() => { node.remove(); celebrating = false; }, 280);
  }, reducedMotion() ? 900 : 1500);
}

/* ---------- Level colour ------------------------------------------------------- */

export const levelTone = level => `var(--lv-${Math.min(Math.max(level, 1), 7)})`;
