const CACHE_NAME = 'lucky-claw-shell-v24';
const CACHE_PREFIX = 'lucky-claw-shell-';
const BUILD_ID = '003.10';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/css/app.css?v=001.20',
  './src/css/title-showcase.css?v=001.20',
  './src/css/menu.css?v=002.03',
  './src/css/settings.css?v=002.03',
  './src/css/gameplay.css?v=003.10',
  './src/js/core/app.js?v=002.03',
  './src/js/core/audio-lifecycle.js?v=001.20',
  './src/js/core/pwa-install.js?v=001.20',
  './src/js/core/display-mode.js?v=002.03',
  './src/js/core/i18n.js?v=002.03',
  './src/js/core/storage.js?v=002.01',
  './src/js/data/soundtrack.js',
  './src/js/data/support.js?v=002.01',
  './src/js/data/legal-content.js?v=002.01',
  './src/js/screens/language.js?v=001.20',
  './src/js/screens/splash.js?v=001.20',
  './src/js/screens/main-menu.js?v=002.03',
  './src/js/screens/settings.js?v=002.03',
  './src/js/systems/music-manager.js?v=003.09',
  './src/js/gameplay/stage-data.js?v=003.10',
  './src/js/gameplay/gameplay-model.js?v=003.10',
  './src/js/gameplay/sfx.js?v=003.09',
  './src/js/gameplay/claw-game.js?v=003.10',
  './src/js/gameplay/howto-guide.js?v=003.09',
  './src/locales/en.json',
  './src/locales/th.json',
  './src/locales/ja.json',
  './assets/machines/classic/cabinet-base.webp',
  './assets/machines/classic/gameplay-cabinet.png?v=003.10',
  './assets/machines/classic/gameplay-carriage.png?v=003.10',
  './assets/machines/classic/gameplay-claw-head.png?v=003.10',
  './assets/machines/classic/title-claw-rail.png?v=001.20',
  './assets/machines/classic/title-claw-head.png?v=001.20',
  './assets/plushies/title/title-plush-layer.png?v=001.20',
  './assets/plushies/gameplay/shih-tzu-brown_front.png?v=003.10',
  './assets/plushies/gameplay/shih-tzu-brown_tilt.png?v=003.10',
  './assets/plushies/gameplay/shih-tzu-brown_rest.png?v=003.10',
  './assets/plushies/gameplay/shih-tzu-black_front.png?v=003.10',
  './assets/plushies/gameplay/shih-tzu-black_tilt.png?v=003.10',
  './assets/plushies/gameplay/shih-tzu-black_rest.png?v=003.10',
  './assets/plushies/gameplay/red-bear_front.png?v=003.10',
  './assets/plushies/gameplay/red-bear_tilt.png?v=003.10',
  './assets/plushies/gameplay/red-bear_rest.png?v=003.10',
  './assets/plushies/gameplay/yellow-chick_front.png?v=003.10',
  './assets/plushies/gameplay/yellow-chick_tilt.png?v=003.10',
  './assets/plushies/gameplay/yellow-chick_rest.png?v=003.10',
  './assets/plushies/gameplay/white-bunny_front.png?v=003.10',
  './assets/plushies/gameplay/white-bunny_tilt.png?v=003.10',
  './assets/plushies/gameplay/white-bunny_rest.png?v=003.10',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Force a network revalidation for the app shell so hotfixes that keep an
    // existing revisioned module URL cannot be satisfied by stale HTTP cache.
    for (const url of APP_SHELL) {
      const request = new Request(url, { cache: 'reload' });
      const response = await fetch(request);
      if (!response || !response.ok) throw new Error(`Precache failed: ${url}`);
      await cache.put(request, response.clone());
    }
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const oldShellCaches = keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);

    await Promise.all(oldShellCaches.map((key) => caches.delete(key)));
    await self.clients.claim();

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

  // Media elements issue Range requests and often receive 206 Partial Content.
  // Never write streamed audio responses into the runtime Cache API.
  if (request.destination === 'audio' || url.pathname.includes('/assets/audio/')) {
    event.respondWith(fetch(request));
    return;
  }

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
