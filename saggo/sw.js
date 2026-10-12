// Service worker de la app instalable: guarda solo esta página y sus íconos (para abrir aunque la señal sea mala).
// La app en sí (Google Apps Script) siempre se carga por internet; no se guarda ningún dato de la empresa.
const CACHE = 'hv-saggo-v1';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon-48.png'];
self.addEventListener('install', ev => { ev.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.indexOf('hv-saggo-') === 0 && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', ev => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET' || url.origin !== location.origin) return; // lo de Google no pasa por aquí
  ev.respondWith(fetch(ev.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(ev.request, copy)); return r; })
    .catch(() => caches.match(ev.request, {ignoreSearch: true}).then(r => r || caches.match('./index.html'))));
});
