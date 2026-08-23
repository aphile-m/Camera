/* ==========================================================================
   tools.js — the calculators.
   Each one is built to explain itself, not just to produce a number.
   ========================================================================== */

import { h, toast, fmtTime, rawSVG } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { Section, Card, Note, KV, OptGrid, Chips, Seg, Slider, Switch, Readout, Empty, Bullets } from '../ui/parts.js';
import * as store from '../core/store.js';
import { captureLocation } from '../core/geo.js';
import * as P from '../core/photo.js';
import { SCENES, SCENE_GROUPS, sceneById, TL_PRESETS } from '../data/scenes.js';
import { REFERENCE } from '../data/reference.js';

export const TOOLS = [
  { id:'advisor',   title:'Exposure advisor',  blurb:'Describe the scene; get settings and the reasoning behind them.', icon:'camera' },
  { id:'simulator', title:'Exposure simulator', blurb:'Move the three controls and watch what each one costs.',        icon:'target' },
  { id:'dof',       title:'Depth of field',    blurb:'What will be sharp, and where to focus for the most of it.',     icon:'layers' },
  { id:'light',     title:'Light timetable',   blurb:'Golden hour, blue hour and dark, for today, where you are.',     icon:'sun'    },
  { id:'long',      title:'Long exposure & ND',blurb:'How much filter you need, and how long the frame becomes.',      icon:'clock'  },
  { id:'timelapse', title:'Time-lapse planner',blurb:'Interval, frames, shooting time, card space and battery.',       icon:'refresh'},
  { id:'reference', title:'Field reference',   blurb:'The cards you check while shooting, not the ones you study.',    icon:'book'   },
];

export function ToolsView() {
  return h('div.stack-lg', { class: 'enter' },
    h('div', {},
      h('h1', { style: { marginTop: '6px' } }, 'Tools'),
      h('p', { class: 'lede', style: { marginTop: '6px' } },
        'Calculators that show their working. Use them to check your reasoning, not to replace it.')),
    h('div.card.flush', {}, ...TOOLS.map(t =>
      h('a.lesson-row', { href: `#/tools/${t.id}` },
        h('span.idx', { style: { border: 'none' } }, icon(t.icon, 18)),
        h('span.grow', {},
          h('span.t', { style: { display: 'block' } }, t.title),
          h('span.s', { style: { display: 'block' } }, t.blurb)),
        icon('chevron', 16)))));
}

const ToolShell = (title, blurb, ...content) =>
  h('div.stack-lg', { class: 'enter' },
    h('div', {},
      h('a.btn.btn-ghost.btn-sm', { href: '#/tools', style: { marginLeft: '-8px' } }, icon('back', 16), 'Tools'),
      h('h1', { style: { margin: '12px 0 6px' } }, title),
      blurb ? h('p', { class: 'lede' }, blurb) : null),
    ...content);

/* ======================================================================== */
/*  Exposure advisor                                                         */
/* ======================================================================== */

