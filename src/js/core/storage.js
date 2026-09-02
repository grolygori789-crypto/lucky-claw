const STORAGE_KEY = 'lucky-claw:save';
export const SCHEMA_VERSION = 1;

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
    sfx: true,
    haptics: true,
    reducedEffects: false,
  },
  firstRunComplete: false,
});

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function normalizeState(candidate) {
  const safe = cloneDefaults();

  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return safe;
  }

  if (candidate.language === 'th' || candidate.language === 'en') {
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
    for (const key of Object.keys(safe.settings)) {
      if (typeof candidate.settings[key] === 'boolean') safe.settings[key] = candidate.settings[key];
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

