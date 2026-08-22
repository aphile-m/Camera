/* ==========================================================================
   diagrams.js — teaching figures, drawn in SVG so they follow the theme.
   Every diagram is a function returning markup for a 340×160 viewBox.
   ========================================================================== */

const W = 340, H = 160;

const open = (h = H) => `<svg viewBox="0 0 ${W} ${h}" role="img" xmlns="http://www.w3.org/2000/svg" style="background:transparent">
  <style>
    .ln{stroke:var(--line-strong);fill:none;stroke-width:1.2}
    .ac{stroke:var(--accent);fill:none;stroke-width:1.8}
    .acf{fill:var(--accent)}
    .cy{stroke:var(--cyan);fill:none;stroke-width:1.6}
    .cyf{fill:var(--cyan)}
    .dim{stroke:var(--line);fill:none;stroke-width:1}
    .fillw{fill:var(--surface)}
    .fills{fill:var(--surface-2)}
    text{font:500 9px ui-sans-serif,system-ui,sans-serif;fill:var(--muted)}
    .lbl{font-size:8.5px;fill:var(--faint)}
    .key{font:600 9px ui-monospace,monospace;fill:var(--accent)}
    .keyc{font:600 9px ui-monospace,monospace;fill:var(--cyan)}
  </style>`;
const close = '</svg>';

/* A camera glyph, reused everywhere */
const cam = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-11" y="-8" width="22" height="16" rx="2.5" class="ln fillw"/>
  <circle cx="0" cy="0" r="5" class="ln"/><circle cx="0" cy="0" r="2" class="acf"/>
  <rect x="-4" y="-11" width="8" height="3" rx="1" class="ln fillw"/></g>`;

/* A stick figure subject */
const person = (x, y, s = 1, cls = 'ac') => `<g transform="translate(${x} ${y}) scale(${s})" class="${cls}">
  <circle cx="0" cy="-14" r="4.5"/><path d="M0-9.5v11M-6 16l6-6.5 6 6.5M-7-4h14"/></g>`;

const frame = (x, y, w, hh, cls = 'ln') => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="3" class="${cls}"/>`;

/* ---------------------------------------------------------------------- */

