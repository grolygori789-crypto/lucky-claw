import { detectPreferredLanguage, setLanguage } from './i18n.js';
import { loadState, saveState } from './storage.js';
import { bindLanguageScreen } from '../screens/language.js';
import { runSplash } from '../screens/splash.js';

const screens = new Map(
  [...document.querySelectorAll('[data-screen]')].map((element) => [element.dataset.screen, element]),
);

let state = loadState();
let returnScreen = 'title';

function showScreen(name) {
  screens.forEach((screen, key) => {
    const active = key === name;
    screen.classList.toggle('is-active', active);
    screen.setAttribute('aria-hidden', String(!active));
  });
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

const languageScreen = bindLanguageScreen({
  async onSelect(language) {
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
