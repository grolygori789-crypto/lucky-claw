const CONTENT=Object.freeze({
  en:{
    title:'How to Play',
    goal:'Clear the stage',
    goalBody:'Stage 1 lasts 3:00. To clear it, reach the minimum score AND complete every plush mission shown below the HUD. The stage ends as soon as both conditions are complete.',
    controls:'Aim the claw',
    joystick:'Hold the joystick in any of 4 directions. The claw keeps moving while you hold it and stops at the cabinet limits. Front/back movement changes perspective just like a real cabinet.',
    target:'The plush currently under the grab zone receives a premium gold highlight and a small target cue. This shows which plush the claw is most likely to contact if you press DROP.',
    dropTitle:'DROP & grip',
    drop:'Press DROP once you are lined up. The shaft descends to the selected plush, the claw closes, lifts and carries automatically. A centered grab is more secure; an off-center grab can slip during the lift or travel.',
    shuffleTitle:'SHUFFLE',
    shuffle:'Hold SHUFFLE to run the floor agitator. Stage 1 gives 15 seconds of total shuffle time. Plushies move, rotate and settle within the physical pile; release the button to stop.',
    missionTitle:'Stage 1 mission',
    mission:'Collect at least 1 of each plush type: Signature Shih Tzu, Black Shih Tzu, Red Bear, Yellow Chick and White Bunny. The mission strip updates immediately and shows what is still missing.',
    scoringTitle:'Score, Claw Points & High Score',
    scoring:'Stage Score decides whether you reach the stage target. Claw Points are a separate long-term currency/reward value. High Score stores your best Stage 1 score on this device.',
    timerTitle:'Last 30 seconds',
    timer:'During the final 30 seconds, the current song gradually speeds up while preserving pitch and the ruby timer becomes more urgent. The song itself is not replaced when you enter the stage.',
    prizeTitle:'Winning a plush',
    prize:'A secure plush stays locked in the claw until it reaches the prize chute. It can still slip if the grip is weak. A successful prize is released into the chute and appears at PRIZE OUT before score and mission progress are awarded.',
    close:'Got it'
  },
  th:{
    title:'วิธีเล่น',
    goal:'เงื่อนไขผ่านด่าน',
    goalBody:'Stage 1 มีเวลา 3:00 นาที การผ่านด่านต้องทำให้ครบทั้ง 2 เงื่อนไข คือ คะแนนถึง Min Score และเก็บตุ๊กตาครบตามภารกิจทุกชนิดที่แสดงใต้ HUD เมื่อครบทั้งสองอย่าง ด่านจะจบทันที',
    controls:'การเล็งหัวคีบ',
    joystick:'กดคันโยกค้างได้ 4 ทิศ หัวคีบจะเคลื่อนต่อเนื่องตราบใดที่ยังกดอยู่ และหยุดเมื่อถึงขอบตู้ การเลื่อนไปด้านหน้า-ด้านหลังมีผลต่อมุมมองและขนาดตามระยะเหมือนตู้จริง',
    target:'ตุ๊กตาที่อยู่ในระยะคีบปัจจุบันจะมีแสงทองและสัญลักษณ์เป้าหมายขนาดเล็ก เพื่อบอกว่าหากกด DROP ตอนนี้ หัวคีบมีแนวโน้มจะสัมผัสตัวใด',
    dropTitle:'DROP และการจับ',
    drop:'เมื่อเล็งได้ตำแหน่งแล้วกด DROP หนึ่งครั้ง ก้านจะหย่อนลงถึงตุ๊กตาเป้าหมาย ปากคีบหุบ ยก และพาไปยังช่องปล่อยอัตโนมัติ การคีบตรงศูนย์กลางจะมั่นคงกว่า ส่วนการคีบเยื้องอาจลื่นหลุดระหว่างยกหรือเคลื่อนที่ได้',
    shuffleTitle:'SHUFFLE',
    shuffle:'กด SHUFFLE ค้างเพื่อเปิดกลไกคนตุ๊กตาใต้กอง Stage 1 มีเวลา Shuffle รวม 15 วินาที ตุ๊กตาจะขยับ หมุน เบียด และตกลงตามช่องว่างภายในขอบเขตจริง ปล่อยปุ่มเพื่อหยุด',
    missionTitle:'ภารกิจ Stage 1',
    mission:'ต้องเก็บอย่างน้อยชนิดละ 1 ตัว ได้แก่ ชิสุ Signature, ชิสุสีดำ, หมีแดง, ลูกเจี๊ยบเหลือง และกระต่ายขาว แถบ Mission จะอัปเดตทันทีหลังคีบสำเร็จและบอกว่าชนิดใดยังขาดอยู่',
    scoringTitle:'Score, Claw Points และ High Score',
    scoring:'Stage Score ใช้ตรวจว่าแตะ Min Score หรือยัง ส่วน Claw Points เป็นคะแนนสะสมระยะยาวแยกต่างหาก และ High Score จะบันทึกคะแนน Stage 1 ที่ดีที่สุดไว้ในอุปกรณ์เครื่องนี้',
    timerTitle:'30 วินาทีสุดท้าย',
    timer:'เมื่อเหลือ 30 วินาที เพลงที่กำลังเล่นจะค่อยๆ เร่งจังหวะขึ้นโดยรักษาระดับเสียงร้องและคีย์ไว้ พร้อมกับจอเวลาสี Ruby ที่เร่งอารมณ์มากขึ้น เพลงจะไม่ถูกเปลี่ยนทันทีเพียงเพราะเข้า Stage',
    prizeTitle:'เมื่อคีบตุ๊กตาสำเร็จ',
    prize:'ถ้าจับได้มั่นคง ปากคีบจะล็อกตุ๊กตาไว้จนถึงช่องปล่อย แต่ยังมีโอกาสลื่นหลุดได้หากตำแหน่งจับไม่ดี เมื่อสำเร็จจะปล่อยลง chute และตุ๊กตาจะปรากฏที่ PRIZE OUT ก่อนเพิ่มคะแนนและอัปเดตภารกิจ',
    close:'เข้าใจแล้ว'
  },
  ja:{
    title:'遊び方',
    goal:'ステージクリア条件',
    goalBody:'Stage 1の制限時間は3:00です。クリアには、Min Scoreへの到達と、HUD下に表示される全ぬいぐるみミッションの達成の両方が必要です。2つを満たすとその時点でステージクリアになります。',
    controls:'クレーンを狙う',
    joystick:'ジョイスティックは4方向に長押しできます。押している間クレーンは連続して動き、キャビネットの端で停止します。前後移動では実機のように遠近感も変化します。',
    target:'現在のつかみ範囲にいるぬいぐるみは、上品なゴールドの光と小さなターゲット表示で強調されます。今DROPを押した場合に接触しやすい対象の目安です。',
    dropTitle:'DROPとグリップ',
    drop:'位置を合わせたらDROPを1回押します。シャフトが対象まで下降し、クレーンが閉じ、持ち上げ、排出口まで自動で運びます。中央をつかむほど安定し、端をつかむと途中で滑り落ちることがあります。',
    shuffleTitle:'SHUFFLE',
    shuffle:'SHUFFLEを長押しすると床下の攪拌機構が動きます。Stage 1では合計15秒使用できます。ぬいぐるみは物理的な範囲内で移動・回転・沈み込み、ボタンを離すと停止します。',
    missionTitle:'Stage 1 ミッション',
    mission:'Signature Shih Tzu、Black Shih Tzu、Red Bear、Yellow Chick、White Bunnyをそれぞれ1体以上獲得してください。ミッションバーは成功するたびに更新され、残りが分かります。',
    scoringTitle:'Score・Claw Points・High Score',
    scoring:'Stage ScoreはMin Score達成判定に使います。Claw Pointsは別の長期報酬値です。High Scoreはこの端末のStage 1最高得点を保存します。',
    timerTitle:'残り30秒',
    timer:'残り30秒になると、現在の曲はピッチを保ったまま段階的にテンポアップし、Rubyタイマーも緊迫感を高めます。ステージに入っただけで曲が切り替わることはありません。',
    prizeTitle:'ぬいぐるみ獲得',
    prize:'安定したグリップなら、クレーンは排出口までぬいぐるみを保持します。ただし弱い位置では途中で滑ることがあります。成功するとchuteへ落下し、PRIZE OUTに表示された後でスコアとミッションが更新されます。',
    close:'OK'
  }
});

