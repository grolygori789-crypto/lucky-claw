import { getStage, PLUSH_TYPES } from './stage-data.js?v=003';
import { ArcadeSfx } from './sfx.js?v=003';
import { clamp, chooseGrabOutcome, shufflePlush, applyCaptureProgress, applyRoundResult } from './gameplay-model.js?v=003';

const COPY = Object.freeze({
  en: Object.freeze({ stage: 'STAGE', score: 'SCORE', target: 'TARGET', best: 'BEST', shuffle: 'SHUFFLE', drop: 'DROP', menu: 'MENU', clear: 'STAGE CLEAR', fail: 'TIME UP', replay: 'PLAY AGAIN', points: 'Claw Points', newBest: 'NEW HIGH SCORE', grip: 'Great grip!', lateSlip: 'So close!', earlySlip: 'Slipped!', miss: 'Missed!', ready: 'READY' }),
  th: Object.freeze({ stage: 'ด่าน', score: 'คะแนน', target: 'เป้าหมาย', best: 'สูงสุด', shuffle: 'เขย่า', drop: 'คีบ', menu: 'เมนู', clear: 'ผ่านด่านแล้ว', fail: 'หมดเวลา', replay: 'เล่นอีกครั้ง', points: 'Claw Points', newBest: 'HIGH SCORE ใหม่', grip: 'คีบอยู่!', lateSlip: 'เกือบแล้ว!', earlySlip: 'หลุด!', miss: 'พลาด!', ready: 'พร้อม' }),
  ja: Object.freeze({ stage: 'ステージ', score: 'スコア', target: '目標', best: 'ベスト', shuffle: 'シャッフル', drop: 'ドロップ', menu: 'メニュー', clear: 'ステージクリア', fail: 'タイムアップ', replay: 'もう一度', points: 'Claw Points', newBest: 'ハイスコア更新', grip: 'ナイスキャッチ!', lateSlip: 'おしい!', earlySlip: 'すべった!', miss: 'ミス!', ready: 'READY' }),
});

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function language() {
  const value = document.documentElement.lang?.toLowerCase() || 'en';
  if (value.startsWith('th')) return 'th';
  if (value.startsWith('ja')) return 'ja';
  return 'en';
}

function copy() {
  return COPY[language()] || COPY.en;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}

