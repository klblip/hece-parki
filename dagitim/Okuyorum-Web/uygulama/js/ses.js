/* Okuyorum — Ses Motoru (özgün; WebAudio efektleri + speechSynthesis seslendirme — tam ofis çalşır) */
"use strict";

/* --- Ses aç/kapa --- */
const OYUNSES = { acik:true };

/* --- WebAudio efektleri --- */
let _actx = null;
function actx(){
  if(!_actx){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(AC) _actx = new AC();
  }
  if(_actx && _actx.state === "suspended") _actx.resume();
  return _actx;
}
function nota(freq, sure, tur, zaman, vol){
  const c = actx(); if(!c || !OYUNSES.acik) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = tur || "sine"; o.frequency.value = freq;
  const t0 = c.currentTime + (zaman||0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol||0.25, t0+0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t0+sure);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0+sure+0.05);
}
function gurultu(sure, zaman){ // alkış benzeri impuls gürültüsü
  const c = actx(); if(!c || !OYUNSES.acik) return;
  const len = Math.floor(c.sampleRate*sure);
  const buf = c.createBuffer(1,len,c.sampleRate);
  const d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = (Math.random()*2-1)*Math.pow(1-i/len,2);
  const src = c.createBufferSource(); src.buffer = buf;
  const g = c.createGain(); g.gain.value = 0.3;
  src.connect(g); g.connect(c.destination);
  src.start(c.currentTime + (zaman||0));
}
const SES = {
  sonKaynak: "tts",
  dogru(){ nota(659,0.14,"sine",0); nota(880,0.2,"sine",0.12); nota(1175,0.3,"sine",0.24); },
  yanlis(){ nota(196,0.35,"square",0,0.12); nota(147,0.4,"square",0.12,0.1); },
  pop(){ nota(900,0.07,"triangle",0,0.2); nota(1400,0.06,"sine",0.03,0.15); },
  tus(){ nota(500,0.04,"sine",0,0.08); },
  alkis(){ [0,0.07,0.14,0.21,0.3,0.42,0.55,0.7].forEach(t=>gurultu(0.06,t)); },
  bitti(){ [523,659,784,1047].forEach((f,i)=>nota(f,0.25,"sine",i*0.15)); gurultu(0.08,0.8); },
  tok(){ nota(160,0.12,"square",0,0.15); },
  fonem(harf,bitti){ return kayitliVeyaTts("fonem",harf,bitti); },
  hece(hece,bitti){ return kayitliVeyaTts("hece",hece,bitti); },
  kelime(kelime,bitti){ return kayitliVeyaTts("kelime",kelime,bitti); },
  kayitVar(tur,anahtar){ return !!kayitliSesYolu(tur,anahtar); }
};

/* --- Kayıtlı ses (varsa) → yoksa TTS yedeği --- */
function sesTabani(){
  return (typeof window.SES_TABANI === "string" && window.SES_TABANI) ? window.SES_TABANI : "assets/sesler/";
}
function kayitliSesYolu(tur, anahtar){
  try{
    const m = window.ORTAK_SES_KAYITLARI;
    const d = m && m[tur] && m[tur][anahtar];
    if(!d) return "";
    return /^([a-z]+:|\/|\.\.?\/)/i.test(d) ? d : sesTabani() + tur + "/" + d;
  }catch(e){ return ""; }
}
function kayitliCal(yol, bitti){
  try{
    const a = new Audio(yol);
    let bittiMi = false;
    const son = ()=>{ if(!bittiMi){ bittiMi = true; if(bitti) bitti(); } };
    a.onended = son;
    a.onerror = son;
    const p = a.play();
    if(p && p.catch) p.catch(son);
  }catch(e){ if(bitti) bitti(); }
}
function kayitliVeyaTts(tur, anahtar, bitti){
  if(!OYUNSES.acik){ if(bitti) bitti(); return "kapali"; }
  const yol = kayitliSesYolu(tur, anahtar);
  if(yol){ SES.sonKaynak = "kayit"; kayitliCal(yol, bitti); return "kayit"; }
  if(tur === "fonem"){
    /* kayıtlı fonem yoksa: WebAudio ses sentezi — sessiz harf "ağızdan çıktığı gibi" */
    if(fonemCal(anahtar)){ SES.sonKaynak = "sentez"; if(bitti) bitti(); return "sentez"; }
    /* sentez tanımamadığı harf ise bir ünlü/анormal: TTS yedeği */
  }
  SES.sonKaynak = "tts";
  if(!window.speechSynthesis){ if(bitti) bitti(); return "yok"; }
  konus(anahtar, bitti);
  return "tts";
}

/* --- FONEM: kanonik gönderi `../assets/fonem.js` (Fonem.sentez) ---
   Kopya burada tutulmaz; ses.js fonem isteklerini kayıt → sentez → TTS sırasıyla çözer. */
function fonemCal(h){
  try{ return (window.Fonem && typeof window.Fonem.sentez==="function") ? window.Fonem.sentez(h) : false; }
  catch(e){ return false; }
}
/* harf seslendirme: kayıtlı fonem → sentez → yalnız ünlüde TTS */
function konusHarf(h, bitti){
  return SES.fonem(h, bitti);
}

