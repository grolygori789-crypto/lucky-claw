export function bindAudioLifecycle({ music, getScreen }) {
  let autoPausedByLifecycle = false;

  function pauseForLifecycle() {
    if (!music.isPlaying) return;
    autoPausedByLifecycle = true;
    music.pause();
  }

  function resumeAfterLifecycle() {
    if (!autoPausedByLifecycle) return;
    autoPausedByLifecycle = false;
    if (getScreen() === 'title' && music.musicEnabled) {
      void music.play();
    }
  }

  function onVisibilityChange() {
    if (document.hidden) pauseForLifecycle();
    else resumeAfterLifecycle();
  }

  function onPageShow() {
    if (!document.hidden) resumeAfterLifecycle();
  }

  function onResume() {
    if (!document.hidden) resumeAfterLifecycle();
  }

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', pauseForLifecycle);
  window.addEventListener('pageshow', onPageShow);
  document.addEventListener('freeze', pauseForLifecycle);
  document.addEventListener('resume', onResume);

  return () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', pauseForLifecycle);
    window.removeEventListener('pageshow', onPageShow);
    document.removeEventListener('freeze', pauseForLifecycle);
    document.removeEventListener('resume', onResume);
  };
}
