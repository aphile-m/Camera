/* ==========================================================================
   photo.js — the photographic engine.
   Pure functions, no DOM. Everything the app calculates lives here so the
   numbers can be tested and reasoned about in one place.
   ========================================================================== */

/* ---------- Stop ladders -------------------------------------------------- */

export const APERTURES = [1.4,1.6,1.8,2,2.2,2.5,2.8,3.2,3.5,4,4.5,5,5.6,6.3,7.1,8,9,10,11,13,14,16,18,20,22,25,29,32];
export const APERTURES_FULL = [1.4,2,2.8,4,5.6,8,11,16,22,32];
export const ISOS = [100,125,160,200,250,320,400,500,640,800,1000,1250,1600,2000,2500,3200,4000,5000,6400,8000,10000,12800,16000,20000,25600];
/* Shutter speeds in seconds, fastest first. Above 1s we follow the camera's
   own long-exposure ladder rather than pure thirds. */
export const SHUTTERS = [
  1/8000,1/6400,1/5000,1/4000,1/3200,1/2500,1/2000,1/1600,1/1250,1/1000,1/800,1/640,
  1/500,1/400,1/320,1/250,1/200,1/160,1/125,1/100,1/80,1/60,1/50,1/40,1/30,1/25,1/20,
  1/15,1/13,1/10,1/8,1/6,1/5,1/4,0.3,0.4,0.5,0.6,0.8,1,1.3,1.6,2,2.5,3,4,5,6,8,10,13,
  15,20,25,30,40,50,60,90,120,180,240,300,420,600,900,1200,1800
];

const nearest = (arr, v) => arr.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a);

export const nearestAperture = v => nearest(APERTURES, clamp(v, APERTURES[0], APERTURES.at(-1)));
export const nearestISO      = v => nearest(ISOS,      clamp(v, ISOS[0],      ISOS.at(-1)));
export const nearestShutter  = v => nearest(SHUTTERS,  clamp(v, SHUTTERS[0],  SHUTTERS.at(-1)));

export function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

/* Round a value to the nearest entry in a ladder, but never faster/wider than
   the equipment allows. Returns the value and how many stops we had to move. */
export function snap(arr, v, { min = -Infinity, max = Infinity } = {}) {
  const bounded = clamp(v, min, max);
  return nearest(arr.filter(x => x >= min && x <= max), bounded);
}

/* ---------- Formatting ---------------------------------------------------- */

export function fmtShutter(s) {
  if (s == null || !isFinite(s)) return '—';
  if (s >= 60) {
    const m = Math.round(s / 60);
    return m >= 60 ? `${(m / 60).toFixed(m % 60 ? 1 : 0)} h` : `${m} min`;
  }
  if (s >= 1) return `${Number.isInteger(s) ? s : s.toFixed(1)}"`;
  const d = 1 / s;
  return `1/${d >= 10 ? Math.round(d) : d.toFixed(1).replace(/\.0$/, '')}`;
}

export function fmtAperture(f) { return `f/${f % 1 === 0 ? f : f.toFixed(1)}`; }
export function fmtISO(i)      { return i >= 1000 ? i.toLocaleString() : String(i); }

