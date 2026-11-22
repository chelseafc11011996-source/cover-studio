
var NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
var SCALES={pentMinor:[0,3,5,7,10],pentMajor:[0,2,4,7,9],blues:[0,3,5,6,7,10],dorian:[0,2,3,5,7,9,10],major:[0,2,4,5,7,9,11],mixolydian:[0,2,4,5,7,9,10],minor:[0,2,3,5,7,8,10]};
var SCALE_LABEL={pentMinor:'Minor Pentatonic',pentMajor:'Major Pentatonic',blues:'Blues',dorian:'Dorian',major:'Major',mixolydian:'Mixolydian',minor:'Natural Minor'};
var KEY_IDX={C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
function freq(midi){return 440*Math.pow(2,(midi-69)/12)}
function noteName(midi){return NOTE_NAMES[midi%12]+(Math.floor(midi/12)-1)}
var actx=null;function ac(){if(!actx)actx=new (window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();return actx}
function playTone(midi,t,dur,type){var c=ac(),o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();o.type=type||'triangle';o2.type='sine';o.frequency.value=freq(midi);o2.frequency.value=freq(midi)*2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.28,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);o2.connect(g);g.connect(c.destination);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05)}
function playSeq(notes,gap){gap=gap||0.32;var c=ac(),t=c.currentTime+.06;notes.forEach(function(n,i){playTone(n,t+i*gap,Math.max(.35,gap*1.4))});return notes.length*gap}
var toastTimer=null;function toast(msg){var el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');if(toastTimer)clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.classList.remove('show')},5000)}

/* TECHNIQUES */
var TECHS=[
{name:'Luyến láy — Melisma',icon:'〰️',diff:2,desc:'Một từ được hát thành 5 nốt liền nhau. Chiêu “đóng dấu” kinh điển của R&B — nghe là biết ai hát.',orig:[64,65,67],vari:[64,65,67,69,67,65,64,62]},
{name:'Bẻ nốt cuối câu',icon:'↗️',diff:1,desc:'Thay vì kết câu đúng nốt gốc, trượt lên hoặc xuống một nốt trong thang âm. Nhỏ thôi mà cực kỳ dễ nhớ.',orig:[67,65,64],vari:[67,65,64,67,69]},
{name:'Riff & Run nhanh',icon:'⚡',diff:3,desc:'Chạy một chùm nốt nhanh ở cuối câu hát. Khó, nhưng làm đúng 1 lần trong bài là đủ thành thương hiệu.',orig:[69,67,64],vari:[69,67,65,64,62,60,62,64]},
{name:'Vibrato — Rung nốt',icon:'〰',diff:2,desc:'Giữ nốt dài rồi rung nhẹ ở đuôi nốt. Biến một câu hát bình thường thành đầy nước mắt.',orig:[64,67],vari:[64,67,67,67]},
{name:'Lật giọng gió — Falsetto Flip',icon:'🕊️',diff:2,desc:'Falsetto (giọng gió) là kiểu hát nhẹ, mỏng, nhiều hơi thở như thủ thỉ — đối lập giọng thật đầy và chắc. Đang hát giọng thật, bất ngờ lật lên giọng gió ở một từ sẽ mong manh, rất riêng.',orig:[64,67,69],vari:[64,67,81]},
{name:'Nhảy quãng 8',icon:'🚀',diff:2,desc:'Quãng 8 nghĩa là hát lại đúng nốt đó nhưng cao hơn hẳn một mức (như cùng một chữ, hét cao hơn). Câu hát lặp lại lần hai thì bật lên quãng 8 — cao trào tức thì.',orig:[60,64,67],vari:[60,64,79]},
{name:'Hát lệch phách',icon:'🎭',diff:3,desc:'Vào câu chậm hơn beat nửa nhịp có chủ đích (laid-back). Chất indie/jazz — nghe “lười” mà cực kỳ có gu.',orig:[64,64,67],vari:[62,64,67,65]},
{name:'Ad-lib cuối bài',icon:'✨',diff:1,desc:'Ở chorus cuối, hát thêm “yeah…”, “oh…” hoặc một câu luyến tự do trên nền giai điệu chính.',orig:[67,69,72],vari:[72,74,76,74,72,69,67]}
];
var tg=document.getElementById('techGrid');
TECHS.forEach(function(t,i){var d=document.createElement('div');d.className='tech';d.innerHTML='<span style="font-size:26px">'+t.icon+'</span><h3>'+t.name+'</h3><div class="dots" aria-label="Độ khó">'+'●'.repeat(t.diff)+'○'.repeat(3-t.diff)+' <span style="color:var(--muted);letter-spacing:0">độ khó '+t.diff+'/3</span></div><p>'+t.desc+'</p><div class="notePattern">'+t.vari.map(noteName).join(' → ')+'</div><div class="row"><button class="btn btn-teal" data-play="'+i+'">▶ Nghe thử</button><button class="btn btn-ghost" data-addtech="'+i+'">+ Bản đồ</button></div>';tg.appendChild(d)});
tg.addEventListener('click',function(e){var p=e.target.closest('[data-play]'),a=e.target.closest('[data-addtech]');if(p){var t=TECHS[+p.dataset.play];toast('Đang phát: gốc → biến tấu “'+t.name+'”');playSeq(t.orig,.3);setTimeout(function(){playSeq(t.vari,.22)},t.orig.length*300+350)}if(a){addPlan(TECHS[+a.dataset.addtech].name+' — '+TECHS[+a.dataset.addtech].vari.map(noteName).join(' → '))}});

/* PLAN + LƯU LẠI CÔNG LÀM (localStorage): bản đồ cover + phong cách + đoạn đã chọn + chiêu đã áp + tông đã dịch.
   Bản đồ bắt đầu TRỐNG — không còn mục mặc định nào người dùng chưa chọn; gợi ý mẫu nằm ở mục 2, chỉ vào khi bấm “+ Thêm”. */
var LS_KEY='coverStudioV3',savedState=null;try{savedState=JSON.parse(localStorage.getItem(LS_KEY)||'null')}catch(e){savedState=null}
function saveState(){try{localStorage.setItem(LS_KEY,JSON.stringify({plan:plan,curStyle:curStyle,scaleKey:document.getElementById('scaleKey').value,scaleType:document.getElementById('scaleType').value,practiceSpeed:(typeof practiceSpeed!=='undefined'?practiceSpeed:1),nsSel:(typeof nsSel!=='undefined'&&nsSel&&nsSel.end>nsSel.start)?nsSel:(savedState?savedState.nsSel:null),nsBend:(typeof nsBend!=='undefined'&&nsBend)?nsBend:(savedState?savedState.nsBend:null),nsShiftTotal:(typeof nsShiftTotal!=='undefined'&&nsShiftTotal)?nsShiftTotal:((savedState&&savedState.nsShiftTotal)||0)}))}catch(e){}}
var plan=(savedState&&Array.isArray(savedState.plan))?savedState.plan.slice():[];
var curStyle=(savedState&&savedState.curStyle)?savedState.curStyle:'R&B Luyến Láy';
function renderPlan(){var ul=document.getElementById('planList');ul.innerHTML='';plan.forEach(function(p,i){var li=document.createElement('li');li.innerHTML='<span>⭐ '+p+'</span>';var b=document.createElement('button');b.textContent='×';b.setAttribute('aria-label','Xoá');b.onclick=function(){plan.splice(i,1);renderPlan()};li.appendChild(b);ul.appendChild(li)});if(!plan.length){var li2=document.createElement('li');li2.innerHTML='<span style="color:var(--muted)">Bản đồ đang trống — chưa có gì bị áp đặt sẵn cho bạn. Hãy chốt điểm nhấn từ mục 2 (cấu trúc bài), Note Studio, phòng lab hoặc xưởng bẻ câu; các gợi ý mẫu nằm riêng ở mục 2 và chỉ vào bản đồ khi bạn bấm “+ Thêm”.</span>';ul.appendChild(li2)}document.getElementById('planCount').textContent=plan.length?plan.length+' điểm nhấn đã chốt':'Chưa chốt điểm nhấn nào';document.getElementById('planTitle').textContent='Bản đồ cho phong cách: '+curStyle;saveState()}
function addPlan(txt){plan.push(txt);renderPlan();toast('Đã chốt vào bản đồ cover ✓')}
renderPlan();
document.querySelectorAll('[data-add]').forEach(function(b){b.addEventListener('click',function(){addPlan(b.dataset.add)})});
document.getElementById('clearBtn').onclick=function(){plan=[];try{localStorage.removeItem(LS_KEY)}catch(e){}savedState=null;renderPlan();toast('Đã xoá hết — cả bản đồ lẫn bản đã lưu trong trình duyệt, bắt đầu lại từ đầu nhé')};
document.getElementById('downloadBtn').onclick=function(){var txt='BẢN ĐỒ COVER ĐỘC BẢN\nPhong cách: '+curStyle+'\nTông: '+document.getElementById('scaleKey').value+' • Thang âm: '+SCALE_LABEL[document.getElementById('scaleType').value]+'\n\n'+plan.map(function(p,i){return (i+1)+'. '+p}).join('\n')+'\n\n— Tạo bằng Cover Studio';var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='ban-do-cover.txt';a.click();toast('Đã tải bản đồ cover ✓')};
document.getElementById('copyBtn').onclick=function(){var txt=plan.join('\n');if(navigator.clipboard)navigator.clipboard.writeText(txt).then(function(){toast('Đã sao chép bản đồ ✓')})};

/* STYLES */
document.getElementById('styles').addEventListener('click',function(e){var c=e.target.closest('.styleCard');if(!c)return;document.querySelectorAll('.styleCard').forEach(function(x){x.classList.remove('active')});c.classList.add('active');curStyle=c.dataset.style;document.getElementById('styleTip').textContent=c.dataset.tip;renderPlan();toast('Đã chọn chất: '+curStyle)});
/* khôi phục phong cách đã lưu từ lần trước */
if(savedState&&savedState.curStyle){document.querySelectorAll('.styleCard').forEach(function(x){if(x.dataset.style===savedState.curStyle){document.querySelectorAll('.styleCard').forEach(function(y){y.classList.remove('active')});x.classList.add('active');curStyle=x.dataset.style;document.getElementById('styleTip').textContent=x.dataset.tip}});renderPlan()}

/* PIANO + SCALE */
var curRun=[];
function rootMidi(){var key=document.getElementById('scaleKey').value;var r=60+KEY_IDX[key];if(r>69)r-=12;return r} /* tonic in octave 4: C4..A4 */
function buildPiano(){var root=rootMidi(),type=document.getElementById('scaleType').value,scale=SCALES[type];var p=document.getElementById('piano');p.innerHTML='';var whites=[0,2,4,5,7,9,11,12,14,16,17,19,21,23,24];whites.forEach(function(off){var midi=60+off;var pc=((midi-root)%12+12)%12;var b=document.createElement('button');b.className='wkey'+(scale.indexOf(pc)>=0?' scale':'')+(pc===0?' root':'');b.textContent=noteName(midi);b.onclick=function(){playTone(midi,ac().currentTime+.02,.7)};p.appendChild(b)});
/* phím đen (thăng/giáng) — thang Blues cần blue note nằm đúng ở phím đen */
whites.forEach(function(off,i){if([0,2,5,7,9].indexOf(off%12)<0)return;var bo=off+1;if(bo>24)return;var midi=60+bo;var pc=((midi-root)%12+12)%12;var b=document.createElement('button');b.className='bkey'+(scale.indexOf(pc)>=0?' scale':'');if(pc===0)b.style.background='var(--coral)';b.style.left='calc('+((i+1)*100/whites.length)+'% - 17px)';b.textContent=noteName(midi);b.setAttribute('aria-label','Phím đen '+noteName(midi));b.onclick=function(){playTone(midi,ac().currentTime+.02,.7)};p.appendChild(b)});genRun()}
function scaleNotes(){var root=rootMidi(),type=document.getElementById('scaleType').value;return SCALES[type].map(function(s){return root+s}).concat([root+12])}
function genRun(){var ns=scaleNotes(),run=[],idx=Math.floor(ns.length/2);for(var i=0;i<6;i++){run.push(ns[idx]);idx+=Math.random()>.5?1:-1;if(idx<0)idx=0;if(idx>=ns.length)idx=ns.length-1}curRun=run;document.getElementById('scaleRun').textContent=run.map(noteName).join(' → ')+'   •   Hát trên từ cuối câu, kéo dài khoảng 1 nhịp';}
document.getElementById('scaleKey').addEventListener('change',function(){buildPiano();saveState()});
document.getElementById('scaleType').addEventListener('change',function(){buildPiano();saveState()});
document.getElementById('newRunBtn').onclick=genRun;
document.getElementById('playRunBtn').onclick=function(){playSeq(curRun,.24);toast('Đang phát câu luyến gợi ý ♪')};
document.getElementById('addRunBtn').onclick=function(){addPlan('Câu luyến tự sáng tạo ('+SCALE_LABEL[document.getElementById('scaleType').value]+'): '+curRun.map(noteName).join(' → '))};
/* khôi phục tông + thang âm đã lưu từ lần trước */
if(savedState){var skEl=document.getElementById('scaleKey'),stEl=document.getElementById('scaleType');if(savedState.scaleKey&&[...skEl.options].some(function(o){return o.value===savedState.scaleKey}))skEl.value=savedState.scaleKey;if(savedState.scaleType&&SCALES[savedState.scaleType])stEl.value=savedState.scaleType;var kyEl=document.getElementById('keySel');if(savedState.scaleKey&&[...kyEl.options].some(function(o){return o.value===savedState.scaleKey}))kyEl.value=savedState.scaleKey}
buildPiano();

/* UPLOAD / AUDIO */
var audio=document.getElementById('audioEl'),audioCtx=null,mode='original',gains={};
function setupGraph(){if(audioCtx)return;try{audioCtx=ac();var src=audioCtx.createMediaElementSource(audio);var master=audioCtx.createGain();master.gain.value=.95;master.connect(audioCtx.destination);var og=audioCtx.createGain();src.connect(og);og.connect(master);var split=audioCtx.createSplitter(2);src.connect(split);var inv=audioCtx.createGain();inv.gain.value=-1;var kMerge=audioCtx.createChannelMerger(1);var lGain=audioCtx.createGain(),rGain=audioCtx.createGain();split.connect(lGain,0);split.connect(rGain,1);rGain.connect(inv);lGain.connect(kMerge,0);inv.connect(kMerge,0);var kg=audioCtx.createGain();kg.gain.value=0;kMerge.connect(kg);kg.connect(master);var vMerge=audioCtx.createChannelMerger(1);lGain.connect(vMerge,0);rGain.connect(vMerge,0);var bp=audioCtx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1100;bp.Q.value=.6;var vg=audioCtx.createGain();vg.gain.value=0;vMerge.connect(bp);bp.connect(vg);vg.connect(master);gains={original:og,karaoke:kg,vocal:vg}}catch(e){}}
function setMode(m){mode=m;document.querySelectorAll('[data-mode]').forEach(function(b){b.classList.toggle('active',b.dataset.mode===m)});var mw=document.getElementById('monoWarn');if(mw)mw.classList.toggle('hidden',!(m==='karaoke'&&(typeof nsChannels!=='undefined'&&nsChannels===1)));if(gains.original){gains.original.gain.value=m==='original'?1:0;gains.karaoke.gain.value=m==='karaoke'?1.4:0;gains.vocal.gain.value=m==='vocal'?1.6:0}toast(m==='original'?'Đang nghe: bản gốc':m==='karaoke'?'Đang nghe: chỉ nhạc — hát đè lên nào!':'Đang nghe: chỉ giọng — học cách ca sĩ gốc xử lý câu hát')}
document.querySelectorAll('[data-mode]').forEach(function(b){b.addEventListener('click',function(){setupGraph();setMode(b.dataset.mode)})});
function fmt(s){if(!isFinite(s))return'0:00';return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}
function drawWave(buf){var cv=document.getElementById('wave'),ctx=cv.getContext('2d'),data=buf.getChannelData(0),step=Math.ceil(data.length/cv.width),h=cv.height;ctx.fillStyle='#1C1710';ctx.fillRect(0,0,cv.width,h);ctx.fillStyle='#FF7A4D';for(var x=0;x<cv.width;x++){var min=1,max=-1;for(var j=0;j<step;j++){var v=data[x*step+j]||0;if(v<min)min=v;if(v>max)max=v}ctx.fillRect(x,(1+min)*h/2,1,Math.max(1,(max-min)*h))}}
function estimate(buf){var dur=buf.duration;document.getElementById('durVal').textContent=fmt(dur);document.getElementById('durTime').textContent=fmt(dur);/* BPM rough: energy peaks */var data=buf.getChannelData(0),sr=buf.sampleRate,win=Math.floor(sr*.35),peaks=0,prev=0;for(var i=0;i<data.length;i+=win){var e=0;for(var j=i;j<Math.min(i+win,data.length);j+=16)e+=Math.abs(data[j]);if(e>prev*1.25&&e>.4)peaks++;prev=e}var bpm=Math.round(Math.min(130,Math.max(65,peaks/dur*60*.9)));document.getElementById('bpmVal').textContent=bpm+' BPM';estimateKey(buf);document.getElementById('moodVal').textContent=bpm<85?'Nhẹ nhàng, da diết':bpm<105?'Trữ tình, ấm áp':'Sôi động, tươi sáng'}
/* Ước lượng tông THẬT từ audio: gom chroma (năng lượng 12 lớp cao độ) bằng đo cao độ từng frame,
   rồi tương quan với mẫu tông trưởng/thứ (hồ sơ Krumhansl) — kèm độ tin cậy để người dùng tự chỉnh lại bằng tai. */
function estimateKey(buf){
  var data=buf.getChannelData(0),sr=buf.sampleRate,win=2048,hop=Math.floor(sr*0.25),chroma=[0,0,0,0,0,0,0,0,0,0,0,0],frames=0;
  for(var pos=0;pos+win<data.length&&frames<360;pos+=hop){
    var sl=data.subarray(pos,pos+hop),rms=0;for(var i=0;i<sl.length;i+=8)rms+=sl[i]*sl[i];rms=Math.sqrt(rms/(sl.length/8));
    if(rms<0.02)continue;
    var f=autoCorr(data.subarray(pos,pos+win),sr);if(f<60||f>1200)continue;
    var pc=((Math.round(69+12*Math.log2(f/440))%12)+12)%12;chroma[pc]+=rms;frames++;
  }
  var lab=document.getElementById('keyLab'),note=document.getElementById('keyNote');
  if(frames<12){document.getElementById('keyVal').textContent='— chưa đủ dữ liệu';if(lab)lab.textContent='Tông chủ (Key) — chưa ước lượng được';if(note)note.textContent='Chưa nghe đủ cao độ rõ ràng trong file để ước lượng tông — hãy tự chọn tông bằng tai ở ô chọn phía trên.';return}
  var MAJ=[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88],MIN=[6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17];
  function pear(a,b){var ma=0,mb=0,i;for(i=0;i<12;i++){ma+=a[i];mb+=b[i]}ma/=12;mb/=12;var num=0,da=0,db=0;for(i=0;i<12;i++){num+=(a[i]-ma)*(b[i]-mb);da+=(a[i]-ma)*(a[i]-ma);db+=(b[i]-mb)*(b[i]-mb)}return num/Math.sqrt((da*db)||1)}
  var scores=[];for(var r=0;r<12;r++){var arr=[];for(var k=0;k<12;k++)arr.push(chroma[(k+r)%12]);scores.push({root:r,mode:'trưởng (major)',c:pear(arr,MAJ)});scores.push({root:r,mode:'thứ (minor)',c:pear(arr,MIN)})}
  scores.sort(function(a,b){return b.c-a.c});var best=scores[0],second=scores[1];
  var conf=Math.round(Math.max(35,Math.min(92,55+(best.c-second.c)*110)));
  var rootName=NOTE_NAMES[best.root];
  document.getElementById('keyVal').textContent=rootName+' '+best.mode+' (ước lượng)';
  if(lab)lab.textContent='Tông chủ (Key) — ước lượng từ audio';
  if(note)note.innerHTML='Ước lượng, độ tin cậy khoảng <strong>'+conf+'%</strong> — hãy nghe và chọn lại theo tai bạn ở ô chọn nếu thấy sai. Ô chọn là để bạn chỉnh lại, không ghi đè thành “kết quả phân tích”.';
  var ks=document.getElementById('keySel');if([...ks.options].some(function(o){return o.value===rootName})){ks.value=rootName;var sk2=document.getElementById('scaleKey');if([...sk2.options].some(function(o){return o.value===rootName}))sk2.value=rootName;buildPiano();saveState()}
}
/* ===== TẢI FILE THỐNG NHẤT: một hàm onFile duy nhất cho cả nút chọn file lẫn kéo-thả.
   File chỉ giải mã (decode) ĐÚNG 1 LẦN — cùng một AudioBuffer dùng chung cho trình phát,
   phần “Giải phẫu” và phần chuyển thành nốt nhạc (Note Studio). ===== */
function setFileProg(pct,label){var w=document.getElementById('fileProg');if(pct===null){w.classList.add('hidden');return}w.classList.remove('hidden');document.getElementById('fileProgBar').style.width=pct+'%';document.getElementById('fileProgLabel').textContent=label+' — '+pct+'%'}
function onFile(f){
  if(!f)return;
  var errBox=document.getElementById('fileError');errBox.classList.add('hidden');
  nsIsDemo=false;
  var url=URL.createObjectURL(f);audio.src=url;audio.preservesPitch=true;if('webkitPreservesPitch' in audio)audio.webkitPreservesPitch=true;
  document.getElementById('fileInfo').classList.remove('hidden');
  document.getElementById('trackName').textContent=f.name.replace(/\.[^.]+$/,'');
  setupGraph();
  $('nsEmpty').classList.remove('hidden');$('nsMain').classList.add('hidden');
  $('nsEmpty').querySelector('strong').textContent='⏳ Đang chuyển bài hát thành nốt nhạc… xem thanh tiến trình ở mục 1';
  setFileProg(10,'Đang đọc file “'+f.name+'”');
  toast('Đã nhận file “'+f.name+'” — đang giải mã & chuyển thành nốt nhạc, xem thanh tiến trình ở mục 1');
  f.arrayBuffer().then(function(ab){setFileProg(35,'Đang giải mã âm thanh');return ac().decodeAudioData(ab.slice(0))}).then(function(buf){
    /* buf này là bản giải mã DUY NHẤT — dùng chung cho cả 3 việc */
    drawWave(buf);estimate(buf);
    setFileProg(65,'Đã giải mã xong — đang quét cao độ thành nốt nhạc');
    setTimeout(function(){
      try{
        transcribe(buf);
        setFileProg(100,'Xong! Đã tách được '+nsNotes.length+' nốt');
        showNS('✓ Đã tách được '+nsNotes.length+' nốt từ “'+f.name+'” — kéo trên sóng để chọn đoạn');
        setTimeout(function(){setFileProg(null)},2500);
        toast('Xong! Đã tách được '+nsNotes.length+' nốt — xuống mục 3 (Note Studio) kéo chọn đoạn để bẻ nốt nhé');
      }catch(e){
        setFileProg(null);
        $('nsEmpty').querySelector('strong').textContent='Chưa tách được nốt từ file này — hãy thử “Tạo bài mẫu” để xem tính năng';
        toast('Đọc được file nhưng chưa tách được nốt — thử bài mẫu hoặc file có giai điệu rõ hơn nhé');
      }
    },60);
  }).catch(function(){
    setFileProg(null);
    errBox.classList.remove('hidden');
    document.getElementById('bpmVal').textContent='—';
    document.getElementById('keyVal').textContent='—';
    document.getElementById('durVal').textContent='—';
    document.getElementById('moodVal').textContent='— chưa đọc được file';
    $('nsEmpty').querySelector('strong').textContent='Không đọc được file này — thử file MP3/WAV khác, hoặc dùng bài mẫu bên dưới';
    toast('Không đọc được file này — thử file MP3/WAV khác nhé');
  });
}
var fi=document.getElementById('fileInput');
document.getElementById('pickBtn').onclick=function(e){e.stopPropagation();fi.click()};
document.getElementById('dropZone').addEventListener('click',function(){fi.click()});
fi.addEventListener('change',function(){onFile(fi.files[0]);fi.value=''});
var dz=document.getElementById('dropZone');dz.addEventListener('dragover',function(e){e.preventDefault();dz.classList.add('over')});dz.addEventListener('dragleave',function(){dz.classList.remove('over')});dz.addEventListener('drop',function(e){e.preventDefault();dz.classList.remove('over');onFile(e.dataTransfer.files[0])});
document.getElementById('playBtn').onclick=function(){setupGraph();if(audio.paused){if(!audio.src){toast('Hãy tải file lên, hoặc bấm “Nghe giai điệu mẫu” trước nhé');return}audio.play()}else audio.pause()};
audio.addEventListener('play',function(){document.getElementById('playBtn').textContent='❚❚';document.getElementById('playState').textContent='Đang phát…'});
audio.addEventListener('pause',function(){document.getElementById('playBtn').textContent='▶';document.getElementById('playState').textContent='Đã dừng'});
audio.addEventListener('timeupdate',function(){if(audio.duration){document.getElementById('seek').value=audio.currentTime/audio.duration*100;document.getElementById('curTime').textContent=fmt(audio.currentTime)}});
document.getElementById('seek').addEventListener('input',function(e){if(audio.duration)audio.currentTime=e.target.value/100*audio.duration});
/* Tốc độ luyện tập THẬT: phát chậm lại nhưng GIỮ NGUYÊN cao độ (preservesPitch),
   và cùng một hệ số này áp dụng cho cả tiếng nhạc cụ tổng hợp trong Note Studio. */
var practiceSpeed=1;
function setPracticeSpeed(v){practiceSpeed=+v||1;audio.preservesPitch=true;if('webkitPreservesPitch' in audio)audio.webkitPreservesPitch=true;audio.playbackRate=practiceSpeed;var s1=document.getElementById('speedSel'),s2=document.getElementById('bpmSel');if(s1&&[...s1.options].some(function(o){return o.value==String(practiceSpeed)}))s1.value=String(practiceSpeed);if(s2&&[...s2.options].some(function(o){return o.value==String(practiceSpeed)}))s2.value=String(practiceSpeed)}
audio.preservesPitch=true;if('webkitPreservesPitch' in audio)audio.webkitPreservesPitch=true;
document.getElementById('speedSel').addEventListener('change',function(e){setPracticeSpeed(e.target.value);toast('Tốc độ tập: '+practiceSpeed+'× — nhạc chậm lại nhưng nốt không bị trầm xuống')});
document.getElementById('volVocal').addEventListener('input',function(e){audio.volume=e.target.value/100});
document.getElementById('bpmSel').addEventListener('change',function(e){setPracticeSpeed(e.target.value);toast('Đã đặt tốc độ luyện tập '+practiceSpeed+'× — đây là tốc độ phát để tập, không phải đổi tempo bài gốc')});
document.getElementById('keySel').addEventListener('change',function(e){document.getElementById('keyVal').textContent=e.target.value+' (bạn tự chọn theo tai)';var kn=document.getElementById('keyNote');if(kn)kn.textContent='Bạn vừa tự chọn tông '+e.target.value+' theo tai — Studio dùng tông này cho thang âm bên dưới. Tai bạn là chuẩn cuối cùng, không có gì sai khi chỉnh lại cả.';document.getElementById('scaleKey').value=e.target.value;buildPiano();saveState()});
document.getElementById('demoBtn').onclick=function(e){e.stopPropagation();makeDemoNS();document.getElementById('trackName').textContent='Giai điệu mẫu (tổng hợp sẵn trong Studio)';document.getElementById('durVal').textContent='0:24 (bài mẫu)';document.getElementById('bpmVal').textContent='— (bài mẫu, không đo BPM)';document.getElementById('moodVal').textContent='Bài mẫu để thử tính năng';toast('Đã tạo bài mẫu — nốt nhạc thật đã hiện trên piano-roll ở mục 3 (Note Studio) bên dưới');document.getElementById('noteStudio').scrollIntoView({behavior:'smooth'})};

/* LYRIC LAB */
var selWordText='lắm',selLineIdx=0,curVar=[],curOrig=[];
function parseLyrics(){var txt=document.getElementById('lyricInput').value.trim(),lines=txt.split('\n').filter(Boolean),wrap=document.getElementById('lyricLines');wrap.innerHTML='';lines.forEach(function(line,li){var d=document.createElement('div');d.className='lyricLine';line.split(/\s+/).forEach(function(w){var b=document.createElement('button');b.className='word'+(w.replace(/[.,!?]/g,'')===selWordText?' sel':'');b.textContent=w;b.onclick=function(){selWordText=w.replace(/[.,!?]/g,'');selLineIdx=li;document.getElementById('selWord').textContent='“'+selWordText+'”';document.querySelectorAll('.word').forEach(function(x){x.classList.remove('sel')});b.classList.add('sel')};d.appendChild(b)});wrap.appendChild(d)})}
document.getElementById('parseLyricBtn').onclick=function(){parseLyrics();toast('Đã tách câu — bấm vào từ bạn muốn bẻ nốt')};parseLyrics();
var lvlTxt={1:'Nhẹ — an toàn, ai cũng hát được',2:'Vừa — dễ hát theo',3:'Đậm — diva mode, khó nhưng chất'};
document.getElementById('ornLevel').addEventListener('input',function(e){document.getElementById('ornLevelVal').textContent=lvlTxt[e.target.value]});
function drawContour(notes){var svg=document.getElementById('contour');if(!notes.length){svg.innerHTML='';return}var min=Math.min.apply(null,notes),max=Math.max.apply(null,notes),rng=Math.max(4,max-min);var pts=notes.map(function(n,i){return (30+i*(460/Math.max(1,notes.length-1)))+','+(115-(n-min)/rng*85)});svg.innerHTML='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#FF7A4D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'+notes.map(function(n,i){var p=pts[i].split(',');return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="#FFD166"/><text x="'+p[0]+'" y="'+(+p[1]-14)+'" fill="#fff" font-size="11" text-anchor="middle" font-weight="bold">'+noteName(n)+'</text>'}).join('')}
function genVar(silent){var ns=scaleNotes(),bi=Math.floor(ns.length/2),base=ns[bi],tech=document.getElementById('ornTech').value,lvl=+document.getElementById('ornLevel').value;curOrig=[ns[1],ns[2],base,ns[2]];var v;if(tech==='melisma')v=[base].concat(ns.slice(2,2+lvl+2)).concat([base]);else if(tech==='bend')v=[ns[Math.max(0,bi-1)],base,ns[Math.min(ns.length-1,bi+1)],base];else if(tech==='run')v=[base].concat(ns.slice().reverse().slice(0,lvl+3));else if(tech==='octave')v=[base,base,base+12];else if(tech==='falsetto')v=[base,ns[Math.min(ns.length-1,bi+2)],base+12];else v=[base,base,base,ns[Math.min(ns.length-1,bi+1)],base];curVar=v;drawContour(v);document.getElementById('varNotes').innerHTML='Từ <b>“'+selWordText+'”</b> → hát thành: <b>'+v.map(noteName).join(' → ')+'</b><br><span style="color:var(--muted)">Câu gốc: '+curOrig.map(noteName).join(' → ')+' • Chiêu: '+document.getElementById('ornTech').selectedOptions[0].textContent.split('—')[0]+' • Tất cả nốt đều thuộc thang âm đã chọn</span>';if(!silent)toast('Đã sinh biến tấu — bấm “Nghe bản bẻ nốt” để thử')}
document.getElementById('genVarBtn').onclick=function(){genVar(false)};
document.getElementById('playOrigBtn').onclick=function(){if(!curOrig.length)genVar(true);playSeq(curOrig,.36);toast('Đang phát câu gốc')};
document.getElementById('playVarBtn').onclick=function(){if(!curVar.length)genVar(true);playSeq(curVar,.26);toast('Đang phát bản bẻ nốt của bạn ♪')};
document.getElementById('addVarBtn').onclick=function(){if(!curVar.length)genVar(true);addPlan('Câu '+(selLineIdx+1)+' — từ “'+selWordText+'”: '+curVar.map(noteName).join(' → '))};
genVar(true);

/* ================= NOTE STUDIO ================= */
var nsNotes=[],nsPeaks=[],nsDur=0,nsSel={start:0,end:0},nsInst='piano',nsBend=null,nsBentNotes=null,nsClimax=null,nsQuiet=null,nsIsDemo=false,nsPlayTimer=null,nsSelNoteRef=null,nsChannels=2,nsRestored=false;
function $(id){return document.getElementById(id)}
function nsFmt(s){return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}
function autoCorrFull(buf,sr){var SIZE=buf.length,rms=0;for(var i=0;i<SIZE;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/SIZE);if(rms<0.01)return{f:-1,clarity:0};var r1=0,r2=SIZE-1,th=0.2;for(var i=0;i<SIZE/2;i++)if(Math.abs(buf[i])<th){r1=i;break}for(var i=1;i<SIZE/2;i++)if(Math.abs(buf[SIZE-i])<th){r2=SIZE-i;break}var b=buf.slice(r1,r2),N=b.length,c=new Array(N).fill(0);for(var i=0;i<N;i++)for(var j=0;j<N-i;j++)c[i]+=b[j]*b[j+i];var d=0;while(d<N-1&&c[d]>c[d+1])d++;var maxv=-1,maxp=-1;for(var i=d;i<N;i++)if(c[i]>maxv){maxv=c[i];maxp=i}var T0=maxp;if(T0>0&&T0<N-1){var x1=c[T0-1],x2=c[T0],x3=c[T0+1];var a=(x1+x3-2*x2)/2,bb=(x3-x1)/2;if(a)T0=T0-bb/(2*a)}var clarity=(maxv>0&&c[0]>0)?Math.max(0,Math.min(1,maxv/c[0])):0;return{f:sr/T0,clarity:clarity}}
function autoCorr(buf,sr){return autoCorrFull(buf,sr).f}
function transcribe(buf){
  nsDur=buf.duration;nsChannels=buf.numberOfChannels||2;
  var data=buf.getChannelData(0),sr=buf.sampleRate,hop=Math.floor(sr*0.15),win=2048,dt=hop/sr;
  var nCols=520;nsPeaks=[];var per=Math.floor(data.length/nCols);
  for(var x=0;x<nCols;x++){var mx=0;for(var j=x*per;j<Math.min((x+1)*per,data.length);j+=32){var v=Math.abs(data[j]);if(v>mx)mx=v}nsPeaks.push(mx)}
  /* bước 1 — đo cao độ từng frame bằng autocorrelation, kèm độ rõ (clarity) làm độ tin cậy */
  var frames=[];
  for(var pos=0;pos+win<data.length;pos+=hop){
    var t=pos/sr,slice=data.subarray(pos,pos+hop),rms=0;for(var i=0;i<slice.length;i+=8)rms+=slice[i]*slice[i];rms=Math.sqrt(rms/(slice.length/8));
    var midi=null,conf=0;
    if(rms>0.012){var r=autoCorrFull(data.subarray(pos,pos+win),sr);if(r.f>70&&r.f<1100){midi=Math.round(69+12*Math.log2(r.f/440));if(midi<40)midi+=12;if(midi>88)midi-=12;conf=r.clarity}}
    frames.push({t:t,midi:midi,rms:rms,conf:conf});
  }
  /* (c) bỏ frame lặng / hơi thở theo ngưỡng độ to tương đối của cả bài */
  var voicedRms=frames.filter(function(f){return f.midi!==null}).map(function(f){return f.rms}).sort(function(a,b){return a-b});
  var medRms=voicedRms.length?voicedRms[Math.floor(voicedRms.length/2)]:0,gate=Math.max(0.016,medRms*0.35);
  frames.forEach(function(f){if(f.rms<gate)f.midi=null});
  /* (a) lọc trung vị 5 frame — làm mượt đường cao độ kiểu pYIN */
  var med=frames.map(function(f,i){if(f.midi===null)return null;var w=[];for(var k=-2;k<=2;k++){var g=frames[i+k];if(g&&g.midi!==null)w.push(g.midi)}if(w.length<3)return f.midi;w.sort(function(a,b){return a-b});return w[Math.floor(w.length/2)]});
  frames.forEach(function(f,i){f.midi=med[i]});
  /* (b) phạt nhảy quãng 8 — lệch đúng 12 nửa cung mà bằng chứng yếu (độ rõ thấp) thì giữ cao độ cũ */
  var prevMidi=null;frames.forEach(function(f){if(f.midi===null)return;if(prevMidi!==null&&Math.abs(f.midi-prevMidi)===12&&f.conf<0.72)f.midi=prevMidi;prevMidi=f.midi});
  /* (d) gộp frame thành nốt + tách theo điểm bắt đầu (onset): độ to vọt lên đột ngột = nốt mới, dù cùng cao độ */
  var notes=[],cur=null,prevRms=0;
  frames.forEach(function(f){
    var onset=!!(cur&&f.midi!==null&&f.rms>prevRms*1.9&&(f.rms-prevRms)>0.045);
    if(f.midi!==null&&cur&&cur.midi===f.midi&&!onset){cur.dur=f.t+dt-cur.start;cur.confSum+=f.conf;cur.confN++;if(f.rms>cur.rms)cur.rms=f.rms}
    else{if(cur)notes.push(cur);cur=f.midi!==null?{start:f.t,dur:dt,midi:f.midi,rms:f.rms,confSum:f.conf,confN:1}:null}
    prevRms=f.rms;
  });
  if(cur)notes.push(cur);
  notes.forEach(function(n){n.conf=Math.round((n.confSum/Math.max(1,n.confN))*100)/100;delete n.confSum;delete n.confN});
  nsNotes=notes.filter(function(n){return n.dur>=0.18});
  /* climax / quiet by peak energy in 6s windows */
  var best=-1,bq=1e9,bs=0,qs=0;for(var s=0;s+6<=nsDur;s+=2){var e=0,cnt=0;for(var x2=Math.floor(s/nsDur*520);x2<Math.floor((s+6)/nsDur*520);x2++){e+=nsPeaks[x2]||0;cnt++}e/=Math.max(1,cnt);if(e>best){best=e;bs=s}if(e<bq){bq=e;qs=s}}
  nsClimax={start:bs,end:Math.min(nsDur,bs+8)};nsQuiet={start:qs,end:Math.min(nsDur,qs+8)};
  nsSel={start:nsClimax.start,end:nsClimax.end};
}
function makeDemoNS(){
  nsIsDemo=true;nsDur=24;nsPeaks=[];for(var x=0;x<520;x++){nsPeaks.push(0.25+0.55*Math.abs(Math.sin(x*0.05))*(x>300&&x<430?1.25:0.8))}
  var mel=[69,71,72,71,69,67,69,72,74,72,71,69,67,64,67,69,72,76,74,72,71,69];nsNotes=[];
  var t=0;mel.forEach(function(m,i){var d=(i===10||i===21)?1.6:0.85;nsNotes.push({start:t,dur:d,midi:m,rms:0.5,conf:0.92});t+=d});
  nsClimax={start:13,end:20};nsQuiet={start:0,end:6};nsSel={start:13,end:20};
  showNS('Bài mẫu tổng hợp — 22 nốt đã được tạo sẵn để bạn thử mọi tính năng');
}
function showNS(status){
  /* khôi phục lựa chọn đã lưu (đoạn đã chọn, chiêu đã áp, tông đã dịch) cho bài vừa nạp */
  if(savedState&&!nsRestored){nsRestored=true;
    if(savedState.nsShiftTotal){nsNotes.forEach(function(n){n.midi+=savedState.nsShiftTotal});nsShiftTotal=savedState.nsShiftTotal}
    if(savedState.nsSel&&savedState.nsSel.end>savedState.nsSel.start){nsSel={start:Math.max(0,Math.min(Math.max(0,nsDur-1),savedState.nsSel.start)),end:Math.max(0.5,Math.min(nsDur,savedState.nsSel.end))}}
    if(savedState.nsBend)nsBend=savedState.nsBend;
  }
  $('nsEmpty').classList.add('hidden');$('nsMain').classList.remove('hidden');
  $('nsStatus').textContent=status||('Đã tách được '+nsNotes.length+' nốt trong '+nsFmt(nsDur));
  drawBigWave();updateSelUI();updateTransposeUI();
}
function selNotes(){return nsNotes.filter(function(n){return n.start>=nsSel.start-0.01&&n.start<nsSel.end})}
function drawBigWave(){
  var cv=$('bigWave');if(!cv||!nsPeaks.length)return;var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;ctx.fillStyle='#17110B';ctx.fillRect(0,0,W,H);
  function reg(seg,color){if(!seg)return;ctx.fillStyle=color;ctx.fillRect(seg.start/nsDur*W,0,(seg.end-seg.start)/nsDur*W,H)}
  reg(nsQuiet,'rgba(14,124,107,.35)');reg(nsClimax,'rgba(255,209,102,.28)');
  ctx.fillStyle='rgba(232,85,47,.38)';ctx.fillRect(nsSel.start/nsDur*W,0,(nsSel.end-nsSel.start)/nsDur*W,H);
  for(var x=0;x<W;x++){var p=nsPeaks[Math.floor(x/W*nsPeaks.length)]||0;var inSel=x>=nsSel.start/nsDur*W&&x<=nsSel.end/nsDur*W;ctx.fillStyle=inSel?'#FFB199':'#8A7A66';var h=Math.max(2,p*H*0.92);ctx.fillRect(x,(H-h)/2,1,h)}
  ctx.strokeStyle='#E8552F';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(nsSel.start/nsDur*W,0);ctx.lineTo(nsSel.start/nsDur*W,H);ctx.moveTo(nsSel.end/nsDur*W,0);ctx.lineTo(nsSel.end/nsDur*W,H);ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.fillText(nsFmt(nsSel.start),nsSel.start/nsDur*W+6,16);ctx.fillText(nsFmt(nsSel.end),Math.max(0,nsSel.end/nsDur*W-36),16);
  drawRoll();
}
function drawRoll(){
  var cv=$('roll');if(!cv)return;var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;ctx.fillStyle='#17110B';ctx.fillRect(0,0,W,H);
  var notes=selNotes();if(!notes.length){ctx.fillStyle='#fff';ctx.font='16px sans-serif';ctx.fillText('Đoạn này chưa có nốt nào — hãy kéo chọn đoạn khác',30,H/2);$('nsNoteList').textContent='—';return}
  var list=nsBentNotes||notes;
  var all=notes.concat(list),min=Math.min.apply(null,all.map(function(n){return n.midi}))-2,max=Math.max.apply(null,all.map(function(n){return n.midi}))+2,rng=Math.max(6,max-min);
  var dur=Math.max(1,nsSel.end-nsSel.start);
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.fillStyle='rgba(255,255,255,.65)';ctx.font='11px sans-serif';
  for(var m=min;m<=max;m+=2){var y=H-((m-min)/rng)*H;ctx.beginPath();ctx.moveTo(44,y);ctx.lineTo(W,y);ctx.stroke();ctx.fillText(noteName(m),6,y+4)}
  function drawSet(arr,fill,dy){arr.forEach(function(n){var x=44+(n.start-nsSel.start)/dur*(W-56),w=Math.max(14,n.dur/dur*(W-56)),y=H-((n.midi-min)/rng)*H+dy;var hh=Math.max(13,H/rng-4);var lowC=(n.conf!==undefined&&n.conf<0.6);ctx.fillStyle=lowC?'#9A8FB0':fill;ctx.beginPath();ctx.roundRect(x,y-hh/2,w,hh,7);ctx.fill();if(n===nsSelNoteRef){ctx.strokeStyle='#FFFFFF';ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle='#E8552F';ctx.lineWidth=1.5;ctx.stroke()}if(n.vib){ctx.strokeStyle='#FFFFFF';ctx.lineWidth=2;ctx.beginPath();for(var px=0;px<=w;px+=3){var yy=y-hh/2-4+Math.sin(px/3)*2.5;if(px===0)ctx.moveTo(x+px,yy);else ctx.lineTo(x+px,yy)}ctx.stroke()}if(w>30){ctx.fillStyle='#17110B';ctx.font='bold 11px sans-serif';ctx.fillText(noteName(n.midi)+(lowC?' ?':''),x+6,y+4)}})}
  if(nsBentNotes){drawSet(notes,'rgba(255,255,255,.45)',10);drawSet(list,'#FF7A4D',-10)}
  else drawSet(notes,'#FFD166',0);
  $('nsNoteList').innerHTML=(nsBentNotes?'<b style="color:var(--coral)">Bản đã bẻ nốt:</b> ':'<b>Giai điệu gốc:</b> ')+list.map(function(n){return noteName(n.midi)}).join(' → ');
}
function nsStats(){
  var notes=selNotes();if(!notes.length)return null;
  var midis=notes.map(function(n){return n.midi}),longest=notes.reduce(function(a,b){return b.dur>a.dur?b:a},notes[0]);
  var rep=0;for(var i=1;i<midis.length;i++)if(midis[i]===midis[i-1])rep++;
  return {count:notes.length,min:Math.min.apply(null,midis),max:Math.max.apply(null,midis),longest:longest,last:notes[notes.length-1],range:Math.max.apply(null,midis)-Math.min.apply(null,midis),rep:rep,density:notes.length/Math.max(1,nsSel.end-nsSel.start),isClimax:nsClimax&&nsSel.start>=nsClimax.start-1&&nsSel.start<nsClimax.end,isQuiet:nsQuiet&&nsSel.start>=nsQuiet.start-1&&nsSel.start<nsQuiet.end};
}
function updateSelUI(){
  var st=nsStats();$('selRange').textContent=nsFmt(nsSel.start)+' → '+nsFmt(nsSel.end);$('selDur').textContent='Dài '+((nsSel.end-nsSel.start).toFixed(1))+' giây — kéo trên sóng để đổi';
  if(!st){$('selNotes').textContent='0';$('selRangeNote').textContent='—';$('selScore').textContent='—';if($('selScoreWhy'))$('selScoreWhy').textContent='Đoạn này chưa có nốt nào — kéo chọn đoạn khác có giai điệu để xem điểm và lý do.';$('advGrid').innerHTML='';renderBreath();updateNoteEditInfo();return}
  $('selNotes').textContent=st.count+' nốt';$('selRangeNote').textContent=noteName(st.min)+' → '+noteName(st.max);
  var score=Math.min(98,Math.round(35+st.longest.dur*22+st.range*2.2+(st.isClimax?18:0)));
  $('selScore').textContent=score+'/100'+(score>=75?' 🔥 Rất đáng bẻ':score>=55?' — Khá tốt':' — Hát gần gốc sẽ hợp hơn');
  var whyS=[];if(st.longest.dur>=1)whyS.push('đoạn này hợp vì có nốt '+noteName(st.longest.midi)+' giữ dài '+st.longest.dur.toFixed(1).replace('.',',')+' giây — đủ chỗ để luyến / rung');if(st.range>=7)whyS.push('quãng giọng trong đoạn rộng '+st.range+' nửa cung nên có nhiều đất biến tấu');if(st.isClimax)whyS.push('đoạn nằm ngay vùng cao trào — khán giả đang chú ý nhất');if(st.count>=8)whyS.push('có '+st.count+' nốt, đủ chất liệu để chạy riff');if($('selScoreWhy'))$('selScoreWhy').textContent=whyS.length?('Vì sao điểm này: '+whyS.join('; ')+'.'):('Đoạn này ít nốt dài và quãng hẹp nên điểm thấp — ít “đất” để bẻ, hát gần như gốc sẽ hợp hơn.');
  renderAdvice(st,score);drawRoll();renderBreath();updateNoteEditInfo();
}
function renderAdvice(st,score){
  if(!st)return;
  var notes=selNotes(),L=st.longest,last=st.last||L,mxN=notes.reduce(function(a,b){return b.midi>a.midi?b:a},notes[0]||L);
  function d1(x){return (Math.round(x*10)/10).toFixed(1).replace('.',',')}
  var segDur=(nsSel.end-nsSel.start).toFixed(0);
  var cand=[
   {id:'melisma',icon:'〰️',name:'Luyến láy Melisma',pts:st.longest.dur>=0.6?38:8,
    why:'Nốt dài nhất trong đoạn là <b>'+noteName(L.midi)+'</b> giữ tới <b>'+d1(L.dur)+' giây</b> — khoảng trống hoàn hảo để kéo 1 từ thành đúng <b>5 nốt</b> thay vì hát thẳng.',
    sw:'đoạn có nốt '+noteName(L.midi)+' giữ dài '+d1(L.dur)+' giây — đủ chỗ chia thành 5 nốt con mà không vội',
    prac:['Hát nốt <b>'+noteName(L.midi)+'</b> trước, rồi luyến qua 5 nốt con — mỗi nốt con giữ khoảng <b>'+d1(L.dur/5)+' giây</b>, cả cụm vừa bằng nốt gốc '+d1(L.dur)+' giây.','Thở: lấy hơi ngay <b>trước nốt '+noteName(L.midi)+'</b> — đừng thở giữa cụm 5 nốt, sẽ đứt hơi và mất độ mượt.','Tập: <b>5 lần ở tốc độ 0,75×</b> (nút tốc độ trong khung Luyện tập), quen rồi hát <b>3 lần ở tốc độ chuẩn</b>.']},
   {id:'vibrato',icon:'💧',name:'Vibrato ở nốt cuối',pts:st.longest.dur>=0.6?34:10,
    why:'Đoạn có nốt giữ lâu — chỉ cần rung nhẹ ở <b>nửa sau</b> của nốt là câu hát lập tức đầy cảm xúc, dễ làm và ít rủi ro nhất.',
    sw:'có nốt giữ '+d1(L.dur)+' giây để chia đôi: nửa đầu hát thẳng, nửa sau mới rung',
    prac:['Giữ nốt <b>'+noteName(L.midi)+'</b> hát thẳng trong <b>'+d1(L.dur/2)+' giây đầu</b>, rồi mới bắt đầu rung ở <b>'+d1(L.dur/2)+' giây sau</b> — rung ngay từ đầu nốt nghe sẽ nặng và “già”. Trên piano-roll, nốt được áp vibrato có đường sóng trắng phía trên.','Thở: lấy hơi <b>trước nốt '+noteName(L.midi)+'</b> và thả lỏng hàm khi rung — gồng cổ là rung bị cứng, nghe như run rẩy.','Tập: <b>4 lần ở 0,75×</b> chỉ riêng nốt này, rồi <b>3 lần</b> liền trong cả đoạn ở tốc độ chuẩn.']},
   {id:'run',icon:'⚡',name:'Riff & Run cuối đoạn',pts:st.density>0.9?36:st.count>=6?24:8,
    why:'Đoạn có <b>'+st.count+' nốt</b> trong '+segDur+' giây — mật độ đủ dày để chạy một chùm nốt nhanh ở cuối mà không bị rối.',
    sw:'đoạn có '+st.count+' nốt trong '+segDur+' giây — mật độ đủ dày để chạy nốt mà không rối',
    prac:['Chạy 4 nốt con nhanh ngay trước nốt cuối <b>'+noteName(last.midi)+'</b> — mỗi nốt con chỉ khoảng <b>'+d1(Math.max(0.1,last.dur/5))+' giây</b>, rồi chốt nốt cuối và giữ như gốc.','Thở: lấy hơi <b>trước cả cụm chạy nốt</b> — cụm này ngắn, hát trọn trong một hơi, đừng thở giữa chừng.','Tập: <b>5 lần ở 0,5×</b>, rồi <b>3 lần ở 0,75×</b>, cuối cùng <b>2 lần tốc độ chuẩn</b>. Chạy chậm mà đều còn hơn nhanh mà rối.']},
   {id:'octave',icon:'🚀',name:'Nhảy quãng 8 ở nốt cao nhất',pts:st.isClimax?36:14,
    why:'Nốt cao nhất đoạn là <b>'+noteName(st.max)+'</b>'+(st.isClimax?' và đoạn này nằm ngay vùng cao trào (to nhất bài)':'')+' — bật nốt này lên 1 quãng 8 sẽ tạo cú nổ mà khán giả nhớ nhất.',
    sw:(st.isClimax?'đoạn nằm ở vùng cao trào và có nốt cao '+noteName(st.max)+' để bật lên':'có nốt cao '+noteName(st.max)+' đủ nổi bật để bật lên quãng 8'),
    prac:['Hát nốt <b>'+noteName(st.max)+'</b> như gốc ở lần xuất hiện đầu; ở lần lặp lại, bật lên <b>'+noteName(st.max+12)+'</b> (cao hơn đúng 1 quãng 8) và giữ khoảng <b>'+d1(mxN.dur)+' giây</b>.','Thở: lấy hơi thật sâu <b>ngay trước nốt bật lên</b> — đây là chỗ tốn hơi nhất của đoạn.','Tập: <b>3 lần ở 0,75×</b> riêng chỗ bật, rồi <b>2 lần cả đoạn</b> tốc độ chuẩn. Nếu phải gồng cổ mới tới, hãy dịch tông xuống ở mục Dịch tông phía trên thay vì cố hát.']},
   {id:'falsetto',icon:'🕊️',name:'Lật falsetto ở nốt cao',pts:st.isQuiet?36:16,
    why:(st.isQuiet?'Đây là đoạn yên của bài — ':'')+'Thay vì gồng lên nốt <b>'+noteName(st.max)+'</b>, lật sang giọng gió sẽ mong manh và rất riêng.',
    sw:(st.isQuiet?'đây là đoạn yên — giọng gió mỏng sẽ nổi bật hẳn lên':'nốt cao '+noteName(st.max)+' lật giọng gió sẽ khác hẳn cảm giác gồng giọng thật'),
    prac:['Hát nốt <b>'+noteName(st.max)+'</b> bằng giọng thật thật ngắn (khoảng 0,2 giây) rồi <b>lật sang giọng gió</b> giữ phần còn lại — tiếng gió phải <b>nhẹ hơn, nhỏ hơn và nhiều hơi thở</b> hơn giọng thật, chứ không chỉ là hát cao hơn 1 quãng 8.','Thở: lấy hơi vừa phải <b>trước nốt '+noteName(st.max)+'</b>, thở ra đều và nhẹ suốt nốt gió — thổi hơi mạnh quá sẽ vỡ về giọng thật.','Tập: <b>5 lần ở 0,75×</b> riêng nốt này để tìm đúng điểm “lật”, rồi <b>3 lần</b> trong cả đoạn.']},
   {id:'bend',icon:'↗️',name:'Bẻ nốt / trượt nốt',pts:st.rep>=2?34:15,
    why:'Đoạn có <b>'+st.rep+' chỗ lặp lại cùng một nốt</b> — trượt xuống <b>2 nửa cung</b> rồi trở về đúng nốt trong thang âm ngay trước khi vào nốt sẽ phá sự đơn điệu ngay lập tức.',
    sw:'đoạn có '+st.rep+' chỗ lặp lại cùng một nốt — trượt vào nốt sẽ phá ngay sự đơn điệu',
    prac:['Ở nốt bị lặp, bắt đầu hát <b>thấp hơn nốt chính 2 nửa cung</b> trong khoảng <b>30% thời lượng nốt</b>, rồi trượt lên về đúng nốt chính và giữ <b>70% còn lại</b>.','Thở: không cần lấy hơi riêng cho chỗ trượt — nó nằm gọn trong một hơi của câu, cứ thở như khi hát câu gốc.','Tập: <b>5 lần ở 0,75×</b> để nghe rõ tiếng trượt, rồi <b>3 lần tốc độ chuẩn</b> — trượt phải nghe như cố ý, không phải hát sai nốt.']}
  ];
  cand.sort(function(a,b){return b.pts-a.pts});var top=cand.slice(0,3);
  if(!nsBend)nsBend=top[0].id;
  $('advGrid').innerHTML='';
  top.forEach(function(c,i){var d=document.createElement('div');d.className='adv'+(i===0?' best':'');d.innerHTML='<div style="display:flex;justify-content:space-between;align-items:start"><span style="font-size:28px">'+c.icon+'</span><span class="score">'+c.pts+'<small style="font-size:13px;color:var(--muted)">/40 điểm hợp</small></span></div><div style="font-size:12px;color:var(--muted);margin-top:2px">Điểm này vì: '+c.sw+'.</div><h3 style="margin:8px 0 6px">'+(i===0?'⭐ Hợp nhất — ':'')+c.name+'</h3><p style="color:var(--muted);font-size:13.5px;margin:0 0 10px">'+c.why+'</p><div style="background:var(--bg);border:1px dashed var(--line);border-radius:10px;padding:9px 11px;font-size:13px;margin:0 0 12px">🗣️ <strong>Cách hát cụ thể:</strong><br>• '+c.prac.join('<br>• ')+'</div><button class="btn '+(nsBend===c.id?'btn-coral':'btn-ghost')+'" style="width:100%">'+(nsBend===c.id?'✓ Đang áp dụng — nghe nút C bên trên':'Áp dụng & vẽ lại nốt')+'</button>';d.querySelector('button').onclick=function(){applyBend(c.id);renderAdvice(nsStats(),score)};$('advGrid').appendChild(d)});
}
function applyBend(id){
  nsBend=id;var notes=selNotes().map(function(n){return {start:n.start,dur:n.dur,midi:n.midi,conf:n.conf,vib:n.vib,fal:n.fal}});if(!notes.length)return;
  var scale=scaleNotes();
  function nearestScale(m){var best=scale[0],bd=99;scale.forEach(function(s){var pc=s%12,mm=m-(m%12)+pc;if(mm<m-6)mm+=12;if(Math.abs(mm-m)<bd){bd=Math.abs(mm-m);best=mm}});return best}
  if(id==='melisma'){var li=0;notes.forEach(function(n,i){if(n.dur>notes[li].dur)li=i});var L=notes[li],base=nearestScale(L.midi),steps=[0,2,4,2,0].map(function(o){return nearestScale(base+o)});var seg=steps.map(function(m,i){return {start:L.start+L.dur*i/steps.length,dur:L.dur/steps.length,midi:m}});notes.splice.apply(notes,[li,1].concat(seg))}
  else if(id==='run'){var last=notes[notes.length-1],base=nearestScale(last.midi),steps=[4,2,0,-2].map(function(o){return nearestScale(base+o)});var seg=steps.map(function(m,i){return {start:last.start+last.dur*i/(steps.length+1),dur:last.dur/(steps.length+1),midi:m}});seg.push({start:last.start+last.dur*steps.length/(steps.length+1),dur:last.dur/(steps.length+1),midi:last.midi});notes.splice.apply(notes,[notes.length-1,1].concat(seg))}
  else if(id==='octave'){var mx=Math.max.apply(null,notes.map(function(n){return n.midi}));notes.forEach(function(n){if(n.midi===mx)n.midi+=12})}
  else if(id==='vibrato'){var li2=0;notes.forEach(function(n,i){if(n.dur>notes[li2].dur)li2=i});notes[li2].vib=true}
  else if(id==='falsetto'){var last2=notes[notes.length-1];last2.midi+=12;last2.fal=true}
  else if(id==='bend'){var out=[];notes.forEach(function(n){if(n.dur>=0.5){out.push({start:n.start,dur:n.dur*0.3,midi:nearestScale(n.midi-2)});out.push({start:n.start+n.dur*0.3,dur:n.dur*0.7,midi:n.midi})}else out.push(n)});notes=out}
  nsBentNotes=notes;drawBigWave();saveState();toast('Đã bẻ nốt — ô cam trên piano-roll là giai điệu mới. Bấm C để nghe!');
  document.querySelectorAll('.nsStep').forEach(function(s){s.classList.toggle('active',s.dataset.nsstep==='4')});
}
/* --- instrument synth --- */
function instTone(midi,t,dur,inst,vibrato,falsetto){
  var c=ac(),o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();f.type='lowpass';var fq=freq(midi);
  var peak=0.30,att=0.02,dec=dur;
  if(inst==='piano'){o.type='triangle';o2.type='sine';o.frequency.value=fq;o2.frequency.value=fq*2;f.frequency.value=3800}
  else if(inst==='guitar'){o.type='sawtooth';o2.type='triangle';o.frequency.value=fq;o2.frequency.value=fq;f.frequency.value=1700;peak=0.22;dec=Math.min(dur,0.9)}
  else if(inst==='violin'){o.type='sawtooth';o2.type='sawtooth';o.frequency.value=fq;o2.frequency.value=fq*1.003;f.frequency.value=2600;att=0.09;peak=0.18}
  else if(inst==='flute'){o.type='sine';o2.type='sine';o.frequency.value=fq;o2.frequency.value=fq*2;f.frequency.value=3000;att=0.06;peak=0.26}
  else{o.type='sine';o2.type='sine';o.frequency.value=fq;o2.frequency.value=fq*3;f.frequency.value=5000;peak=0.24;dec=Math.min(dur,0.7)}
  if(falsetto){o.type='sine';o2.type='sine';o2.frequency.value=fq;peak=0.13;att=0.05;f.frequency.value=2400}
  if(inst==='violin'||inst==='flute'||vibrato){var lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=5.4;var vibStart=vibrato==='late'?t+dur*0.5:t+0.12;if(vibrato==='late'){lg.gain.setValueAtTime(0,t);lg.gain.setValueAtTime(0,vibStart);lg.gain.linearRampToValueAtTime(fq*0.014,vibStart+0.18)}else lg.gain.value=fq*0.012;lfo.connect(lg);lg.connect(o.frequency);lg.connect(o2.frequency);lfo.start(t);lfo.stop(t+dur+0.1)}
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+att);if(inst==='violin'||inst==='flute'){g.gain.setValueAtTime(peak*0.85,t+Math.max(att,dur-0.12));g.gain.linearRampToValueAtTime(0.001,t+dur)}else{g.gain.exponentialRampToValueAtTime(0.001,t+dec)}
  if(falsetto){try{var nb=c.createBuffer(1,Math.max(1,Math.floor(c.sampleRate*dur)),c.sampleRate),chN=nb.getChannelData(0);for(var ni=0;ni<chN.length;ni++)chN[ni]=(Math.random()*2-1)*0.6;var nsrc=c.createBufferSource();nsrc.buffer=nb;var nf=c.createBiquadFilter();nf.type='bandpass';nf.frequency.value=Math.min(6000,fq*2);nf.Q.value=1.1;var ng=c.createGain();ng.gain.setValueAtTime(0.045,t);ng.gain.exponentialRampToValueAtTime(0.001,t+dur);nsrc.connect(nf);nf.connect(ng);ng.connect(c.destination);nsrc.start(t);nsrc.stop(t+dur+0.05)}catch(e){}}
  o.connect(f);o2.connect(f);f.connect(g);g.connect(c.destination);o.start(t);o2.start(t);o.stop(t+dur+0.1);o2.stop(t+dur+0.1);
}
function playNoteList(list,inst,useVibrato,label,onDone){
  if(!list||!list.length){toast('Hãy chọn đoạn có nốt trước nhé');return}
  var sp=(typeof practiceSpeed!=='undefined'&&practiceSpeed>0)?practiceSpeed:1; /* tập chậm áp cho cả synth: kéo dài thời gian theo hệ số tốc độ, cao độ giữ nguyên */
  var c=ac(),t0=c.currentTime+0.08,base=list[0].start,total=0;
  list.forEach(function(n){var rel=(n.start-base)/sp,dur=Math.max(0.22,n.dur/sp);total=Math.max(total,rel+dur);instTone(n.midi,t0+rel,dur,inst,n.vib?'late':useVibrato,!!n.fal)});
  toast(label+' ('+total.toFixed(1)+' giây'+(sp!==1?', tốc độ tập '+sp+'×':'')+') ♪');
  var st=Date.now(),doneCalled=false;clearInterval(nsPlayTimer);nsPlayTimer=setInterval(function(){var p=(Date.now()-st)/(total*1000);$('nsProg').style.width=Math.min(100,p*100)+'%';if(p>=1){clearInterval(nsPlayTimer);$('nsProg').style.width='0';if(onDone&&!doneCalled){doneCalled=true;onDone()}}},100);
}
/* --- wiring --- */
$('instGrid').addEventListener('click',function(e){var b=e.target.closest('[data-inst]');if(!b)return;document.querySelectorAll('[data-inst]').forEach(function(x){x.classList.remove('active')});b.classList.add('active');nsInst=b.dataset.inst;var n=selNotes()[0];if(n)instTone(n.midi,ac().currentTime+0.03,0.6,nsInst,false);toast('Đã chọn nhạc cụ: '+b.textContent.trim())});
$('segChips').addEventListener('click',function(e){var b=e.target.closest('[data-seg]');if(!b||!nsDur)return;document.querySelectorAll('[data-seg]').forEach(function(x){x.classList.remove('active')});b.classList.add('active');nsBentNotes=null;
  if(b.dataset.seg==='all')nsSel={start:0,end:nsDur};else if(b.dataset.seg==='climax')nsSel={start:nsClimax.start,end:nsClimax.end};else if(b.dataset.seg==='quiet')nsSel={start:nsQuiet.start,end:nsQuiet.end};else if(b.dataset.seg==='first')nsSel={start:0,end:Math.min(10,nsDur)};else nsSel={start:Math.max(0,nsDur-10),end:nsDur};
  drawBigWave();updateSelUI();saveState();toast('Đã chọn đoạn '+nsFmt(nsSel.start)+' → '+nsFmt(nsSel.end))});
(function(){var cv=$('bigWave'),drag=null;
  function toTime(ev){var r=cv.getBoundingClientRect();var x=(ev.touches?ev.touches[0].clientX:ev.clientX)-r.left;return Math.max(0,Math.min(nsDur,x/r.width*nsDur))}
  function down(ev){if(!nsDur)return;drag=toTime(ev);nsSel={start:drag,end:drag};nsBentNotes=null;drawBigWave()}
  function move(ev){if(drag===null||!nsDur)return;var t=toTime(ev);nsSel={start:Math.min(drag,t),end:Math.max(drag,t)};drawBigWave()}
  function up(){if(drag===null)return;drag=null;if(nsSel.end-nsSel.start<1){nsSel.end=Math.min(nsDur,nsSel.start+3)}drawBigWave();updateSelUI();saveState();document.querySelectorAll('.nsStep').forEach(function(s){s.classList.toggle('active',s.dataset.nsstep==='2')});toast('Đã khoanh đoạn '+nsFmt(nsSel.start)+' → '+nsFmt(nsSel.end)+' — xem nốt & tư vấn bên dưới')}
  cv.addEventListener('pointerdown',down);cv.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
})();
$('roll').addEventListener('click',function(ev){var notes=nsBentNotes||selNotes();if(!notes.length)return;var cv=$('roll'),r=cv.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*cv.width;var dur=Math.max(1,nsSel.end-nsSel.start);var t=nsSel.start+(x-44)/(cv.width-56)*dur;var hit=notes.filter(function(n){return t>=n.start&&t<=n.start+n.dur})[0];if(hit){nsSelNoteRef=hit;instTone(hit.midi,ac().currentTime+0.03,0.7,nsInst,hit.vib?'late':false,!!hit.fal);drawRoll();updateNoteEditInfo();toast('Đã chọn nốt '+noteName(hit.midi)+' — sửa nó ở khung “Sửa nốt ngay trên piano-roll” bên dưới')}});
/* ===== SỬA NỐT TRỰC TIẾP TRÊN PIANO-ROLL ===== */
function activeEditList(){return nsBentNotes||selNotes()}
function confTxt(n){if(n.conf===undefined)return 'chắc (nốt do bạn/Studio đã chốt)';return n.conf>=0.6?('chắc — độ tin cậy khoảng '+Math.round(n.conf*100)+'%'):('⚠ chưa chắc — độ tin cậy chỉ khoảng '+Math.round(n.conf*100)+'%, hãy nghe lại bằng tai và sửa nếu sai')}
function updateNoteEditInfo(){var info=$('noteEditInfo');if(!info)return;var n=nsSelNoteRef;
  if(!n||activeEditList().indexOf(n)<0){info.innerHTML='Chưa chọn nốt nào — <strong>bấm vào một ô nốt trên piano-roll</strong> để chọn. Nốt viền trắng = đang chọn • Nốt tím xám có dấu “?” = Studio chưa chắc chắn về nốt đó, hãy nghe lại bằng tai rồi sửa nếu sai.';return}
  info.innerHTML='Đang chọn nốt <strong style="font-size:19px;color:var(--coral)">'+noteName(n.midi)+'</strong> — giữ <strong>'+n.dur.toFixed(1).replace('.',',')+' giây</strong>, bắt đầu ở '+nsFmt(n.start)+' • Độ tin cậy: <strong>'+confTxt(n)+'</strong>'+(n.vib?' • Đang áp vibrato (rung ở nửa sau nốt)':'')+(n.fal?' • Đang áp falsetto (giọng gió)':'')}
function afterNoteEdit(){if(nsSelNoteRef&&activeEditList().indexOf(nsSelNoteRef)<0)nsSelNoteRef=null;drawBigWave();updateSelUI();updateTransposeUI();updateNoteEditInfo();saveState()}
function needSelNote(){if(!nsSelNoteRef||activeEditList().indexOf(nsSelNoteRef)<0){toast('Hãy bấm vào một nốt trên piano-roll để chọn nó trước nhé');return false}return true}
function noteHomeArray(ref){return (nsBentNotes&&nsBentNotes.indexOf(ref)>=0)?nsBentNotes:nsNotes}
$('neUp').onclick=function(){if(!needSelNote())return;nsSelNoteRef.midi=Math.min(96,nsSelNoteRef.midi+1);instTone(nsSelNoteRef.midi,ac().currentTime+0.03,0.5,nsInst,false);afterNoteEdit();toast('Đã nâng nốt lên 1 nửa cung → '+noteName(nsSelNoteRef.midi)+' — tư vấn đã tính lại theo nốt mới')};
$('neDown').onclick=function(){if(!needSelNote())return;nsSelNoteRef.midi=Math.max(36,nsSelNoteRef.midi-1);instTone(nsSelNoteRef.midi,ac().currentTime+0.03,0.5,nsInst,false);afterNoteEdit();toast('Đã hạ nốt xuống 1 nửa cung → '+noteName(nsSelNoteRef.midi)+' — tư vấn đã tính lại theo nốt mới')};
$('neDel').onclick=function(){if(!needSelNote())return;var arr=noteHomeArray(nsSelNoteRef),ix=arr.indexOf(nsSelNoteRef);if(ix>=0)arr.splice(ix,1);var nm=noteName(nsSelNoteRef.midi);nsSelNoteRef=null;afterNoteEdit();toast('Đã xoá nốt '+nm+' — tư vấn và bản đồ (khi chốt) sẽ dùng dãy nốt mới')};
$('neSplit').onclick=function(){if(!needSelNote())return;var ref=nsSelNoteRef;if(ref.dur<0.3){toast('Nốt này ngắn quá (dưới 0,3 giây) — tách đôi nữa sẽ thành nốt vụn, nghe không rõ');return}var od=ref.dur;ref.dur=od/2;var nn={start:ref.start+od/2,dur:od-od/2,midi:ref.midi,rms:ref.rms,conf:ref.conf};var arr=noteHomeArray(ref);arr.splice(arr.indexOf(ref)+1,0,nn);nsSelNoteRef=nn;afterNoteEdit();toast('Đã tách nốt '+noteName(ref.midi)+' làm đôi — giờ bạn có thể sửa riêng nửa sau')};
$('neMerge').onclick=function(){if(!needSelNote())return;var list=activeEditList(),ix=list.indexOf(nsSelNoteRef),next=list[ix+1];if(!next){toast('Không còn nốt kề phía sau trong đoạn này để gộp');return}var ref=nsSelNoteRef;ref.dur=(next.start+next.dur)-ref.start;var arr=noteHomeArray(next),jx=arr.indexOf(next);if(jx>=0)arr.splice(jx,1);afterNoteEdit();toast('Đã gộp nốt '+noteName(next.midi)+' vào nốt đang chọn — nốt giờ giữ '+ref.dur.toFixed(1).replace('.',',')+' giây')};
$('neCheck').onclick=function(){var list=activeEditList();if(!list.length){toast('Hãy chọn đoạn có nốt trước nhé');return}playNoteList(list.slice(),nsInst,false,'🔊 Nghe kiểm tra — phát lần lượt '+list.length+' nốt trong đoạn để bạn đối chiếu với tai nghe')};
$('playInstBtn').onclick=function(){nsBentNotes=null;drawBigWave();playNoteList(selNotes(),nsInst,false,'🎹 Nhạc cụ đang phát lại giai điệu GỐC')};
$('playBentBtn').onclick=function(){if(!nsBentNotes)applyBend(nsBend||'melisma');playNoteList(nsBentNotes,nsInst,false,'✨ Bản ĐÃ BẺ NỐT bằng '+nsInst)};
$('playOrigSegBtn').onclick=function(){
  if(!nsIsDemo&&audio.src&&audio.duration){setupGraph();audio.currentTime=nsSel.start;audio.play();toast('▶ Đang phát đoạn gốc '+nsFmt(nsSel.start)+' → '+nsFmt(nsSel.end));var iv=setInterval(function(){if(audio.paused){clearInterval(iv);return}if(audio.currentTime>=nsSel.end){bumpPractice();if(practiceLoop){audio.currentTime=nsSel.start}else{audio.pause();clearInterval(iv)}}},200)}
  else{playNoteList(selNotes(),'flute',true,'▶ Bản gốc (mẫu) — phát bằng tiếng sáo có rung giọng')}
};
$('nsResetBendBtn').onclick=function(){nsBentNotes=null;nsBend=null;drawBigWave();updateSelUI();toast('Đã trở về giai điệu gốc')};
$('nsAddPlanBtn').onclick=function(){var st=nsStats();if(!st){toast('Hãy chọn đoạn có nốt trước');return}var names={melisma:'Luyến láy Melisma',vibrato:'Vibrato',run:'Riff & Run',octave:'Nhảy quãng 8',falsetto:'Lật falsetto',bend:'Bẻ / trượt nốt'};addPlan('Đoạn '+nsFmt(nsSel.start)+'–'+nsFmt(nsSel.end)+' ('+noteName(st.min)+'→'+noteName(st.max)+') — '+(names[nsBend]||'Bẻ nốt')+' • Nghe lại bằng '+nsInst+': '+(nsBentNotes||selNotes()).map(function(n){return noteName(n.midi)}).join(' → '))};
$('nsDemoBtn').onclick=function(){makeDemoNS();toast('Đã tạo bài mẫu — hãy kéo chọn đoạn trên sóng âm!')};
/* Nút bước 1–4 trong Note Studio: bấm vào là LÀM ĐÚNG VIỆC của bước đó */
function setNsStep(n){document.querySelectorAll('.nsStep').forEach(function(x){x.classList.toggle('active',x.dataset.nsstep===String(n))})}
document.querySelectorAll('.nsStep').forEach(function(s){s.addEventListener('click',function(){
  var n=s.dataset.nsstep;setNsStep(n);
  if(!nsNotes.length){document.getElementById('upload').scrollIntoView({behavior:'smooth'});toast('Chưa có nốt nhạc nào — tải file ở mục 1, hoặc bấm “Tạo bài mẫu” trong Note Studio trước nhé');return}
  if(n==='1'){$('bigWave').scrollIntoView({behavior:'smooth',block:'center'});drawBigWave();toast('Bước 1: sóng âm ở trên, piano-roll ngay bên dưới — ô càng dài = nốt giữ càng lâu, ô càng cao = nốt càng cao')}
  else if(n==='2'){if(nsClimax){nsSel={start:nsClimax.start,end:nsClimax.end};nsBentNotes=null;drawBigWave();updateSelUI()}$('bigWave').scrollIntoView({behavior:'smooth',block:'center'});toast('Bước 2: đã khoanh sẵn đoạn cao trào (vùng vàng) cho bạn — hoặc tự kéo chuột / ngón tay trên sóng để chọn đoạn khác')}
  else if(n==='3'){setNsStep(3);$('instGrid').scrollIntoView({behavior:'smooth',block:'center'});playNoteList(selNotes(),nsInst,false,'🎹 Bước 3 · Nhạc cụ '+nsInst+' đang phát lại giai điệu gốc')}
  else if(n==='4'){$('advGrid').scrollIntoView({behavior:'smooth',block:'center'});var best=$('advGrid').querySelector('.adv.best button');toast('Bước 4: thẻ viền cam là chiêu hợp nhất với đoạn này (điểm hợp cao nhất) — bấm “Áp dụng & vẽ lại nốt” trên thẻ đó, rồi bấm nút C để nghe bản đã bẻ')}
})});
/* ================= VÒNG 2: KIỂM TRA GIỌNG + DỊCH TÔNG + LUYỆN TẬP + HÁT THỬ ================= */
var voiceRange=null,nsShiftTotal=0,practiceCount=0,practiceLoop=false,practiceToken=0,nbnTimer=null,singBusy=false,voiceBusy=false;
var DEFAULT_RANGE={low:57,high:72}; /* A3 → C5: quãng mặc định khi chưa đo giọng */
function effRange(){return voiceRange||DEFAULT_RANGE}
function medianOf(a){var s=a.slice().sort(function(x,y){return x-y});return s[Math.floor(s.length/2)]}
function fillVoiceSelects(){var lo=$('voiceLowSel'),hi=$('voiceHighSel');if(!lo||lo.options.length)return;for(var m=48;m<=79;m++){var o1=document.createElement('option');o1.value=m;o1.textContent=noteName(m)+' — '+Math.round(freq(m))+' Hz';lo.appendChild(o1);var o2=document.createElement('option');o2.value=m;o2.textContent=noteName(m)+' — '+Math.round(freq(m))+' Hz';hi.appendChild(o2)}lo.value='57';hi.value='72'}
function buildMiniPiano(){var p=$('miniPiano');if(!p||p.children.length)return;[60,62,64,65,67,69,71,72,74,76,77,79,81,83].forEach(function(m){var b=document.createElement('button');b.type='button';b.className='wk'+(m===72?' sel':'');b.textContent=noteName(m);b.onclick=function(){document.querySelectorAll('#miniPiano .wk').forEach(function(x){x.classList.remove('sel')});b.classList.add('sel');$('voiceHighSel').value=String(m);playTone(m,ac().currentTime+0.02,0.7);toast('Nốt cao nhất bạn chọn: '+noteName(m)+' — bấm “Dùng quãng giọng này” để chốt')};p.appendChild(b)})}
fillVoiceSelects();buildMiniPiano();
function renderVoiceResult(){var box=$('voiceResult');if(!box)return;if(voiceRange){box.innerHTML='🎉 <strong>Bạn hát được từ '+noteName(voiceRange.low)+' tới '+noteName(voiceRange.high)+'</strong> — mọi nốt nằm trong khoảng này bạn đều hát thoải mái, không phải gồng. Gợi ý dịch tông bên dưới và tư vấn trong Note Studio sẽ canh theo đúng quãng giọng này của bạn.'}else{box.innerHTML='<strong>Chưa kiểm tra giọng</strong> — tư vấn dịch tông sẽ dùng quãng mặc định (A3 → C5, quãng phổ biến của nhiều người). Đo giọng ở trên để gợi ý chính xác cho riêng bạn.'}}
function setVoiceRange(low,high,how){if(high<=low){toast('Nốt cao nhất phải cao hơn nốt thấp nhất — kiểm tra lại giúp mình nhé');return}voiceRange={low:low,high:high};renderVoiceResult();updateTransposeUI();toast('Đã nhớ quãng giọng của bạn: '+noteName(low)+' → '+noteName(high)+' ('+how+')')}
$('voiceManualBtn').onclick=function(){setVoiceRange(+$('voiceLowSel').value,+$('voiceHighSel').value,'chọn tay')};
/* --- đo quãng giọng bằng micro: hát giữ nốt ~2 giây, lấy trung vị cao độ đo bằng autocorrelation --- */
function capturePitch(durSec,liveCb){return new Promise(function(resolve,reject){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){reject(new Error('nomedia'));return}
  navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}}).then(function(stream){
    var c=ac(),src=c.createMediaStreamSource(stream),an=c.createAnalyser();an.fftSize=2048;src.connect(an);
    var buf=new Float32Array(an.fftSize),vals=[],t0=performance.now();
    var iv=setInterval(function(){an.getFloatTimeDomainData(buf);var f=autoCorr(buf,c.sampleRate);if(f>55&&f<1400){var m=69+12*Math.log2(f/440);vals.push(m);if(liveCb)liveCb(m)}
      if(performance.now()-t0>=durSec*1000){clearInterval(iv);stream.getTracks().forEach(function(t){t.stop()});resolve(vals.length>=6?Math.round(medianOf(vals)):null)}},70);
  }).catch(reject)})}
