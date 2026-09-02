const CACHE_NAME = 'lucky-claw-shell-v9';
const CACHE_PREFIX = 'lucky-claw-shell-';
const BUILD_ID = '001.21';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/css/app.css?v=001.20',
  './src/css/title-showcase.css?v=001.20',
  './src/js/core/app.js?v=001.21',
  './src/js/core/audio-lifecycle.js?v=001.20',
  './src/js/core/pwa-install.js?v=001.20',
  './src/js/core/display-mode.js?v=001.21',
  './src/js/core/i18n.js?v=001.20',
  './src/js/core/storage.js?v=001.20',
  './src/js/data/soundtrack.js',
  './src/js/screens/language.js?v=001.20',
  './src/js/screens/splash.js?v=001.20',
  './src/js/systems/music-manager.js?v=001.20',
  './src/locales/en.json',
  './src/locales/th.json',
  './assets/machines/classic/cabinet-base.webp',
  './assets/machines/classic/title-claw-rail.png?v=001.20',
  './assets/machines/classic/title-claw-head.png?v=001.20',
  './assets/plushies/title/title-plush-layer.png?v=001.20',
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
    const oldShellCaches = keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);

    await Promise.all(oldShellCaches.map((key) => caches.delete(key)));
    await self.clients.claim();

    // On an upgrade only, reload each open Lucky Claw client once so an installed
    // PWA cannot keep running an older JS runtime after the new service worker wins.
    if (oldShellCaches.length > 0) {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of windows) {
        try {
          const url = new URL(client.url);
          if (url.origin !== self.location.origin) continue;
          if (url.searchParams.get('lc_build') === BUILD_ID) continue;
          url.searchParams.set('lc_build', BUILD_ID);
          await client.navigate(url.href);
        } catch {
          try { client.postMessage({ type: 'BUILD_UPDATED', build: BUILD_ID }); } catch {}
        }
      }
    }
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok && response.status === 200) {
      await cache.put(request, response.clone());
    }
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
  if (response && response.ok && response.status === 200) {
    await cache.put(request, response.clone());
  }
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

  // IMPORTANT: media elements commonly issue Range requests and receive 206
  // Partial Content. Runtime Cache API writes of streamed 206 responses are not
  // safe and can abort playback. Pass audio through untouched so the server can
  // honor Range / Content-Range normally. Proper offline media range caching can
  // be added later with explicit full-file precaching + range slicing.
  if (request.destination === 'audio' || url.pathname.includes('/assets/audio/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Visual production assets are revisioned and precached. Cache-first makes
  // repeat/PWA launches paint the fully assembled cabinet immediately instead
  // of waiting on the network for plush/claw/icon layers every time.
  const isRevisionedStatic = url.searchParams.has('v')
    && (request.destination === 'style' || request.destination === 'script' || request.destination === 'image');

  if (isRevisionedStatic
      || request.destination === 'image'
      || url.pathname.includes('/assets/machines/')
      || url.pathname.includes('/assets/plushies/')
      || url.pathname.includes('/assets/icons/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