export function fmtDuration(sec) {
  sec = Math.round(sec);
  if (sec < 60) return `${sec}s`;
  const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
  if (h === 0) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function fmtDistance(metres, units = 'metric') {
  if (!isFinite(metres)) return '∞';
  if (units === 'imperial') {
    const ft = metres * 3.28084;
    return ft < 1 ? `${(ft * 12).toFixed(0)} in` : `${ft < 10 ? ft.toFixed(1) : Math.round(ft)} ft`;
  }
  if (metres < 1) return `${Math.round(metres * 100)} cm`;
  return `${metres < 10 ? metres.toFixed(1) : Math.round(metres)} m`;
}

export function fmtStops(n) {
  const r = Math.round(n * 10) / 10;
  if (Math.abs(r) < 0.05) return '0';
  return `${r > 0 ? '+' : '−'}${Math.abs(r).toFixed(1).replace(/\.0$/, '')}`;
}

/* ---------- The exposure equation ---------------------------------------- */
/*  EV100 = log2(N² / t)   — the exposure value a setting pair represents at ISO 100
    A scene of brightness EV100 is correctly exposed when the settings match it.
    ISO shifts the requirement: EV_setting = EV_scene + log2(ISO/100)          */

export const evOf      = (N, t)          => Math.log2((N * N) / t);
export const evAtISO   = (N, t, iso)     => evOf(N, t) - Math.log2(iso / 100);
export const isoFor    = (evScene, N, t) => 100 * Math.pow(2, evOf(N, t) - evScene);
export const shutterFor= (evScene, N, iso) => (N * N) / Math.pow(2, evScene + Math.log2(iso / 100));
export const apertureFor=(evScene, t, iso) => Math.sqrt(t * Math.pow(2, evScene + Math.log2(iso / 100)));

/* How far off correct a given trio is, in stops. Positive = overexposed. */
export function exposureError(evScene, N, t, iso) {
  return (evScene + Math.log2(iso / 100)) - evOf(N, t);
}

/* Every equivalent-exposure sibling of a setting: same brightness, different look */
export function equivalents(N, t, iso, { count = 5 } = {}) {
  const out = [];
  const baseEV = evAtISO(N, t, iso);
  for (let s = -count; s <= count; s++) {
    const nN = nearestAperture(N * Math.pow(2, s / 2));   // s stops of aperture…
    const nT = nearestShutter(t * Math.pow(2, s));        // …costs s stops of time
    if (evAtISO(nN, nT, iso).toFixed(1) !== baseEV.toFixed(1)) continue;
    out.push({ aperture: nN, shutter: nT, iso, stops: s });
  }
  return out;
}

/* ---------- Scene brightness --------------------------------------------- */
/*  EV100 values from the classic exposure tables (Sunny 16 anchors at EV 15). */

export const LIGHT_LEVELS = [
  { id:'sun_hard',   ev:15, label:'Hard sun',       hint:'Midday, black shadows',        icon:'sun' },
  { id:'sun_hazy',   ev:14, label:'Hazy sun',       hint:'Bright but soft-edged shadows', icon:'sun' },
  { id:'cloud_bright',ev:13,label:'Bright cloud',   hint:'Overcast and bright, no shadows', icon:'cloud' },
  { id:'overcast',   ev:12, label:'Overcast',       hint:'Heavy grey cloud',              icon:'cloud' },
  { id:'shade',      ev:11, label:'Open shade',     hint:'Out of the sun, open sky above', icon:'shade' },
  { id:'golden',     ev:10, label:'Golden hour',    hint:'Low warm sun near the horizon',  icon:'golden' },
  { id:'blue_hour',  ev:7,  label:'Blue hour',      hint:'After sunset, sky still lit',    icon:'dusk' },
  { id:'indoor_day', ev:8,  label:'Bright indoors', hint:'Big window, daylight',           icon:'window' },
  { id:'indoor_lit', ev:6,  label:'Lit room',       hint:'Normal domestic lighting',       icon:'lamp' },
  { id:'indoor_dim', ev:4,  label:'Dim interior',   hint:'Restaurant, candles, mood light', icon:'candle' },
  { id:'street_night',ev:3, label:'Lit street',     hint:'Night, under street lights',     icon:'street' },
  { id:'night',      ev:0,  label:'Deep night',     hint:'Moonlight, landscape after dark', icon:'moon' },
  { id:'stars',      ev:-6, label:'Starlight',      hint:'No moon, Milky Way',             icon:'stars' },
];

export const lightById = id => LIGHT_LEVELS.find(l => l.id === id);

/* ---------- Motion → shutter speed --------------------------------------- */
/*  Shutter needed to render a subject sharp depends on how fast its image
    crosses the frame, which depends on speed, distance and focal length.
    These are the practical field numbers photographers actually use. */

export const MOTION = [
  { id:'static',  label:'Still',        hint:'Landscape, still life, buildings',    freeze:1/125,  blur:1/4   },
  { id:'gentle',  label:'Gentle',       hint:'Posed person, slow water, leaves',    freeze:1/160,  blur:1/8   },
  { id:'walking', label:'Walking',      hint:'People on a street, pets mooching',   freeze:1/250,  blur:1/15  },
  { id:'running', label:'Running',      hint:'Children, dogs, joggers',             freeze:1/500,  blur:1/30  },
  { id:'sport',   label:'Sport',        hint:'Football, cyclists, skateboards',     freeze:1/1000, blur:1/60  },
  { id:'vehicle', label:'Fast vehicle', hint:'Cars, motorbikes, racing',            freeze:1/1600, blur:1/125 },
  { id:'flight',  label:'Bird in flight',hint:'Wings, splashing water, hummingbirds',freeze:1/2500, blur:1/250 },
];
export const motionById = id => MOTION.find(m => m.id === id);

/* ---------- Creative intent ---------------------------------------------- */

export const INTENTS = [
  { id:'isolate',   label:'Isolate the subject', hint:'Background melts away',        aperture:'widest',  priority:'aperture' },
  { id:'natural',   label:'Natural depth',       hint:'Subject sharp, background soft', aperture:4,       priority:'aperture' },
  { id:'sharp_all', label:'Front to back sharp', hint:'Landscape, architecture, group', aperture:8,       priority:'aperture' },
  { id:'freeze',    label:'Freeze the moment',   hint:'Every detail locked still',      aperture:'sweet', priority:'shutter'  },
  { id:'blur',      label:'Show the movement',   hint:'Panning a moving subject',        aperture:8,       priority:'shutter'  },
  { id:'longexp',   label:'Smooth it out',       hint:'Silky water, light trails, empty streets', aperture:8, priority:'shutter' },
  { id:'lowlight',  label:'Just get the shot',   hint:'Dim light, keep it usable',      aperture:'widest',priority:'balance'  },
];
export const intentById = id => INTENTS.find(i => i.id === id);

/* ---------- Gear --------------------------------------------------------- */

export const SENSORS = {
  ff:      { label:'Full frame',      crop:1,    coc:0.030, width:36   },
  apsc:    { label:'APS-C (Nikon DX)',crop:1.5,  coc:0.020, width:23.5 },
  apsc_c:  { label:'APS-C (Canon)',   crop:1.6,  coc:0.019, width:22.3 },
  m43:     { label:'Micro 4/3',       crop:2,    coc:0.015, width:17.3 },
  phone:   { label:'Phone (1/1.7")',  crop:4.6,  coc:0.006, width:7.6  },
};

export const DEFAULT_GEAR = {
  body: 'Nikon D5300',
  sensor: 'apsc',
  megapixels: 24,
  pixelWidth: 6000,
  stabilised: false,
  isoCeiling: 6400,     // highest ISO you are happy to print
  maxShutter: 1/4000,   // fastest the body offers
  flashSync: 1/200,     // fastest shutter that syncs with flash
  lenses: [
    { id:'kit',  label:'18–55mm kit',  min:18, max:55,  wideAperture:3.5, longAperture:5.6, stabilised:true },
    { id:'tele', label:'55–200mm',     min:55, max:200, wideAperture:4,   longAperture:5.6, stabilised:true },
    { id:'prime',label:'35mm f/1.8',   min:35, max:35,  wideAperture:1.8, longAperture:1.8, stabilised:false },
  ],
};

/* Widest aperture available at a given focal length on a zoom (log interpolation) */
export function maxApertureAt(lens, focal) {
  if (!lens) return 3.5;
  if (lens.min === lens.max) return lens.wideAperture;
  const t = (Math.log(focal) - Math.log(lens.min)) / (Math.log(lens.max) - Math.log(lens.min));
  const stops = Math.log2(lens.longAperture / lens.wideAperture) * clamp(t, 0, 1);
  return nearestAperture(lens.wideAperture * Math.pow(2, stops));
}

/* The aperture where most lenses are sharpest: about two stops from wide open,
   but never so deep that it starts costing shutter speed for no gain. */
export function sweetSpot(lens, focal) {
  return nearestAperture(clamp(maxApertureAt(lens, focal) * 2, 2.8, 8));
}

/* ---------- Handholding --------------------------------------------------- */
/*  Reciprocal rule, corrected for crop factor, pixel density and stabilisation. */

export function handheldLimit(focal, { crop = 1.5, stabilised = false, steadiness = 0 } = {}) {
  const equivalent = focal * crop;
  let limit = 1 / (equivalent * 2);              // 2× the classic rule: 24MP is unforgiving
  if (stabilised) limit *= Math.pow(2, 3);        // ~3 stops from modern VR
  limit *= Math.pow(2, steadiness);               // user's own bias, in stops
  return limit;
}

/* ---------- Depth of field ------------------------------------------------ */

export function depthOfField(focalMm, N, subjectM, { coc = 0.020 } = {}) {
  const f = focalMm, s = subjectM * 1000;
  const H = (f * f) / (N * coc) + f;                       // hyperfocal, mm
  const near = (s * (H - f)) / (H + s - 2 * f);
  const far  = s >= H ? Infinity : (s * (H - f)) / (H - s);
  return {
    hyperfocal: H / 1000,
    near: near / 1000,
    far: far / 1000,
    total: isFinite(far) ? (far - near) / 1000 : Infinity,
    inFront: (s - near) / 1000,
    behind: isFinite(far) ? (far - s) / 1000 : Infinity,
  };
}

/* Aperture at which diffraction starts to cost visible detail */
export function diffractionLimit(sensorKey = 'apsc', megapixels = 24) {
  const s = SENSORS[sensorKey] || SENSORS.apsc;
  const pixelPitch = (s.width / Math.sqrt(megapixels * 1e6 * (3 / 2))) * 1000; // µm
  return nearestAperture(pixelPitch / 0.55 * 1.2);
}

/* ---------- Astro --------------------------------------------------------- */

export function astroShutter(focalMm, { crop = 1.5, pixelPitchUm = 3.9, aperture = 3.5, declination = 0 } = {}) {
  const rule500 = 500 / (focalMm * crop);
  // NPF rule — accounts for aperture and pixel density, far more accurate on 24MP
  const npf = (35 * aperture + 30 * pixelPitchUm) / (focalMm * Math.cos(declination * Math.PI / 180));
  return { rule500, npf, recommended: npf };
}

export function pixelPitchUm(sensorKey = 'apsc', pixelWidth = 6000) {
  const s = SENSORS[sensorKey] || SENSORS.apsc;
  return (s.width / pixelWidth) * 1000;
}

/* ---------- ND filters ---------------------------------------------------- */

export const ND_FILTERS = [
  { stops:1,  label:'ND2 (0.3)'   }, { stops:2,  label:'ND4 (0.6)'  },
  { stops:3,  label:'ND8 (0.9)'   }, { stops:4,  label:'ND16 (1.2)' },
  { stops:6,  label:'ND64 (1.8)'  }, { stops:10, label:'ND1000 (3.0)' },
  { stops:15, label:'ND32000 (4.5)' },
];

export const withND = (shutter, stops) => shutter * Math.pow(2, stops);
export const ndNeeded = (from, to)     => Math.log2(to / from);

/* ---------- Time-lapse ---------------------------------------------------- */

export function timelapse({ interval, clipSeconds, fps = 25, format = 'jpeg' }) {
  const frames  = Math.ceil(clipSeconds * fps);
  const shooting = frames * interval;
  const perFrameMB = { jpeg: 12, raw: 24, both: 36 }[format] ?? 12;
  return {
    frames,
    shootingSeconds: shooting,
    speedUp: interval * fps,
    cardMB: frames * perFrameMB,
    maxShutter: interval * 0.8,          // leave the camera time to write
    idealShutter: interval / 2,          // 180° rule — motion blends between frames
    batteryFrames: 900,                  // realistic single-battery figure for a DSLR
  };
}

/* Given a wanted real-world duration and clip length, what interval? */
export function intervalFor(realSeconds, clipSeconds, fps = 25) {
  return realSeconds / (clipSeconds * fps);
}

/* ---------- Sun & twilight ------------------------------------------------ */
/*  Compact NOAA/Meeus solar position — good to well under a minute anywhere
    on Earth, and it runs offline with no data files.                        */

const RAD = Math.PI / 180, DAY_MS = 86400000, J1970 = 2440588, J2000 = 2451545;
const OBLIQUITY = 23.4397 * RAD;

const toJulian   = d => d.valueOf() / DAY_MS - 0.5 + J1970;
const fromJulian = j => new Date((j + 0.5 - J1970) * DAY_MS);
const toDays     = d => toJulian(d) - J2000;

const solarMeanAnomaly = d => RAD * (357.5291 + 0.98560028 * d);
const eclipticLongitude = M => {
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  return M + C + RAD * 102.9372 + Math.PI;
};
const declination = L => Math.asin(Math.sin(OBLIQUITY) * Math.sin(L));
const rightAscension = L => Math.atan2(Math.sin(L) * Math.cos(OBLIQUITY), Math.cos(L));
const siderealTime = (d, lw) => RAD * (280.16 + 360.9856235 * d) - lw;

export function sunPosition(date, lat, lon) {
  const lw = RAD * -lon, phi = RAD * lat, d = toDays(date);
  const M = solarMeanAnomaly(d), L = eclipticLongitude(M);
  const dec = declination(L), ra = rightAscension(L);
  const H = siderealTime(d, lw) - ra;
  return {
    azimuth: (Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)) / RAD + 180 + 360) % 360,
    altitude: Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)) / RAD,
  };
}

