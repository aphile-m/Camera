/* ==========================================================================
   home.js — Today.
   What to do next, what the light is doing, and how the habit is holding.
   ========================================================================== */

import { h, toast } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { Section, Card, Note, Bar, Ring, Empty } from '../ui/parts.js';
import * as store from '../core/store.js';
import { LESSONS, LEVELS, lessonById, drillById, CARDS } from '../data/curriculum.js';
import { sunTimes, lightNow, lightById, advise, fmtAperture, fmtShutter, fmtISO } from '../core/photo.js';
import { fmtTime } from '../ui/dom.js';

/* The next thing to do: first unread lesson, or a drill you started and left. */
export function nextStep(state) {
  const openDrill = LESSONS.find(l => state.lessons[l.id]?.read && l.drill && !state.drills[l.drill.id]?.completed);
  const nextLesson = LESSONS.find(l => !state.lessons[l.id]?.read);
  if (openDrill && nextLesson && LESSONS.indexOf(openDrill) < LESSONS.indexOf(nextLesson) - 1) {
    return { kind: 'drill', lesson: openDrill, drill: openDrill.drill };
  }
  if (nextLesson) return { kind: 'lesson', lesson: nextLesson };
  if (openDrill) return { kind: 'drill', lesson: openDrill, drill: openDrill.drill };
  return { kind: 'done' };
}

function GreetingLine(state) {
  const hour = new Date().getHours();
  const part = hour < 5 ? 'Still up' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = state.profile.name?.trim();
  return name ? `${part}, ${name}.` : `${part}.`;
}

function NextCard(state) {
  const step = nextStep(state);
  if (step.kind === 'done') {
    return Card(
      h('div.eyebrow', {}, 'The path'),
      h('h2', { style: { margin: '8px 0 6px' } }, 'You have been through all of it.'),
      h('p', { class: 'small' }, 'Now the work is repetition. Keep a project running, keep the journal honest, and let the review questions come back to you.'),
      h('a.btn.btn-primary.btn-block', { href: '#/practice', style: { marginTop: '14px' } }, 'Go to practice'));
  }
  const l = step.lesson;
  const level = LEVELS.find(v => v.id === l.level);
  const isDrill = step.kind === 'drill';
  return Card(
    h('div.row-between', {},
      h('div.eyebrow', {}, isDrill ? 'Unfinished drill' : `Level ${l.level} · ${level.name}`),
      h('div.tiny', {}, isDrill ? `${step.drill.frames || '—'} frames` : `${l.minutes} min`)),
    h('h2', { style: { margin: '9px 0 6px' } }, isDrill ? step.drill.title : l.title),
    h('p', { class: 'small' }, isDrill ? step.drill.brief : l.sub),
    h('a.btn.btn-primary.btn-block', {
      href: isDrill ? `#/drill/${step.drill.id}` : `#/lesson/${l.id}`,
      style: { marginTop: '15px' },
    }, isDrill ? 'Open the drill' : 'Start the lesson'));
}

