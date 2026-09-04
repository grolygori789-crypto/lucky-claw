export const BUILD_TAG = '003.10';

export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id:'signature', value:120, clawPoints:12, scale:1.03, weight:1.00, difficulty:0.08, balance:0.84, asset:'shih-tzu-brown' }),
  black: Object.freeze({ id:'black', value:140, clawPoints:14, scale:1.02, weight:1.06, difficulty:0.10, balance:0.80, asset:'shih-tzu-black' }),
  bear: Object.freeze({ id:'bear', value:100, clawPoints:10, scale:1.08, weight:1.18, difficulty:0.13, balance:0.72, asset:'red-bear' }),
  chick: Object.freeze({ id:'chick', value:80, clawPoints:8, scale:0.92, weight:0.76, difficulty:0.05, balance:0.90, asset:'yellow-chick' }),
  bunny: Object.freeze({ id:'bunny', value:110, clawPoints:11, scale:1.02, weight:0.94, difficulty:0.09, balance:0.78, asset:'white-bunny' }),
});

// Stage 1 — physically believable curated mound.
// The front-left chute footprint stays clear while prizes behind it may still be visible.
// Low elevations + staggered depth + contact shadows create weight without floating sprites.
const pile = [
  // rear crown — only heads/upper bodies should read through the mound
  ['bear',      .21,.18,-11,'rest',  .028],
  ['chick',     .30,.20,  8,'tilt',  .024],
  ['signature', .40,.18, -6,'rest',  .030],
  ['black',     .50,.21,  7,'tilt',  .032],
  ['bear',      .61,.19, -5,'rest',  .029],
  ['black',     .72,.22,  9,'rest',  .027],
  ['bunny',     .82,.20, -7,'front', .024],

  // upper rear mass
  ['bear',      .19,.31, -9,'front', .021],
  ['bunny',     .29,.34,  8,'rest',  .023],
  ['signature', .40,.32, -5,'tilt',  .024],
  ['black',     .51,.35,  7,'front', .026],
  ['bear',      .63,.33, -6,'tilt',  .024],
  ['signature', .75,.35,  6,'rest',  .021],
  ['chick',     .85,.32, -5,'tilt',  .018],

  // dense middle — asymmetric overlap avoids copy/paste rows
  ['signature', .208,.45, 8,'tilt',  .014],
  ['chick',     .30,.47, -7,'front', .016],
  ['black',     .41,.44,  6,'rest',  .018],
  ['bunny',     .52,.49, -6,'front', .019],
  ['bear',      .64,.46,  5,'front', .018],
  ['black',     .76,.49, -5,'tilt',  .015],
  ['signature', .87,.45,  7,'front', .012],

  // low middle — visually buries the agitator under plush weight
  ['bear',      .25,.59, -6,'tilt',  .008],
  ['signature', .36,.62,  5,'front', .010],
  ['black',     .48,.59, -5,'front', .011],
  ['bunny',     .60,.64,  5,'rest',  .010],
  ['chick',     .72,.61, -6,'front', .008],
  ['bear',      .83,.63,  5,'rest',  .006],

  // front hero row — large readable prizes with irregular spacing
  ['signature', .32,.75, -5,'front', .002],
  ['chick',     .43,.78,  5,'front', .000],
  ['bear',      .55,.74, -4,'front', .003],
  ['black',     .67,.79,  4,'front', .001],
  ['signature', .78,.75, -3,'tilt',  .000],
  ['bunny',     .855,.79, 3,'rest',  .000],

  // foreground lip — fills the cabinet front while preserving the real chute opening
  ['black',     .425,.905,-7,'rest',  .000],
  ['signature', .505,.935, 6,'front', .000],
  ['bunny',     .585,.908,-5,'rest',  .000],
  ['bear',      .665,.942, 7,'front', .000],
  ['chick',     .745,.915,-6,'front', .000],
  ['signature', .815,.938, 4,'tilt',  .000],
  ['black',     .858,.900,-3,'front', .000],
];

export const STAGE_ONE = Object.freeze({
  id:1,
  durationSeconds:180,
  targetScore:600,
  shuffleSeconds:15,
  mission:Object.freeze({ signature:1, black:1, bear:1, chick:1, bunny:1 }),
  missionOrder:Object.freeze(['signature','black','bear','chick','bunny']),
  claw:Object.freeze({ minX:.10, maxX:.91, minZ:.08, maxZ:.94, homeX:.55, homeZ:.24, speedX:.27, speedZ:.25, grabRadius:.132 }),
  chute:Object.freeze({ x:.107, z:.80, radius:.12 }),
  pileBounds:Object.freeze({ minX:.175, maxX:.905, minZ:.16, maxZ:.945 }),
  plushes:Object.freeze(pile.map(([type,x,z,rotation,pose,elevation],i)=>Object.freeze({instanceId:`s1-${i+1}`,type,x,z,rotation,pose,elevation}))),
});

export function getStage(stageId=1){ return STAGE_ONE; }