export function AdvisorView(state, rerender) {
  const s = state.__advisor ||= {
    light: 'cloud_bright', motion: 'static', intent: 'natural',
    focal: 35, lensId: state.gear.lenses[0]?.id, tripod: false, sceneId: null, group: SCENE_GROUPS[0],
  };
  const gear = state.gear;
  const lens = gear.lenses.find(l => l.id === s.lensId) || gear.lenses[0];
  const focal = P.clamp(s.focal, lens.min, lens.max);
  const r = P.advise({
    ev: P.lightById(s.light).ev, motion: s.motion, intent: s.intent,
    focal, lens, gear, tripod: s.tripod, steadiness: state.profile.steadiness || 0,
  });
  const set = patch => { Object.assign(s, patch); rerender(); };
  const scene = s.sceneId ? sceneById(s.sceneId) : null;

  const equivalents = P.equivalents(r.aperture, r.shutter, r.iso, { count: 4 })
    .filter(e => e.stops !== 0).slice(0, 4);

  return ToolShell('Exposure advisor',
    'Describe what is in front of you. The answer comes with its reasoning, because the reasoning is the part worth keeping.',

    /* Recipes */
    Section('Start from a recipe',
      Chips(SCENE_GROUPS.map(g => ({ id: g, label: g })), s.group, v => set({ group: v })),
      h('div.wrap', { style: { marginTop: '12px' } }, ...SCENES.filter(sc => sc.group === s.group).map(sc =>
        h('button.chip', {
          'aria-pressed': String(s.sceneId === sc.id),
          onClick: () => set({
            sceneId: sc.id, light: sc.light, motion: sc.motion, intent: sc.intent,
            focal: sc.focal, lensId: gear.lenses.find(l => l.id === sc.lens)?.id || gear.lenses[0].id,
            tripod: !!sc.tripod,
          }),
        }, sc.title)))),

    /* Manual controls */
    Section('Or describe it yourself',
      h('div.stack', {},
        h('div', {}, h('div.eyebrow', { style: { marginBottom: '8px' } }, 'The light'),
          OptGrid(P.LIGHT_LEVELS.map(l => ({ id: l.id, label: l.label, hint: l.hint })), s.light,
            v => set({ light: v, sceneId: null }), 'two')),
        h('div', {}, h('div.eyebrow', { style: { marginBottom: '8px' } }, 'What the subject is doing'),
          OptGrid(P.MOTION.map(m => ({ id: m.id, label: m.label, hint: m.hint })), s.motion,
            v => set({ motion: v, sceneId: null }), 'two')),
        h('div', {}, h('div.eyebrow', { style: { marginBottom: '8px' } }, 'What you want it to look like'),
          OptGrid(P.INTENTS.map(i => ({ id: i.id, label: i.label, hint: i.hint })), s.intent,
            v => set({ intent: v, sceneId: null }), 'two')),
        Card(
          h('div.stack', {},
            h('div', {}, h('div.eyebrow', { style: { marginBottom: '8px' } }, 'Lens'),
              Chips(gear.lenses.map(l => ({ id: l.id, label: l.label })), lens.id,
                v => { const nl = gear.lenses.find(x => x.id === v); set({ lensId: v, focal: P.clamp(s.focal, nl.min, nl.max) }); })),
            lens.min !== lens.max
              ? Slider({ label: 'Focal length', value: focal, min: lens.min, max: lens.max,
                  format: v => `${v}mm  ·  ${Math.round(v * (P.SENSORS[gear.sensor]?.crop || 1.5))}mm equivalent`,
                  onInput: v => { s.focal = v; rerender(); } })
              : h('div.small', {}, `Fixed at ${lens.min}mm (${Math.round(lens.min * (P.SENSORS[gear.sensor]?.crop || 1.5))}mm equivalent)`),
            Switch('On a tripod', s.tripod, v => set({ tripod: v }))))))
    ,

    /* The answer */
    Section('Set the camera to',
      Readout([
        { k: 'Aperture', v: P.fmtAperture(r.aperture), tone: 'amber', n: r.aperture <= 2.8 ? 'thin depth' : r.aperture >= 11 ? 'deep' : 'balanced' },
        { k: 'Shutter',  v: P.fmtShutter(r.shutter), tone: 'cyan',
          n: r.shutter >= 1 ? 'tripod' : r.shutter <= r.handheldLimit ? 'handheld ok' : 'brace yourself' },
        { k: 'ISO',      v: P.fmtISO(r.iso),
          tone: r.iso >= 6400 ? 'red' : r.iso >= 1600 ? 'amber' : 'green',
          n: r.iso <= 400 ? 'clean' : r.iso <= 3200 ? 'fine' : 'noisy' },
      ]),
      h('div', { style: { marginTop: '12px' } },
        Card(
          h('div.row-between', {},
            h('div.eyebrow', {}, 'Mode'),
            h('div', { class: 'num', style: { fontSize: '20px', color: 'var(--accent)', fontWeight: '600' } }, r.mode)),
          h('p', { class: 'small', style: { marginTop: '8px' } }, r.modeReason)))),

    Section('Why', Card(KV(r.why.map(w => [w.k, w.v])))),

    r.notes.length ? Section('Watch for',
      h('div.stack-sm', {}, ...r.notes.map(n => Note(n.tone, n.text)))) : null,

    Section('What will be sharp', Card(
      KV([
        ['Focused at', P.fmtDistance(r.subjectDistance, state.profile.units)],
        ['Sharp from', `${P.fmtDistance(r.dof.near, state.profile.units)} to ${P.fmtDistance(r.dof.far, state.profile.units)}`],
        ['Total depth', r.dof.total === Infinity ? 'to infinity' : P.fmtDistance(r.dof.total, state.profile.units)],
        ['Hyperfocal', `${P.fmtDistance(r.dof.hyperfocal, state.profile.units)} — focus there and everything from half that to infinity is sharp`],
      ]))),

    equivalents.length ? Section('The same brightness, a different photograph', Card(
      h('p', { class: 'small', style: { marginBottom: '12px' } },
        'Every one of these is exposed identically. They differ only in what they do to depth and to movement.'),
      h('div.kv', {}, ...equivalents.map(e => h('div', {},
        h('div.k', { class: 'num' }, `${e.stops > 0 ? '+' : ''}${e.stops} stop${Math.abs(e.stops) > 1 ? 's' : ''}`),
        h('div.v', { class: 'num' },
          `${P.fmtAperture(e.aperture)}  ·  ${P.fmtShutter(e.shutter)}  ·  ISO ${P.fmtISO(e.iso)}`)))))) : null,

    scene ? Section('Field craft', Card(
      h('p', { style: { fontSize: '15px', lineHeight: '1.6', color: 'var(--ink-2)' } }, scene.craft),
      h('div', { style: { marginTop: '12px' } }, Note('warn', scene.watch)))) : null,

    h('div', { style: { marginTop: '20px' } },
      h('a.btn.btn-block', { href: `#/journal/new?a=${r.aperture}&s=${r.shutter}&i=${r.iso}&f=${focal}` },
        icon('plus', 16), 'Log a frame with these settings')));
}

