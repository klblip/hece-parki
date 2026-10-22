"use strict";
/* =====================================================================
   🎤 FONEM STÜDYO — öğretmen kendi sesinden fonem kaydeder (uygulama).
   - Kayıt akışı: mikrofon → sessizlik kırpma → seviye normilasyonu → 22 kHz mono WAV
   - Kalıcılık: tarayıcı (localStorage "fonemKayitlari") + manifest'e ekleme
   - Taşınabilirlik: "kayitlar.js" olarak indirir; assets/sesler/ klasörüne konur.
   - Kural 8: harf adı DEĞİL sesin kendisi öğretilir → bu stüdyo fonem der.
   ===================================================================== */

const FONEM_HARFLER = "anetilokurımsöydzçbgcşphvğfj";

/* Her harf için kısa, doğru ses yönlendirmesi */
const FONEM_NOT = {
  a: "Açık ağızla uzun 'aaaa'",
  e: "Dudaklar yana gülümser: 'eeee'",
  ı: "Kısa derin 'ııı' (alıçak)",
  i: "Gülümseyerek 'iii'",
  o: "Dudaklar yuvarlak 'oooo'",
  u: "Dudaklar öne yakı 'uuuu'",
  ö: "Dudaklar yuvarlak 'ööö'",
  ü: "Dudaklar yuvarlak 'üüü'",
  p: "'a-p' DEME! Dudakları kapat, havayı tut, KISA dudak patlaması bırak",
  t: "'a-t' DEME! Dil ucunu üst diş arkasına koy, KISA 't' patlat",
  k: "'a-k' DEME! Damak arkasında KISA 'k' patlat",
  b: "'a-b' DEME! Dudak kapalı, boğaz tırtırlı, KISA 'b'",
  d: "'a-d' DEME! Dil ucu kapalı, tırtırlı, KISA 'd'",
  g: "'a-g' DEME! Damak arkasında tırtırlı, KISA 'g'",
  f: "Üst dişler alt dudak arasında uzun 'fff'",
  v: "f gibi ama boğaz tırtırlı uzun 'vvv'",
  s: "Uzun 'ssss' (yılan gibi)",
  z: "Uzun 'zzzz' (arı vızıltısı)",
  ş: "Uzun 'şşş' (sus kitabı demek gibi, kelimede değil sadece ş)",
  j: "Uzun tırtırlı 'jjj' (j sesi — c sesi gibi değil)",
  ç: "Kısa '-tşş' (önce t patlat, sonra ş)",
  c: "Kısa tırtırlı 'c c' (d+j)",
  h: "SAF NEFES: 'ha' DEME — sadece 'h' puftır",
  m: "Dudaklar KAPALI, burnundan uzun 'mmmm'",
  n: "Dil ucu üst diş arkasında, burnundan uzun 'nnnn'",
  l: "Dil ucu damağa: uzun 'llll'",
  r: "Dil ucu kısa 'rr'",
  y: "Kısa 'yyy'",
  ğ: "Boğazda hafif, güçsüz 'ğ'"
};
const FONEM_KIRM = "p t k b d g k".split(" ").filter(Boolean); /* patlamalılar — kırpma önerileri */

let __fonemakis = null, __fonemmr = null, __fonemparcalar = [];

function yerelFonemler(){
  try{ return JSON.parse(localStorage.getItem("fonemKayitlari") || "{}"); }
  catch(e){ return {}; }
}
function fonemKaydetY(h, dataURL){
  const k = yerelFonemler(); k[h] = dataURL;
  try{ localStorage.setItem("fonemKayitlari", JSON.stringify(k)); }
  catch(e){ return false; }
  if(!window.ORTAK_SES_KAYITLARI) window.ORTAK_SES_KAYITLARI = {fonem:{},hece:{},kelime:{}};
  if(!window.ORTAK_SES_KAYITLARI.fonem) window.ORTAK_SES_KAYITLARI.fonem = {};
  window.ORTAK_SES_KAYITLARI.fonem[h] = dataURL;
  if(typeof window.__fonemCiz === "function") window.__fonemCiz();
  return true;
}
function fonemSil(h){
  const k = yerelFonemler(); delete k[h];
  try{ localStorage.setItem("fonemKayitlari", JSON.stringify(k)); }catch(e){}
  if(window.ORTAK_SES_KAYITLARI && window.ORTAK_SES_KAYITLARI.fonem) delete window.ORTAK_SES_KAYITLARI.fonem[h];
  if(typeof window.__fonemCiz === "function") window.__fonemCiz();
}
function fonemSayisi(){ return Object.keys(yerelFonemler()).length; }