$('voiceMicBtn').onclick=function(){
  if(voiceBusy)return;voiceBusy=true;var st=$('voiceMicStatus');
  function live(m){var el=$('voiceLive');if(el)el.textContent=noteName(Math.round(m))}
  function fail(msg){st.innerHTML='⚠️ '+msg;voiceBusy=false}
  st.innerHTML='🎙️ <strong>Bước 1/2:</strong> Hát nốt <strong>THẤP NHẤT</strong> bạn hát thoải mái, giữ đều… Nốt Studio đang nghe: <b id="voiceLive" style="color:var(--coral);font-size:19px">—</b>';
  capturePitch(2.4,live).then(function(low){
    if(low===null){fail('Chưa nghe rõ nốt nào — hát to và đều hơn một chút, giữ nốt lâu hơn rồi bấm đo lại nhé.');return}
    st.innerHTML='✓ Nốt thấp nhất của bạn: <strong>'+noteName(low)+'</strong>. 🎙️ <strong>Bước 2/2:</strong> Giờ hát nốt <strong>CAO NHẤT</strong> bạn hát thoải mái (đừng hét), giữ đều… Nốt đang nghe: <b id="voiceLive" style="color:var(--coral);font-size:19px">—</b>';
    capturePitch(2.4,live).then(function(high){
      voiceBusy=false;
      if(high===null){st.innerHTML='⚠️ Chưa nghe rõ nốt cao — bấm đo lại, hát to và đều hơn nhé.';return}
      if(high<=low){st.innerHTML='⚠️ Hai nốt nghe được chưa hợp lệ (nốt cao phải cao hơn nốt thấp) — bấm đo lại nhé.';return}
      st.innerHTML='✓ Xong! Nốt thấp nhất <strong>'+noteName(low)+'</strong> — nốt cao nhất <strong>'+noteName(high)+'</strong>.';
      setVoiceRange(low,high,'đo bằng micro');
    }).catch(function(){fail('Không dùng được micro ở bước 2 — trình duyệt chưa cấp quyền hoặc micro đang bận. Kiểm tra quyền micro của trang rồi thử lại, hoặc dùng Cách 2 (chọn nốt bằng đàn piano mini).')});
  }).catch(function(){fail('Không dùng được micro: trình duyệt chưa cấp quyền dùng micro cho trang này (hoặc thiết bị không có micro). Hãy bấm “Cho phép” khi trình duyệt hỏi, hoặc dùng Cách 2 bên cạnh — chọn nốt bằng đàn piano mini.')});
};
/* --- dịch tông cho vừa giọng: thử mọi mức −12..+12, chọn mức ít nốt ngoài quãng nhất --- */
function countOut(shift){var r=effRange(),out=0,hi=0,lo=0;nsNotes.forEach(function(n){var m=n.midi+shift;if(m>r.high){out++;hi++}else if(m<r.low){out++;lo++}});return{out:out,hi:hi,lo:lo}}
function bestShift(){var best={shift:0,out:1e9,hi:0,lo:0};for(var s=-12;s<=12;s++){var c=countOut(s);if(c.out<best.out||(c.out===best.out&&Math.abs(s)<Math.abs(best.shift)))best={shift:s,out:c.out,hi:c.hi,lo:c.lo}}return best}
function updateTransposeUI(){var box=$('transposeBox');if(!box)return;var r=effRange();
  if(!nsNotes.length){box.innerHTML='<strong>🎚️ Dịch tông cho vừa giọng</strong><p style="margin:6px 0 0;color:var(--muted);font-size:14.5px">Hãy tải bài hát ở mục 1 (hoặc tạo bài mẫu) — khi bài đã thành nốt nhạc, Studio sẽ tự tính số nửa cung nên dịch theo quãng giọng '+(voiceRange?'của bạn ('+noteName(r.low)+' → '+noteName(r.high)+')':'mặc định (A3 → C5)')+'.</p>';return}
  var now=countOut(0),b=bestShift();
  var dirTxt=b.shift===0?'Bài này <strong>đã vừa giọng bạn rồi</strong> — không cần dịch tông!':('Bài này nên <strong>'+(b.shift<0?'hạ '+Math.abs(b.shift):'nâng +'+b.shift)+' nửa cung</strong> thì bạn hát thoải mái nhất');
  var remain=b.out===0?'không còn nốt nào nằm ngoài quãng giọng của bạn 🎉':('vẫn còn '+b.out+' nốt ngoài quãng ('+b.hi+' nốt quá cao, '+b.lo+' nốt quá thấp) — dịch thêm nữa sẽ làm nhiều nốt khác lệch ra ngoài hơn, nên đây là mức tốt nhất');
  box.innerHTML='<strong>🎚️ Dịch tông cho vừa giọng</strong> <span style="color:var(--muted);font-size:13px">(quãng giọng đang dùng: '+noteName(r.low)+' → '+noteName(r.high)+(voiceRange?'':' — mặc định, bạn chưa đo giọng')+')</span><p style="margin:8px 0 0;font-size:15.5px">Hiện tại bài có <strong>'+now.out+'/'+nsNotes.length+' nốt</strong> nằm ngoài quãng giọng của bạn ('+now.hi+' nốt quá cao, '+now.lo+' nốt quá thấp).<br>'+dirTxt+' — sau khi dịch: '+remain+'.</p>'+(nsShiftTotal!==0?'<p style="margin:6px 0 0;font-size:14px;color:var(--teal);font-weight:700">Bài hiện đang ở tông đã dịch '+(nsShiftTotal>0?'+':'')+nsShiftTotal+' nửa cung so với bản gốc.</p>':'')+(b.shift!==0?'<button class="btn btn-coral" id="applyTransposeBtn" type="button" style="margin-top:10px">🎚️ Áp dụng dịch tông ('+(b.shift>0?'+':'')+b.shift+' nửa cung)</button>':'')+'<p style="font-size:13px;color:var(--muted);margin:10px 0 0">Khi áp dụng: <strong>toàn bộ nốt đã tách sẽ dịch theo</strong> — piano-roll vẽ lại, nhạc cụ giả lập phát theo tông mới, tư vấn bẻ nốt tính trên nốt đã dịch. Bản audio gốc giữ nguyên cao độ (xem ghi chú trung thực ngay dưới mục này).</p>';
  var btn=$('applyTransposeBtn');if(btn)btn.onclick=applyTranspose;
}
function applyTranspose(){var b=bestShift();if(!b||b.shift===0){toast('Bài đã vừa giọng rồi — không cần dịch tông nữa');return}
  nsNotes.forEach(function(n){n.midi+=b.shift});nsShiftTotal+=b.shift;nsBentNotes=null;
  drawBigWave();updateSelUI();updateTransposeUI();
  addPlan('Dịch tông '+(b.shift<0?'hạ '+Math.abs(b.shift):'nâng +'+b.shift)+' nửa cung cho vừa giọng ('+noteName(effRange().low)+' → '+noteName(effRange().high)+') — sau khi dịch còn '+b.out+' nốt ngoài quãng giọng');
  toast('Đã dịch tông '+(b.shift>0?'+':'')+b.shift+' nửa cung — piano-roll và nhạc cụ giờ phát theo tông mới, vừa giọng bạn hơn rồi!')}
