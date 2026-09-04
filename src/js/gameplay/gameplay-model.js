import { PLUSH_TYPES } from './stage-data.js?v=003.08';
export const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
export function worldDistance(a,b){ return Math.hypot((a?.x??0)-(b?.x??0),((a?.z??0)-(b?.z??0))*0.90); }
export function depthScale(z){ return 0.83 + clamp(z,0,1)*0.34; }
export function projectWorld(x,z){
  const zz=clamp(z,0,1), xx=clamp(x,0,1);
  const width=76.6 + zz*7.2;
  const left=50 + (xx-.5)*width;
  return { left, top: 42.9 + zz*16.1, scale: depthScale(zz), zIndex: 42 + Math.round(zz*74) };
}
export function projectClaw(x,z){
  const zz=clamp(z,0,1), xx=clamp(x,0,1);
  const width=76.2 + zz*6.0;
  const left=50 + (xx-.5)*width;
  return { left, top: 12.5 + zz*5.7, scale: 0.82 + zz*0.18, zIndex: 126 + Math.round(zz*16) };
}
// The real chute occupies the front-left footprint. Rear prizes can sit visually behind it;
// front prizes cannot occupy its physical footprint or perch on the chute wall.
export function leftPileBoundary(z,bounds={}){
  const zz=clamp(z,0,1);
  const base=bounds.minX ?? .175;
  // The acrylic chute rises only at the front-left. Rear prizes may be visible behind it.
  if(zz>=.76) return Math.max(base,.415);
  if(zz>=.65) return Math.max(base,.315);
  if(zz>=.52) return Math.max(base,.245);
  if(zz>=.38) return Math.max(base,.205);
  return base;
}

export function rightPileBoundary(z,bounds={}){
  const zz=clamp(z,0,1);
  const base=bounds.maxX ?? .905;
  if(zz>=.74) return Math.min(base,.865);
  if(zz>=.58) return Math.min(base,.885);
  return Math.min(base,.900);
}

export function constrainPlushToPile(plush,bounds={}){
  const z=clamp(plush.z,bounds.minZ ?? .14,bounds.maxZ ?? .91);
  const minX=leftPileBoundary(z,bounds);
  const maxX=rightPileBoundary(z,bounds);
  return {
    ...plush,
    x:clamp(plush.x,minX,maxX),
    z,
    elevation:clamp(plush.elevation ?? 0,0,.058),
    rotation:clamp(plush.rotation ?? 0,-18,18)
  };
}
export function chooseGrabOutcome({plush,claw,grabRadius,random=Math.random}){
  if(!plush) return 'miss';
  const d=worldDistance(plush,claw);
  if(d>grabRadius) return 'miss';
  const type=PLUSH_TYPES[plush.type];
  const quality=clamp(1-d/grabRadius,0,1);
  const centerBias=clamp(1-Math.abs((plush.rotation||0))/36,0.70,1);
  const elevationBias=clamp(1 + (plush.elevation||0)*2.0,1,1.08);
  const secureChance=clamp(.12+quality*.86+type.balance*.11-type.difficulty-(type.weight-1)*.10,.08,.94)*centerBias*elevationBias;
  const roll=clamp(Number(random())||0,0,.999999);
  if(roll<secureChance) return 'secure';
  if(quality>.55 && roll<secureChance+.24) return 'late-slip';
  if(quality>.24) return 'early-slip';
  return 'miss';
}
export function shufflePlush(plush,{now,index,bounds,intensity=1}){
  const type=PLUSH_TYPES[plush.type];
  const phase=now/245+index*1.79;
  const mobility=(1/type.weight)*(.85+type.balance*.2)*intensity;
  const dx=Math.sin(phase)*.0086*mobility + Math.sin(phase*.41)*.0038;
  const dz=Math.cos(phase*.77)*.0064*mobility;
  const de=Math.sin(phase*.59+index)*.00022*mobility;
  return constrainPlushToPile({
    ...plush,
    x:plush.x+dx,
    z:plush.z+dz,
    elevation:(plush.elevation||0)+de,
    rotation:plush.rotation+Math.sin(phase*1.11)*1.65*mobility
  },bounds);
}
export function applyCaptureProgress(current,plushType,now=Date.now()){
  const type=PLUSH_TYPES[plushType]; if(!type) return current;
  const collection={...(current.collection||{})}; const record=collection[plushType];
  const count=typeof record==='object'?(Number(record.count)||0):(Number(record)||0);
  collection[plushType]={count:count+1,firstCaughtAt:record?.firstCaughtAt||now};
  return {...current,points:(Number(current.points)||0)+type.clawPoints,collection};
}
export function applyRoundResult(current,{stageId,score,targetScore}){
  const oldBest=Number(current.highScoresByStage?.[stageId])||0; const newBest=Math.max(oldBest,score); const clear=score>=targetScore;
  const stageProgress={...(current.stageProgress||{highestUnlocked:1,highestCompleted:0})};
  if(clear){stageProgress.highestCompleted=Math.max(Number(stageProgress.highestCompleted)||0,stageId);stageProgress.highestUnlocked=Math.max(Number(stageProgress.highestUnlocked)||1,stageId+1);}
  return {state:{...current,highScoresByStage:{...(current.highScoresByStage||{}),[stageId]:newBest},stageProgress},clear,oldBest,newBest};
}
