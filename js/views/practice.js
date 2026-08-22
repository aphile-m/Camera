/* ==========================================================================
   practice.js — the drills, and the spaced review that keeps ideas alive.
   ========================================================================== */

import { h, toast } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { Section, Card, Note, Bar, Bullets, Empty, Seg } from '../ui/parts.js';
import * as store from '../core/store.js';
import { LESSONS, LEVELS, DRILLS, drillById, lessonById, cardById } from '../data/curriculum.js';

/* ---------- Drill index --------------------------------------------------- */

export function PracticeView(state, rerender) {
  const doneCount = DRILLS.filter(d => state.drills[d.id]?.completed).length;
  const due = store.dueCards();
  const filter = state.__practiceFilter || 'available';

  const available = DRILLS.filter(d => state.lessons[d.lessonId]?.read);
  const list = filter === 'all' ? DRILLS
    : filter === 'done' ? DRILLS.filter(d => state.drills[d.id]?.completed)
    : available.filter(d => !state.drills[d.id]?.completed);

  return h('div.stack-lg', { class: 'enter' },
    h('div', {},
      h('h1', { style: { marginTop: '6px' } }, 'Practice'),
      h('p', { class: 'lede', style: { marginTop: '6px' } },
        'Every lesson ends in something you have to go outside and shoot. This is where the improvement actually happens.'),
      h('div', { style: { marginTop: '16px' } }, Bar((doneCount / DRILLS.length) * 100)),
      h('div.tiny', { style: { marginTop: '7px' } }, `${doneCount} of ${DRILLS.length} drills shot`)),

    due.length ? Card(
      h('div.row-between', {},
        h('div', {},
          h('div.eyebrow', {}, 'Spaced review'),
          h('div', { style: { fontWeight: '600', marginTop: '6px' } }, `${due.length} question${due.length > 1 ? 's' : ''} due today`),
          h('div.tiny', { style: { marginTop: '2px' } }, 'Questions return at widening intervals so the ideas stay available.')),
        h('a.btn.btn-sm.btn-primary', { href: '#/review' }, 'Start'))) : null,

    h('div', {},
      Seg([{ id: 'available', label: 'Ready' }, { id: 'done', label: 'Shot' }, { id: 'all', label: 'All' }],
        filter, v => { state.__practiceFilter = v; rerender(); }),

      list.length ? h('div.card.flush', { style: { marginTop: '14px' } }, ...list.map(d => {
        const lesson = lessonById(d.lessonId);
        const isDone = !!state.drills[d.id]?.completed;
        const locked = !state.lessons[d.lessonId]?.read;
        return h('a.lesson-row', { class: isDone ? 'done' : '', href: `#/drill/${d.id}` },
          h('span.idx', {}, isDone ? '✓' : locked ? '·' : String(d.level)),
          h('span.grow', {},
            h('span.t', { style: { display: 'block' } }, d.title),
            h('span.s', { style: { display: 'block' } },
              `${lesson.title}${d.frames ? ` · ${d.frames} frames` : ''}`)),
          icon('chevron', 16));
      }))
      : h('div', { style: { marginTop: '14px' } },
          Empty('practice', filter === 'available'
            ? 'No drills unlocked yet. Read a lesson and its drill appears here.'
            : filter === 'done' ? 'Nothing shot yet. Pick a drill and go outside.' : 'Nothing here.'))));
}

/* ---------- One drill ------------------------------------------------------ */

