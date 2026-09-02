const STORAGE_KEY = 'lucky-claw:save';
export const SCHEMA_VERSION = 2;

const DEFAULT_STATE = Object.freeze({
  schemaVersion: SCHEMA_VERSION,
  language: null,
  points: 0,
  selectedTheme: 'classic',
  ownedThemes: ['classic'],
  collection: {},
  missionProgress: {},
  settings: {
    music: true,
    musicVolume: 0.55,
    musicShuffle: false,
    musicRepeat: 'all',
    musicTrack: 'main-title-theme',
    sfx: true,
    haptics: true,
    reducedEffects: false,
  },
  firstRunComplete: false,
});

const REPEAT_MODES = new Set(['off', 'all', 'one']);
const TRACK_IDS = new Set([
  'main-title-theme',
  'cozy-claw',
  'toy-boutique',
  'lucky-rush',
  'dreamy-arcade',
]);

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function normalizeState(candidate) {
  const safe = cloneDefaults();

  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return safe;
  }

  if (candidate.language === 'th' || candidate.language === 'en' || candidate.language === 'ja') {
    safe.language = candidate.language;
  }

  if (Number.isFinite(candidate.points) && candidate.points >= 0) {
    safe.points = Math.floor(candidate.points);
  }

  if (typeof candidate.selectedTheme === 'string' && candidate.selectedTheme) {
    safe.selectedTheme = candidate.selectedTheme;
  }

  if (Array.isArray(candidate.ownedThemes)) {
    const owned = candidate.ownedThemes.filter((value) => typeof value === 'string' && value);
    safe.ownedThemes = owned.includes('classic') ? [...new Set(owned)] : ['classic', ...new Set(owned)];
  }

  if (candidate.collection && typeof candidate.collection === 'object' && !Array.isArray(candidate.collection)) {
    safe.collection = candidate.collection;
  }

  if (candidate.missionProgress && typeof candidate.missionProgress === 'object' && !Array.isArray(candidate.missionProgress)) {
    safe.missionProgress = candidate.missionProgress;
  }

  if (candidate.settings && typeof candidate.settings === 'object' && !Array.isArray(candidate.settings)) {
    const settings = candidate.settings;

    for (const key of ['music', 'musicShuffle', 'sfx', 'haptics', 'reducedEffects']) {
      if (typeof settings[key] === 'boolean') safe.settings[key] = settings[key];
    }

    if (Number.isFinite(settings.musicVolume)) {
      safe.settings.musicVolume = Math.min(1, Math.max(0, settings.musicVolume));
    }

    if (REPEAT_MODES.has(settings.musicRepeat)) {
      safe.settings.musicRepeat = settings.musicRepeat;
    }

    if (TRACK_IDS.has(settings.musicTrack)) {
      safe.settings.musicTrack = settings.musicTrack;
    }
  }

  safe.firstRunComplete = Boolean(candidate.firstRunComplete && safe.language);
  safe.schemaVersion = SCHEMA_VERSION;
  return safe;
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaults();
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    console.warn('[Lucky Claw] Save data was unreadable; safe defaults restored.', error);
    return cloneDefaults();
  }
}

export function saveState(state) {
  const safe = normalizeState(state);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch (error) {
    console.warn('[Lucky Claw] Progress could not be saved in this browser.', error);
  }

  return safe;
}