/* --- Yerel kayıtlar: Fonem Stüdyo'da bu tarayıcıya kaydolan fonemler manifest'e eklenir --- */
try{
  const yerelFonemler = JSON.parse(localStorage.getItem("fonemKayitlari")||"{}");
  if(!window.ORTAK_SES_KAYITLARI) window.ORTAK_SES_KAYITLARI = {fonem:{},hece:{},kelime:{}};
  if(!window.ORTAK_SES_KAYITLARI.fonem) window.ORTAK_SES_KAYITLARI.fonem = {};
  for(const h in yerelFonemler) if(!window.ORTAK_SES_KAYITLARI.fonem[h]) window.ORTAK_SES_KAYITLARI.fonem[h] = yerelFonemler[h];
}catch(e){}

/* --- Türkçe seslendirme (speechSynthesis) ---
   Netlik: en kaliteli Türkçe ses seçilir (Natural > Online > Google > Microsoft),
   kısa mesajlar (kelime/harf) önce ÇOK yavaş, boşluk bırakılıp normal hızda tekrar söylenir. */
let _sesler = [];
function sesPuani(v){
  const ad = (v.name||"").toLowerCase();
  let p = 0;
  if(ad.indexOf("natural") >= 0) p += 10;
  else if(ad.indexOf("online") >= 0) p += 6;
  else if(ad.indexOf("google") >= 0) p += 8;
  else if(ad.indexOf("microsoft") >= 0) p += 3;
  return p;
}
function sesListesiYenile(){
  try{
    _sesler = speechSynthesis.getVoices().filter(v=>v.lang && v.lang.toLowerCase().indexOf("tr")===0);
    _sesler.sort((a,b)=>sesPuani(b)-sesPuani(a));
  }catch(e){}
}
if(window.speechSynthesis){
  sesListesiYenile();
  speechSynthesis.onvoiceschanged = sesListesiYenile;
}
function turkSes(){
  return _sesler[0] || null;
}
/* ham tek geçiş seslendirme */
function hamSoyle(metin, hiz, onEnd){
  const u = new SpeechSynthesisUtterance(metin);
  u.lang = "tr-TR";
  const v = turkSes(); if(v) u.voice = v;
  u.rate = hiz; u.pitch = 1.0; u.volume = 1;
  if(onEnd) u.onend = ()=>{ try{ onEnd(); }catch(e){} };
  speechSynthesis.speak(u);
}
/* metni seslendir; bitti cozülünce calisir
   Sakinlik: kısa içerik ÇOK yavaş (0.55) → uzun boşluk (0.8sn) → yavaş tekrar (0.8). */
function konus(metin, bitti, ops){
  ops = ops || {};
  if(!OYUNSES.acik || !window.speechSynthesis){ if(bitti) bitti(); return; }
  try{
    speechSynthesis.cancel();
    const kisa = (metin||"").length <= 16;   // kelime / tek harf / kısa içerik
    const ilkHiz    = (typeof ops.hiz==="number")    ? ops.hiz     : (kisa ? 0.55 : 0.8);
    const ara       = (typeof ops.ara==="number")    ? ops.ara     : (kisa ? 800  : 0);
    const tekrarHiz = (typeof ops.tekrarHiz==="number") ? ops.tekrarHiz : 0.8;
    const tekrarVar = (ops.tekrar !== false) && kisa;
    if(tekrarVar){
      let bittiMi = false;
      const son = ()=>{ if(!bittiMi){ bittiMi = true; if(bitti) bitti(); } };
      hamSoyle(metin, ilkHiz, ()=>{
        setTimeout(()=>{
          try{ hamSoyle(metin, tekrarHiz, son); }catch(e){ son(); }
          /* onend gelmezse güvenlik */
          setTimeout(son, 5000);
        }, ara);
      });
      setTimeout(son, 12000);
    }else{
      hamSoyle(metin, ilkHiz, ()=>{ if(bitti) bitti(); });
      if(bitti) setTimeout(bitti, 12000);   // güvenlik
    }
  }catch(e){ if(bitti) bitti(); }
}
/* harf/hece HARF HARF: her parça çok yavaş okunur, aralarında uzun sessizlik kalır */
function konusParcalar(parcalar, bitti){
  if(!OYUNSES.acik || !window.speechSynthesis){ if(bitti) bitti(); return; }
  const liste = (parcalar||[]).filter(x=>!!x);
  if(liste.length===0){ if(bitti) bitti(); return; }
  try{ speechSynthesis.cancel(); }catch(e){}
  let bittiMi=false;
  const son = ()=>{ if(!bittiMi){ bittiMi=true; if(bitti) bitti(); } };
  let i=0;
  function adim(){
    if(i>=liste.length){ son(); return; }
    const parca=liste[i];
    /* tek harf ise ağızdan çıktığı gibi (kayıtlı fonem → sentez); hece/kelime ise yavaş TTS */
    if(parca.length===1){ kayitliVeyaTts("fonem", parca, function(){ i++; setTimeout(adim, 950); }); return; }
    hamSoyle(parca, 0.5, ()=>{ i++; setTimeout(adim, 950); });
  }
  adim();
  setTimeout(son, liste.length*6000+2000);  // ses motoru takılırsa güvenlik
}
function konusDur(){ try{ speechSynthesis.cancel(); }catch(e){} }
