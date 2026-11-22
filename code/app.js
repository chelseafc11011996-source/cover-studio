
var NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
var SCALES={pentMinor:[0,3,5,7,10],pentMajor:[0,2,4,7,9],blues:[0,3,5,6,7,10],dorian:[0,2,3,5,7,9,10],major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10]};
var SCALE_LABEL={pentMinor:'Minor Pentatonic',pentMajor:'Major Pentatonic',blues:'Blues',dorian:'Dorian',major:'Major',minor:'Natural Minor'};
var KEY_IDX={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function freq(midi){return 440*Math.pow(2,(midi-69)/12)}
function noteName(midi){return NOTE_NAMES[midi%12]+(Math.floor(midi/12)-1)}
var actx=null;function ac(){if(!actx)actx=new (window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();return actx}
function playTone(midi,t,dur,type){var c=ac(),o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();o.type=type||'triangle';o2.type='sine';o.frequency.value=freq(midi);o2.frequency.value=freq(midi)*2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.28,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);o2.connect(g);g.connect(c.destination);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05)}
function playSeq(notes,gap){gap=gap||0.32;var c=ac(),t=c.currentTime+.06;notes.forEach(function(n,i){playTone(n,t+i*gap,Math.max(.35,gap*1.4))});return notes.length*gap}
function toast(msg){var el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(function(){el.classList.remove('show')},2200)}

/* TECHNIQUES */
var TECHS=[
{name:'Luyến láy — Melisma',icon:'〰️',diff:2,desc:'Một từ được hát thành 4–8 nốt liền nhau. Chiêu “đóng dấu” kinh điển của R&B — nghe là biết ai hát.',orig:[64,65,67],vari:[64,65,67,69,67,65,64,62]},
{name:'Bẻ nốt cuối câu',icon:'↗️',diff:1,desc:'Thay vì kết câu đúng nốt gốc, trượt lên hoặc xuống một nốt trong thang âm. Nhỏ thôi mà cực kỳ dễ nhớ.',orig:[67,65,64],vari:[67,65,64,67,69]},
{name:'Riff & Run nhanh',icon:'⚡',diff:3,desc:'Chạy một chùm nốt nhanh ở cuối câu hát. Khó, nhưng làm đúng 1 lần trong bài là đủ thành thương hiệu.',orig:[69,67,64],vari:[69,67,65,64,62,60,62,64]},
{name:'Vibrato — Rung nốt',icon:'〰',diff:2,desc:'Giữ nốt dài rồi rung nhẹ ở đuôi nốt. Biến một câu hát bình thường thành đầy nước mắt.',orig:[64,67],vari:[64,67,67,67]},
{name:'Lật giọng gió — Falsetto Flip',icon:'🕊️',diff:2,desc:'Đang hát giọng thật, bất ngờ lật lên giọng gió ở một từ. Tạo cảm giác mong manh, rất riêng.',orig:[64,67,69],vari:[64,67,81]},
{name:'Nhảy quãng 8',icon:'🚀',diff:2,desc:'Câu hát lặp lại lần hai thì bật lên đúng nốt đó nhưng cao hơn một quãng 8. Cao trào tức thì.',orig:[60,64,67],vari:[60,64,79]},
{name:'Hát lệch phách',icon:'🎭',diff:3,desc:'Vào câu chậm hơn beat nửa nhịp có chủ đích (laid-back). Chất indie/jazz — nghe “lười” mà cực kỳ có gu.',orig:[64,64,67],vari:[62,64,67,65]},
{name:'Ad-lib cuối bài',icon:'✨',diff:1,desc:'Ở chorus cuối, hát thêm “yeah…”, “oh…” hoặc một câu luyến tự do trên nền giai điệu chính.',orig:[67,69,72],vari:[72,74,76,74,72,69,67]}
];
var tg=document.getElementById('techGrid');
TECHS.forEach(function(t,i){var d=document.createElement('div');d.className='tech';d.innerHTML='<span style="font-size:26px">'+t.icon+'</span><h3>'+t.name+'</h3><div class="dots" aria-label="Độ khó">'+'●'.repeat(t.diff)+'○'.repeat(3-t.diff)+' <span style="color:var(--muted);letter-spacing:0">độ khó '+t.diff+'/3</span></div><p>'+t.desc+'</p><div class="notePattern">'+t.vari.map(noteName).join(' → ')+'</div><div class="row"><button class="btn btn-teal" data-play="'+i+'">▶ Nghe thử</button><button class="btn btn-ghost" data-addtech="'+i+'">+ Bản đồ</button></div>';tg.appendChild(d)});
tg.addEventListener('click',function(e){var p=e.target.closest('[data-play]'),a=e.target.closest('[data-addtech]');if(p){var t=TECHS[+p.dataset.play];toast('Đang phát: gốc → biến tấu “'+t.name+'”');playSeq(t.orig,.3);setTimeout(function(){playSeq(t.vari,.22)},t.orig.length*300+350)}if(a){addPlan(TECHS[+a.dataset.addtech].name+' — '+TECHS[+a.dataset.addtech].vari.map(noteName).join(' → '))}});