export const DIAGRAMS = {

'four-ingredients': () => open(150) + `
  ${[['Subject', 'what it is about'], ['Light', 'direction and quality'], ['Composition', 'what you left out'], ['Moment', 'which instant']]
    .map(([t, s], i) => `<g transform="translate(${18 + i * 80} 30)">
      <rect x="0" y="0" width="68" height="52" rx="6" class="${i === 0 ? 'ac' : 'ln'} fills"/>
      <text x="34" y="24" text-anchor="middle" style="font-weight:600;fill:var(--ink)">${t}</text>
      <text x="34" y="38" text-anchor="middle" class="lbl">${s}</text>
      ${i < 3 ? `<path d="M72 26h6" class="dim"/><path d="m76 23 4 3-4 3" class="dim"/>` : ''}
    </g>`).join('')}
  <text x="170" y="105" text-anchor="middle" class="lbl">Settings serve these four. They are never the point on their own.</text>
  <path d="M20 118h300" class="dim" stroke-dasharray="3 3"/>
  <text x="170" y="134" text-anchor="middle" class="key">most important ←──────────────── least important</text>` + close,

'closer': () => open() + `
  ${cam(34, 80)}
  <g opacity=".45">${frame(70, 26, 116, 108, 'dim')}<text x="128" y="20" text-anchor="middle" class="lbl">what you instinctively shot</text>
  ${person(128, 100, .55)}</g>
  ${frame(206, 46, 112, 78, 'ac')}
  <text x="262" y="38" text-anchor="middle" class="key">three steps closer</text>
  ${person(262, 112, 1.05)}
  <path d="M190 80h12" class="dim"/><path d="m198 77 4 3-4 3" class="dim"/>` + close,

'background': () => open() + `
  <g><text x="14" y="16" class="lbl">cluttered</text>${frame(14, 24, 142, 110, 'dim')}
    <path d="M40 134V52M56 134V64M120 134V44" class="dim"/>
    <rect x="96" y="60" width="34" height="20" rx="2" class="dim"/>
    <circle cx="140" cy="46" r="9" class="dim" style="fill:var(--surface-2)"/>
    ${person(80, 122, .95)}
    <path d="M80 106V44" stroke="var(--red)" stroke-width="1.4" fill="none" stroke-dasharray="2 2"/>
    <text x="86" y="42" style="fill:var(--red);font-size:8px">pole through the head</text></g>
  <g><text x="184" y="16" class="lbl">two steps left</text>${frame(184, 24, 142, 110, 'ac')}
    <rect x="184" y="24" width="142" height="110" rx="3" class="fills" opacity=".55"/>
    ${person(250, 122, .95)}
    <text x="255" y="46" class="key">nothing behind the head</text></g>` + close,

'thirds': () => open() + `
  ${frame(24, 18, 292, 124, 'ln')}
  <path d="M121.3 18v124M218.6 18v124M24 59.3h292M24 100.6h292" class="dim" stroke-dasharray="4 4"/>
  ${[[121.3, 59.3], [218.6, 59.3], [121.3, 100.6], [218.6, 100.6]].map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="${i === 0 ? 4 : 2.6}" class="${i === 0 ? 'acf' : 'dim'}" ${i ? 'fill="var(--line-strong)"' : ''}/>`).join('')}
  <circle cx="121.3" cy="59.3" r="13" class="ac"/>
  <text x="139" y="56" class="key">subject sits here</text>
  <path d="M164 76l12 12M176 76l-12 12" stroke="var(--red)" stroke-width="1.4" fill="none"/>
  <text x="182" y="84" style="fill:var(--red);font-size:8px">dead centre says nothing</text>` + close,

'edges': () => open() + `
  ${frame(24, 18, 140, 124, 'ln')}
  ${person(94, 128, 1.5, 'dim')}
  <path d="M78 96h32" stroke="var(--red)" stroke-width="1.3" fill="none"/>
  <text x="30" y="14" class="lbl" style="fill:var(--red)">cut at the wrist ✗</text>
  ${frame(186, 18, 140, 124, 'ac')}
  ${person(240, 128, 1.5)}
  <path d="M226 88h28" class="ac" stroke-dasharray="3 2"/>
  <text x="192" y="14" class="key">cut mid-forearm ✓</text>
  <path d="M258 60h60" class="dim"/><text x="264" y="56" class="lbl">space to look into</text>` + close,

'stops-ladder': () => open(150) + `
  ${[['Aperture', ['1.4', '2', '2.8', '4', '5.6', '8', '11', '16'], 'key'],
     ['Shutter', ['1/500', '1/250', '1/125', '1/60', '1/30', '1/15', '1/8', '1/4'], 'keyc'],
     ['ISO', ['100', '200', '400', '800', '1600', '3200', '6400', '12800'], 'key']]
    .map(([label, vals, cls], row) => `<g transform="translate(0 ${24 + row * 38})">
      <text x="14" y="0" class="lbl">${label}</text>
      ${vals.map((v, i) => `<g transform="translate(${16 + i * 40} 10)">
        <rect x="0" y="0" width="34" height="17" rx="3" class="${row === 1 ? 'cy' : 'ac'}" opacity=".55" fill="none"/>
        <text x="17" y="12" text-anchor="middle" class="${cls}" style="font-size:8px">${v}</text></g>`).join('')}
    </g>`).join('')}
  <path d="M16 138h320" class="dim"/>
  <text x="176" y="149" text-anchor="middle" class="lbl">each step = one stop = double or half the light</text>` + close,

'aperture-dof': () => open() + `
  ${[['f/1.8', 26, 20, 'ac'], ['f/5.6', 26, 74, 'cy'], ['f/16', 26, 122, 'dim']].map(([lbl, x, y, cls], i) => {
    const depth = [22, 62, 128][i];
    return `<g transform="translate(0 ${y})">
      <text x="${x}" y="12" class="${cls === 'ac' ? 'key' : cls === 'cy' ? 'keyc' : 'lbl'}">${lbl}</text>
      <path d="M62 8h250" class="dim"/>
      <rect x="${112 - depth / 2}" y="0" width="${depth}" height="16" rx="2" class="${cls}" fill="var(--accent)" fill-opacity="${i === 2 ? '.1' : '.16'}"/>
      <circle cx="112" cy="8" r="2.6" class="acf"/>
      <text x="${118 + depth / 2}" y="12" class="lbl">${['thin — one eye', 'a whole face', 'front to back'][i]}</text>
    </g>`;
  }).join('')}
  <text x="62" y="152" class="lbl">near ←</text><text x="292" y="152" class="lbl">→ far</text>` + close,

'shutter-motion': () => open() + `
  ${[['1/1000', 0, 'frozen'], ['1/125', 1, 'slight trail'], ['1/15', 2, 'streak'], ['2s', 3, 'gone entirely']]
    .map(([lbl, i, note]) => `<g transform="translate(20 ${24 + i * 34})">
      <text x="0" y="10" class="key" style="font-size:8.5px">${lbl}</text>
      ${Array.from({ length: [1, 3, 9, 20][i] }, (_, k) =>
        `<circle cx="${64 + k * (i === 0 ? 0 : i === 1 ? 9 : i === 2 ? 12 : 9)}" cy="6" r="${i === 0 ? 6 : 5.4}" class="acf" opacity="${i === 0 ? 1 : (0.9 - k * (i === 3 ? 0.042 : 0.08))}"/>`).join('')}
      <text x="272" y="10" class="lbl">${note}</text>
    </g>`).join('')}
  <text x="20" y="150" class="lbl">the same moving subject, four exposure lengths</text>` + close,

'iso-noise': () => open() + `
  ${['100', '800', '3200', '12800'].map((iso, i) => `<g transform="translate(${18 + i * 82} 24)">
    <rect x="0" y="0" width="70" height="70" rx="4" class="ln fills"/>
    ${Array.from({ length: [0, 22, 80, 220][i] }, (_, k) => {
      const sx = (k * 37 % 66) + 2, sy = (k * 53 % 66) + 2;
      return `<rect x="${sx}" y="${sy}" width="1.4" height="1.4" fill="var(--ink)" opacity=".38"/>`;
    }).join('')}
    <circle cx="35" cy="35" r="15" class="ac" fill="var(--surface)" fill-opacity=".55"/>
    <text x="35" y="86" text-anchor="middle" class="key">ISO ${iso}</text>
    <text x="35" y="98" text-anchor="middle" class="lbl">${['clean', 'unremarkable', 'usable', 'emergency'][i]}</text>
  </g>`).join('')}
  <text x="170" y="130" text-anchor="middle" class="lbl">noise is cosmetic — blur is not. Choose accordingly.</text>` + close,

'triangle': () => open() + `
  <g transform="translate(170 84)">
    <path d="M0-58 58 34-58 34Z" class="ln" fill="var(--surface-2)"/>
    <text x="0" y="-64" text-anchor="middle" class="key">APERTURE</text>
    <text x="0" y="-46" text-anchor="middle" class="lbl">depth of field</text>
    <text x="72" y="42" text-anchor="middle" class="keyc">SHUTTER</text>
    <text x="72" y="54" text-anchor="middle" class="lbl">movement</text>
    <text x="-72" y="42" text-anchor="middle" class="key">ISO</text>
    <text x="-72" y="54" text-anchor="middle" class="lbl">noise</text>
    <path d="M-30 -6 30 -6" class="ac"/><path d="m26-10 5 4-5 4M-26-10l-5 4 5 4" class="ac"/>
    <text x="0" y="-12" text-anchor="middle" class="lbl">give two stops here…</text>
    <text x="0" y="18" text-anchor="middle" class="lbl">…take two from there</text>
  </g>` + close,

'histogram': () => open() + `
  ${frame(30, 20, 280, 92, 'ln')}
  <rect x="30" y="20" width="280" height="92" class="fills"/>
  <path d="M30 112 ${Array.from({ length: 56 }, (_, i) => {
    const x = 30 + i * 5, t = i / 55;
    const y = 112 - 78 * Math.exp(-Math.pow((t - 0.48) * 3.2, 2)) - 6 * Math.exp(-Math.pow((t - 0.85) * 14, 2));
    return `L${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ')} L310 112Z" fill="var(--accent)" fill-opacity=".28" stroke="var(--accent)" stroke-width="1.4"/>
  <path d="M30 20v92M310 20v92" class="ac" stroke-dasharray="3 3"/>
  <text x="32" y="128" class="lbl">pure black</text>
  <text x="308" y="128" text-anchor="end" class="lbl">pure white</text>
  <text x="170" y="128" text-anchor="middle" class="lbl">mid-tones</text>
  <text x="36" y="34" class="lbl" style="fill:var(--red)">crushed here → often recoverable</text>
  <text x="304" y="34" text-anchor="end" class="lbl" style="fill:var(--red)">clipped here → gone forever</text>` + close,

