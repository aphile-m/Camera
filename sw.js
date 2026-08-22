/* Offline shell. Cache-first for the app's own files, so a shoot in a field
   with no signal works exactly like one at home. */
const VERSION = 'stops-v2';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/app.css',
  './js/app.js',
  './js/core/photo.js', './js/core/store.js', './js/core/sharepoint.js',
  './js/data/curriculum.js', './js/data/scenes.js', './js/data/reference.js',
  './js/ui/dom.js', './js/ui/icons.js', './js/ui/diagrams.js', './js/ui/parts.js',
  './js/views/home.js', './js/views/learn.js', './js/views/practice.js',
  './js/views/tools.js', './js/views/journal.js', './js/views/settings.js',
  './assets/icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);
  /* Same-origin GETs only. Microsoft Graph and the sign-in endpoints must
     always go straight to the network — a cached token response would be
     both wrong and dangerous. */
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  /* The OAuth redirect carries ?code=… — let it reach the page, not the cache. */
  if (url.search.includes('code=') || url.search.includes('error=')) return;

  e.respondWith(
    caches.match(request).then(cached => {
      /* Serve from cache, then quietly refresh it for next time. */
      const network = fetch(request).then(res => {
        if (res.ok) caches.open(VERSION).then(c => c.put(request, res.clone()));
        return res;
      }).catch(() => cached || caches.match('./index.html'));
      return cached || network;
    })
  );
});