/* 16-bit WAV kodlayıcı */
function fonemWavYap(sam, rate){
  const len = sam.length;
  const buf = new ArrayBuffer(44 + len*2);
  const dv = new DataView(buf);
  function yaz(off, s){ for(let i=0;i<s.length;i++) dv.setUint8(off+i, s.charCodeAt(i)); }
  yaz(0,"RIFF"); dv.setUint32(4, 36+len*2, true); yaz(8,"WAVE"); yaz(12,"fmt ");
  dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,1,true);
  dv.setUint32(24,rate,true); dv.setUint32(28,rate*2,true); dv.setUint16(32,2,true);
  dv.setUint16(34,16,true); yaz(36,"data"); dv.setUint32(40,len*2,true);
  for(let i=0;i<len;i++){
    let s = Math.max(-1, Math.min(1, sam[i]));
    dv.setInt16(44+i*2, s<0 ? s*0x8000 : s*0x7fff, true);
  }
  return new Blob([buf], {type:"audio/wav"});
}

async function fonemIsleBlob(blob){
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC){ duyur("Ses işleme bu tarayıcıda yok."); return null; }
    const ac = new AC();
    const buf = await ac.decodeAudioData(await blob.arrayBuffer());
    const x = buf.getChannelData(0);
    let enY = 0;
    for(let i=0;i<x.length;i++) enY = Math.max(enY, Math.abs(x[i]));
    const esik = Math.max(enY*0.08, 0.005);
    let ilk = -1, son = -1;
    for(let i=0;i<x.length;i++){ if(Math.abs(x[i]) > esik){ if(ilk<0) ilk=i; son=i; } }
    if(ilk < 0){ duyur("Ses kısık kaldı, tekrar dene."); SES.yanlis(); return null; }
    const pad = Math.ceil(buf.sampleRate*0.04);
    ilk = Math.max(0, ilk-pad); son = Math.min(x.length-1, son+pad);
    const parca = x.slice(ilk, son+1);
    /* seviye normilasyonu — tepe 0.85 */
    let tepe = 0;
    for(let i=0;i<parca.length;i++) tepe = Math.max(tepe, Math.abs(parca[i]));
    const kazanc = tepe>0 ? 0.85/tepe : 1;
    for(let i=0;i<parca.length;i++) parca[i] *= kazanc;
    /* 22 kHz'e çevrim (localStorage boyutu için) */
    const RATE = 22050;
    const ofl = new OfflineAudioContext(1, Math.max(1, Math.ceil(parca.length*RATE/buf.sampleRate)), RATE);
    const kisaBuf = ac.createBuffer(1, parca.length, buf.sampleRate);
    kisaBuf.getChannelData(0).set(parca);
    const src = ofl.createBufferSource(); src.buffer = kisaBuf; src.connect(ofl.destination);
    const render = await ofl.startRendering();
    const y = render.getChannelData(0);
    /* 10ms fade-in/out */
    const fade = Math.floor(RATE*0.01);
    for(let i=0;i<fade && i<y.length;i++){ y[i] *= i/fade; y[y.length-1-i] *= i/fade; }
    return fonemWavYap(y, RATE);
  }catch(e){
    duyur("Ses işlemede sorun: "+e.message); SES.yanlis();
    return null;
  }
}

function blobToDataURL(blob){
  return new Promise((onlu, cav) => {
    const r = new FileReader();
    r.onload = () => onlu(r.result);
    r.onerror = cav;
    r.readAsDataURL(blob);
  });
}

