export function bindLanguageScreen({ onSelect }) {
  const buttons = [...document.querySelectorAll('[data-language]')];
  let busy = false;

  const select = async (language, button) => {
    if (busy) return;
    busy = true;
    buttons.forEach((item) => item.classList.toggle('is-selected', item === button));

    try {
      await onSelect(language);
    } finally {
      busy = false;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => select(button.dataset.language, button));
  });

  return {
    focusPreferred(language) {
      const preferred = buttons.find((button) => button.dataset.language === language) || buttons[0];
      window.requestAnimationFrame(() => preferred?.focus({ preventScroll: true }));
    },
  };
}