function ProgressCard(state) {
  const done = LESSONS.filter(l => state.lessons[l.id]?.read).length;
  const drills = Object.values(state.drills).filter(d => d.completed).length;
  const streak = store.liveStreak();
  const pct = (done / LESSONS.length) * 100;

  const days = store.activeDays(35);
  const heat = h('div.heat', { style: { gridTemplateRows: 'repeat(7, 1fr)' } },
    ...days.map(d => {
      const v = d.shot ? (d.drills ? 3 : 2) : d.lessons ? 1 : 0;
      return h('i', { 'data-v': String(v), title: `${d.date}: ${d.lessons} lessons, ${d.drills} drills` });
    }));

  return Card(
    h('div.row', { style: { gap: '16px' } },
      Ring(pct, `${done}`),
      h('div.grow', {},
        h('div', { style: { fontWeight: '600', fontSize: '15px' } }, `${done} of ${LESSONS.length} lessons`),
        h('div.tiny', { style: { marginTop: '2px' } }, `${drills} drills shot · ${streak} day streak${state.streak.best > streak ? ` · best ${state.streak.best}` : ''}`)),
      streak > 0 ? h('div', { style: { color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' } },
        icon('flame', 19), h('span', { class: 'num', style: { fontWeight: '600' } }, String(streak))) : null),
    h('div', { style: { marginTop: '15px' } }, Bar(pct)),
    h('div', { style: { marginTop: '15px', overflowX: 'auto' } }, heat),
    h('div.tiny', { style: { marginTop: '7px' } }, 'Last five weeks. A day counts when you read a lesson or shoot a drill.'));
}

function LightCard(state) {
  const loc = state.location;
  if (!loc) {
    return Card(
      h('div.eyebrow', {}, 'The light today'),
      h('p', { class: 'small', style: { margin: '9px 0 13px' } },
        'Golden hour and blue hour move with the season and with where you are. Share your location once and this becomes a daily timetable — it is stored on this device and never sent anywhere.'),
      h('button.btn.btn-block', {
        onClick: e => {
          const btn = e.currentTarget;
          btn.textContent = 'Locating…'; btn.disabled = true;
          navigator.geolocation?.getCurrentPosition(
            pos => {
              store.update(s => { s.location = { lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'This device' }; });
              toast('Location saved');
            },
            () => { btn.textContent = 'Could not get location'; btn.disabled = false; toast('Location unavailable — you can set it in Settings'); },
            { timeout: 8000 });
        },
      }, icon('compass', 17), 'Use my location'));
  }

  const now = new Date();
  const t = sunTimes(now, loc.lat, loc.lon);
  const light = lightNow(now, loc.lat, loc.lon);
  const upcoming = [
    ['Sunrise', t.sunrise], ['Golden hour ends', t.goldenHourEnd],
    ['Golden hour', t.goldenHour], ['Sunset', t.sunset], ['Blue hour', t.blueHour], ['Dark', t.dusk],
  ].filter(([, d]) => d && d > now).slice(0, 3);

  return Card(
    h('div.row-between', {},
      h('div.eyebrow', {}, 'The light right now'),
      h('div.tiny', {}, `EV ${light.ev}`)),
    h('div.row', { style: { gap: '11px', margin: '11px 0 4px' } },
      h('div', { style: { color: 'var(--accent)' } }, icon(light.ev > 8 ? 'sun' : 'moon', 24)),
      h('div.grow', {}, h('div', { style: { fontWeight: '600', fontSize: '16px' } }, light.label))),
    h('p', { class: 'small', style: { marginTop: '6px' } }, light.advice),
    upcoming.length ? h('div.kv', { style: { marginTop: '14px' } },
      ...upcoming.map(([k, d]) => h('div', {},
        h('div.k', {}, k),
        h('div.v', { class: 'num' }, fmtTime(d))))) : null,
    h('a.btn.btn-sm.btn-ghost', { href: '#/tools/light', style: { marginTop: '10px' } }, 'Full timetable'));
}

function ReviewCard(state) {
  const due = store.dueCards();
  if (!due.length) return null;
  return Card(
    h('div.row-between', {},
      h('div', {},
        h('div.eyebrow', {}, 'Spaced review'),
        h('div', { style: { fontWeight: '600', marginTop: '6px' } }, `${due.length} question${due.length > 1 ? 's' : ''} due`),
        h('div.tiny', { style: { marginTop: '2px' } }, 'Two minutes. Ideas from early lessons, back before you forget them.')),
      h('a.btn.btn-sm.btn-primary', { href: '#/review' }, 'Review')));
}

/* A single, well-argued suggestion for what to shoot in the light you have. */
function SuggestionCard(state) {
  const loc = state.location;
  const ev = loc ? lightNow(new Date(), loc.lat, loc.lon).ev : 12;
  const gear = state.gear;
  const picks = ev >= 13
    ? { intent: 'sharp_all', motion: 'static', focal: 18, text: 'Hard light suits texture, shadow and geometry far better than faces. Shoot shapes today.' }
    : ev >= 9
    ? { intent: 'isolate', motion: 'gentle', focal: 50, text: 'This is portrait light. Find a person, put the sun behind them, and expose for the face.' }
    : ev >= 5
    ? { intent: 'lowlight', motion: 'walking', focal: 35, text: 'Interior and window light. Work close to a window and keep the other lights off.' }
    : { intent: 'longexp', motion: 'vehicle', focal: 18, text: 'Tripod weather. Long exposures turn traffic into ribbons and empty a busy street.' };
  /* Pick the lens that covers this focal length and opens widest — which is
     what you would actually reach into the bag for. */
  const lens = gear.lenses
    .filter(l => picks.focal >= l.min && picks.focal <= l.max)
    .sort((a, b) => a.wideAperture - b.wideAperture)[0] || gear.lenses[0];
  const focal = Math.min(Math.max(picks.focal, lens.min), lens.max);
  const r = advise({ ev, motion: picks.motion, intent: picks.intent, focal, lens, gear, tripod: picks.intent === 'longexp' });

  return Card(
    h('div.eyebrow', {}, 'If you go out now'),
    h('p', { class: 'small', style: { margin: '9px 0 13px' } }, picks.text),
    h('div.row', { style: { gap: '18px', fontFamily: 'var(--mono)', fontSize: '15px', flexWrap: 'wrap' } },
      h('span', { style: { color: 'var(--accent)' } }, fmtAperture(r.aperture)),
      h('span', { style: { color: 'var(--cyan)' } }, fmtShutter(r.shutter)),
      h('span', {}, `ISO ${fmtISO(r.iso)}`),
      h('span', { class: 'tiny', style: { marginLeft: 'auto', alignSelf: 'center' } }, `${focal}mm · ${r.mode} mode`)),
    h('a.btn.btn-sm.btn-ghost', { href: '#/tools/advisor', style: { marginTop: '12px' } }, 'Work it out properly'));
}

export function HomeView(state) {
  return h('div.stack-lg', { class: 'enter' },
    h('div', {},
      h('h1', { style: { marginTop: '6px' } }, GreetingLine(state)),
      h('p', { class: 'lede', style: { marginTop: '6px' } },
        'Read one thing, then go and shoot it. The reading is the smaller half.')),
    NextCard(state),
    ReviewCard(state),
    LightCard(state),
    SuggestionCard(state),
    ProgressCard(state));
}