/* ======================================================================== */
/*  Exposure simulator                                                       */
/* ======================================================================== */

export function SimulatorView(state, rerender) {
  const s = state.__sim ||= { ev: 12, ap: 5.6, sh: 1 / 125, iso: 100 };
  const canvas = h('canvas', { width: 660, height: 440 });
  const badge = h('div.sim-badge', {});
  const meter = h('div', {});
  const effects = h('div', {});

  const draw = () => {
    const err = P.exposureError(s.ev, s.ap, s.sh, s.iso);   // + = over
    renderScene(canvas, { err, aperture: s.ap, shutter: s.sh, iso: s.iso });
    badge.textContent = `${P.fmtAperture(s.ap)}   ${P.fmtShutter(s.sh)}   ISO ${P.fmtISO(s.iso)}`;

    const off = Math.abs(err) < 0.34 ? 'good' : Math.abs(err) < 1.1 ? 'warn' : 'bad';
    meter.replaceChildren(Note(off,
      Math.abs(err) < 0.34 ? 'Correctly exposed. Now change one control and take the same brightness back with another.'
        : `${P.fmtStops(err)} stops ${err > 0 ? 'over' : 'under'}exposed. ${err > 0
            ? 'Highlights are being lost — those never come back.'
            : 'Shadows are being crushed, and lifting them later brings noise with them.'}`));

    const dof = P.depthOfField(35, s.ap, 3, { coc: 0.020 });
    effects.replaceChildren(KV([
      ['Depth of field', `${P.fmtDistance(dof.total)} at 3 metres on a 35mm lens — ${s.ap <= 2.8 ? 'one face, not two' : s.ap >= 11 ? 'a whole scene' : 'a comfortable margin'}`],
      ['Movement', s.sh >= 1 / 15 ? 'Anything moving becomes a streak, and so does your own hand.'
        : s.sh >= 1 / 160 ? 'Holds a still person. A walking one will smear.'
        : s.sh >= 1 / 500 ? 'Stops walking and gentle movement.' : 'Freezes running, sport, water in mid-air.'],
      ['Noise', s.iso <= 400 ? 'Clean. Full tonal detail in the shadows.'
        : s.iso <= 1600 ? 'Slight grain, invisible in print.'
        : s.iso <= 6400 ? 'Visible grain, some loss of shadow detail.' : 'Heavy grain and flattened colour.'],
    ]));
  };

  const apIdx = P.APERTURES.indexOf(P.nearestAperture(s.ap));
  const shIdx = P.SHUTTERS.indexOf(P.nearestShutter(s.sh));
  const isoIdx = P.ISOS.indexOf(P.nearestISO(s.iso));

  const view = ToolShell('Exposure simulator',
    'The fastest way to internalise the trade. Move one control, watch the picture change, then take the brightness back with another.',
    h('div.sim-frame', {}, canvas, badge),
    meter,
    Card(
      h('div.stack', {},
        h('div', {},
          h('div.eyebrow', { style: { marginBottom: '8px' } }, 'The light in the scene'),
          Chips(P.LIGHT_LEVELS.filter(l => l.ev >= 3).map(l => ({ id: l.id, label: l.label })),
            P.LIGHT_LEVELS.find(l => l.ev === s.ev)?.id,
            v => { s.ev = P.lightById(v).ev; draw(); })),
        Slider({ label: 'Aperture', value: apIdx, min: 0, max: P.APERTURES.length - 1,
          format: i => P.fmtAperture(P.APERTURES[i]), onInput: i => { s.ap = P.APERTURES[i]; draw(); } }),
        Slider({ label: 'Shutter', value: shIdx, min: 0, max: P.SHUTTERS.indexOf(30),
          format: i => P.fmtShutter(P.SHUTTERS[i]), onInput: i => { s.sh = P.SHUTTERS[i]; draw(); } }),
        Slider({ label: 'ISO', value: isoIdx, min: 0, max: P.ISOS.indexOf(25600),
          format: i => P.fmtISO(P.ISOS[i]), onInput: i => { s.iso = P.ISOS[i]; draw(); } }),
        h('button.btn.btn-sm', { onClick: () => {
          const t = P.nearestShutter(P.shutterFor(s.ev, s.ap, s.iso));
          s.sh = t; draw(); rerender();
        } }, 'Fix the exposure with shutter'))),
    Section('What you just changed', Card(effects)),
    Note('info', 'Try this: set it correctly, then open the aperture two stops. Now take two stops back from the shutter. The brightness returns; the photograph does not.'));

  queueMicrotask(draw);
  return view;
}

