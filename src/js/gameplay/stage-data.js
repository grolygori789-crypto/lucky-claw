export const BUILD_TAG = '003.04';

export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id:'signature', value:120, clawPoints:12, scale:1.00, weight:1.00, difficulty:0.08, balance:0.84, asset:'shih-tzu-brown' }),
  black: Object.freeze({ id:'black', value:140, clawPoints:14, scale:1.00, weight:1.06, difficulty:0.10, balance:0.80, asset:'shih-tzu-black' }),
  bear: Object.freeze({ id:'bear', value:100, clawPoints:10, scale:1.08, weight:1.18, difficulty:0.13, balance:0.72, asset:'red-bear' }),
  chick: Object.freeze({ id:'chick', value:80, clawPoints:8, scale:0.91, weight:0.76, difficulty:0.05, balance:0.90, asset:'yellow-chick' }),
  bunny: Object.freeze({ id:'bunny', value:110, clawPoints:11, scale:1.01, weight:0.94, difficulty:0.09, balance:0.78, asset:'white-bunny' }),
});

const pile = [
  ['bear',      .33,.16,-11,'tilt', .158],
  ['black',     .50,.18,  8,'rest', .172],
  ['bunny',     .66,.19, -8,'tilt', .162],
  ['signature', .81,.22,  9,'rest', .142],

  ['chick',     .27,.31,-10,'tilt', .128],
  ['signature', .42,.31,  7,'front',.144],
  ['bear',      .57,.33, -8,'front',.154],
  ['black',     .72,.34,  8,'tilt', .145],
  ['bunny',     .86,.35, -6,'rest', .124],

  ['signature', .26,.46,  7,'tilt', .102],
  ['black',     .39,.47, -5,'front',.118],
  ['bunny',     .53,.48,  5,'front',.122],
  ['bear',      .67,.49, -7,'front',.126],
  ['signature', .82,.50,  6,'tilt', .112],

  ['chick',     .25,.62,  5,'front',.074],
  ['bunny',     .39,.64, -6,'rest', .068],
  ['black',     .54,.66,  7,'front',.072],
  ['signature', .68,.67, -5,'tilt', .078],
  ['bear',      .83,.68,  6,'front',.070],

  ['signature', .30,.80,  5,'front',.026],
  ['chick',     .46,.82, -5,'front',.022],
  ['bunny',     .60,.84,  4,'rest', .016],
  ['black',     .74,.85, -4,'front',.014],
  ['signature', .86,.87,  3,'front',.008],
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
