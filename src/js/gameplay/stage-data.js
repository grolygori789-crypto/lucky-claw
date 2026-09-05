export const BUILD_TAG = '003.11';

export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id:'signature', value:120, clawPoints:12, scale:0.97, weight:1.00, difficulty:0.08, balance:0.84, asset:'shih-tzu-brown' }),
  black: Object.freeze({ id:'black', value:140, clawPoints:14, scale:0.96, weight:1.06, difficulty:0.10, balance:0.80, asset:'shih-tzu-black' }),
  bear: Object.freeze({ id:'bear', value:100, clawPoints:10, scale:1.00, weight:1.18, difficulty:0.13, balance:0.72, asset:'red-bear' }),
  chick: Object.freeze({ id:'chick', value:80, clawPoints:8, scale:0.86, weight:0.76, difficulty:0.05, balance:0.90, asset:'yellow-chick' }),
  bunny: Object.freeze({ id:'bunny', value:110, clawPoints:11, scale:0.96, weight:0.94, difficulty:0.09, balance:0.78, asset:'white-bunny' }),
});

// Stage 1 — denser, more believable mound.
// Keep the prize chute usable while filling the visible front floor with plush volume.
// Front prizes are slightly smaller and more irregular so the pile reads as physical, not copy-pasted.
const pile = [
  // rear crown
  ['bear',      .20,.18,-9,'rest',   .016],
  ['signature', .32,.17, 7,'tilt',   .015],
  ['black',     .45,.19,-6,'rest',   .017],
  ['bear',      .57,.18, 6,'front',  .016],
  ['signature', .70,.18,-5,'tilt',   .014],
  ['bunny',     .83,.21, 7,'rest',   .013],

  // upper rear mass
  ['bear',      .18,.30,-8,'front',  .012],
  ['signature', .29,.28, 6,'rest',   .013],
  ['black',     .41,.31,-4,'tilt',   .014],
  ['bunny',     .53,.29, 5,'front',  .013],
  ['bear',      .65,.31,-6,'rest',   .012],
  ['black',     .77,.30, 5,'front',  .013],
  ['signature', .87,.33,-6,'rest',   .011],

  // dense middle body
  ['signature', .21,.42, 7,'front',  .009],
  ['black',     .31,.41,-5,'rest',   .010],
  ['bear',      .42,.44, 4,'tilt',   .010],
  ['black',     .53,.42,-4,'front',  .011],
  ['signature', .64,.44, 5,'rest',   .010],
  ['bunny',     .75,.42,-5,'front',  .010],
  ['bear',      .86,.45, 6,'rest',   .008],

  // lower mid fill
  ['bear',      .25,.54,-5,'tilt',   .006],
  ['signature', .36,.56, 5,'front',  .006],
  ['black',     .47,.55,-4,'rest',   .007],
  ['chick',     .58,.57, 5,'front',  .006],
  ['signature', .69,.55,-4,'tilt',   .006],
  ['black',     .80,.57, 4,'front',  .006],
  ['bear',      .89,.56,-5,'rest',   .005],

  // front row — occupies the visible floor, but stays out of the chute opening
  ['signature', .44,.74,-5,'front',  .002],
  ['black',     .54,.77, 4,'front',  .001],
  ['bunny',     .64,.74,-4,'rest',   .001],
  ['bear',      .74,.77, 5,'front',  .002],
  ['signature', .84,.74,-3,'tilt',   .001],

  // foreground lip fill — dense, irregular, still physically plausible
  ['black',     .45,.86,-5,'rest',   .000],
  ['signature', .55,.89, 4,'front',  .000],
  ['chick',     .65,.86,-4,'front',  .000],
  ['bear',      .75,.89, 5,'front',  .000],
  ['bunny',     .85,.86,-3,'rest',   .000],
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
  pileBounds:Object.freeze({ minX:.18, maxX:.90, minZ:.16, maxZ:.90 }),
  plushes:Object.freeze(pile.map(([type,x,z,rotation,pose,elevation],i)=>Object.freeze({instanceId:`s1-${i+1}`,type,x,z,rotation,pose,elevation}))),
});

export function getStage(stageId=1){ return STAGE_ONE; }