const julianCycle  = (d, lw) => Math.round(d - 0.0009 - lw / (2 * Math.PI));
const approxTransit= (Ht, lw, n) => 0.0009 + (Ht + lw) / (2 * Math.PI) + n;
const solarTransitJ= (ds, M, L) => J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
const hourAngle    = (h, phi, d) => Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d)));

/* Altitudes that matter to a photographer, in degrees */
const SUN_EVENTS = [
  { alt:  -0.833, rise:'sunrise',       set:'sunset'        },
  { alt:   6,     rise:'goldenHourEnd', set:'goldenHour'    },
  { alt:  -4,     rise:'blueHourEnd',   set:'blueHour'      },
  { alt:  -6,     rise:'dawn',          set:'dusk'          },
  { alt: -12,     rise:'nauticalDawn',  set:'nauticalDusk'  },
  { alt: -18,     rise:'nightEnd',      set:'night'         },
];

export function sunTimes(date, lat, lon) {
  const lw = RAD * -lon, phi = RAD * lat;
  const d = toDays(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12));
  const n = julianCycle(d, lw), ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds), L = eclipticLongitude(M), dec = declination(L);
  const Jnoon = solarTransitJ(ds, M, L);
  const out = { solarNoon: fromJulian(Jnoon), nadir: fromJulian(Jnoon - 0.5) };
  for (const e of SUN_EVENTS) {
    const w = hourAngle(e.alt * RAD, phi, dec);
    if (isNaN(w)) { out[e.rise] = null; out[e.set] = null; continue; }
    const Jset = solarTransitJ(approxTransit(w, lw, n), M, L);
    out[e.set]  = fromJulian(Jset);
    out[e.rise] = fromJulian(Jnoon - (Jset - Jnoon));
  }
  return out;
}