export function DrillView(state, id, rerender) {
  const d = drillById(id);
  if (!d) return Empty('practice', 'That drill does not exist.');
  const lesson = lessonById(d.lessonId);
  const record = state.drills[d.id];

  const reflection = { ...(record?.reflection || {}) };

  const reflectFields = h('div.stack', {}, ...(d.reflect || []).map((q, i) => {
    const ta = h('textarea', {
      placeholder: 'Your answer…',
      onInput: e => { reflection[`q${i}`] = e.target.value; },
    });
    ta.value = reflection[`q${i}`] || '';
    return h('label.field', {}, h('span.lab', {}, q), ta);
  }));

  return h('div.stack-lg', { class: 'enter' },
    h('div', {},
      h('a.btn.btn-ghost.btn-sm', { href: '#/practice', style: { marginLeft: '-8px' } }, icon('back', 16), 'Practice'),
      h('div.eyebrow', { style: { marginTop: '12px' } },
        `Level ${d.level} · field drill${d.frames ? ` · ${d.frames} frames` : ''}`),
      h('h1', { style: { margin: '8px 0 6px' } }, d.title),
      h('p', { class: 'lede' }, d.brief)),

    record?.completed ? Note('good', `Shot ${new Date(record.at).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}. Doing it again with a different subject is never wasted.`) : null,

    Section('The constraints', Card(Bullets(d.constraints, 'accent'))),
    Section('You have done it when', Card(Bullets(d.success, 'green'))),

    d.reflect?.length ? Section('Afterwards', Card(
      h('p', { class: 'small', style: { marginBottom: '14px' } },
        'Answer these while the shoot is still fresh. This is the part that turns shooting into learning.'),
      reflectFields)) : null,

    Section(null,
      h('div.row', { style: { gap: '10px' } },
        h('button.btn.btn-primary', { style: { flex: '1' }, onClick: () => {
          store.completeDrill(d.id, reflection);
          toast('Drill logged — nice work');
          location.hash = '#/practice';
        } }, record?.completed ? 'Save and close' : 'Mark as shot'),
        h('a.btn', { href: `#/journal/new?drill=${d.id}`, style: { flex: 'none' } }, icon('plus', 16), 'Journal'))),

    h('div', { style: { marginTop: '10px' } },
      h('a.btn.btn-ghost.btn-sm', { href: `#/lesson/${lesson.id}` }, 'Reread ', lesson.title)));
}

/* ---------- Spaced review session ------------------------------------------ */

export function ReviewView(state, rerender) {
  const due = store.dueCards().map(cardById).filter(Boolean);
  if (!due.length) {
    return h('div.stack-lg', { class: 'enter' },
      h('h1', { style: { marginTop: '6px' } }, 'Review'),
      Empty('good', 'Nothing due right now. Questions come back at widening intervals — a day, then four, then longer each time you get them right.'),
      h('a.btn.btn-block', { href: '#/practice' }, 'Back to practice'));
  }

  let i = 0, right = 0;
  const wrap = h('div.stack-lg', { class: 'enter' });

  const render = () => {
    wrap.replaceChildren();
    if (i >= due.length) {
      wrap.append(
        h('h1', { style: { marginTop: '6px' } }, 'Done'),
        Note(right === due.length ? 'good' : 'info',
          `${right} of ${due.length} correct. Anything you missed comes back tomorrow; the rest moves further out.`),
        h('a.btn.btn-primary.btn-block', { href: '#/practice' }, 'Back to practice'));
      return;
    }

    const c = due[i];
    const lesson = lessonById(c.lessonId);
    let chosen = null;

    const answers = h('div.stack-sm', {}, ...c.a.map((text, ai) =>
      h('button.answer', {
        onClick: e => {
          if (chosen !== null) return;
          chosen = ai;
          const correct = ai === c.correct;
          if (correct) right++;
          store.scheduleCard(c.id, correct);
          [...answers.children].forEach((btn, bi) => {
            btn.disabled = true;
            if (bi === c.correct) btn.classList.add('correct');
            else if (bi === ai) btn.classList.add('wrong');
          });
          footer.replaceChildren(
            Note(correct ? 'good' : 'info', c.why),
            h('button.btn.btn-primary.btn-block', { style: { marginTop: '12px' }, onClick: () => { i++; render(); } },
              i + 1 < due.length ? 'Next question' : 'Finish'));
        },
      }, text)));

    const footer = h('div', {});

    wrap.append(
      h('div', {},
        h('div.row-between', {},
          h('div.eyebrow', {}, `Review · ${i + 1} of ${due.length}`),
          h('a.tiny', { href: `#/lesson/${lesson.id}` }, lesson.title)),
        h('div', { style: { marginTop: '10px' } }, Bar(((i) / due.length) * 100))),
      h('h2', { style: { lineHeight: '1.4' } }, c.q),
      answers,
      footer);
  };

  render();
  return wrap;
}
