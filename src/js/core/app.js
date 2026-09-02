import { detectPreferredLanguage, setLanguage } from './i18n.js';
import { loadState, saveState } from './storage.js';
import { MusicManager } from '../systems/music-manager.js';
import { bindLanguageScreen } from '../screens/language.js';
import { bindTitlePlayer } from '../screens/title-player.js';
import { runSplash } from '../screens/splash.js';

const screens = new Map(
  [...document.querySelectorAll('[data-screen]')].map((element) => [element.dataset.screen, element]),
);

let state = loadState();
let returnScreen = 'title';

const music = new MusicManager(state.settings);
const titlePlayer = bindTitlePlayer(music);

music.addEventListener('preferencechange', (event) => {
  state = saveState({
    ...state,
    settings: {
      ...state.settings,
      ...event.detail,
    },
  });
});

function showScreen(name) {
  screens.forEach((screen, key) => {
    const active = key === name;
    screen.classList.toggle('is-active', active);
    screen.setAttribute('aria-hidden', String(!active));
  });

  document.body.dataset.screen = name;
  if (name === 'title') music.prepareTitle();
}

async function applyLanguage(language) {
  try {
    const applied = await setLanguage(language);
    titlePlayer.refresh();
    return applied;
  } catch (error) {
    console.error('[Lucky Claw] Localization failed.', error);
    if (language !== 'en') {
      const applied = await setLanguage('en');
      titlePlayer.refresh();
      return applied;
    }
    throw error;
  }
}

function waitForCabinet() {
  const image = document.querySelector('.cabinet-stage__image');
  if (!image || image.complete) return Promise.resolve();
  return new Promise((resolve) => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', resolve, { once: true });
  });
}

const languageScreen = bindLanguageScreen({
  async onSelect(language) {
    // The language tap is a genuine user gesture, so use it to start the title soundtrack.
    // If the browser still blocks playback, the compact title player remains available.
    music.prepareTitle();
    void music.play();

    const applied = await applyLanguage(language);
    state = saveState({
      ...state,
      language: applied,
      firstRunComplete: true,
    });
    showScreen(returnScreen);
  },
});

document.querySelector('[data-open-language]')?.addEventListener('click', () => {
  returnScreen = 'title';
  showScreen('language');
  languageScreen.focusPreferred(state.language || detectPreferredLanguage());
});

async function bootstrap() {
  const preferredLanguage = state.language || detectPreferredLanguage();
  await Promise.all([applyLanguage(preferredLanguage), waitForCabinet()]);

  showScreen('splash');
  await runSplash();

  if (state.firstRunComplete && state.language) {
    showScreen('title');
    return;
  }

  returnScreen = 'title';
  showScreen('language');
  languageScreen.focusPreferred(preferredLanguage);
}

bootstrap().catch((error) => {
  console.error('[Lucky Claw] App failed to start.', error);
});

// Reserved production hooks for Build 003 gameplay. Keeping them on one namespace
// avoids wiring UI directly to audio internals later.
window.LuckyClawAudio = Object.freeze({
  lockTrackForRound: () => music.lockTrackForRound(),
  unlockTrackAfterRound: (options) => music.unlockTrackAfterRound(options),
  setUrgency: (secondsRemaining) => music.setUrgency(secondsRemaining),
  resetUrgency: () => music.resetUrgency(),
});