/* A small synthetic scene: a lit subject at a known distance, a background
   well behind it, and one moving element. Enough to show depth of field,
   motion and noise honestly — and no more than that. */
function renderScene(canvas, { err, aperture, shutter, iso }) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const gain = Math.pow(2, P.clamp(err, -5, 4));
  const horizon = H * 0.68;

  ctx.clearRect(0, 0, W, H);

  /* ---- Background, blurred in proportion to the aperture ---------------- */
  const blur = P.clamp(120 / (aperture * aperture), 0, 30);
  ctx.save();
  ctx.filter = `blur(${blur.toFixed(1)}px)`;

  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, '#4a5f74'); sky.addColorStop(1, '#8f8873');
  ctx.fillStyle = sky;
  ctx.fillRect(-50, -50, W + 100, horizon + 60);

  /* Buildings and trees, so the blur has edges to destroy */
  const forms = [[40, 210, 76], [150, 150, 58], [250, 190, 92], [378, 130, 64], [470, 200, 70], [560, 165, 84]];
  for (const [x, top, w] of forms) {
    ctx.fillStyle = '#3b4340';
    ctx.fillRect(x, top, w, horizon - top + 10);
    ctx.fillStyle = '#2d3431';
    ctx.fillRect(x, top, w * 0.35, horizon - top + 10);
  }
  /* Specular points — the classic tell for how much a lens is opened up */
  for (let i = 0; i < 12; i++) {
    const x = 34 + (i * 149) % (W - 60), y = 70 + (i * 83) % 150;
    ctx.beginPath(); ctx.arc(x, y, 8, 0, 7);
    ctx.fillStyle = 'rgba(255,224,166,.85)'; ctx.fill();
  }
  ctx.restore();

  /* ---- Ground ----------------------------------------------------------- */
  const ground = ctx.createLinearGradient(0, horizon, 0, H);
  ground.addColorStop(0, '#6b6047'); ground.addColorStop(1, '#3a3427');
  ctx.fillStyle = ground; ctx.fillRect(0, horizon, W, H - horizon);

  /* ---- The moving element, smeared in proportion to the shutter --------- */
  const smearPx = P.clamp(shutter * 3000, 0, 340);
  ctx.save();
  const startX = 54;
  if (smearPx > 3) {
    ctx.globalAlpha = P.clamp(0.9 - smearPx / 460, 0.16, 0.9);
    const steps = Math.min(46, Math.max(2, Math.round(smearPx / 7)));
    for (let k = 0; k < steps; k++) {
      ctx.fillStyle = '#d9a441';
      ctx.fillRect(startX + (k / (steps - 1)) * smearPx, horizon - 62, 30, 62);
    }
  } else {
    ctx.fillStyle = '#d9a441';
    ctx.fillRect(startX, horizon - 62, 30, 62);
  }
  ctx.restore();

  /* ---- The subject: always sharp, because it is what you focused on ----- */
  const cx = W * 0.68, cy = horizon - 122;
  ctx.save();
  ctx.fillStyle = '#7d6a4e';
  ctx.beginPath();
  ctx.moveTo(cx - 52, horizon + 6); ctx.lineTo(cx - 38, cy + 46);
  ctx.lineTo(cx + 38, cy + 46); ctx.lineTo(cx + 52, horizon + 6);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e3d3b6';
  ctx.beginPath(); ctx.arc(cx, cy, 46, 0, 7); ctx.fill();
  ctx.fillStyle = '#33291d';
  ctx.beginPath(); ctx.arc(cx - 16, cy - 6, 5.5, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 16, cy - 6, 5.5, 0, 7); ctx.fill();
  ctx.strokeStyle = '#33291d'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(cx, cy + 8, 17, 0.35, Math.PI - 0.35); ctx.stroke();
  ctx.restore();

  /* ---- Exposure and grain ---------------------------------------------- */
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  const grain = Math.max(0, Math.log2(iso / 200)) * 8;
  for (let i = 0; i < d.length; i += 4) {
    const n = grain ? (Math.random() - 0.5) * grain * 2 : 0;
    d[i]     = P.clamp(d[i]     * gain + n,       0, 255);
    d[i + 1] = P.clamp(d[i + 1] * gain + n * 0.9, 0, 255);
    d[i + 2] = P.clamp(d[i + 2] * gain + n * 1.1, 0, 255);
  }
  ctx.putImageData(img, 0, 0);
}

/* ======================================================================== */
/*  Depth of field                                                           */
/* ======================================================================== */

