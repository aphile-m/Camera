/* ==========================================================================
   learn.js — the path, a lesson, and the check at the end of it.
   ========================================================================== */

import { h, toast } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { Section, Card, Note, Bar, Figure, Prose, Bullets, KV, Empty } from '../ui/parts.js';
import * as store from '../core/store.js';
import { LESSONS, LEVELS, lessonById, lessonsInLevel } from '../data/curriculum.js';
import { levelTone, celebrate } from '../ui/motion.js';

/* ---------- The path ------------------------------------------------------ */

export function LearnView(state) {
  const done = LESSONS.filter(l => state.lessons[l.id]?.read).length;

  return h('div.stack-lg', { class: 'enter' },
    h('div', {},
      h('h1', { style: { marginTop: '6px' } }, 'The path'),
      h('p', { class: 'lede', style: { marginTop: '6px' } },
        'Seven levels, in order. Nothing here depends on something you have not met yet, so work through it rather than around it.'),
      h('div', { style: { marginTop: '16px' } }, Bar((done / LESSONS.length) * 100)),
      h('div.tiny', { style: { marginTop: '7px' } }, `${done} of ${LESSONS.length} lessons read`)),

    ...LEVELS.map(level => {
      const lessons = lessonsInLevel(level.id);
      const levelDone = lessons.filter(l => state.lessons[l.id]?.read).length;
      const complete = levelDone === lessons.length;

      const tone = levelTone(level.id);
      return h('section', { style: { '--tone': tone } },
        h('div.level-head', { style: {
          marginBottom: '10px',
          /* Only the crop moves per level; the image itself is in the CSS. */
          '--tex-pos': `${(level.id - 1) * 16}% ${level.id % 2 ? 30 : 70}%`,
        } },
          h('div.row-between', { style: { alignItems: 'flex-start' } },
            h('div', { style: { position: 'relative', zIndex: '1' } },
              h('div.n', {}, `Level ${level.id}`),
              h('h2', { style: { marginTop: '5px' } }, level.name)),
            h('div.tiny', { style: { flex: 'none', position: 'relative', zIndex: '1' } },
              complete ? '✓ complete' : `${levelDone}/${lessons.length}`)),
          h('p', { class: 'small', style: { marginTop: '8px', position: 'relative', zIndex: '1', maxWidth: '34ch' } },
            level.blurb),
          h('div', { style: { marginTop: '13px', position: 'relative', zIndex: '1' } },
            Bar((levelDone / lessons.length) * 100))),
        h('div.card.flush', {}, ...lessons.map((l, i) => {
          const read = !!state.lessons[l.id]?.read;
          return h('a.lesson-row', { class: read ? 'done' : '', href: `#/lesson/${l.id}`, style: { '--tone': tone } },
            h('span.idx', {}, read ? '✓' : String(i + 1)),
            h('span.grow', {},
              h('span.t', { style: { display: 'block' } }, l.title),
              h('span.s', { style: { display: 'block' } }, l.sub)),
            icon('chevron', 16));
        })));
    }));
}

/* ---------- One lesson ---------------------------------------------------- */

