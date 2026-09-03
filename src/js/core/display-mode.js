let fullscreenPending = false;

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

export function isInstalledAppMode() {
  return Boolean(
    window.matchMedia?.('(display-mode: standalone)').matches
    || window.matchMedia?.('(display-mode: fullscreen)').matches
    || window.navigator.standalone === true
  );
}

async function lockPortrait() {
  try {
    if (screen.orientation?.lock) await screen.orientation.lock('portrait');
  } catch {
    // Orientation locking is not universally permitted in mobile browsers.
  }
}

export async function requestImmersiveMode() {
  if (fullscreenPending) return false;

  // Installed PWAs already receive fullscreen/standalone chrome from the manifest.
  // Asking the browser for fullscreen again is redundant and may show OS/browser hints.
  if (isInstalledAppMode()) {
    await lockPortrait();
    return true;
  }

  if (fullscreenElement()) {
    await lockPortrait();
    return true;
  }

  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  if (!request) return false;

  try {
    fullscreenPending = true;
    const result = request.call(root, { navigationUI: 'hide' });
    if (result?.then) await result;
    await lockPortrait();
    return Boolean(fullscreenElement());
  } catch {
    return false;
  } finally {
    fullscreenPending = false;
  }
}

function blockGestureZoom(event) { event.preventDefault(); }
function blockMultiTouchZoom(event) { if (event.touches?.length > 1) event.preventDefault(); }
function blockCtrlWheelZoom(event) { if (event.ctrlKey) event.preventDefault(); }
function blockContextMenu(event) { event.preventDefault(); }
function blockDrag(event) { event.preventDefault(); }
function blockSelection(event) { event.preventDefault(); }

export function installDisplayMode() {
  document.documentElement.style.touchAction = 'none';
  document.documentElement.style.webkitTouchCallout = 'none';
  document.body.style.touchAction = 'none';
  document.body.style.webkitTouchCallout = 'none';
  document.body.style.userSelect = 'none';

  document.querySelectorAll('img').forEach((image) => {
    image.draggable = false;
    image.style.webkitUserDrag = 'none';
    image.style.webkitTouchCallout = 'none';
    image.style.userSelect = 'none';
  });

  document.addEventListener('gesturestart', blockGestureZoom, { passive: false });
  document.addEventListener('gesturechange', blockGestureZoom, { passive: false });
  document.addEventListener('gestureend', blockGestureZoom, { passive: false });
  document.addEventListener('touchstart', blockMultiTouchZoom, { passive: false });
  document.addEventListener('touchmove', blockMultiTouchZoom, { passive: false });
  document.addEventListener('dblclick', blockGestureZoom, { passive: false });
  document.addEventListener('wheel', blockCtrlWheelZoom, { passive: false });
  document.addEventListener('contextmenu', blockContextMenu, { passive: false });
  document.addEventListener('dragstart', blockDrag, { passive: false });
  document.addEventListener('selectstart', blockSelection, { passive: false });

  document.addEventListener('fullscreenchange', () => { if (fullscreenElement()) void lockPortrait(); });
  document.addEventListener('webkitfullscreenchange', () => { if (fullscreenElement()) void lockPortrait(); });
}
