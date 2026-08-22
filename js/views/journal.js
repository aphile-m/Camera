/* ==========================================================================
   journal.js — the shot log, the self-critique, and the pattern it reveals.
   The point of the journal is not the record. It is the third column: the
   fault you keep repeating.
   ========================================================================== */

import { h, toast, relative, sheet } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { Section, Card, Note, KV, Empty, Chips, Seg, Bar } from '../ui/parts.js';
import * as store from '../core/store.js';
import * as P from '../core/photo.js';
import { DRILLS, drillById, LESSONS, lessonById } from '../data/curriculum.js';

/* The six-point critique from lesson 7-4, used as structured tags. */
export const FAULTS = [
  { id:'subject',    label:'No clear subject',   fix:'l1-what-makes' },
  { id:'closer',     label:'Stood too far back', fix:'l1-closer' },
  { id:'background', label:'Messy background',   fix:'l1-background' },
  { id:'light',      label:'Wrong light',        fix:'l4-direction' },
  { id:'frame',      label:'Careless edges',     fix:'l1-frame-edges' },
  { id:'moment',     label:'Missed the moment',  fix:'l5-moment' },
  { id:'focus',      label:'Focus in the wrong place', fix:'l3-focus-modes' },
  { id:'shake',      label:'Camera shake',       fix:'l3-handholding' },
  { id:'exposure',   label:'Exposure off',       fix:'l2-metering' },
  { id:'clutter',    label:'Too much in the frame', fix:'l5-simplify' },
];
export const faultById = id => FAULTS.find(f => f.id === id);

/* ---------- Index ---------------------------------------------------------- */

export function JournalView(state, rerender) {
  const entries = state.journal;
  const tab = state.__journalTab || 'entries';

  return h('div.stack-lg', { class: 'enter' },
    h('div.row-between', {},
      h('div', {},
        h('h1', { style: { marginTop: '6px' } }, 'Journal'),
        h('p', { class: 'lede', style: { marginTop: '6px' } },
          'What you shot, and what you would do differently. The second half is the one that matters.')),
      h('a.btn.btn-primary.btn-sm', { href: '#/journal/new', style: { flex: 'none' } }, icon('plus', 16))),

    Seg([{ id: 'entries', label: 'Entries' }, { id: 'patterns', label: 'Patterns' }], tab,
      v => { state.__journalTab = v; rerender(); }),

    tab === 'entries' ? EntryList(state, rerender) : Patterns(state));
}

function EntryList(state, rerender) {
  if (!state.journal.length) {
    return h('div', {}, Empty('journal',
      'Nothing logged yet. After a shoot, log two or three frames — the ones that worked and the one that did not.'),
      h('a.btn.btn-primary.btn-block', { href: '#/journal/new' }, 'Log a frame'));
  }
  return h('div.card', {}, ...state.journal.map(e => {
    const thumb = h('div.thumb', {});
    if (e.imageId) {
      store.getImage(e.imageId).then(blob => {
        if (!blob) return;
        const img = h('img.thumb', { src: URL.createObjectURL(blob), alt: '' });
        thumb.replaceWith(img);
      }).catch(() => {});
    }
    return h('a.entry', { href: `#/journal/${e.id}`, style: { textDecoration: 'none', color: 'inherit' } },
      e.imageId ? thumb : null,
      h('div.grow', {},
        h('div.row-between', {},
          h('div', { style: { fontWeight: '600', fontSize: '14.5px' } }, e.title || 'Untitled frame'),
          h('div.tiny', { style: { flex: 'none' } }, relative(e.at))),
        e.aperture ? h('div.settings', {},
          `${P.fmtAperture(e.aperture)}  ·  ${P.fmtShutter(e.shutter)}  ·  ISO ${P.fmtISO(e.iso)}${e.focal ? `  ·  ${e.focal}mm` : ''}`) : null,
        e.faults?.length ? h('div.wrap', { style: { marginTop: '7px' } },
          ...e.faults.slice(0, 3).map(f => h('span', {
            style: { fontSize: '11px', padding: '3px 8px', borderRadius: '999px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--muted)' },
          }, faultById(f)?.label || f))) : null,
        e.rating ? h('div', { style: { marginTop: '6px', color: 'var(--accent)', fontSize: '12px', letterSpacing: '2px' } },
          '★'.repeat(e.rating) + '☆'.repeat(5 - e.rating)) : null));
  }));
}

