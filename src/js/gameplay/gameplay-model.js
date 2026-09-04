import { PLUSH_TYPES } from './stage-data.js?v=003';

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function chooseGrabOutcome({ plush, distance, grabRadius, random = Math.random }) {
  if (!plush || distance > grabRadius) return 'miss';
  const type = PLUSH_TYPES[plush.type];
  const quality = clamp(1 - distance / grabRadius, 0, 1);
  const secureChance = clamp(0.12 + quality * 0.88 - type.difficulty - (type.weight - 1) * 0.12, 0.06, 0.94);
  const roll = clamp(Number(random()) || 0, 0, 0.999999);
  if (roll < secureChance) return 'secure';
  if (quality > 0.55 && roll < secureChance + 0.34) return 'late-slip';
  if (quality > 0.22) return 'early-slip';
  return 'miss';
}

export function shufflePlush(plush, { now, index, bounds }) {
  const phase = now / 310 + index * 1.73;
  const layerFactor = plush.layer === 'front' ? 1 : plush.layer === 'mid' ? 0.8 : 0.62;
  return {
    ...plush,
    x: clamp(plush.x + Math.sin(phase) * 2.8 * layerFactor, bounds.minX, bounds.maxX),
    y: clamp(plush.y + Math.cos(phase * 0.73) * 1.35 * layerFactor, bounds.minY, bounds.maxY),
    rotation: clamp(plush.rotation + Math.sin(phase * 1.2) * 3.1, -13, 13),
  };
}

export function applyCaptureProgress(current, plushType, now = Date.now()) {
  const type = PLUSH_TYPES[plushType];
  if (!type) return current;
  const collection = { ...(current.collection || {}) };
  const record = collection[plushType];
  const previousCount = typeof record === 'object' ? Number(record.count) || 0 : Number(record) || 0;
  collection[plushType] = { count: previousCount + 1, firstCaughtAt: record?.firstCaughtAt || now };
  return {
    ...current,
    points: (Number(current.points) || 0) + type.clawPoints,
    collection,
  };
}

export function applyRoundResult(current, { stageId, score, targetScore }) {
  const oldBest = Number(current.highScoresByStage?.[stageId]) || 0;
  const newBest = Math.max(oldBest, score);
  const clear = score >= targetScore;
  const stageProgress = { ...(current.stageProgress || { highestUnlocked: 1, highestCompleted: 0 }) };
  if (clear) {
    stageProgress.highestCompleted = Math.max(Number(stageProgress.highestCompleted) || 0, stageId);
    stageProgress.highestUnlocked = Math.max(Number(stageProgress.highestUnlocked) || 1, stageId + 1);
  }
  return {
    state: {
      ...current,
      highScoresByStage: { ...(current.highScoresByStage || {}), [stageId]: newBest },
      stageProgress,
    },
    clear,
    oldBest,
    newBest,
  };
}