export function DofView(state, rerender) {
  const s = state.__dof ||= { lensId: state.gear.lenses[0].id, focal: 35, aperture: 5.6, distance: 3 };
  const gear = state.gear;
  const sensor = P.SENSORS[gear.sensor] || P.SENSORS.apsc;
  const lens = gear.lenses.find(l => l.id === s.lensId) || gear.lenses[0];
  const focal = P.clamp(s.focal, lens.min, lens.max);
  const wideOpen = P.maxAperture ? P.maxApertureAt(lens, focal) : 3.5;
  const aperture = P.nearestAperture(Math.max(s.aperture, wideOpen));
  const d = P.depthOfField(focal, aperture, s.distance, { coc: sensor.coc });
  const u = state.profile.units;
  const diffraction = P.diffractionLimit(gear.sensor, gear.megapixels);

  const apIdx = P.APERTURES.indexOf(aperture);
  const near = d.near, far = d.far;

  /* A to-scale strip showing where the sharp zone falls */
  const scale = v => {
    const max = isFinite(far) ? Math.min(far * 1.25, s.distance * 4) : s.distance * 4;
    return P.clamp((Math.log10(v + 0.35) / Math.log10(max + 0.35)) * 100, 0, 100);
  };
  const strip = h('div', { style: { position: 'relative', height: '54px', borderRadius: 'var(--r)', background: 'var(--surface-2)', border: '1px solid var(--line)', overflow: 'hidden' } },
    h('div', { style: {
      position: 'absolute', top: '0', bottom: '0',
      left: `${scale(near)}%`, right: `${isFinite(far) ? 100 - scale(far) : 0}%`,
      background: 'color-mix(in srgb, var(--accent) 26%, transparent)',
      borderLeft: '2px solid var(--accent)',
      borderRight: isFinite(far) ? '2px solid var(--accent)' : 'none',
    } }),
    h('div', { style: { position: 'absolute', top: '0', bottom: '0', left: `${scale(s.distance)}%`, width: '2px', background: 'var(--ink)' } }),
    h('div', { class: 'tiny num', style: { position: 'absolute', left: '8px', bottom: '5px' } }, P.fmtDistance(near, u)),
    h('div', { class: 'tiny num', style: { position: 'absolute', right: '8px', bottom: '5px' } }, isFinite(far) ? P.fmtDistance(far, u) : '∞'));

  return ToolShell('Depth of field',
    'What will actually be sharp — and where to put the focus so that the most of the scene is.',
    Card(h('div.stack', {},
      h('div', {}, h('div.eyebrow', { style: { marginBottom: '8px' } }, 'Lens'),
        Chips(gear.lenses.map(l => ({ id: l.id, label: l.label })), lens.id,
          v => { const nl = gear.lenses.find(x => x.id === v); s.lensId = v; s.focal = P.clamp(s.focal, nl.min, nl.max); rerender(); })),
      lens.min !== lens.max
        ? Slider({ label: 'Focal length', value: focal, min: lens.min, max: lens.max,
            format: v => `${v}mm`, onInput: v => { s.focal = v; rerender(); } })
        : null,
      Slider({ label: 'Aperture', value: apIdx, min: P.APERTURES.indexOf(P.nearestAperture(wideOpen)), max: P.APERTURES.indexOf(22),
        format: i => P.fmtAperture(P.APERTURES[i]), onInput: i => { s.aperture = P.APERTURES[i]; rerender(); } }),
      Slider({ label: 'Distance to subject', value: Math.round(s.distance * 10), min: 3, max: 300,
        format: v => P.fmtDistance(v / 10, u), onInput: v => { s.distance = v / 10; rerender(); } }))),

    strip,

    Readout([
      { k: 'Sharp from', v: P.fmtDistance(near, u), tone: 'cyan' },
      { k: 'Total depth', v: d.total === Infinity ? '∞' : P.fmtDistance(d.total, u), tone: 'amber' },
      { k: 'Sharp to', v: isFinite(far) ? P.fmtDistance(far, u) : '∞', tone: 'cyan' },
    ]),

    Card(KV([
      ['In front', `${P.fmtDistance(d.inFront, u)} — about a third of the zone`],
      ['Behind', isFinite(d.behind) ? `${P.fmtDistance(d.behind, u)} — about two thirds` : 'to infinity'],
      ['Hyperfocal', `${P.fmtDistance(d.hyperfocal, u)} — focus there and everything from ${P.fmtDistance(d.hyperfocal / 2, u)} to infinity is sharp`],
    ])),

    h('div.stack-sm', {},
      d.total < 0.15 ? Note('warn', `A sharp zone of ${P.fmtDistance(d.total, u)} is thinner than a face. Focus on the near eye and do not recompose after focusing.`) : null,
      aperture > diffraction ? Note('info', `Past ${P.fmtAperture(diffraction)} on this sensor, diffraction begins softening the whole frame. If you need more depth than this, focus-stack instead of stopping down further.`) : null,
      s.distance >= d.hyperfocal ? Note('good', 'You are focused at or beyond the hyperfocal distance, so the far edge of the sharp zone reaches infinity. This is the setting for a landscape.') : null),

    Note('info', 'Three things control depth of field, not one: aperture, distance to subject, and focal length. Halving the distance thins the sharp zone far more than opening a stop does — try it on the sliders.'));
}

