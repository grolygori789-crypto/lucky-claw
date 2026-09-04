export const BUILD_TAG = '003.08';

export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id:'signature', value:120, clawPoints:12, scale:1.03, weight:1.00, difficulty:0.08, balance:0.84, asset:'shih-tzu-brown' }),
  black: Object.freeze({ id:'black', value:140, clawPoints:14, scale:1.02, weight:1.06, difficulty:0.10, balance:0.80, asset:'shih-tzu-black' }),
  bear: Object.freeze({ id:'bear', value:100, clawPoints:10, scale:1.08, weight:1.18, difficulty:0.13, balance:0.72, asset:'red-bear' }),
  chick: Object.freeze({ id:'chick', value:80, clawPoints:8, scale:0.92, weight:0.76, difficulty:0.05, balance:0.90, asset:'yellow-chick' }),
  bunny: Object.freeze({ id:'bunny', value:110, clawPoints:11, scale:1.02, weight:0.94, difficulty:0.09, balance:0.78, asset:'white-bunny' }),
});

// Stage 1 — premium benchmark composition.
// Curated mound: wide base, dense middle, crowned rear. No front plush crosses chute footprint.
const pile = [
  // back crown / partial heads
  ['bear',      .22,.18,-9,'rest',  .050],
  ['chick',     .31,.19, 8,'tilt',  .046],
  ['signature', .40,.18,-5,'rest',  .052],
  ['black',     .50,.19, 6,'tilt',  .055],
  ['bear',      .60,.18,-5,'rest',  .054],
  ['black',     .70,.20, 7,'rest',  .051],
  ['bunny',     .81,.19,-6,'front', .048],

  // upper rear mass
  ['bear',      .19,.30,-8,'front', .039],
  ['bunny',     .30,.31, 7,'rest',  .040],
  ['signature', .41,.31,-4,'front', .043],
  ['black',     .52,.32, 6,'front', .046],
  ['bear',      .63,.31,-5,'front', .044],
  ['signature', .74,.32, 5,'tilt',  .042],
  ['chick',     .85,.32,-4,'tilt',  .037],

  // middle hero mass
  ['signature', .21,.44, 7,'front', .026],
  ['chick',     .29,.44,-5,'front', .028],
  ['black',     .41,.45, 5,'front', .031],
  ['bunny',     .53,.46,-5,'front', .033],
  ['bear',      .65,.46, 4,'front', .031],
  ['black',     .76,.45,-4,'front', .028],
  ['signature', .87,.46, 5,'front', .024],

  // low mid shelf, starts to cover agitator
  ['bear',      .25,.58,-5,'front', .014],
  ['signature', .36,.60, 4,'front', .016],
  ['black',     .48,.61,-4,'front', .018],
  ['bunny',     .60,.61, 4,'front', .018],
  ['chick',     .71,.60,-4,'front', .016],
  ['bear',      .82,.61, 4,'front', .014],

  // front hero row
  ['signature', .32,.74,-3,'front', .000],
  ['chick',     .42,.76, 3,'front', .000],
  ['bear',      .54,.77,-3,'front', .002],
  ['black',     .66,.77, 2,'front', .002],
  ['signature', .78,.76,-2,'front', .000],
  ['bunny',     .855,.77, 2,'rest',  .000],
];

export const STAGE_ONE = Object.freeze({
  id:1,
  durationSeconds:180,
  targetScore:600,
  shuffleSeconds:15,
  claw:Object.freeze({ minX:.10, maxX:.91, minZ:.08, maxZ:.91, homeX:.55, homeZ:.24, speedX:.27, speedZ:.25, grabRadius:.132 }),
  chute:Object.freeze({ x:.107, z:.80, radius:.12 }),
  pileBounds:Object.freeze({ minX:.175, maxX:.905, minZ:.16, maxZ:.90 }),
  plushes:Object.freeze(pile.map(([type,x,z,rotation,pose,elevation],i)=>Object.freeze({instanceId:`s1-${i+1}`,type,x,z,rotation,pose,elevation}))),
});

export function getStage(stageId=1){ return STAGE_ONE; }