function svgFor(type, uid) {
  const common = `viewBox="0 0 160 180" role="img" aria-hidden="true" focusable="false"`;
  if (type === 'signature') return `<svg ${common}><defs><linearGradient id="fur-${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f1d2a7"/><stop offset="1" stop-color="#c58b58"/></linearGradient></defs><ellipse cx="80" cy="149" rx="47" ry="22" fill="#b67d56" opacity=".18"/><ellipse cx="80" cy="104" rx="48" ry="51" fill="url(#fur-${uid})"/><ellipse cx="80" cy="111" rx="34" ry="38" fill="#fff5e7"/><path d="M45 66c-21 8-23 39-7 51 10-20 17-31 28-42z" fill="#9b6848"/><path d="M115 66c21 8 23 39 7 51-10-20-17-31-28-42z" fill="#9b6848"/><circle cx="80" cy="61" r="43" fill="url(#fur-${uid})"/><path d="M55 40c9-18 37-20 50 0-17 8-33 8-50 0z" fill="#fff5e7"/><ellipse cx="80" cy="76" rx="25" ry="22" fill="#fff8ec"/><circle cx="64" cy="59" r="5" fill="#2d2522"/><circle cx="96" cy="59" r="5" fill="#2d2522"/><ellipse cx="80" cy="73" rx="7" ry="5" fill="#3c2a25"/><path d="M70 82c7 7 13 7 20 0" fill="none" stroke="#744d42" stroke-width="3" stroke-linecap="round"/></svg>`;
  if (type === 'black') return `<svg ${common}><defs><linearGradient id="fur-${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4d4650"/><stop offset="1" stop-color="#17171d"/></linearGradient></defs><ellipse cx="80" cy="149" rx="47" ry="22" fill="#16131a" opacity=".23"/><ellipse cx="80" cy="105" rx="48" ry="52" fill="url(#fur-${uid})"/><path d="M45 66c-22 9-23 40-7 52 10-21 18-32 29-43z" fill="#17161c"/><path d="M115 66c22 9 23 40 7 52-10-21-18-32-29-43z" fill="#17161c"/><circle cx="80" cy="61" r="43" fill="url(#fur-${uid})"/><ellipse cx="80" cy="77" rx="25" ry="22" fill="#3d3942"/><circle cx="64" cy="59" r="5" fill="#f5ead7"/><circle cx="96" cy="59" r="5" fill="#f5ead7"/><ellipse cx="80" cy="73" rx="7" ry="5" fill="#111015"/><path d="M70 83c7 7 13 7 20 0" fill="none" stroke="#b7a6a0" stroke-width="3" stroke-linecap="round"/></svg>`;
  if (type === 'bear') return `<svg ${common}><defs><linearGradient id="fur-${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f26e6f"/><stop offset="1" stop-color="#b93646"/></linearGradient></defs><ellipse cx="80" cy="151" rx="51" ry="21" fill="#842d36" opacity=".17"/><circle cx="48" cy="40" r="21" fill="#b93646"/><circle cx="112" cy="40" r="21" fill="#b93646"/><ellipse cx="80" cy="108" rx="54" ry="56" fill="url(#fur-${uid})"/><circle cx="80" cy="63" r="45" fill="url(#fur-${uid})"/><ellipse cx="80" cy="78" rx="25" ry="20" fill="#f7c3ab"/><circle cx="64" cy="60" r="5" fill="#3d2526"/><circle cx="96" cy="60" r="5" fill="#3d2526"/><ellipse cx="80" cy="75" rx="8" ry="6" fill="#4c2a2d"/><path d="M80 80v8m-11 0c8 6 14 6 22 0" fill="none" stroke="#6d3738" stroke-width="3" stroke-linecap="round"/></svg>`;
  if (type === 'chick') return `<svg ${common}><defs><linearGradient id="fur-${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe87a"/><stop offset="1" stop-color="#e7b735"/></linearGradient></defs><ellipse cx="80" cy="150" rx="42" ry="18" fill="#b68b22" opacity=".16"/><ellipse cx="80" cy="109" rx="47" ry="51" fill="url(#fur-${uid})"/><circle cx="80" cy="66" r="42" fill="url(#fur-${uid})"/><path d="M80 19l-10 14 12-4 9 9 2-18z" fill="#e8bb32"/><circle cx="65" cy="62" r="5" fill="#342d20"/><circle cx="95" cy="62" r="5" fill="#342d20"/><path d="M71 76h18l-9 9z" fill="#ed8b3a"/><path d="M38 101c-16 11-17 30-3 39 7-14 14-23 24-29zM122 101c16 11 17 30 3 39-7-14-14-23-24-29z" fill="#e6b533"/></svg>`;
  return `<svg ${common}><defs><linearGradient id="fur-${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffdf8"/><stop offset="1" stop-color="#e5dcd7"/></linearGradient></defs><ellipse cx="80" cy="151" rx="46" ry="19" fill="#b9a7a0" opacity=".15"/><path d="M55 56C37 21 44 2 58 7c13 6 17 30 15 49z" fill="url(#fur-${uid})"/><path d="M105 56c18-35 11-54-3-49-13 6-17 30-15 49z" fill="url(#fur-${uid})"/><path d="M57 48C47 24 49 14 57 16c8 4 10 20 10 33zM103 48c10-24 8-34 0-32-8 4-10 20-10 33z" fill="#f2c3cb"/><ellipse cx="80" cy="111" rx="48" ry="52" fill="url(#fur-${uid})"/><circle cx="80" cy="67" r="42" fill="url(#fur-${uid})"/><circle cx="65" cy="65" r="5" fill="#393035"/><circle cx="95" cy="65" r="5" fill="#393035"/><ellipse cx="80" cy="78" rx="7" ry="5" fill="#d28c98"/><path d="M71 86c7 6 11 6 18 0" fill="none" stroke="#a56f78" stroke-width="3" stroke-linecap="round"/></svg>`;
}

