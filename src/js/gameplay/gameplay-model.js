import { PLUSH_TYPES } from './stage-data.js?v=003.03';
export const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
export function worldDistance(a,b){ return Math.hypot((a?.x??0)-(b?.x??0),((a?.z??0)-(b?.z??0))*0.92); }
export function depthScale(z){ return 0.82 + clamp(z,0,1)*0.30; }
export function projectWorld(x,z){
  const zz=clamp(z,0,1), xx=clamp(x,0,1);
  // Perspective converges toward rear wall; front prizes are larger and sit lower.
  const width=76.5 + zz*5.0;
  const left=50 + (xx-.5)*width;
  return { left, top: 49.2 + zz*13.65, scale: depthScale(zz), zIndex: 42 + Math.round(zz*68) };
}
export function projectClaw(x,z){
  const zz=clamp(z,0,1), xx=clamp(x,0,1);
  const width=75.8 + zz*4.8;
  const left=50 + (xx-.5)*width;
  return { left, top: 12.55 + zz*5.15, scale: 0.84 + zz*0.16, zIndex: 126 + Math.round(zz*14) };
}
export function chooseGrabOutcome({plush,claw,grabRadius,random=Math.random}){
  if(!plush) return 'miss';
  const d=worldDistance(plush,claw);
  if(d>grabRadius) return 'miss';
  const type=PLUSH_TYPES[plush.type];
  const quality=clamp(1-d/grabRadius,0,1);
  const centerBias=clamp(1-Math.abs((plush.rotation||0))/36,0.68,1);
  const secureChance=clamp(.09+quality*.83+type.balance*.09-type.difficulty-(type.weight-1)*.11, .05,.92)*centerBias;
  const roll=clamp(Number(random())||0,0,.999999);
  if(roll<secureChance) return 'secure';
  if(quality>.53 && roll<secureChance+.28) return 'late-slip';
  if(quality>.22) return 'early-slip';
  return 'miss';
}
export function shufflePlush(plush,{now,index,bounds,intensity=1}){
  const type=PLUSH_TYPES[plush.type];
  const phase=now/270+index*1.81;
  const mobility=(1/type.weight)*(.85+type.balance*.2)*intensity;
  const dx=Math.sin(phase)*.0085*mobility + Math.sin(phase*.43)*.004;
  const dz=Math.cos(phase*.79)*.0065*mobility;
  const de=Math.sin(phase*.61+index)*.0014*mobility;
  return {...plush,x:clamp(plush.x+dx,bounds.minX,bounds.maxX),z:clamp(plush.z+dz,bounds.minZ,bounds.maxZ),elevation:clamp((plush.elevation||0)+de,0,.095),rotation:clamp(plush.rotation+Math.sin(phase*1.13)*1.45*mobility,-16,16)};
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