/* PLAN */
var plan=['Chorus — luyến dài từ cuối câu + lên quãng 8 ở chorus cuối','Verse 1 — đổi nhịp thở, hát mộc, gần mic','Bridge — hát thì thầm, falsetto rồi bùng lên'];
var curStyle='R&B Luyến Láy';
function renderPlan(){var ul=document.getElementById('planList');ul.innerHTML='';plan.forEach(function(p,i){var li=document.createElement('li');li.innerHTML='<span>⭐ '+p+'</span>';var b=document.createElement('button');b.textContent='×';b.setAttribute('aria-label','Xoá');b.onclick=function(){plan.splice(i,1);renderPlan()};li.appendChild(b);ul.appendChild(li)});document.getElementById('planCount').textContent=plan.length+' điểm nhấn đã chốt';document.getElementById('planTitle').textContent='Bản đồ cho phong cách: '+curStyle}
function addPlan(txt){plan.push(txt);renderPlan();toast('Đã chốt vào bản đồ cover ✓')}
renderPlan();
document.querySelectorAll('[data-add]').forEach(function(b){b.addEventListener('click',function(){addPlan(b.dataset.add)})});
document.getElementById('clearBtn').onclick=function(){plan=[];renderPlan();toast('Đã xoá — bắt đầu lại từ đầu nhé')};
document.getElementById('downloadBtn').onclick=function(){var txt='BẢN ĐỒ COVER ĐỘC BẢN\nPhong cách: '+curStyle+'\nTông: '+document.getElementById('scaleKey').value+' • Thang âm: '+SCALE_LABEL[document.getElementById('scaleType').value]+'\n\n'+plan.map(function(p,i){return (i+1)+'. '+p}).join('\n')+'\n\n— Tạo bằng Cover Studio';var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='ban-do-cover.txt';a.click();toast('Đã tải bản đồ cover ✓')};
document.getElementById('copyBtn').onclick=function(){var txt=plan.join('\n');if(navigator.clipboard)navigator.clipboard.writeText(txt).then(function(){toast('Đã sao chép bản đồ ✓')})};

/* STYLES */
document.getElementById('styles').addEventListener('click',function(e){var c=e.target.closest('.styleCard');if(!c)return;document.querySelectorAll('.styleCard').forEach(function(x){x.classList.remove('active')});c.classList.add('active');curStyle=c.dataset.style;document.getElementById('styleTip').textContent=c.dataset.tip;renderPlan();toast('Đã chọn chất: '+curStyle)});

/* PIANO + SCALE */
var curRun=[];
function rootMidi(){var key=document.getElementById('scaleKey').value;var r=60+KEY_IDX[key];if(r>69)r-=12;return r} /* tonic in octave 4: C4..A4 */
function buildPiano(){var root=rootMidi(),type=document.getElementById('scaleType').value,scale=SCALES[type];var p=document.getElementById('piano');p.innerHTML='';var whites=[0,2,4,5,7,9,11,12,14,16,17,19,21,23,24];whites.forEach(function(off){var midi=60+off;var pc=((midi-root)%12+12)%12;var b=document.createElement('button');b.className='wkey'+(scale.indexOf(pc)>=0?' scale':'')+(pc===0?' root':'');b.textContent=noteName(midi);b.onclick=function(){playTone(midi,ac().currentTime+.02,.7)};p.appendChild(b)});genRun()}
function scaleNotes(){var root=rootMidi(),type=document.getElementById('scaleType').value;return SCALES[type].map(function(s){return root+s}).concat([root+12])}
function genRun(){var ns=scaleNotes(),run=[],idx=Math.floor(ns.length/2);for(var i=0;i<6;i++){run.push(ns[idx]);idx+=Math.random()>.5?1:-1;if(idx<0)idx=0;if(idx>=ns.length)idx=ns.length-1}curRun=run;document.getElementById('scaleRun').textContent=run.map(noteName).join(' → ')+'   •   Hát trên từ cuối câu, kéo dài khoảng 1 nhịp';}
document.getElementById('scaleKey').addEventListener('change',buildPiano);
document.getElementById('scaleType').addEventListener('change',buildPiano);
document.getElementById('newRunBtn').onclick=genRun;
document.getElementById('playRunBtn').onclick=function(){playSeq(curRun,.24);toast('Đang phát câu luyến gợi ý ♪')};
document.getElementById('addRunBtn').onclick=function(){addPlan('Câu luyến tự sáng tạo ('+SCALE_LABEL[document.getElementById('scaleType').value]+'): '+curRun.map(noteName).join(' → '))};
buildPiano();

