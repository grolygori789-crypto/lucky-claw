import { PLUSH_TYPES } from './stage-data.js?v=003.10';
export const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
export function worldDistance(a,b){ return Math.hypot((a?.x??0)-(b?.x??0),((a?.z??0)-(b?.z??0))*0.90); }
export function depthScale(z){ return 0.83 + clamp(z,0,1)*0.34; }
export function projectWorld(x,z){
  const zz=clamp(z,0,1), xx=clamp(x,0,1);
  const width=76.6 + zz*7.2;
  const left=50 + (xx-.5)*width;
  return { left, top: 42.55 + zz*16.65, scale: depthScale(zz), zIndex: 42 + Math.round(zz*74) };
}
export function projectClaw(x,z){
  const zz=clamp(z,0,1), xx=clamp(x,0,1);
  const width=76.2 + zz*6.0;
  const left=50 + (xx-.5)*width;
  return { left, top: 12.5 + zz*5.7, scale: 0.82 + zz*0.18, zIndex: 126 + Math.round(zz*16) };
}

// Real chute exclusion: rear prizes can appear visually behind the acrylic chute,
// while near/front prizes must stay on the usable floor to its right.
export function leftPileBoundary(z,bounds={}){
  const zz=clamp(z,0,1);
  const base=bounds.minX ?? .175;
  if(zz>=.84) return Math.max(base,.415);
  if(zz>=.76) return Math.max(base,.405);
  if(zz>=.65) return Math.max(base,.315);
  if(zz>=.52) return Math.max(base,.245);
  if(zz>=.38) return Math.max(base,.205);
  return base;
}
export function rightPileBoundary(z,bounds={}){
  const zz=clamp(z,0,1);
  const base=bounds.maxX ?? .905;
  if(zz>=.88) return Math.min(base,.862);
  if(zz>=.74) return Math.min(base,.872);
  if(zz>=.58) return Math.min(base,.887);
  return Math.min(base,.900);
}
export function constrainPlushToPile(plush,bounds={}){
  const z=clamp(plush.z,bounds.minZ ?? .14,bounds.maxZ ?? .945);
  const minX=leftPileBoundary(z,bounds);
  const maxX=rightPileBoundary(z,bounds);
  return {
    ...plush,
    x:clamp(plush.x,minX,maxX),
    z,
    elevation:clamp(plush.elevation ?? 0,0,.034),
    rotation:clamp(plush.rotation ?? 0,-18,18)
  };
}

// Lightweight pairwise settling. This is intentionally bounded: it gives neighboring
// plushes visible push/settle behavior during SHUFFLE without introducing unstable rigid-body physics.
export function settlePile(plushes,bounds={},iterations=2){
  const active=plushes.filter(p=>p&&!p.captured);
  for(let iter=0;iter<iterations;iter+=1){
    for(let i=0;i<active.length;i+=1){
      const a=active[i], ta=PLUSH_TYPES[a.type];
      for(let j=i+1;j<active.length;j+=1){
        const b=active[j], tb=PLUSH_TYPES[b.type];
        let dx=b.x-a.x, dz=(b.z-a.z)*.88;
        let d=Math.hypot(dx,dz);
        const minSep=.048*((ta.scale+tb.scale)*.5);
        if(d>=minSep) continue;
        if(d<.0001){ dx=((i+j)%2?1:-1)*.001; dz=.001; d=Math.hypot(dx,dz); }
        const overlap=(minSep-d)*.24;
        const nx=dx/d, nz=dz/d;
        const wa=1/Math.max(.55,ta.weight), wb=1/Math.max(.55,tb.weight), sum=wa+wb;
        a.x-=nx*overlap*(wa/sum); a.z-=nz*overlap*(wa/sum)/.88;
        b.x+=nx*overlap*(wb/sum); b.z+=nz*overlap*(wb/sum)/.88;
        a.rotation=clamp((a.rotation||0)-nx*.34,-18,18);
        b.rotation=clamp((b.rotation||0)+nx*.34,-18,18);
      }
    }
    for(const p of active){
      // tiny forward settling under gravity keeps the foreground naturally occupied.
      p.z+=.00018;
      Object.assign(p,constrainPlushToPile(p,bounds));
    }
  }
  return active;
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
  const dx=Math.sin(phase)*.0082*mobility + Math.sin(phase*.41)*.0035;
  const dz=Math.cos(phase*.77)*.0060*mobility;
  const de=Math.sin(phase*.59+index)*.00016*mobility;
  return constrainPlushToPile({
    ...plush,
    x:plush.x+dx,
    z:plush.z+dz,
    elevation:(plush.elevation||0)+de,
    rotation:plush.rotation+Math.sin(phase*1.11)*1.45*mobility
  },bounds);
}
export function applyCaptureProgress(current,plushType,now=Date.now()){
  const type=PLUSH_TYPES[plushType]; if(!type) return current;
  const collection={...(current.collection||{})}; const record=collection[plushType];
  const count=typeof record==='object'?(Number(record.count)||0):(Number(record)||0);
  collection[plushType]={count:count+1,firstCaughtAt:record?.firstCaughtAt||now};
  return {...current,points:(Number(current.points)||0)+type.clawPoints,collection};
}
export function applyRoundResult(current,{stageId,score,targetScore,objectivesMet=true}){
  const oldBest=Number(current.highScoresByStage?.[stageId])||0; const newBest=Math.max(oldBest,score); const clear=score>=targetScore&&Boolean(objectivesMet);
  const stageProgress={...(current.stageProgress||{highestUnlocked:1,highestCompleted:0})};
  if(clear){stageProgress.highestCompleted=Math.max(Number(stageProgress.highestCompleted)||0,stageId);stageProgress.highestUnlocked=Math.max(Number(stageProgress.highestUnlocked)||1,stageId+1);}
  return {state:{...current,highScoresByStage:{...(current.highScoresByStage||{}),[stageId]:newBest},stageProgress},clear,oldBest,newBest};
}
