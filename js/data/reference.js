/* ==========================================================================
   reference.js — the cards you check in the field, not the ones you study.
   ========================================================================== */

export const REFERENCE = [
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
