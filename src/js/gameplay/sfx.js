function clamp(v,min,max){return Math.min(max,Math.max(min,v));}
export class ArcadeSfx{
  constructor(getSettings=()=>({})){this.getSettings=getSettings;this.context=null;this.moveNodes=null;this.shuffleNodes=null;}
  enabled(){return this.getSettings()?.sfx!==false;}
  ensureContext(){if(!this.enabled())return null;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!this.context)this.context=new C({latencyHint:'interactive'});if(this.context.state==='suspended')void this.context.resume();return this.context;}
  haptic(pattern=10){if(this.getSettings()?.haptics===false)return;try{navigator.vibrate?.(pattern);}catch{}}
  tone({frequency=440,endFrequency=frequency,duration=.08,volume=.03,type='sine',delay=0}){const c=this.ensureContext();if(!c)return;const s=c.currentTime+delay,e=s+duration,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(35,frequency),s);o.frequency.exponentialRampToValueAtTime(Math.max(35,endFrequency),e);g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(clamp(volume,.001,.14),s+Math.min(.018,duration*.25));g.gain.exponentialRampToValueAtTime(.0001,e);o.connect(g).connect(c.destination);o.start(s);o.stop(e+.02);}
  noise({duration=.08,volume=.018,delay=0,highpass=500}){const c=this.ensureContext();if(!c)return;const n=Math.max(1,Math.floor(c.sampleRate*duration)),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();f.type='highpass';f.frequency.value=highpass;g.gain.value=volume;s.buffer=b;s.connect(f).connect(g).connect(c.destination);s.start(c.currentTime+delay);}
  button(primary=false){this.tone({frequency:primary?320:245,endFrequency:primary?500:345,duration:.065,volume:.032,type:'triangle'});this.noise({duration:.028,volume:.009,highpass:2100});this.haptic(primary?16:8);}
  moveStart(depth=.4){if(this.moveNodes||!this.enabled())return;const c=this.ensureContext();if(!c)return;const o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o2.type='triangle';o.frequency.value=92+depth*18;o2.frequency.value=184+depth*26;f.type='lowpass';f.frequency.value=780;g.gain.value=.0001;o.connect(f);o2.connect(f);f.connect(g).connect(c.destination);o.start();o2.start();g.gain.exponentialRampToValueAtTime(.014,c.currentTime+.06);this.moveNodes={o,o2,g};}
  movePitch(depth=.4,speed=1){const c=this.context,n=this.moveNodes;if(!c||!n)return;n.o.frequency.setTargetAtTime(88+depth*20+speed*10,c.currentTime,.035);n.o2.frequency.setTargetAtTime(176+depth*30+speed*18,c.currentTime,.035);}
  moveStop(){const c=this.context,n=this.moveNodes;if(!c||!n)return;this.moveNodes=null;n.g.gain.setTargetAtTime(.0001,c.currentTime,.035);setTimeout(()=>{try{n.o.stop();n.o2.stop();}catch{}},180);}
  endStop(){this.tone({frequency:185,endFrequency:138,duration:.07,volume:.026,type:'square'});this.noise({duration:.04,volume:.014,highpass:900});this.haptic(7);}
  dropRelay(){this.button(true);this.tone({frequency:120,endFrequency:104,duration:.12,volume:.018,type:'square',delay:.04});}
  shaft(desc=true,duration=.7,loaded=false){this.tone({frequency:desc?112:(loaded?128:142),endFrequency:desc?88:(loaded?156:178),duration,volume:loaded?.024:.019,type:'sawtooth'});this.tone({frequency:desc?226:276,endFrequency:desc?182:330,duration,volume:.008,type:'triangle'});}
  contact(strength=.7){this.noise({duration:.065,volume:.011+.009*strength,highpass:520});this.tone({frequency:148,endFrequency:118,duration:.055,volume:.016,type:'triangle'});this.haptic(strength>.75?[7,16,6]:7);}
  clawClose(){this.tone({frequency:690,endFrequency:410,duration:.082,volume:.036,type:'square'});this.noise({duration:.048,volume:.016,highpass:1250});this.haptic([9,18,10]);}
  catch(){this.tone({frequency:360,endFrequency:515,duration:.105,volume:.028,type:'triangle'});}
  slip(late=false){this.tone({frequency:late?310:270,endFrequency:108,duration:late?.23:.16,volume:.03,type:'triangle'});this.noise({duration:.1,volume:.01,highpass:650});}
  plushImpact(height=.5){this.noise({duration:.11,volume:.015+.012*height,highpass:250});this.tone({frequency:118,endFrequency:74,duration:.1,volume:.018,type:'sine'});}
  chuteTravel(){this.noise({duration:.26,volume:.012,highpass:320});this.tone({frequency:154,endFrequency:90,duration:.28,volume:.017,type:'sine'});}
  prizeBay(){this.plushImpact(.85);this.haptic(22);}
  score(){this.tone({frequency:520,endFrequency:740,duration:.10,volume:.032,type:'triangle'});this.tone({frequency:740,endFrequency:930,duration:.12,volume:.028,type:'triangle',delay:.08});}
  countdown(){this.tone({frequency:640,duration:.05,volume:.02,type:'square'});}
  shuffleStart(){if(this.shuffleNodes||!this.enabled())return;const c=this.ensureContext();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type='sawtooth';o.frequency.value=78;g.gain.value=.0001;o.connect(g).connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.012,c.currentTime+.06);this.shuffleNodes={o,g};}
  shuffleStop(){const c=this.context,n=this.shuffleNodes;if(!c||!n)return;this.shuffleNodes=null;n.g.gain.setTargetAtTime(.0001,c.currentTime,.05);setTimeout(()=>{try{n.o.stop();}catch{}},180);}
  clear(){[523,659,784,1047].forEach((f,i)=>this.tone({frequency:f,endFrequency:f*1.01,duration:.18,volume:.033,type:'triangle',delay:i*.095}));this.haptic([22,32,22]);}
  fail(){this.tone({frequency:330,endFrequency:220,duration:.23,volume:.026,type:'triangle'});this.tone({frequency:246,endFrequency:165,duration:.28,volume:.022,type:'triangle',delay:.14});}
}
