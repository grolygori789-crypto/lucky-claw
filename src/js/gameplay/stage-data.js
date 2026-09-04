export const BUILD_TAG = '003.05';

export const PLUSH_TYPES = Object.freeze({
  signature: Object.freeze({ id:'signature', value:120, clawPoints:12, scale:1.00, weight:1.00, difficulty:0.08, balance:0.84, asset:'shih-tzu-brown' }),
  black: Object.freeze({ id:'black', value:140, clawPoints:14, scale:1.00, weight:1.06, difficulty:0.10, balance:0.80, asset:'shih-tzu-black' }),
  bear: Object.freeze({ id:'bear', value:100, clawPoints:10, scale:1.08, weight:1.18, difficulty:0.13, balance:0.72, asset:'red-bear' }),
  chick: Object.freeze({ id:'chick', value:80, clawPoints:8, scale:0.91, weight:0.76, difficulty:0.05, balance:0.90, asset:'yellow-chick' }),
  bunny: Object.freeze({ id:'bunny', value:110, clawPoints:11, scale:1.01, weight:0.94, difficulty:0.09, balance:0.78, asset:'white-bunny' }),
});

const pile = [
  ['bear',      .36,.17,-11,'tilt', .166],
  ['black',     .48,.18,  8,'rest', .176],
  ['bunny',     .60,.19, -8,'tilt', .168],
  ['signature', .73,.21,  9,'rest', .155],
  ['black',     .85,.23, -6,'tilt', .142],

  ['chick',     .34,.30,-10,'tilt', .145],
  ['signature', .45,.31,  7,'front',.156],
  ['bear',      .57,.33, -8,'front',.162],
  ['black',     .68,.34,  8,'tilt', .152],
  ['bunny',     .80,.35, -6,'rest', .136],
  ['signature', .89,.36,  6,'tilt', .122],

  ['signature', .35,.46,  7,'tilt', .124],
  ['black',     .47,.47, -5,'front',.132],
  ['bunny',     .58,.48,  5,'front',.136],
  ['bear',      .70,.49, -7,'front',.142],
  ['signature', .82,.50,  6,'tilt', .128],

  ['chick',     .42,.61,  5,'front',.098],
  ['bunny',     .53,.63, -6,'rest', .094],
  ['black',     .65,.65,  7,'front',.098],
  ['signature', .77,.66, -5,'tilt', .104],
  ['bear',      .88,.68,  6,'front',.094],

  ['signature', .45,.77,  5,'front',.050],
  ['chick',     .57,.80, -5,'front',.044],
  ['bunny',     .69,.82,  4,'rest', .038],
  ['black',     .81,.84, -4,'front',.034],
  ['signature', .89,.86,  3,'front',.028],
];

export const STAGE_ONE = Object.freeze({
  id:1,
  durationSeconds:180,
  targetScore:600,
  shuffleSeconds:15,
  claw:Object.freeze({ minX:.10, maxX:.90, minZ:.07, maxZ:.91, homeX:.55, homeZ:.28, speedX:.27, speedZ:.25, grabRadius:.134 }),
  chute:Object.freeze({ x:.105, z:.80, radius:.12 }),
  pileBounds:Object.freeze({ minX:.32, maxX:.90, minZ:.14, maxZ:.91 }),
  plushes:Object.freeze(pile.map(([type,x,z,rotation,pose,elevation],i)=>Object.freeze({instanceId:`s1-${i+1}`,type,x,z,rotation,pose,elevation}))),
});

export function getStage(stageId=1){ return STAGE_ONE; }