export function LessonView(state, id, rerender) {
  const l = lessonById(id);
  if (!l) return Empty('book', 'That lesson does not exist.');

  const idx = LESSONS.indexOf(l);
  const next = LESSONS[idx + 1];
  const read = !!state.lessons[l.id]?.read;
  const level = LEVELS.find(v => v.id === l.level);

  return h('div.stack-lg', { class: 'enter', style: { '--tone': levelTone(l.level) } },
    h('div', {},
      h('a.btn.btn-ghost.btn-sm', { href: '#/learn', style: { marginLeft: '-8px' } }, icon('back', 16), 'The path'),
      h('div.eyebrow', { style: { marginTop: '12px', color: 'var(--tone)' } }, `Level ${l.level} · ${level.name} · ${l.minutes} min`),
      h('h1', { style: { margin: '8px 0 6px' } }, l.title),
      h('p', { class: 'lede' }, l.sub)),

    /* The core idea, given weight */
    h('div', { style: {
      borderLeft: '2px solid var(--tone)', paddingLeft: '18px', margin: '4px 0',
      fontFamily: 'var(--serif)', fontSize: '18px', lineHeight: '1.55', color: 'var(--ink)',
    } }, l.idea),

    Figure(l.diagram),

    Prose(l.body),

    Section('Worth remembering', Card(Bullets(l.points))),

    l.camera?.length ? Section('On the camera', Card(KV(l.camera.map(c => [c.control, c.do])))) : null,

    l.mistakes?.length ? Section('Common mistakes',
      h('div.stack-sm', {}, ...l.mistakes.map(m => Note('warn', m)))) : null,

    l.drill ? Section('Then go and shoot it',
      Card(
        h('div.eyebrow', {}, 'Field drill'),
        h('h3', { style: { margin: '7px 0 6px' } }, l.drill.title),
        h('p', { class: 'small' }, l.drill.brief),
        h('a.btn.btn-primary.btn-block', { href: `#/drill/${l.drill.id}`, style: { marginTop: '14px' } },
          store.drillState(l.drill.id)?.completed ? 'Review the drill' : 'Open the drill'))) : null,

    l.quiz?.length ? Section('Check yourself', Quiz(l, rerender)) : null,

    h('div.row', { style: { gap: '10px', marginTop: '30px' } },
      h('button.btn', { class: read ? '' : 'btn-primary', style: { flex: '1' },
        onClick: () => {
          if (read) { toast('Already marked as read'); return; }
          store.markLessonRead(l.id);
          const peers = LESSONS.filter(x => x.level === l.level);
          const doneNow = peers.filter(x => store.isLessonDone(x.id)).length;
          if (doneNow === peers.length) celebrate(`Level ${l.level} complete — ${level.name}`, { iconName: 'star' });
          else celebrate('Lesson read', { iconName: 'check' });
          rerender();
        } },
        read ? '✓ Read' : 'Mark as read'),
      next ? h('a.btn', { href: `#/lesson/${next.id}`, style: { flex: '1' } }, 'Next lesson', icon('chevron', 16)) : null));
}

/* ---------- Quiz ---------------------------------------------------------- */

function Quiz(lesson, rerender) {
  const answered = new Map();
  const wrap = h('div.stack', {});

  const render = () => {
    wrap.replaceChildren();
    lesson.quiz.forEach((q, qi) => {
      const chosen = answered.get(qi);
      const card = h('div.card', {},
        h('p', { style: { fontWeight: '600', marginBottom: '12px', lineHeight: '1.45' } }, q.q),
        h('div.stack-sm', {}, ...q.a.map((text, ai) => {
          const isChosen = chosen === ai;
          const cls = chosen === undefined ? ''
            : ai === q.correct ? 'correct'
            : isChosen ? 'wrong' : '';
          return h('button.answer', {
            class: cls, disabled: chosen !== undefined,
            onClick: () => {
              answered.set(qi, ai);
              store.scheduleCard(`${lesson.id}#${qi}`, ai === q.correct);
              if (answered.size === lesson.quiz.length) {
                const score = [...answered.entries()].filter(([i, a]) => a === lesson.quiz[i].correct).length;
                store.markLessonRead(lesson.id);
                store.recordQuiz(lesson.id, score, lesson.quiz.length);
              }
              render();
            },
          }, text);
        })),
        chosen !== undefined ? h('div', { style: { marginTop: '11px' } },
          Note(chosen === q.correct ? 'good' : 'info', q.why)) : null);
      wrap.appendChild(card);
    });

    if (answered.size === lesson.quiz.length) {
      const score = [...answered.entries()].filter(([i, a]) => a === lesson.quiz[i].correct).length;
      wrap.appendChild(Note(score === lesson.quiz.length ? 'good' : 'info',
        score === lesson.quiz.length
          ? 'All correct. These questions will come back in a few days so the idea sticks.'
          : `${score} of ${lesson.quiz.length}. The ones you missed will come back tomorrow.`));
    }
  };

  render();
  return wrap;
}
