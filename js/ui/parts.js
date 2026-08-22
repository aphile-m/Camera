/* ==========================================================================
   parts.js — the shared pieces every view is assembled from.
   ========================================================================== */

import { h, rawSVG } from './dom.js';
import { icon } from './icons.js';
import { diagram } from './diagrams.js';

export const Eyebrow = t => h('div.eyebrow', {}, t);

export const Section = (title, ...content) =>
  h('section.section', {}, title ? Eyebrow(title) : null, ...content);

export const Card = (...content) => h('div.card', {}, ...content);

export function Note(tone, text) {
  const name = ['info', 'warn', 'bad', 'good'].includes(tone) ? tone : 'info';
  const ic = icon(name, 18);
  ic.setAttribute('class', 'ic');
  return h('div.note', { class: name }, ic, h('div', {}, text));
}

export function Readout(items) {
  return h('div.readout', {}, ...items.map(it =>
    h('div', {},
      h('div.k', {}, it.k),
      h('div.v', { class: it.tone || '' }, it.v),
      h('div.n', {}, it.n || ''))));
}

export function Figure(name, caption) {
  const markup = diagram(name);
  if (!markup) return null;
  return h('figure.figure', {}, rawSVG(markup), caption ? h('figcaption', {}, caption) : null);
}

export function OptGrid(options, selected, onPick, cols = 'two') {
  return h('div.opts', { class: cols }, ...options.map(o =>
    h('button.opt', {
      type: 'button',
      'aria-pressed': String(selected === o.id),
      onClick: () => onPick(o.id),
    }, h('span.t', {}, o.label), o.hint ? h('span.s', {}, o.hint) : null)));
}

export function Chips(options, selected, onPick) {
  return h('div.wrap', {}, ...options.map(o =>
    h('button.chip', {
      type: 'button',
      'aria-pressed': String(selected === (o.id ?? o)),
      onClick: () => onPick(o.id ?? o),
    }, o.label ?? o)));
}

export function Seg(options, selected, onPick) {
  return h('div.seg', { role: 'group' }, ...options.map(o =>
    h('button', {
      type: 'button',
      'aria-pressed': String(selected === (o.id ?? o)),
      onClick: () => onPick(o.id ?? o),
    }, o.label ?? o)));
}

export function KV(rows) {
  return h('div.kv', {}, ...rows.map(([k, v]) =>
    h('div', {}, h('div.k', {}, k), h('div.v', {}, v))));
}

export function Bar(pct, tone = '') {
  return h('div.bar', { class: tone }, h('i', { style: { width: `${Math.max(0, Math.min(100, pct))}%` } }));
}

export function Ring(pct, label) {
  return h('div.ring', { style: { '--p': String(Math.round(pct)) } }, h('span', {}, label ?? `${Math.round(pct)}`));
}

export function Slider({ label, value, min, max, step = 1, format, onInput }) {
  const out = h('span.num', { style: { color: 'var(--accent)', fontWeight: '600' } }, format ? format(value) : String(value));
  return h('div', {},
    h('div.row-between', { style: { marginBottom: '2px' } },
      h('span', { class: 'small', style: { color: 'var(--muted)' } }, label), out),
    h('input', {
      type: 'range', min, max, step, value,
      onInput: e => { const v = Number(e.target.value); out.textContent = format ? format(v) : String(v); onInput(v); },
    }));
}

export function Switch(label, checked, onChange) {
  const input = h('input', { type: 'checkbox', checked, onChange: e => onChange(e.target.checked) });
  return h('label.switch', {}, input, h('span.track'), h('span', { class: 'grow' }, label));
}

export function Empty(iconName, text) {
  return h('div.empty', {}, icon(iconName, 38), h('p', {}, text));
}

export function BackLink(href, text) {
  return h('a.btn.btn-ghost.btn-sm', { href, style: { paddingLeft: '4px' } }, icon('back', 16), text);
}

export function Prose(paragraphs) {
  return h('div.prose', {}, ...paragraphs.map(p =>
    typeof p === 'string' ? h('p', {}, p)
      : h('div', { style: { marginTop: '16px' } },
          h('h4', { style: { marginBottom: '5px' } }, p.h),
          h('p', {}, p.p))));
}

export function Bullets(items, tone = 'accent') {
  return h('ul', { style: { listStyle: 'none', display: 'grid', gap: '9px' } },
    ...items.map(t => h('li', { style: { display: 'flex', gap: '10px', fontSize: '14.5px', lineHeight: '1.5', color: 'var(--ink-2)' } },
      h('span', { style: { color: `var(--${tone})`, flex: 'none', marginTop: '1px' } }, '—'),
      h('span', {}, t))));
}
