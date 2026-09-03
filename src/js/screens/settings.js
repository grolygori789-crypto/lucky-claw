import { getLanguage, translate } from '../core/i18n.js?v=002.02';
import { SOUNDTRACK } from '../data/soundtrack.js';
import { SUPPORT } from '../data/support.js?v=002.01';
import { getLegalDocument, getLegalMeta } from '../data/legal-content.js?v=002.01';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function createToast() {
  let toast = document.querySelector('.lc-toast');
  let timer = 0;
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'lc-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
  }

  return (message, duration = 1900) => {
    window.clearTimeout(timer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    timer = window.setTimeout(() => toast.classList.remove('is-visible'), duration);
  };
}

export function bindSettingsScreen({
  music,
  getState,
  updateSettings,
  onLanguage,
  onClearProgress,
  onExit,
  onBack,
  showToast,
}) {
  const screen = document.querySelector('.screen--settings');
  const modal = document.querySelector('[data-app-modal]');
  const modalTitle = modal?.querySelector('[data-modal-title]');
  const modalBody = modal?.querySelector('[data-modal-body]');
  const modalActions = modal?.querySelector('[data-modal-actions]');
  const settingInputs = new Map(
    [...screen.querySelectorAll('[data-setting]')].map((input) => [input.dataset.setting, input]),
  );
  const languageButtons = [...screen.querySelectorAll('[data-settings-language]')];
  const musicTitle = screen.querySelector('[data-music-title]');
  const playButton = screen.querySelector('[data-music-play]');
  const volume = screen.querySelector('[data-music-volume]');
  const shuffleState = screen.querySelector('[data-shuffle-state]');
  const repeatState = screen.querySelector('[data-repeat-state]');
  const trackSelect = screen.querySelector('[data-music-track]');

  const repeatLabel = (mode) => translate(`settings.repeat.${mode}`);
  const onOff = (value) => translate(value ? 'common.on' : 'common.off');

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modalBody.innerHTML = '';
    modalActions.replaceChildren();
    modal.classList.remove('is-exit-confirm');
  }

  function addModalAction(label, className, handler, { href = null } = {}) {
    const element = href ? document.createElement('a') : document.createElement('button');
    if (!href) element.type = 'button';
    element.textContent = label;
    if (className) element.className = className;
    if (href) {
      element.href = href;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
    }
    if (handler) element.addEventListener('click', handler);
    modalActions.append(element);
    return element;
  }

  function openModal({ title, html, actions = [], variant = null }) {
    if (!modal) return;
    modal.classList.toggle('is-exit-confirm', variant === 'exit');
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modalActions.replaceChildren();
    for (const action of actions) addModalAction(action.label, action.className, action.handler, action);
    modal.hidden = false;
    modal.querySelector('.lc-modal__header [data-modal-close]')?.focus();
  }

  modal?.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  function syncMusic(snapshot = music.snapshot) {
    if (musicTitle) musicTitle.textContent = snapshot.track.title;
    if (playButton) {
      playButton.textContent = snapshot.isPlaying ? 'Ⅱ' : '▶';
      playButton.setAttribute('aria-label', translate(snapshot.isPlaying ? 'music.pause' : 'music.play'));
    }
    if (volume) volume.value = String(Math.round(snapshot.volume * 100));
    if (shuffleState) shuffleState.textContent = onOff(snapshot.shuffle);
    if (repeatState) repeatState.textContent = repeatLabel(snapshot.repeat);
    if (trackSelect && trackSelect.value !== snapshot.track.id) trackSelect.value = snapshot.track.id;
  }

  function syncState() {
    const state = getState();
    for (const key of ['music', 'sfx', 'haptics', 'reducedEffects']) {
      const input = settingInputs.get(key);
      if (input) input.checked = Boolean(state.settings[key]);
    }
    document.body.classList.toggle('reduce-effects', Boolean(state.settings.reducedEffects));
    languageButtons.forEach((button) => button.classList.toggle('is-selected', button.dataset.settingsLanguage === state.language));

    const summary = {
      points: state.points || 0,
      stage: state.stageProgress?.highestUnlocked || 1,
      trophies: Object.values(state.trophies || {}).filter(Boolean).length,
      highscores: Object.values(state.highScoresByStage || {}).filter((score) => Number(score) > 0).length,
    };
    Object.entries(summary).forEach(([key, value]) => {
      const node = screen.querySelector(`[data-stat="${key}"]`);
      if (node) node.textContent = String(value);
    });
    syncMusic();
  }

  if (trackSelect) {
    trackSelect.replaceChildren(...SOUNDTRACK.map((track) => {
      const option = document.createElement('option');
      option.value = track.id;
      option.textContent = track.title;
      return option;
    }));
  }

  settingInputs.forEach((input, key) => {
    input.addEventListener('change', () => {
      if (key === 'music') {
        if (input.checked !== music.musicEnabled) music.toggleMute();
        if (input.checked && !music.isPlaying) void music.play();
        syncState();
        return;
      }
      updateSettings({ [key]: input.checked });
      syncState();
    });
  });

  screen.querySelector('[data-music-previous]')?.addEventListener('click', () => void music.previous());
  screen.querySelector('[data-music-next]')?.addEventListener('click', () => void music.next());
  playButton?.addEventListener('click', () => void music.togglePlayback());
  volume?.addEventListener('input', () => music.setVolume(Number(volume.value) / 100));
  screen.querySelector('[data-music-shuffle]')?.addEventListener('click', () => music.setShuffle(!music.shuffle));
  screen.querySelector('[data-music-repeat]')?.addEventListener('click', () => music.cycleRepeat());
  trackSelect?.addEventListener('change', () => void music.selectTrack(trackSelect.value));

  music.addEventListener('statechange', (event) => syncMusic(event.detail));

  languageButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      await onLanguage(button.dataset.settingsLanguage);
      syncState();
    });
  });

  function diagnosticPayload() {
    const state = getState();
    return [
      'Lucky Claw diagnostic info',
      'Build: 002.02',
      `Language: ${state.language || 'unset'}`,
      `Mode: ${window.matchMedia?.('(display-mode: standalone)').matches ? 'standalone' : 'browser'}`,
      `Viewport: ${window.innerWidth}x${window.innerHeight}`,
      `UA: ${navigator.userAgent}`,
    ].join('\n');
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch {}
    }
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }

  function openFeedbackModal(type) {
    const isReport = type === 'report';
    openModal({
      title: translate(isReport ? 'feedback.reportTitle' : 'feedback.feedbackTitle'),
      html: `
        <div class="feedback-panel">
          <p>${escapeHtml(translate(isReport ? 'feedback.reportIntro' : 'feedback.feedbackIntro'))}</p>
          <label class="feedback-field">
            <span>${escapeHtml(translate('feedback.messageLabel'))}</span>
            <textarea data-feedback-message maxlength="1200" rows="6" placeholder="${escapeHtml(translate(isReport ? 'feedback.reportPlaceholder' : 'feedback.feedbackPlaceholder'))}"></textarea>
          </label>
          <label class="feedback-check">
            <input data-feedback-tech type="checkbox" checked>
            <span><strong>${escapeHtml(translate('feedback.includeTech'))}</strong><small>${escapeHtml(translate('feedback.techNote'))}</small></span>
          </label>
          <p class="feedback-privacy">${escapeHtml(translate('feedback.privacy'))}</p>
          <p class="feedback-mail-note">${escapeHtml(translate('feedback.mailNote'))}</p>
        </div>`,
      actions: [
        { label: translate('common.cancel'), handler: closeModal },
        {
          label: translate('feedback.openEmail'),
          className: 'is-primary',
          handler: () => {
            const message = modalBody.querySelector('[data-feedback-message]')?.value.trim() || '';
            if (!message) {
              showToast(translate('feedback.messageRequired'));
              modalBody.querySelector('[data-feedback-message]')?.focus();
              return;
            }
            const includeTech = Boolean(modalBody.querySelector('[data-feedback-tech]')?.checked);
            const subject = isReport ? 'Lucky Claw — Problem Report' : 'Lucky Claw — Feedback';
            const body = [
              isReport ? 'Lucky Claw — Problem Report' : 'Lucky Claw — Feedback',
              '',
              'Message:',
              message,
              ...(includeTech ? ['', 'Technical details:', diagnosticPayload()] : []),
              '',
              '---',
              `Sent voluntarily to ${SUPPORT.supportEmail}.`,
            ].join('\n');
            window.location.href = `mailto:${SUPPORT.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          },
        },
      ],
    });
    window.setTimeout(() => modalBody.querySelector('[data-feedback-message]')?.focus(), 0);
  }

  screen.querySelector('[data-settings-back]')?.addEventListener('click', () => onBack?.());
  screen.querySelector('[data-how-to-play]')?.addEventListener('click', showHowToPlay);
  screen.querySelector('[data-report-problem]')?.addEventListener('click', () => openFeedbackModal('report'));
  screen.querySelector('[data-send-feedback]')?.addEventListener('click', () => openFeedbackModal('feedback'));

  screen.querySelector('[data-copy-diagnostics]')?.addEventListener('click', async () => {
    await copyText(diagnosticPayload());
    showToast(translate('settings.diagnosticsCopied'));
  });

  screen.querySelector('[data-support-kofi]')?.addEventListener('click', () => {
    window.open(SUPPORT.kofiUrl, '_blank', 'noopener,noreferrer');
  });

  screen.querySelector('[data-support-promptpay]')?.addEventListener('click', () => {
    const recipient = getLanguage() === 'th' ? SUPPORT.recipientTh : SUPPORT.recipientEn;
    openModal({
      title: translate('support.promptPayTitle'),
      html: `
        <div class="promptpay-panel">
          <p>${escapeHtml(translate('support.promptPayLead'))}</p>
          <img src="${SUPPORT.promptPayQrUrl}" alt="PromptPay QR" draggable="false">
          <strong>${escapeHtml(translate('support.recipient'))}: ${escapeHtml(recipient)}</strong>
          <small>${escapeHtml(translate('support.verify'))}</small>
          <small>${escapeHtml(translate('support.note'))}</small>
        </div>`,
      actions: [
        { label: translate('common.close'), handler: closeModal },
        { label: translate('support.openFullQr'), className: 'is-primary', href: SUPPORT.promptPayQrUrl },
      ],
    });
  });

  screen.querySelector('[data-clear-data]')?.addEventListener('click', () => {
    openModal({
      title: translate('settings.clearData'),
      html: `<p>${escapeHtml(translate('settings.clearConfirm1'))}</p><p><strong>${escapeHtml(translate('settings.clearKeeps'))}</strong></p>`,
      actions: [
        { label: translate('common.cancel'), handler: closeModal },
        {
          label: translate('settings.continueClear'),
          className: 'is-danger',
          handler: () => {
            openModal({
              title: translate('settings.clearFinalTitle'),
              html: `<p>${escapeHtml(translate('settings.clearConfirm2'))}</p>`,
              actions: [
                { label: translate('common.cancel'), handler: closeModal },
                {
                  label: translate('settings.clearNow'),
                  className: 'is-danger',
                  handler: () => {
                    onClearProgress();
                    closeModal();
                    syncState();
                    showToast(translate('settings.cleared'));
                  },
                },
              ],
            });
          },
        },
      ],
    });
  });

  screen.querySelector('[data-legal-center]')?.addEventListener('click', showLegalCenter);

  screen.querySelector('[data-exit-game]')?.addEventListener('click', showExitConfirm);

  function showExitComplete() {
    openModal({
      title: translate('exit.savedTitle'),
      variant: 'exit',
      html: `
        <div class="exit-confirm">
          <div class="exit-confirm__icon" aria-hidden="true">✓</div>
          <p>${escapeHtml(translate('exit.savedBody'))}</p>
        </div>`,
      actions: [{ label: translate('common.close'), className: 'is-primary', handler: closeModal }],
    });
  }

  function showExitConfirm() {
    openModal({
      title: translate('exit.title'),
      variant: 'exit',
      html: `
        <div class="exit-confirm">
          <div class="exit-confirm__icon" aria-hidden="true">×</div>
          <p>${escapeHtml(translate('exit.body'))}</p>
          <span class="exit-confirm__saved">${escapeHtml(translate('exit.savedNote'))}</span>
        </div>`,
      actions: [
        { label: translate('exit.cancel'), handler: closeModal },
        {
          label: translate('exit.confirm'),
          className: 'is-primary',
          handler: async () => {
            await onExit?.();
            window.setTimeout(() => {
              if (document.visibilityState !== 'hidden') showExitComplete();
            }, 260);
          },
        },
      ],
    });
  }

  function showHowToPlay() {
    openModal({
      title: translate('menu.howToPlay'),
      html: `
        <h3>${escapeHtml(translate('howto.goalTitle'))}</h3>
        <p>${escapeHtml(translate('howto.goalBody'))}</p>
        <h3>${escapeHtml(translate('howto.controlsTitle'))}</h3>
        <ul>
          <li>${escapeHtml(translate('howto.joystick'))}</li>
          <li>${escapeHtml(translate('howto.shuffle'))}</li>
          <li>${escapeHtml(translate('howto.drop'))}</li>
        </ul>
        <h3>${escapeHtml(translate('howto.scoreTitle'))}</h3>
        <p>${escapeHtml(translate('howto.scoreBody'))}</p>`,
      actions: [{ label: translate('common.close'), className: 'is-primary', handler: closeModal }],
    });
  }

  function showLegalCenter() {
    const meta = getLegalMeta();
    openModal({
      title: translate('settings.legalCenter'),
      html: `
        <p class="legal-meta">${escapeHtml(translate('legal.meta').replace('{version}', meta.version))}</p>
        <div class="legal-menu">
          <button type="button" data-legal-doc="terms"><span>${escapeHtml(translate('legal.terms'))}</span><span>›</span></button>
          <button type="button" data-legal-doc="privacy"><span>${escapeHtml(translate('legal.privacy'))}</span><span>›</span></button>
          <button type="button" data-legal-doc="copyright"><span>${escapeHtml(translate('legal.copyright'))}</span><span>›</span></button>
          <button type="button" data-legal-doc="thirdParty"><span>${escapeHtml(translate('legal.thirdParty'))}</span><span>›</span></button>
        </div>
        <p class="legal-footer">© 2026 Benedict Interactive<br>Bangkok, Thailand</p>`,
      actions: [{ label: translate('common.close'), className: 'is-primary', handler: closeModal }],
    });

    modalBody.querySelectorAll('[data-legal-doc]').forEach((button) => {
      button.addEventListener('click', () => showLegalDocument(button.dataset.legalDoc));
    });
  }

  function showLegalDocument(type) {
    const doc = getLegalDocument(type, getLanguage());
    openModal({
      title: doc.title,
      html: doc.body,
      actions: [
        { label: translate('legal.backToCenter'), handler: showLegalCenter },
        { label: translate('common.close'), className: 'is-primary', handler: closeModal },
      ],
    });
  }

  syncState();

  return Object.freeze({
    refresh: syncState,
    showHowToPlay,
    showLegalCenter,
    showExitConfirm,
  });
}
