/* ==========================================================================
   geo.js — asking the device where it is.

   One helper rather than three copies, because the three copies had already
   drifted: two of them saved the position and never told the view, so the
   button sat on "Locating…" while the app quietly knew exactly where it was.

   Also handles the Android shell. Inside a Capacitor WebView plain
   navigator.geolocation only resolves once Android itself has granted the
   runtime permission, so when the native plugin is present we ask through it.
   ========================================================================== */

import * as store from './store.js';

const capacitorGeo = () =>
  (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.())
    ? window.Capacitor?.Plugins?.Geolocation ?? null
    : null;

export class LocationError extends Error {}

const MESSAGES = {
  1: 'Location permission was refused. Allow it for this app, or type coordinates in Settings.',
  2: 'Your device could not get a fix. Try again outdoors, or type coordinates in Settings.',
  3: 'Locating took too long. Try again, or type coordinates in Settings.',
};

/* Resolves to { lat, lon, label } and throws a LocationError you can show. */
export async function requestLocation({ timeout = 15000 } = {}) {
  const native = capacitorGeo();
  if (native) {
    try {
      const perm = await native.requestPermissions();
      const granted = perm?.location === 'granted' || perm?.coarseLocation === 'granted';
      if (!granted) throw new LocationError(MESSAGES[1]);
      const pos = await native.getCurrentPosition({ enableHighAccuracy: false, timeout });
      return { lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'This device' };
    } catch (e) {
      throw e instanceof LocationError ? e : new LocationError(e?.message || MESSAGES[2]);
    }
  }

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new LocationError('This browser cannot report a location. Type coordinates in Settings instead.');
  }
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    /* Chrome silently never calls either callback on an insecure origin, which
       looks exactly like a hang. Say so rather than spin. */
    throw new LocationError('Locating needs a secure (https) connection. Type coordinates in Settings instead.');
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    const done = fn => (...args) => { if (!settled) { settled = true; fn(...args); } };
    /* A belt-and-braces timer: some WebViews never fire the error callback. */
    const timer = setTimeout(done(() => reject(new LocationError(MESSAGES[3]))), timeout + 1000);
    navigator.geolocation.getCurrentPosition(
      done(pos => { clearTimeout(timer); resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'This device' }); }),
      done(err => { clearTimeout(timer); reject(new LocationError(MESSAGES[err?.code] || MESSAGES[2])); }),
      { timeout, maximumAge: 300000, enableHighAccuracy: false },
    );
  });
}

/* Ask, save, and hand back what happened so the caller can re-render — the
   step every previous copy of this forgot. */
export async function captureLocation() {
  const loc = await requestLocation();
  store.update(s => { s.location = loc; });
  return loc;
}
