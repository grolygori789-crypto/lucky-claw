const STORAGE_KEY = 'lucky-claw:save';
export const SCHEMA_VERSION = 3;

const DEFAULT_STATE = Object.freeze({
  schemaVersion: SCHEMA_VERSION,
  language: null,
  points: 0,
  selectedTheme: 'classic',
  ownedThemes: ['classic'],
  collection: {},
  missionProgress: {},
  stageProgress: {
    highestUnlocked: 1,
    highestCompleted: 0,
  },
  highScoresByStage: {},
  trophies: {},
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

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function safeRecord(candidate) {
  return isPlainObject(candidate) ? candidate : {};
}

function normalizeState(candidate) {
  const safe = cloneDefaults();

  if (!isPlainObject(candidate)) return safe;

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

  safe.collection = safeRecord(candidate.collection);
  safe.missionProgress = safeRecord(candidate.missionProgress);
  safe.highScoresByStage = safeRecord(candidate.highScoresByStage);
  safe.trophies = safeRecord(candidate.trophies);

  if (isPlainObject(candidate.stageProgress)) {
    const highestUnlocked = Number.isFinite(candidate.stageProgress.highestUnlocked)
      ? Math.max(1, Math.floor(candidate.stageProgress.highestUnlocked))
      : 1;
    const highestCompleted = Number.isFinite(candidate.stageProgress.highestCompleted)
      ? Math.max(0, Math.floor(candidate.stageProgress.highestCompleted))
      : 0;
    safe.stageProgress.highestUnlocked = highestUnlocked;
    safe.stageProgress.highestCompleted = Math.min(highestCompleted, highestUnlocked);
  }

  if (isPlainObject(candidate.settings)) {
    const settings = candidate.settings;

    for (const key of ['music', 'musicShuffle', 'sfx', 'haptics', 'reducedEffects']) {
      if (typeof settings[key] === 'boolean') safe.settings[key] = settings[key];
    }

    if (Number.isFinite(settings.musicVolume)) {
      safe.settings.musicVolume = Math.min(1, Math.max(0, settings.musicVolume));
    }

    if (REPEAT_MODES.has(settings.musicRepeat)) safe.settings.musicRepeat = settings.musicRepeat;
    if (TRACK_IDS.has(settings.musicTrack)) safe.settings.musicTrack = settings.musicTrack;
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

export function clearGameProgress(state) {
  const current = normalizeState(state);
  const cleared = cloneDefaults();

  // A progress reset is destructive only to game progress. Personal preferences,
  // language and first-run completion are intentionally preserved.
  cleared.language = current.language;
  cleared.settings = current.settings;
  cleared.firstRunComplete = current.firstRunComplete;
  return saveState(cleared);
}

export function summarizeProgress(state) {
  const safe = normalizeState(state);
  return {
    points: safe.points,
    highestStage: safe.stageProgress.highestUnlocked,
    trophies: Object.values(safe.trophies).filter(Boolean).length,
    highScores: Object.values(safe.highScoresByStage).filter((value) => Number.isFinite(value) && value > 0).length,
  };
}
