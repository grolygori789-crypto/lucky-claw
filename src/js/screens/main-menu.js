export function bindMainMenu({ onEnterMenu, onBackToTitle, onSettings, onHowToPlay, onExit, onFeature }) {
  const titleScreen = document.querySelector('.screen--title');
  const startPrompt = document.querySelector('[data-title-start]');
  const menuScreen = document.querySelector('.screen--menu');
  const exitButton = document.querySelector('[data-title-exit]');
  const backButton = document.querySelector('[data-menu-back]');

  function enterMenu(event) {
    if (document.body.dataset.screen !== 'title') return;
    if (event?.target?.closest?.('[data-open-language], [data-title-exit]')) return;
    onEnterMenu?.();
  }

  startPrompt?.addEventListener('click', enterMenu);
  exitButton?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onExit?.();
  });
  titleScreen?.addEventListener('click', (event) => {
    if (event.target.closest('[data-title-start], [data-title-exit]')) return;
    enterMenu(event);
  });

  backButton?.addEventListener('click', () => onBackToTitle?.());

  menuScreen?.querySelectorAll('[data-menu-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.dataset.menuItem;
      if (item === 'settings') return onSettings?.();
      if (item === 'howto') return onHowToPlay?.();
      onFeature?.(item);
    });
  });

  return Object.freeze({ focusStart: () => startPrompt?.focus() });
}
