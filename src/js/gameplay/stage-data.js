export const BUILD_TAG = '003.06';

export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id:'signature', value:120, clawPoints:12, scale:1.00, weight:1.00, difficulty:0.08, balance:0.84, asset:'shih-tzu-brown' }),
  black: Object.freeze({ id:'black', value:140, clawPoints:14, scale:1.00, weight:1.06, difficulty:0.10, balance:0.80, asset:'shih-tzu-black' }),
  bear: Object.freeze({ id:'bear', value:100, clawPoints:10, scale:1.08, weight:1.18, difficulty:0.13, balance:0.72, asset:'red-bear' }),
  chick: Object.freeze({ id:'chick', value:80, clawPoints:8, scale:0.91, weight:0.76, difficulty:0.05, balance:0.90, asset:'yellow-chick' }),
  bunny: Object.freeze({ id:'bunny', value:110, clawPoints:11, scale:1.01, weight:0.94, difficulty:0.09, balance:0.78, asset:'white-bunny' }),
});

// Physical pile coordinates. z=0 rear glass, z=1 front glass.
// elevation is intentionally tiny: it represents plush-on-plush lift, not a percentage-height shelf.
const pile = [
  ['bear',      .30,.16,-10,'tilt', .018],
  ['black',     .42,.17,  7,'rest', .026],
  ['bunny',     .54,.18, -7,'tilt', .030],
  ['signature', .66,.20,  8,'rest', .024],
  ['black',     .78,.21, -6,'tilt', .018],
  ['bear',      .87,.23,  5,'front',.012],

  ['chick',     .30,.30,-9,'tilt', .022],
  ['signature', .40,.31,  6,'front',.030],
  ['bear',      .52,.32, -7,'front',.034],
  ['black',     .64,.34,  7,'tilt', .028],
  ['bunny',     .76,.35, -5,'rest', .022],
  ['signature', .86,.37,  5,'tilt', .014],

  ['signature', .34,.45,  6,'tilt', .022],
  ['black',     .46,.46, -5,'front',.030],
  ['bunny',     .58,.48,  5,'front',.034],
  ['bear',      .70,.49, -6,'front',.028],
  ['signature', .82,.51,  5,'tilt', .018],

  ['chick',     .40,.60,  5,'front',.016],
  ['bunny',     .52,.62, -5,'rest', .022],
  ['black',     .64,.64,  6,'front',.026],
  ['signature', .76,.66, -4,'tilt', .020],
  ['bear',      .86,.68,  5,'front',.012],

  ['signature', .46,.77,  4,'front',.006],
  ['chick',     .58,.79, -4,'front',.010],
  ['bunny',     .70,.82,  4,'rest', .008],
  ['black',     .81,.84, -3,'front',.006],
  ['signature', .87,.87,  3,'front',.002],
];

export const STAGE_ONE = Object.freeze({
  id:1,
  durationSeconds:180,
  targetScore:600,
  shuffleSeconds:15,
  claw:Object.freeze({ minX:.10, maxX:.90, minZ:.07, maxZ:.91, homeX:.55, homeZ:.28, speedX:.27, speedZ:.25, grabRadius:.134 }),
  chute:Object.freeze({ x:.105, z:.80, radius:.12 }),
  pileBounds:Object.freeze({ minX:.28, maxX:.89, minZ:.14, maxZ:.91 }),
  plushes:Object.freeze(pile.map(([type,x,z,rotation,pose,elevation],i)=>Object.freeze({instanceId:`s1-${i+1}`,type,x,z,rotation,pose,elevation}))),
});

export function getStage(stageId=1){ return STAGE_ONE; }
