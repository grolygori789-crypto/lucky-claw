export const BUILD_TAG = '003.02';

export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id:'signature', value:120, clawPoints:12, scale:1.00, weight:1.00, difficulty:0.08, balance:0.84, asset:'shih-tzu-brown' }),
  black: Object.freeze({ id:'black', value:140, clawPoints:14, scale:1.00, weight:1.06, difficulty:0.10, balance:0.80, asset:'shih-tzu-black' }),
  bear: Object.freeze({ id:'bear', value:100, clawPoints:10, scale:1.08, weight:1.18, difficulty:0.13, balance:0.72, asset:'red-bear' }),
  chick: Object.freeze({ id:'chick', value:80, clawPoints:8, scale:0.91, weight:0.76, difficulty:0.05, balance:0.90, asset:'yellow-chick' }),
  bunny: Object.freeze({ id:'bunny', value:110, clawPoints:11, scale:1.01, weight:0.94, difficulty:0.09, balance:0.78, asset:'white-bunny' }),
});

// Dense real-machine pile: four depth layers compressed into 12 visible prizes.
// z: 0 = rear glass, 1 = front glass.  Left chute exclusion remains x < .22.
const pile = [
  // organic mound: continuous depth, irregular overlap, no icon-like rows
  ['bear',      .47,.19,-8,'tilt', .086],
  ['bunny',     .69,.24, 7,'rest', .082],
  ['signature', .82,.31,-10,'tilt',.064],
  ['black',     .56,.36, 9,'front',.060],
  ['chick',     .33,.43,-8,'tilt', .042],
  ['bear',      .73,.49,10,'front',.038],
  ['bunny',     .47,.55,-9,'front',.046],
  ['black',     .84,.60,-6,'tilt', .028],
  ['signature', .30,.69, 8,'front',.008],
  ['black',     .53,.76,-7,'front',.016],
  ['signature', .70,.80, 5,'tilt', .004],
  ['chick',     .85,.86,-5,'front',.000],
];

export const STAGE_ONE = Object.freeze({
  id:1,
  durationSeconds:180,
  targetScore:600,
  shuffleSeconds:15,
  claw:Object.freeze({ minX:.10, maxX:.90, minZ:.07, maxZ:.91, homeX:.55, homeZ:.28, speedX:.27, speedZ:.25, grabRadius:.118 }),
  chute:Object.freeze({ x:.105, z:.80, radius:.12 }),
  pileBounds:Object.freeze({ minX:.245, maxX:.90, minZ:.12, maxZ:.91 }),
  plushes:Object.freeze(pile.map(([type,x,z,rotation,pose,elevation],i)=>Object.freeze({instanceId:`s1-${i+1}`,type,x,z,rotation,pose,elevation}))),
});

export function getStage(stageId=1){ return STAGE_ONE; }