/* ======================================================================== */
/*  Light timetable                                                          */
/* ======================================================================== */

export function LightView(state, rerender) {
  const loc = state.location;
  if (!loc) {
    return ToolShell('Light timetable', 'Golden hour and blue hour move with the season and with where you are standing.',
      Card(
        h('p', { class: 'small', style: { marginBottom: '14px' } },
          'Set a location and this becomes a daily timetable. It is stored on this device and never leaves it.'),
        h('button.btn.btn-primary.btn-block', {
          onClick: async e => {
            const btn = e.currentTarget;
            btn.textContent = 'Locating…'; btn.disabled = true;
            try { await captureLocation(); rerender(); }
            catch (err) { btn.disabled = false; btn.textContent = 'Use my location'; toast(err.message); }
          },
        }, icon('compass', 17), 'Use my location'),
        h('a.btn.btn-block.btn-ghost', { href: '#/settings', style: { marginTop: '8px' } }, 'Enter it manually')));
  }

  const now = new Date();
  const offset = state.__lightDay || 0;
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 12);
  const t = P.sunTimes(day, loc.lat, loc.lon);
  const pos = P.sunPosition(now, loc.lat, loc.lon);
  const light = P.lightNow(now, loc.lat, loc.lon);

  const windows = [
    { k: 'Astronomical dawn', v: t.nightEnd,      note: 'The sky begins to lighten. Last chance for the Milky Way.' },
    { k: 'Blue hour begins',  v: t.dawn,          note: 'Deep blue sky, city lights still on. Tripod.' },
    { k: 'Sunrise',           v: t.sunrise,       note: 'Low, warm, directional. Be in position already.' },
    { k: 'Golden hour ends',  v: t.goldenHourEnd, note: 'The soft light is over. Switch to texture and shadow.' },
    { k: 'Solar noon',        v: t.solarNoon,     note: 'The sun is at its highest. The hardest light of the day.' },
    { k: 'Golden hour begins',v: t.goldenHour,    note: 'The best forty minutes of the day for people.' },
    { k: 'Sunset',            v: t.sunset,        note: 'Do not pack up. The next twenty minutes are the good part.' },
    { k: 'Blue hour',         v: t.blueHour,      note: 'Sky and artificial light balance. Best light for a city.' },
    { k: 'Dark',              v: t.dusk,          note: 'Civil twilight over. Long exposures and lit subjects only.' },
  ].filter(w => w.v);

  const nextIdx = windows.findIndex(w => w.v > now);

  return ToolShell('Light timetable',
    `${loc.label || 'Your location'} · ${day.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}`,

    offset === 0 ? Card(
      h('div.row', { style: { gap: '12px' } },
        h('div', { style: { color: 'var(--accent)' } }, icon(pos.altitude > 0 ? 'sun' : 'moon', 26)),
        h('div.grow', {},
          h('div', { style: { fontWeight: '600', fontSize: '16px' } }, light.label),
          h('div.tiny', { class: 'num', style: { marginTop: '3px' } },
            `sun ${pos.altitude > 0 ? '+' : ''}${pos.altitude.toFixed(1)}° · bearing ${Math.round(pos.azimuth)}°`))),
      h('p', { class: 'small', style: { marginTop: '11px' } }, light.advice)) : null,

    h('div.card.flush', {}, ...windows.map((w, i) => h('div', {
      style: {
        display: 'flex', gap: '14px', padding: '13px 16px',
        borderBottom: i < windows.length - 1 ? '1px solid var(--line)' : 'none',
        background: i === nextIdx && offset === 0 ? 'var(--accent-wash)' : 'transparent',
      },
    },
      h('div.num', { style: { flex: 'none', minWidth: '76px', whiteSpace: 'nowrap', fontWeight: '600', fontSize: '13.5px', color: i === nextIdx && offset === 0 ? 'var(--accent)' : 'var(--ink)' } }, fmtTime(w.v)),
      h('div.grow', {},
        h('div', { style: { fontSize: '14px', fontWeight: '600' } }, w.k),
        h('div.tiny', { style: { marginTop: '2px' } }, w.note))))),

    h('div.row', { style: { gap: '8px' } },
      h('button.btn.btn-sm', { style: { flex: '1' }, onClick: () => { state.__lightDay = offset - 1; rerender(); } }, '← Yesterday'),
      offset !== 0 ? h('button.btn.btn-sm', { style: { flex: '1' }, onClick: () => { state.__lightDay = 0; rerender(); } }, 'Today') : null,
      h('button.btn.btn-sm', { style: { flex: '1' }, onClick: () => { state.__lightDay = offset + 1; rerender(); } }, 'Tomorrow →')),

    Note('info', 'Golden hour is a sun-elevation window, not a fixed hour — it is long near the poles and brutally short near the equator. Arrive thirty minutes before it opens and let the light come to a frame you have already found.'));
}