'af-modes': () => open() + `
  <g><text x="20" y="16" class="lbl">AF-S — focus locks, subject moves on</text>
    ${cam(36, 56, .8)}${person(120, 74, .8, 'dim')}${person(196, 74, .8, 'ac')}
    <path d="M52 56h60" class="dim" stroke-dasharray="3 2"/>
    <circle cx="120" cy="56" r="7" class="dim"/>
    <text x="196" y="90" text-anchor="middle" style="font-size:8px;fill:var(--red)">now soft</text></g>
  <path d="M20 100h300" class="dim"/>
  <g transform="translate(0 42)"><text x="20" y="60" class="lbl">AF-C — focus tracks the subject in</text>
    ${cam(36, 92, .8)}${person(120, 110, .8, 'dim')}${person(196, 110, .8, 'ac')}
    <path d="M52 92h136" class="ac"/>
    <circle cx="196" cy="92" r="7" class="ac"/>
    <text x="196" y="126" text-anchor="middle" class="key">sharp</text></g>` + close,

'hyperfocal': () => open() + `
  <path d="M24 116h292" class="ln"/>
  ${cam(30, 100, .7)}
  <g><text x="24" y="26" class="lbl" style="fill:var(--red)">focused at the horizon — near ground wasted</text>
    <rect x="238" y="32" width="78" height="14" rx="2" fill="var(--accent)" fill-opacity=".2" class="dim"/>
    <path d="M60 46h178" class="dim" stroke-dasharray="3 3"/></g>
  <g><text x="24" y="72" class="key">focused at the hyperfocal distance</text>
    <rect x="88" y="78" width="228" height="14" rx="2" fill="var(--accent)" fill-opacity=".28" class="ac"/>
    <path d="M88 85V116" class="ac" stroke-dasharray="2 2"/>
    <text x="92" y="106" class="key">H ≈ 2m at 18mm f/8</text></g>
  <text x="24" y="134" class="lbl">1m</text><text x="160" y="134" class="lbl">10m</text><text x="300" y="134" class="lbl">∞</text>
  <text x="24" y="150" class="lbl">one third of the sharp zone falls in front of focus, two thirds behind</text>` + close,

