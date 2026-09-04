export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id: 'signature', value: 120, clawPoints: 12, scale: 1.00, weight: 1.00, difficulty: 0.08 }),
  black: Object.freeze({ id: 'black', value: 140, clawPoints: 14, scale: 1.00, weight: 1.06, difficulty: 0.10 }),
  bear: Object.freeze({ id: 'bear', value: 100, clawPoints: 10, scale: 1.10, weight: 1.18, difficulty: 0.13 }),
  chick: Object.freeze({ id: 'chick', value: 80, clawPoints: 8, scale: 0.88, weight: 0.76, difficulty: 0.05 }),
  bunny: Object.freeze({ id: 'bunny', value: 110, clawPoints: 11, scale: 1.02, weight: 0.94, difficulty: 0.09 }),
});

const pile = [
  ['signature', 35, 58, -7, 'back'],
  ['chick',     51, 56,  8, 'back'],
  ['black',     68, 58, -4, 'back'],
  ['bunny',     84, 58,  6, 'back'],
  ['bear',      30, 70,  5, 'mid'],
  ['signature', 45, 68, -8, 'mid'],
  ['bunny',     61, 70,  7, 'mid'],
  ['chick',     77, 69, -5, 'mid'],
  ['black',     89, 71,  4, 'mid'],
  ['chick',     35, 82, -6, 'front'],
  ['bear',      54, 81,  5, 'front'],
  ['signature', 74, 82, -4, 'front'],
];

export const STAGE_ONE = Object.freeze({
  id: 1,
  durationSeconds: 180,
  targetScore: 600,
  shuffleSeconds: 15,
  claw: Object.freeze({ minX: 27, maxX: 90, homeX: 57, grabRadius: 10.5 }),
  chute: Object.freeze({ left: 4, right: 23, top: 70, bottom: 96, dropX: 14 }),
  pileBounds: Object.freeze({ minX: 28, maxX: 90, minY: 55, maxY: 84 }),
  plushes: Object.freeze(pile.map(([type, x, y, rotation, layer], index) => Object.freeze({
    instanceId: `s1-${index + 1}`,
    type,
    x,
    y,
    rotation,
    layer,
  }))),
});

export function getStage(stageId = 1) {
  if (Number(stageId) !== 1) return STAGE_ONE;
  return STAGE_ONE;
}
