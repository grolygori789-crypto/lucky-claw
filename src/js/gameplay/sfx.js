const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

export class ArcadeSfx {
  constructor(getSettings=()=>({})){
    this.getSettings=getSettings;
    this.ctx=null;
    this.moveOsc=null;
    this.moveGain=null;
    this.shuffleOsc=null;
    this.shuffleGain=null;
  }
  enabled(){ const s=this.getSettings?.()||{}; return s.soundEffects !== false && s.sfx !== false && s.sound !== false; }
  haptics(){ const s=this.getSettings?.()||{}; return s.haptics !== false && s.vibration !== false; }
  ensure(){ if(!this.enabled()) return null; if(!this.ctx){ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null; this.ctx=new AC(); } if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{}); return this.ctx; }
  vibrate(pattern){ if(this.haptics() && navigator.vibrate) navigator.vibrate(pattern); }
  tone({freq=440,duration=.08,type='sine',gain=.04,slideTo=null,delay=0}={}){
    const ctx=this.ensure(); if(!ctx) return;
    const t=ctx.currentTime + delay;
    const osc=ctx.createOscillator(); const g=ctx.createGain();
    osc.type=type; osc.frequency.setValueAtTime(freq,t);
    if(slideTo) osc.frequency.linearRampToValueAtTime(slideTo,t+duration);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+0.008);
    g.gain.exponentialRampToValueAtTime(0.0001,t+duration);
    osc.connect(g).connect(ctx.destination); osc.start(t); osc.stop(t+duration+.02);
  }
  noise({duration=.06,gain=.024,highpass=650,delay=0}={}){
    const ctx=this.ensure(); if(!ctx) return;
    const buffer=ctx.createBuffer(1,Math.max(1,Math.floor(ctx.sampleRate*duration)),ctx.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*(1-i/data.length);
    const src=ctx.createBufferSource(); src.buffer=buffer;
    const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=highpass;
    const g=ctx.createGain(); const t=ctx.currentTime+delay;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+0.004);
    g.gain.exponentialRampToValueAtTime(0.0001,t+duration);
    src.connect(hp).connect(g).connect(ctx.destination); src.start(t); src.stop(t+duration+.02);
  }
  moveStart(z=0){ const ctx=this.ensure(); if(!ctx || this.moveOsc) return; const osc=ctx.createOscillator(); const g=ctx.createGain(); osc.type='triangle'; osc.frequency.value=135+z*24; g.gain.value=0.0001; osc.connect(g).connect(ctx.destination); osc.start(); g.gain.exponentialRampToValueAtTime(0.018,ctx.currentTime+.04); this.moveOsc=osc; this.moveGain=g; }
  movePitch(z=0,intensity=1){ if(!this.moveOsc||!this.ctx) return; const now=this.ctx.currentTime; this.moveOsc.frequency.setTargetAtTime(128+z*28+intensity*18,now,.03); this.moveGain.gain.setTargetAtTime(clamp(0.012+intensity*0.012,.012,.03),now,.04); }
  moveStop(){ if(!this.moveOsc||!this.ctx) return; const now=this.ctx.currentTime; this.moveGain.gain.cancelScheduledValues(now); this.moveGain.gain.setTargetAtTime(0.0001,now,.035); const osc=this.moveOsc; this.moveOsc=null; this.moveGain=null; setTimeout(()=>{try{osc.stop();}catch{}},90); }
  shuffleStart(){ const ctx=this.ensure(); if(!ctx || this.shuffleOsc) return; const osc=ctx.createOscillator(); const g=ctx.createGain(); osc.type='sawtooth'; osc.frequency.value=54; g.gain.value=0.0001; osc.connect(g).connect(ctx.destination); osc.start(); g.gain.exponentialRampToValueAtTime(0.014,ctx.currentTime+.05); this.shuffleOsc=osc; this.shuffleGain=g; this.noise({duration:.08,gain:.018,highpass:480}); }
  shuffleStop(){ if(!this.shuffleOsc||!this.ctx) return; const now=this.ctx.currentTime; this.shuffleGain.gain.setTargetAtTime(0.0001,now,.04); const osc=this.shuffleOsc; this.shuffleOsc=null; this.shuffleGain=null; setTimeout(()=>{try{osc.stop();}catch{}},120); }
  button(strong=true){ this.tone({freq:strong?540:470,duration:.06,type:'sine',gain:0.03,slideTo:strong?610:520}); }
  endStop(){ this.tone({freq:210,duration:.07,type:'square',gain:.024,slideTo:170}); this.noise({duration:.03,gain:.016,highpass:900}); }
  dropRelay(){ this.button(true); this.tone({freq:300,duration:.05,type:'square',gain:.022,delay:.03}); }
  shaft(down=true,power=.7,loaded=false){ this.tone({freq:down?170:150,duration:down?.34:.46,type:'triangle',gain:loaded?.032:.026,slideTo:(down?132:195)+(loaded?0:10)}); if(loaded) this.noise({duration:.08,gain:.012,highpass:420,delay:.07}); }
  contact(strength=.5){ this.noise({duration:.05,gain:0.014+strength*0.012,highpass:520}); this.tone({freq:230+strength*60,duration:.05,type:'sine',gain:.018}); this.vibrate([10,12,10]); }
  clawClose(){ this.tone({freq:680,duration:.08,type:'square',gain:.018,slideTo:430}); this.noise({duration:.04,gain:.012,highpass:1200,delay:.015}); }
  catch(){ this.tone({freq:520,duration:.09,type:'triangle',gain:.026,slideTo:640}); this.vibrate(16); }
  slip(late=false){ this.tone({freq:late?400:460,duration:.12,type:'sawtooth',gain:.022,slideTo:late?220:260}); this.noise({duration:.06,gain:.014,highpass:700}); }
  plushImpact(strength=.5){ this.noise({duration:.05,gain:.010+strength*0.01,highpass:420}); this.tone({freq:150,duration:.06,type:'sine',gain:.014,slideTo:120}); this.vibrate(10); }
  chuteTravel(){ this.tone({freq:320,duration:.11,type:'triangle',gain:.02,slideTo:480}); this.noise({duration:.11,gain:.012,highpass:680}); }
  prizeBay(){ this.noise({duration:.07,gain:.012,highpass:500}); this.tone({freq:220,duration:.08,type:'square',gain:.016}); this.tone({freq:160,duration:.07,type:'sine',gain:.014,delay:.06}); this.vibrate([14,18,12]); }
  score(){ this.tone({freq:640,duration:.09,type:'triangle',gain:.03,slideTo:820}); this.tone({freq:820,duration:.12,type:'triangle',gain:.026,delay:.06,slideTo:980}); }
  countdown(){ this.tone({freq:520,duration:.05,type:'square',gain:.02}); }
  clear(){ this.tone({freq:660,duration:.14,type:'triangle',gain:.03,slideTo:920}); this.tone({freq:880,duration:.16,type:'triangle',gain:.026,delay:.08,slideTo:1180}); this.vibrate([20,40,20]); }
  fail(){ this.tone({freq:280,duration:.14,type:'sawtooth',gain:.024,slideTo:180}); }
}
