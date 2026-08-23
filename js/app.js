/* ==========================================================================
   app.js — shell, router, onboarding.
   ========================================================================== */

import { h, mount, $, toast, sheet } from './ui/dom.js';
import { icon } from './ui/icons.js';
import { Card, Note, Seg, Chips } from './ui/parts.js';
import { dismissSplash, transition, reducedMotion } from './ui/motion.js';
import * as store from './core/store.js';
import * as P from './core/photo.js';
import * as sp from './core/sharepoint.js';
import * as sync from './core/sync.js';

import { HomeView } from './views/home.js';
import { LearnView, LessonView } from './views/learn.js';
import { lessonById, drillById } from './data/curriculum.js';
import { PracticeView, DrillView, ReviewView } from './views/practice.js';
import { TOOLS, ToolsView, AdvisorView, SimulatorView, DofView, LightView, LongExposureView, TimelapseView, ReferenceView } from './views/tools.js';
import { JournalView, JournalEntryView } from './views/journal.js';
import { SettingsView, applyTheme } from './views/settings.js';

const NAV = [
  { href: '#/',         label: 'Today',    icon: 'home' },
  { href: '#/learn',    label: 'Learn',    icon: 'learn' },
  { href: '#/practice', label: 'Practice', icon: 'practice' },
  { href: '#/tools',    label: 'Tools',    icon: 'tools' },
  { href: '#/journal',  label: 'Journal',  icon: 'journal' },
];

const TITLES = {
  '': 'Today', learn: 'The path', practice: 'Practice', tools: 'Tools',
  journal: 'Journal', settings: 'Settings', review: 'Review',
};

/* The bar should name the page you are on, not merely the section. */
function pageTitle(route) {
  const { section, param } = route;
  if (section === 'lesson') return lessonById(param)?.title || 'Lesson';
  if (section === 'drill')  return drillById(param)?.title || 'Drill';
  if (section === 'tools' && param) return TOOLS.find(t => t.id === param)?.title || 'Tools';
  if (section === 'journal' && param) return param === 'new' ? 'Log a frame' : 'Entry';
  return TITLES[section] ?? 'Stops';
}

/* ---------- Router --------------------------------------------------------- */

function parseRoute() {
  const raw = (location.hash || '#/').slice(2).split('?')[0];
  const [section, ...rest] = raw.split('/').filter(Boolean);
  return { section: section || '', param: rest[0] || null, rest };
}

function renderRoute(state, route, rerender) {
  const { section, param } = route;
  switch (section) {
    case '':         return HomeView(state, rerender);
    case 'learn':    return LearnView(state);
    case 'lesson':   return LessonView(state, param, rerender);
    case 'practice': return PracticeView(state, rerender);
    case 'drill':    return DrillView(state, param, rerender);
    case 'review':   return ReviewView(state, rerender);
    case 'journal':  return param ? JournalEntryView(state, param, rerender) : JournalView(state, rerender);
    case 'settings': return SettingsView(state, rerender);
    case 'tools':
      switch (param) {
        case 'advisor':   return AdvisorView(state, rerender);
        case 'simulator': return SimulatorView(state, rerender);
        case 'dof':       return DofView(state, rerender);
        case 'light':     return LightView(state, rerender);
        case 'long':      return LongExposureView(state, rerender);
        case 'timelapse': return TimelapseView(state, rerender);
        case 'reference': return ReferenceView(state, rerender);
        default:          return ToolsView(state);
      }
    default:
      return h('div', {},
        h('h1', { style: { marginTop: '20px' } }, 'Nothing here'),
        h('p', { class: 'lede', style: { margin: '10px 0 20px' } }, 'That page does not exist.'),
        h('a.btn.btn-primary', { href: '#/' }, 'Back to today'));
  }
}

/* ---------- Shell ---------------------------------------------------------- */

