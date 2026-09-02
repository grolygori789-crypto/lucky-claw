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

function blockGestureZoom(event) {
  event.preventDefault();
}

function blockMultiTouchZoom(event) {
  if (event.touches?.length > 1) event.preventDefault();
}

function blockCtrlWheelZoom(event) {
  if (event.ctrlKey) event.preventDefault();
}

export function installDisplayMode() {
  document.documentElement.style.touchAction = 'none';
  document.body.style.touchAction = 'none';

  // iOS Safari gesture events.
  document.addEventListener('gesturestart', blockGestureZoom, { passive: false });
  document.addEventListener('gesturechange', blockGestureZoom, { passive: false });
  document.addEventListener('gestureend', blockGestureZoom, { passive: false });

  // Browser-independent pinch/double-tap/trackpad zoom guards.
  document.addEventListener('touchmove', blockMultiTouchZoom, { passive: false });
  document.addEventListener('dblclick', blockGestureZoom, { passive: false });
  document.addEventListener('wheel', blockCtrlWheelZoom, { passive: false });

  document.addEventListener('fullscreenchange', () => {
    if (fullscreenElement()) void lockPortrait();
  });
  document.addEventListener('webkitfullscreenchange', () => {
    if (fullscreenElement()) void lockPortrait();
  });
}
