function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export class ArcadeSfx {
  constructor(getSettings = () => ({})) {
    this.getSettings = getSettings;
    this.context = null;
  }

  enabled() {
    return this.getSettings()?.sfx !== false;
  }

  ensureContext() {
    if (!this.enabled()) return null;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    if (!this.context) this.context = new AudioContextCtor({ latencyHint: 'interactive' });
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  haptic(pattern = 12) {
    if (this.getSettings()?.haptics === false) return;
    try { navigator.vibrate?.(pattern); } catch {}
  }

  tone({ frequency = 440, endFrequency = frequency, duration = 0.08, volume = 0.04, type = 'sine', delay = 0 }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const start = ctx.currentTime + delay;
    const end = start + duration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(35, frequency), start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(35, endFrequency), end);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(clamp(volume, 0.001, 0.2), start + Math.min(0.018, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(end + 0.02);
  }

  noise({ duration = 0.09, volume = 0.025, delay = 0, highpass = 500 }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const frames = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    filter.type = 'highpass';
    filter.frequency.value = highpass;
    gain.gain.value = volume;
    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(ctx.currentTime + delay);
  }

  button(primary = false) {
    this.tone({ frequency: primary ? 330 : 260, endFrequency: primary ? 510 : 360, duration: 0.07, volume: 0.035, type: 'triangle' });
    this.noise({ duration: 0.035, volume: 0.012, highpass: 1900 });
    this.haptic(primary ? 18 : 9);
  }

  motor(duration = 0.7, descending = true) {
    this.tone({ frequency: descending ? 118 : 146, endFrequency: descending ? 92 : 184, duration, volume: 0.022, type: 'sawtooth' });
    this.tone({ frequency: descending ? 238 : 280, endFrequency: descending ? 190 : 340, duration, volume: 0.010, type: 'triangle' });
  }

  clawClose() {
    this.tone({ frequency: 740, endFrequency: 430, duration: 0.075, volume: 0.045, type: 'square' });
    this.noise({ duration: 0.055, volume: 0.022, highpass: 1300 });
    this.haptic([10, 20, 12]);
  }

  catch() {
    this.tone({ frequency: 390, endFrequency: 570, duration: 0.11, volume: 0.035, type: 'triangle' });
  }

  slip(late = false) {
    this.tone({ frequency: late ? 330 : 280, endFrequency: 115, duration: late ? 0.24 : 0.17, volume: 0.038, type: 'triangle' });
    this.noise({ duration: 0.11, volume: 0.012, highpass: 800 });
  }

  chute() {
    this.tone({ frequency: 180, endFrequency: 90, duration: 0.16, volume: 0.042, type: 'sine' });
    this.noise({ duration: 0.14, volume: 0.026, highpass: 420 });
    this.haptic(24);
  }

  score() {
    this.tone({ frequency: 520, endFrequency: 760, duration: 0.10, volume: 0.035, type: 'triangle' });
    this.tone({ frequency: 760, endFrequency: 960, duration: 0.12, volume: 0.032, type: 'triangle', delay: 0.08 });
  }

  countdown() {
    this.tone({ frequency: 660, endFrequency: 660, duration: 0.055, volume: 0.025, type: 'square' });
  }

  shufflePulse() {
    this.tone({ frequency: 92, endFrequency: 108, duration: 0.11, volume: 0.018, type: 'sawtooth' });
    this.noise({ duration: 0.08, volume: 0.009, highpass: 650 });
  }

  clear() {
    [523, 659, 784, 1047].forEach((frequency, index) => {
      this.tone({ frequency, endFrequency: frequency * 1.01, duration: 0.18, volume: 0.038, type: 'triangle', delay: index * 0.095 });
    });
    this.haptic([24, 35, 24]);
  }

  fail() {
    this.tone({ frequency: 330, endFrequency: 220, duration: 0.23, volume: 0.030, type: 'triangle' });
    this.tone({ frequency: 246, endFrequency: 165, duration: 0.28, volume: 0.026, type: 'triangle', delay: 0.14 });
  }
}