/* ======================================================================== */
/*  Long exposure & ND                                                       */
/* ======================================================================== */

export function LongExposureView(state, rerender) {
  const s = state.__nd ||= { metered: 1 / 60, stops: 10 };
  const result = P.withND(s.metered, s.stops);
  const shIdx = P.SHUTTERS.indexOf(P.nearestShutter(s.metered));

  const LOOKS = [
    { t: '1/4 – 1s',  d: 'Water keeps texture; movement is suggested rather than smoothed.' },
    { t: '1 – 4s',    d: 'The classic silky waterfall. Cloud begins to streak.' },
    { t: '4 – 15s',   d: 'Continuous light trails. Water becomes mist. People blur to ghosts.' },
    { t: '15 – 60s',  d: 'Cloud draws long lines. Moving people disappear entirely.' },
    { t: '2 min +',   d: 'Water becomes glass, sky becomes a single gesture. Neutral-density stacking territory.' },
  ];

  return ToolShell('Long exposure & ND',
    'Two questions: how long does this filter make the frame, and how much filter do I need to reach the look I want.',

    Card(h('div.stack', {},
      Slider({ label: 'Metered shutter speed (no filter)', value: shIdx, min: 0, max: P.SHUTTERS.indexOf(30),
        format: i => P.fmtShutter(P.SHUTTERS[i]), onInput: i => { s.metered = P.SHUTTERS[i]; rerender(); } }),
      h('div', {},
        h('div.eyebrow', { style: { marginBottom: '8px' } }, 'Filter'),
        Chips(P.ND_FILTERS.map(f => ({ id: f.stops, label: f.label })), s.stops, v => { s.stops = v; rerender(); })))),

    Readout([
      { k: 'Without filter', v: P.fmtShutter(s.metered), tone: 'cyan' },
      { k: 'Stops', v: `−${s.stops}`, tone: 'amber' },
      { k: 'With filter', v: P.fmtShutter(result), tone: 'amber', n: result > 30 ? 'bulb mode' : 'timer' },
    ]),

    result > 30 ? Note('warn', `${P.fmtShutter(result)} is longer than the 30-second maximum on most cameras. Switch to Bulb and time it yourself, or use a remote with a timer.`) : null,
    result >= 1 ? Note('info', 'Long exposures need the eyepiece covered on a DSLR — light entering through the viewfinder will fog the frame.') : null,

    Section('What each length looks like',
      h('div.card.flush', {}, ...LOOKS.map((l, i) => h('div', {
        style: { padding: '12px 16px', borderBottom: i < LOOKS.length - 1 ? '1px solid var(--line)' : 'none' },
      },
        h('div.num', { style: { color: 'var(--accent)', fontWeight: '600', fontSize: '13px' } }, l.t),
        h('div.small', { style: { marginTop: '3px' } }, l.d))))),

    Section('Setting up', Card(KV([
      ['Order', 'Compose, focus and meter first. Fit the filter last — a 10-stop is too dark to focus or compose through.'],
      ['Focus', 'Autofocus, then switch to manual so nothing hunts once the filter is on.'],
      ['Mode', 'Manual. Set the metered exposure, then dial in the filter’s stops.'],
      ['Stability', 'Tripod, stabilisation off, two-second timer or a remote release.'],
      ['Eyepiece', 'Cover it. Stray light through the viewfinder fogs long frames.'],
    ]))));
}

/* ======================================================================== */
/*  Time-lapse planner                                                       */
/* ======================================================================== */

