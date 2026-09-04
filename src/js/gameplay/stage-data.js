export const BUILD_TAG = '003.03';

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
  // Dense organic mound: overlapping depth, varied elevation and poses. Chute x < .22 stays clear.
  ['bear',      .44,.18,-9,'tilt', .132],
  ['black',     .59,.22, 7,'rest', .148],
  ['bunny',     .75,.27,-6,'tilt', .118],
  ['signature', .86,.34, 9,'rest', .086],
  ['chick',     .31,.39,-8,'tilt', .092],
  ['signature', .47,.43, 6,'front',.106],
  ['bear',      .64,.46,-7,'front',.122],
  ['black',     .80,.51, 8,'tilt', .082],
  ['bunny',     .29,.60, 7,'front',.058],
  ['black',     .43,.65,-6,'front',.074],
  ['signature', .59,.69, 5,'tilt', .088],
  ['bear',      .75,.73,-7,'front',.052],
  ['chick',     .34,.81, 6,'front',.010],
  ['bunny',     .54,.84,-6,'rest', .018],
  ['signature', .78,.87, 4,'front',.000],
];

export const STAGE_ONE = Object.freeze({
  id:1,
  durationSeconds:180,
  targetScore:600,
  shuffleSeconds:15,
  claw:Object.freeze({ minX:.10, maxX:.90, minZ:.07, maxZ:.91, homeX:.55, homeZ:.28, speedX:.27, speedZ:.25, grabRadius:.122 }),
  chute:Object.freeze({ x:.105, z:.80, radius:.12 }),
  pileBounds:Object.freeze({ minX:.245, maxX:.90, minZ:.12, maxZ:.91 }),
  plushes:Object.freeze(pile.map(([type,x,z,rotation,pose,elevation],i)=>Object.freeze({instanceId:`s1-${i+1}`,type,x,z,rotation,pose,elevation}))),
});

export function getStage(stageId=1){ return STAGE_ONE; }
