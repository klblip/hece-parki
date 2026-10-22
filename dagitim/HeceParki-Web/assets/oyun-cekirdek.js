/* =====================================================================
   OYUN ÇEKİRDEĞİ — Hece Rallisi ve Aç Canavar'ın ortak yardımcıları
   ---------------------------------------------------------------------
   Bu dosya iki oyunun birebir aynı olan katmanını tek yerde tutar:
   depolama, Türkçe seslendirme, ses efektleri, konfeti/kalp, kelime-hece
   havuzları ve resmî harf setleri. Oyun akışı (kapı/tabak, kurulum, skor)
   her oyunda kalmaya devam eder.

   Yükleme sırası: assets/veri.js → assets/fonem.js → assets/oyun-cekirdek.js
   → oyunun kendi betiği. Fonksiyonlar bilinçli olarak global `var`/`function`
   olarak tanımlanır; oyun kodları aynı adları çağırır.
   ===================================================================== */
"use strict";

/* ---------- kısa yardımcılar ---------- */
function yaz(s) { return String(s); }

function depoOku(anahtar, varsayilan) {
  try {
    var x = localStorage.getItem(anahtar);
    return x ? JSON.parse(x) : varsayilan;
  } catch (e) { return varsayilan; }
}
function depoYaz(anahtar, deger) {
  try { localStorage.setItem(anahtar, JSON.stringify(deger)); } catch (e) { }
}

/* ---------- Türkçe seslendirme ---------- */
var _ses = { ses: null };
function sesHazirla() {
  if (!("speechSynthesis" in window)) return;
  var bul = function () {
    var v = speechSynthesis.getVoices().filter(function (x) {
      return x.lang && x.lang.toLowerCase().indexOf("tr") === 0;
    })[0];
    if (v) _ses.ses = v;
  };
  bul(); speechSynthesis.onvoiceschanged = bul;
}
sesHazirla();
function soyle(metin, hiz) {
  if (!("speechSynthesis" in window) || !metin) return;
  try {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(metin);
    u.lang = "tr-TR"; if (_ses.ses) u.voice = _ses.ses;
    u.rate = (typeof hiz === "number") ? hiz : 0.72;
    u.pitch = 1.05;
    speechSynthesis.speak(u);
  } catch (e) { }
}

/* ---------- ses efektleri (iki oyunun türleri birleşik) ---------- */
var _ac = null;
function efekt(tip) {
  try {
    if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
    var o = _ac.createOscillator(), g = _ac.createGain();
    o.connect(g); g.connect(_ac.destination);
    var n = _ac.currentTime, sure = 0.2;
    if (tip === "dogru") {
      o.type = "triangle"; o.frequency.setValueAtTime(520, n);
      o.frequency.exponentialRampToValueAtTime(1000, n + .16); sure = .3;
    } else if (tip === "yanlis") {
      o.type = "sawtooth"; o.frequency.setValueAtTime(200, n);
      o.frequency.exponentialRampToValueAtTime(85, n + .32); sure = .36;
    } else if (tip === "turbo") {
      o.type = "sawtooth"; o.frequency.setValueAtTime(150, n);
      o.frequency.exponentialRampToValueAtTime(720, n + .42); sure = .46;
    } else if (tip === "hamm") {
      o.type = "square"; o.frequency.setValueAtTime(150, n);
      o.frequency.exponentialRampToValueAtTime(55, n + .24); sure = .3;
    } else if (tip === "tok") {
      o.type = "square"; o.frequency.setValueAtTime(190, n);
      o.frequency.exponentialRampToValueAtTime(115, n + .13); sure = .16;
    } else {
      o.type = "sine"; o.frequency.setValueAtTime(660, n); sure = .12;
    }
    g.gain.setValueAtTime(.22, n);
    g.gain.exponentialRampToValueAtTime(.001, n + sure);
    o.start(n); o.stop(n + sure);
  } catch (e) { }
}