function gameplayMarkup() {
  const c = copy();
  return `
    <div class="lc-gameplay-stage" data-game-stage>
      <div class="lc-game-chamber">
        <div class="lc-game-hud" aria-label="Game status">
          <div class="lc-hardware-display"><small data-game-stage-label>${c.stage}</small><strong data-game-stage-value>1</strong></div>
          <div class="lc-hardware-display lc-hardware-display--score"><small>${c.score}</small><strong data-game-score>0</strong><span><b>${c.target}</b> <em data-game-target>600</em></span></div>
          <div class="lc-hardware-display"><small>${c.best}</small><strong data-game-best>0</strong></div>
        </div>
        <div class="lc-game-rail" aria-hidden="true"><span></span><span></span></div>
        <div class="lc-gameplay-claw" data-game-claw aria-hidden="true">
          <div class="lc-claw-carriage"><i></i></div>
          <div class="lc-claw-shaft"><span></span></div>
          <div class="lc-claw-collar"></div>
          <div class="lc-claw-hub"><i class="lc-claw-arm lc-claw-arm--left"></i><i class="lc-claw-arm lc-claw-arm--mid"></i><i class="lc-claw-arm lc-claw-arm--right"></i></div>
        </div>
        <div class="lc-shuffle-agitator" data-agitator aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="lc-prize-chute" aria-hidden="true"><span class="lc-prize-chute__rim"></span><span class="lc-prize-chute__well">LUCKY</span></div>
        <div class="lc-plush-field" data-plush-field></div>
        <div class="lc-game-feedback" data-game-feedback aria-live="polite"></div>
      </div>
      <div class="lc-game-controls">
        <button class="lc-game-menu" type="button" data-game-menu>${c.menu}</button>
        <div class="lc-game-joystick" data-game-joystick role="slider" aria-label="Joystick" aria-valuemin="27" aria-valuemax="90" aria-valuenow="57" tabindex="0"><span class="lc-game-joystick__base"></span><span class="lc-game-joystick__stem"></span><span class="lc-game-joystick__knob"></span></div>
        <button class="lc-game-shuffle" type="button" data-game-shuffle><span>${c.shuffle}</span><b data-shuffle-left>15.0s</b></button>
        <div class="lc-game-timer"><small>TIMER</small><strong data-game-timer>3:00</strong></div>
        <button class="lc-game-drop" type="button" data-game-drop><span>↓</span><b>${c.drop}</b></button>
      </div>
      <div class="lc-round-result" data-round-result hidden>
        <div class="lc-round-result__card">
          <span class="lc-round-result__spark">✦</span>
          <h2 data-result-title>${c.clear}</h2>
          <p><span>${c.score}</span><strong data-result-score>0</strong></p>
          <p><span>${c.best}</span><strong data-result-best>0</strong></p>
          <p><span>${c.points}</span><strong data-result-points>0</strong></p>
          <div class="lc-round-result__actions"><button type="button" data-result-replay>${c.replay}</button><button type="button" data-result-menu>${c.menu}</button></div>
        </div>
      </div>
    </div>`;
}

