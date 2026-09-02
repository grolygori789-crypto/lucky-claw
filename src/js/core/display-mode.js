let fullscreenPending = false;

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

async function lockPortrait() {
  try {
    if (screen.orientation?.lock) {
      await screen.orientation.lock('portrait');
    }
  } catch {
    // Orientation locking is not universally permitted in mobile browsers.
  }
}

export async function requestImmersiveMode() {
  if (fullscreenPending) return false;

  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;

  try {
    fullscreenPending = true;

    if (!fullscreenElement() && request) {
      const result = request.call(root, { navigationUI: 'hide' });
      if (result?.then) await result;
    }

    await lockPortrait();
    return Boolean(fullscreenElement());
  } catch {
    return false;
  } finally {
    fullscreenPending = false;
  }
}

function preventDefault(event) {
  event.preventDefault();
}

function blockMultiTouchZoom(event) {
  if (event.touches?.length > 1) event.preventDefault();
}

function blockCtrlWheelZoom(event) {
  if (event.ctrlKey) event.preventDefault();
}

function protectStaticMedia() {
  document.querySelectorAll('img').forEach((image) => {
    image.draggable = false;
    image.setAttribute('draggable', 'false');
    image.style.webkitTouchCallout = 'none';
    image.style.webkitUserDrag = 'none';
    image.style.userSelect = 'none';
  });
}

export function installDisplayMode() {
  document.documentElement.style.touchAction = 'none';
  document.body.style.touchAction = 'none';
  document.documentElement.style.webkitTouchCallout = 'none';
  document.body.style.webkitTouchCallout = 'none';

  protectStaticMedia();

  // iOS Safari pinch gestures.
  document.addEventListener('gesturestart', preventDefault, { passive: false });
  document.addEventListener('gesturechange', preventDefault, { passive: false });
  document.addEventListener('gestureend', preventDefault, { passive: false });

  // Browser-independent pinch / double-tap / trackpad zoom guards.
  document.addEventListener('touchstart', blockMultiTouchZoom, { passive: false, capture: true });
  document.addEventListener('touchmove', blockMultiTouchZoom, { passive: false, capture: true });
  document.addEventListener('dblclick', preventDefault, { passive: false, capture: true });
  document.addEventListener('wheel', blockCtrlWheelZoom, { passive: false, capture: true });

  // A game surface should never expose browser image-save / drag / selection UI.
  document.addEventListener('contextmenu', preventDefault, { capture: true });
  document.addEventListener('dragstart', preventDefault, { capture: true });
  document.addEventListener('selectstart', preventDefault, { capture: true });

  document.addEventListener('fullscreenchange', () => {
    if (fullscreenElement()) void lockPortrait();
  });
  document.addEventListener('webkitfullscreenchange', () => {
    if (fullscreenElement()) void lockPortrait();
  });
}
