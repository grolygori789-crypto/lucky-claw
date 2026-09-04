const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const ROOT='./assets/audio/sfx/';

const ASSETS=Object.freeze({
  rail:'rail-motor-loop.wav',
  endStop:'end-stop.wav',
  dropRelay:'drop-relay.wav',
  shaftDown:'shaft-down.wav',
  shaftUp:'shaft-up-loaded.wav',
  contact:'plush-contact.wav',
  clawClose:'claw-close.wav',
  grip:'grip-lock.wav',
  slip:'slip.wav',
  impact:'plush-impact.wav',
  shuffle:'shuffle-loop.wav',
  chute:'chute-travel.wav',
  prize:'prize-thump.wav',
  score:'score-chime.wav',
  countdown:'countdown.wav',
  clear:'stage-clear.wav',
  fail:'time-up.wav',
});

const VOLUME=Object.freeze({
  rail:.22,endStop:.52,dropRelay:.46,shaftDown:.34,shaftUp:.38,contact:.42,
  clawClose:.48,grip:.46,slip:.38,impact:.40,shuffle:.29,chute:.36,prize:.50,
  score:.40,countdown:.29,clear:.46,fail:.38,
});

function makeAudio(name,{loop=false}={}){
  const audio=new Audio(`${ROOT}${ASSETS[name]}?v=003.09`);
  audio.preload='auto';
  audio.playsInline=true;
  audio.loop=loop;
  return audio;
}

export class ArcadeSfx {
  constructor(getSettings=()=>({})){
    this.getSettings=getSettings;
    this.loopers={
      rail:makeAudio('rail',{loop:true}),
      shuffle:makeAudio('shuffle',{loop:true}),
    };
    this.pools=new Map();
    this.poolCursor=new Map();
    this.fadeFrames=new Map();
    this.loopActive=new Set();
    this.unlocked=false;
    // Pre-create one media element for each one-shot so the first DROP/contact
    // does not wait for a cold asset decode on mobile. The entire SFX set is
    // deliberately small and remains network-only in the service worker.
    for(const name of Object.keys(ASSETS)){
      if(name==='rail'||name==='shuffle')continue;
      this.pool(name,1);
    }
    this.unlockBound=()=>this.unlock();
    document.addEventListener('pointerdown',this.unlockBound,{capture:true,once:true});
    document.addEventListener('keydown',this.unlockBound,{capture:true,once:true});
  }

  enabled(){return this.getSettings?.()?.sfx!==false;}
  hapticsEnabled(){return this.getSettings?.()?.haptics!==false;}

  unlock(){
    if(this.unlocked)return;
    this.unlocked=true;
    // A muted, gesture-driven play unlocks HTMLMediaElement playback on stricter mobile browsers.
    const probe=makeAudio('dropRelay');
    probe.muted=true; probe.volume=0;
    const p=probe.play();
    if(p?.then)p.then(()=>{probe.pause();probe.currentTime=0;}).catch(()=>{});
  }

  vibrate(pattern){if(this.hapticsEnabled()&&navigator.vibrate){try{navigator.vibrate(pattern);}catch{}}}

  pool(name,size=3){
    if(this.pools.has(name))return this.pools.get(name);
    const items=Array.from({length:size},()=>makeAudio(name));
    this.pools.set(name,items);this.poolCursor.set(name,0);return items;
  }

  play(name,{volume=VOLUME[name]??.35,rate=1}={}){
    if(!this.enabled()||!ASSETS[name])return;
    const items=this.pool(name);
    const cursor=this.poolCursor.get(name)||0;
    const audio=items[cursor%items.length];
    this.poolCursor.set(name,(cursor+1)%items.length);
    try{
      audio.pause();audio.currentTime=0;audio.volume=clamp(volume,0,1);audio.playbackRate=clamp(rate,.72,1.45);
      const promise=audio.play();if(promise?.catch)promise.catch(()=>{});
    }catch{}
  }

