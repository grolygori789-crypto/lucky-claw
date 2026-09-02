const CACHE_NAME = 'lucky-claw-shell-v4';
const BUILD_ID = '001.16';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/css/app.css?v=001.16',
  './src/css/title-showcase.css?v=001.16',
  './src/js/core/app.js?v=001.16',
  './src/js/core/audio-lifecycle.js',
  './src/js/core/pwa-install.js',
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
  './assets/machines/classic/title-claw-rail.png?v=001.16',
  './assets/machines/classic/title-claw-head.png?v=001.16',
  './assets/plushies/title/title-plush-layer.png?v=001.16',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      try { client.postMessage({ type: 'BUILD_UPDATED', build: BUILD_ID }); } catch {}
    }
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.includes('/assets/audio/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
