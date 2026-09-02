const INTRO_MS = 2850;
const REDUCED_INTRO_MS = 900;

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function runSplash() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('is-splash-running');
  await delay(reducedMotion ? REDUCED_INTRO_MS : INTRO_MS);
  document.body.classList.remove('is-splash-running');
}
