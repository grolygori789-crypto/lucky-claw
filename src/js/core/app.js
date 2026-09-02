import { detectPreferredLanguage, setLanguage, translate } from './i18n.js?v=001.20';
import { installDisplayMode, requestImmersiveMode } from './display-mode.js?v=001.20';
import { loadState, saveState } from './storage.js?v=001.20';
import { bindAudioLifecycle } from './audio-lifecycle.js?v=001.20';
import { createPWAController } from './pwa-install.js?v=001.20';
import { MusicManager } from '../systems/music-manager.js?v=001.20';
import { bindLanguageScreen } from '../screens/language.js?v=001.20';
import { runSplash } from '../screens/splash.js?v=001.20';

const screens = new Map(
  [...document.querySelectorAll('[data-screen]')].map((element) => [element.dataset.screen, element]),
);

let state = loadState();
let returnScreen = 'title';

const music = new MusicManager(state.settings);
installDisplayMode();
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
    // If the OS install sheet/backgrounding paused audio, resume the same
    // unlocked media element. Otherwise try normal playback; the global
    // trusted-gesture handler remains the fallback for autoplay-restricted browsers.
    if (!audioLifecycle.resumeIfEligible()) void music.play();
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

function unlockExperienceFromGesture(event) {
  if (event.target?.closest?.('[data-install-primary]')) return;

  // Audio MUST be requested before fullscreen. Fullscreen can consume the
  // browser's transient user activation and make a later audio.play() fail.
  if (document.body.dataset.screen === 'title' && music.musicEnabled && !music.isPlaying) {
    music.prepareTitle();
    void music.play();
  }

  void requestImmersiveMode();
}

document.addEventListener('pointerdown', unlockExperienceFromGesture, { capture: true });
document.addEventListener('touchstart', unlockExperienceFromGesture, { capture: true, passive: true });
document.addEventListener('click', unlockExperienceFromGesture, { capture: true });
document.addEventListener('keydown', unlockExperienceFromGesture, { capture: true });

const languageScreen = bindLanguageScreen({
  async onSelect(language) {
    // Preserve the trusted gesture for audio first; fullscreen comes second.
    music.prepareTitle();
    void music.play();
    void requestImmersiveMode();

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
    // If the native prompt was dismissed, continue in-browser without trapping the user.
    void requestImmersiveMode();
    closeInstallGate();
    return;
  }

  // iOS and browsers without beforeinstallprompt cannot be installed by script.
  // The card already shows the exact OS/browser action; continue in immersive mode.
  void requestImmersiveMode();
  closeInstallGate();
});

installLater?.addEventListener('click', () => {
  sessionStorage.setItem('lucky-claw:install-dismissed', '1');
  unlockTitleAudio();
  void requestImmersiveMode();
  closeInstallGate();
});

async function bootstrap() {
  const preferredLanguage = state.language || detectPreferredLanguage();
  await Promise.all([applyLanguage(preferredLanguage), waitForCabinet()]);

  showScreen('splash');
  await runSplash();

  // Put the real title behind the install sheet first. This keeps audio in the
  // correct screen state if Android temporarily backgrounds the page while the
  // native installer is open, and it makes the install interaction a valid
  // gesture for unlocking the title soundtrack.
  showScreen('title');
  await maybeShowInstallGate();

  if (state.firstRunComplete && state.language) return;

  returnScreen = 'title';
  showScreen('language');
  languageScreen.focusPreferred(preferredLanguage);
}

bootstrap().catch((error) => {
  console.error('[Lucky Claw] App failed to start.', error);
});

// Reserved production hooks for Build 002/003. Settings owns the visible music controls;
// gameplay owns round locking and urgency without exposing a player over the cabinet.
window.LuckyClawBuild = Object.freeze({ id: '001.20' });

window.LuckyClawAudio = Object.freeze({
  manager: music,
  lockTrackForRound: () => music.lockTrackForRound(),
  unlockTrackAfterRound: (options) => music.unlockTrackAfterRound(options),
  setUrgency: (secondsRemaining) => music.setUrgency(secondsRemaining),
  resetUrgency: () => music.resetUrgency(),
});