function locale(){const l=(document.documentElement.lang||'en').toLowerCase();return l.startsWith('th')?'th':l.startsWith('ja')?'ja':'en';}
function escapeHtml(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');}

export function createHowToGuide(){
  const modal=document.querySelector('[data-app-modal]');
  const title=modal?.querySelector('[data-modal-title]');
  const body=modal?.querySelector('[data-modal-body]');
  const actions=modal?.querySelector('[data-modal-actions]');

  function close(){if(!modal)return;modal.hidden=true;body.innerHTML='';actions.replaceChildren();modal.classList.remove('is-exit-confirm');}

  function show(){
    if(!modal||!title||!body||!actions)return;
    const t=CONTENT[locale()]||CONTENT.en;
    title.textContent=t.title;
    body.innerHTML=`<div class="lc-howto-guide">
      <section><h3>${escapeHtml(t.goal)}</h3><p>${escapeHtml(t.goalBody)}</p></section>
      <section><h3>${escapeHtml(t.controls)}</h3><p>${escapeHtml(t.joystick)}</p><p>${escapeHtml(t.target)}</p></section>
      <section><h3>${escapeHtml(t.dropTitle)}</h3><p>${escapeHtml(t.drop)}</p></section>
      <section><h3>${escapeHtml(t.shuffleTitle)}</h3><p>${escapeHtml(t.shuffle)}</p></section>
      <section class="lc-howto-guide__mission"><h3>${escapeHtml(t.missionTitle)}</h3><p>${escapeHtml(t.mission)}</p></section>
      <section><h3>${escapeHtml(t.scoringTitle)}</h3><p>${escapeHtml(t.scoring)}</p></section>
      <section><h3>${escapeHtml(t.timerTitle)}</h3><p>${escapeHtml(t.timer)}</p></section>
      <section><h3>${escapeHtml(t.prizeTitle)}</h3><p>${escapeHtml(t.prize)}</p></section>
    </div>`;
    actions.replaceChildren();
    const button=document.createElement('button');button.type='button';button.className='is-primary';button.textContent=t.close;button.addEventListener('click',close);actions.append(button);
    modal.hidden=false;
    modal.querySelector('.lc-modal__header [data-modal-close]')?.focus();
  }

  // Settings already owns this button. Capture first so the old brief guide never opens.
  document.addEventListener('click',(event)=>{
    if(!event.target?.closest?.('[data-how-to-play]'))return;
    event.preventDefault();event.stopImmediatePropagation();show();
  },true);

  return {show,close};
}
