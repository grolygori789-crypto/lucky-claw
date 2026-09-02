const SUPPORTED = new Set(['th', 'en']);
let activeLanguage = 'en';
let activeDictionary = {};

export function detectPreferredLanguage() {
  const browser = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  return browser.startsWith('th') ? 'th' : 'en';
}

export async function setLanguage(language) {
  const safeLanguage = SUPPORTED.has(language) ? language : 'en';
  const response = await fetch(`./src/locales/${safeLanguage}.json`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Locale '${safeLanguage}' could not be loaded (${response.status}).`);
  }

  activeDictionary = await response.json();
  activeLanguage = safeLanguage;
  document.documentElement.lang = safeLanguage;
  applyTranslations(document);
  return safeLanguage;
}

export function getLanguage() {
  return activeLanguage;
}

export function translate(key) {
  return activeDictionary[key] ?? key;
}

export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const value = translate(key);
    if (value !== key) element.textContent = value;
  });

  root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    const value = translate(key);
    if (value !== key) element.setAttribute('aria-label', value);
  });

  const chip = root.querySelector('[data-language-code]');
  if (chip) chip.textContent = activeLanguage.toUpperCase();

  const openLanguage = root.querySelector('[data-open-language]');
  if (openLanguage) openLanguage.setAttribute('aria-label', translate('title.language'));
}