'handhold': () => open() + `
  <g><text x="26" y="18" class="lbl" style="fill:var(--red)">elbows out — unstable ✗</text>
    <g transform="translate(84 84)" class="dim" stroke-width="1.5" fill="none">
      <circle cx="0" cy="-26" r="9"/><path d="M0-17v34M-30 6l14-14M30 6L16-8M-26 6l26-10 26 10"/>
      <rect x="-11" y="-16" width="22" height="14" rx="2" class="ln fillw"/></g></g>
  <path d="M170 24v112" class="dim"/>
  <g><text x="206" y="18" class="key">elbows tucked in ✓</text>
    <g transform="translate(254 84)" class="ac" stroke-width="1.5" fill="none">
      <circle cx="0" cy="-26" r="9"/><path d="M0-17v34M-16 4l6-12M16 4l-6-12M-12 4l12-6 12 6"/>
      <rect x="-11" y="-16" width="22" height="14" rx="2" class="ac fillw"/></g>
    <text x="254" y="126" text-anchor="middle" class="lbl">breathe out · squeeze · fire three</text></g>` + close,

'sharpness-diagnosis': () => open(150) + `
  ${[['smeared one way', 'camera shake', 0], ['subject soft, bg sharp', 'focus landed behind', 1],
     ['evenly soft at f/22', 'diffraction', 2], ['haloes round lights', 'filter or condensation', 3]]
    .map(([sym, cause, i]) => `<g transform="translate(18 ${26 + i * 30})">
      <rect x="0" y="-13" width="130" height="22" rx="4" class="ln fills"/>
      <text x="8" y="2" style="font-size:8.5px">${sym}</text>
      <path d="M136 -2h22" class="dim"/><path d="m154 -5 4 3-4 3" class="dim"/>
      <text x="166" y="2" class="key" style="font-size:8.5px">${cause}</text>
    </g>`).join('')}` + close,

