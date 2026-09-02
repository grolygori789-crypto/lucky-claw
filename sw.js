const CACHE_NAME = 'lucky-claw-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/css/app.css',
  './src/css/title-showcase.css',
  './src/js/core/app.js',
  './src/js/core/display-mode.js',
  './src/js/core/i18n.js',
  './src/js/core/storage.js',
  './src/js/data/soundtrack.js',
  './src/js/screens/language.js',
  './src/js/screens/splash.js',
  './src/js/systems/music-manager.js',
  './src/locales/en.json',
  './src/locales/th.json',
  './assets/machines/classic/cabinet-base.webp',
  './assets/machines/classic/title-claw-rail.png',
  './assets/plushies/title/title-plush-layer.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/audio/main-title-theme.mp3',
  './assets/audio/cozy-claw.mp3',
  './assets/audio/toy-boutique.mp3',
  './assets/audio/lucky-rush.mp3',
  './assets/audio/dreamy-arcade.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
      return response;
    }).catch(() => cached))
  );
});
