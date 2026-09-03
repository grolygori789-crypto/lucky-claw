import { detectPreferredLanguage, setLanguage, translate } from './i18n.js?v=002.03';
import { installDisplayMode, requestImmersiveMode, exitImmersiveMode, isInstalledAppMode } from './display-mode.js?v=002.03';
import { loadState, saveState, clearGameProgress } from './storage.js?v=002.01';
import { bindAudioLifecycle } from './audio-lifecycle.js?v=001.20';
import { createPWAController } from './pwa-install.js?v=001.20';
import { MusicManager } from '../systems/music-manager.js?v=001.20';
import { bindLanguageScreen } from '../screens/language.js?v=001.20';
import { runSplash } from '../screens/splash.js?v=001.20';
import { bindMainMenu } from '../screens/main-menu.js?v=002.03';
import { bindSettingsScreen, createToast } from '../screens/settings.js?v=002.03';

const BUILD_ID = '002.03';
const screens = new Map(
  [...document.querySelectorAll('.screen[data-screen]')].map((element) => [element.dataset.screen, element]),
);

let state = loadState();
let returnScreen = 'title';
let immersiveGestureAttempted = false;

const music = new MusicManager(state.settings);
const showToast = createToast();
installDisplayMode();

document.body.classList.toggle('reduce-effects', Boolean(state.settings.reducedEffects));

const pwa = createPWAController({
  onInstalled: () => document.querySelector('[data-install-gate]')?.setAttribute('hidden', ''),
});

music.addEventListener('preferencechange', (event) => {
  state = saveState({
    ...state,
    settings: {
      ...state.settings,
      ...event.detail,
    },
  });
  settingsController?.refresh();
});

const audioLifecycle = bindAudioLifecycle({
  music,
  getScreen: () => document.body.dataset.screen,
});

function showScreen(name) {
  screens.forEach((screen, key) => {
    const active = key === name;
    screen.classList.toggle('is-active', active);
    screen.setAttribute('aria-hidden', String(!active));
  });

  document.body.dataset.screen = name;

  if (name === 'title') {
    music.prepareTitle();
    if (!audioLifecycle.resumeIfEligible()) void music.play();
  } else if (name === 'menu') {
    void music.restorePreferredTrack({ autoplay: music.musicEnabled });
  }
}

async function applyLanguage(language) {
  try {
    const applied = await setLanguage(language);
    settingsController?.refresh();
    return applied;
  } catch (error) {
    console.error('[Lucky Claw] Localization failed.', error);
    if (language !== 'en') return setLanguage('en');
    throw error;
  }
}

async function waitForImageReady(image) {
  if (!image) return;

  if (!image.complete) {
    await new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  }

  if (typeof image.decode === 'function') {
    try { await image.decode(); } catch {}
  }
}