'light-direction': () => open() + `
  ${[['front', 60, 'flat, safe, dull'], ['side', 170, 'sculpts and reveals texture'], ['back', 280, 'glows, needs +1 EV']]
    .map(([lbl, cx, note], i) => `<g>
      <circle cx="${cx}" cy="70" r="17" class="${i === 1 ? 'ac' : 'ln'}" fill="var(--surface-2)"/>
      <path d="M${cx - 17} 70a17 17 0 0 ${i === 2 ? '1 34 0' : '0 34 0'}" fill="var(--ink)" opacity="${i === 0 ? 0 : i === 1 ? .16 : .3}"
        transform="rotate(${i === 1 ? 90 : 0} ${cx} 70)"/>
      <g transform="translate(${cx} ${i === 0 ? 118 : i === 1 ? 70 : 26})">
        <circle cx="${i === 1 ? -46 : 0}" cy="0" r="6" class="acf" opacity=".8"/>
        ${Array.from({ length: 6 }, (_, k) => `<path d="M${i === 1 ? -46 : 0} 0l${Math.cos(k) * 11} ${Math.sin(k) * 11}" class="ac" opacity=".5"/>`).join('')}
      </g>
      <text x="${cx}" y="${i === 2 ? 128 : 100}" text-anchor="middle" class="${i === 1 ? 'key' : 'lbl'}">${lbl} light</text>
      <text x="${cx}" y="${i === 2 ? 140 : 112}" text-anchor="middle" class="lbl" style="font-size:7.5px">${note}</text>
    </g>`).join('')}
  <text x="170" y="16" text-anchor="middle" class="lbl">the sun moves; so can you</text>` + close,

'light-quality': () => open() + `
  <g><text x="22" y="16" class="lbl">small source, far away → HARD</text>
    <circle cx="42" cy="46" r="6" class="acf"/>
    <path d="M48 48 106 70" class="dim"/><path d="M48 44 106 62" class="dim"/>
    <circle cx="124" cy="70" r="16" class="ln" fill="var(--surface-2)"/>
    <path d="M140 78 156 106" stroke="var(--ink)" stroke-width="10" opacity=".3" stroke-linecap="butt"/>
    <text x="120" y="122" class="lbl">shadow edge is a knife</text></g>
  <path d="M172 24v112" class="dim"/>
  <g><text x="196" y="16" class="lbl">large source, close → SOFT</text>
    <rect x="190" y="30" width="10" height="56" rx="3" class="ac" fill="var(--accent)" fill-opacity=".3"/>
    ${Array.from({ length: 7 }, (_, k) => `<path d="M201 ${34 + k * 8} 262 ${58 + k * 2}" class="dim" opacity=".6"/>`).join('')}
    <circle cx="282" cy="70" r="16" class="ln" fill="var(--surface-2)"/>
    <path d="M296 80 310 104" stroke="var(--ink)" stroke-width="10" opacity=".12" stroke-linecap="round"/>
    <text x="252" y="122" class="lbl">shadow edge is a gradient</text></g>` + close,

'kelvin': () => open(130) + `
  <defs><linearGradient id="kv" x1="0" x2="1">
    <stop offset="0" stop-color="#ff8c2b"/><stop offset=".28" stop-color="#ffc17a"/>
    <stop offset=".5" stop-color="#fff6ea"/><stop offset=".72" stop-color="#cfe2ff"/><stop offset="1" stop-color="#8fb6ff"/>
  </linearGradient></defs>
  <rect x="24" y="34" width="292" height="26" rx="5" fill="url(#kv)"/>
  ${[['1900', 'candle', 0], ['2800', 'bulb', .18], ['5500', 'midday', .5], ['6500', 'overcast', .68], ['8000', 'shade', .9]]
    .map(([k, l, t]) => `<g transform="translate(${24 + t * 292} 0)">
      <path d="M0 60v8" class="ln"/>
      <text x="0" y="80" text-anchor="middle" class="key" style="font-size:8px">${k}K</text>
      <text x="0" y="92" text-anchor="middle" class="lbl" style="font-size:7.5px">${l}</text></g>`).join('')}
  <text x="26" y="28" class="lbl">warm ←</text><text x="314" y="28" text-anchor="end" class="lbl">→ cool</text>
  <text x="170" y="118" text-anchor="middle" class="lbl">low numbers are warm — which feels backwards and simply has to be learned</text>` + close,

