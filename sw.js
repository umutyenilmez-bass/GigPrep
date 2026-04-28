const CACHE = 'gigprep-v3';
const ASSETS = ['./index.html', './logo.png?v=2', './manifest.json', './friz-quadrata-regular.ttf', './friz-quadrata-bold-italic.ttf'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(response => {
      const resClone = response.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, resClone));
      return response;
    }).catch(() => {
      return caches.match(e.request).then(r => r || caches.match('./index.html'));
    })
  );
});