/* --- chế độ luyện tập --- */
function bumpPractice(){practiceCount++;var el=$('practiceCount');if(el)el.textContent=practiceCount;if(practiceCount===3)toast('🎉 Đủ 3 lần rồi! Hát thấy thoải mái là đạt — chốt đoạn này vào bản đồ cover thôi')}
function practicePlay(){var list=nsBentNotes||selNotes();if(!list.length){toast('Hãy chọn đoạn có nốt trước nhé');return}var tok=++practiceToken;
  (function once(){playNoteList(list,nsInst,false,'🏃 Đang luyện đoạn bằng '+nsInst+' — hát theo nhé',function(){if(tok!==practiceToken)return;bumpPractice();if(practiceLoop){setTimeout(function(){if(tok===practiceToken)once()},500)}})})()}
$('practicePlayBtn').onclick=practicePlay;
$('loopBtn').onclick=function(){practiceLoop=!practiceLoop;this.classList.toggle('active',practiceLoop);this.setAttribute('aria-pressed',String(practiceLoop));this.textContent=practiceLoop?'🔁 Lặp đoạn: Đang bật':'🔁 Lặp đoạn: Đang tắt';if(!practiceLoop)practiceToken++;toast(practiceLoop?'Đã bật lặp đoạn — đoạn sẽ phát đi phát lại, mỗi vòng tính là 1 lần tập':'Đã tắt lặp đoạn')};
document.querySelectorAll('[data-pspeed]').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('[data-pspeed]').forEach(function(x){x.classList.remove('active')});b.classList.add('active');setPracticeSpeed(b.dataset.pspeed);toast('Tốc độ luyện tập: '+b.dataset.pspeed.replace('.',',')+'× — áp cho cả audio gốc (giữ nguyên cao độ) lẫn nhạc cụ giả lập')})});
function noteByNote(){var list=nsBentNotes||selNotes();if(!list.length){toast('Hãy chọn đoạn có nốt trước nhé');return}if(nbnTimer)clearTimeout(nbnTimer);var sp=practiceSpeed||1,i=0,big=$('bigNoteName');toast('Nghe từng nốt — tên nốt hiện to ở giữa khung, hát theo từng nốt một nhé');
  (function step(){if(i>=list.length){big.textContent='✓ Xong — giờ hát lại cả đoạn theo đúng thứ tự đó';return}var n=list[i];big.innerHTML=noteName(n.midi)+' <span style="font-size:20px;color:var(--muted)">nốt '+(i+1)+'/'+list.length+'</span>';instTone(n.midi,ac().currentTime+0.03,Math.min(1.2,Math.max(0.5,n.dur/sp)),nsInst,false);i++;nbnTimer=setTimeout(step,Math.round(1000/sp))})()}