'golden-blue': () => open() + `
  <path d="M24 106h292" class="ln"/>
  <path d="M24 106a146 78 0 0 1 292 0" class="dim" stroke-dasharray="4 4"/>
  ${[[64, 'sunrise', 'golden'], [170, 'noon', 'harsh'], [276, 'sunset', 'golden']]
    .map(([x, l, k], i) => `<circle cx="${x}" cy="${i === 1 ? 30 : 100}" r="8" class="acf" opacity="${i === 1 ? .5 : 1}"/>
      <text x="${x}" y="${i === 1 ? 20 : 122}" text-anchor="middle" class="${k === 'golden' ? 'key' : 'lbl'}">${l}</text>`).join('')}
  <rect x="42" y="106" width="44" height="26" fill="var(--accent)" fill-opacity=".18"/>
  <rect x="254" y="106" width="44" height="26" fill="var(--accent)" fill-opacity=".18"/>
  <rect x="298" y="106" width="22" height="26" fill="var(--cyan)" fill-opacity=".22"/>
  <text x="64" y="146" text-anchor="middle" class="key" style="font-size:8px">golden</text>
  <text x="276" y="146" text-anchor="middle" class="key" style="font-size:8px">golden</text>
  <text x="310" y="146" text-anchor="middle" class="keyc" style="font-size:8px">blue</text>
  <text x="170" y="146" text-anchor="middle" class="lbl">flat, overhead, unflattering for faces</text>` + close,

'fill-flash': () => open() + `
  <g><text x="24" y="18" class="lbl" style="fill:var(--red)">direct flash ✗</text>
    ${cam(50, 76, .8)}<path d="M66 76h32" class="ac"/>
    <circle cx="122" cy="76" r="18" class="ln" fill="var(--surface)"/>
    <rect x="24" y="100" width="130" height="34" fill="var(--ink)" opacity=".2"/>
    <text x="88" y="122" text-anchor="middle" class="lbl">bright face, black room</text></g>
  <path d="M172 24v112" class="dim"/>
  <g><text x="196" y="18" class="key">bounced, −1.3 EV ✓</text>
    ${cam(222, 76, .8)}
    <path d="M232 68 274 36" class="ac"/><path d="M274 36 246 62" class="ac" stroke-dasharray="3 2"/>
    <path d="M196 30h130" class="ln"/>
    <circle cx="290" cy="76" r="18" class="ac" fill="var(--surface)"/>
    <text x="262" y="122" text-anchor="middle" class="lbl">ambient still shapes the frame</text></g>` + close,

'leading-lines': () => open() + `
  ${frame(24, 18, 292, 124, 'ln')}
  <path d="M24 142 148 62M316 142 188 62" class="ac" opacity=".7"/>
  <path d="M60 142 152 70M280 142 184 70" class="dim"/>
  ${person(168, 92, .95)}
  <circle cx="168" cy="78" r="20" class="ac" opacity=".45"/>
  <text x="168" y="140" text-anchor="middle" class="key">lines deliver the eye here</text>
  <text x="30" y="34" class="lbl">point them at the subject, never out of the frame</text>` + close,

'layers': () => open() + `
  ${frame(24, 18, 292, 124, 'ln')}
  <path d="M24 118h292v24H24z" fill="var(--ink)" opacity=".3"/>
  <path d="M24 92c60-16 120 10 292-8v34H24z" fill="var(--ink)" opacity=".16"/>
  <path d="M24 70c80-22 150 8 292-12v34H24z" fill="var(--ink)" opacity=".07"/>
  <text x="34" y="136" class="key">foreground — get within a metre</text>
  <text x="34" y="108" class="lbl">middle ground</text>
  <text x="34" y="62" class="lbl">background — paler, cooler, lower contrast</text>` + close,

'negative-space': () => open() + `
  ${frame(24, 18, 292, 124, 'ln')}
  <rect x="24" y="18" width="292" height="124" rx="3" class="fills"/>
  ${person(256, 116, .8)}
  <path d="M40 34h176" class="dim" stroke-dasharray="3 3"/>
  <path d="M40 34v92" class="dim" stroke-dasharray="3 3"/>
  <text x="48" y="82" class="lbl">negative space is not waste —</text>
  <text x="48" y="96" class="lbl">it is what gives the subject weight</text>` + close,

