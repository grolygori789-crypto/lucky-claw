import { getStage, PLUSH_TYPES } from './stage-data.js?v=003.11';
import { ArcadeSfx } from './sfx.js?v=003.09';
import { clamp, worldDistance, projectWorld, projectClaw, chooseGrabOutcome, shufflePlush, settlePile, applyCaptureProgress, applyRoundResult } from './gameplay-model.js?v=003.11';

const COPY=Object.freeze({
  en:{score:'SCORE',stage:'STAGE',min:'MIN SCORE',high:'HIGH SCORE',move:'MOVE',shuffle:'SHUFFLE',drop:'DROP',menu:'MENU',clear:'STAGE CLEAR',fail:'TIME UP',replay:'PLAY AGAIN',points:'CLAW POINTS',newBest:'NEW HIGH SCORE',time:'TIME',grip:'LOCKED!',lateSlip:'SO CLOSE!',earlySlip:'SLIPPED!',miss:'MISSED!',mission:'COLLECT',missionResult:'PLUSH MISSION',missionDone:'MISSION COMPLETE'},
  th:{score:'คะแนน',stage:'ด่าน',min:'คะแนนขั้นต่ำ',high:'สถิติสูงสุด',move:'เลื่อน',shuffle:'คนตุ๊กตา',drop:'คีบ',menu:'เมนู',clear:'ผ่านด่าน',fail:'หมดเวลา',replay:'เล่นอีกครั้ง',points:'CLAW POINTS',newBest:'สถิติใหม่',time:'เวลา',grip:'ล็อกได้!',lateSlip:'เกือบแล้ว!',earlySlip:'หลุด!',miss:'พลาด!',mission:'ภารกิจ',missionResult:'เก็บตุ๊กตา',missionDone:'ภารกิจครบ'},
  ja:{score:'スコア',stage:'ステージ',min:'目標スコア',high:'ハイスコア',move:'移動',shuffle:'シャッフル',drop:'キャッチ',menu:'メニュー',clear:'ステージクリア',fail:'タイムアップ',replay:'もう一度',points:'CLAW POINTS',newBest:'ハイスコア更新',time:'タイム',grip:'ホールド!',lateSlip:'おしい!',earlySlip:'すべった!',miss:'ミス!',mission:'ミッション',missionResult:'ぬいぐるみ',missionDone:'ミッション完了'}
});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
function lang(){const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('th')?'th':l.startsWith('ja')?'ja':'en';}
function c(){return COPY[lang()]||COPY.en;}
function fmt(sec){const s=Math.max(0,Math.ceil(sec));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function plushSrc(plush){const t=PLUSH_TYPES[plush.type];return `./assets/plushies/gameplay/${t.asset}_${plush.pose||'front'}.png?v=003.11`;}

function markup(){const t=c();return `
<div class="lc-gameplay-stage" data-game-stage data-claw-state="idle">
  <div class="lc-marquee" aria-hidden="true"><span class="lc-marquee__star">✦</span><strong>Lucky Claw</strong><small>CATCH A LITTLE HAPPINESS</small><span class="lc-marquee__star lc-marquee__star--r">✦</span></div>
  <div class="lc-header-whisper lc-header-whisper--l" aria-hidden="true">PLAY · SMILE · COLLECT · REPEAT</div>
  <div class="lc-header-whisper lc-header-whisper--r" aria-hidden="true">GOOD THINGS COME TO YOU</div>
  <div class="lc-game-hud" aria-label="Game status"><span class="lc-hud-fascia" aria-hidden="true"></span>
    <div class="lc-hud-module lc-hud-score"><span class="lc-hud-label" data-copy-score>${t.score}</span><strong class="lc-hud-value" data-game-score>0</strong></div>
    <div class="lc-hud-module lc-hud-stage"><span class="lc-hud-label" data-copy-stage>${t.stage}</span><strong class="lc-hud-value" data-game-stage-value>1</strong></div>
    <div class="lc-hud-module lc-hud-target"><span class="lc-hud-label" data-copy-min>${t.min}</span><strong class="lc-hud-value" data-game-target>600</strong><span class="lc-hud-best"><span data-copy-high>${t.high}</span><b data-game-best>0</b></span></div>
  </div>
  <div class="lc-mission-strip" data-mission-strip aria-label="${t.mission}"></div>
  <button class="lc-game-menu" type="button" data-game-menu aria-label="${t.menu}">×</button>
  <div class="lc-roof-grid" aria-hidden="true"><i class="lc-roof-side lc-roof-side--l"></i><i class="lc-roof-side lc-roof-side--r"></i></div>
  <div class="lc-claw-rig" data-game-claw aria-hidden="true">
    <div class="lc-claw-carriage"><img src="./assets/machines/classic/gameplay-carriage.png?v=003.11" alt="" draggable="false"></div>
    <div class="lc-claw-shaft"></div>
    <div class="lc-claw-head"><img class="lc-claw-head__fixed" src="./assets/machines/classic/gameplay-claw-head.png?v=003.11" alt="" draggable="false"><img class="lc-claw-head__arms" src="./assets/machines/classic/gameplay-claw-head.png?v=003.11" alt="" draggable="false"><div class="lc-claw-payload" data-claw-payload></div></div>
  </div>
  <div class="lc-agitator" data-agitator aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="lc-plush-field" data-plush-field></div>
  <div class="lc-target-marker" data-target-marker aria-hidden="true"><span></span></div>
  <div class="lc-glass-overlay" aria-hidden="true"><i class="lc-glass-overlay__top"></i><i class="lc-glass-overlay__edge lc-glass-overlay__edge--l"></i><i class="lc-glass-overlay__edge lc-glass-overlay__edge--r"></i><i class="lc-glass-overlay__shine lc-glass-overlay__shine--l"></i><i class="lc-glass-overlay__shine lc-glass-overlay__shine--r"></i></div>
  <div class="lc-chute-glow" data-chute-glow></div>
  <div class="lc-prize-delivery" data-prize-delivery><img alt="" draggable="false"></div>
  <div class="lc-feedback" data-game-feedback aria-live="polite"></div>
  <div class="lc-control-deck">
    <div class="lc-joystick" data-game-joystick role="application" tabindex="0" aria-label="${t.move}"><span class="lc-joystick__well"></span><span class="lc-joystick__arrow lc-joystick__arrow--up">▲</span><span class="lc-joystick__arrow lc-joystick__arrow--right">▶</span><span class="lc-joystick__arrow lc-joystick__arrow--down">▼</span><span class="lc-joystick__arrow lc-joystick__arrow--left">◀</span><span class="lc-joystick__stem"></span><span class="lc-joystick__knob"></span><span class="lc-control-label" data-copy-move>${t.move}</span></div>
    <div class="lc-game-timer"><span class="lc-timer-label" data-copy-time>${t.time}</span><div class="lc-game-timer__screen" data-game-timer>03:00</div></div>
    <span class="lc-console-speaker" aria-hidden="true"></span>
    <button class="lc-hw-button lc-hw-button--shuffle" type="button" data-game-shuffle><span class="lc-hw-button__cap"><span class="lc-hw-button__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h3.2c4.7 0 5.4 10 10.8 10H21"/><path d="m18 14 3 3-3 3"/><path d="M5 17h3.2c1.8 0 3.1-1.7 4.2-3.7M14.2 10.7C15.5 8.4 16.8 7 19 7h2"/><path d="m18 4 3 3-3 3"/></svg></span><span class="lc-hw-button__text" data-copy-shuffle>${t.shuffle}</span></span><span class="lc-shuffle-budget" data-shuffle-left>15</span></button>
    <button class="lc-hw-button lc-hw-button--drop" type="button" data-game-drop><span class="lc-hw-button__cap"><span class="lc-hw-button__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"/><path d="m7.5 11.5 4.5 4.6 4.5-4.6"/><path d="M6 20h12"/></svg></span><span class="lc-hw-button__text" data-copy-drop>${t.drop}</span></span></button>
  </div>
  <div class="lc-round-result" data-round-result hidden><div class="lc-round-result__card"><h2 data-result-title>${t.clear}</h2><div class="lc-round-result__row"><span data-copy-score>${t.score}</span><strong data-result-score>0</strong></div><div class="lc-round-result__row"><span data-copy-high>${t.high}</span><strong data-result-best>0</strong></div><div class="lc-round-result__row"><span data-copy-mission-result>${t.missionResult}</span><strong data-result-mission>0/5</strong></div><div class="lc-round-result__row"><span>${t.points}</span><strong data-result-points>0</strong></div><div class="lc-round-result__actions"><button type="button" data-result-replay>${t.replay}</button><button type="button" data-result-menu>${t.menu}</button></div></div></div>
</div>`;}

export function ensureGameplayScreen(){
  let screen=document.querySelector('.screen--gameplay');
  if(!screen){screen=document.createElement('section');screen.className='screen screen--gameplay';screen.dataset.screen='gameplay';screen.setAttribute('aria-label','Lucky Claw gameplay');screen.setAttribute('aria-hidden','true');screen.innerHTML=markup();document.querySelector('#app')?.append(screen);}
  if(!document.querySelector('link[data-lc-gameplay-style]')){const l=document.createElement('link');l.rel='stylesheet';l.href='./src/css/gameplay.css?v=003.11';l.dataset.lcGameplayStyle='true';document.head.append(l);}
  return screen;
}

export function createGameplayController({getState,persistState,onMenu,music}){
  const screen=ensureGameplayScreen(), stageNode=screen.querySelector('[data-game-stage]'), field=screen.querySelector('[data-plush-field]'), clawNode=screen.querySelector('[data-game-claw]');
  const joystick=screen.querySelector('[data-game-joystick]'), shuffleBtn=screen.querySelector('[data-game-shuffle]'), dropBtn=screen.querySelector('[data-game-drop]');
  const agitator=screen.querySelector('[data-agitator]'), chuteGlow=screen.querySelector('[data-chute-glow]'), delivery=screen.querySelector('[data-prize-delivery]'), payload=screen.querySelector('[data-claw-payload]'), targetMarker=screen.querySelector('[data-target-marker]'), missionStrip=screen.querySelector('[data-mission-strip]'), feedback=screen.querySelector('[data-game-feedback]'), result=screen.querySelector('[data-round-result]');
  const sfx=new ArcadeSfx(()=>getState()?.settings||{});
  const nodes={score:screen.querySelector('[data-game-score]'),target:screen.querySelector('[data-game-target]'),best:screen.querySelector('[data-game-best]'),timer:screen.querySelector('[data-game-timer]'),shuffleLeft:screen.querySelector('[data-shuffle-left]'),resultTitle:screen.querySelector('[data-result-title]'),resultScore:screen.querySelector('[data-result-score]'),resultBest:screen.querySelector('[data-result-best]'),resultMission:screen.querySelector('[data-result-mission]'),resultPoints:screen.querySelector('[data-result-points]')};
  let stage=getStage(1), plushes=[], score=0, capturedByType={}, claw={x:stage.claw.homeX,z:stage.claw.homeZ}, stateName='idle', roundToken=0, startedAt=0, remaining=180, shuffleRemaining=15, timerHandle=0, completed=false, expiring=false;
  let joystickPointer=null, joystickRect=null, vector={x:0,z:0}, motion={x:0,z:0}, movementRaf=0, lastMoveAt=0, boundaryLatch='', shuffleHolding=false, shuffleRaf=0, shuffleLast=0, shuffleStepAt=0, attached=null, targetId='';

  function setCopy(){const t=c();screen.querySelectorAll('[data-copy-score]').forEach(n=>n.textContent=t.score);screen.querySelector('[data-copy-stage]').textContent=t.stage;screen.querySelector('[data-copy-min]').textContent=t.min;screen.querySelectorAll('[data-copy-high]').forEach(n=>n.textContent=t.high);screen.querySelectorAll('[data-copy-mission-result]').forEach(n=>n.textContent=t.missionResult);screen.querySelector('[data-copy-move]').textContent=t.move;screen.querySelector('[data-copy-shuffle]').textContent=t.shuffle;screen.querySelector('[data-copy-drop]').textContent=t.drop;screen.querySelector('[data-copy-time]').textContent=t.time;missionStrip?.setAttribute('aria-label',t.mission);const missionTitle=missionStrip?.querySelector('.lc-mission-title');if(missionTitle)missionTitle.textContent=t.mission;joystick.setAttribute('aria-label',t.move);}
  function missionTotal(){return Object.values(stage.mission||{}).reduce((sum,n)=>sum+(Number(n)||0),0);}
  function missionCaught(){return Object.entries(stage.mission||{}).reduce((sum,[type,need])=>sum+Math.min(Number(need)||0,Number(capturedByType[type])||0),0);}
  function missionComplete(){return Object.entries(stage.mission||{}).every(([type,need])=>(Number(capturedByType[type])||0)>=(Number(need)||0));}
  function clearConditionsMet(){return score>=stage.targetScore&&missionComplete();}
  function renderMissionStrip(){if(!missionStrip)return;missionStrip.replaceChildren();const title=document.createElement('span');title.className='lc-mission-title';title.textContent=c().mission;const grid=document.createElement('div');grid.className='lc-mission-grid';for(const type of stage.missionOrder||Object.keys(stage.mission||{})){const need=Number(stage.mission?.[type])||0;if(!need)continue;const item=document.createElement('div');item.className='lc-mission-item';item.dataset.missionType=type;const img=document.createElement('img');img.src=`./assets/plushies/gameplay/${PLUSH_TYPES[type].asset}_front.png?v=003.11`;img.alt='';img.draggable=false;const count=document.createElement('b');count.dataset.missionCount=type;item.append(img,count);grid.append(item);}missionStrip.append(title,grid);syncMission();}
  function syncMission(){if(!missionStrip)return;for(const item of missionStrip.querySelectorAll('[data-mission-type]')){const type=item.dataset.missionType,need=Number(stage.mission?.[type])||0,have=Number(capturedByType[type])||0;const shown=Math.min(have,need);item.classList.toggle('is-complete',need>0&&have>=need);const count=item.querySelector('[data-mission-count]');if(count)count.textContent=`${shown}/${need}`;}missionStrip.classList.toggle('is-complete',missionComplete());}
  function hud(){nodes.score.textContent=String(score);nodes.target.textContent=String(stage.targetScore);nodes.best.textContent=String(Math.max(Number(getState()?.highScoresByStage?.[stage.id])||0,score));nodes.timer.textContent=fmt(remaining);nodes.shuffleLeft.textContent=String(Math.ceil(shuffleRemaining));stageNode.classList.toggle('is-urgent',remaining<=30&&remaining>0);const locked=stateName!=='idle'||expiring;dropBtn.disabled=locked||shuffleHolding;shuffleBtn.disabled=locked||shuffleRemaining<=0;syncMission();}
  function setFeedback(text){feedback.textContent=text;feedback.classList.remove('is-showing');void feedback.offsetWidth;feedback.classList.add('is-showing');}
  function setShaft(v){stageNode.style.setProperty('--shaft-len',`${v}%`);}
  function nearest(){let best=null,d=Infinity;for(const p of plushes){if(p.captured)continue;const q=worldDistance(p,claw);if(q<d){best=p;d=q;}}return {plush:best,distance:d};}
  function syncTargetMarker(plush,strength=0){
    if(!targetMarker||!plush||!targetId){targetMarker?.classList.remove('is-active');return;}
    const projected=projectWorld(plush.x,plush.z);
    const scale=PLUSH_TYPES[plush.type].scale*projected.scale;
    targetMarker.style.left=`${projected.left}%`;
    targetMarker.style.top=`${projected.top-(plush.elevation||0)*100-4.8*scale}%`;
    targetMarker.style.width=`${clamp(9.4*scale,8.2,13.8)}%`;
    targetMarker.style.setProperty('--marker-strength',String(strength));
    targetMarker.classList.add('is-active');
  }
  function updateTargetHighlight(){
    const {plush,distance}=nearest();
    const next=plush && stateName==='idle' && !expiring && distance<stage.claw.grabRadius*1.32 ? plush.instanceId : '';
    const strength = plush ? clamp(1 - distance/(stage.claw.grabRadius*1.32), 0, 1) : 0;
    targetId=next;
    plushes.forEach(p=>{ if(!p.node) return; const active=p.instanceId===targetId; p.node.classList.toggle('is-targeted',active); p.node.style.setProperty('--target-strength', active ? String(strength) : '0'); });
    syncTargetMarker(next?plush:null,strength);
  }
  function syncClaw(){const p=projectClaw(claw.x,claw.z);stageNode.style.setProperty('--claw-left',`${p.left}%`);stageNode.style.setProperty('--claw-top',`${p.top}%`);stageNode.style.setProperty('--claw-scale',String(p.scale));stageNode.style.setProperty('--claw-bright',String(.962+claw.z*.058));clawNode.style.zIndex=String(p.zIndex);updateTargetHighlight();}
  function renderOne(plush){const p=projectWorld(plush.x,plush.z),type=PLUSH_TYPES[plush.type],e=plush.elevation||0;plush.node.style.left=`${p.left}%`;plush.node.style.top=`${p.top-e*100}%`;plush.node.style.zIndex=String(p.zIndex+Math.round(e*100));plush.node.style.setProperty('--rot',`${plush.rotation}deg`);plush.node.style.setProperty('--scale',String(type.scale*p.scale));plush.node.style.setProperty('--bright',String(.948+plush.z*.07+e*.18));plush.node.style.setProperty('--contact-alpha',String(clamp(.30-e*4.2,.13,.30)));plush.node.style.setProperty('--contact-soft',`${clamp(2+e*65,2,4.2)}px`);}
  function renderPlushes(){field.replaceChildren();plushes.forEach(plush=>{const n=document.createElement('div');n.className='lc-plush';n.dataset.plushId=plush.instanceId;const halo=document.createElement('span');halo.className='lc-plush__target';const img=document.createElement('img');img.src=plushSrc(plush);img.alt='';img.draggable=false;n.append(halo,img);plush.node=n;field.append(n);renderOne(plush);});updateTargetHighlight();}
  function computeDropShaft(target){
    if(!target?.node) return clamp(50+claw.z*10,10,69);
    const rigRect=clawNode.getBoundingClientRect();
    const headRect=clawNode.querySelector('.lc-claw-head')?.getBoundingClientRect();
    const plushRect=target.node.getBoundingClientRect();
    if(!rigRect.height||!headRect?.height||!plushRect.height) return clamp(50+claw.z*10,10,69);
    const current=parseFloat(getComputedStyle(stageNode).getPropertyValue('--shaft-len'))||.6;
    // Physical contact: align the visible finger tips with the upper-middle body of the selected plush.
    // The calculation uses rendered DOM geometry, so depth scaling and pose height are already included.
    const contactY=plushRect.top+plushRect.height*.44;
    const deltaPx=contactY-headRect.bottom;
    return clamp(current+(deltaPx/rigRect.height)*100,8,69);
  }

  function mountPayload(plush){
    if(!plush?.node||!payload)return;
    attached=plush;
    plush.node.classList.remove('is-airborne','is-falling','is-chute-fall','is-targeted');
    plush.node.classList.add('is-carried');
    plush.node.style.left='50%'; plush.node.style.top='50%';
    plush.node.style.width=`${176*PLUSH_TYPES[plush.type].scale}%`;
    plush.node.style.setProperty('--scale','1');
    plush.node.style.setProperty('--rot',`${(plush.rotation||0)*.14}deg`);
    payload.append(plush.node);
  }
  function unmountPayloadToField(plush){
    if(!plush?.node)return null;
    const nr=plush.node.getBoundingClientRect(), sr=stageNode.getBoundingClientRect();
    const left=((nr.left+nr.width/2-sr.left)/sr.width)*100;
    const top=((nr.top+nr.height*.79-sr.top)/sr.height)*100;
    const width=(nr.width/sr.width)*100;
    field.append(plush.node);
    plush.node.classList.remove('is-carried');
    plush.node.classList.add('is-airborne');
    plush.node.style.left=`${left}%`; plush.node.style.top=`${top}%`; plush.node.style.width=`${width}%`;
    plush.node.style.setProperty('--scale','1');
    plush.node.style.setProperty('--rot','0deg');
    attached=null;
    return {left,top,width};
  }

  function setJoystickVisual(dx,dy){joystick.style.setProperty('--joy-x',String(dx));joystick.style.setProperty('--joy-z',String(dy));}
  function updateVectorFromEvent(e){const r=joystickRect||joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=(e.clientX-cx)/(r.width*.35),dy=(e.clientY-cy)/(r.height*.34),m=Math.hypot(dx,dy);if(m<.12){vector={x:0,z:0};setJoystickVisual(0,0);return;}const q=Math.min(1,m);vector={x:dx/m*q,z:dy/m*q};setJoystickVisual(vector.x,vector.z);}
  function hardStopMovement(){if(movementRaf)cancelAnimationFrame(movementRaf);movementRaf=0;lastMoveAt=0;motion={x:0,z:0};vector={x:0,z:0};joystickRect=null;boundaryLatch='';setJoystickVisual(0,0);sfx.moveStop();}
  function movementLoop(now){
    if(stateName!=='idle'||expiring){hardStopMovement();return;}
    if(!lastMoveAt)lastMoveAt=now;
    const dt=Math.min(.032,Math.max(.001,(now-lastMoveAt)/1000));lastMoveAt=now;
    const response=1-Math.exp(-(Math.abs(vector.x)+Math.abs(vector.z)>.02?14:18)*dt);
    const tx=vector.x*stage.claw.speedX,tz=vector.z*stage.claw.speedZ;
    motion.x+=(tx-motion.x)*response;motion.z+=(tz-motion.z)*response;
    const speed=Math.hypot(motion.x,motion.z),input=Math.hypot(vector.x,vector.z);
    if(speed<.00045&&input<.02){motion={x:0,z:0};sfx.moveStop();movementRaf=0;lastMoveAt=0;boundaryLatch='';return;}
    if(speed>.002){sfx.moveStart(claw.z);sfx.movePitch(claw.z,clamp(speed/Math.max(stage.claw.speedX,stage.claw.speedZ),0,1));}
    const ox=claw.x,oz=claw.z;
    claw.x=clamp(claw.x+motion.x*dt,stage.claw.minX,stage.claw.maxX);claw.z=clamp(claw.z+motion.z*dt,stage.claw.minZ,stage.claw.maxZ);
    let hit='';
    if(claw.x===stage.claw.minX&&motion.x<0){hit='l';motion.x=0;}
    if(claw.x===stage.claw.maxX&&motion.x>0){hit='r';motion.x=0;}
    if(claw.z===stage.claw.minZ&&motion.z<0){hit='b';motion.z=0;}
    if(claw.z===stage.claw.maxZ&&motion.z>0){hit='f';motion.z=0;}
    if(hit&&hit!==boundaryLatch)sfx.endStop();boundaryLatch=hit||'';
    if(ox!==claw.x||oz!==claw.z)syncClaw();
    movementRaf=requestAnimationFrame(movementLoop);
  }
  function ensureMoveLoop(){if(!movementRaf)movementRaf=requestAnimationFrame(movementLoop);}
  function releaseJoystick(){joystickPointer=null;joystickRect=null;vector={x:0,z:0};setJoystickVisual(0,0);if(Math.hypot(motion.x,motion.z)>.00045)ensureMoveLoop();else{sfx.moveStop();lastMoveAt=0;boundaryLatch='';}}
  joystick.addEventListener('pointerdown',e=>{if(stateName!=='idle'||expiring)return;e.preventDefault();joystickPointer=e.pointerId;joystickRect=joystick.getBoundingClientRect();joystick.setPointerCapture?.(e.pointerId);updateVectorFromEvent(e);ensureMoveLoop();});
  joystick.addEventListener('pointermove',e=>{if(e.pointerId!==joystickPointer)return;updateVectorFromEvent(e);ensureMoveLoop();});
  joystick.addEventListener('pointerup',releaseJoystick);joystick.addEventListener('pointercancel',releaseJoystick);
  joystick.addEventListener('keydown',e=>{if(stateName!=='idle')return;const map={ArrowLeft:{x:-1,z:0},ArrowRight:{x:1,z:0},ArrowUp:{x:0,z:-1},ArrowDown:{x:0,z:1}};if(!map[e.key])return;e.preventDefault();vector=map[e.key];setJoystickVisual(vector.x,vector.z);ensureMoveLoop();});
  joystick.addEventListener('keyup',e=>{if(e.key.startsWith('Arrow'))releaseJoystick();});

  function contactPlush(plush,distance){if(!plush)return;plush.node.classList.add('is-contacted');stageNode.classList.add('is-contact-hit');setTimeout(()=>{plush.node?.classList.remove('is-contacted');stageNode.classList.remove('is-contact-hit');},220);const strength=clamp(1-distance/stage.claw.grabRadius,.25,1);sfx.contact(strength);}
  function attach(plush){mountPayload(plush);}
  async function animateClawTo(x,z,duration,token){const sx=claw.x,sz=claw.z,start=performance.now();return new Promise(resolve=>{const step=now=>{if(token!==roundToken){resolve();return;}const t=clamp((now-start)/duration,0,1),e=1-Math.pow(1-t,3);claw.x=sx+(x-sx)*e;claw.z=sz+(z-sz)*e;syncClaw();sfx.movePitch(claw.z,.75);if(t<1)requestAnimationFrame(step);else resolve();};sfx.moveStart(claw.z);requestAnimationFrame(step);});}
  async function fallBack(plush,token,late=false){
    if(!plush)return;
    unmountPayloadToField(plush);
    const p=projectWorld(plush.x,plush.z), type=PLUSH_TYPES[plush.type];
    const targetWidth=26.8*type.scale*p.scale;
    await new Promise(r=>requestAnimationFrame(()=>{requestAnimationFrame(()=>{
      plush.node.classList.add('is-falling');
      plush.node.style.left=`${p.left}%`; plush.node.style.top=`${p.top}%`; plush.node.style.width=`${targetWidth}%`;
      plush.node.style.setProperty('--rot',`${plush.rotation}deg`); r();
    });}));
    await sleep(late?560:450); if(token!==roundToken)return;
    sfx.plushImpact(late?.78:.48);
    plush.node.classList.remove('is-falling','is-airborne'); plush.node.style.width=''; renderOne(plush); updateTargetHighlight();
  }

  function forceInteractionRecovery(reason='runtime'){
    console.error('[Lucky Claw] interaction recovered:', reason);
    stopShuffle();
    releaseJoystick();
    chuteGlow.classList.remove('is-active');
    delivery.classList.remove('is-drop');
    if(attached?.node){
      try{
        if(attached.node.parentElement===payload) field.append(attached.node);
        attached.node.classList.remove('is-carried','is-airborne','is-falling','is-chute-fall','is-captured');
        attached.node.style.width='';
        attached.captured=false;
        renderOne(attached);
      }catch{}
    }
    payload?.replaceChildren();
    attached=null;
    setShaft(.6);
    stageNode.dataset.clawState='idle';
    stateName='idle';
    updateTargetHighlight();
    hud();
  }

  async function dropSequence(token){
    if(stateName!=='idle'||expiring)return;
    hardStopMovement();
    stateName='dropping';
    hud();
    try{
      sfx.dropRelay();
      stageNode.dataset.clawState='dropping';
      const aim=nearest();
      const {plush,distance}=aim;
      const targetElevation=plush&&distance<stage.claw.grabRadius*1.22?(plush.elevation||0):0;
      const shaftTarget=plush ? computeDropShaft(plush) : clamp(50+claw.z*10-targetElevation*20,10,69);
      setShaft(shaftTarget);
      sfx.shaft(true,.82);
      await sleep(860); if(token!==roundToken)return;

      stageNode.dataset.clawState='contact';
      if(plush&&distance<stage.claw.grabRadius*1.1) contactPlush(plush,distance); else {sfx.contact(.28);}
      await sleep(160); if(token!==roundToken)return;

      stageNode.dataset.clawState='closing';
      sfx.clawClose();
      await sleep(320); if(token!==roundToken)return;

      const outcome=chooseGrabOutcome({plush,claw,grabRadius:stage.claw.grabRadius});
      stageNode.dataset.clawState='lifting';
      setShaft(.6);
      sfx.shaft(false,.92,outcome!=='miss');
      if(outcome!=='miss'&&plush){attach(plush);sfx.catch();}
      await sleep(outcome==='early-slip'?420:920); if(token!==roundToken)return;

      if(outcome==='miss'||!plush){setFeedback(c().miss);await resetClaw(token);return;}
      if(outcome==='early-slip'){sfx.slip(false);setFeedback(c().earlySlip);await fallBack(plush,token,false);await resetClaw(token);return;}

      stageNode.dataset.clawState='carrying';
      if(outcome==='late-slip'){
        const tx=clamp((claw.x+stage.chute.x)/2,stage.claw.minX,stage.claw.maxX),tz=clamp(claw.z+.12,stage.claw.minZ,stage.claw.maxZ);
        await animateClawTo(tx,tz,620,token); sfx.moveStop(); if(token!==roundToken)return;
        sfx.slip(true); setFeedback(c().lateSlip); await fallBack(plush,token,true); await resetClaw(token); return;
      }

      setFeedback(c().grip);
      await animateClawTo(stage.chute.x,stage.chute.z,900,token); sfx.moveStop(); if(token!==roundToken)return;
      stageNode.dataset.clawState='releasing';
      chuteGlow.classList.add('is-active');
      setShaft(21.5); sfx.shaft(true,.38,true);
      await sleep(370); if(token!==roundToken)return;

      unmountPayloadToField(plush);
      plush.node.classList.add('is-falling','is-chute-fall'); void plush.node.offsetWidth;
      plush.node.style.left='14.9%'; plush.node.style.top='61.8%'; plush.node.style.width=`${29*PLUSH_TYPES[plush.type].scale}%`;
      plush.node.style.setProperty('--rot','6deg');
      sfx.chuteTravel();
      await sleep(660); if(token!==roundToken)return;
      plush.node.classList.add('is-captured'); plush.captured=true; chuteGlow.classList.remove('is-active');
      const di=delivery.querySelector('img'); di.src=plushSrc(plush); delivery.classList.remove('is-drop'); void delivery.offsetWidth; delivery.classList.add('is-drop'); sfx.prizeBay();
      await sleep(560); if(token!==roundToken)return;

      const value=PLUSH_TYPES[plush.type].value;
      score+=value;capturedByType[plush.type]=(Number(capturedByType[plush.type])||0)+1;
      persistState(applyCaptureProgress(getState(),plush.type));sfx.score();setFeedback(`+${value}`);hud();
      const clearedNow=clearConditionsMet();
      await sleep(440);delivery.classList.remove('is-drop');await resetClaw(token);
      if(clearedNow&&token===roundToken&&!completed){await sleep(180);finishRound();}
    }catch(error){
      console.error('[Lucky Claw] DROP sequence failed.',error);
      if(token===roundToken) forceInteractionRecovery(error?.message||'drop failure');
    }
  }

  async function resetClaw(token){stageNode.dataset.clawState='resetting';setShaft(.6);await sleep(380);if(token!==roundToken)return;await animateClawTo(stage.claw.homeX,stage.claw.homeZ,540,token);sfx.moveStop();if(token!==roundToken)return;stageNode.dataset.clawState='idle';stateName='idle';updateTargetHighlight();hud();if(expiring)finishRound();}
  function shuffleFrame(now){if(!shuffleHolding||stateName!=='idle'||shuffleRemaining<=0||expiring){stopShuffle();return;}if(!shuffleLast)shuffleLast=now;const dt=Math.min(.05,(now-shuffleLast)/1000);shuffleLast=now;shuffleRemaining=Math.max(0,shuffleRemaining-dt);agitator.classList.add('is-active');shuffleBtn.classList.add('is-active');if(!shuffleStepAt||now-shuffleStepAt>90){shuffleStepAt=now;const active=plushes.filter(p=>!p.captured);active.forEach((p,i)=>Object.assign(p,shufflePlush(p,{now,index:i,bounds:stage.pileBounds,intensity:.97})));settlePile(active,stage.pileBounds,2);active.forEach(renderOne);updateTargetHighlight();}hud();shuffleRaf=requestAnimationFrame(shuffleFrame);}
  function startShuffle(e){if(stateName!=='idle'||expiring||shuffleRemaining<=0)return;e?.preventDefault?.();try{if(e?.pointerId!=null)shuffleBtn.setPointerCapture?.(e.pointerId);}catch{}shuffleHolding=true;shuffleLast=0;shuffleStepAt=0;hud();sfx.button(false);sfx.shuffleStart();if(shuffleRaf)cancelAnimationFrame(shuffleRaf);shuffleRaf=requestAnimationFrame(shuffleFrame);}
  function stopShuffle(){shuffleHolding=false;if(shuffleRaf)cancelAnimationFrame(shuffleRaf);shuffleRaf=0;shuffleLast=0;agitator.classList.remove('is-active');shuffleBtn.classList.remove('is-active');sfx.shuffleStop();hud();}
  shuffleBtn.addEventListener('pointerdown',startShuffle);['pointerup','pointercancel','lostpointercapture'].forEach(ev=>shuffleBtn.addEventListener(ev,stopShuffle));window.addEventListener('pointerup',stopShuffle,{passive:true});window.addEventListener('pointercancel',stopShuffle,{passive:true});
  dropBtn.addEventListener('click',()=>void dropSequence(roundToken));

  function tick(token){if(token!==roundToken||completed)return;const prev=Math.ceil(remaining);remaining=Math.max(0,stage.durationSeconds-(performance.now()-startedAt)/1000);const cur=Math.ceil(remaining);if(cur!==prev&&cur<=5&&cur>0)sfx.countdown();music?.setUrgency?.(remaining);hud();if(remaining<=0){clearInterval(timerHandle);timerHandle=0;expiring=true;stopShuffle();hardStopMovement();hud();if(stateName==='idle')finishRound();}}
  function finishRound(){if(completed)return;completed=true;stateName='finished';stopShuffle();hardStopMovement();clearInterval(timerHandle);timerHandle=0;const objectivesMet=missionComplete();const rr=applyRoundResult(getState(),{stageId:stage.id,score,targetScore:stage.targetScore,objectivesMet});persistState(rr.state);music?.unlockTrackAfterRound?.({applyQueued:true});music?.resetUrgency?.();nodes.resultTitle.textContent=`${rr.clear?c().clear:c().fail}${rr.newBest>rr.oldBest?` · ${c().newBest}`:''}`;nodes.resultScore.textContent=String(score);nodes.resultBest.textContent=String(rr.newBest);if(nodes.resultMission)nodes.resultMission.textContent=`${missionCaught()}/${missionTotal()}`;nodes.resultPoints.textContent=String(Number(getState()?.points)||0);result.hidden=false;rr.clear?sfx.clear():sfx.fail();}

  function resetRound(stageId=1,durationOverride=null){roundToken+=1;stage={...getStage(stageId)};if(Number.isFinite(durationOverride)&&durationOverride>0)stage.durationSeconds=durationOverride;plushes=stage.plushes.map(p=>({...p,captured:false,node:null}));score=0;capturedByType=Object.fromEntries((stage.missionOrder||Object.keys(stage.mission||{})).map(type=>[type,0]));remaining=stage.durationSeconds;shuffleRemaining=stage.shuffleSeconds;claw={x:stage.claw.homeX,z:stage.claw.homeZ};stateName='idle';completed=false;expiring=false;attached=null;targetId='';result.hidden=true;delivery.classList.remove('is-drop');stageNode.dataset.clawState='idle';payload?.replaceChildren();hardStopMovement();setShaft(.6);renderPlushes();renderMissionStrip();setCopy();syncClaw();hud();}
  function startStage(stageId=1,options={}){stop(false);resetRound(stageId,options.durationSeconds||null);music?.lockTrackForRound?.();startedAt=performance.now();timerHandle=setInterval(()=>tick(roundToken),200);tick(roundToken);}
  function stop(unlock=true){roundToken+=1;clearInterval(timerHandle);timerHandle=0;stopShuffle();hardStopMovement();payload?.replaceChildren();attached=null;targetId='';targetMarker?.classList.remove('is-active');if(unlock){music?.unlockTrackAfterRound?.({applyQueued:true});music?.resetUrgency?.();}}
  function refreshLanguage(){setCopy();}
  screen.querySelector('[data-game-menu]').addEventListener('click',()=>{stop(true);onMenu?.();});screen.querySelector('[data-result-menu]').addEventListener('click',()=>{stop(true);onMenu?.();});screen.querySelector('[data-result-replay]').addEventListener('click',()=>startStage(stage.id));
  return {startStage,stop,refreshLanguage};
}