$('noteByNoteBtn').onclick=noteByNote;
/* --- hát thử đoạn này: nghe mẫu → thu giọng qua micro → chấm từng nốt bằng cents --- */
function showSingMsg(t){$('singMsg').innerHTML=t}
function recordUserPitch(durSec,list,base,sp){return new Promise(function(resolve,reject){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){reject(new Error('nomedia'));return}
  navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}}).then(function(stream){
    var c=ac(),src=c.createMediaStreamSource(stream),an=c.createAnalyser();an.fftSize=2048;src.connect(an);
    var buf=new Float32Array(an.fftSize),samples=[],t0=performance.now();
    var iv=setInterval(function(){var el=(performance.now()-t0)/1000;an.getFloatTimeDomainData(buf);var f=autoCorr(buf,c.sampleRate);var m=(f>55&&f<1400)?69+12*Math.log2(f/440):null;samples.push({t:el,midi:m});
      var songT=base+el*sp,cur=null;for(var i=0;i<list.length;i++){if(songT>=list[i].start&&songT<list[i].start+list[i].dur){cur=list[i];break}}
      $('bigNoteName').textContent=cur?('🎤 '+noteName(cur.midi)):'🎤 …';
      if(el>=durSec){clearInterval(iv);stream.getTracks().forEach(function(t){t.stop()});resolve(samples)}},80);
  }).catch(reject)})}