async function waitForCriticalVisuals() {
  const criticalImages = [
    document.querySelector('.cabinet-stage__image'),
    document.querySelector('.cabinet-title-plush__image'),
    document.querySelector('.cabinet-title-rail__image'),
    document.querySelector('.cabinet-title-claw-head__image'),
  ].filter(Boolean);

  await Promise.all(criticalImages.map(waitForImageReady));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function revealBootSurface() {
  document.body.dataset.bootReady = 'true';
}

function maybeRequestImmersiveFromGesture() {
  if (isInstalledAppMode() || immersiveGestureAttempted) return;
  immersiveGestureAttempted = true;
  void requestImmersiveMode();
}

function unlockExperienceFromGesture(event) {
  if (event.target?.closest?.('[data-install-primary], [data-title-exit]')) return;
  const screen = document.body.dataset.screen;
  if (screen !== 'title' && screen !== 'language') return;

  // Audio first: fullscreen may consume transient user activation.
  if (screen === 'title' && music.musicEnabled && !music.isPlaying) {
    music.prepareTitle();
    void music.play();
  }

  maybeRequestImmersiveFromGesture();
}

document.addEventListener('pointerdown', unlockExperienceFromGesture, { capture: true });
document.addEventListener('keydown', unlockExperienceFromGesture, { capture: true });

const languageScreen = bindLanguageScreen({
  async onSelect(language) {
    music.prepareTitle();
    void music.play();
    maybeRequestImmersiveFromGesture();

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
  returnScreen = document.body.dataset.screen === 'menu' ? 'menu' : 'title';
  showScreen('language');
  languageScreen.focusPreferred(state.language || detectPreferredLanguage());
});

const installGate = document.querySelector('[data-install-gate]');
const installPrimary = installGate?.querySelector('[data-install-primary]');
const installLater = installGate?.querySelector('[data-install-later]');
const installMessage = installGate?.querySelector('[data-install-message]');
let installGateResolve = null;
let installGateMode = 'native';

function unlockTitleAudio() {
  if (!music.musicEnabled) return;
  music.prepareTitle();
  void music.play();
}

function closeInstallGate() {
  if (!installGate) return;
  installGate.hidden = true;
  installGateResolve?.();
  installGateResolve = null;
}

function refreshInstallGateCopy(mode) {
  installGateMode = mode;
  if (!installMessage || !installPrimary) return;

  if (mode === 'native') {
    installMessage.textContent = translate('install.body');
    installPrimary.textContent = translate('install.primary');
    return;
  }

  if (mode === 'ios') {
    installMessage.textContent = translate('install.ios');
    installPrimary.textContent = translate('install.continue');
    return;
  }

  installMessage.textContent = translate('install.manual');
  installPrimary.textContent = translate('install.continue');
}

async function maybeShowInstallGate() {
  if (!installGate || pwa.isStandalone() || !pwa.isMobile()) return;
  if (sessionStorage.getItem('lucky-claw:install-dismissed') === '1') return;

  const nativeReady = await pwa.waitForNativePrompt(1400);
  const mode = nativeReady ? 'native' : pwa.isIOS() ? 'ios' : 'manual';
  refreshInstallGateCopy(mode);
  installGate.hidden = false;
  await new Promise((resolve) => { installGateResolve = resolve; });
}

installPrimary?.addEventListener('click', async () => {
  unlockTitleAudio();

  if (installGateMode === 'native') {
    const result = await pwa.promptInstall();
    if (result.accepted) {
      closeInstallGate();
      return;
    }
  }

  // For a normal browser this may show the browser's own fullscreen education hint.
  // Installed PWAs skip requestFullscreen entirely in display-mode.js.
  maybeRequestImmersiveFromGesture();
  closeInstallGate();
});

installLater?.addEventListener('click', () => {
  sessionStorage.setItem('lucky-claw:install-dismissed', '1');
  unlockTitleAudio();
  maybeRequestImmersiveFromGesture();
  closeInstallGate();
});

function updateSettings(patch) {
  state = saveState({
    ...state,
    settings: { ...state.settings, ...patch },
  });
  document.body.classList.toggle('reduce-effects', Boolean(state.settings.reducedEffects));
  return state;
}

async function changeLanguageFromSettings(language) {
  const applied = await applyLanguage(language);
  state = saveState({ ...state, language: applied, firstRunComplete: true });
  return applied;
}

function resetProgress() {
  state = clearGameProgress(state);
  return state;
}

async function exitGame() {
  // Save synchronously before leaving. Gameplay will write into the same state object
  // as later builds add stage/high-score updates.
  state = saveState(state);
  music.pause();

  // Try to close while the confirmation button still owns the trusted user gesture.
  // Browsers only honor this for contexts they permit scripts to close.
  try { window.close(); } catch {}

  // If the environment stays open, leave browser fullscreen and show a safe-to-close fallback.
  // Installed PWAs have no standard script-controlled app-close API.
  await exitImmersiveMode();
}

let settingsController = null;
settingsController = bindSettingsScreen({
  music,
  getState: () => state,
  updateSettings,
  onLanguage: changeLanguageFromSettings,
  onClearProgress: resetProgress,
  onExit: exitGame,
  onBack: () => showScreen('menu'),
  showToast,
});

bindMainMenu({
  onEnterMenu: () => showScreen('menu'),
  onBackToTitle: () => showScreen('title'),
  onSettings: () => {
    showScreen('settings');
    settingsController.refresh();
  },
  onHowToPlay: () => settingsController.showHowToPlay(),
  onExit: () => settingsController.showExitConfirm(),
  onFeature: (item) => {
    const key = item === 'play' ? 'menu.playNext' : 'menu.featureComing';
    showToast(translate(key));
  },
});

async function bootstrap() {
  const preferredLanguage = state.language || detectPreferredLanguage();
  await Promise.all([applyLanguage(preferredLanguage), waitForCriticalVisuals()]);
  revealBootSurface();

  showScreen('splash');
  await runSplash();

  showScreen('title');
  await maybeShowInstallGate();

  if (state.firstRunComplete && state.language) return;

  returnScreen = 'title';
  showScreen('language');
  languageScreen.focusPreferred(preferredLanguage);
}

bootstrap().catch((error) => {
  console.error('[Lucky Claw] App failed to start.', error);
  revealBootSurface();
});

window.LuckyClawBuild = Object.freeze({ id: BUILD_ID });
window.LuckyClawAudio = Object.freeze({
  manager: music,
  lockTrackForRound: () => music.lockTrackForRound(),
  unlockTrackAfterRound: (options) => music.unlockTrackAfterRound(options),
  setUrgency: (secondsRemaining) => music.setUrgency(secondsRemaining),
  resetUrgency: () => music.resetUrgency(),
});
