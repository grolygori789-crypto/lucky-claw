import { PLUSH_TYPES } from './stage-data.js?v=003.04';
export const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
export function worldDistance(a,b){ return Math.hypot((a?.x??0)-(b?.x??0),((a?.z??0)-(b?.z??0))*0.90); }
export function depthScale(z){ return 0.80 + clamp(z,0,1)*0.34; }
export function projectWorld(x,z){
  const zz=clamp(z,0,1), xx=clamp(x,0,1);
  const width=74.8 + zz*7.2;
  const left=50 + (xx-.5)*width;
  return { left, top: 47.1 + zz*15.0, scale: depthScale(zz), zIndex: 42 + Math.round(zz*72) };
}
export function projectClaw(x,z){
  const zz=clamp(z,0,1), xx=clamp(x,0,1);
  const width=75.4 + zz*5.8;
  const left=50 + (xx-.5)*width;
  return { left, top: 12.1 + zz*5.45, scale: 0.83 + zz*0.17, zIndex: 126 + Math.round(zz*16) };
}
export function chooseGrabOutcome({plush,claw,grabRadius,random=Math.random}){
  if(!plush) return 'miss';
  const d=worldDistance(plush,claw);
  if(d>grabRadius) return 'miss';
  const type=PLUSH_TYPES[plush.type];
  const quality=clamp(1-d/grabRadius,0,1);
  const centerBias=clamp(1-Math.abs((plush.rotation||0))/36,0.70,1);
  const elevationBias=clamp(1 + (plush.elevation||0)*1.6, 1, 1.25);
  const secureChance=clamp(.12+quality*.86+type.balance*.11-type.difficulty-(type.weight-1)*.10, .08,.94)*centerBias*elevationBias;
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
  const dx=Math.sin(phase)*.010*mobility + Math.sin(phase*.41)*.0046;
  const dz=Math.cos(phase*.77)*.008*mobility;
  const de=Math.sin(phase*.59+index)*.0018*mobility;
  return {
    ...plush,
    x:clamp(plush.x+dx,bounds.minX,bounds.maxX),
    z:clamp(plush.z+dz,bounds.minZ,bounds.maxZ),
    elevation:clamp((plush.elevation||0)+de,0,.18),
    rotation:clamp(plush.rotation+Math.sin(phase*1.11)*1.8*mobility,-18,18)
  };
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