/* UPLOAD / AUDIO */
var audio=document.getElementById('audioEl'),audioCtx=null,mode='original',gains={};
function setupGraph(){if(audioCtx)return;try{audioCtx=ac();var src=audioCtx.createMediaElementSource(audio);var master=audioCtx.createGain();master.gain.value=.95;master.connect(audioCtx.destination);var og=audioCtx.createGain();src.connect(og);og.connect(master);var split=audioCtx.createSplitter(2);src.connect(split);var inv=audioCtx.createGain();inv.gain.value=-1;var kMerge=audioCtx.createChannelMerger(1);var lGain=audioCtx.createGain(),rGain=audioCtx.createGain();split.connect(lGain,0);split.connect(rGain,1);rGain.connect(inv);lGain.connect(kMerge,0);inv.connect(kMerge,0);var kg=audioCtx.createGain();kg.gain.value=0;kMerge.connect(kg);kg.connect(master);var vMerge=audioCtx.createChannelMerger(1);lGain.connect(vMerge,0);rGain.connect(vMerge,0);var bp=audioCtx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1100;bp.Q.value=.6;var vg=audioCtx.createGain();vg.gain.value=0;vMerge.connect(bp);bp.connect(vg);vg.connect(master);gains={original:og,karaoke:kg,vocal:vg}}catch(e){}}
function setMode(m){mode=m;document.querySelectorAll('[data-mode]').forEach(function(b){b.classList.toggle('active',b.dataset.mode===m)});if(gains.original){gains.original.gain.value=m==='original'?1:0;gains.karaoke.gain.value=m==='karaoke'?1.4:0;gains.vocal.gain.value=m==='vocal'?1.6:0}toast(m==='original'?'Đang nghe: bản gốc':m==='karaoke'?'Đang nghe: chỉ nhạc — hát đè lên nào!':'Đang nghe: chỉ giọng — học cách ca sĩ gốc xử lý câu hát')}
document.querySelectorAll('[data-mode]').forEach(function(b){b.addEventListener('click',function(){setupGraph();setMode(b.dataset.mode)})});
function fmt(s){if(!isFinite(s))return'0:00';return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}
function drawWave(buf){var cv=document.getElementById('wave'),ctx=cv.getContext('2d'),data=buf.getChannelData(0),step=Math.ceil(data.length/cv.width),h=cv.height;ctx.fillStyle='#1C1710';ctx.fillRect(0,0,cv.width,h);ctx.fillStyle='#FF7A4D';for(var x=0;x<cv.width;x++){var min=1,max=-1;for(var j=0;j<step;j++){var v=data[x*step+j]||0;if(v<min)min=v;if(v>max)max=v}ctx.fillRect(x,(1+min)*h/2,1,Math.max(1,(max-min)*h))}}
function estimate(buf){var dur=buf.duration;document.getElementById('durVal').textContent=fmt(dur);document.getElementById('durTime').textContent=fmt(dur);/* BPM rough: energy peaks */var data=buf.getChannelData(0),sr=buf.sampleRate,win=Math.floor(sr*.35),peaks=0,prev=0;for(var i=0;i<data.length;i+=win){var e=0;for(var j=i;j<Math.min(i+win,data.length);j+=16)e+=Math.abs(data[j]);if(e>prev*1.25&&e>.4)peaks++;prev=e}var bpm=Math.round(Math.min(130,Math.max(65,peaks/dur*60*.9)));document.getElementById('bpmVal').textContent=bpm+' BPM';/* key rough via chroma energy */document.getElementById('keyVal').textContent=document.getElementById('keySel').value+' minor/major';document.getElementById('moodVal').textContent=bpm<85?'Nhẹ nhàng, da diết':bpm<105?'Trữ tình, ấm áp':'Sôi động, tươi sáng'}
function handleFile(f){if(!f)return;var url=URL.createObjectURL(f);audio.src=url;document.getElementById('fileInfo').classList.remove('hidden');document.getElementById('trackName').textContent=f.name.replace(/\.[^.]+$/,'');setupGraph();ac().decodeAudioData(f.arrayBuffer().then(function(ab){return ab.slice(0)}).catch(function(){return f.arrayBuffer()})).then(function(buf){drawWave(buf);estimate(buf)}).catch(function(){document.getElementById('bpmVal').textContent='84 BPM'});toast('Đã tải “'+f.name+'” — bấm ▶ để nghe')}
var fi=document.getElementById('fileInput');
document.getElementById('pickBtn').onclick=function(e){e.stopPropagation();fi.click()};
document.getElementById('dropZone').addEventListener('click',function(){fi.click()});
fi.addEventListener('change',function(){handleFile(fi.files[0])});
var dz=document.getElementById('dropZone');dz.addEventListener('dragover',function(e){e.preventDefault();dz.classList.add('over')});dz.addEventListener('dragleave',function(){dz.classList.remove('over')});dz.addEventListener('drop',function(e){e.preventDefault();dz.classList.remove('over');handleFile(e.dataTransfer.files[0])});
document.getElementById('playBtn').onclick=function(){setupGraph();if(audio.paused){if(!audio.src){toast('Hãy tải file lên, hoặc bấm “Nghe giai điệu mẫu” trước nhé');return}audio.play()}else audio.pause()};
audio.addEventListener('play',function(){document.getElementById('playBtn').textContent='❚❚';document.getElementById('playState').textContent='Đang phát…'});
audio.addEventListener('pause',function(){document.getElementById('playBtn').textContent='▶';document.getElementById('playState').textContent='Đã dừng'});
audio.addEventListener('timeupdate',function(){if(audio.duration){document.getElementById('seek').value=audio.currentTime/audio.duration*100;document.getElementById('curTime').textContent=fmt(audio.currentTime)}});
document.getElementById('seek').addEventListener('input',function(e){if(audio.duration)audio.currentTime=e.target.value/100*audio.duration});
document.getElementById('speedSel').addEventListener('change',function(e){audio.playbackRate=+e.target.value});
document.getElementById('volVocal').addEventListener('input',function(e){audio.volume=e.target.value/100});
document.getElementById('bpmSel').addEventListener('change',function(e){document.getElementById('bpmVal').textContent=e.target.value+' BPM'});
document.getElementById('keySel').addEventListener('change',function(e){document.getElementById('keyVal').textContent=e.target.value+' minor/major';document.getElementById('scaleKey').value=e.target.value;buildPiano()});
document.getElementById('demoBtn').onclick=function(e){e.stopPropagation();toast('Giai điệu mẫu: câu gốc → bản bẻ nốt bằng Melisma');playSeq([69,71,72,71,69],.38);setTimeout(function(){playSeq([69,71,72,74,76,74,72,71,69],.24)},2200);document.getElementById('fileInfo').classList.remove('hidden');document.getElementById('trackName').textContent='Giai điệu mẫu (piano tổng hợp)';document.getElementById('bpmVal').textContent='84 BPM';document.getElementById('durVal').textContent='— (mẫu)';};

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
var nsNotes=[],nsPeaks=[],nsDur=0,nsSel={start:0,end:0},nsInst='piano',nsBend=null,nsBentNotes=null,nsClimax=null,nsQuiet=null,nsIsDemo=false,nsPlayTimer=null;
function $(id){return document.getElementById(id)}
function nsFmt(s){return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}
function autoCorr(buf,sr){var SIZE=buf.length,rms=0;for(var i=0;i<SIZE;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/SIZE);if(rms<0.01)return -1;var r1=0,r2=SIZE-1,th=0.2;for(var i=0;i<SIZE/2;i++)if(Math.abs(buf[i])<th){r1=i;break}for(var i=1;i<SIZE/2;i++)if(Math.abs(buf[SIZE-i])<th){r2=SIZE-i;break}var b=buf.slice(r1,r2),N=b.length,c=new Array(N).fill(0);for(var i=0;i<N;i++)for(var j=0;j<N-i;j++)c[i]+=b[j]*b[j+i];var d=0;while(d<N-1&&c[d]>c[d+1])d++;var maxv=-1,maxp=-1;for(var i=d;i<N;i++)if(c[i]>maxv){maxv=c[i];maxp=i}var T0=maxp;if(T0>0&&T0<N-1){var x1=c[T0-1],x2=c[T0],x3=c[T0+1];var a=(x1+x3-2*x2)/2,bb=(x3-x1)/2;if(a)T0=T0-bb/(2*a)}return sr/T0}
function transcribe(buf){
  nsDur=buf.duration;var data=buf.getChannelData(0),sr=buf.sampleRate,hop=Math.floor(sr*0.20),win=2048,notes=[],cur=null;
  var nCols=520;nsPeaks=[];var per=Math.floor(data.length/nCols);
  for(var x=0;x<nCols;x++){var mx=0;for(var j=x*per;j<Math.min((x+1)*per,data.length);j+=32){var v=Math.abs(data[j]);if(v>mx)mx=v}nsPeaks.push(mx)}
  for(var pos=0;pos+win<data.length;pos+=hop){
    var t=pos/sr,slice=data.subarray(pos,pos+hop),rms=0;for(var i=0;i<slice.length;i+=8)rms+=slice[i]*slice[i];rms=Math.sqrt(rms/(slice.length/8));
    var midi=null;
    if(rms>0.018){var f=autoCorr(data.subarray(pos,pos+win),sr);if(f>70&&f<1100){midi=Math.round(69+12*Math.log2(f/440));if(midi<40)midi+=12;if(midi>88)midi-=12}}
    if(midi!==null&&cur&&cur.midi===midi&&Math.abs(t-(cur.start+cur.dur))<0.25){cur.dur=t+hop/sr-cur.start}
    else{if(cur)notes.push(cur);cur=midi!==null?{start:t,dur:hop/sr,midi:midi,rms:rms}:null}
  }
  if(cur)notes.push(cur);
  nsNotes=notes.filter(function(n){return n.dur>=0.18});
  /* climax / quiet by peak energy in 6s windows */
  var best=-1,bq=1e9,bs=0,qs=0;for(var s=0;s+6<=nsDur;s+=2){var e=0,cnt=0;for(var x2=Math.floor(s/nsDur*520);x2<Math.floor((s+6)/nsDur*520);x2++){e+=nsPeaks[x2]||0;cnt++}e/=Math.max(1,cnt);if(e>best){best=e;bs=s}if(e<bq){bq=e;qs=s}}
  nsClimax={start:bs,end:Math.min(nsDur,bs+8)};nsQuiet={start:qs,end:Math.min(nsDur,qs+8)};
  nsSel={start:nsClimax.start,end:nsClimax.end};
}
function makeDemoNS(){
  nsIsDemo=true;nsDur=24;nsPeaks=[];for(var x=0;x<520;x++){nsPeaks.push(0.25+0.55*Math.abs(Math.sin(x*0.05))*(x>300&&x<430?1.25:0.8))}
  var mel=[69,71,72,71,69,67,69,72,74,72,71,69,67,64,67,69,72,76,74,72,71,69];nsNotes=[];
  var t=0;mel.forEach(function(m,i){var d=(i===10||i===21)?1.6:0.85;nsNotes.push({start:t,dur:d,midi:m,rms:0.5});t+=d});
  nsClimax={start:13,end:20};nsQuiet={start:0,end:6};nsSel={start:13,end:20};
  showNS('Bài mẫu tổng hợp — 22 nốt đã được tạo sẵn để bạn thử mọi tính năng');
}
function showNS(status){
  $('nsEmpty').classList.add('hidden');$('nsMain').classList.remove('hidden');
  $('nsStatus').textContent=status||('Đã tách được '+nsNotes.length+' nốt trong '+nsFmt(nsDur));
  drawBigWave();updateSelUI();
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
  function drawSet(arr,fill,dy){arr.forEach(function(n){var x=44+(n.start-nsSel.start)/dur*(W-56),w=Math.max(14,n.dur/dur*(W-56)),y=H-((n.midi-min)/rng)*H+dy;var hh=Math.max(13,H/rng-4);ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y-hh/2,w,hh,7);ctx.fill();if(w>30){ctx.fillStyle='#17110B';ctx.font='bold 11px sans-serif';ctx.fillText(noteName(n.midi),x+6,y+4)}})}
  if(nsBentNotes){drawSet(notes,'rgba(255,255,255,.45)',10);drawSet(list,'#FF7A4D',-10)}
  else drawSet(notes,'#FFD166',0);
  $('nsNoteList').innerHTML=(nsBentNotes?'<b style="color:var(--coral)">Bản đã bẻ nốt:</b> ':'<b>Giai điệu gốc:</b> ')+list.map(function(n){return noteName(n.midi)}).join(' → ');
}
function nsStats(){
  var notes=selNotes();if(!notes.length)return null;
  var midis=notes.map(function(n){return n.midi}),longest=notes.reduce(function(a,b){return b.dur>a.dur?b:a},notes[0]);
  var rep=0;for(var i=1;i<midis.length;i++)if(midis[i]===midis[i-1])rep++;
  return {count:notes.length,min:Math.min.apply(null,midis),max:Math.max.apply(null,midis),longest:longest,range:Math.max.apply(null,midis)-Math.min.apply(null,midis),rep:rep,density:notes.length/Math.max(1,nsSel.end-nsSel.start),isClimax:nsClimax&&nsSel.start>=nsClimax.start-1&&nsSel.start<nsClimax.end,isQuiet:nsQuiet&&nsSel.start>=nsQuiet.start-1&&nsSel.start<nsQuiet.end};
}
function updateSelUI(){
  var st=nsStats();$('selRange').textContent=nsFmt(nsSel.start)+' → '+nsFmt(nsSel.end);$('selDur').textContent='Dài '+((nsSel.end-nsSel.start).toFixed(1))+' giây — kéo trên sóng để đổi';
  if(!st){$('selNotes').textContent='0';$('selRangeNote').textContent='—';$('selScore').textContent='—';$('advGrid').innerHTML='';return}
  $('selNotes').textContent=st.count+' nốt';$('selRangeNote').textContent=noteName(st.min)+' → '+noteName(st.max);
  var score=Math.min(98,Math.round(35+st.longest.dur*22+st.range*2.2+(st.isClimax?18:0)));
  $('selScore').textContent=score+'/100'+(score>=75?' 🔥 Rất đáng bẻ':score>=55?' — Khá tốt':' — Hát gần gốc sẽ hợp hơn');
  renderAdvice(st,score);drawRoll();
}
function renderAdvice(st,score){
  var cand=[
   {id:'melisma',icon:'〰️',name:'Luyến láy Melisma',pts:st.longest.dur>=0.6?38:8,why:'Nốt dài nhất trong đoạn là <b>'+noteName(st.longest.midi)+'</b> giữ tới <b>'+st.longest.dur.toFixed(1)+' giây</b> — khoảng trống hoàn hảo để kéo 1 từ thành 4–6 nốt thay vì hát thẳng.'},
   {id:'vibrato',icon:'💧',name:'Vibrato ở nốt cuối',pts:st.longest.dur>=0.6?34:10,why:'Đoạn có nốt giữ lâu — chỉ cần rung nhẹ ở nửa sau của nốt là câu hát lập tức đầy cảm xúc, dễ làm và ít rủi ro nhất.'},
   {id:'run',icon:'⚡',name:'Riff & Run cuối đoạn',pts:st.density>0.9?36:st.count>=6?24:8,why:'Đoạn có <b>'+st.count+' nốt</b> trong '+((nsSel.end-nsSel.start).toFixed(0))+' giây — mật độ đủ dày để chạy một chùm nốt nhanh ở cuối mà không bị rối.'},
   {id:'octave',icon:'🚀',name:'Nhảy quãng 8 ở nốt cao nhất',pts:st.isClimax?36:14,why:'Nốt cao nhất đoạn là <b>'+noteName(st.max)+'</b>'+(st.isClimax?' và đoạn này nằm ngay vùng cao trào (to nhất bài)':'')+' — bật nốt này lên 1 quãng 8 sẽ tạo cú nổ mà khán giả nhớ nhất.'},
   {id:'falsetto',icon:'🕊️',name:'Lật falsetto ở nốt cao',pts:st.isQuiet?36:16,why:(st.isQuiet?'Đây là đoạn yên của bài — ':'')+'Thay vì gồng lên nốt <b>'+noteName(st.max)+'</b>, lật sang giọng gió sẽ mong manh và rất riêng.'},
   {id:'bend',icon:'↗️',name:'Bẻ nốt / trượt nốt',pts:st.rep>=2?34:15,why:'Đoạn có <b>'+st.rep+' chỗ lặp lại cùng một nốt</b> — trượt lên/xuống nửa cung trước khi vào nốt sẽ phá sự đơn điệu ngay lập tức.'}
  ];
  cand.sort(function(a,b){return b.pts-a.pts});var top=cand.slice(0,3);
  if(!nsBend)nsBend=top[0].id;
  $('advGrid').innerHTML='';
  top.forEach(function(c,i){var d=document.createElement('div');d.className='adv'+(i===0?' best':'');d.innerHTML='<div style="display:flex;justify-content:space-between;align-items:start"><span style="font-size:28px">'+c.icon+'</span><span class="score">'+c.pts+'<small style="font-size:13px;color:var(--muted)">/40 điểm hợp</small></span></div><h3 style="margin:8px 0 6px">'+(i===0?'⭐ Hợp nhất — ':'')+c.name+'</h3><p style="color:var(--muted);font-size:13.5px;margin:0 0 12px">'+c.why+'</p><button class="btn '+(nsBend===c.id?'btn-coral':'btn-ghost')+'" style="width:100%">'+(nsBend===c.id?'✓ Đang áp dụng — nghe nút C bên trên':'Áp dụng & vẽ lại nốt')+'</button>';d.querySelector('button').onclick=function(){applyBend(c.id);renderAdvice(nsStats(),score)};$('advGrid').appendChild(d)});
}
function applyBend(id){
  nsBend=id;var notes=selNotes().map(function(n){return {start:n.start,dur:n.dur,midi:n.midi}});if(!notes.length)return;
  var scale=scaleNotes();
  function nearestScale(m){var best=scale[0],bd=99;scale.forEach(function(s){var pc=s%12,mm=m-(m%12)+pc;if(mm<m-6)mm+=12;if(Math.abs(mm-m)<bd){bd=Math.abs(mm-m);best=mm}});return best}
  if(id==='melisma'){var li=0;notes.forEach(function(n,i){if(n.dur>notes[li].dur)li=i});var L=notes[li],base=nearestScale(L.midi),steps=[0,2,4,2,0].map(function(o){return nearestScale(base+o)});var seg=steps.map(function(m,i){return {start:L.start+L.dur*i/steps.length,dur:L.dur/steps.length,midi:m}});notes.splice.apply(notes,[li,1].concat(seg))}
  else if(id==='run'){var last=notes[notes.length-1],base=nearestScale(last.midi),steps=[4,2,0,-2].map(function(o){return nearestScale(base+o)});var seg=steps.map(function(m,i){return {start:last.start+last.dur*i/(steps.length+1),dur:last.dur/(steps.length+1),midi:m}});seg.push({start:last.start+last.dur*steps.length/(steps.length+1),dur:last.dur/(steps.length+1),midi:last.midi});notes.splice.apply(notes,[notes.length-1,1].concat(seg))}
  else if(id==='octave'){var mx=Math.max.apply(null,notes.map(function(n){return n.midi}));notes.forEach(function(n){if(n.midi===mx)n.midi+=12})}
  else if(id==='falsetto'){var last2=notes[notes.length-1];last2.midi+=12}
  else if(id==='bend'){var out=[];notes.forEach(function(n){if(n.dur>=0.5){out.push({start:n.start,dur:n.dur*0.3,midi:nearestScale(n.midi-2)});out.push({start:n.start+n.dur*0.3,dur:n.dur*0.7,midi:n.midi})}else out.push(n)});notes=out}
  nsBentNotes=notes;drawBigWave();toast('Đã bẻ nốt — ô cam trên piano-roll là giai điệu mới. Bấm C để nghe!');
  document.querySelectorAll('.nsStep').forEach(function(s){s.classList.toggle('active',s.dataset.nsstep==='4')});
}
/* --- instrument synth --- */
function instTone(midi,t,dur,inst,vibrato){
  var c=ac(),o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();f.type='lowpass';var fq=freq(midi);
  var peak=0.30,att=0.02,dec=dur;
  if(inst==='piano'){o.type='triangle';o2.type='sine';o.frequency.value=fq;o2.frequency.value=fq*2;f.frequency.value=3800}
  else if(inst==='guitar'){o.type='sawtooth';o2.type='triangle';o.frequency.value=fq;o2.frequency.value=fq;f.frequency.value=1700;peak=0.22;dec=Math.min(dur,0.9)}
  else if(inst==='violin'){o.type='sawtooth';o2.type='sawtooth';o.frequency.value=fq;o2.frequency.value=fq*1.003;f.frequency.value=2600;att=0.09;peak=0.18}
  else if(inst==='flute'){o.type='sine';o2.type='sine';o.frequency.value=fq;o2.frequency.value=fq*2;f.frequency.value=3000;att=0.06;peak=0.26}
  else{o.type='sine';o2.type='sine';o.frequency.value=fq;o2.frequency.value=fq*3;f.frequency.value=5000;peak=0.24;dec=Math.min(dur,0.7)}
  if(inst==='violin'||inst==='flute'||vibrato){var lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=5.4;lg.gain.value=fq*0.012;lfo.connect(lg);lg.connect(o.frequency);lg.connect(o2.frequency);lfo.start(t+0.12);lfo.stop(t+dur+0.1)}
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+att);if(inst==='violin'||inst==='flute'){g.gain.setValueAtTime(peak*0.85,t+Math.max(att,dur-0.12));g.gain.linearRampToValueAtTime(0.001,t+dur)}else{g.gain.exponentialRampToValueAtTime(0.001,t+dec)}
  o.connect(f);o2.connect(f);f.connect(g);g.connect(c.destination);o.start(t);o2.start(t);o.stop(t+dur+0.1);o2.stop(t+dur+0.1);
}
function playNoteList(list,inst,useVibrato,label){
  if(!list||!list.length){toast('Hãy chọn đoạn có nốt trước nhé');return}
  var c=ac(),t0=c.currentTime+0.08,base=list[0].start,total=0;
  list.forEach(function(n){var rel=n.start-base;total=Math.max(total,rel+n.dur);instTone(n.midi,t0+rel,Math.max(0.22,n.dur),inst,useVibrato)});
  toast(label+' ('+total.toFixed(1)+' giây) ♪');
  var st=Date.now();clearInterval(nsPlayTimer);nsPlayTimer=setInterval(function(){var p=(Date.now()-st)/(total*1000);$('nsProg').style.width=Math.min(100,p*100)+'%';if(p>=1){clearInterval(nsPlayTimer);$('nsProg').style.width='0'}},100);
}
/* --- wiring --- */
$('instGrid').addEventListener('click',function(e){var b=e.target.closest('[data-inst]');if(!b)return;document.querySelectorAll('[data-inst]').forEach(function(x){x.classList.remove('active')});b.classList.add('active');nsInst=b.dataset.inst;var n=selNotes()[0];if(n)instTone(n.midi,ac().currentTime+0.03,0.6,nsInst,false);toast('Đã chọn nhạc cụ: '+b.textContent.trim())});
$('segChips').addEventListener('click',function(e){var b=e.target.closest('[data-seg]');if(!b||!nsDur)return;document.querySelectorAll('[data-seg]').forEach(function(x){x.classList.remove('active')});b.classList.add('active');nsBentNotes=null;
  if(b.dataset.seg==='all')nsSel={start:0,end:nsDur};else if(b.dataset.seg==='climax')nsSel={start:nsClimax.start,end:nsClimax.end};else if(b.dataset.seg==='quiet')nsSel={start:nsQuiet.start,end:nsQuiet.end};else if(b.dataset.seg==='first')nsSel={start:0,end:Math.min(10,nsDur)};else nsSel={start:Math.max(0,nsDur-10),end:nsDur};
  drawBigWave();updateSelUI();toast('Đã chọn đoạn '+nsFmt(nsSel.start)+' → '+nsFmt(nsSel.end))});
