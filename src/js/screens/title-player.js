import { translate } from '../core/i18n.js';

export function bindTitlePlayer(music) {
  const root = document.querySelector('[data-title-player]');
  if (!root) return { refresh() {} };

  const playButton = root.querySelector('[data-music-toggle]');
  const muteButton = root.querySelector('[data-music-mute]');
  const trackName = root.querySelector('[data-music-track]');
  const trackPosition = root.querySelector('[data-music-position]');
  const playIcon = root.querySelector('[data-music-play-icon]');
  const muteIcon = root.querySelector('[data-music-mute-icon]');

  const render = (snapshot = music.snapshot) => {
    trackName.textContent = snapshot.track.title;
    trackPosition.textContent = `${snapshot.index + 1} / ${snapshot.count}`;

    playButton.classList.toggle('is-playing', snapshot.isPlaying);
    playButton.setAttribute('aria-label', translate(snapshot.isPlaying ? 'music.pause' : 'music.play'));
    playIcon.textContent = snapshot.isPlaying ? 'Ⅱ' : '▶';

    muteButton.classList.toggle('is-muted', !snapshot.musicEnabled);
    muteButton.setAttribute('aria-label', translate(snapshot.musicEnabled ? 'music.mute' : 'music.unmute'));
    muteIcon.textContent = snapshot.musicEnabled ? '♪' : '×';

    root.classList.toggle('is-autoplay-blocked', snapshot.blockedByAutoplay);
  };

  playButton.addEventListener('click', () => music.togglePlayback());
  muteButton.addEventListener('click', () => music.toggleMute());
  music.addEventListener('statechange', (event) => render(event.detail));

  render();
  return { refresh: () => render() };
}