'zone-focus': () => open() + `
  ${cam(38, 84, .85)}
  <path d="M24 118h292" class="ln"/>
  <rect x="98" y="60" width="112" height="52" rx="3" fill="var(--accent)" fill-opacity=".18" class="ac"/>
  <path d="M154 52v66" class="ac" stroke-dasharray="3 3"/>
  <text x="154" y="46" text-anchor="middle" class="key">focus set at 3m</text>
  <text x="102" y="132" class="lbl">2m</text><text x="196" y="132" class="lbl">6m</text>
  <text x="216" y="88" class="key">everything in here is sharp</text>
  <text x="24" y="150" class="lbl">f/8 · manual focus · never wait for autofocus again</text>` + close,

'panning': () => open() + `
  ${cam(52, 100, .85)}
  <path d="M40 116a70 70 0 0 1 132 0" class="dim" stroke-dasharray="3 3"/>
  <path d="m162 108 10 8-10 8" class="dim"/>
  <text x="106" y="140" text-anchor="middle" class="lbl">turn from the hips · follow through after the shutter</text>
  ${Array.from({ length: 9 }, (_, k) => `<rect x="${196 + k * 13}" y="${40 + k * 0.4}" width="10" height="26" rx="2" fill="var(--line-strong)" opacity="${.14 + k * .02}"/>`).join('')}
  <circle cx="232" cy="52" r="17" class="ac" fill="var(--surface)" fill-opacity=".8"/>
  <text x="232" y="56" text-anchor="middle" class="key" style="font-size:8px">sharp</text>
  <text x="286" y="88" text-anchor="middle" class="lbl">streaked</text>` + close,

'long-exposure': () => open() + `
  ${[['1s', 0], ['4s', 1], ['15s', 2], ['30s', 3]].map(([lbl, i]) => `<g transform="translate(${18 + i * 82} 26)">
    <rect x="0" y="0" width="70" height="64" rx="4" class="ln" fill="var(--bg-sunk)"/>
    ${Array.from({ length: [4, 3, 2, 0][i] }, (_, k) => person(14 + k * 18, 52, .42, 'dim')).join('')}
    ${Array.from({ length: [1, 4, 10, 16][i] }, (_, k) =>
      `<path d="M6 ${20 + (k % 3) * 8}h${[10, 24, 46, 60][i]}" stroke="var(--accent)" stroke-width="1.6" opacity="${.85 - k * .04}" stroke-linecap="round"/>`).join('')}
    <text x="35" y="80" text-anchor="middle" class="key">${lbl}</text>
    <text x="35" y="92" text-anchor="middle" class="lbl" style="font-size:7.5px">${['people sharp', 'ghosts', 'smears', 'empty street'][i]}</text>
  </g>`).join('')}
  <text x="170" y="140" text-anchor="middle" class="lbl">the exposure length decides what exists in the frame</text>` + close,

'timelapse': () => open() + `
  ${Array.from({ length: 12 }, (_, k) => `<rect x="${20 + k * 26}" y="30" width="20" height="15" rx="2" class="ln fills"/>
    <circle cx="${30 + k * 26}" cy="37.5" r="${2 + k * 0.25}" class="acf" opacity=".8"/>`).join('')}
  <path d="M20 56h312" class="dim"/>
  ${Array.from({ length: 12 }, (_, k) => `<path d="M30 56 ${30 + k * 26} 62" class="dim" opacity=".3"/>`).join('')}
  <text x="20" y="76" class="lbl">interval ×  frame rate  =  speed-up factor</text>
  <text x="20" y="96" class="key">3s  ×  25 fps  =  75× real time</text>
  <rect x="20" y="106" width="312" height="26" rx="4" class="ac" fill="var(--accent)" fill-opacity=".1"/>
  <text x="176" y="123" text-anchor="middle" class="lbl">shutter ≈ half the interval, so movement blends between frames</text>` + close,

'pool-of-light': () => open() + `
  ${frame(24, 18, 292, 124, 'ln')}
  <rect x="24" y="18" width="292" height="124" rx="3" fill="var(--ink)" opacity=".16"/>
  <path d="M96 18 152 18 214 142 60 142Z" fill="var(--accent)" fill-opacity=".22"/>
  ${person(140, 128, 1.1)}
  <text x="228" y="60" class="key">frame the light</text>
  <text x="228" y="74" class="lbl">expose for it, let</text>
  <text x="228" y="86" class="lbl">the rest go black,</text>
  <text x="228" y="98" class="lbl">then wait.</text>` + close,

