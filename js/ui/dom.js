/* ==========================================================================
   dom.js — a hyperscript small enough to read in one sitting.
   No virtual DOM: views render once and re-render whole sections when state
   changes. At this scale that is faster than diffing and far easier to follow.
   ========================================================================== */

export function h(tag, props = null, ...children) {
  if (typeof tag === 'function') return tag({ ...(props || {}), children });

  /* tag may carry classes: 'div.card.sunk' */
  const [name, ...classes] = tag.split('.');
  const el = name === 'svg' || name === 'path' || name === 'circle'
    ? document.createElementNS('http://www.w3.org/2000/svg', name)
    : document.createElement(name || 'div');
  if (classes.length) el.setAttribute('class', classes.join(' '));

  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class' || k === 'className') {
      el.setAttribute('class', [el.getAttribute('class'), v].filter(Boolean).join(' '));
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(el.style, v);
    } else if (k === 'html') {
      el.innerHTML = v;
    } else if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'dataset') {
      Object.assign(el.dataset, v);
    } else if (v === true) {
      el.setAttribute(k, '');
    } else {
      el.setAttribute(k, String(v));
    }
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false || c === true) continue;
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export const frag = (...children) => {
  const f = document.createDocumentFragment();
  append(f, children);
  return f;
};

export function mount(node, ...children) {
  node.replaceChildren();
  append(node, children);
  return node;
}

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Inline SVG from a path string — keeps icon markup out of every call site. */
export function svg(paths, { size = 20, fill = 'none', stroke = 'currentColor', width = 1.7, viewBox = '0 0 24 24' } = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', viewBox);
  el.setAttribute('width', size); el.setAttribute('height', size);
  el.setAttribute('fill', fill); el.setAttribute('stroke', stroke);
  el.setAttribute('stroke-width', width);
  el.setAttribute('stroke-linecap', 'round');
  el.setAttribute('stroke-linejoin', 'round');
  el.innerHTML = paths;
  return el;
}

/* Parse an SVG string into a live node — used by the diagram library. */
export function rawSVG(markup) {
  const wrap = document.createElement('div');
  wrap.innerHTML = markup.trim();
  return wrap.firstElementChild;
}

let toastTimer = null;
export function toast(message) {
  document.querySelector('.toast')?.remove();
  const t = h('div.toast', {}, message);
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 2600);
}

export function sheet(title, content, { onClose } = {}) {
  const close = () => { backdrop.remove(); document.body.style.overflow = ''; onClose?.(); };
  const panel = h('div.sheet', { role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
    h('div.grabber'),
    h('div.row-between', { style: { marginBottom: '14px' } },
      h('h2', {}, title),
      h('button.btn.btn-ghost.btn-sm', { onClick: close, 'aria-label': 'Close' }, '✕')),
    content,
  );
  const backdrop = h('div.sheet-backdrop', {
    onClick: e => { if (e.target === backdrop) close(); },
  }, panel);
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });
  document.body.appendChild(backdrop);
  document.body.style.overflow = 'hidden';
  panel.querySelector('button')?.focus();
  return close;
}

export const fmtDate = ts => new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtTime = d => d ? d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—';
export const relative = ts => {
  const diff = Date.now() - ts, day = 86400000;
  if (diff < 3600e3) return 'just now';
  if (diff < day) return 'today';
  if (diff < 2 * day) return 'yesterday';
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`;
  return fmtDate(ts);
};