function drawCompare(list,base,sp,samples){var cv=$('pitchCanvas');cv.classList.remove('hidden');$('pitchLegend').classList.remove('hidden');var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;ctx.fillStyle='#17110B';ctx.fillRect(0,0,W,H);
  var allM=list.map(function(n){return n.midi});samples.forEach(function(s){if(s.midi!==null)allM.push(s.midi)});var min=Math.floor(Math.min.apply(null,allM))-2,max=Math.ceil(Math.max.apply(null,allM))+2,rng=Math.max(6,max-min);
  var segEnd=(list[list.length-1].start+list[list.length-1].dur-base)/sp;
  function X(t){return 48+t/Math.max(0.1,segEnd)*(W-60)}function Y(m){return H-((m-min)/rng)*(H-16)-8}
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='11px sans-serif';
  for(var m=min;m<=max;m+=2){ctx.beginPath();ctx.moveTo(48,Y(m));ctx.lineTo(W,Y(m));ctx.stroke();ctx.fillText(noteName(m),6,Y(m)+4)}
  ctx.strokeStyle='#FFD166';ctx.lineWidth=5;ctx.lineCap='round';list.forEach(function(n){ctx.beginPath();ctx.moveTo(X((n.start-base)/sp),Y(n.midi));ctx.lineTo(X((n.start+n.dur-base)/sp),Y(n.midi));ctx.stroke()});
  ctx.strokeStyle='#2DD4BF';ctx.lineWidth=2.5;ctx.beginPath();var pen=false;samples.forEach(function(s){if(s.midi===null){pen=false;return}var x=X(s.t),y=Y(s.midi);if(!pen){ctx.moveTo(x,y);pen=true}else ctx.lineTo(x,y)});ctx.stroke();
}
function singTest(){if(singBusy)return;var list=(nsBentNotes||selNotes()).slice();if(!list.length){toast('Hãy chọn đoạn có nốt trước nhé');return}
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){showSingMsg('⚠️ Trình duyệt này không hỗ trợ micro nên chưa hát thử được — bạn vẫn luyện được bằng nút “Nghe từng nốt” và “Phát đoạn để tập” nhé.');toast('Trình duyệt không hỗ trợ micro');return}
  singBusy=true;var sp=practiceSpeed||1,base=list[0].start,segDur=list[list.length-1].start+list[list.length-1].dur-base,perfDur=segDur/sp;
  showSingMsg('🎧 Trước hết nghe nốt mẫu — nhạc cụ phát lại đoạn này, nghe kỹ cao độ từng nốt…');$('singResults').innerHTML='';
  playNoteList(list,nsInst,false,'🎧 Nốt mẫu — nghe kỹ nhé',function(){
    showSingMsg('🎤 <strong>Tới lượt bạn!</strong> Hát theo đúng đoạn vừa nghe — bắt đầu ngay khi dòng này hiện. Studio đang nghe…');
    recordUserPitch(perfDur,list,base,sp).then(function(samples){
      singBusy=false;bumpPractice();$('bigNoteName').textContent='';
      var rows=list.map(function(n){var t0=(n.start-base)/sp,t1=(n.start+n.dur-base)/sp,vals=[];samples.forEach(function(s){if(s.t>=t0&&s.t<t1&&s.midi!==null)vals.push(s.midi)});
        if(vals.length<2)return '<div style="background:var(--card);border:1px solid var(--line);border-radius:10px;padding:9px 12px">Nốt <b>'+noteName(n.midi)+'</b>: Studio chưa nghe rõ nốt này — có thể bạn hát hơi nhỏ hoặc bỏ qua nốt này, thử lại to hơn một chút.</div>';
        var cents=Math.round((medianOf(vals)-n.midi)*100),ac2=Math.abs(cents),txt;
        if(ac2<=20)txt='lệch chỉ '+ac2+' cents — <strong style="color:var(--teal)">rất chuẩn, đúng nốt!</strong>';
        else if(cents<0)txt='bạn hát <strong>thấp hơn '+ac2+' cents</strong> — hơi non, đẩy cao lên một chút nữa';
        else txt='bạn hát <strong>cao hơn '+ac2+' cents</strong> — hơi quá, hạ xuống một chút cho êm';
        return '<div style="background:var(--card);border:1px solid var(--line);border-radius:10px;padding:9px 12px">Nốt <b>'+noteName(n.midi)+'</b>: '+txt+'.</div>'});
      $('singResults').innerHTML='<strong>Kết quả hát thử của bạn:</strong>'+rows.join('');
      drawCompare(list,base,sp,samples);
      showSingMsg('✓ Đã chấm xong — xem từng nốt bên dưới và hai đường cao độ chồng nhau trên đồ thị: vàng = nốt mẫu, xanh = giọng bạn. Lệch dưới 20 cents là rất chuẩn; 20–50 cents là hơi non / hơi quá một chút; trên 50 cents là lệch rõ — nên tập lại nốt đó bằng nút “Nghe từng nốt”.');
      toast('Đã chấm xong bài hát thử — xem kết quả trong khung luyện tập nhé');
    }).catch(function(){singBusy=false;showSingMsg('⚠️ Không dùng được micro: trình duyệt chưa cấp quyền dùng micro cho trang này (hoặc micro đang bận). Hãy bấm “Cho phép” khi trình duyệt hỏi rồi bấm “Hát thử đoạn này” lại — Studio báo rõ ở đây chứ không im lặng bỏ qua đâu.');toast('Chưa dùng được micro — xem hướng dẫn trong khung luyện tập')});
  })}