/* ---------- kutlama efektleri ---------- */
function konfeti(adet) {
  var renkler = ["#ff5f6d", "#ffd93b", "#4bd37b", "#2ec4d6", "#a86bff", "#ff9a3d"];
  adet = adet || 90;
  for (var i = 0; i < adet; i++) {
    var k = document.createElement("div"), b = 7 + Math.random() * 9;
    k.style.cssText = "position:fixed;top:-18px;left:" + (Math.random() * 100) + "vw;" +
      "width:" + b + "px;height:" + (Math.random() > .5 ? b : b * .55) + "px;" +
      "background:" + renkler[Math.floor(Math.random() * renkler.length)] + ";" +
      "border-radius:" + (Math.random() > .5 ? "50%" : "2px") + ";z-index:9999;pointer-events:none";
    document.body.appendChild(k);
    var bitir = (function (el) {
      return function () { if (el.parentNode) el.remove(); };
    })(k);
    k.animate([
      { transform: "translateY(0) rotate(0)" },
      { transform: "translateY(" + (innerHeight + 70) + "px) rotate(" + ((Math.random() * 2 - 1) * 720) + "deg)" }
    ], { duration: 2100 + Math.random() * 1800, easing: "cubic-bezier(.3,.6,.5,1)" }).onfinish = bitir;
  }
}
function kalpler(alan, adet, simgeler) {
  var simge = simgeler || ["💛", "🤍", "💗"];
  adet = adet || 10;
  for (var i = 0; i < adet; i++) {
    var h = document.createElement("div");
    h.textContent = simge[Math.floor(Math.random() * simge.length)];
    h.style.cssText = "position:absolute;left:" + (15 + Math.random() * 70) + "%;bottom:-26px;" +
      "font-size:" + (18 + Math.random() * 20) + "px;z-index:80;pointer-events:none";
    alan.appendChild(h);
    var bitir = (function (el) {
      return function () { if (el.parentNode) el.remove(); };
    })(h);
    h.animate([
      { transform: "translateY(0) scale(.5)", opacity: 0 },
      { transform: "translateY(-40px) scale(1.1)", opacity: 1, offset: .25 },
      { transform: "translateY(-" + (260 + Math.random() * 160) + "px) scale(.85)", opacity: 0 }
    ], { duration: 1700 + Math.random() * 1300, easing: "ease-out" }).onfinish = bitir;
  }
}

/* ---------- kanonik kelime/hece havuzu ---------- */
var OVC = window.OrtakVeri;
if (!OVC) throw new Error("OrtakVeri yüklenmedi: assets/veri.js, oyun-cekirdek.js'den önce çağrılmalı.");
var SOZLUKC = OVC.SOZLUK.map(function (o) { return [o.w, o.heceler]; });

function kelimeFiltre(harfler) {
  return SOZLUKC.filter(function (p) {
    var w = p[0], s = p[1];
    return w && Array.isArray(s) &&
      w.split("").every(function (h) { return harfler.has(h); }) &&
      s.every(function (hz) { return hz.split("").every(function (h) { return harfler.has(h); }); });
  });
}
/* Hece havuzu: seçili harflerle yazılabilen GERÇEK kelimelerin heceleri.
   Uydurma harf dizisi üretilmez; kapalı heceler önce gelir. */
function heceHavuzu(harfler) {
  var out = [];
  SOZLUKC.forEach(function (p) {
    var w = p[0], s = p[1];
    if (!w || !Array.isArray(s)) return;
    if (!w.split("").every(function (h) { return harfler.has(h); })) return;
    s.forEach(function (hz) { if (hz.length >= 2 && out.indexOf(hz) < 0) out.push(hz); });
  });
  return OVC.heceSirala(out);
}
function benzerHarf(hedef, dizi) {
  var gruplar = [["i", "ı"], ["l", "n"], ["t", "d"], ["e", "a"], ["o", "ö"], ["u", "ü"],
    ["s", "ş"], ["ç", "c"], ["g", "ğ"], ["b", "p"], ["m", "n"], ["v", "y"], ["z", "ş"],
    ["k", "y"], ["r", "l"]];
  for (var i = 0; i < gruplar.length; i++) {
    var g = gruplar[i];
    var h = g.filter(function (x) { return x !== hedef && dizi.indexOf(x) > -1; })[0];
    if (h) return h;
  }
  return dizi.filter(function (x) { return x !== hedef; })[0] || hedef;
}

/* ---------- resmî 5 harf grubu (TYMM 2026) ---------- */
var RESMI_GRUPLAR = OVC.GROUPS.map(function (g) { return g.letters; });
function harfSetiKur(duzey) {
  var s = new Set();
  var n = Math.max(1, Math.min(duzey || 1, RESMI_GRUPLAR.length));
  for (var i = 0; i < n; i++) RESMI_GRUPLAR[i].forEach(function (h) { s.add(h); });
  return s;
}
