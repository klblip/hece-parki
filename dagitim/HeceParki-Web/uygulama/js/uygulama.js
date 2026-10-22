/* Okuyorum — Uygulama (özgün, offline) */
"use strict";

/* ---------- küçük yardımcılar ---------- */
function el(tag, cls, html){
  const d=document.createElement(tag);
  if(cls) d.className=cls;
  if(html!=null) d.innerHTML=html;
  return d;
}
function uret(dizi){ return dizi[Math.floor(Math.random()*dizi.length)]; }
function karistir(dizi){
  const a=dizi.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function farkli(dizi,kac){ return karistir(dizi).slice(0,kac); }
function duyur(metin){
  const d=document.getElementById("duyuru");
  if(d) d.textContent=String(metin||"");
}
function tiklanabilir(k, fn){
  k.setAttribute("role","button");
  k.tabIndex=0;
  k.addEventListener("keydown",e=>{
    if(e.key==="Enter" || e.key===" "){ e.preventDefault(); fn(); }
  });
}
function konfeti(metin){
  const hav=[...Array(14)].map((_,i)=>setTimeout(()=>{
    const k=document.createElement("div");
    k.className="konfeti";
    k.textContent=metin||["🎉","⭐","🌷","✨","🎈","🐞"][Math.floor(Math.random()*6)];
    k.style.left=(Math.random()*90+5)+"vw";
    document.body.appendChild(k);
    setTimeout(()=>k.remove(),2300);
  },i*90));
}
function tebrik(baslik, alt, butonMetin, tik){
  konfeti(); SES.bitti();
  const t=el("div","tebrik");
  t.setAttribute("role","dialog");
  t.setAttribute("aria-modal","true");
  t.setAttribute("aria-label",baslik||"Tebrikler");
  t.append(el("div","buyuk","🏆"));
  t.append(el("div","",
    `<h2 style="margin:4px">${baslik}</h2><p style="font-size:24px;margin:4px">${alt||""}</p>`));
  const b=el("button","",butonMetin||"Tekrar Oyna");
  b.style.background="#00897b";
  b.onclick=()=>{ t.remove(); tik&&tik(); };
  const e=el("button","","Etkinliklere Dön");
  e.style.background="#90a4ae";
  e.onclick=()=>{ t.remove(); gitGrup(durum.grup); };
  t.append(b,e);
  document.body.appendChild(t);
  b.focus();
  duyur((baslik||"Tebrikler")+" "+(alt||""));
}

/* ---------- durum (kayıt veri.js'te: kayit, kayitYuk, kayitYaz) ---------- */
const durum={ grup:0, akt:null };

/* ---------- üst bar ---------- */
const uE=document.getElementById("btnEv");
const uM=document.getElementById("btnMenu");
const uS=document.getElementById("btnSes");
const uY=document.getElementById("btnYonet");
const uO=document.getElementById("btnOgr");
const uOF=document.getElementById("btnOgrFab");
const uP=document.getElementById("puanChip");
uE.addEventListener("click",()=>{ konusDur(); anaEkran(); });
uM.addEventListener("click",()=>{ konusDur(); if(durum.akt){ durum.akt=null; gitGrup(durum.grup); } else anaEkran(); });
uY.addEventListener("click",()=>{ zamanlukTemizle(); durum.akt=null; yoneticiEkran(); });
uO.addEventListener("click",()=>{ SES.tus(); carkiAc(); });
uOF.addEventListener("click",()=>{ SES.tus(); carkiAc(); });
uS.addEventListener("click",()=>{
  OYUNSES.acik=!OYUNSES.acik;
  uS.textContent=OYUNSES.acik?"🔊":"🔇";
  if(!OYUNSES.acik) konusDur();
});
function puanGoster(){ uP.textContent="🐰 "+kayit.puan; }
function puanArt(n){
  kayit.puan+=n; kayitYaz();
  puanGoster(); pistYenile();
  uP.classList.remove("zemp"); void uP.offsetWidth; uP.classList.add("zemp");
}
function baslikPop(){
  const b=document.getElementById("baslik");
  b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
}

/* ---------- ekran yönetimi ---------- */
const main=document.getElementById("main");
let ZAMANLUKLAR=[]; /* etkinlik değişince temizlenen çağrı limiterları */
function zamanlukTemizle(){ ZAMANLUKLAR.forEach(t=>clearInterval(t)); ZAMANLUKLAR=[]; konusDur();
  const bi=document.getElementById("balonIpus"); if(bi) bi.remove();
}
function buyukHarf(h){ return h==="i"?"İ":h.toUpperCase(); }

function bilgiCip(metin){
  const c=el("div","bilgiCip",metin);
  c.addEventListener("click",()=>{ SES.tus(); });
  return c;
}
function yaziKarti(html){
  return el("div","buyukKart",html);
}
/* ortak seçenek butonu */
function secenek(metin, dogruMu, onTik){
  const b=el("button","sec",metin);
  b.addEventListener("click",()=>{
    if(dogruMu){
      b.classList.add("dogru"); SES.dogru(); puanArt(3);
      duyur("Doğru: "+metin);
      setTimeout(()=>{ if(onTik) onTik(); },650);
    }else{
      b.classList.add("yanlis"); SES.yanlis();
      duyur("Tekrar dene.");
      setTimeout(()=>b.classList.remove("yanlis"),600);
    }
  });
  return b;
}

/* ======== ANA EKRAN ======== */
function hedefSol(){ return Math.min(88, 4+Math.min(kayit.puan,120)*0.7); }
function pistYenile(){
  const r=document.getElementById("tavsan");
  if(r) r.style.left=hedefSol()+"%";
  const e=document.querySelector(".pistEtiket");
  if(e) e.textContent="Toplam Puan: "+kayit.puan;
}
function pistKur(){
  const kutu=el("div",""); kutu.id="pistKutu";
  const pist=el("div","pist");
  const t=el("div","hayvan","🐢"); t.id="kaplumbaga"; t.style.left="10px";
  const r=el("div","hayvan","🐰"); r.id="tavsan"; r.style.left=hedefSol()+"%";
  const e1=el("div","pistEtiket","Toplam Puan: "+kayit.puan);
  pist.append(t,r,e1);
  kutu.append(pist);
  return kutu;
}
function anaEkran(){
  zamanlukTemizle();
  durum.akt=null;
  puanGoster();
  main.className="";
  main.innerHTML="";
  main.append(pistKur());
  const kartlar=el("div","kartlar");
  GRUPLAR.forEach((g,i)=>{
    const kilitli=(typeof kayit.kilit==="number" && i>kayit.kilit);
    const k=el("div","grpKart"+(g.tum?" tum":"")+(kilitli?" kilitli":""),
      `<h2 style="color:${g.renk};margin:0">${kilitli?"🔒 ":g.tum?"🌐 "+g.ad:g.ad}</h2>
       <div class="harfler">${kilitli?"Sırası henüz gelmedi":g.tum?"Bütün harflerle oyun":g.harfler.map(h=>`<b>${h}</b><span class="ust">${buyukHarf(h)}</span>`).join(" · ")}</div>`);
    k.style.borderBottom=`10px solid ${g.renk}`;
    const ac=()=>{
      if(kilitli){ SES.yanlis(); return; }
      SES.tus(); gitGrup(i);
    };
    k.addEventListener("click",ac);
    tiklanabilir(k,ac);
    kartlar.append(k);
  });
  main.append(kartlar);
  main.append(el("div","","<p style='text-align:center;opacity:.75;font-size:16px'>Bir ses grubu seç ve etkinliklere başla! Her doğru cevap tavşanı ilerletir. 🐰</p>"));
  document.getElementById("baslik").textContent="Okuyorum"; baslikPop();
}

/* ======== GRUP EKRANI ======== */
function gitGrup(gi){
  zamanlukTemizle();
  durum.akt=null; durum.grup=gi;
  const g=GRUPLAR[gi];
  main.className="";
  main.innerHTML="";
  document.getElementById("baslik").textContent=g.ad; baslikPop();

  const bant=el("div","grpBant");
  GRUPLAR.forEach((gg,i)=>{
    const kilitli=(typeof kayit.kilit==="number" && i>kayit.kilit);
    const b=el("button",""+(kilitli?" kilitli":""),(kilitli?"🔒 ":(g.tum?"🌐 ":""))+gg.ad);
    b.style.background=gg.renk;
    if(i===gi) b.classList.add("secili");
    b.addEventListener("click",()=>{
      if(kilitli){ SES.yanlis(); return; }
      SES.tus(); gitGrup(i);
    });
    bant.append(b);
  });
  main.append(bant);
  main.append(el("div","","<h2 style='text-align:center;font-size:26px;margin:8px'><b style='color:"+g.renk+"'>"+g.ad+"</b> sınıfın harfleriyle oynayalım!</h2>"));

  const hs=el("div","harfSandik");
  g.harfler.forEach((h,hi)=>{
    const asil=(h==="i")?"İ":h.toUpperCase();
    const seci = hi<=secimIndex(g);
    const k=el("button","h"+(seci?" seciliHarf":""),`<b>${h}<br><span class="ust">${asil}</span></b>`);
    k.style.borderBottom=`6px solid ${g.renk}`;
    k.title=seci?"Biliniyor — tıkla ve aşamayı buraya kur":"Henüz gelinmedi — tıkla ve aşamayı buraya kur";
    k.setAttribute("aria-label",`${h} harfi, ${seci?"biliniyor":"henüz gelinmedi"}`);
    k.addEventListener("click",()=>{
      SES.tus();
      kayit.secim[g.id]=hi; kayitYaz();
      
      gitGrup(gi);
    });
    hs.append(k);
  });
  main.append(hs);

  /* aşama bilgisi */
  const asamaHarf=g.harfler[secimIndex(g)];
  const set=izinliHarfler(g);
  const bilgi=el("div","");
  bilgi.style.cssText="text-align:center;font-size:18px;margin:2px 0 8px";
  bilgi.innerHTML=`<span>Aşama: <b style="font-size:22px;color:${g.renk}">${asamaHarf} <span class="ust">${buyukHarf(asamaHarf)}</span></b></span>`+
    ` &nbsp;·&nbsp; <span>Bilinen harfler: <b>${set.join(" · ")}</b></span>`+
    ` &nbsp;·&nbsp; <span style="opacity:.75">Üstteki harfe tıklayarak aşamayı değiştir — etkinlikler o harfe göre hazırlanır.</span>`;
  main.append(bilgi);
  const kelimeVar=izinliKelimeler(g).length;
  if(kelimeVar<2){
    main.append(el("div","",`<p style='text-align:center;font-size:16px;color:#c62828'>Bu aşamada yeterli kelime yok; kelime/hece etkinlikleri kilitli. Bir harf daha ilerleyin.</p>`));
  }

  const aktlar=el("div","etkinlikler");
  ETKINLIK.forEach(a=>{
    const uy=etkinlikUygun(a.id,g);
    const k=el("div","akt"+(uy!==true?" pasif":""),`<span class="ico">${a.ico}</span><span>${a.ad}</span>`);
    k.style.borderBottom=`8px solid ${g.renk}`;
    const ac=()=>{
      if(uy!==true){ SES.yanlis(); duyur(uy); return; }
      SES.tus(); durum.akt=a.id; oyunEkrani(a.id);
    };
    k.addEventListener("click",ac);
    tiklanabilir(k,ac);
    if(uy!==true) k.title=uy;
    aktlar.append(k);
  });
  main.append(aktlar);
}

/* ======== OYUN DAĞITICI ======== */
function etkinlikUygun(aktId,g){
  const a=ETKINLIK.find(x=>x.id===aktId);
  if(!a) return "Etkinlik bulunamadı.";
  const gi=GRUPLAR.indexOf(g);
  if(a.gerek==="harf" && izinliHarfler(g).length<1) return "Bu aşamada harf yok.";
  if(a.gerek==="kelime" && izinliKelimeler(g).length<2) return "Bu aşamada yeterli kelime yok. Bir harf daha ilerleyin.";
  if(a.gerek==="cumle"){
    if(!g.tum && gi<1) return "Cümleler 2. gruptan itibaren başlar.";
    if(izinliCumleler(g).length<1) return "Bu aşamada yeterli cümle yok.";
  }
  return true;
}
function oyunEkrani(aktId){
  zamanlukTemizle();
  durum.akt=aktId;
  const akt=ETKINLIK.find(a=>a.id===aktId);
  document.getElementById("baslik").textContent=akt.ad; baslikPop();
  const g=GRUPLAR[durum.grup];
  const uy=etkinlikUygun(aktId,g);
  if(uy!==true){
    main.className="";
    main.innerHTML="";
    main.append(bilgiCip(TALIMAT[aktId]||""));
    main.append(el("div","",`<div style='max-width:640px;margin:20px auto;text-align:center;background:#fff;border-radius:18px;padding:24px;box-shadow:var(--gölge)'>
      <div style='font-size:54px'>🌱</div>
      <h2 style='margin:8px 0'>Henüz hazır değil</h2>
      <p style='font-size:18px;line-height:1.5'>${uy}</p>
      <p style='font-size:16px;opacity:.75'>Öğretmen panelinden aşamayı ilerletebilirsiniz.</p>
    </div>`));
    duyur(uy);
    return;
  }
  main.className="oyun";
  main.innerHTML="";
  if(aktId!=="baloncuk") main.append(bilgiCip(TALIMAT[aktId]));
  const alan=el("div",""); alan.id="oyunAlan";
  alan.style.cssText="display:flex;flex-direction:column;align-items:center;gap:16px;";
  main.append(alan);
  const harita={
    harftanima:oHarftanima, baloncuk:oBaloncuk, heceSay:oHeceSay,
    eksikharf:oEksikHarf, harfAvi:oHarfAvi, heceTreni:oHeceTreni, heceBina:oHeceBina,
    kelimeKasasi:oKelimeKasasi, sesliDikte:oSesliDikte,
    metinOkuma:oMetinOkuma, cumleKur:oCumleKur, zamanaKarsi:oZamanaKarsi,
    kumHavuzu:oKumHavuzu, halatCekme:oHalatCekme,
    tavsanYarisi:oTavsanYarisi, yazOynat:oYazOynat, hafiza:oHafiza,
    roket:oRoketYarisi
  };
  harita[aktId](alan,g);
}

/* ======== 1. HARFİ TANI ======== */
function oHarftanima(alan,g){
  let tur=0; const TOPLAM=6;
  function soru(){
    alan.innerHTML="";
    if(tur>=TOPLAM){
      puanArt(5);
      tebrik("Harfleri tanıdın!",TOPLAM+" soruyu tamamladın, +5 bonus puan!","Tekrar",()=>{tur=0;soru();});
      return;
    }
    const hav=izinliHarfler(g);
    const dogru=uret(hav);
    const diger=farkli(hav.filter(h=>h!==dogru),2);
    const kart=el("div","buyukKart",`<div style="font-size:22px;opacity:.8">Duyduğun sesi seç</div>
      <button class="sec" id="htDinle" style="font-size:22px;padding:10px 22px;margin-top:10px">🔊 Dinle</button>`);
    alan.append(kart);
    const dinle=kart.querySelector("#htDinle");
    dinle.addEventListener("click",()=>{ SES.tus(); SES.fonem(dogru); });
    const s=el("div","secenekler");
    karistir([dogru].concat(diger)).forEach(h=>{
      s.append(secenek(h, h===dogru, ()=>{ tur++; soru(); }));
    });
    alan.append(s);
    alan.append(el("div","bilgiCip","İpucu: sesi tekrar dinlemek için 🔊 dokun."));
    SES.fonem(dogru);
  }
  soru();
}

/* ======== 2. BALON PATLAT (Harf / Hece / Kelime) ======== */
function oBaloncuk(alan,g){
  const renkler=["#ff8a80","#82b1ff","#a5d6a7","#fff176","#b39ddb","#80deea"];
  /* --- mod seçimi --- */
  alan.append(el("div","","<h2 style='font-size:28px'>Ne patlatacağız?</h2>"));
  const modlar=el("div","secenekler");
  const modListesi=[["🔤 Harf","harf"],["🧵 Hece","hece"],["📝 Kelime","kelime"]]
    .filter(m=>m[1]==="harf" || (m[1]==="hece" ? izinliHeceHavuzu(g).length>0 : izinliKelimeler(g).length>0));
  modListesi.forEach(m=>{
    const b=el("button","sec",m[0]);
    b.addEventListener("click",()=>{ SES.tus(); basla(m[1]); });
    modlar.append(b);
  });
  alan.append(modlar);
  if(modListesi.length===1){
    alan.append(el("div","bilgiCip","Bu aşamada yalnız harf balonları var; hece/kelime için bir harf daha ilerleyin."));
  }
  alan.append(el("div","","<p style='font-size:18px;text-align:center;opacity:.8'>🔊 <b>Harf:</b> aynı harften 3 balon patla, yeni harf gelir.<br><b>Hece / Kelime:</b> duyduğun balonu patla, doğrusunda yeni hedef gelir.<br>Ekranda az balon, az karışıklık 🙂</p>"));

  /* --- hedef çipi --- */
  const ipucu=el("div","bilgiCip","");
  ipucu.id="balonIpus";
  ipucu.style.cssText="position:fixed;top:78px;left:50%;transform:translateX(-50%);z-index:9;font-size:27px;";
  ipucu.addEventListener("click",()=>{ if(hedef) konusHedef(); });
  document.body.appendChild(ipucu);

  let mod=null, hedef="", hedefSayac=0;
  let harfDongu=[], digerDongu=[];
  let takimNo=0;   /* her hedef değişiminde artar — geç kalan eski planlı balonlar iptal olur */
  const slotlar=[16,44,70];   /* 3 slot: hedef + 2 çeldirici */
  let slotI=0;

  function konusHedef(){
    if(!hedef) return;
    if(mod==="harf") SES.fonem(hedef);
    else if(mod==="hece") SES.hece(hedef);
    else SES.kelime(hedef);
  }
  function modHavuzu(){
    return mod==="harf"? izinliHarfler(g) : (mod==="hece"? izinliHeceHavuzu(g) : izinliKelimeler(g));
  }
  function hepsiniKaldir(){
    alan.querySelectorAll(".balon").forEach(b=>b.remove());
  }
  function yeniHedef(seslen){
    if(mod==="harf"){
      const hav=izinliHarfler(g);
      /* aynı harf üst üste gelmesin */
      let sec;
      do{ if(!harfDongu.length) harfDongu=karistir(hav); sec=harfDongu.shift(); }while(hav.length>1 && sec===hedef);
      hedef=sec;
      hedefSayac=0;
    }else{
      const hav=modHavuzu();
      let sec;
      do{ if(!digerDongu.length) digerDongu=karistir(hav); sec=digerDongu.shift(); }while(hav.length>1 && sec===hedef);
      hedef=sec;
    }
    ipucu.innerHTML=`🎯 Hedefi dinle <b>🔊</b>`;
    ipucu.setAttribute("aria-label","Hedefi dinle");
    if(seslen!==false) konusHedef();
    takimNo++;
    const tur=takimNo;
    hepsiniKaldir();              /* eski balonlar gitsin */
    setTimeout(()=>doldur(tur),800);  /* yeni takım gelsin */
  }

  function popBalon(icerik, hedefMi, tur){
    if(durum.akt!=="baloncuk") return;
    if(tur!==undefined && tur!==takimNo) return;   /* eski turun planı iptal */
    /* ekranda bir hedef balon varsa ikincisini üretme (zamanlayıcı yarışmasını engelle) */
    if(hedefMi && alan.querySelector('.balon[data-hedef="1"]')) return;
    const b=el("div","balon",icerik);
    if(mod==="harf") b.style.fontSize="58px";
    const boyut=140+Math.random()*50;
    b.style.width=b.style.height=boyut+"px";
    const slot=slotlar[slotI++ % slotlar.length];
    b.style.left=(slot+Math.random()*8-4)+"vw";
    b.style.background=`radial-gradient(circle at 30% 30%, #ffffff, ${uret(renkler)})`;
    b.style.animationDuration=(14+Math.random()*6)+"s";
    b.dataset.hedef = hedefMi? "1":"0";
    b.addEventListener("click",()=>{
      if(!hedefMi){
        b.classList.add("yrun"); SES.yanlis();
        setTimeout(()=>b.remove(),450);
        konusHedef();             /* aynı hedefi tekrar söyle */
        const t=takimNo;
        setTimeout(()=>{ if(t===takimNo && durum.akt==="baloncuk") ekleCeldirici(); },900);
        return;
      }
      b.classList.add("balonOldu"); SES.pop();
      setTimeout(()=>b.remove(),480);
      if(mod==="harf"){
        hedefSayac++; puanArt(1);
        if(hedefSayac>=3){
          SES.dogru(); puanArt(2); pistYenile();
          ipucu.innerHTML=`🎉 3 kez bildin!`;
          setTimeout(()=>yeniHedef(true),1400);
        }else{
          /* sıradaki hedef balon gelsin */
          const t=takimNo;
          setTimeout(()=>{ if(durum.akt==="baloncuk") popBalon(hedef,true,t); },700);
        }
      }else{
        SES.dogru(); puanArt(2); pistYenile();
        setTimeout(()=>yeniHedef(true),700);
      }
    });
    alan.append(b);
    setTimeout(()=>{ if(!b.classList.contains("balonOldu")) b.remove(); },26000);
  }
  function ekleCeldirici(){
    if(durum.akt!=="baloncuk" || !mod) return;
    const cel=karistir(modHavuzu().filter(x=>x!==hedef));
    const c=cel.length? cel[0] : hedef;
    popBalon(c,false);
  }
  /* ekranda hedef + 2 çeldirici: kalabalık yok */
  function doldur(t){
    if(t!==takimNo || durum.akt!=="baloncuk" || !mod || !hedef) return;
    const cel=karistir(modHavuzu().filter(x=>x!==hedef));
    setTimeout(()=>popBalon(hedef,true,t),120);
    setTimeout(()=>popBalon(cel[0]!==undefined? cel[0] : hedef,false,t),900);
    setTimeout(()=>popBalon(cel[1]!==undefined? cel[1] : (cel[0]!==undefined? cel[0] : hedef),false,t),1700);
  }
  /* balon uçuşup giderse hedefi yenile */
  ZAMANLUKLAR.push(setInterval(()=>{
    if(durum.akt!=="baloncuk" || !mod || !hedef) return;
    const bs=[...alan.querySelectorAll(".balon")];
    if(!bs.some(b=>b.dataset.hedef==="1")) popBalon(hedef,true);
  },3500));

  function basla(m){
    alan.innerHTML="";
    alan.id="balonAlan";
    mod=m; hedefSayac=0; harfDongu=[]; digerDongu=[];
    yeniHedef(true);
  }
}

/* ======== 3. KAÇ HECE? ======== */
function oHeceSay(alan,g){
  let tur=0; const TOPLAM=6;
  let mod=null;
  function kolayMi(){ return mod==="kolay"; }
  function secici(){
    alan.innerHTML="";
    alan.append(el("div","","<h2 style='font-size:28px'>Nasıl oynayalım?</h2>"));
    const modlar=el("div","secenekler");
    const bK=el("button","sec","🟢 Kolay — heceler görünür");
    bK.addEventListener("click",()=>{ SES.tus(); kayit.heceMod="kolay"; kayitYaz(); mod="kolay"; basla(); });
    const bN=el("button","sec","🔵 Normal — kelime tek parça");
    bN.addEventListener("click",()=>{ SES.tus(); kayit.heceMod="normal"; kayitYaz(); mod="normal"; basla(); });
    modlar.append(bK,bN);
    alan.append(modlar);
    alan.append(el("div","","<p style='font-size:18px;text-align:center;opacity:.8'>🟢 <b>Kolay:</b> kelime <b>hece · hece</b> ayrılmış görünür — sayması kolay.<br>🔵 <b>Normal:</b> kelime tek parça — kulağı iyi dinle!</p>"));
    
  }
  function basla(){ tur=0; soru(); }
  function soru(){
    alan.innerHTML="";
    if(tur>=TOPLAM){
      puanArt(5);
      tebrik("Hece saymayı bildin!",TOPLAM+" kelimeyi doğru saydın, +5 bonus puan!","Tekrar",()=>{tur=0;soru();});
      return;
    }
    const kelime=uret(izinliKelimeler(g));
    const heceler=hecele(kelime);
    const n=heceler.length;
    if(kolayMi()){
      /* kolay mod: kelime hecelerine ayrılmış, sırayla beliren çipler */
      const kap=el("div","hkKolay");
      const chip=el("div","hkHeceler");
      heceler.forEach((h,i)=>{
        const c=el("span","hkHec",h);
        c.style.animationDelay=(i*0.3)+"s";
        chip.append(c);
      });
      kap.append(chip);
      alan.append(kap);
      konusParcalar(heceler);
    }else{
      alan.append(yaziKarti("<b style='font-size:54px'>"+kelime+"</b>"));
      konus(kelime);
    }
    const s=el("div","secenekler");
    const enCok=Math.max(3,Math.min(5,n));
    for(let i=1;i<=enCok;i++) s.append(secenek(i+" hece", i===n, ()=>{ tur++; soru(); }));
    alan.append(s);
    const tekrar=el("div","bilgiCip","🎧 Tekrar dinle");
    tekrar.addEventListener("click",()=>{ SES.tus(); konus(kelime); });
    alan.append(tekrar);

    /* oyun içinde modu değiştir */
    const sw=el("div","bilgiCip","");
    sw.style.cssText="margin-top:8px";
    sw.innerHTML="🔁 Mod: <b>"+(kolayMi()?"Kolay (heceler görünür)":"Normal")+"</b> — dokun, değiştir";
    sw.addEventListener("click",()=>{ SES.tus(); kayit.heceMod=kolayMi()?"normal":"kolay"; kayitYaz(); mod=kayit.heceMod; basla(); });
    alan.append(sw);
  }
  secici();
}

/* ======== 4. HARF AVI ======== */
function oHarfAvi(alan,g){
  let tur=0; const TOPLAM=5;
  function soru(){
    alan.innerHTML="";
    if(tur>=TOPLAM){
      puanArt(5);
      tebrik("Harfi buldun!",TOPLAM+" görevi tamamladın, +5 bonus puan!","Tekrar",()=>{tur=0;soru();});
      return;
    }
    const hedef=uret(izinliHarfler(g));
    let hav=izinliKelimeler(g).slice();
    let hedefli=hav.filter(w=>w.includes(hedef));
    let hedefsiz=hav.filter(w=>!w.includes(hedef));
    if(hedefli.length<1 || hedefsiz.length<1){
      alan.append(el("div","bilgiCip","Bu aşamada bu ses için yeterli kelime yok. Bir harf daha ilerleyin."));
      return;
    }
    const dogru=uret(hedefli);
    const diger=farkli(hedefsiz.filter(w=>w!==dogru),2);
    const kart=el("div","buyukKart",`<div style="font-size:22px;opacity:.8">Duyduğun ses hangi kelimede?</div>
      <button class="sec" id="haDinle" style="font-size:22px;padding:10px 22px;margin-top:10px">🔊 Dinle</button>`);
    alan.append(kart);
    kart.querySelector("#haDinle").addEventListener("click",()=>{ SES.tus(); SES.fonem(hedef); });
    const s=el("div","secenekler");
    karistir([[dogru,true]].concat(diger.map(w=>[w,false]))).forEach(p=>{
      const b=el("button","sec",p[0]);
      b.addEventListener("click",()=>{
        if(p[1]){
          b.classList.add("dogru"); SES.dogru(); puanArt(3);
          duyur("Doğru: "+p[0]);
          tur++; setTimeout(soru,650);
        }else{
          b.classList.add("yanlis"); SES.yanlis();
          duyur("Tekrar dene.");
          setTimeout(()=>b.classList.remove("yanlis"),600);
        }
      });
      s.append(b);
    });
    alan.append(s);
    SES.fonem(hedef);
  }
  soru();
}

/* ======== 5. CÜMLE KUR ======== */
function oCumleKur(alan,g){
  let tur=0; const TOPLAM=3;
  function soru(){
    alan.innerHTML="";
    if(tur>=TOPLAM){
      puanArt(5);
      tebrik("Cümleleri kurdun!",TOPLAM+" cümleyi tamamladın, +5 bonus puan!","Tekrar",()=>{tur=0;soru();});
      return;
    }
    const cumle=uret(izinliCumleler(g));
    const sirali=cumle.replace(/[.!?]/g,"").split(/\s+/).filter(Boolean);
    let i=0;
    const kart=el("div","");
    kart.style.cssText="min-height:70px;width:min(94vw,900px);background:#fff;border-radius:16px;box-shadow:var(--gölge);display:flex;flex-wrap:wrap;gap:10px;padding:14px;justify-content:center;align-items:center";
    const havuz=el("div","secenekler");
    karistir(sirali.slice()).forEach(pc=>{
      const b=el("button","sec",pc);
      b.addEventListener("click",()=>{
        if(pc===sirali[i]){
          b.classList.add("dogru"); b.disabled=true; SES.tus();
          const parca=el("span",""); parca.textContent=pc;
          parca.style.cssText="font-size:30px;font-weight:bold;background:#e8f5e9;padding:4px 14px;border-radius:10px";
          kart.append(parca);
          i++;
          konus(pc);
          if(i===sirali.length){
            SES.dogru(); puanArt(3); pistYenile();
            setTimeout(()=>konus(cumle),400);
            tur++; setTimeout(soru,1800);
          }
        }else{
          b.classList.add("yanlis"); SES.yanlis();
          setTimeout(()=>b.classList.remove("yanlis"),600);
        }
      });
      havuz.append(b);
    });
    alan.append(kart,havuz);
    const tekrar=el("div","bilgiCip","🔊 Cümleyi dinle");
    tekrar.addEventListener("click",()=>{ SES.tus(); konus(cumle); });
    alan.append(tekrar);
    konus(cumle);
  }
  soru();
}

/* ======== 6. EKSİK HARF ======== */
function oEksikHarf(alan,g){
  let tur=0; const TOPLAM=5;
  function soru(){
    alan.innerHTML="";
    if(tur>=TOPLAM){
      tebrik("Eksikleri buldun!",TOPLAM+" görevi tamamladın.","Tekrar",()=>{tur=0;soru();});
      return;
    }
    const kelimeHav=izinliKelimeler(g);
    const kelime=uret(kelimeHav);
    const idx=Math.floor(Math.random()*kelime.length);
    const eksik=kelime[idx];
    const harfSet=izinliHarfler(g);
    if(!harfSet.includes(eksik)) harfSet.push(eksik); /* aşama dışı kelime düştüyse cevap seçeneklerinde olsun */
    const opsiyonlar=karistir([eksik].concat(farkli(harfSet.filter(h=>h!==eksik),2)));
    const kart=el("div","buyukKart","");
    function cizSoru(){
      kart.innerHTML=
        "<span>"+kelime.slice(0,idx)+"</span>"+
        "<span style='color:#e53935;border-bottom:6px dotted #e53935;padding:0 16px;min-width:46px;justify-content:center'>?</span>"+
        "<span>"+kelime.slice(idx+1)+"</span>";
    }
    function cizTamam(){
      kart.innerHTML=
        "<span style='color:#1b5e20;font-size:56px;font-weight:900'>"+kelime.slice(0,idx)+"</span>"+
        "<span style='display:inline-flex;align-items:center;justify-content:center;background:#c8e6c9;border:4px solid #43a047;border-radius:12px;min-width:56px;margin:0 6px;color:#1b5e20;font-size:56px;font-weight:900;animation:dogruZipla .5s cubic-bezier(.34,1.56,.64,1)'>"+eksik+"</span>"+
        "<span style='color:#1b5e20;font-size:56px;font-weight:900'>"+kelime.slice(idx+1)+"</span>";
      kart.style.border="6px solid #43a047";
      kart.style.background="#e8f5e9";
    }
    cizSoru();
    alan.append(kart);
    const s=el("div","secenekler");
    let bitti=false;
    opsiyonlar.forEach(h=>{
      const b=secenek(h,h===eksik,()=>{
        bitti=true;
        s.innerHTML="";
        cizTamam();
        konusDur();
        konus(kelime); /* kelimeyi net ve bütünüyle duyur */
        pistYenile();
        setTimeout(()=>{ tur++; soru(); },2600); /* tam kelime 2-3 sn ekranda kalır + sesi duyulur */
      });
      if(bitti) return;
      s.append(b);
    });
    alan.append(s);
    const tekrar=el("div","bilgiCip","🔊 Kelimeyi tekrar dinle");
    tekrar.addEventListener("click",()=>{ SES.tus(); konus(kelime); });
    alan.append(tekrar);
    konus(kelime);
  }
  soru();
}

/* ======== 4. HECE TRENİ ======== */
function oHeceTreni(alan,g){
  let tur=0; const TOPLAM=4;
  function soru(){
    alan.innerHTML="";
    if(tur>=TOPLAM){
      tebrik("Tren hazır!","4 kelimeyi tamamladın.","Tekrar",()=>{tur=0;soru();});
      return;
    }
    const kelime=uret(izinliKelimeler(g));
    const heceler=hecele(kelime);
    /* lokomotif + boş vagonların sıralı dizilişi */
    const tren=el("div","tren");
    tren.append(el("div","lokomotif","🚂"));
    const slotlar=heceler.map(()=>{
      const v=el("div","vagon bos","?");
      tren.append(v);
      return v;
    });
    alan.append(tren);
    const chips=el("div","secenekler");
    let doldu=0;
    karistir(heceler).forEach(h=>{
      const b=el("button","sec",h);
      b.addEventListener("click",()=>{
        if(!b.disabled && doldu<heceler.length && h===heceler[doldu]){
          const v=slotlar[doldu];
          v.textContent=h; v.classList.remove("bos"); v.classList.add("dolu");
          b.disabled=true; b.style.background="#c8e6c9";
          SES.pop(); doldu++;
          if(doldu===heceler.length){
            SES.dogru(); puanArt(4); pistYenile();
            chips.style.opacity=".35"; chips.style.pointerEvents="none";
            konus(kelime);
            setTimeout(()=>{
              tren.classList.add("kalkiyor"); /* tren hareket eder, vagonlar bağlı gider */
              setTimeout(()=>{
                /* vagonlar birleşir: tek vagon — kelimenin bütün hâli */
                slotlar.forEach(v=>v.remove());
                tren.classList.remove("kalkiyor");
                tren.append(el("div","vagon birlesik",kelime));
                SES.dogru();
                konus(kelime);
                pistYenile();
                setTimeout(()=>{ tur++; soru(); },2000);
              },1000);
            },600);
          }
        }else if(!b.disabled){
          SES.yanlis();
          if(heceler[doldu]) SES.hece(heceler[doldu]);
        }
      });
      chips.append(b);
    });
    alan.append(chips);
    const tekrar=el("div","bilgiCip","🎧 Tekrar dinle");
    tekrar.addEventListener("click",()=>{ SES.tus(); konusParcalar(heceler); });
    alan.append(tekrar);
    konusParcalar(heceler);
  }
  soru();
}

/* ======== 4b. HECE FABRİKASI (hece birleştirme · tek oyuncu / 3 yarışmacı) ======== */
function oHeceBina(alan,g){
  const HIZ=(typeof window.__TESTHIZ==="number" && window.__TESTHIZ>0)?window.__TESTHIZ:1;
  function gec(ms,fn){ setTimeout(fn, ms*HIZ); }
  function resimliHavuz(){
    const e=g.emoji||{};
    return izinliKelimeler(g).filter(w=>{
      if(!e[w]) return false;
      const h=hecele(w);
      return (h.length===2&&w.length<=6)||(h.length===3&&w.length<=7);
    });
  }
  function celdirici(hav,kelime,heceler){
    const other=[];
    hav.forEach(w=>{ if(w!==kelime) other.push.apply(other,hecele(w)); });
    const ozel=[...new Set(other)].filter(h=>heceler.indexOf(h)<0);
    const cel=farkli(ozel,2);
    if(cel.length<2){
      farkli(izinliHeceHavuzu(g).filter(h=>heceler.indexOf(h)<0&&cel.indexOf(h)<0),2-cel.length).forEach(h=>cel.push(h));
    }
    return cel;
  }
  /* makine kurar; hecele parçası tam tamamlanınca tam callback işletilir */
  function makineYap(kelime, tam){
    const e=g.emoji||{};
    const heceler=hecele(kelime);
    const hav=resimliHavuz();
    const cel=celdirici(hav,kelime,heceler);
    const makine=el("div","fabrika");
    makine.append(el("div","fabUst",e[kelime]));
    makine.append(el("div","fabDisli","⚙️"));
    const yuvaSirasi=el("div","fabYuvalar");
    const yuvalar=heceler.map((_,n)=>{
      const y=el("div","fabYuva","<i>"+(n+1)+"</i><b>?</b>");
      yuvaSirasi.append(y);
      return y;
    });
    makine.append(yuvaSirasi);
    const urun=el("div","fabUrun","");
    const serit=el("div","fabSerit");
    serit.append(urun);
    makine.append(serit);
    makine.__fab={kelime, heceler};   /* hata ayıklama/test kanca */
    alan.append(makine);
    const parcalar=el("div","fabParcalar");
    let doldu=0, bitti=false;
    karistir([...heceler,...cel]).forEach(h=>{
      const b=el("button","fabParca",h);
      b.addEventListener("click",()=>{
        if(bitti||b.disabled) return;
        if(h===heceler[doldu]){
          b.disabled=true; b.classList.add("alindi");   /* parça makineye girdi */
          const y=yuvalar[doldu];
          y.innerHTML="<i>"+(doldu+1)+"</i><b>"+h+"</b>";
          y.classList.add("dolu");
          SES.pop(); SES.hece(h);
          doldu++;
          if(doldu===heceler.length){
            bitti=true;
            /* parçalar birleşti — ürün şeride düşer (geçiş animasyonu CSS'te) */
            urun.innerHTML=`<span class="urunEmoji">${e[kelime]}</span>${kelime}`;
            urun.classList.add("dolu");
            makine.classList.add("uretici");
            SES.dogru(); puanArt(4); pistYenile();
            gec(650,()=>{ konus(kelime); SES.dogru(); });
            gec(1900,()=>{ tam(); });
          }
        }else{
          /* yanlış parça: makine alarm verir, parça yerine döner */
          SES.yanlis();
          SES.hece(heceler[doldu]);   /* sipariş edilen heceyi hatırlat */
          makine.classList.remove("alarm"); void makine.offsetWidth; makine.classList.add("alarm");
          b.classList.remove("sarsildi"); void b.offsetWidth; b.classList.add("sarsildi");
        }
      });
      parcalar.append(b);
    });
    alan.append(parcalar);
    const tekrar=el("div","bilgiCip","🔊 Kelimeyi tekrar dinle");
    tekrar.addEventListener("click",()=>{ SES.tus(); konus(kelime); });
    const parcala=el("div","bilgiCip","🧩 Hece hece dinle");
    parcala.addEventListener("click",()=>{ SES.tus(); konusParcalar(heceler); });
    alan.append(tekrar,parcala);
    konus(kelime);   /* görev kelimesi önce bir kez — sakin tempo */
  }
  /* ham madde seçici: çocuk kendi kelimesini seçer */
  function hamMaddeSec(kullandi){
    const e=g.emoji||{};
    const hav=resimliHavuz().filter(w=>w!==kullandi);
    if(hav.length<2) return;
    const ov=el("div","hamOrtu");
    ov.setAttribute("role","dialog"); ov.setAttribute("aria-modal","true");
    ov.setAttribute("aria-label","Ham madde seç");
    const kutu=el("div","hamKutu");
    kutu.append(el("div","","<b style=\"font-size:24px;color:var(--vurgu)\">📜 Ham maddeyi seç</b>"));
    const izgara=el("div","hamIzgara");
    farkli(hav,6).forEach(w=>{
      const b=el("button","sec","");
      b.innerHTML=`<span style="font-size:54px">${e[w]}</span><span style="font-size:26px;font-family:inherit">${w}</span>`;
      b.addEventListener("click",()=>{ SES.tus(); ov.remove(); tek(w); });
      izgara.append(b);
    });
    kutu.append(izgara);
    const kapat=el("button","uic","✕ <small>kapatsın</small>");
    kapat.style.fontSize="20px";
    kapat.addEventListener("click",()=>{ SES.tus(); ov.remove(); });
    kutu.append(kapat);
    ov.append(kutu);
    document.body.appendChild(ov);
  }
  /* ---------- TEK OYUNCU ---------- */
  function tek(hedef){
    let tur=0; const TOPLAM=5;
    function soru(istenen){
      alan.innerHTML="";
      if(tur>=TOPLAM){
        puanArt(5); pistYenile();
        const t=el("div","tebrik");
        t.setAttribute("role","dialog"); t.setAttribute("aria-modal","true");
        konfeti(); SES.bitti();
        t.append(el("div","buyuk","🏭"));
        t.append(el("div","","<h2 style=\"margin:4px\">Fabrika çalıştı!</h2><p style=\"font-size:24px;margin:4px\">"+TOPLAM+" kelimeyi birleştirdin, +5 bonus puan!</p>"));
        const b1=el("button","","Tekrar");
        b1.style.background="var(--vurgu)";
        b1.onclick=()=>{ t.remove(); tur=0; soru(); };
        const b2=el("button","","Etkinliklere Dön");
        b2.style.background="#90a4ae";
        b2.onclick=()=>{ t.remove(); gitGrup(durum.grup); };
        t.append(b1,b2);
        document.body.appendChild(t);
        duyur("Fabrika çalıştı!");
        return;
      }
      const hav=resimliHavuz();
      if(hav.length<2){
        alan.append(bilgiCip("Bu aşamada fabrika için yeterli resimli kelime yok. Bir harf daha ilerleyin."));
        return;
      }
      const kelime=(istenen&&hav.indexOf(istenen)>=0)?istenen:uret(hav);
      makineYap(kelime,()=>{ tur++; soru(); });
      /* ham madde seçici + mod çipleri */
      const ham=el("div","bilgiCip","📜 Ham maddeyi seç");
      ham.addEventListener("click",()=>{ SES.tus(); hamMaddeSec(kelime); });
      const yaris=el("div","bilgiCip","👥 3 Yarışmacı");
      yaris.addEventListener("click",()=>{ SES.tus(); kayit.fabrikaMod="yaris"; kayitYaz(); oyuncuSecici(); });
      alan.append(ham,yaris);
    }
    soru(hedef);
  }
  /* ---------- 3 YARIŞMACI ---------- */
  function fabrikaYarisKayit(list){
    kayit.fabrikaYarisSkor=kayit.fabrikaYarisSkor||[];
    list.forEach(o=>{
      const es=kayit.fabrikaYarisSkor.find(s=>s.ad===o.ad);
      if(es) es.puan+=o.puan;
      else kayit.fabrikaYarisSkor.push({ad:o.ad, puan:o.puan});
    });
    kayit.fabrikaYarisSkor.sort((x,y)=>y.puan-x.puan);
    kayit.fabrikaYarisSkor=kayit.fabrikaYarisSkor.slice(0,10);
    kayitYaz();
  }
  function oyuncuSecici(){
    alan.innerHTML="";
    const lider=el("div","yonetKart");
    lider.style.cssText="max-width:520px;display:flex;flex-direction:column;gap:6px";
    const skor=(kayit.fabrikaYarisSkor||[]).slice(0,5);
    lider.append(el("div","","<b>🏭 Fabrika şampiyonları</b>"));
    if(!skor.length) lider.append(el("div","","<p style='opacity:.75;font-size:17px'>İlk şampiyon sizden gelecek!</p>"));
    skor.forEach((s,i)=>{ 
      const sat=el("div","");
      sat.innerHTML=(i+1)+". <b>"+s.ad+"</b> — "+s.puan+" kelime";
      sat.style.cssText="font-size:20px;border-bottom:2px dotted #eceff1;padding:3px 0";
      lider.append(sat);
    });
    alan.append(lider);
    const liste=(kayit.ogrListe||[]).filter(Boolean).slice(0,60);
    const sec=[];
    const baslaB=el("button","sec","▶ Başla!");
    if(liste.length>=3){
      alan.append(el("div","","<div style='font-size:20px;margin:6px 0;text-align:center'>Üç yarışmacı seç:</div>"));
      const cip=el("div","hzOyuncular");
      function cips(){
        cip.innerHTML="";
        liste.forEach(ad=>{
          const i=sec.indexOf(ad);
          const b=el("button","", ad+(i===0?" 1️⃣":(i===1?" 2️⃣":(i===2?" 3️⃣":""))));
          if(i>=0) b.classList.add("secili");
          b.style.minHeight="52px"; b.style.fontSize="20px";
          b.addEventListener("click",()=>{
            SES.tus();
            const j=sec.indexOf(ad);
            if(j>=0) sec.splice(j,1);
            else if(sec.length<3) sec.push(ad);
            else { duyur("Üç yarışmacı — önce birini kaldır."); SES.yanlis(); return; }
            cips(); baslaDur();
          });
          cip.append(b);
        });
        const r=el("button","uic","🎲 <small>Rastgele seç</small>");
        r.style.fontSize="20px";
        r.addEventListener("click",()=>{
          SES.tus();
          const kar=karistir(liste.slice());
          sec.length=0; sec.push(kar[0],kar[1],kar[2]);
          cips(); baslaDur();
          duyur("Rastgele seçim: "+sec[0]+", "+sec[1]+" ve "+sec[2]);
        });
        cip.append(r);
      }
      const kar=karistir(liste.slice());
      sec.push(kar[0],kar[1],kar[2]);   /* açılışta otomatik rastgele üçlü */
      alan.append(cip);
      cips();
      baslaB.addEventListener("click",()=>{
        if(sec.length!==3){ duyur("Üç yarışmacı seç."); SES.yanlis(); return; }
        SES.dogru();
        yarisma(sec.slice());
      });
      alan.append(baslaB);
      function baslaDur(){ baslaB.disabled=sec.length!==3; }
      baslaDur();
    }else{
      alan.append(el("div","bilgiCip","Yarış için öğrenci listesinde en az 3 kişi gerekli. ⚙️ Ayarlar'da yükleyin — isimler buraya kendiliğinden gelir."));
      baslaB.disabled=true;
      alan.append(baslaB);
    }
    const tekCip=el("div","bilgiCip","🧑 Tek oynayayım");
    tekCip.addEventListener("click",()=>{ SES.tus(); kayit.fabrikaMod="tek"; kayitYaz(); tek(); });
    alan.append(tekCip);
    alan.append(el("div","","<p style='font-size:18px;text-align:center;opacity:.8'>Sırayla makineye gelin: her yarışmacı <b>2 kelime</b> yapar — en çok kelime birleştiren kazanır 🏆</p>"));
  }
  function yarisma(adlar){
    const oy=adlar.map(ad=>({ad,puan:0}));
    const TOPLAM=6;
    let r=0;
    function bitis(){
      puanArt(5); pistYenile();
      const t=[...oy].sort((x,y)=>y.puan-x.puan);
      let baslik,alt;
      if(t[0].puan===t[1].puan){
        baslik="Berabere! 🤝";
        alt=t[0].ad+" ve "+t[1].ad+" — "+t[0].puan+" kelime";
      }else{
        baslik=t[0].ad+" kazandı! 🏆";
        alt=t[0].ad+" "+t[0].puan+" · "+t[1].ad+" "+t[1].puan+" · "+t[2].ad+" "+t[2].puan+" kelime";
      }
      fabrikaYarisKayit([t[0],t[1],t[2]].map(o=>({ad:o.ad,puan:o.puan})));
      konfeti(); SES.bitti();
      const tb=el("div","tebrik");
      tb.setAttribute("role","dialog"); tb.setAttribute("aria-modal","true");
      tb.setAttribute("aria-label",baslik);
      tb.append(el("div","buyuk","🏆"));
      tb.append(el("div","","<h2 style=\"margin:4px\">"+baslik+"</h2><p style=\"font-size:24px;margin:4px\">"+alt+"</p>"));
      const b1=el("button","","Yeniden Oyna");
      b1.style.background="var(--vurgu)";
      b1.onclick=()=>{ tb.remove(); yarisma(adlar); };
      const b2=el("button","","👥 Oyuncuları değiştir");
      b2.style.background="#42a5f5";
      b2.onclick=()=>{ tb.remove(); oyuncuSecici(); };
      const b3=el("button","","Etkinliklere Dön");
      b3.style.background="#90a4ae";
      b3.onclick=()=>{ tb.remove(); gitGrup(durum.grup); };
      tb.append(b1,b2,b3);
      document.body.appendChild(tb);
      b1.focus();
      duyur((baslik||"Yarış bitti")+" "+(alt||""));
    }
    function tahta(){
      alan.innerHTML="";
      function tur(){
        if(r>=TOPLAM){ bitis(); return; }
        const kime=oy[r%3];
        alan.innerHTML="";
        const puanSirasi=el("div","hzPuanlar");
        puanSirasi.innerHTML=oy.map((o,i)=>
          `<span class="${i===(r%3)?"hzSira":""}">${i===(r%3)?"▶️ ":""}<b>${o.ad}</b>: <b>${o.puan}</b> kelime</span>`).join("");
        alan.append(puanSirasi);
        makineYap(uret(resimliHavuz()),()=>{ kime.puan++; r++; tur(); });
      }
      tur();
    }
    tahta();
  }
  /* ---------- GİRİŞ ---------- */
  if(kayit.fabrikaMod==="yaris") oyuncuSecici();
  else tek();
}

/* ======== 5. METİN OKUMA ======== */
function oMetinOkuma(alan,g){
  const cumleler=izinliCumleler(g);
  function kur(){
    alan.innerHTML="";
    const cumle=uret(cumleler);
    const panel=el("div","metinPanel");
    const spans=cumle.split(" ").map(w=>{
      const sp=el("span","w",w+"&nbsp;");
      sp.addEventListener("click",()=>{ SES.tus(); konus(w.replace(/[.,!?]/g,"")); });
      panel.append(sp);
      return sp;
    });
    alan.append(panel);
    const kont=el("div","");
    kont.style.cssText="display:flex;gap:16px;align-items:center;justify-content:center";
    const play=el("button","uic",`<span style="font-size:34px">▶</span> <small>okumayı dinle</small>`);
    play.style.fontSize="22px";
    const yeni=el("button","uic",`<span style="font-size:34px">🔄</span> <small>yeni cümle</small>`);
    yeni.style.fontSize="22px";
    yeni.addEventListener("click",kur);
    play.addEventListener("click",()=>{
      SES.tus(); konus(cumle);
      let i=0;
      const stamper=setInterval(()=>{
        spans.forEach(s=>s.classList.remove("aktif"));
        if(i<spans.length){ spans[i].classList.add("aktif"); i++; } else clearInterval(stamper);
      },480);
    });
    kont.append(play,yeni);
    alan.append(kont);
  }
  kur();
}

/* ======== 6. ZAMANA KARŞI (skor tablosuyla) ======== */
function oZamanaKarsi(alan,g){
  const asamaHarf=g.harfler[secimIndex(g)];
  function oyunBaslat(){
    let skor=0; let kalan=60;
    alan.innerHTML="";
    const sure=el("div","sure","⏱ 60");
    alan.append(sure);
    const qalan=el("div","");
    qalan.style.cssText="display:flex;flex-direction:column;align-items:center;gap:14px";
    alan.append(qalan);
    const t=setInterval(()=>{
      kalan--; sure.textContent="⏱ "+kalan;
      if(kalan<=0){
        clearInterval(t);
        puanArt(skor);
        bitir(skor);
      }
    },1000);
    ZAMANLUKLAR.push(t);
    const hav=izinliKelimeler(g);
    function soru(){
      qalan.innerHTML="";
      const dogru=uret(hav);
      const s=el("div","secenekler");
      karistir([dogru].concat(farkli(hav.filter(w=>w!==dogru),1)))
        .forEach(w=>s.append(secenek(w,w===dogru,()=>{ skor++; soru(); })));
      qalan.append(s);
      const tekrar=el("div","bilgiCip","🔊 Tekrar dinle");
      tekrar.addEventListener("click",()=>{ SES.tus(); konus(dogru); });
      qalan.append(tekrar);
      konus(dogru);
    }
    soru();
  }
  function bitir(hedefSkor){
    if(hedefSkor<=0){
      tebrik("Süre bitti!",hedefSkor+" kelime buldun.","Tekrar",()=>oyunEkrani("zamanaKarsi"));
      return;
    }
    alan.innerHTML="";
    alan.append(el("div","","<h3 style='font-size:30px'>🏁 "+hedefSkor+" kelime buldun!</h3>"));
    const adIn=document.createElement("input");
    adIn.type="text"; adIn.maxLength=12; adIn.placeholder="Adını yaz (isteğe bağlı)";
    adIn.value=kayit.sonAd||"";
    adIn.style.cssText="font-size:26px;padding:12px 16px;border-radius:14px;border:3px solid #cfd8dc;width:min(70vw,360px);font-family:inherit";
    const kaydetBtn=el("button","sec","💾 Skoru Kaydet");
    kaydetBtn.addEventListener("click",()=>{
      const ad=(adIn.value.trim()||"İsimsiz").slice(0,12);
      kayit.sonAd=ad;
      kayit.skorlar=(kayit.skorlar||[]);
      kayit.skorlar.push({ ad, puan:hedefSkor, detay:g.ad+" · "+buyukHarf(asamaHarf)+" aşaması" });
      kayit.skorlar.sort((a,b)=>b.puan-a.puan);
      kayit.skorlar=kayit.skorlar.slice(0,8);
      kayitYaz();
      tablo(true);
    });
    const gec=el("button","uic","⏭ <small>Skoru kaydetmeden çık</small>");
    gec.style.fontSize="20px";
    gec.addEventListener("click",()=>oyunEkrani("zamanaKarsi"));
    alan.append(adIn,kaydetBtn,gec);
    
  }
  function tablo(baslaDugmesi){
    alan.innerHTML="";
    alan.append(el("div","","<h2 style='font-size:30px'>⏱️ Zamana Karşı</h2>"));
    const skorlar=(kayit.skorlar||[]).slice(0,5);
    if(skorlar.length){
      const tab=el("div","yonetKart");
      tab.style.cssText="max-width:520px;display:flex;flex-direction:column;gap:6px";
      tab.append(el("div","","<b>🏆 En iyiler</b>"));
      skorlar.forEach((s,i)=>{
        const sat=el("div","");
        sat.innerHTML=`${i+1}. <b>${s.ad}</b> — ${s.puan} kelime <small style="opacity:.65">(${s.detay})</small>`;
        sat.style.cssText="font-size:20px;border-bottom:2px dotted #eceff1;padding:3px 0";
        tab.append(sat);
      });
      alan.append(tab);
    }else{
      alan.append(el("div","","<p style='opacity:.75;font-size:17px'>İlk rekoru sen koy!</p>"));
    }
    if(baslaDugmesi){
      const b=el("button","sec","▶ Başla!");
      b.addEventListener("click",()=>{ SES.dogru(); oyunBaslat(); });
      alan.append(b);
      
    }else{
      const r=el("button","sec","🔁 Tekrar Oyna");
      r.addEventListener("click",()=>oyunEkrani("zamanaKarsi"));
      alan.append(r);
      
    }
  }
  tablo(true);
}

/* ======== 8. KUM HAVUZU (aşama harfleriyle) ======== */
function oKumHavuzu(alan,g){
  const harfler=izinliHarfler(g);
  let seciliHarf=harfler[harfler.length-1];
  const cvw=el("div","");
  cvw.style.cssText="width:min(92vw,880px)";
  const cv=document.createElement("canvas");
  cv.width=840; cv.height=460;
  cv.style.cssText="width:100%;display:block;border-radius:20px;border:12px solid #d9a066;box-shadow:var(--gölge);touch-action:none;background:#e6b87d";
  cvw.append(cv);
  const cx=cv.getContext("2d");
  let silgi=false, renk="#7a4a12";
  function arka(){
    cx.fillStyle="#e6b87d"; cx.fillRect(0,0,cv.width,cv.height);
    cx.fillStyle="rgba(120,70,20,.16)";
    cx.font="320px 'TTKB Dik Temel Abece','Segoe UI',sans-serif";
    cx.textAlign="center"; cx.textBaseline="middle";
    cx.fillText(seciliHarf, cv.width/2, cv.height/2);
    cx.fillStyle="rgba(120,70,20,.55)";
    cx.font="24px 'TTKB Dik Temel Abece','Segoe UI',sans-serif";
    cx.fillText(seciliHarf+" ("+buyukHarf(seciliHarf)+")  — rehberin üzerine yaz!", cv.width/2, 415);
  }
  arka();
  function pos(e){
    const r=cv.getBoundingClientRect();
    return { x:(e.clientX-r.left)*cv.width/r.width, y:(e.clientY-r.top)*cv.height/r.height };
  }
  let ciziliyor=false, son=null;
  cv.addEventListener("pointerdown",e=>{ ciziliyor=true; son=pos(e); try{cv.setPointerCapture(e.pointerId);}catch(x){} });
  cv.addEventListener("pointermove",e=>{
    if(!ciziliyor) return;
    const p=pos(e);
    cx.strokeStyle= silgi? "#e6b87d":renk;
    cx.lineWidth= silgi? 36:12;
    cx.lineCap="round";
    cx.beginPath(); cx.moveTo(son.x,son.y); cx.lineTo(p.x,p.y); cx.stroke();
    son=p;
  });
  ["pointerup","pointercancel","pointerleave"].forEach(ev=>cv.addEventListener(ev,()=>ciziliyor=false));
  function aracKur(){
    /* harf seçici: aşamadaki harfler, seçili sarı */
    const secici=el("div","kumaraclar");
    const chips=[];
    harfler.forEach(h=>{
      const b=el("button","sec",h);
      b.style.cssText="min-width:70px;min-height:70px;font-size:28px;padding:6px";
      b.addEventListener("click",()=>{
        SES.tus(); seciliHarf=h; silgi=false;
        boya();
        SES.fonem(h);
        chips.forEach(c=>{ c.style.background="#fff"; c.style.borderColor="#d7ccc8"; });
        b.style.background="#fff59d"; b.style.borderColor="#fbc02d";
      });
      chips.push(b); secici.append(b);
    });
    chips.forEach((c,i)=>{
      if(harfler[i]===seciliHarf){ c.style.background="#fff59d"; c.style.borderColor="#fbc02d"; }
    });
    const arac=el("div","kumaraclar");
    ["#7a4a12","#b71c1c","#1565c0","#2e7d32","#4a148c","#37474f"].forEach(r=>{
      const d=el("div","renkDaire"); d.style.background=r;
      d.addEventListener("click",()=>{ renk=r; silgi=false; SES.tus(); });
      arac.append(d);
    });
    const sb=el("button","uic","🧽 <small>silgi</small>"); sb.style.fontSize="20px";
    sb.addEventListener("click",()=>{ silgi=true; SES.tus(); });
    const tb=el("button","uic","🧹 <small>süpür</small>"); tb.style.fontSize="20px";
    tb.addEventListener("click",()=>{ boya(); SES.tus(); });
    arac.append(sb,tb);
    alan.innerHTML="";
    alan.append(secici,cvw,arac);
  }
  function boya(){ arka(); }
  SES.fonem(seciliHarf);
  aracKur();
}

/* ======== 9. HALAT ÇEKME ======== */
function oHalatCekme(alan,g){
  let mod=null;
  function kimEtiket(k){
    if(k==="a") return mod==="bilgisayar"?"🤖 Bilgisayar":"🧒 Arkadaş";
    return "🧒 Sen";
  }
  function yukle(){
    alan.innerHTML="";
    const skor={a:0,b:0};
    const bar=el("div","takimSkor",
      `<span style="color:#1565c0" id="tugA">${kimEtiket("a")} <b id="tugAskor">0</b></span>
       <span style="color:#c62828" id="tugB"><b id="tugBskor">0</b> Sen</span>`);
    const kutu=el("div",""); kutu.style.cssText="position:relative;width:min(92vw,880px);height:70px";
    const halat=el("div",""); halat.id="halat";
    const marka=el("div","","🎯"); marka.id="tugMarka"; marka.style.left="46.5%";
    kutu.append(halat,marka);
    alan.append(kutu,bar);
    const qAlani=el("div","");
    qAlani.style.cssText="display:flex;flex-direction:column;align-items:center;gap:12px";
    alan.append(qAlani);
    function pozisyonla(){
      const fark=skor.b-skor.a; /* oyuncu avantajına göre sağa çeker */
      const sol=Math.max(8,Math.min(92,48+fark*9));
      marka.style.left=sol+"%";
    }
    function skoruGuncelle(){
      document.getElementById("tugAskor").textContent=skor.a;
      document.getElementById("tugBskor").textContent=skor.b;
    }
    function kazanca(kime){
      if(skor[kime]>=5){
        tebrik(kimEtiket(kime)+" halatı çekti!","Skor "+skor.a+" - "+skor.b,"Yeniden Oyna",()=>oyunEkrani("halatCekme"));
        return true;
      }
      return false;
    }
    function soru(kime){
      qAlani.innerHTML="";
      const dogru=uret(izinliKelimeler(g));
      const diger=farkli(kelimeHavuzu(durum.grup).filter(w=>w!==dogru),1);
      qAlani.append(el("div","",`<div style="font-size:26px;font-weight:bold">${kimEtiket(kime)}, sıra sende! Kelimeyi bul:</div>`));
      const s=el("div","secenekler");
      const butonlar=karistir([dogru].concat(diger)).map(w=>{
        const b=el("button","sec",w);
        s.append(b);
        return b;
      });
      qAlani.append(s);
      konus(dogru);
      if(kime==="a" && mod==="bilgisayar"){
        butonlar.forEach(b=>b.disabled=true);
        const mesaj=el("div","bilgiCip","🤖 Bilgisayar düşünüyorum...");
        qAlani.append(mesaj);
        setTimeout(()=>{
          if(Math.random()<0.62){
            skor.a++; skoruGuncelle(); pozisyonla(); SES.dogru();
            if(kazanca("a")) return;
            qAlani.innerHTML="";
            qAlani.append(el("div","","<div style='font-size:30px;margin:20px'>🤖 Bildi! Halat sıradan çekildi.</div>"));
            
          }else{
            SES.yanlis();
            qAlani.innerHTML="";
            qAlani.append(el("div","","<div style='font-size:30px;margin:20px'>🤖 Bilemedi! Sıra sana döndü.</div>"));
            
          }
          setTimeout(()=>{ if(!kazanca("a")) soru("b"); },1200);
        },1500);
        return;
      }
      butonlar.forEach(b=>{
        b.addEventListener("click",()=>{
          if(b.textContent===dogru){
            b.classList.add("dogru"); SES.dogru();
            skor[kime]++; if(kime==="b") puanArt(2);
            skoruGuncelle(); pozisyonla();
            const sonraki=kime==="a"?"b":"a";
            setTimeout(()=>{ if(!kazanca(kime)) soru(sonraki); },700);
          }else{
            b.classList.add("yanlis"); SES.yanlis();
            setTimeout(()=>b.classList.remove("yanlis"),500);
          }
        });
      });
    }
    pozisyonla();
    soru("b");
  }
  alan.append(el("div","","<h2 style='font-size:30px'>Kiminle oynuyorsun?</h2>"));
  const mods=el("div","secenekler");
  [["🧒 Arkadaşınla","buddy"],["🤖 Bilgisayarla","bilgisayar"]].forEach(m=>{
    const b=el("button","sec",m[0]);
    b.addEventListener("click",()=>{ SES.tus(); mod=m[1]; yukle(); });
    mods.append(b);
  });
  alan.append(mods);
  
}

/* ======== 10. TAVŞAN YARIŞI ======== */
function oTavsanYarisi(alan,g){
  let tur=0; const TOPLAM=10;
  let tpos=4,rpos=4;
  const pist=el("div",""); pist.id="racePist";
  pist.innerHTML=`<div id="raceTurtle" style="left:4%">🐢</div><div id="raceTavsan" style="left:4%">🐰</div>`;
  alan.append(pist, el("div","",`<span style="font-size:24px">${TOPLAM} soru! Doğru cevap → tavşan atlar 🔥🐰</span>`));
  const q=el("div","secenekler");
  q.style.cssText="display:flex";
  alan.append(q);
  const tY=document.createElement("div"), rY=document.createElement("div");
  function konumla(){
    pist.querySelector("#raceTavsan").style.left=rpos+"%";
    pist.querySelector("#raceTurtle").style.left=tpos+"%";
  }
  function bitir(){
    if(rpos>=tpos){ puanArt(10); tebrik("Tavşan kazandı! 🐰","Kaplumbağayı geçtin! +10 bonus puan.","Tekrar",()=>oyunEkrani("tavsanYarisi")); }
    else tebrik("Kaplumbağa kazandı 🐢","Bir tur daha, bu sefer kazanalım!","Tekrar",()=>oyunEkrani("tavsanYarisi"));
  }
  function soru(){
    q.innerHTML="";
    if(tur>=TOPLAM){ bitir(); return; }
    const hav=izinliKelimeler(g);
    const dogru=uret(hav);
    const diger=farkli(hav.filter(w=>w!==dogru),2);
    karistir([dogru].concat(diger)).forEach(w=>{
      q.append(secenek(w,w===dogru,()=>{
        rpos=Math.min(90,rpos+9); konumla();
        tpos=Math.min(90,tpos+6); tur++; konumla();
        soru();
      }));
    });
    const tekrar=el("div","bilgiCip","🔊 Tekrar dinle");
    tekrar.addEventListener("click",()=>konus(dogru));
    alan.querySelectorAll(".bilgiCip").forEach(x=>{ if(x!==alan.querySelector(".bilgiCip")) x.remove(); });
    alan.append(tekrar);
    konus(dogru);
    konumla();
  }
  soru();
}

/* ======== 11. YAZ OYNAT ======== */
function oYazOynat(alan,g){
  const cvw=el("div","");
  cvw.style.cssText="width:min(92vw,880px)";
  const cv=document.createElement("canvas");
  cv.width=840; cv.height=440;
  cv.style.cssText="width:100%;display:block;border-radius:20px;border:10px solid #b0bec5;box-shadow:var(--gölge);background:#fff;touch-action:none";
  cvw.append(cv);
  const cx=cv.getContext("2d");
  cx.fillStyle="#fff"; cx.fillRect(0,0,cv.width,cv.height);
  const kayitlar=[];
  let cizm=false, son=null, renk="#000000";
  function pos(e){
    const r=cv.getBoundingClientRect();
    return {x:(e.clientX-r.left)*cv.width/r.width, y:(e.clientY-r.top)*cv.height/r.height};
  }
  cv.addEventListener("pointerdown",e=>{ cizm=true; son=pos(e); try{cv.setPointerCapture(e.pointerId);}catch(x){} });
  cv.addEventListener("pointermove",e=>{
    if(!cizm) return;
    const p=pos(e);
    cx.strokeStyle=renk; cx.lineWidth=8; cx.lineCap="round";
    cx.beginPath(); cx.moveTo(son.x,son.y); cx.lineTo(p.x,p.y); cx.stroke();
    son=p;
  });
  ["pointerup","pointercancel","pointerleave"].forEach(ev=>cv.addEventListener(ev,()=>cizm=false));
  const arac=el("div","kumaraclar");
  ["#000000","#e53935","#1565c0","#2e7d32","#fdd835","#8d6e63"].forEach(r=>{
    const d=el("div","renkDaire"); d.style.background=r;
    d.addEventListener("click",()=>{ renk=r; SES.tus(); });
    arac.append(d);
  });
  const temiz=el("button","uic","🧹"); temiz.addEventListener("click",()=>{ cx.fillStyle="#fff"; cx.fillRect(0,0,cv.width,cv.height); SES.tus(); });
  const kayd=el("button","uic","💾 <small>Kaydet</small>"); kayd.style.fontSize="20px";
  kayd.addEventListener("click",()=>{
    kayitlar.push(cv.toDataURL());
    SES.dogru();
    listeYenile();
  });
  arac.append(temiz,kayd);
  const liste=el("div","");
  liste.style.cssText="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:700px";
  function listeYenile(){
    liste.innerHTML="";
    kayitlar.forEach(u=>{
      const img=document.createElement("img");
      img.src=u; img.style.cssText="width:120px;border-radius:10px;border:3px solid #90a4ae;cursor:pointer";
      img.title="Animasyon yeniden oynasın!";
      img.onclick=()=>animasyon(u);
      liste.append(img);
    });
  }
  let animTimer=null;
  function animasyon(u){
    SES.dogru();
    if(animTimer) clearInterval(animTimer);
    const img=new Image();
    img.onload=()=>{
      let y=0;
      animTimer=setInterval(()=>{
        y+=16;
        cx.fillStyle="#fff"; cx.fillRect(0,0,cv.width,cv.height);
        const yy=Math.min(y,cv.height);
        cx.drawImage(img,0,0,cv.width,yy,0,0,cv.width,yy);
        if(y>cv.height){ clearInterval(animTimer); animTimer=null; }
      },36);
    };
    img.onerror=()=>SES.yanlis();
    img.src=u;
  }
  alan.append(cvw,arac,liste);
  
}

/* ======== YÖNETİCİ PANELİ ======== */
function yoneticiEkran(){
  zamanlukTemizle();
  durum.akt=null;
  document.getElementById("baslik").textContent="Yönetici";
  main.className="";
  main.innerHTML="";
  konusDur();

  const kutu=el("div","yonet");
  /* üst kısım: başlık + kilit paneli (render tekrar kullanır) */
  const ustKisim=el("div","");
  ustKisim.append(el("div","","<h2 style='margin:4px 0'>⚙️ İçerik Yönetimi</h2>"));
  /* sınıfın yeri — grup kilidi */
  const kilitKutu=el("div","yonetKart");
  kilitKutu.append(el("div","","<b>📍 Sınıfın yeri (grup kilidi)</b><br><small style='color:#666'>Seçili gruptan sonrakiler ana ekranda kilitlenir — öğrenci sonraki gruba geçemez.</small>"));
  const kilitBant=el("div","grpBant");
  function kilitIsaret(){
    [...kilitBant.children].forEach((c,i)=>c.classList.toggle("secili", kayit.kilit===i));
  }
  GRUPLAR.forEach((gg,i)=>{
    const b=el("button","",gg.tum?"🌐 "+gg.ad:gg.ad);
    b.style.background=gg.renk;
    b.addEventListener("click",()=>{ SES.tus(); kayit.kilit=i; kayitYaz(); kilitIsaret(); });
    kilitBant.append(b);
  });
  const kilitKaldir=el("button","uic","🔓 <small>Kilidi kaldır</small>");
  kilitKaldir.style.fontSize="20px";
  kilitKaldir.addEventListener("click",()=>{ SES.tus(); kayit.kilit=null; kayitYaz(); kilitIsaret(); });
  const skorSifir=el("button","uic","🧹 <small>Skor tablosunu sıfırla</small>");
  skorSifir.style.fontSize="20px";
  skorSifir.addEventListener("click",()=>{ SES.tus(); kayit.skorlar=[]; kayitYaz(); });
  kilitKutu.append(kilitBant,kilitKaldir,skorSifir);
  ustKisim.append(kilitKutu);

  /* çarkıfelek: öğrenci listesi */
  const ogrKutu=el("div","yonetKart");
  ogrKutu.append(el("div","","<b>🎡 Kim Tahtaya Gelecek? (Çarkıfelek)</b><br><small style='color:#666'>Her satıra bir öğrenci adı yaz. Ana ekrandaki \"🎡 Kim Gelecek?\" etkinliği çarkı döndürür, kimin tahtaya çıkacağını çark seçer.</small>"));
  const tOgr=document.createElement("textarea");
  tOgr.value=(kayit.ogrListe||[]).join("\n");
  tOgr.rows=Math.min(9,Math.max(3,((kayit.ogrListe||[]).length||3)+1));
  tOgr.placeholder="Deniz\nEla\nKerem\n…";
  const ogrDurum=el("div","","<small style='opacity:.6'>"+(kayit.ogrListe||[]).length+" kişi yüklü</small>");
  const ogrKaydet=el("button","uic","💾 <small>Listeyi kaydet</small>");
  ogrKaydet.style.fontSize="20px";
  ogrKaydet.addEventListener("click",()=>{
    const adlar=[...new Set(tOgr.value.split("\n").map(x=>x.trim()).filter(Boolean))];
    kayit.ogrListe=adlar;
    kayitYaz();
    ogrDurum.innerHTML="<small style='opacity:.6'>"+adlar.length+" kişi yüklü</small>";
    SES.dogru();
  });
  const ogrTemiz=el("button","uic","🧹 <small>Listeyi temizle</small>");
  ogrTemiz.style.fontSize="20px";
  ogrTemiz.addEventListener("click",()=>{
    tOgr.value="";
    kayit.ogrListe=[]; kayitYaz();
    ogrDurum.innerHTML="<small style='opacity:.6'>0 kişi yüklü</small>";
    SES.tus(); ;
  });
  const ozeneBtn=el("button","uic","");
  ozeneBtn.style.fontSize="20px";
  function ozeneIsaret(){
    ozeneBtn.innerHTML=(kayit.ozene?"✅":"➕")+" <small>Aynı kişi üst üste gelmesin: "+(kayit.ozene?"açık":"kapalı")+"</small>";
  }
  ozeneBtn.addEventListener("click",()=>{ SES.tus(); kayit.ozene=!kayit.ozene; kayitYaz(); ozeneIsaret(); ; });
  ozeneIsaret();
  const ogrDugmeler=el("div","secenekler");
  ogrDugmeler.append(ogrKaydet,ogrTemiz,ozeneBtn);
  ogrKutu.append(tOgr,ogrDurum,ogrDugmeler);
  ustKisim.append(ogrKutu);

  /* ses tezgâhı: hangi Türkçe ses aktif? */
  const sesKutu=el("div","yonetKart");
  sesKutu.append(el("div","","<b>🎙️ Ses Tezgâhı</b><br><small style='color:#666'>Oyunlardaki konuşma bu sesle yapılır. Eski kaliteli ses sürüyorsa daha net ses için öneri: uygulamayı <b>Edge</b> tarayıcısında, internete bağlı açın (doğal ses otomatik seçilir).</small>"));
  const sesDurum=el("div","","");
  sesDurum.style.cssText="font-size:18px;margin-top:6px";
  function sesIsaret(){
    const v=(typeof turkSes==="function")?turkSes():null;
    if(!v){ sesDurum.innerHTML="<span style='color:#b71c1c'>⚠️ Türkçe ses bulunamadı!</span>"; return; }
    const ad=(v.name||"").toLowerCase();
    let rozet;
    if(ad.indexOf("natural")>=0) rozet="<span style='color:#2e7d32'>🟢 çok net (doğal üslup)</span>";
    else if(ad.indexOf("google")>=0) rozet="<span style='color:#2e7d32'>🟢 net (Google sesi)</span>";
    else if(ad.indexOf("online")>=0) rozet="<span style='color:#2e7d32'>🟢 net (çevrimiçi)</span>";
    else rozet="<span style='color:#b26a00'>⚠️ eski kalite ses — Edge tarayıcıda/internete açınca daha net ses seçilir</span>";
    sesDurum.innerHTML="Aktif ses: <b>"+v.name+"</b><br><small>"+rozet+"</small>";
  }
  sesIsaret();
  try{ if(window.speechSynthesis && speechSynthesis.addEventListener) speechSynthesis.addEventListener("voiceschanged", sesIsaret); }catch(e){}
  const sesDeneme=el("button","uic","🔊 <small>Sesi duy</small>");
  sesDeneme.style.fontSize="20px";
  sesDeneme.addEventListener("click",()=>{ SES.tus(); konus("Merhaba! Kelimeleri böyle duyacaksın.", null, {hiz:0.45, ara:1200, tekrarHiz:0.7}); });
  const sesYenile=el("button","uic","♻️ <small>Sesleri yeniden tara</small>");
  sesYenile.style.fontSize="20px";
  sesYenile.addEventListener("click",()=>{ SES.tus(); sesListesiYenile(); sesIsaret(); });
  const sesDugmeler=el("div","secenekler");
  sesDugmeler.append(sesDeneme,sesYenile);
  sesKutu.append(sesDurum,sesDugmeler);
  ustKisim.append(sesKutu);
  ustKisim.append(fonemStudyoKart());

  ustKisim.append(el("div","","<p style='font-size:16px;opacity:.8;margin:4px 0'>Kelimeleri ve cümleleri düzenle; heceler kelimelerden otomatik hesaplanır. "+
    "Aşama kapsaması: seçili harfe kadar (o gruptaki ve önceki gruplardaki) harflerle yazılabilen kelimeler oyunlarda çıkar.</p>"));

  /* grup seçim bandı */
  const bant=el("div","grpBant");
  let gi=durum.grup;
  function grupButonlari(){
    bant.innerHTML="";
    GRUPLAR.forEach((gg,i)=>{
      const b=el("button","",gg.tum?"🌐 "+gg.ad:gg.ad);
      b.style.background=gg.renk;
      if(i===gi) b.classList.add("secili");
      b.addEventListener("click",()=>{ SES.tus(); gi=i; render(); });
      bant.append(b);
    });
  }

  function render(){
    kutu.innerHTML="";
    kutu.append(ustKisim);
    grupButonlari();
    kilitIsaret();
    kutu.append(bant);
    const g=GRUPLAR[gi];

    const form=el("div","yonetKart");
    form.append(el("div","","<h3 style='margin:6px 0'>"+(g.tum?"🌐 ":"")+g.ad+" &nbsp;<small style='color:#666;font-size:15px'>(değişiklik bu tarayıcıda saklanır)</small></h3>"));

    const lbl1=el("div","","<b>Kelimeler</b> <small>(her satıra bir kelime)</small>");
    const t1=document.createElement("textarea");
    t1.value=g.kelimeler.join("\n");
    t1.rows=Math.min(10,Math.max(4,g.kelimeler.length+1));
    const lbl2=el("div","","<b>Cümleler</b> <small>(her satıra bir cümle — Metin Oku etkinliği)</small>");
    const t2=document.createElement("textarea");
    t2.value=g.cumleler.join("\n");
    t2.rows=Math.min(8,Math.max(3,g.cumleler.length+1));
    form.append(lbl1,t1,lbl2,t2);

    /* Cümle/yazı yardımcısı: her cümle hangi aşamadan itibaren çıkabilir? */
    const cumleler=g.cumleler;
    if(cumleler.length){
      const cumleKarti=el("div","");
      cumleKarti.append(el("div","","<h3 style='margin:10px 0 4px'>📝 Cümleler hangi aşamada çıkar?</h3>"));
      cumleler.forEach(c=>{
        const temiz=c.replace(/[ .,!?]/g,"").toLowerCase();
        let asama=null;
        for(let hi=0;hi<g.harfler.length;hi++){
          if(harfUyar(izinliHarfler(g,hi),temiz)){ asama=hi; break; }
        }
        const sat=el("div","");
        if(asama===null){
          sat.innerHTML=`✗ <span style="opacity:.75">${c}</span> — <b>sonraki grupların harfleri gerekiyor</b>`;
          sat.style.color="#b71c1c";
        }else{
          const h=g.harfler[asama];
          sat.innerHTML=`✓ <span>${c}</span> — aşama <b style="color:${g.renk}">${buyukHarf(h)}</b>'ten itibaren`;
        }
        sat.style.cssText="font-size:18px;border-bottom:2px dotted #eceff1;padding:4px 0";
        cumleKarti.append(sat);
      });
      form.append(cumleKarti);
    }

    /* aşama kapsaması */
    form.append(el("div","","<h3 style='margin:10px 0 4px'>Harf aşamalarına göre kapsama</h3>"));
    const ozet=kapsamaOzeti(g);
    const tablo=el("div","kapsamTablo");
    ozet.forEach(o=>{
      const satir=el("div","kapsamSatir");
      const harfYaz=o.harf==="i"?"İ":o.harf.toUpperCase();
      satir.innerHTML=`<span class="kHarf" style="border-color:${g.renk}">${harfYaz}</span>`+
        `<span class="kSet">${o.harfler}</span>`+
        `<span class="kAdet">${o.adet} kelime · ${o.heceAdet} hece</span>`+
        `<span class="kListe">${o.adet? o.kelimeler : "—"}</span>`;
      tablo.append(satir);
    });
    form.append(tablo);

    /* düğmeler */
    const dugmeler=el("div","kumaraclar");
    const kaydet=el("button","uic","💾 <small>Kaydet</small>");
    kaydet.style.fontSize="20px";
    kaydet.addEventListener("click",()=>{
      const kel=[...new Set(t1.value.split("\n").map(x=>x.trim().toLowerCase()).filter(Boolean))];
      const cu =[...new Set(t2.value.split("\n").map(x=>x.trim()).filter(Boolean))];
      if(kel.length===0 && cu.length===0){
        delete kayit.icerik[g.id];
      }else{
        kayit.icerik[g.id]=(kayit.icerik[g.id]||{});
        kayit.icerik[g.id].kelimeler=kel;
        kayit.icerik[g.id].cumleler=cu;
      }
      kayitYaz(); icerikUygula();
      SES.dogru();
      render();
    });
    const sifirla=el("button","uic","♻️ <small>Bu grubu sıfırla</small>");
    sifirla.style.fontSize="20px";
    sifirla.addEventListener("click",()=>{
      delete kayit.icerik[g.id];
      kayitYaz(); icerikUygula();
      SES.tus(); render();
    });
    const indir=el("button","uic","⬇️ <small>İndir (yedek)</small>");
    indir.style.fontSize="20px";
    indir.addEventListener("click",()=>{
      const veri=JSON.stringify({icerik:kayit.icerik, secim:kayit.secim, kilit:kayit.kilit, skorlar:kayit.skorlar, ogrListe:kayit.ogrListe, ozene:kayit.ozene},null,2);
      const a=document.createElement("a");
      a.href=URL.createObjectURL(new Blob([veri],{type:"application/json"}));
      a.download="okuyorum-icerik.json";
      a.click();
      SES.tus();
    });
    const yukleGirdi=document.createElement("input");
    yukleGirdi.type="file"; yukleGirdi.accept=".json,application/json";
    yukleGirdi.style.cssText="display:none";
    yukleGirdi.addEventListener("change",()=>{
      const f=yukleGirdi.files[0]; if(!f) return;
      const fr=new FileReader();
      fr.onload=()=>{
        try{
          const o=JSON.parse(fr.result);
          if(o && typeof o==="object"){
            kayit.icerik=(o.icerik && typeof o.icerik==="object")? o.icerik : {};
            kayit.secim =(o.secim  && typeof o.secim==="object") ? o.secim  : {};
            kayit.kilit =(typeof o.kilit==="number" && o.kilit>=0 && o.kilit<GRUPLAR.length)? o.kilit : null;
            kayit.skorlar=(o.skorlar && Array.isArray(o.skorlar))? o.skorlar.filter(s=>s&&typeof s.puan==="number").slice(0,20) : [];
            kayit.ogrListe=(o.ogrListe && Array.isArray(o.ogrListe))? o.ogrListe.filter(x=>typeof x==="string" && x.trim()).map(x=>x.trim()).slice(0,60) : kayit.ogrListe;
            if(typeof o.ozene==="boolean") kayit.ozene=o.ozene;
            kayitYaz(); icerikUygula();
            SES.dogru();
            tOgr.value=(kayit.ogrListe||[]).join("\n");
            ogrDurum.innerHTML="<small style='opacity:.6'>"+(kayit.ogrListe||[]).length+" kişi yüklü</small>";
            ozeneIsaret();
            render();
          }
        }catch(e){ SES.yanlis(); }
      };
      fr.readAsText(f);
    });
    const yukle=el("button","uic","⬆️ <small>Yükle</small>");
    yukle.style.fontSize="20px";
    yukle.addEventListener("click",()=>{ SES.tus(); yukleGirdi.click(); });
    const kapat=el("button","uic","🏠 <small>Ana ekrana dön</small>");
    kapat.style.fontSize="20px";
    kapat.addEventListener("click",()=>anaEkran());
    dugmeler.append(kaydet,sifirla,indir,yukle,kapat);
    form.append(dugmeler,yukleGirdi);
    kutu.append(form);
    main.append(kutu);
  }
  render();
  
}

/* ---------- başlat ---------- */
puanGoster();
anaEkran();

/* ======== 16. KELİME KASASI — özgün uygulama ======== */
function oKelimeKasasi(alan,g){
  let tur=0; const TOPLAM=4;
  function soru(){
    alan.innerHTML="";
    if(tur>=TOPLAM){
      tebrik("Tüm kasalar açıldı!",TOPLAM+" şifreyi çözdün, +5 bonus puan!","Tekrar",()=>{tur=0;soru();});
      return;
    }
    const hav=izinliKelimeler(g);
    const uzun=hav.filter(w=>w.length>=3);
    const kelime=uret(uzun.length?uzun:hav);
    const harfler=kelime.split("");
    /* kasa gövdesi */
    const kasa=el("div","kasaGovde");
    const emojisizBaslik=el("div","","<div style='font-size:44px;line-height:1'>🔐</div>");
    /* şifre lambaları */
    const lambaSirasi=el("div","kasaLambalar");
    const lambalar=harfler.map(()=>{const l=el("div","kasaLamba",""); lambaSirasi.append(l); return l;});
    /* slotlar */
    const slotSirasi=el("div","kasaSlotlar");
    const slotlar=harfler.map(()=>{
      const s=el("div","kasaSlot","?"); slotSirasi.append(s); return s;
    });
    kasa.append(emojisizBaslik,lambaSirasi,slotSirasi);
    alan.append(kasa);
    /* harf düğmeleri: kelime harfleri + aşama çeldiricileri */
    let dolu=0, alarmlar=0, bitti=false;
    const celdiriciler=farkli(izinliHarfler(g).filter(h=>!harfler.includes(h)),Math.min(2,Math.max(0,izinliHarfler(g).length-harfler.length)));
    const dugmeler=karistir(harfler.concat(celdiriciler).map(h=>h)).map(h=>{
      const b=el("button","sec",h);
      b.addEventListener("click",()=>{
        if(bitti||b.disabled) return;
        if(h===harfler[dolu]){
          const s=slotlar[dolu];
          s.textContent=h;
          s.classList.add("dolu");
          lambalar[dolu].classList.add("acik");
          SES.pop(); dolu++;
          b.disabled=true; b.style.opacity=".25";
        if(dolu===harfler.length){
          bitti=true;
          SES.dogru(); puanArt(5); pistYenile(); konfeti("💎");
          kasa.classList.add("acik");
          konus(kelime);
          setTimeout(()=>{ tur++; soru(); },2200);
        }
        }else{
          alarmlar++;
          SES.yanlis();
          kasa.classList.remove("alarm"); void kasa.offsetWidth; kasa.classList.add("alarm");
          
          if(alarmlar>=3){
            konus(kelime);
          }
        }
      });
      return b;
    });
    const s=el("div","secenekler");
    dugmeler.forEach(b=>s.append(b));
    alan.append(s);
    const tekrar=el("div","bilgiCip","🔊 Şifreyi tekrar dinle");
    tekrar.addEventListener("click",()=>{ SES.tus(); konus(kelime); });
    alan.append(tekrar);
    konus(kelime);
  }
  soru();
}

/* ======== 17. ÇARKIFELEK ÖĞRENCİ SEÇ — üst bar düğmesi, açılır, otomatik döner, kapanır ======== */
function carkiAc(){
  if(document.getElementById("carkOrtu")) return;
  const liste=(kayit.ogrListe && Array.isArray(kayit.ogrListe))? kayit.ogrListe.filter(Boolean) : [];
  let gridem=null, otomatik=null, bittiMi=false, carDeg=0;
  const ortu=document.createElement("div");
  ortu.id="carkOrtu";
  const kutu=el("div","carkKutu","");
  kutu.innerHTML="<div class='carkKutuBaslig'>🎡 Kim tahtaya gelecek?</div>";
  document.body.append(ortu);
  ortu.append(kutu);

  if(liste.length===0){
    kutu.append(el("div","","<div style='font-size:22px;padding:14px'>Sınıf listesi boş!<br><small style='opacity:.7'>Öğretmen, ⚙️ Ayarlar'dan isim listesini yükler.</small></div>"));
    requestAnimationFrame(()=>ortu.classList.add("acik"));
    setTimeout(()=>ortuKapa(),2600);
    
    return;
  }

  const PAL=["#ef5350","#ff9800","#ffd54f","#66bb6a","#26a69a","#42a5f5","#7e57c2","#ec407a"];
  const n=liste.length, seg=360/n;
  const sar=el("div","carkSar","");
  const cark=el("div","cark","");
  if(liste.length===1){
    cark.style.background=PAL[0];
    cark.style.transition="none";
  }else{
    const stops=[];
    for(let i=0;i<n;i++) stops.push(PAL[i%PAL.length]+" "+(i*seg)+"deg "+(((i+1)*seg)+"deg"));
    cark.style.background="conic-gradient("+stops.join(",")+")";
  }
  const fs=(n<=8)?22:(n<=14)?17:(n<=24)?13:10;
  for(let i=0;i<n;i++){
    const lab=el("div","carkEtiket",liste[i]);
    lab.style.fontSize=fs+"px";
    lab.style.transform="translate(-50%,-50%) rotate("+(i*seg+seg/2)+"deg) translateY(-118px)";
    cark.append(lab);
  }
  cark.append(el("div","carkGovdeMerkez",""));
  sar.append(cark, el("div","carkIgne",""));
  kutu.append(sar);

  const sonuc=el("div","carkSonuc","<small style='opacity:.6;font-size:16px'>Çark dönüyor…</small>");
  kutu.append(sonuc);

  function dondur(){
    let hav=liste.slice();
    if(kayit.ozene && gridem && hav.length>1) hav=hav.filter(x=>x!==gridem);
    const hIdx=liste.indexOf(hav[Math.floor(Math.random()*hav.length)]);
    const hedefMod=((360-(hIdx*seg+seg/2))%360+360)%360;
    const mevcutMod=((carDeg%360)+360)%360;
    const fark=((hedefMod-mevcutMod)%360+360)%360;
    carDeg += 5*360+fark;
    cark.style.transition="transform 3.6s cubic-bezier(.16,.72,.22,1)";
    cark.style.transform="rotate("+carDeg+"deg)";
    for(let t=1;t<=20;t++){
      const sure=3550*Math.pow(t/20.6,1.55);
      setTimeout(()=>{
        if(bittiMi) return;
        SES.tus();
      }, sure);
    }
    setTimeout(()=>{
      bittiMi=true;
      const kazanan=liste[hIdx];
      gridem=kazanan;
      sonuc.innerHTML="";
      sonuc.append(el("div","carkSonBuyuk","🎉 "+kazanan));
      sonuc.append(el("div","","<div style='font-size:21px;color:#00695c'><b>"+kazanan+"</b> tahtaya geliyor!</div>"));
      konfeti("🎉"); SES.dogru();
      
      /* kendi kendine kapanır */
      otomatik=setTimeout(()=>ortuKapa(),4200);
    }, 3700);
  }
  const merkez=el("button","carkGovde","⟳<br><b>Çevir</b>");
  merkez.addEventListener("click",()=>{
    if(!bittiMi) return;
    clearTimeout(otomatik);
    bittiMi=false;
    SES.tus();
    cark.style.transition="transform .35s ease-out";
    cark.style.transform="rotate("+(carDeg%720)+"deg)";
    carDeg=carDeg%720;
    setTimeout(dondur,380);
  });
  const kapa=el("button","","✕");
  kapa.style.cssText="position:absolute;top:10px;right:12px;border:none;background:none;font-size:26px;cursor:pointer;opacity:.55";
  kapa.addEventListener("click",ortuKapa);
  kutu.append(merkez,kapa);
  function ortuKapa(){
    if(!ortu.parentNode) return;
    clearTimeout(otomatik);
    ortu.classList.remove("acik");
    setTimeout(()=>{ ortu.remove(); },500);
  }

  /* kapalı pencerede rAF çalışmayabilir — setTimeout kullan */
  setTimeout(()=>{
    ortu.classList.add("acik");
    setTimeout(dondur,700);
  },60);
}

/* ======== 18. SESLI DIKTE — dinle, deftere yaz, kontrol et ======== */
function oSesliDikte(alan,g){
  let tur=0;
  const TOPLAM=5;
  function soru(){
    alan.innerHTML="";
    if(tur>=TOPLAM){
      tebrik("Dikte defteri bitti!",TOPLAM+" kelime yazdın, +5 bonus puan!","Tekrar",()=>{tur=0;soru();});
      return;
    }
    const hav=izinliKelimeler(g);
    const kelime=uret(hav);
    const harfler=[...kelime];
    const klavyeHarfleri=izinliHarfler(g);
    let yaz=[], hataSay=0;
    const donme=el("div","","<small style='opacity:.6;font-size:16px'>"+(tur+1)+" / "+TOPLAM+" kelime</small>");
  donme.style.cssText="text-align:center";
    const baslik=el("div","","<div style='font-size:40px;line-height:1'>✏️</div><div style='font-size:19px;color:#37474f'>Dinle ve deftere yaz!</div>");
    baslik.style.cssText="text-align:center;margin-bottom:6px";
    alan.append(donme,baslik);

    /* defter + yazı satırı */
    const defter=el("div","dkDefter");
    const yazi=el("div","dkYazi");
    defter.append(yazi);
    alan.append(defter);

    function yaziCiz(){
      yazi.innerHTML="";
      for(let i=0;i<harfler.length;i++){
        const k=el("div","dkKutu"+(yaz[i]?" dolu":" bos"),yaz[i]||"");
        yazi.append(k);
      }
    }

    /* komut düğmeleri: kelime · hece · harf — üç dinleme yolu, her biri tek okuma */
    const komutlar=el("div","dkKomutlar");
    const bDinle=el("button","uic","🔊 <small>Kelimeyi dinle</small>");
    bDinle.style.fontSize="18px";
    bDinle.addEventListener("click",()=>{ konusDur(); konus(kelime, null, {hiz:0.45, tekrar:false}); });
    const bAgir=el("button","uic","🐢 <small>Harf harf dinle</small>");
    bAgir.style.fontSize="18px";
    bAgir.addEventListener("click",()=>{ konusDur(); konusParcalar(harfler); });
    const bIpucu=el("button","uic","💡 <small>Hece hece dinle</small>");
    bIpucu.style.fontSize="18px";
    bIpucu.addEventListener("click",()=>{
      heceler.innerHTML=hecele(kelime).map(h=>`<span class="dkHec">${h}</span>`).join("<span style='opacity:.35'> · </span>");
      konusDur();
      konusParcalar(hecele(kelime));
    });
    const bSil=el("button","uic","⌫ <small>Sil</small>");
    bSil.style.fontSize="18px";
    bSil.addEventListener("click",()=>{ SES.tus(); yaz.pop(); yaziCiz(); });
    const bYaz=el("button","uic","✓ <small>Yaz</small>");
    bYaz.style.cssText="font-size:18px;background:#fdd835;color:#5d4037";
    komutlar.append(bDinle,bAgir,bIpucu,bSil,bYaz);

    const heceler=el("div","","");
    heceler.style.cssText="text-align:center;min-height:36px;font-size:24px";
    alan.append(komutlar,heceler);

    /* klavye: aşamadaki harfler */
    const klavye=el("div","dkKlavye");
    function tusEkle(h){
      const b=el("button","dkTus",h);
      b.addEventListener("click",()=>{
        if(yaz.length>harfler.length) return;
        SES.tus();
        yaz.push(h);
        yaz=yaz.slice(0,harfler.length);
        yaziCiz();
      });
      klavye.append(b);
    }
    klavyeHarfleri.forEach(tusEkle);
    alan.append(klavye);

    bYaz.addEventListener("click",()=>{
      if(yaz.length<harfler.length){
        
        defter.classList.remove("sarsildi"); void defter.offsetWidth;
        defter.classList.add("sarsildi");
        setTimeout(()=>defter.classList.remove("sarsildi"),450);
        return;
      }
      if(yaz.join("")===kelime){
        SES.dogru(); puanArt(4); pistYenile(); konfeti("✨");
        yazi.querySelectorAll(".dkKutu").forEach(k=>k.classList.add("dogru"));
        konus(kelime, null, {hiz:0.45, tekrar:false});
        setTimeout(()=>{ tur++; soru(); },2300);
      }else{
        hataSay++;
        SES.yanlis();
        defter.classList.remove("sarsildi"); void defter.offsetWidth;
        defter.classList.add("sarsildi");
        
        if(hataSay>=2){
          heceler.innerHTML=hecele(kelime).map(h=>`<span class="dkHec">${h}</span>`).join("<span style='opacity:.35'> · </span>");
        }
      }
    });

    yaziCiz();
    konus(kelime, null, {hiz:0.45, tekrar:false});
  }
  soru();
}

/* ======== 17. HAFIZA KARTLARI (harf–kelime / hece–hece / kelime–resim) ======== */
function oHafiza(alan, g){
  const MODLAR=[
    ["🔤 Harf–Kelime", "harfKelime"],
    ["🧵 Hece–Hece",   "heceHece"],
    ["📖 Kelime–Resim", "kelimeResim"]
  ];
  let mod=null;
  let hzOyuncular=null;   /* [ad1, ad2] */

  /* --- lider tablosu (kayit.hafizaSkor: {ad, puan} — kümülatif eş sayısı) --- */
  function hafizaSkorKaydet(list){
    kayit.hafizaSkor = kayit.hafizaSkor || [];
    list.forEach(o=>{
      const es=kayit.hafizaSkor.find(s=>s.ad===o.ad);
      if(es) es.puan+=o.puan;
      else kayit.hafizaSkor.push({ad:o.ad, puan:o.puan});
    });
    kayit.hafizaSkor.sort((x,y)=>y.puan-x.puan);
    kayit.hafizaSkor=kayit.hafizaSkor.slice(0,10);
    kayitYaz();
  }
  function yenileLiderTablo(kap){
    const skor=(kayit.hafizaSkor||[]).slice(0,5);
    kap.innerHTML="";
    if(!skor.length){
      kap.innerHTML="<p style='opacity:.75;font-size:17px'>🏆 İlk şampiyon sizden gelecek!</p>";
      return;
    }
    kap.append(el("div","","<b>🏆 En çok eş bulanlar</b>"));
    skor.forEach((s,i)=>{
      const sat=el("div","");
      sat.innerHTML=`${i+1}. <b>${s.ad}</b> — ${s.puan} eş`;
      sat.style.cssText="font-size:20px;border-bottom:2px dotted #eceff1;padding:3px 0";
      kap.append(sat);
    });
  }

  function oyuncuSecici(){
    alan.innerHTML="";
    alan.append(el("div","","<h2 style='font-size:28px'>👥 Kim oynayacak?</h2>"));
    const liste=((kayit.ogrListe||[]).filter(Boolean).slice(0,60));
    const sec=[];   /* seçilen ad dizisi (en çok 2) */
    /* lider tablosu — seçimin üstünde */
    const lider=el("div","yonetKart");
    lider.style.cssText="max-width:520px;display:flex;flex-direction:column;gap:6px";
    yenileLiderTablo(lider);
    alan.append(lider);

    const baslaB=el("button","sec","▶ Başla!");

    if(liste.length>=2){
      /* İsimler daima öğrenci listesinden — yazma kutusu yok */
      alan.append(el("div","","<div style='font-size:20px;margin:6px 0;text-align:center'>İki oyuncu seç:</div>"));
      const cip=el("div","hzOyuncular");
      function cips(){
        cip.innerHTML="";
        liste.forEach(ad=>{
          const i=sec.indexOf(ad);
          const b=el("button","", ad+(i===0?" 1️⃣":(i===1?" 2️⃣":"")));
          b.className = i>=0 ? "secili" : "";
          b.style.minHeight="52px"; b.style.fontSize="20px";
          b.addEventListener("click",()=>{
            SES.tus();
            const j=sec.indexOf(ad);
            if(j>=0) sec.splice(j,1);
            else if(sec.length<2) sec.push(ad);
            else { duyur("İki oyunculuk — önce birini kaldır."); SES.yanlis(); return; }
            cips(); baslaDur();
          });
          cip.append(b);
        });
        const r=el("button","uic","🎲 <small>Rastgele seç</small>");
        r.style.fontSize="20px";
        r.addEventListener("click",()=>{
          SES.tus();
          const kar=karistir(liste.slice());
          sec.length=0; sec.push(kar[0], kar[1]);
          cips(); baslaDur();
          duyur("Rastgele seçim: "+sec[0]+" ve "+sec[1]);
        });
        cip.append(r);
      }
      /* ekrana gelince listeden otomatik rastgele ikili çekilir */
      const kar=karistir(liste.slice());
      sec.push(kar[0], kar[1]);
      alan.append(cip);
      cips();
      baslaB.addEventListener("click",()=>{
        if(sec.length!==2){ duyur("İki oyuncu seç."); SES.yanlis(); return; }
        SES.dogru();
        hzOyuncular=sec.slice();
        secici();
      });
      alan.append(baslaB);
      function baslaDur(){ baslaB.disabled = sec.length!==2; }
      baslaDur();
    }else{
      alan.append(el("div","bilgiCip","Öğrenci listesinde en az 2 kişi gerekli. Öğretmen ⚙️ Ayarlar'da listeyi yükler — isimler buraya kendiliğinden gelir."));
      baslaB.disabled=true;
      alan.append(baslaB);
    }
    alan.append(el("div","","<p style='font-size:18px;text-align:center;opacity:.8'>Sırayla kart çevirin — eş bulan kartları kapar ve <b>tekrar&nbsp;sıra</b> ona geçer. En çok eş bulan kazanır 🏆</p>"));
  }

  function emojiKelimeler(){
    const e=g.emoji||{};
    return izinliKelimeler(g).filter(w=>e[w]);
  }
  function havuz(m){
    return (m==="heceHece") ? izinliHeceHavuzu(g) : emojiKelimeler();
  }

  function secici(){
    alan.innerHTML="";
    alan.append(el("div","","<h2 style='font-size:28px'>Nasıl oynayalım?</h2>"));
    const s=el("div","secenekler");
    const kullanilabilir=MODLAR.filter(m=>havuz(m[1]).length>=4);
    kullanilabilir.forEach(m=>{
      const b=el("button","sec",m[0]);
      b.addEventListener("click",()=>{ SES.tus(); kayit.hafizaMod=m[1]; kayitYaz(); mod=m[1]; basla(); });
      s.append(b);
    });
    alan.append(s);
    if(kullanilabilir.length===0){
      alan.append(el("div","bilgiCip","Kart için yeterli içerik yok — bir harf daha ilerleyin."));
      return;
    }
    if(kullanilabilir.length<3){
      alan.append(el("div","bilgiCip","Bu aşamada yalnız bu türler var; hece/kelime kartları bir harf ilerleyince gelir."));
    }
    alan.append(el("div","","<p style='font-size:18px;text-align:center;opacity:.8'>🃏 12 kart kapalı gelir — 6 eşi bul.<br>Kart çevirirken sesini de duyarısın: eşiyle buluşturunca kartlar açık kalır!</p>"));
  }

  function ciftYap(){
    const ciftler=[];
    if(mod==="heceHece"){
      farkli(havuz(mod), 6).forEach(h=>ciftler.push({etiket:h, kart:[{tip:"hece", deger:h},{tip:"hece", deger:h}]}));
    }else{
      farkli(havuz(mod), 6).forEach(w=>{
        const e=(g.emoji||{})[w];
        if(mod==="harfKelime"){
          ciftler.push({etiket:w, kart:[
            {tip:"harf", deger:w.charAt(0)},
            {tip:"kelime", deger:w, emoji:e}
          ]});
        }else{
          ciftler.push({etiket:w, kart:[
            {tip:"kelime", deger:w},
            {tip:"resim", deger:e, kelime:w}
          ]});
        }
      });
    }
    return ciftler;
  }

  function yuzIcerik(k){
    if(k.tip==="harf")   return `<span style="font-size:64px">${k.deger}</span>`;
    if(k.tip==="hece")   return `<span style="font-size:38px">${k.deger}</span>`;
    if(k.tip==="kelime"){
      return k.emoji
        ? `<span style="font-size:46px">${k.emoji}</span><span style="font-size:24px">${k.deger}</span>`
        : `<span style="font-size:30px">${k.deger}</span>`;
    }
    return `<span style="font-size:56px">${k.deger}</span>`; /* resim */
  }
  function okunus(k){
    if(k.tip==="harf") SES.fonem(k.deger);
    else if(k.tip==="hece") SES.hece(k.deger);
    else SES.kelime(k.kelime||k.deger);
  }

  function basla(){
    const ciftler=ciftYap();
    if(ciftler.length<4){ secici(); return; }
    tahta(ciftler);
  }

  function tahta(ciftler){
    const oy=[{ad:hzOyuncular[0],puan:0},{ad:hzOyuncular[1],puan:0}];
    let sira=0;
    alan.innerHTML="";
    alan.append(bilgiCip(TALIMAT.hafiza));
    const puanSirasi=el("div","hzPuanlar");
    function puanlarYaz(){
      puanSirasi.innerHTML = oy.map((o,i)=>
        `<span class="${i===sira?"hzSira":""}">${i===sira?"▶️ ":""}<b>${o.ad}</b>: <b>${o.puan}</b> eş</span>`).join("");
    }
    puanlarYaz();
    alan.append(puanSirasi);
    const izgara=el("div","hzIzgara");
    let ilk=null, kilitli=false, eslesen=0;
    const kartlar=[];

    function bitis(){
      puanArt(5);
      const t=[...oy].sort((x,y)=>y.puan-x.puan);
      let baslik, alt;
      if(t[0].puan===t[1].puan){
        baslik="Berabere! 🤝";
        alt=t[0].ad+" ve "+t[1].ad+" — "+t[0].puan+" eş";
      }else{
        baslik=t[0].ad+" kazandı! 🏆";
        alt=t[0].puan+" — "+t[1].puan+" · "+t[1].ad;
      }
      hafizaSkorKaydet([t[0],t[1]].map(o=>({ad:o.ad,puan:o.puan})));
      hzTebrik(baslik, alt);
    }

    function hzTebrik(baslik, alt){
      konfeti(); SES.bitti();
      const t=el("div","tebrik");
      t.setAttribute("role","dialog");
      t.setAttribute("aria-modal","true");
      t.setAttribute("aria-label",baslik||"Maç bitti");
      t.append(el("div","buyuk","🏆"));
      t.append(el("div","","<h2 style=\"margin:4px\">"+baslik+"</h2><p style=\"font-size:24px;margin:4px\">"+alt+"</p>"));
      const bb=el("button","","Yeniden Oyna");
      bb.style.background="#00897b";
      bb.onclick=()=>{ t.remove(); basla(); };
      const bo=el("button","","👥 Oyuncuları değiştir");
      bo.style.background="#42a5f5";
      bo.onclick=()=>{ t.remove(); oyuncuSecici(); };
      const bd=el("button","","Etkinliklere Dön");
      bd.style.background="#90a4ae";
      bd.onclick=()=>{ t.remove(); gitGrup(durum.grup); };
      t.append(bb,bo,bd);
      document.body.appendChild(t);
      bb.focus();
      duyur((baslik||"Maç bitti")+" "+(alt||""));
    }

    ciftler.forEach((cifi, ci)=>{
      cifi.kart.forEach(icerik=>{
        const kble=el("button","hzKart");
        kble.setAttribute("aria-label","Kapalı kart");
        kble.innerHTML='<span class="hzIc"><span class="hzArka" aria-hidden="true">🃏</span><span class="hzYuz">'+yuzIcerik(icerik)+'</span></span>';
        const o={ element:kble, icerik, cift:ci, acik:false, eslesti:false };
        kble.__hz=o;   /* hata ayıklama için kart nesnesi görünür kalsın */
        kble.addEventListener("click",()=>tik(o, ciftler));
        kartlar.push(o);
      });
    });
    karistir(kartlar).forEach((o, sn)=>{
      izgara.append(o.element);
      if(!o.acik && !o.eslesti) o.element.setAttribute("aria-label",(sn+1)+". kapalı kart");
    });
    alan.append(izgara);

    /* yan tuşlar */
    const s=el("div","secenekler");
    const bYeni=el("button","uic","🔄 Yeniden karıştır");
    bYeni.addEventListener("click",()=>{ SES.tus(); basla(); });
    const bTur=el("button","uic","🔁 Tür değiştir");
    bTur.addEventListener("click",()=>{ SES.tus(); secici(); });
    s.append(bYeni,bTur);
    alan.append(s);

    function ac(o){
      o.acik=true;
      o.element.classList.add("acik");
      o.element.setAttribute("aria-label", o.icerik.tip==="harf" ? ("harf "+o.icerik.deger) : o.icerik.tip==="hece" ? ("hece "+o.icerik.deger) : o.icerik.kelime||o.icerik.deger);
    }
    function kapa(o){
      o.acik=false;
      o.element.classList.remove("acik");
      o.element.setAttribute("aria-label","Kapalı kart");
    }
    function tik(o, ciftFig){
      if(kilitli) return;
      /* açık veya eşleşmiş karta dokunmak içeriği yeniden okur (dinleme hakkı) */
      if(o.eslesti || o.acik){ okunus(o.icerik); return; }
      SES.pop();
      ac(o); okunus(o.icerik);
      if(!ilk){ ilk=o; return; }
      const a=ilk; ilk=null;
      if(a.cift===o.cift){
        a.eslesti=o.eslesti=true;
        a.element.classList.add("hzEsles"); o.element.classList.add("hzEsles");
        SES.dogru(); puanArt(2);
        const cio=oy[sira]; cio.puan++;
        duyur(cio.ad+" bir eş buldu: "+(a.icerik.kelime||a.icerik.deger));
        eslesen++; puanlarYaz();
        if(eslesen===ciftler.length){
          bitis();
        }
      }else{
        kilitli=true; SES.yanlis();
        setTimeout(()=>{
          kapa(a); kapa(o); kilitli=false;
          sira=1-sira; puanlarYaz();
          duyur("Sıra: "+oy[sira].ad);
        },950);
      }
    }
  }

  oyuncuSecici();
}

/* ======== 19. ROKET YARIŞI (3 kişi · duyduğun kelimeyi bul) ======== */
function oRoketYarisi(alan, g){
  const HEDEF=4;         /* ilk 4 doğruya ulaşan kazanır */
  const SORU_LIMIT=9;    /* kimsenin hedefe ulaşmadıysa toplam soru */
  /* --- skor tablosu --- */
  function roketSkorKaydet(list){
    kayit.roketSkor=kayit.roketSkor||[];
    list.forEach(o=>{
      const es=kayit.roketSkor.find(s=>s.ad===o.ad);
      if(es) es.puan+=o.puan;
      else kayit.roketSkor.push({ad:o.ad, puan:o.puan});
    });
    kayit.roketSkor.sort((x,y)=>y.puan-x.puan);
    kayit.roketSkor=kayit.roketSkor.slice(0,10);
    kayitYaz();
  }

  /* --- oyuncu seçici (isimler öğrenci listesinden — yazma kutusu yok) --- */
  function oyuncuSecici(){
    alan.innerHTML="";
    const lider=el("div","yonetKart");
    lider.style.cssText="max-width:520px;display:flex;flex-direction:column;gap:6px";
    const skor=(kayit.roketSkor||[]).slice(0,5);
    lider.append(el("div","","<b>🚀 Roket şampiyonları</b>"));
    if(!skor.length) lider.append(el("div","","<p style='opacity:.75;font-size:17px'>İlk şampiyon sizden gelecek!</p>"));
    skor.forEach((s,i)=>{
      const sat=el("div","");
      sat.innerHTML=(i+1)+". <b>"+s.ad+"</b> — "+s.puan+" doğru";
      sat.style.cssText="font-size:20px;border-bottom:2px dotted #eceff1;padding:3px 0";
      lider.append(sat);
    });
    alan.append(lider);
    const liste=(kayit.ogrListe||[]).filter(Boolean).slice(0,60);
    const sec=[];
    const baslaB=el("button","sec","▶ Başla!");
    if(liste.length>=3){
      alan.append(el("div","","<div style='font-size:20px;margin:6px 0;text-align:center'>Üç yarışmacı seç:</div>"));
      const cip=el("div","hzOyuncular");
      function cips(){
        cip.innerHTML="";
        liste.forEach(ad=>{
          const i=sec.indexOf(ad);
          const b=el("button","", ad+(i===0?" 1️⃣":(i===1?" 2️⃣":(i===2?" 3️⃣":""))));
          if(i>=0) b.classList.add("secili");
          b.style.minHeight="52px"; b.style.fontSize="20px";
          b.addEventListener("click",()=>{
            SES.tus();
            const j=sec.indexOf(ad);
            if(j>=0) sec.splice(j,1);
            else if(sec.length<3) sec.push(ad);
            else { duyur("Üç yarışmacı — önce birini kaldır."); SES.yanlis(); return; }
            cips(); baslaDur();
          });
          cip.append(b);
        });
        const r=el("button","uic","🎲 <small>Rastgele seç</small>");
        r.style.fontSize="20px";
        r.addEventListener("click",()=>{
          SES.tus();
          const kar=karistir(liste.slice());
          sec.length=0; sec.push(kar[0],kar[1],kar[2]);
          cips(); baslaDur();
          duyur("Rastgele seçim: "+sec[0]+", "+sec[1]+" ve "+sec[2]);
        });
        cip.append(r);
      }
      const kar=karistir(liste.slice());
      sec.push(kar[0],kar[1],kar[2]);   /* açılışta otomatik rastgele üçlü */
      alan.append(cip);
      cips();
      baslaB.addEventListener("click",()=>{
        if(sec.length!==3){ duyur("Üç yarışmacı seç."); SES.yanlis(); return; }
        SES.dogru();
        yarisma(sec.slice());
      });
      alan.append(baslaB);
      function baslaDur(){ baslaB.disabled=sec.length!==3; }
      baslaDur();
    }else{
      alan.append(el("div","bilgiCip","Yarış için öğrenci listesinde en az 3 kişi gerekli. ⚙️ Ayarlar'da yükleyin — isimler buraya kendiliğinden gelir."));
      baslaB.disabled=true;
      alan.append(baslaB);
    }
    alan.append(el("div","","<p style='font-size:18px;text-align:center;opacity:.8'>Sıranız gelince kelimeyi iyi dinleyin, doğru kelimeye dokunun — roketiniz bir yıldız ilerler. İlk "+HEDEF+" yıldıza ulaşan kazanır!</p>"));
  }

  /* --- yarışma --- */
  function yarisma(adlar){
    const oy=adlar.map(ad=>({ad, iler:0}));
    let sira=0, soruNo=0;
    const kok=el("div","");
    kok.style.cssText="display:flex;flex-direction:column;align-items:center;gap:12px;width:100%";
    alan.append(kok);

    function bitis(kazanan, alt){
      puanArt(5); pistYenile();
      const sirali=[...oy].sort((x,y)=>y.iler-x.iler);
      roketSkorKaydet(sirali.map(o=>({ad:o.ad, puan:o.iler})));
      konfeti(); SES.bitti();
      const tb=el("div","tebrik");
      tb.setAttribute("role","dialog"); tb.setAttribute("aria-modal","true");
      const baslik=kazanan? (kazanan+" kazandı! 🚀") : "Berabere! 🤝";
      tb.setAttribute("aria-label",baslik);
      tb.append(el("div","buyuk","🚀"));
      tb.append(el("div","","<h2 style=\"margin:4px\">"+baslik+"</h2><p style=\"font-size:24px;margin:4px\">"+alt+"</p>"));
      const b1=el("button","","Yeniden Oyna");
      b1.style.background="var(--vurgu)";
      b1.onclick=()=>{ tb.remove(); yarisma(adlar); };
      const b2=el("button","","👥 Oyuncuları değiştir");
      b2.style.background="#42a5f5";
      b2.onclick=()=>{ tb.remove(); oyuncuSecici(); };
      const b3=el("button","","Etkinliklere Dön");
      b3.style.background="#90a4ae";
      b3.onclick=()=>{ tb.remove(); gitGrup(durum.grup); };
      tb.append(b1,b2,b3);
      document.body.appendChild(tb);
      b1.focus();
      duyur((baslik)+" "+(alt||""));
    }

    /* --- pist --- */
    const pist=el("div","roketPist");
    const seritler=oy.map((o,i)=>{
      const s=el("div","roketSerit");
      const ad=el("span","roketAd",o.ad);
      const yol=el("span","roketYol");
      const simge=el("span","roketSimge","🚀"); simge.style.left="6px";
      for(let k=0;k<HEDEF;k++){
        const ys=el("span","roketYildiz","⭐");
        yol.append(ys);
      }
      yol.append(simge);
      s.append(ad,yol);
      pist.append(s);
      return {o, simge, yol};
    });
    kok.append(pist);

    function ciz(){
      seritler.forEach(s=>{ s.simge.style.left=(8+(s.o.iler*(86/HEDEF)))+"%"; });
      siraYu.innerHTML=oy.map((o,i)=>
        `<span class="${i===sira%3?"hzSira":""}">${i===sira%3?"▶️ ":""}<b>${o.ad}</b>: <b>${o.iler}</b> ⭐</span>`).join("");
    }

    const siraYu=el("div","hzPuanlar");
    kok.append(siraYu);
    const soruYu=el("div","");
    soruYu.style.cssText="display:flex;flex-direction:column;align-items:center;gap:12px;min-height:150px";
    kok.append(soruYu);

    /* --- soru: duyduğun kelimeyi bul --- */
    const hav=izinliKelimeler(g);
    function soru(){
      if(oy.some(o=>o.iler>=HEDEF)){
        const t=[...oy].sort((x,y)=>y.iler-x.iler);
        bitis(t[0].ad, t[0].ad+" "+HEDEF+" yıldıza ulaştı!");
        return;
      }
      if(soruNo>=SORU_LIMIT){
        const t=[...oy].sort((x,y)=>y.iler-x.iler);
        if(t[0].iler===t[1].iler) bitis(null, t[0].ad+" ve "+t[1].ad+" — "+t[0].iler+" ⭐");
        else bitis(t[0].ad, t[0].ad+" "+t[0].iler+" ⭐");
        return;
      }
      soruYu.innerHTML="";
      const kelime=uret(hav);
      const diger=farkli(hav.filter(w=>w!==kelime),2);
      const kart=el("div","buyukKart","<div style=\"font-size:22px;opacity:.8\">Duyduğun kelimeyi seç — sıra: <b>"+oy[sira%3].ad+"</b></div>");
      kart.__rk={kelime};   /* hata ayıklama/test kanca */
      const bDinle=el("button","uic","🔊 <small>tekrar dinle</small>");
      bDinle.style.fontSize="20px";
      bDinle.addEventListener("click",()=>{ SES.tus(); konus(kelime); });
      kart.append(bDinle);
      soruYu.append(kart);
      const s=el("div","secenekler");
      karistir([kelime].concat(diger)).forEach(w=>{
        const b=el("button","sec",w);
        b.addEventListener("click",()=>{
          if(b.disabled) return;
          b.disabled=true;
          if(w===kelime){
            SES.dogru(); puanArt(2); pistYenile();
            oy[sira%3].iler++;
            ciz();
            sira++; soruNo++;
            setTimeout(()=>{ soru(); }, 700);
          }else{
            SES.yanlis();
            /* soru sıradaki yarışmacıya geçer */
            sira++; soruNo++;
            setTimeout(()=>{ soru(); }, 600);
          }
        });
        s.append(b);
      });
      soruYu.append(s);
      ciz();
      konus(kelime);
      duyur("Sıra: "+oy[sira%3].ad);
    }
    soru();
  }

  oyuncuSecici();
}