function Shell() {
  const main = h('main', {});
  const titleEl = h('div.topbar-title', {});
  const nav = h('nav.nav', { 'aria-label': 'Sections' },
    ...NAV.map(n => h('a', { href: n.href }, icon(n.icon, 21), h('span', {}, n.label))));

  const topbar = h('header.topbar', {},
    h('a', { href: '#/', 'aria-label': 'Today', style: { display: 'flex', flex: 'none' } }, h('div.mark')),
    titleEl,
    h('a.btn.btn-ghost.btn-sm', { href: '#/settings', 'aria-label': 'Settings' }, icon('settings', 19)));

  let lastRouteKey = null;

  const rerender = () => {
    const state = store.get();
    const route = parseRoute();
    const section = route.section;
    /* A background sync re-renders this view in place. Only a real navigation
       should move the page — otherwise scrolling Settings gets yanked back to
       the top every time a sync lands. */
    const routeKey = `${section}/${route.param || ''}`;
    const navigated = routeKey !== lastRouteKey;
    lastRouteKey = routeKey;
    const keepScroll = navigated ? 0 : window.scrollY;

    /* Highlight the nav item, including for nested routes */
    const activeHref = section === 'lesson' ? '#/learn'
      : section === 'drill' || section === 'review' ? '#/practice'
      : `#/${section}`;
    for (const a of nav.children) {
      const on = a.getAttribute('href') === activeHref || (activeHref === '#/' && a.getAttribute('href') === '#/');
      a.toggleAttribute('aria-current', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    }

    mount(titleEl,
      h('div.eyebrow', {}, 'Stops'),
      h('div', { style: { fontFamily: 'var(--serif)', fontWeight: '600', fontSize: '16px' } },
        pageTitle(route)));

    main.className = ['tools', 'journal'].includes(section) ? 'wide' : '';
    transition(() => mount(main, renderRoute(state, route, rerender)));
    if (navigated) {
      main.scrollTop = 0;
      if (!location.hash.includes('?')) window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (keepScroll) {
      window.scrollTo({ top: keepScroll, behavior: 'instant' });
    }
    store.update(s => { s.lastRoute = location.hash; });
  };

  window.addEventListener('hashchange', rerender);

  /* A background upload finishing changes what Journal and Settings should
     show. Re-render those, but never while a form is open — that would throw
     away whatever the user is halfway through typing. */
  window.addEventListener('stops:sync', () => {
    const { section, param } = parseRoute();
    const isForm = section === 'journal' && param;
    /* Never redraw under someone's fingers: a focused field, or an open
       disclosure, means they are in the middle of something. */
    const busy = main.contains(document.activeElement)
      || main.querySelector('details[open]') !== null;
    if (busy || isForm) return;
    if (section === 'journal' || section === 'settings') rerender();
  });

  return { node: h('div', { id: 'app' }, topbar, main, nav), rerender };
}

/* ---------- Onboarding ------------------------------------------------------ */

function onboard(rerender) {
  const draft = { name: '', sensor: 'apsc', body: 'Nikon D5300' };

  const nameInput = h('input', { type: 'text', placeholder: 'Optional', onInput: e => { draft.name = e.target.value; } });
  const bodyInput = h('input', { type: 'text', onInput: e => { draft.body = e.target.value; } });
  bodyInput.value = draft.body;

  const close = sheet('Before you start', h('div.stack', {},
    h('p', { class: 'small' },
      'Stops works out exposure, depth of field and star-trail limits from your actual camera, so two answers make everything afterwards accurate. You can change both later.'),
    h('label.field', {}, h('span.lab', {}, 'What should it call you'), nameInput),
    h('label.field', {}, h('span.lab', {}, 'Camera body'), bodyInput),
    h('div', {},
      h('span.eyebrow', { style: { display: 'block', marginBottom: '8px' } }, 'Sensor size'),
      Chips(Object.entries(P.SENSORS).map(([id, v]) => ({ id, label: v.label })), draft.sensor,
        v => { draft.sensor = v; })),
    Note('info', 'Nothing is uploaded and there is no account. Everything stays in this browser, and Settings has a backup you can export.'),
    h('button.btn.btn-primary.btn-block', { onClick: () => {
      store.update(s => {
        s.onboarded = true;
        s.profile.name = draft.name.trim();
        s.gear.body = draft.body.trim() || 'Camera';
        s.gear.sensor = draft.sensor;
      });
      close(); rerender();
    } }, 'Start at level one')));
}

/* ---------- Boot ------------------------------------------------------------ */

async function boot() {
  const state = store.get();
  applyTheme(state.profile.theme || 'auto');

  /* If we have just come back from a Microsoft sign-in, finish it before the
     first render so Settings shows the connected state straight away. */
  let authMessage = null;
  if (location.search.includes('code=') || location.search.includes('error=')) {
    try {
      if (await sp.completeSignIn()) authMessage = 'Connected to Microsoft';
    } catch (e) { authMessage = e.message; }
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(store.get().profile.theme || 'auto'));

  if (!location.hash) location.hash = '#/';

  const { node, rerender } = Shell();
  /* Keep the splash: replaceChildren would take it with everything else, and
     the launch animation would never be seen. */
  const splash = document.getElementById('splash');
  document.body.replaceChildren(...(splash ? [splash] : []), node);
  rerender();
  dismissSplash();
  store.touch('visit');

  if (authMessage) { toast(authMessage); rerender(); }
  /* Let the launch animation finish before asking anything. */
  if (!state.onboarded) setTimeout(() => onboard(rerender), reducedMotion() ? 0 : 1500);

  /* Anything queued while offline goes up now, and progress reconciles with
     whatever the other device did. */
  sp.flush().catch(() => {});
  store.setSyncNudge(() => sync.scheduleSync());
  sync.syncNow({ silent: true }).then(r => { if (r?.ok) rerender(); });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
}

boot();