/* ---------- Patterns ------------------------------------------------------- */

function Patterns(state) {
  const entries = state.journal;
  if (entries.length < 3) {
    return Empty('target', 'Log a few more frames and this becomes useful. After about ten entries the same two or three faults start repeating, and those are your practice list.');
  }

  const counts = new Map();
  for (const e of entries) for (const f of e.faults || []) counts.set(f, (counts.get(f) || 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const total = entries.length;

  /* Settings habits — the other thing a log reveals */
  const withSettings = entries.filter(e => e.aperture);
  const avgISO = withSettings.length ? Math.round(withSettings.reduce((a, e) => a + e.iso, 0) / withSettings.length) : null;
  const wideOpen = withSettings.filter(e => e.aperture <= 2.8).length;
  const slow = withSettings.filter(e => e.shutter >= 1 / 60).length;

  return h('div.stack-lg', {},
    ranked.length ? Section('What keeps going wrong',
      Card(
        h('p', { class: 'small', style: { marginBottom: '16px' } },
          `Across ${total} logged frames. Most photographers have two or three repeating faults rather than twenty different ones — fix the top of this list and everything lifts at once.`),
        h('div.stack', {}, ...ranked.slice(0, 6).map(([id, n]) => {
          const f = faultById(id);
          return h('div', {},
            h('div.row-between', { style: { marginBottom: '5px' } },
              h('span', { style: { fontSize: '14px', fontWeight: '600' } }, f?.label || id),
              h('span.tiny.num', {}, `${n} of ${total}`)),
            Bar((n / total) * 100),
            f?.fix ? h('a.tiny', { href: `#/lesson/${f.fix}`, style: { display: 'inline-block', marginTop: '5px' } },
              `Reread: ${lessonById(f.fix)?.title}`) : null);
        })))) : null,

    withSettings.length >= 3 ? Section('Your habits', Card(KV([
      ['Average ISO', `${P.fmtISO(avgISO)} — ${avgISO < 400 ? 'you may be avoiding ISO at the cost of shutter speed' : avgISO > 3200 ? 'consistently high; look for better light rather than more gain' : 'a healthy working range'}`],
      ['Wide open', `${wideOpen} of ${withSettings.length} frames at f/2.8 or wider${wideOpen / withSettings.length > 0.6 ? ' — shooting wide open by default costs you sharp frames' : ''}`],
      ['Slow shutter', `${slow} of ${withSettings.length} at 1/60 or slower${slow / withSettings.length > 0.4 ? ' — a likely source of the blur in your rejects' : ''}`],
    ]))) : null,

    Section('The drills that address them',
      h('div.card.flush', {}, ...ranked.slice(0, 3).map(([id]) => {
        const lesson = lessonById(faultById(id)?.fix);
        if (!lesson?.drill) return null;
        return h('a.lesson-row', { href: `#/drill/${lesson.drill.id}` },
          h('span.idx', { style: { border: 'none' } }, icon('practice', 16)),
          h('span.grow', {},
            h('span.t', { style: { display: 'block' } }, lesson.drill.title),
            h('span.s', { style: { display: 'block' } }, `for: ${faultById(id).label.toLowerCase()}`)),
          icon('chevron', 16));
      }).filter(Boolean))));
}

/* ---------- New / edit entry ------------------------------------------------ */

export function JournalEntryView(state, id, rerender) {
  const isNew = id === 'new';
  const existing = isNew ? null : state.journal.find(e => e.id === id);
  if (!isNew && !existing) return Empty('journal', 'That entry no longer exists.');

  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const draft = existing ? { ...existing } : {
    title: '', aperture: Number(params.get('a')) || null, shutter: Number(params.get('s')) || null,
    iso: Number(params.get('i')) || null, focal: Number(params.get('f')) || null,
    drillId: params.get('drill') || null,
    rating: 0, worked: '', fix: '', faults: [], frames: 1,
  };

  const field = (label, key, opts = {}) => {
    const input = h(opts.multiline ? 'textarea' : 'input', {
      type: opts.type || 'text', placeholder: opts.placeholder || '',
      onInput: e => { draft[key] = opts.number ? Number(e.target.value) : e.target.value; },
    });
    input.value = draft[key] ?? '';
    return h('label.field', {}, h('span.lab', {}, label), input);
  };

  const faultChips = h('div.wrap', {}, ...FAULTS.map(f =>
    h('button.chip', {
      type: 'button',
      'aria-pressed': String(draft.faults.includes(f.id)),
      onClick: e => {
        const on = draft.faults.includes(f.id);
        draft.faults = on ? draft.faults.filter(x => x !== f.id) : [...draft.faults, f.id];
        e.currentTarget.setAttribute('aria-pressed', String(!on));
      },
    }, f.label)));

  const stars = h('div.rating', {}, ...[1, 2, 3, 4, 5].map(n =>
    h('button', { type: 'button', class: draft.rating >= n ? 'on' : '', onClick: e => {
      draft.rating = n;
      [...e.currentTarget.parentElement.children].forEach((b, i) => b.classList.toggle('on', i < n));
    } }, icon('star', 20))));

  const preview = h('div', {});
  const fileInput = h('input', {
    type: 'file', accept: 'image/*', style: { display: 'none' },
    onChange: async e => {
      const file = e.target.files?.[0]; if (!file) return;
      try {
        const { id: imageId } = await store.storeImageFile(file);
        draft.imageId = imageId;
        preview.replaceChildren(h('img', { src: URL.createObjectURL(file), style: { borderRadius: 'var(--r)', maxHeight: '220px', width: '100%', objectFit: 'cover' } }));
      } catch { toast('Could not read that image'); }
    },
  });

  if (draft.imageId) {
    store.getImage(draft.imageId).then(b => b && preview.replaceChildren(
      h('img', { src: URL.createObjectURL(b), style: { borderRadius: 'var(--r)', maxHeight: '220px', width: '100%', objectFit: 'cover' } })));
  }

  const settingsRow = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' } },
    field('Aperture f/', 'aperture', { type: 'number', number: true, placeholder: '5.6' }),
    field('Shutter (seconds)', 'shutter', { type: 'number', number: true, placeholder: '0.008' }),
    field('ISO', 'iso', { type: 'number', number: true, placeholder: '400' }),
    field('Focal length mm', 'focal', { type: 'number', number: true, placeholder: '35' }));

  const save = () => {
    if (isNew) store.addEntry(draft);
    else store.updateEntry(id, draft);
    toast(isNew ? 'Logged' : 'Saved');
    location.hash = '#/journal';
  };

  return h('div.stack-lg', { class: 'enter' },
    h('div', {},
      h('a.btn.btn-ghost.btn-sm', { href: '#/journal', style: { marginLeft: '-8px' } }, icon('back', 16), 'Journal'),
      h('h1', { style: { margin: '12px 0 6px' } }, isNew ? 'Log a frame' : 'Edit entry'),
      h('p', { class: 'lede' }, 'The settings are the easy part. The two questions below are the reason to keep a journal at all.')),

    draft.drillId ? Note('info', `Attached to the drill: ${drillById(draft.drillId)?.title}`) : null,

    Card(h('div.stack', {},
      field('What was it', 'title', { placeholder: 'Backlit portrait, back lane' }),
      preview,
      h('button.btn.btn-sm', { onClick: () => fileInput.click() }, icon('image', 16), draft.imageId ? 'Replace photograph' : 'Attach the photograph'),
      fileInput)),

    Section('Settings', Card(settingsRow)),

    Section('The critique', Card(h('div.stack', {},
      h('div', {}, h('span.lab', { class: 'eyebrow', style: { display: 'block', marginBottom: '8px' } }, 'How good is it, honestly'), stars),
      field('What worked', 'worked', { multiline: true, placeholder: 'The light was doing the work — low sun through the gap between the buildings.' }),
      field('What you would do differently', 'fix', { multiline: true, placeholder: 'Two steps left would have taken the bin out of the frame.' }),
      h('div', {},
        h('span.eyebrow', { style: { display: 'block', marginBottom: '8px' } }, 'Which fault, if any'),
        h('p', { class: 'tiny', style: { marginBottom: '10px' } },
          'Be specific and be honest. This is what the Patterns tab reads.'),
        faultChips)))),

    h('div.row', { style: { gap: '10px', marginTop: '24px' } },
      h('button.btn.btn-primary', { style: { flex: '1' }, onClick: save }, isNew ? 'Log it' : 'Save'),
      !isNew ? h('button.btn', { onClick: () => {
        if (confirm('Delete this entry? This cannot be undone.')) {
          store.deleteEntry(id); toast('Deleted'); location.hash = '#/journal';
        }
      } }, icon('trash', 16)) : null));
}
