export const BUILD_TAG = '003.07';

export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id:'signature', value:120, clawPoints:12, scale:1.00, weight:1.00, difficulty:0.08, balance:0.84, asset:'shih-tzu-brown' }),
  black: Object.freeze({ id:'black', value:140, clawPoints:14, scale:1.00, weight:1.06, difficulty:0.10, balance:0.80, asset:'shih-tzu-black' }),
  bear: Object.freeze({ id:'bear', value:100, clawPoints:10, scale:1.08, weight:1.18, difficulty:0.13, balance:0.72, asset:'red-bear' }),
  chick: Object.freeze({ id:'chick', value:80, clawPoints:8, scale:0.91, weight:0.76, difficulty:0.05, balance:0.90, asset:'yellow-chick' }),
  bunny: Object.freeze({ id:'bunny', value:110, clawPoints:11, scale:1.01, weight:0.94, difficulty:0.09, balance:0.78, asset:'white-bunny' }),
});

// Art-directed Stage 1 pile. z=0 rear, z=1 front.
// Rear/mid prizes may visually sit behind the left chute acrylic; front prizes may not occupy it.
// Elevation is intentionally tiny and only represents plausible plush-on-plush compression/support.
const pile = [
  // rear crown — mostly heads/upper bodies visible
  ['signature', .27,.18,-10,'rest', .046],
  ['black',     .39,.19,  8,'tilt', .052],
  ['bear',      .51,.20, -7,'tilt', .050],
  ['bunny',     .63,.19,  6,'rest', .047],
  ['black',     .75,.21, -6,'rest', .043],
  ['chick',     .86,.23,  5,'tilt', .038],

  // upper middle — tightly overlapped, asymmetric
  ['bear',      .25,.33, -8,'front',.030],
  ['bunny',     .37,.32,  7,'tilt', .035],
  ['signature', .49,.34, -5,'front',.036],
  ['black',     .61,.33,  7,'front',.034],
  ['bear',      .73,.35, -6,'tilt', .030],
  ['bunny',     .84,.36,  5,'front',.026],

  // hero middle — main readable faces
  ['signature', .30,.49,  6,'front',.017],
  ['chick',     .42,.48, -5,'front',.020],
  ['black',     .54,.50,  5,'front',.022],
  ['bunny',     .66,.49, -6,'front',.021],
  ['bear',      .78,.51,  5,'front',.017],
  ['signature', .87,.53, -4,'tilt', .014],

  // lower middle — settles onto the hidden agitator
  ['bear',      .36,.65, -5,'rest', .007],
  ['signature', .48,.64,  5,'front',.010],
  ['black',     .60,.66, -4,'front',.011],
  ['chick',     .72,.65,  4,'front',.009],
  ['bunny',     .84,.68, -4,'rest', .006],

  // front hero row — large, weight-bearing, no chute overlap
  ['signature', .47,.82, -4,'front',.000],
  ['bear',      .60,.84,  4,'front',.002],
  ['black',     .73,.83, -3,'front',.002],
  ['chick',     .85,.86,  3,'front',.000],
];

export const STAGE_ONE = Object.freeze({
  id:1,
  durationSeconds:180,
  targetScore:600,
  shuffleSeconds:15,
  claw:Object.freeze({ minX:.10, maxX:.90, minZ:.07, maxZ:.91, homeX:.55, homeZ:.28, speedX:.27, speedZ:.25, grabRadius:.134 }),
  chute:Object.freeze({ x:.105, z:.80, radius:.12 }),
  pileBounds:Object.freeze({ minX:.235, maxX:.90, minZ:.14, maxZ:.91 }),
  plushes:Object.freeze(pile.map(([type,x,z,rotation,pose,elevation],i)=>Object.freeze({instanceId:`s1-${i+1}`,type,x,z,rotation,pose,elevation}))),
});

export function getStage(stageId=1){ return STAGE_ONE; }