  startLoop(name,{volume=VOLUME[name]??.25,rate=1}={}){
    if(!this.enabled())return;
    const audio=this.loopers[name];if(!audio)return;
    const safeRate=clamp(rate,.75,1.4),safeVolume=clamp(volume,0,1);
    try{
      audio.playbackRate=safeRate;
      // movementLoop calls this every animation frame. Never restart a fade or
      // media play request while the loop is already running; that creates
      // audible pumping and main-thread churn on mobile browsers.
      if(this.loopActive.has(name)&&!audio.paused)return;
      this.loopActive.add(name);
      const old=this.fadeFrames.get(name);if(old)cancelAnimationFrame(old);
      this.fadeFrames.delete(name);
      audio.volume=Math.min(audio.volume||0,.01);
      if(audio.paused){const p=audio.play();if(p?.catch)p.catch(()=>{this.loopActive.delete(name);});}
      this.fade(name,safeVolume,90);
    }catch{this.loopActive.delete(name);}
  }

  fade(name,target,duration=90,{pauseAtEnd=false}={}){
    const audio=this.loopers[name];if(!audio)return;
    const old=this.fadeFrames.get(name);if(old)cancelAnimationFrame(old);
    const from=Number(audio.volume)||0,start=performance.now();
    const step=(now)=>{
      const t=clamp((now-start)/duration,0,1);audio.volume=from+(target-from)*(1-Math.pow(1-t,2));
      if(t<1)this.fadeFrames.set(name,requestAnimationFrame(step));
      else{this.fadeFrames.delete(name);if(pauseAtEnd&&target<=.001){audio.pause();audio.currentTime=0;}}
    };
    this.fadeFrames.set(name,requestAnimationFrame(step));
  }

  stopLoop(name,duration=90){const audio=this.loopers[name];if(!audio)return;if(!this.loopActive.has(name)&&audio.paused)return;this.loopActive.delete(name);this.fade(name,0,duration,{pauseAtEnd:true});}
  stopAll(){this.stopLoop('rail',55);this.stopLoop('shuffle',70);}

  moveStart(z=0){this.startLoop('rail',{rate:.94+clamp(z,0,1)*.08});}
  movePitch(z=0,intensity=1){const a=this.loopers.rail;if(!a||a.paused)return;a.playbackRate=clamp(.91+z*.08+intensity*.045,.88,1.12);}
  moveStop(){this.stopLoop('rail',85);}
  shuffleStart(){this.startLoop('shuffle',{volume:VOLUME.shuffle});this.vibrate(12);}
  shuffleStop(){this.stopLoop('shuffle',110);}
  button(strong=true){this.play('dropRelay',{volume:strong?.36:.27,rate:strong?1:1.08});}
  endStop(){this.play('endStop');this.vibrate(8);}
  dropRelay(){this.play('dropRelay');this.vibrate(8);}
  shaft(down=true,power=.7,loaded=false){this.play(down?'shaftDown':'shaftUp',{volume:(down?VOLUME.shaftDown:VOLUME.shaftUp)*(loaded?1.08:1),rate:clamp(.94+power*.08,.92,1.08)});}
  contact(strength=.5){this.play('contact',{volume:VOLUME.contact*(.72+clamp(strength,0,1)*.38)});this.vibrate([9,12,9]);}
  clawClose(){this.play('clawClose');}
  catch(){this.play('grip');this.vibrate(16);}
  slip(late=false){this.play('slip',{volume:late?.43:.36,rate:late?.92:1.05});}
  plushImpact(strength=.5){this.play('impact',{volume:VOLUME.impact*(.72+clamp(strength,0,1)*.42)});this.vibrate(10);}
  chuteTravel(){this.play('chute');}
  prizeBay(){this.play('prize');this.vibrate([14,18,12]);}
  score(){this.play('score');}
  countdown(){this.play('countdown');}
  clear(){this.play('clear');this.vibrate([20,38,20]);}
  fail(){this.play('fail');}
}