$('singTestBtn').onclick=singTest;
/* --- gợi ý nhịp thở: chia câu theo chỗ lặng > ~0,5 giây và nốt giữ lâu --- */
function renderBreath(){var box=$('breathBox');if(!box)return;var notes=selNotes();if(!notes.length){box.innerHTML='';box.classList.add('hidden');return}
  var st=nsStats();if(!st){box.innerHTML='';box.classList.add('hidden');return}
  var phrases=[],cur=[notes[0]];for(var i=1;i<notes.length;i++){var prev=notes[i-1],gap=notes[i].start-(prev.start+prev.dur);if(gap>0.5||prev.dur>=1.4){phrases.push(cur);cur=[notes[i]]}else cur.push(notes[i])}phrases.push(cur);
  var lines=phrases.slice(0,5).map(function(ph,idx){var first=ph[0],last=ph[ph.length-1],hasHi=ph.some(function(n){return n.midi===st.max}),next=phrases[idx+1],gapTxt='';
    if(next){var g=next[0].start-(last.start+last.dur);if(g>0.5)gapTxt=', rồi <strong>nghỉ ở chỗ lặng '+g.toFixed(1)+' giây</strong> sau đó — chỗ lặng đó sinh ra để bạn lấy hơi'}
    var head=hasHi?('Lấy hơi thật sâu ngay trước nốt <b>'+noteName(st.max)+'</b> (nốt cao nhất đoạn — thở trước nó là quan trọng nhất)'):('Thở trước nốt <b>'+noteName(first.midi)+'</b>');
    return '<div style="margin-top:6px">🌬️ <strong>Câu '+(idx+1)+':</strong> '+head+', hát một hơi liền tới nốt <b>'+noteName(last.midi)+'</b>'+gapTxt+'.</div>'});
  box.classList.remove('hidden');
  box.innerHTML='<strong style="font-size:16px">🌬️ Gợi ý nhịp thở theo câu nhạc</strong><span class="gloss">Studio chia đoạn bạn chọn thành câu theo chỗ lặng dài hơn ~0,5 giây và các nốt giữ lâu — hát một hơi hết một câu, thở ở chỗ lặng, là cách ca sĩ giữ giọng không bị hụt hơi giữa câu.</span>'+lines.join('')+'<span class="gloss" style="margin-top:8px">Đây là gợi ý theo <em>cấu trúc câu nhạc</em>, không phải đo hơi thở thật của bạn — nếu hát tới đâu thấy hụt hơi thì cứ thở thêm ở đó, không có gì sai cả.</span>'}
renderVoiceResult();updateTransposeUI();
if(savedState&&savedState.practiceSpeed&&savedState.practiceSpeed!==1)setPracticeSpeed(savedState.practiceSpeed);
