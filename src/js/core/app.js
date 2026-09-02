import { detectPreferredLanguage, setLanguage } from './i18n.js';
import { installDisplayMode, requestImmersiveMode } from './display-mode.js';
import { loadState, saveState } from './storage.js';
import { MusicManager } from '../systems/music-manager.js';
import { bindLanguageScreen } from '../screens/language.js';
import { runSplash } from '../screens/splash.js';

const screens = new Map(
  [...document.querySelectorAll('[data-screen]')].map((element) => [element.dataset.screen, element]),
);

let state = loadState();
let returnScreen = 'title';

const music = new MusicManager(state.settings);
installDisplayMode();
installPWAFoundation();

music.addEventListener('preferencechange', (event) => {
  state = saveState({
    ...state,
    settings: {
      ...state.settings,
      ...event.detail,
    },
  });
});


function installPWAFoundation() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((error) => {
        console.warn('[Lucky Claw] Service worker registration failed.', error);
      });
    }, { once: true });
  }

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    window.LuckyClawPWA = Object.freeze({
      canPrompt: true,
      promptInstall: async () => {
        if (!deferredPrompt) return false;
        const prompt = deferredPrompt;
        deferredPrompt = null;
        await prompt.prompt();
        const choice = await prompt.userChoice.catch(() => null);
        return choice?.outcome === 'accepted';
      },
    });
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.LuckyClawPWA = Object.freeze({ canPrompt: false, promptInstall: async () => false });
  });

  if (!window.LuckyClawPWA) {
    window.LuckyClawPWA = Object.freeze({ canPrompt: false, promptInstall: async () => false });
  }
}

function showScreen(name) {
  screens.forEach((screen, key) => {
    const active = key === name;
    screen.classList.toggle('is-active', active);
    screen.setAttribute('aria-hidden', String(!active));
  });

  document.body.dataset.screen = name;

  if (name === 'title') {
    music.prepareTitle();
    // Browsers may refuse audible autoplay before a trusted gesture.
    // A global first-interaction unlock installed below retries seamlessly.
    void music.play();
  }
}

async function applyLanguage(language) {
  try {
    return await setLanguage(language);
  } catch (error) {
    console.error('[Lucky Claw] Localization failed.', error);
    if (language !== 'en') return setLanguage('en');
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

function unlockExperienceFromGesture() {
  void requestImmersiveMode();
  if (document.body.dataset.screen === 'title' && music.musicEnabled && !music.isPlaying) {
    void music.play();
  }
}

document.addEventListener('pointerdown', unlockExperienceFromGesture, { capture: true });
document.addEventListener('keydown', unlockExperienceFromGesture, { capture: true });

const languageScreen = bindLanguageScreen({
  async onSelect(language) {
    // This tap is a trusted gesture: request immersive mode and start the title soundtrack.
    void requestImmersiveMode();
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

// Reserved production hooks for Build 002/003. Settings owns the visible music controls;
// gameplay owns round locking and urgency without exposing a player over the cabinet.
window.LuckyClawAudio = Object.freeze({
  manager: music,
  lockTrackForRound: () => music.lockTrackForRound(),
  unlockTrackAfterRound: (options) => music.unlockTrackAfterRound(options),
  setUrgency: (secondsRemaining) => music.setUrgency(secondsRemaining),
  resetUrgency: () => music.resetUrgency(),
});