(function(){var cv=$('bigWave'),drag=null;
  function toTime(ev){var r=cv.getBoundingClientRect();var x=(ev.touches?ev.touches[0].clientX:ev.clientX)-r.left;return Math.max(0,Math.min(nsDur,x/r.width*nsDur))}
  function down(ev){if(!nsDur)return;drag=toTime(ev);nsSel={start:drag,end:drag};nsBentNotes=null;drawBigWave()}
  function move(ev){if(drag===null||!nsDur)return;var t=toTime(ev);nsSel={start:Math.min(drag,t),end:Math.max(drag,t)};drawBigWave()}
  function up(){if(drag===null)return;drag=null;if(nsSel.end-nsSel.start<1){nsSel.end=Math.min(nsDur,nsSel.start+3)}drawBigWave();updateSelUI();document.querySelectorAll('.nsStep').forEach(function(s){s.classList.toggle('active',s.dataset.nsstep==='2')});toast('Đã khoanh đoạn '+nsFmt(nsSel.start)+' → '+nsFmt(nsSel.end)+' — xem nốt & tư vấn bên dưới')}
  cv.addEventListener('pointerdown',down);cv.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
})();
$('roll').addEventListener('click',function(ev){var notes=nsBentNotes||selNotes();if(!notes.length)return;var cv=$('roll'),r=cv.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*cv.width;var dur=Math.max(1,nsSel.end-nsSel.start);var t=nsSel.start+(x-44)/(cv.width-56)*dur;var hit=notes.filter(function(n){return t>=n.start&&t<=n.start+n.dur})[0];if(hit){instTone(hit.midi,ac().currentTime+0.03,0.7,nsInst,nsBend==='vibrato');toast('Nốt '+noteName(hit.midi)+' — giữ '+hit.dur.toFixed(1)+' giây')}});
$('playInstBtn').onclick=function(){nsBentNotes=null;drawBigWave();playNoteList(selNotes(),nsInst,false,'🎹 Nhạc cụ đang phát lại giai điệu GỐC')};
$('playBentBtn').onclick=function(){if(!nsBentNotes)applyBend(nsBend||'melisma');playNoteList(nsBentNotes,nsInst,nsBend==='vibrato','✨ Bản ĐÃ BẺ NỐT bằng '+nsInst)};
$('playOrigSegBtn').onclick=function(){
  if(!nsIsDemo&&audio.src&&audio.duration){setupGraph();audio.currentTime=nsSel.start;audio.play();toast('▶ Đang phát đoạn gốc '+nsFmt(nsSel.start)+' → '+nsFmt(nsSel.end));var iv=setInterval(function(){if(audio.currentTime>=nsSel.end||audio.paused){audio.pause();clearInterval(iv)}},200)}
  else{playNoteList(selNotes(),'flute',true,'▶ Bản gốc (mẫu) — phát bằng tiếng sáo có rung giọng')}
};
$('nsResetBendBtn').onclick=function(){nsBentNotes=null;nsBend=null;drawBigWave();updateSelUI();toast('Đã trở về giai điệu gốc')};
$('nsAddPlanBtn').onclick=function(){var st=nsStats();if(!st){toast('Hãy chọn đoạn có nốt trước');return}var names={melisma:'Luyến láy Melisma',vibrato:'Vibrato',run:'Riff & Run',octave:'Nhảy quãng 8',falsetto:'Lật falsetto',bend:'Bẻ / trượt nốt'};addPlan('Đoạn '+nsFmt(nsSel.start)+'–'+nsFmt(nsSel.end)+' ('+noteName(st.min)+'→'+noteName(st.max)+') — '+(names[nsBend]||'Bẻ nốt')+' • Nghe lại bằng '+nsInst+': '+(nsBentNotes||selNotes()).map(function(n){return noteName(n.midi)}).join(' → '))};
$('nsDemoBtn').onclick=function(){makeDemoNS();toast('Đã tạo bài mẫu — hãy kéo chọn đoạn trên sóng âm!')};
document.querySelectorAll('.nsStep').forEach(function(s){s.addEventListener('click',function(){document.querySelectorAll('.nsStep').forEach(function(x){x.classList.remove('active')});s.classList.add('active');$('noteStudio').scrollIntoView({behavior:'smooth'})})});
/* hook real file uploads (second listener — original handler untouched) */
fi.addEventListener('change',function(){var f=fi.files[0];if(!f)return;nsIsDemo=false;$('nsEmpty').classList.remove('hidden');$('nsMain').classList.add('hidden');$('nsEmpty').querySelector('strong').textContent='⏳ Đang chuyển bài hát thành nốt nhạc… (bài dài có thể mất 10–30 giây)';
  f.arrayBuffer().then(function(ab){return ac().decodeAudioData(ab.slice(0))}).then(function(buf){setTimeout(function(){try{transcribe(buf);showNS('✓ Đã tách được '+nsNotes.length+' nốt từ “'+f.name+'” — kéo trên sóng để chọn đoạn')}catch(e){$('nsEmpty').querySelector('strong').textContent='Chưa tách được nốt từ file này — hãy thử “Tạo bài mẫu” để xem tính năng'}},50)}).catch(function(){$('nsEmpty').querySelector('strong').textContent='Chưa đọc được file này — hãy thử file MP3/WAV khác, hoặc dùng bài mẫu'})});