/* Turn sun altitude into the light a photographer will actually meet */
export function lightNow(date, lat, lon) {
  const { altitude } = sunPosition(date, lat, lon);
  if (altitude > 45)  return { id:'sun_hard',    ev:15, label:'High hard sun',  advice:'The worst light of the day for faces. Look for open shade, or shoot texture, shadow and pattern instead.' };
  if (altitude > 20)  return { id:'sun_hazy',    ev:14, label:'Mid sun',        advice:'Directional but still contrasty. Put the sun to one side of your subject, not behind you.' };
  if (altitude > 6)   return { id:'sun_hazy',    ev:13, label:'Low sun',        advice:'Golden hour is close. Get in position now — the good light lasts about twenty minutes.' };
  if (altitude > -0.5)return { id:'golden',      ev:10, label:'Golden hour',    advice:'Warm, low, directional. Backlight your subject and expose for the face.' };
  if (altitude > -6)  return { id:'blue_hour',   ev:7,  label:'Blue hour',      advice:'Sky and city lights balance. Best twenty minutes of the day for architecture. Use a tripod.' };
  if (altitude > -12) return { id:'street_night',ev:4,  label:'Late twilight',  advice:'The sky is losing detail fast. Bracket, and switch to artificial light as your subject.' };
  return                     { id:'night',       ev:1,  label:'Night',          advice:'Tripod, manual focus via live view, and either lit subjects or the stars.' };
}

