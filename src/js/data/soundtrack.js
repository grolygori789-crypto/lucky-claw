export const SOUNDTRACK = Object.freeze([
  Object.freeze({
    id: 'main-title-theme',
    title: 'Main Title Theme',
    src: './assets/audio/main-title-theme.mp3',
  }),
  Object.freeze({
    id: 'cozy-claw',
    title: 'Cozy Claw',
    src: './assets/audio/cozy-claw.mp3',
  }),
  Object.freeze({
    id: 'toy-boutique',
    title: 'Toy Boutique',
    src: './assets/audio/toy-boutique.mp3',
  }),
  Object.freeze({
    id: 'lucky-rush',
    title: 'Lucky Rush',
    src: './assets/audio/lucky-rush.mp3',
  }),
  Object.freeze({
    id: 'dreamy-arcade',
    title: 'Dreamy Arcade',
    src: './assets/audio/dreamy-arcade.mp3',
  }),
]);

export function getTrackIndex(trackId) {
  const index = SOUNDTRACK.findIndex((track) => track.id === trackId);
  return index >= 0 ? index : 0;
}