export function ensureGameplayScreen() {
  let screen = document.querySelector('.screen--gameplay');
  if (!screen) {
    screen = document.createElement('section');
    screen.className = 'screen screen--gameplay';
    screen.dataset.screen = 'gameplay';
    screen.setAttribute('aria-label', 'Lucky Claw gameplay');
    screen.setAttribute('aria-hidden', 'true');
    screen.innerHTML = gameplayMarkup();
    document.querySelector('#app')?.append(screen);
  }
  if (!document.querySelector('link[data-lc-gameplay-style]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './src/css/gameplay.css?v=003';
    link.dataset.lcGameplayStyle = 'true';
    document.head.append(link);
  }
  return screen;
}

export function createGameplayController({ getState, persistState, onMenu, music }) {
  const screen = ensureGameplayScreen();
  const stageNode = screen.querySelector('[data-game-stage]');
  const plushField = screen.querySelector('[data-plush-field]');
  const clawNode = screen.querySelector('[data-game-claw]');
  const joystick = screen.querySelector('[data-game-joystick]');
  const shuffleButton = screen.querySelector('[data-game-shuffle]');
  const dropButton = screen.querySelector('[data-game-drop]');
  const agitator = screen.querySelector('[data-agitator]');
  const feedback = screen.querySelector('[data-game-feedback]');
  const result = screen.querySelector('[data-round-result]');
  const sfx = new ArcadeSfx(() => getState()?.settings || {});

  let stage = getStage(1);
  let plushes = [];
  let score = 0;
  let clawX = stage.claw.homeX;
  let stateName = 'idle';
  let roundToken = 0;
  let timerHandle = 0;
  let startedAt = 0;
  let remaining = stage.durationSeconds;
  let shuffleRemaining = stage.shuffleSeconds;
  let shuffleHolding = false;
  let shuffleTicker = 0;
  let shuffleLastAt = 0;
  let joystickDirection = 0;
  let joystickFrame = 0;
  let joystickLastAt = 0;
  let expiring = false;
  let completed = false;

  const nodes = {
    score: screen.querySelector('[data-game-score]'),
    target: screen.querySelector('[data-game-target]'),
    best: screen.querySelector('[data-game-best]'),
    timer: screen.querySelector('[data-game-timer]'),
    shuffleLeft: screen.querySelector('[data-shuffle-left]'),
    resultTitle: screen.querySelector('[data-result-title]'),
    resultScore: screen.querySelector('[data-result-score]'),
    resultBest: screen.querySelector('[data-result-best]'),
    resultPoints: screen.querySelector('[data-result-points]'),
  };

  function setClawX(value, animate = true) {
    clawX = clamp(value, 8, 92);
    stageNode.style.setProperty('--claw-x', `${clawX}%`);
    stageNode.classList.toggle('no-claw-x-transition', !animate);
    joystick.setAttribute('aria-valuenow', String(Math.round(clawX)));
  }

  function setShaft(percent) {
    stageNode.style.setProperty('--shaft-len', `${percent}%`);
  }

  function refreshCopy() {
    const c = copy();
    screen.querySelector('[data-game-stage-label]').textContent = c.stage;
    screen.querySelector('.lc-hardware-display--score small').textContent = c.score;
    screen.querySelector('.lc-hardware-display--score span b').textContent = c.target;
    screen.querySelector('.lc-hardware-display:last-child small').textContent = c.best;
    screen.querySelector('[data-game-menu]').textContent = c.menu;
    shuffleButton.querySelector('span').textContent = c.shuffle;
    dropButton.querySelector('b').textContent = c.drop;
    screen.querySelector('[data-result-replay]').textContent = c.replay;
    screen.querySelector('[data-result-menu]').textContent = c.menu;
  }

  function renderPlushes() {
    plushField.replaceChildren();
    plushes.forEach((plush) => {
      const type = PLUSH_TYPES[plush.type];
      const node = document.createElement('div');
      node.className = `lc-plush lc-plush--${plush.type} lc-plush--${plush.layer}`;
      node.dataset.plushId = plush.instanceId;
      node.style.setProperty('--x', `${plush.x}%`);
      node.style.setProperty('--y', `${plush.y}%`);
      node.style.setProperty('--rot', `${plush.rotation}deg`);
      node.style.setProperty('--scale', String(type.scale));
      node.innerHTML = svgFor(plush.type, plush.instanceId);
      plush.node = node;
      plushField.append(node);
    });
  }

  function refreshHud() {
    nodes.score.textContent = String(score);
    nodes.target.textContent = String(stage.targetScore);
    const saved = Number(getState()?.highScoresByStage?.[stage.id]) || 0;
    nodes.best.textContent = String(Math.max(saved, score));
    nodes.timer.textContent = formatTime(remaining);
    nodes.shuffleLeft.textContent = `${Math.max(0, shuffleRemaining).toFixed(1)}s`;
    stageNode.classList.toggle('is-urgent', remaining <= 30 && remaining > 0);
    shuffleButton.disabled = shuffleRemaining <= 0 || stateName !== 'idle' || expiring;
    dropButton.disabled = stateName !== 'idle' || expiring;
  }

  function setFeedback(text, kind = '') {
    feedback.textContent = text;
    feedback.dataset.kind = kind;
    feedback.classList.remove('is-showing');
    void feedback.offsetWidth;
    feedback.classList.add('is-showing');
  }

  function attachPlush(plush, x = clawX, y = 44) {
    plush.node.classList.add('is-carried');
    plush.node.style.setProperty('--x', `${x}%`);
    plush.node.style.setProperty('--y', `${y}%`);
    plush.node.style.setProperty('--rot', '0deg');
  }

  function moveCarried(plush, x, y, duration = 420) {
    plush.node.style.setProperty('--carry-ms', `${duration}ms`);
    plush.node.style.setProperty('--x', `${x}%`);
    plush.node.style.setProperty('--y', `${y}%`);
  }

  function detachToPile(plush, x, y, rotation = 0) {
    plush.x = clamp(x, stage.pileBounds.minX, stage.pileBounds.maxX);
    plush.y = clamp(y, stage.pileBounds.minY, stage.pileBounds.maxY);
    plush.rotation = rotation;
    plush.node.classList.remove('is-carried');
    plush.node.style.setProperty('--x', `${plush.x}%`);
    plush.node.style.setProperty('--y', `${plush.y}%`);
    plush.node.style.setProperty('--rot', `${plush.rotation}deg`);
  }

  function nearestPlush() {
    const live = plushes.filter((plush) => !plush.captured);
    let nearest = null;
    let distance = Infinity;
    live.forEach((plush) => {
      const d = Math.abs(plush.x - clawX);
      if (d < distance) { nearest = plush; distance = d; }
    });
    return { plush: nearest, distance };
  }

  function chooseOutcome(plush, distance) {
    return chooseGrabOutcome({ plush, distance, grabRadius: stage.claw.grabRadius });
  }

  function persistCapture(plush) {
    persistState(applyCaptureProgress(getState(), plush.type));
  }

  async function resolveDrop(token) {
    if (stateName !== 'idle' || expiring) return;
    stateName = 'dropping';
    refreshHud();
    sfx.button(true);
    stageNode.dataset.clawState = 'dropping';
    setShaft(78);
    sfx.motor(0.72, true);
    await sleep(720);
    if (token !== roundToken) return;

    stageNode.dataset.clawState = 'closing';
    sfx.clawClose();
    await sleep(260);
    if (token !== roundToken) return;

    const { plush, distance } = nearestPlush();
    const outcome = chooseOutcome(plush, distance);
    stageNode.dataset.clawState = 'lifting';
    setShaft(9);
    sfx.motor(0.68, false);

    if (outcome !== 'miss' && plush) {
      attachPlush(plush, clawX, plush.y);
      sfx.catch();
      moveCarried(plush, clawX, 28, 650);
    }

    await sleep(outcome === 'early-slip' ? 380 : 680);
    if (token !== roundToken) return;

    if (outcome === 'miss' || !plush) {
      setFeedback(copy().miss, 'miss');
      await resetClaw(token, 420);
      return;
    }

    if (outcome === 'early-slip') {
      sfx.slip(false);
      setFeedback(copy().earlySlip, 'slip');
      detachToPile(plush, plush.x + (Math.random() * 4 - 2), plush.y, plush.rotation + 5);
      await resetClaw(token, 480);
      return;
    }

    if (outcome === 'late-slip') {
      stageNode.dataset.clawState = 'carrying';
      setClawX(38, true);
      moveCarried(plush, 38, 24, 620);
      await sleep(560);
      if (token !== roundToken) return;
      sfx.slip(true);
      setFeedback(copy().lateSlip, 'slip');
      detachToPile(plush, 34 + Math.random() * 8, 80, Math.random() * 12 - 6);
      await resetClaw(token, 520);
      return;
    }

    stageNode.dataset.clawState = 'carrying';
    setFeedback(copy().grip, 'secure');
    setClawX(stage.chute.dropX, true);
    moveCarried(plush, stage.chute.dropX, 24, 780);
    await sleep(760);
    if (token !== roundToken) return;
    setShaft(72);
    moveCarried(plush, stage.chute.dropX, 74, 420);
    await sleep(420);
    if (token !== roundToken) return;
    stageNode.dataset.clawState = 'releasing';
    plush.node.classList.add('is-chute-drop');
    moveCarried(plush, stage.chute.dropX, 91, 360);
    sfx.chute();
    await sleep(360);
    if (token !== roundToken) return;

    plush.captured = true;
    plush.node.classList.add('is-captured');
    plush.node.classList.remove('is-carried');
    const value = PLUSH_TYPES[plush.type].value;
    score += value;
    persistCapture(plush);
    sfx.score();
    setFeedback(`+${value}`, 'score');
    refreshHud();
    await resetClaw(token, 520);
  }

  async function resetClaw(token, delay = 480) {
    stageNode.dataset.clawState = 'resetting';
    setShaft(7);
    await sleep(delay);
    if (token !== roundToken) return;
    setClawX(stage.claw.homeX, true);
    await sleep(360);
    if (token !== roundToken) return;
    stageNode.dataset.clawState = 'idle';
    stateName = 'idle';
    refreshHud();
    if (expiring) finishRound();
  }

  function applyShuffleStep() {
    const now = performance.now();
    if (!shuffleLastAt) shuffleLastAt = now;
    const dt = Math.min(0.08, (now - shuffleLastAt) / 1000);
    shuffleLastAt = now;
    shuffleRemaining = Math.max(0, shuffleRemaining - dt);
    stageNode.classList.add('is-shuffling');
    agitator.classList.add('is-active');

    if (!shuffleTicker || now - shuffleTicker > 260) {
      shuffleTicker = now;
      plushes.filter((plush) => !plush.captured && !plush.node.classList.contains('is-carried')).forEach((plush, index) => {
        const next = shufflePlush(plush, { now, index, bounds: stage.pileBounds });
        plush.x = next.x; plush.y = next.y; plush.rotation = next.rotation;
        plush.node.style.setProperty('--x', `${plush.x}%`);
        plush.node.style.setProperty('--y', `${plush.y}%`);
        plush.node.style.setProperty('--rot', `${plush.rotation}deg`);
      });
      sfx.shufflePulse();
    }
    refreshHud();
    if (shuffleHolding && shuffleRemaining > 0 && stateName === 'idle' && !expiring) {
      requestAnimationFrame(applyShuffleStep);
    } else {
      stopShuffle();
    }
  }

  function startShuffle(event) {
    if (shuffleRemaining <= 0 || stateName !== 'idle' || expiring) return;
    event?.preventDefault?.();
    sfx.button(false);
    shuffleHolding = true;
    shuffleLastAt = 0;
    applyShuffleStep();
  }

  function stopShuffle() {
    shuffleHolding = false;
    shuffleLastAt = 0;
    stageNode.classList.remove('is-shuffling');
    agitator.classList.remove('is-active');
    refreshHud();
  }

  function tickTimer(token) {
    if (token !== roundToken || completed) return;
    const elapsed = (performance.now() - startedAt) / 1000;
    const previous = Math.ceil(remaining);
    remaining = Math.max(0, stage.durationSeconds - elapsed);
    const current = Math.ceil(remaining);
    if (current !== previous && current <= 5 && current > 0) sfx.countdown();
    music?.setUrgency?.(remaining);
    refreshHud();
    if (remaining <= 0) {
      window.clearInterval(timerHandle);
      timerHandle = 0;
      expiring = true;
      stopShuffle();
      refreshHud();
      if (stateName === 'idle') finishRound();
    }
  }

  function finishRound() {
    if (completed) return;
    completed = true;
    stateName = 'finished';
    stopShuffle();
    window.clearInterval(timerHandle);
    timerHandle = 0;
    const current = getState();
    const roundResult = applyRoundResult(current, { stageId: stage.id, score, targetScore: stage.targetScore });
    const { oldBest, newBest, clear } = roundResult;
    persistState(roundResult.state);
    music?.unlockTrackAfterRound?.({ applyQueued: true });
    music?.resetUrgency?.();
    nodes.resultTitle.textContent = `${clear ? copy().clear : copy().fail}${newBest > oldBest ? ` · ${copy().newBest}` : ''}`;
    nodes.resultScore.textContent = String(score);
    nodes.resultBest.textContent = String(newBest);
    nodes.resultPoints.textContent = String(Number(getState()?.points) || 0);
    result.hidden = false;
    if (clear) sfx.clear(); else sfx.fail();
  }

  function resetRound(stageId = 1, durationOverride = null) {
    roundToken += 1;
    stage = { ...getStage(stageId) };
    if (Number.isFinite(durationOverride) && durationOverride > 0) stage.durationSeconds = durationOverride;
    plushes = stage.plushes.map((plush) => ({ ...plush, captured: false, node: null }));
    score = 0;
    remaining = stage.durationSeconds;
    shuffleRemaining = stage.shuffleSeconds;
    clawX = stage.claw.homeX;
    stateName = 'idle';
    expiring = false;
    completed = false;
    result.hidden = true;
    feedback.textContent = '';
    stageNode.dataset.clawState = 'idle';
    setClawX(clawX, false);
    setShaft(7);
    renderPlushes();
    refreshCopy();
    refreshHud();
  }

  function startStage(stageId = 1, options = {}) {
    stop(false);
    resetRound(stageId, options.durationSeconds || null);
    music?.lockTrackForRound?.();
    startedAt = performance.now();
    const token = roundToken;
    timerHandle = window.setInterval(() => tickTimer(token), 200);
    tickTimer(token);
  }

  function stop(unlockMusic = true) {
    roundToken += 1;
    window.clearInterval(timerHandle);
    timerHandle = 0;
    stopShuffle();
    joystickDirection = 0;
    cancelAnimationFrame(joystickFrame);
    joystickFrame = 0;
    if (unlockMusic) {
      music?.unlockTrackAfterRound?.({ applyQueued: true });
      music?.resetUrgency?.();
    }
  }

  function moveLoop(now) {
    if (!joystickLastAt) joystickLastAt = now;
    const dt = Math.min(0.04, (now - joystickLastAt) / 1000);
    joystickLastAt = now;
    if (stateName === 'idle' && !expiring && joystickDirection) {
      setClawX(clamp(clawX + joystickDirection * 31 * dt, stage.claw.minX, stage.claw.maxX), false);
    }
    if (joystickDirection) joystickFrame = requestAnimationFrame(moveLoop);
    else { joystickFrame = 0; joystickLastAt = 0; }
  }

  function setJoystick(direction) {
    joystickDirection = clamp(direction, -1, 1);
    joystick.style.setProperty('--joy', String(joystickDirection));
    if (joystickDirection && !joystickFrame) joystickFrame = requestAnimationFrame(moveLoop);
    if (!joystickDirection) { cancelAnimationFrame(joystickFrame); joystickFrame = 0; joystickLastAt = 0; }
  }

  function joystickFromPointer(event) {
    const rect = joystick.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const normalized = clamp((event.clientX - center) / (rect.width * 0.38), -1, 1);
    setJoystick(Math.abs(normalized) < 0.16 ? 0 : normalized);
  }

  joystick.addEventListener('pointerdown', (event) => {
    if (stateName !== 'idle' || expiring) return;
    sfx.ensureContext();
    joystick.setPointerCapture?.(event.pointerId);
    joystickFromPointer(event);
  });
  joystick.addEventListener('pointermove', (event) => { if (joystick.hasPointerCapture?.(event.pointerId)) joystickFromPointer(event); });
  joystick.addEventListener('pointerup', () => setJoystick(0));
  joystick.addEventListener('pointercancel', () => setJoystick(0));
  joystick.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); setJoystick(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); setJoystick(1); }
  });
  joystick.addEventListener('keyup', (event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') setJoystick(0); });

  shuffleButton.addEventListener('pointerdown', startShuffle);
  shuffleButton.addEventListener('pointerup', stopShuffle);
  shuffleButton.addEventListener('pointercancel', stopShuffle);
  shuffleButton.addEventListener('pointerleave', (event) => { if (event.buttons) stopShuffle(); });
  dropButton.addEventListener('click', () => void resolveDrop(roundToken));
  screen.querySelector('[data-game-menu]').addEventListener('click', () => { sfx.button(false); stop(true); onMenu?.(); });
  screen.querySelector('[data-result-menu]').addEventListener('click', () => { sfx.button(false); stop(true); onMenu?.(); });
  screen.querySelector('[data-result-replay]').addEventListener('click', () => { sfx.button(true); startStage(stage.id); });

  resetRound(1);
  return Object.freeze({ startStage, stop, refreshLanguage: refreshCopy });
}