export function TimelapseView(state, rerender) {
  const s = state.__tl ||= { preset: 'clouds', interval: 4, clip: 15, fps: 25, format: 'jpeg' };
  const r = P.timelapse({ interval: s.interval, clipSeconds: s.clip, fps: s.fps, format: s.format });
  const preset = TL_PRESETS.find(p => p.id === s.preset);
  const light = P.lightById(preset?.light || 'cloud_bright');
  const shutter = P.nearestShutter(Math.min(r.idealShutter, r.maxShutter));
  const iso = P.nearestISO(P.isoFor(light.ev, preset?.aperture || 8, shutter));
  const batteries = Math.ceil(r.frames / r.batteryFrames);

  return ToolShell('Time-lapse planner',
    'A time-lapse is one photograph repeated hundreds of times. Everything except time has to be locked.',

    Section('What are you shooting',
      h('div.wrap', {}, ...TL_PRESETS.map(p =>
        h('button.chip', {
          'aria-pressed': String(s.preset === p.id),
          onClick: () => { Object.assign(s, { preset: p.id, interval: p.interval, clip: p.clip }); rerender(); },
        }, h('span', { style: { color: 'var(--accent)' } }, p.icon), p.title)))),

    Card(h('div.stack', {},
      Slider({ label: 'Interval between frames', value: Math.round(s.interval * 2), min: 1, max: 1200,
        format: v => P.fmtDuration(v / 2), onInput: v => { s.interval = v / 2; rerender(); } }),
      Slider({ label: 'Finished clip length', value: s.clip, min: 5, max: 60,
        format: v => `${v}s`, onInput: v => { s.clip = v; rerender(); } }),
      h('div', {}, h('div.eyebrow', { style: { marginBottom: '8px' } }, 'Frame rate'),
        Seg([{ id: 24, label: '24 fps' }, { id: 25, label: '25 fps' }, { id: 30, label: '30 fps' }], s.fps,
          v => { s.fps = v; rerender(); })),
      h('div', {}, h('div.eyebrow', { style: { marginBottom: '8px' } }, 'Format'),
        Seg([{ id: 'jpeg', label: 'JPEG' }, { id: 'raw', label: 'RAW' }, { id: 'both', label: 'Both' }], s.format,
          v => { s.format = v; rerender(); })))),

    Readout([
      { k: 'Frames', v: r.frames.toLocaleString(), tone: 'amber' },
      { k: 'Shooting time', v: P.fmtDuration(r.shootingSeconds), tone: 'cyan' },
      { k: 'Speed-up', v: `${Math.round(r.speedUp)}×`, tone: 'amber' },
    ]),

    Card(KV([
      ['Card space', `${r.cardMB >= 1024 ? (r.cardMB / 1024).toFixed(1) + ' GB' : Math.round(r.cardMB) + ' MB'} in ${s.format.toUpperCase()}`],
      ['Batteries', `${batteries} — a healthy DSLR battery gives roughly ${r.batteryFrames} frames`],
      ['Shutter per frame', `${P.fmtShutter(shutter)} — about half the interval, so movement blends between frames`],
      ['Suggested exposure', `${P.fmtAperture(preset?.aperture || 8)} · ${P.fmtShutter(shutter)} · ISO ${P.fmtISO(iso)} in ${light.label.toLowerCase()}`],
    ])),

    r.idealShutter > 1 / 60 && light.ev >= 11
      ? Note('warn', `To hold ${P.fmtShutter(shutter)} in this light you will need about ${Math.max(1, Math.round(P.ndNeeded(P.shutterFor(light.ev, preset?.aperture || 8, 100), shutter)))} stops of neutral density. Without it, use a shorter exposure and accept slightly steppier motion.`)
      : null,
    r.frames > 1200 ? Note('warn', `${r.frames.toLocaleString()} frames is a long shoot and a meaningful chunk of your shutter’s rated life. Consider a shorter clip or a higher interval.`) : null,

    preset ? Note('info', preset.note) : null,

    Section('Lock these before you start', Card(KV([
      ['Mode', 'Manual. Never a priority mode — the exposure must not drift.'],
      ['Focus', 'Manual, set and then left alone. Autofocus will hunt between frames.'],
      ['White balance', 'A fixed preset. Auto white balance is the single most common cause of flicker.'],
      ['Long-exposure NR', 'Off. It doubles the gap between frames.'],
      ['Interval timer', 'Shooting menu → Interval timer shooting → set interval and shot count.'],
      ['Stability', 'Tripod, weighted if there is any wind. Do not touch the camera once it starts.'],
    ]))));
}

/* ======================================================================== */
/*  Field reference                                                          */
/* ======================================================================== */

export function ReferenceView(state, rerender) {
  const openId = state.__ref || REFERENCE[0].id;
  return ToolShell('Field reference',
    'The cards you check while shooting. Short, and meant to be read one-handed.',
    ...REFERENCE.map(card => {
      const open = card.id === openId;
      return h('div.card', { style: { padding: '0', overflow: 'hidden', marginTop: '10px' } },
        h('button', {
          style: { width: '100%', display: 'flex', gap: '12px', alignItems: 'center', padding: '15px 17px', textAlign: 'left' },
          onClick: () => { state.__ref = open ? null : card.id; rerender(); },
        },
          h('span', { style: { color: 'var(--accent)', fontSize: '17px', flex: 'none' } }, card.icon),
          h('span.grow', { style: { fontWeight: '600', fontSize: '15px' } }, card.title),
          h('span', { style: { color: 'var(--faint)', transform: open ? 'rotate(90deg)' : '', transition: 'transform .2s' } }, icon('chevron', 15))),
        open ? h('div', { style: { padding: '0 17px 17px' } },
          h('p', { class: 'small', style: { marginBottom: '13px' } }, card.intro),
          h('div.kv', {}, ...card.rows.map(([k, v]) =>
            h('div', { style: { gridTemplateColumns: 'minmax(96px, 38%) 1fr' } },
              h('div.k', { style: { textTransform: 'none', letterSpacing: '0', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--accent)' } }, k),
              h('div.v', {}, v))))) : null);
    }));
}
