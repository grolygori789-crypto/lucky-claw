import { SOUNDTRACK, getTrackIndex } from '../data/soundtrack.js';

const REPEAT_MODES = new Set(['off', 'all', 'one']);
const DEFAULT_VOLUME = 0.55;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export class MusicManager extends EventTarget {
  constructor(settings = {}) {
    super();

    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.loop = false;
    this.audio.playsInline = true;

    if ('preservesPitch' in this.audio) this.audio.preservesPitch = true;
    if ('webkitPreservesPitch' in this.audio) this.audio.webkitPreservesPitch = true;

    this.preferredTrackId = SOUNDTRACK[getTrackIndex(settings.musicTrack)].id;
    this.index = getTrackIndex(this.preferredTrackId);
    this.volume = Number.isFinite(settings.musicVolume)
      ? clamp(settings.musicVolume, 0, 1)
      : DEFAULT_VOLUME;
    this.musicEnabled = settings.music !== false;
    this.shuffle = Boolean(settings.musicShuffle);
    this.repeat = REPEAT_MODES.has(settings.musicRepeat) ? settings.musicRepeat : 'all';

    this.roundLocked = false;
    this.queuedTrackId = null;
    this.rateAnimation = 0;
    this.urgencyRate = 1;
    this.blockedByAutoplay = false;

    this.audio.volume = this.volume;
    this.audio.muted = !this.musicEnabled;
    this.audio.addEventListener('play', () => this.emitState());
    this.audio.addEventListener('pause', () => this.emitState());
    this.audio.addEventListener('volumechange', () => this.emitState());
    this.audio.addEventListener('ended', () => this.handleEnded());
    this.audio.addEventListener('error', () => {
      this.dispatchEvent(new CustomEvent('error', { detail: { track: this.currentTrack } }));
      this.emitState();
    });

    this.loadCurrentTrack();
  }

  get currentTrack() {
    return SOUNDTRACK[this.index];
  }

  get isPlaying() {
    return !this.audio.paused && !this.audio.ended;
  }

  get snapshot() {
    return {
      track: this.currentTrack,
      index: this.index,
      count: SOUNDTRACK.length,
      isPlaying: this.isPlaying,
      musicEnabled: this.musicEnabled,
      volume: this.volume,
      shuffle: this.shuffle,
      repeat: this.repeat,
      roundLocked: this.roundLocked,
      queuedTrackId: this.queuedTrackId,
      playbackRate: this.audio.playbackRate,
      blockedByAutoplay: this.blockedByAutoplay,
    };
  }

  get preferences() {
    return {
      music: this.musicEnabled,
      musicVolume: this.volume,
      musicShuffle: this.shuffle,
      musicRepeat: this.repeat,
      musicTrack: this.preferredTrackId,
    };
  }

  loadCurrentTrack() {
    const track = this.currentTrack;
    this.audio.src = track.src;
    this.audio.load();
    this.audio.playbackRate = this.urgencyRate;
    this.emitState();
  }

  prepareTitle() {
    if (this.currentTrack.id === 'main-title-theme') return;
    this.selectTrack('main-title-theme', {
      force: true,
      autoplay: this.isPlaying,
      remember: false,
    });
  }

  restorePreferredTrack({ autoplay = this.isPlaying } = {}) {
    return this.selectTrack(this.preferredTrackId, { force: true, autoplay, remember: false });
  }

  async play() {
    try {
      this.blockedByAutoplay = false;
      await this.audio.play();
      this.emitState();
      return true;
    } catch (error) {
      if (error?.name === 'NotAllowedError') {
        this.blockedByAutoplay = true;
        this.emitState();
        return false;
      }
      console.warn('[Lucky Claw] Music playback failed.', error);
      this.emitState();
      return false;
    }
  }

  pause() {
    this.audio.pause();
  }

  togglePlayback() {
    return this.isPlaying ? (this.pause(), Promise.resolve(false)) : this.play();
  }

  toggleMute() {
    this.musicEnabled = !this.musicEnabled;
    this.audio.muted = !this.musicEnabled;
    this.emitPreferences();
  }

  setVolume(value) {
    const safe = clamp(Number(value) || 0, 0, 1);
    this.volume = safe;
    this.audio.volume = safe;
    this.emitPreferences();
  }

  setShuffle(enabled) {
    this.shuffle = Boolean(enabled);
    this.emitPreferences();
  }

  cycleRepeat() {
    this.repeat = this.repeat === 'off' ? 'all' : this.repeat === 'all' ? 'one' : 'off';
    this.emitPreferences();
    return this.repeat;
  }

  async selectTrack(trackId, { force = false, autoplay = this.isPlaying, remember = true } = {}) {
    const nextIndex = getTrackIndex(trackId);

    if (this.roundLocked && !force && nextIndex !== this.index) {
      this.queuedTrackId = SOUNDTRACK[nextIndex].id;
      this.emitState();
      return false;
    }

    if (nextIndex === this.index) {
      if (remember && this.preferredTrackId !== SOUNDTRACK[nextIndex].id) {
        this.preferredTrackId = SOUNDTRACK[nextIndex].id;
        this.emitPreferences();
      }
      if (autoplay && !this.isPlaying) await this.play();
      return true;
    }

    const shouldPlay = Boolean(autoplay);
    this.audio.pause();
    this.index = nextIndex;
    this.queuedTrackId = null;
    if (remember) this.preferredTrackId = SOUNDTRACK[nextIndex].id;
    this.resetUrgency();
    this.loadCurrentTrack();
    this.emitPreferences();
    if (shouldPlay) await this.play();
    return true;
  }

  next() {
    let nextIndex;
    if (this.shuffle && SOUNDTRACK.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * SOUNDTRACK.length);
      } while (nextIndex === this.index);
    } else {
      nextIndex = (this.index + 1) % SOUNDTRACK.length;
    }
    return this.selectTrack(SOUNDTRACK[nextIndex].id);
  }

  previous() {
    const nextIndex = (this.index - 1 + SOUNDTRACK.length) % SOUNDTRACK.length;
    return this.selectTrack(SOUNDTRACK[nextIndex].id);
  }

  lockTrackForRound() {
    this.roundLocked = true;
    this.queuedTrackId = null;
    this.emitState();
  }

  async unlockTrackAfterRound({ applyQueued = true } = {}) {
    this.roundLocked = false;
    this.resetUrgency();
    const queued = this.queuedTrackId;
    this.queuedTrackId = null;
    this.emitState();

    if (applyQueued && queued) {
      await this.selectTrack(queued, { force: true, autoplay: this.isPlaying });
    }
  }

  setUrgency(secondsRemaining) {
    const seconds = Math.max(0, Number(secondsRemaining) || 0);
    let target = 1;

    if (seconds <= 0) target = 1;
    else if (seconds <= 5) target = 1.16;
    else if (seconds <= 10) target = 1.12;
    else if (seconds <= 20) target = 1.08;
    else if (seconds <= 30) target = 1.04;

    this.urgencyRate = target;
    this.rampPlaybackRate(target, 500);
  }

  resetUrgency() {
    this.urgencyRate = 1;
    this.rampPlaybackRate(1, 320);
  }

  rampPlaybackRate(target, duration) {
    if (this.rateAnimation) cancelAnimationFrame(this.rateAnimation);

    const from = this.audio.playbackRate || 1;
    const safeTarget = clamp(target, 0.75, 1.25);

    if (Math.abs(from - safeTarget) < 0.001) {
      this.audio.playbackRate = safeTarget;
      this.emitState();
      return;
    }

    const started = performance.now();
    const step = (now) => {
      const progress = clamp((now - started) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.audio.playbackRate = from + (safeTarget - from) * eased;

      if (progress < 1) {
        this.rateAnimation = requestAnimationFrame(step);
      } else {
        this.rateAnimation = 0;
        this.audio.playbackRate = safeTarget;
        this.emitState();
      }
    };

    this.rateAnimation = requestAnimationFrame(step);
  }

  async handleEnded() {
    if (this.roundLocked || this.repeat === 'one') {
      this.audio.currentTime = 0;
      await this.play();
      return;
    }

    if (this.repeat === 'off' && this.index === SOUNDTRACK.length - 1 && !this.shuffle) {
      this.emitState();
      return;
    }

    await this.next();
  }

  emitPreferences() {
    this.dispatchEvent(new CustomEvent('preferencechange', { detail: this.preferences }));
    this.emitState();
  }

  emitState() {
    this.dispatchEvent(new CustomEvent('statechange', { detail: this.snapshot }));
  }
}