/* Stüdyo KART — yönetici paneline eklenir */
function fonemStudyoKart(){
  const kutu = el("div","yonetKart");
  kutu.append(el("div","","<b>🎤 Fonem Stüdyo — kendi sesinden kayıt</b><br><small style='color:#666'>29 sesin kendi sesinle kaydı. Sessiz harflerde harf adını ('TE') DEĞİL sesin kendisini söyle — her harfin notu altında. Kayıtlar bu tarayıcıya kaydolur ve oyunlarda önce bunlar çalar.</small>"));
  const durum = el("div","",""); durum.style.cssText = "font-size:18px;margin:6px 0";

  const ızgara = el("div","");
  ızgara.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;justify-content:center";
  let secile = null;

  function isaretle(){
    ızgara.innerHTML = "";
    const k = yerelFonemler();
    [...FONEM_HARFLER].forEach(h=>{
      const b = el("button","", h + (k[h]?" ✓":""));
      b.style.cssText = "min-width:44px;min-height:44px;font-size:20px;font-weight:bold;border-radius:12px;border:2px solid #90a4ae;background:"+(k[h]?"#c8e6c9":"#fff")+";";
      if(secile===h) b.style.outline = "3px solid #fbc02d";
      b.addEventListener("click",()=>{ SES.tus(); secile = h; ciz(); });
      ızgara.append(b);
    });
    durum.innerHTML = "Kayıtlı: <b>" + Object.keys(k).length + " / 29</b>";
  }

  const pano = el("div","");
  pano.style.cssText = "text-align:center;background:#fffde7;border:2px dashed #ffd54f;border-radius:14px;padding:10px;margin-top:10px";
  let kayitAkiyor = false, hazirKayit = null;   /* hazirKayit: {harf, url} — işlenmiş, KAYDET'i bekleyen ses */
  const kayitDurum = el("div","",""); kayitDurum.style.cssText = "font-size:16px;margin:6px 0;min-height:20px";
  const btnKayit = el("button","uic"); btnKayit.innerHTML = "🎙️ <small>Kaydı başlat</small>"; btnKayit.style.fontSize="20px";
  const btnKaydet = el("button","uic"); btnKaydet.innerHTML = "💾 <small>Kaydet</small>"; btnKaydet.style.fontSize="20px";
  const btnDinle = el("button","uic"); btnDinle.innerHTML = "▶ <small>Dinle</small>"; btnDinle.style.fontSize="20px";
  const btnSil = el("button","uic"); btnSil.innerHTML = "🗑 <small>Sil</small>"; btnSil.style.fontSize="20px";

  function ciz(){
    isaretle();
    if(!secile){
      pano.innerHTML = "<small style='opacity:.7'>Üstten bir harf seç, sonra 🎙️ düğmesine bas.</small>";
      return;
    }
    pano.innerHTML = "";
    pano.append(el("div","", "<div style='font-size:46px;font-weight:bold'>"+secile+"</div>" +
      "<div style='font-size:16px;margin:6px 0;color:#6d4c41'>"+(FONEM_NOT[secile]||"")+"</div>"));
    const k = yerelFonemler();
    btnKayit.innerHTML = kayitAkiyor ? "⏳ <small>DURDUR</small>" : "🎙️ <small>Kaydı başlat</small>";
    /* 💾: işlenmiş ama henüz kaydedilmemiş ses varsa (ya da bu harfte hazır kayıt varsa) aktif */
    btnKaydet.disabled = !(hazirKayit && hazirKayit.harf === secile) && !k[secile];
    btnKaydet.innerHTML = (hazirKayit && hazirKayit.harf === secile) ? "💾 <small>KAYDET</small>" : "💾 <small>Kaydet</small>";
    btnDinle.disabled = !k[secile]; btnSil.disabled = !k[secile];
    kayitDurum.innerHTML = kayitAkiyor
      ? "🔴 <b>Kayıt akıyor…</b> sesi söyle, sonra DURDUR'a bas."
      : (hazirKayit && hazirKayit.harf === secile)
        ? "✅ Yeni kayıt hazır — <b>💾 KAYDET</b>'e bas."
        : (k[secile] ? "✅ Bu harfin kaydı var — ▶ Dinle ile kontrol et." : "🎙️ Kaydı başlat'a bas, sesi söyle.");
    const dugmeler = el("div","secenekler");
    dugmeler.append(btnKayit, btnKaydet, btnDinle, btnSil);
    pano.append(kayitDurum, dugmeler);
  }

  btnKayit.addEventListener("click", async ()=>{
    if(!secile){ duyur("Önce harf seç."); SES.yanlis(); return; }
    if(kayitAkiyor){ try{ __fonemmr.stop(); }catch(e){} return; }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder){
      duyur("Bu tarayıcıda mikrofon desteği yok — Edge/Chrome dene."); SES.yanlis(); return;
    }
    try{
      __fonemakis = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false, noiseSuppression:false, autoGainControl:true}});
    }catch(e){ duyur("Mikrofon açılamadı: " + e.name); SES.yanlis(); return; }
    __fonemmr = new MediaRecorder(__fonemakis);
    __fonemparcalar = [];
    __fonemmr.ondataavailable = e => { if(e.data && e.data.size) __fonemparcalar.push(e.data); };
    __fonemmr.onstop = async ()=>{
      kayitAkiyor = false;
      try{ __fonemakis.getTracks().forEach(t=>t.stop()); }catch(e){}
      ciz();
      try{
        const br = new Blob(__fonemparcalar, {type: __fonemmr.mimeType || "audio/webm"});
        const wav = await fonemIsleBlob(br);
        if(!wav){ ciz(); return; }
        const url = await blobToDataURL(wav);
        hazirKayit = {harf: secile, url};   /* 💾 KAYDET her zaman kullanılabilir */
        const okundu = fonemKaydetY(secile, url);
        const a = new Audio(url);
        const p = a.play(); if(p && p.catch) p.catch(()=>{});
        SES.dogru();
        duyur(okundu ? "Kayıt alındı ve kaydedildi ✓ (💾 ile yeniden kaydedebilirsin)" : "Kayıt alındı — 💾 KAYDET veya ⬇️ kayitlar.js indir.");
        ciz();
      }catch(e){ duyur("İşlemede sorun: "+e.message); SES.yanlis(); ciz(); }
    };
    __fonemmr.start();
    kayitAkiyor = true; ciz();
  });

  /* Manuel kaydet: seslenmemiş/işlemiş kaydı tarayıcıya yazar (otomatik kayıt başarısızsa yedek) */
  btnKaydet.addEventListener("click", ()=>{
    if(!(hazirKayit && hazirKayit.harf === secile)){
      /* Bu harfte zaten kayıt varsa, onu yeniden yazar (onarım) */
      const k = yerelFonemler();
      if(!k[secile]){ duyur("Önce 🎙️ ile kayıt al."); SES.yanlis(); return; }
    }
    SES.tus();
    const url = (hazirKayit && hazirKayit.harf === secile) ? hazirKayit.url : yerelFonemler()[secile];
    if(fonemKaydetY(secile, url)){
      SES.dogru(); duyur(secile + " kaydedildi ✓");
    }else{
      /* Kalıcı belleğe sığmadı — oturum içi çalışır, dosyaya taşımak için kayitlar.js */
      if(!window.ORTAK_SES_KAYITLARI) window.ORTAK_SES_KAYITLARI = {fonem:{},hece:{},kelime:{}};
      window.ORTAK_SES_KAYITLARI.fonem[secile] = url;
      duyur("Tarayıcı hafızası doldu — bu oturumda çalar. Kalıcı olması için ⬇️ kayitlar.js indir.");
    }
    ciz();
  });

  btnDinle.addEventListener("click", ()=>{
    const k = yerelFonemler();
    if(!k[secile]){ duyur("Önce kayıt al."); SES.yanlis(); return; }
    SES.tus();
    const a = new Audio(k[secile]);
    const p = a.play(); if(p && p.catch) p.catch(()=>{});
  });
  btnSil.addEventListener("click", ()=>{
    SES.tus(); fonemSil(secile); duyur(secile+" kaydı silindi."); ciz();
  });

  /* üst düğmeler */
  const ust = el("div","secenekler");
  const btnIndir = el("button","uic","⬇️ <small>kayitlar.js indir</small>"); btnIndir.style.fontSize="20px";
  btnIndir.addEventListener("click", ()=>{
    SES.tus();
    const jsText =
      "/* Fonem Stüdyo dışa aktarım — bu dosyayı assets/sesler/kayitlar.js olarak kaydet\n" +
      "   ve index.html'e <script src=\"../assets/sesler/kayitlar.js\"></script> ekle. */\n" +
      "window.ORTAK_SES_KAYITLARI = window.ORTAK_SES_KAYITLARI || {fonem:{},hece:{},kelime:{}};\n" +
      "window.ORTAK_SES_KAYITLARI.fonem = window.ORTAK_SES_KAYITLARI.fonem || {};\n" +
      "Object.assign(window.ORTAK_SES_KAYITLARI.fonem, " + JSON.stringify(yerelFonemler()) + ");\n";
    const blobS = new Blob([jsText], {type:"text/javascript"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blobS);
    a.download = "kayitlar.js";
    a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
  });
  const btnTemiz = el("button","uic","🧹 <small>Hepsini sil</small>"); btnTemiz.style.fontSize="20px";
  btnTemiz.addEventListener("click", ()=>{
    SES.tus(); try{ localStorage.removeItem("fonemKayitlari"); }catch(e){}
    window.ORTAK_SES_KAYITLARI.fonem = {};
    secile = null; ciz(); duyur("Tüm yerel fonem kayıtları silindi.");
  });
  ust.append(btnIndir, btnTemiz);

  kutu.append(durum, ızgara, pano, ust);
  ciz();
  window.__fonemCiz = ciz;   /* dışarıdan (kaydet/sil) çağrılınca kart güncellensin */
  return kutu;
}