'portrait-light': () => open() + `
  <circle cx="120" cy="72" r="34" class="ln" fill="var(--surface-2)"/>
  <path d="M120 38a34 34 0 0 0 0 68z" fill="var(--ink)" opacity=".14"/>
  <path d="M104 62a6 6 0 1 1 .1 0M136 62a6 6 0 1 1 .1 0" class="ac"/>
  <circle cx="104" cy="62" r="2.4" class="acf"/>
  <path d="M104 40 92 40" class="ac"/><text x="30" y="43" class="key">focus the near eye</text>
  <path d="M132 88a12 8 0 0 0 -22 0" class="ln"/>
  <g transform="translate(238 46)"><circle cx="0" cy="0" r="8" class="acf" opacity=".85"/>
    ${Array.from({ length: 8 }, (_, k) => `<path d="M0 0l${Math.cos(k * .8) * 14} ${Math.sin(k * .8) * 14}" class="ac" opacity=".45"/>`).join('')}</g>
  <text x="238" y="86" text-anchor="middle" class="lbl">light at 45°</text>
  <text x="238" y="100" text-anchor="middle" class="lbl">above eye level</text>
  <text x="170" y="146" text-anchor="middle" class="lbl">50–105mm equivalent · stand back · sharp eyes above all</text>` + close,

'landscape-layers': () => open() + `
  ${frame(24, 18, 292, 124, 'ln')}
  <path d="M24 54c46-14 74 6 118-8s102 12 174-6v102H24z" fill="var(--ink)" opacity=".08"/>
  <path d="M24 84c58-18 96 12 146-4s86 16 146-4v66H24z" fill="var(--ink)" opacity=".18"/>
  <path d="M24 112c40 0 70-8 100 4s110 2 192-8v34H24z" fill="var(--ink)" opacity=".34"/>
  <path d="M56 142c8-22 20-26 28-2" class="ac" fill="var(--accent)" fill-opacity=".22"/>
  <text x="90" y="136" class="key">foreground within a metre</text>
  <path d="M24 92h292" class="ac" stroke-dasharray="3 3" opacity=".55"/>
  <text x="222" y="88" class="key" style="font-size:8px">focus here — not the horizon</text>` + close,

'moment': () => open() + `
  ${frame(24, 26, 292, 100, 'ac')}
  <path d="M24 26 316 126M316 26 24 126" class="dim" opacity=".25"/>
  <text x="170" y="18" text-anchor="middle" class="key">1 · compose and expose the empty frame</text>
  ${person(240, 116, .85, 'dim')}
  <path d="M60 76h146" class="dim" stroke-dasharray="4 3"/><path d="m200 72 6 4-6 4" class="dim"/>
  <text x="66" y="70" class="lbl">2 · wait</text>
  <circle cx="118" cy="90" r="24" class="ac" opacity=".4"/>
  <text x="118" y="146" text-anchor="middle" class="key">3 · fire when they reach the space you left</text>` + close,

'critique': () => open(150) + `
  ${['Subject — can a stranger name it?', 'Light — direction, and does it suit?', 'Background — anything that does not belong?',
     'Frame — edges deliberate, horizon straight?', 'Moment — the best instant available?', 'Technical — focus, sharpness, highlights?']
    .map((t, i) => `<g transform="translate(20 ${22 + i * 21})">
      <rect x="0" y="-9" width="13" height="13" rx="3" class="${i < 3 ? 'ac' : 'ln'}"/>
      ${i < 3 ? '<path d="m3 -3 3 3 5-6" class="ac" stroke-width="1.6"/>' : ''}
      <text x="22" y="1" style="font-size:9px">${t}</text></g>`).join('')}
  <text x="20" y="146" class="key">every critique ends in an action you could have taken at the time</text>` + close,
};

/* Some lessons are conceptual and a figure would be decoration. Those map to
   null deliberately rather than to filler. */
const ALIASES = { culling: null, 'edit-order': null, project: null };

export function diagram(name) {
  if (name in ALIASES) return ALIASES[name];
  return DIAGRAMS[name]?.() ?? null;
}
