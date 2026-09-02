export function createPWAController({ onInstalled = () => {} } = {}) {
  let deferredPrompt = null;
  let promptReadyResolve;
  const promptReady = new Promise((resolve) => { promptReadyResolve = resolve; });

  const isStandalone = () => (
    window.matchMedia?.('(display-mode: standalone)').matches
    || window.matchMedia?.('(display-mode: fullscreen)').matches
    || window.navigator.standalone === true
  );

  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isMobile = () => /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent)
    || window.matchMedia?.('(pointer: coarse)').matches;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((registration) => {
        void registration.update();
      }).catch((error) => {
        console.warn('[Lucky Claw] Service worker registration failed.', error);
      });
    }, { once: true });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    promptReadyResolve?.(true);
    promptReadyResolve = null;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    onInstalled();
  });

  async function waitForNativePrompt(timeoutMs = 1200) {
    if (deferredPrompt) return true;
    await Promise.race([
      promptReady,
      new Promise((resolve) => window.setTimeout(resolve, timeoutMs)),
    ]);
    return Boolean(deferredPrompt);
  }

  async function promptInstall() {
    if (!deferredPrompt) return { available: false, accepted: false };
    const prompt = deferredPrompt;
    deferredPrompt = null;
    await prompt.prompt();
    const choice = await prompt.userChoice.catch(() => null);
    return { available: true, accepted: choice?.outcome === 'accepted' };
  }

  return Object.freeze({
    isStandalone,
    isIOS,
    isMobile,
    hasNativePrompt: () => Boolean(deferredPrompt),
    waitForNativePrompt,
    promptInstall,
  });
}
