/* Some cards are computed from the user's actual gear, so the reference can
   never drift from what the advisor works out. Those declare `rows` as a
   function of the gear rather than a fixed array. */
import { handheldLimit, nearestShutter, fmtShutter, fmtAperture, fmtDistance, SENSORS } from '../core/photo.js';

/* ==========================================================================
   reference.js — the cards you check in the field, not the ones you study.
   ========================================================================== */

export const REFERENCE = [
  {
    id:'your-kit', title:'Your kit, honestly', icon:'◎',
    intro:'Two AF-P DX zooms on a D5300. What each is for, and where the kit runs out — knowing the second is worth more than knowing the first.',
    rows: gear => [
      ...gear.lenses.map(l => [
        l.label,
        `${l.min === l.max ? `${l.min}mm` : `${l.min}–${l.max}mm`}, ${fmtAperture(l.wideAperture)}`
        + `${l.wideAperture !== l.longAperture ? `–${fmtAperture(l.longAperture)}` : ''}`
        + `${l.minFocus ? `. Focuses to ${fmtDistance(l.minFocus)}` : ''}`
        + `${l.filter ? `, ${l.filter}mm filter` : ''}`
        + `${l.stabilised ? '. VR.' : '. No VR.'}`,
      ]),
      ['The gap', 'Nothing between 55mm and 70mm. In practice you swap lenses rather than zoom through it, so decide which one is on the camera before you leave.'],
      ['No VR on the 70–300', 'The single most important fact about this kit. At 300mm you need about 1/900s handheld. Rest it on a wall, a bag or a car roof — that buys more than any setting.'],
      ['Nothing faster than f/3.5', 'Indoors and after dark you buy exposure with ISO, not aperture. ISO 3200 is normal, not a failure. Blur is the mistake you cannot fix; noise is not.'],
      ['Blur without fast glass', 'Length and distance, not aperture. 300mm, subject close to you, background far behind them, beats f/1.8 at 35mm for separation.'],
      ['AF-P means no switches', 'VR and manual focus live in the camera menu, not on the barrel. Shooting menu → Optical VR, and the focus-mode control on the body.'],
      ['AF-P quirk', 'Focus does not hold when the camera sleeps or powers off. After a nap, refocus before you trust it — especially if you set focus manually for stars.'],
      ['Firmware', 'The D5300 needs firmware C 1.02 or later to drive AF-P lenses at all. If either lens misbehaves, check that first.'],
    ],
  },
  {
    id:'first-five', title:'The first five seconds', icon:'◈',
    intro:'Before every frame, in this order. It takes a second and it saves more photographs than any accessory.',
    rows:[
      ['Subject',    'What is this a photograph of? Name it in three words.'],
      ['Light',      'Where is it coming from? Does it suit the subject?'],
      ['Background', 'Sweep the edges. Anything bright, merging, or growing out of a head?'],
      ['Distance',   'Could you be closer? You almost always could.'],
      ['Settings',   'Aperture for depth, shutter for movement, ISO to balance.'],
    ],
  },
  {
    id:'stops', title:'The stop ladders', icon:'≡',
    intro:'Each step is one stop: a doubling or halving of light. Three clicks on most cameras.',
    rows:[
      ['Aperture', 'f/1.4 · 2 · 2.8 · 4 · 5.6 · 8 · 11 · 16 · 22'],
      ['Shutter',  '1/1000 · 1/500 · 1/250 · 1/125 · 1/60 · 1/30 · 1/15 · 1/8 · 1/4 · 1/2 · 1s'],
      ['ISO',      '100 · 200 · 400 · 800 · 1600 · 3200 · 6400 · 12800'],
      ['Trade',    'Two stops given to one control, two taken from another: same brightness, different photograph.'],
    ],
  },
  {
    id:'handheld-floors', title:'Your handheld floors', icon:'⌇',
    intro:'The slowest shutter each lens will forgive at each end, worked out for your body and whether that lens has VR. Below these, brace against something or put it down.',
    rows: gear => {
      const crop = (SENSORS[gear.sensor] || SENSORS.apsc).crop;
      const out = [];
      for (const l of gear.lenses) {
        /* Round mid-points to something you would actually set on the barrel. */
        const mid = [24, 35, 50, 105, 135, 150, 200]
          .filter(f => f > l.min && f < l.max)
          .sort((a, b) => Math.abs(a - (l.min + l.max) / 2) - Math.abs(b - (l.min + l.max) / 2))[0];
        const points = l.min === l.max ? [l.min] : [l.min, mid, l.max].filter(Boolean);
        for (const f of points) {
          out.push([
            `${f}mm · ${l.label.split(' ')[0]}`,
            /* Snap to a speed the camera actually offers, not a raw fraction. */
            `${fmtShutter(nearestShutter(handheldLimit(f, { crop, stabilised: l.stabilised })))}`
            + (l.stabilised ? ' — VR is doing the work' : ' — no VR'),
          ]);
        }
      }
      out.push(['Anything moving',
        'These only stop your own shake. A walking person still needs 1/250 whatever the lens is doing.']);
      return out;
    },
  },
  {
    id:'shutter-guide', title:'Shutter speed by subject', icon:'⧗',
    intro:'Freeze it, or draw it. Handheld, never go below 1 ÷ (focal length × crop factor).',
    rows:[
      ['1/2000+',  'Birds in flight, splashing water, wingtips'],
      ['1/1000',   'Most sport, running dogs, cyclists'],
      ['1/500',    'Running children, fast walking, street from a car'],
      ['1/250',    'Walking people, gentle movement, safe default'],
      ['1/125',    'Standing person, still life, handheld at normal focal lengths'],
      ['1/60–1/30','Panning a cyclist; braced handheld only'],
      ['1/15–1/4', 'Motion blur on purpose. Tripod or something solid.'],
      ['1s–30s',   'Silky water, light trails, empty streets. Tripod, timer, no stabilisation.'],
    ],
  },
  {
    id:'exposure-comp', title:'Exposure compensation', icon:'±',
    intro:'Your meter assumes the world averages to mid-grey. Tell it when it does not.',
    rows:[
      ['Snow, white wall, pale sand', '+1.7'],
      ['Light skin in sun, bright sky', '+0.7'],
      ['Backlit subject', '+1.0 (or spot-meter the face)'],
      ['Mid-tone: grass, tarmac, skin in shade', '0'],
      ['Dark clothing, deep shade, black fur', '−1.3'],
      ['Bright subject in a dark scene', '−1.3'],
    ],
  },
  {
    id:'sunny16', title:'Sunny 16', icon:'☀',
    intro:'Meterless sanity check. At f/16, shutter ≈ 1 over your ISO. Then trade stops from there.',
    rows:[
      ['Hard sun, black shadows',      'f/16'],
      ['Hazy sun, soft-edged shadows', 'f/11'],
      ['Bright cloud, faint shadows',  'f/8'],
      ['Overcast, no shadows',         'f/5.6'],
      ['Open shade or heavy overcast',  'f/4'],
      ['Golden hour, low sun',          'f/2.8'],
    ],
  },
  {
    id:'focus', title:'Focus modes', icon:'◎',
    intro:'Two decisions: when it focuses, and where it looks.',
    rows:[
      ['AF-S',          'Focus once and lock. Portraits, landscape, still life.'],
      ['AF-C',          'Keeps focusing while half-pressed. Anything moving.'],
      ['Single point',  'You choose exactly where. The default.'],
      ['Dynamic area',  'Your point plus neighbours. Erratic movement.'],
      ['Auto area',     'The camera guesses. It will pick the nearest railing.'],
      ['Back-button',   'Focus moved to a rear button. Focus once, shoot ten frames.'],
    ],
  },
  {
    id:'dof-rules', title:'Depth of field', icon:'◑',
    intro:'Three things control it, and aperture is only one of them.',
    rows:[
      ['Wider aperture',      'Thinner sharp zone, softer background'],
      ['Closer to subject',   'Thinner sharp zone — often the strongest lever of the three'],
      ['Longer focal length', 'Thinner sharp zone and a compressed background'],
      ['Placement',           'One third of the sharp zone falls in front of focus, two thirds behind'],
      ['Landscape',           'Focus at the hyperfocal distance, not the horizon'],
      ['Portrait',            'Focus on the near eye. Always.'],
    ],
  },
  {
    id:'night-setup', title:'Night setup', icon:'☾',
    intro:'The camera cannot guess in the dark. Take over.',
    rows:[
      ['Mode',        'Manual. The meter is unreliable at night.'],
      ['Focus',       'Manual, set by magnifying live view 10× on a bright point.'],
      ['Stabilisation','Off. On a tripod it hunts and adds blur.'],
      ['Release',     'Two-second timer or a remote.'],
      ['Long-exp NR', 'On for single frames, off for time-lapse and star trails.'],
      ['Star limit',  '500 ÷ (focal length × crop) seconds before stars trail.'],
    ],
  },
  {
    id:'timelapse-setup', title:'Time-lapse setup', icon:'▷',
    intro:'Every automatic setting becomes a flicker. Lock all of them.',
    rows:[
      ['Mode',          'Manual — never a priority mode'],
      ['Focus',         'Manual, locked before you start'],
      ['White balance', 'Fixed preset. Auto WB is the number one cause of flicker.'],
      ['Shutter',       'About half the interval, for smooth motion between frames'],
      ['Speed-up',      'Interval × frame rate. 3s at 25fps = 75× real time.'],
      ['Battery',       'Around 900 frames from a healthy DSLR battery'],
    ],
  },
  {
    id:'diagnose', title:'Why is it soft?', icon:'⊘',
    intro:'Match the symptom to the cause before you change anything.',
    rows:[
      ['Everything smeared in one direction', 'Camera shake — faster shutter, brace, or tripod'],
      ['Subject soft, background sharp',      'Focus landed behind — move the focus point to the eye'],
      ['Only moving parts blurred',           'Subject blur — faster shutter'],
      ['Whole frame evenly soft at f/22',     'Diffraction — open up to f/8–f/11'],
      ['Soft with haloes around lights',      'Cheap filter, or condensation on the front element'],
      ['Soft only at the edges',              'The lens wide open — stop down two stops'],
    ],
  },
];

export const referenceById = id => REFERENCE.find(r => r.id === id);
