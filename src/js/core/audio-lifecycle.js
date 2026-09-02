export function bindAudioLifecycle({ music, getScreen }) {
  let autoPausedByLifecycle = false;

  function pauseForLifecycle() {
    if (!music.isPlaying) return false;
    autoPausedByLifecycle = true;
    music.pause();
    return true;
  }

  function resumeIfEligible() {
    if (!autoPausedByLifecycle) return false;
    if (document.hidden) return false;
    if (getScreen() !== 'title') return false;
    if (!music.musicEnabled) return false;

    autoPausedByLifecycle = false;
    void music.play();
    return true;
  }

  function onVisibilityChange() {
    if (document.hidden) pauseForLifecycle();
    else resumeIfEligible();
  }

  function onPageShow() {
    resumeIfEligible();
  }

  function onResume() {
    resumeIfEligible();
  }

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', pauseForLifecycle);
  window.addEventListener('pageshow', onPageShow);
  document.addEventListener('freeze', pauseForLifecycle);
  document.addEventListener('resume', onResume);

  return Object.freeze({
    pauseForLifecycle,
    resumeIfEligible,
    get hasPendingResume() { return autoPausedByLifecycle; },
    destroy() {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', pauseForLifecycle);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('freeze', pauseForLifecycle);
      document.removeEventListener('resume', onResume);
    },
  });
}