/* ---------- Metering & histogram ------------------------------------------ */

export const METER_SUBJECTS = [
  { id:'midtone', label:'Mid-tone (grass, skin in shade, tarmac)', comp: 0 },
  { id:'snow',    label:'Snow, white wall, bright sand',           comp: +1.7 },
  { id:'light',   label:'Light skin in sun, pale sky',             comp: +0.7 },
  { id:'dark',    label:'Dark clothing, deep shade, black fur',    comp: -1.3 },
  { id:'backlit', label:'Subject against a bright background',     comp: +1.0 },
  { id:'spotlit', label:'Bright subject in a dark scene',          comp: -1.3 },
];

/* ---------- The advisor --------------------------------------------------- */
/*  Rather than a lookup table, solve the exposure the way a photographer
    reasons about it — and record each decision so the app can explain itself. */

export function advise({
  ev, motion = 'static', intent = 'natural', focal = 35, lens, gear = DEFAULT_GEAR,
  tripod = false, steadiness = 0, targetShutter = null,
}) {
  const sensor = SENSORS[gear.sensor] || SENSORS.apsc;
  const m  = motionById(motion) || MOTION[0];
  const it = intentById(intent) || INTENTS[1];
  const fastest = gear.maxShutter ?? SHUTTERS[0];
  const why = [], notes = [];

  const wideOpen = maxApertureAt(lens, focal);
  const handheld = handheldLimit(focal, { crop: sensor.crop, stabilised: lens?.stabilised && !tripod, steadiness });
  const wantsBlur   = it.id === 'blur';
  const wantsLong   = it.id === 'longexp';
  const shutterLed  = wantsBlur || wantsLong || it.id === 'freeze';

  /* ---- 1. Aperture, from creative intent ------------------------------- */
  let N;
  if (it.aperture === 'widest') {
    N = wideOpen;
    why.push({ k:'Aperture', v:`${fmtAperture(N)} — as wide as this lens opens at ${focal}mm, for the shallowest depth of field available to you.` });
  } else if (it.aperture === 'sweet') {
    N = sweetSpot(lens, focal);
    why.push({ k:'Aperture', v:`${fmtAperture(N)} — roughly two stops down from wide open, where the lens resolves best without costing you shutter speed.` });
  } else {
    N = nearestAperture(Math.max(it.aperture, wideOpen));
    why.push({ k:'Aperture', v:`${fmtAperture(N)} — ${it.id === 'sharp_all'
      ? 'deep enough to hold a landscape sharp front to back, and short of where diffraction bites'
      : 'enough separation to lift the subject off the background, with a forgiving margin for focus error'}.` });
  }

  /* ---- 2. Shutter, from movement and what you want it to look like ----- */
  let t, wantedT = null;
  if (targetShutter) {
    t = wantedT = targetShutter;
    why.push({ k:'Shutter', v:`${fmtShutter(t)} — the speed you asked for.` });
  } else if (wantsLong) {
    t = wantedT = m.id === 'static' ? 30 : 8;
    why.push({ k:'Shutter', v:`${fmtShutter(t)} — long enough to render ${m.id === 'static' ? 'cloud, water and crowds as smooth form — anything that moves simply stops existing' : 'movement as continuous light rather than a series of separate shapes'}.` });
  } else if (wantsBlur) {
    t = wantedT = m.blur;
    why.push({ k:'Shutter', v:`${fmtShutter(t)} — slow enough to streak a ${m.label.toLowerCase()} subject while you pan with it, so the subject stays readable and the background does not.` });
  } else {
    t = m.freeze;
    why.push({ k:'Shutter', v:`${fmtShutter(t)} — fast enough to stop a ${m.label.toLowerCase()} subject dead.` });
  }

  if (!tripod && !wantsBlur && !wantsLong && t > handheld) {
    t = handheld;
    why.push({ k:'Handholding', v:`Tightened to ${fmtShutter(t)}. At ${focal}mm on a ${sensor.label} body, anything slower records your own pulse as blur.` });
  }

  /* ---- 3. ISO, and the negotiation when it lands somewhere unusable ---- */
  /*  `nd` is either REQUIRED (the settings as given would blow out without a
      filter) or OPTIONAL (the exposure is correct, but the look you asked for
      needs a filter to reach). Beginners conflate these constantly.          */
  const baseISO = 100;
  let iso, nd = null;

  /* On a tripod with nothing moving, time is free — so hold base ISO and let
     the shutter do the work, up to the point where the stars begin to trail. */
  const shutterFree = tripod && (wantsLong || (m.id === 'static' && !shutterLed));
  const timeCap = ev <= 2
    ? nearestShutter(astroShutter(focal, {
        crop: sensor.crop, aperture: N,
        pixelPitchUm: pixelPitchUm(gear.sensor, gear.pixelWidth),
      }).recommended)
    : 30;

  if (shutterFree) {
    iso = baseISO;
    const allowed = shutterFor(ev, N, iso);

    if (wantedT && allowed < wantedT * 0.7) {
      /* The scene is brighter than the look wants: correct exposure now, ND to go longer. */
      t = nearestShutter(clamp(allowed, fastest, 1800));
      nd = { stops: Math.log2(wantedT / allowed), mode:'optional', shutter: wantedT };
      why.push({ k:'The gap', v:`At ISO 100 and ${fmtAperture(N)} this light only allows ${fmtShutter(t)}, and that frame will be correctly exposed. The look you asked for needs ${fmtShutter(wantedT)} — ${fmtStops(nd.stops)} stops further — and a filter is the only honest way to get there.` });
    } else if (allowed > timeCap) {
      /* Darker than base ISO can hold in the time available: raise ISO instead. */
      t = nearestShutter(clamp(timeCap, fastest, 1800));
      iso = nearestISO(isoFor(ev, N, t));
      why.push({ k:'Time cap', v: ev <= 2
        ? `Held at ${fmtShutter(t)}: past that, at ${focal}mm, the earth's rotation turns stars from points into short streaks. ISO carries the rest.`
        : `Held at ${fmtShutter(t)} so the frame stays practical, with ISO carrying the rest.` });
    } else {
      t = nearestShutter(clamp(Math.min(wantedT ?? allowed, allowed), fastest, 1800));
      iso = nearestISO(isoFor(ev, N, t));
      why.push({ k:'Tripod', v:`On a tripod nothing forces the shutter up, so it settles at ${fmtShutter(t)} and ISO stays at ${fmtISO(iso)} — the cleanest file this scene can give you.` });
    }
  } else {
    let rawISO = isoFor(ev, N, t);

    if (rawISO > gear.isoCeiling) {
      /* Not enough light. Buy stops back — open the aperture first, it costs least. */
      const shortfall = Math.log2(rawISO / gear.isoCeiling);
      if (N > wideOpen) {
        const opened = nearestAperture(Math.max(wideOpen, N / Math.pow(2, shortfall / 2)));
        const bought = Math.log2((N * N) / (opened * opened));
        if (bought > 0.3) {
          why.push({ k:'Trade', v:`Opened to ${fmtAperture(opened)} to buy ${fmtStops(bought)} stops rather than push ISO past ${fmtISO(gear.isoCeiling)}. Depth of field gets thinner — focus on the eye.` });
          N = opened; rawISO = isoFor(ev, N, t);
        }
      }
      if (rawISO > gear.isoCeiling && !tripod && !wantsBlur && !wantsLong && t < handheld) {
        const slower = nearestShutter(Math.min(handheld, t * Math.pow(2, Math.log2(rawISO / gear.isoCeiling))));
        if (slower > t) {
          why.push({ k:'Trade', v:`Slowed to ${fmtShutter(slower)} — still inside the handholding limit — to keep ISO down.` });
          t = slower; rawISO = isoFor(ev, N, t);
        }
      }
      if (rawISO > gear.isoCeiling && !tripod) {
        notes.push({ tone:'info', text:'There is not enough light here for a clean handheld frame. A tripod, a faster lens, or simply moving your subject towards the light are the only real fixes — the camera cannot invent photons.' });
      }
    }

    if (rawISO < baseISO) {
      /* More light than the look needs. Spend it on shutter, then aperture, then ND. */
      const surplus = Math.log2(baseISO / rawISO);
      const need = shutterFor(ev, N, baseISO);
      if (need >= fastest) {
        t = nearestShutter(need);
        why.push({ k:'Surplus light', v:`There is ${fmtStops(surplus)} stops more light than this look needs, so the shutter rises to ${fmtShutter(t)} at base ISO. Free sharpness — take it.` });
      } else {
        t = fastest;
        const over = Math.log2(baseISO / isoFor(ev, N, t));
        const closed = nearestAperture(N * Math.pow(2, over / 2));
        if (closed <= 16 && it.id !== 'isolate') {
          why.push({ k:'Surplus light', v:`Past the ${fmtShutter(t)} ceiling, so closing to ${fmtAperture(closed)} absorbs the last ${fmtStops(over)} stops.` });
          N = closed;
        } else {
          nd = { stops: over, mode:'required', shutter: t };
        }
      }
      rawISO = isoFor(ev, N, t);
    }
    iso = nearestISO(rawISO);
  }

  t   = nearestShutter(clamp(t, fastest, 1800));
  N   = nearestAperture(N);
  iso = clamp(nearestISO(iso), baseISO, ISOS.at(-1));
  const error = exposureError(ev, N, t, iso) - (nd?.mode === 'required' ? nd.stops : 0);

  /* ---- 4. The honest warnings ------------------------------------------ */
  if (nd && nd.stops > 0.5) {
    const filter = ND_FILTERS.reduce((a, b) => Math.abs(b.stops - nd.stops) < Math.abs(a.stops - nd.stops) ? b : a);
    notes.push(nd.mode === 'required'
      ? { tone:'warn', text:`This needs about ${nd.stops.toFixed(1)} stops of neutral density — an ${filter.label} is the nearest common filter. Without one the frame blows out, and you must either stop down or wait for the light to drop.` }
      : { tone:'info', text:`The settings above are correct as they stand. To stretch the shutter to ${fmtShutter(nd.shutter)} for the look you described, add about ${nd.stops.toFixed(1)} stops of neutral density — an ${filter.label}.` });
  }
  if (iso >= 6400)      notes.push({ tone:'bad',  text:`ISO ${fmtISO(iso)} will be noisy and a little flat. Shoot RAW and expose to the right. A sharp grainy frame beats a clean blurred one every time.` });
  else if (iso >= 1600) notes.push({ tone:'warn', text:`ISO ${fmtISO(iso)} is perfectly printable. Do not chase ISO 100 in this light — blur is the failure you cannot fix later.` });
  if (t >= 1/15 && !tripod && !wantsBlur && !wantsLong)
    notes.push({ tone:'warn', text:`${fmtShutter(t)} handheld is a coin toss. Brace against something solid, breathe out, squeeze — and fire three frames, not one.` });
  if (t >= 1)           notes.push({ tone:'info', text:'Longer than a second means a tripod, and the two-second timer so your hand is off the camera when the shutter opens.' });
  if (t >= 20)          notes.push({ tone:'info', text:'Past twenty seconds the stars themselves start to trail. If you want points rather than streaks, open the aperture instead.' });
  if (N >= 16)          notes.push({ tone:'info', text:`Beyond ${fmtAperture(diffractionLimit(gear.sensor, gear.megapixels))} diffraction softens the whole frame. If you need more depth than this, focus-stack rather than stop down.` });
  if (N <= 2 && it.id !== 'isolate')
    notes.push({ tone:'info', text:'Wide open, the sharp zone can be thinner than a face. Focus on the near eye and recompose as little as possible.' });
  if (Math.abs(error) > 0.4)
    notes.push({ tone:'warn', text:`This is as close as the camera gets — about ${fmtStops(-error)} stops out. Fix it with exposure compensation, in RAW, or by changing the light.` });
  if (it.id === 'lowlight')
    notes.push({ tone:'info', text:`In fast-moving low light, set A mode at ${fmtAperture(N)}, turn on Auto ISO with a minimum shutter of ${fmtShutter(handheld)} and a ceiling of ${fmtISO(gear.isoCeiling)}, and stop thinking about the numbers.` });

  const subjectDistance = it.id === 'isolate' ? 2 : it.id === 'sharp_all' ? 8 : 3;
  return {
    aperture: N, shutter: t, iso, ev, error, nd,
    handheldLimit: handheld, wantedShutter: wantedT,
    mode: it.priority === 'aperture' ? 'A' : it.priority === 'shutter' ? 'S' : 'M',
    modeReason: it.priority === 'aperture'
      ? 'Aperture priority: you choose the depth of field, the camera keeps the exposure right as the light shifts.'
      : it.priority === 'shutter'
      ? 'Shutter priority: you choose how movement is drawn, the camera handles the rest.'
      : 'Manual with Auto ISO: you fix the look, the camera absorbs the changes in light.',
    why, notes,
    subjectDistance,
    dof: depthOfField(focal, N, subjectDistance, { coc: sensor.coc }),
  };
}
