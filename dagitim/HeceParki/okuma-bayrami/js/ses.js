/* =====================================================================
   4) SES (Web Speech API + WebAudio) VE KONFETİ
   ===================================================================== */
"use strict";

var voice = null;
function pickVoice() {
  try {
    var vs = window.speechSynthesis.getVoices() || [];
    for (var i = 0; i < vs.length; i++) {
      var lg = (vs[i].lang || "").toLowerCase();
      if (lg.indexOf("tr") === 0) { voice = vs[i]; return; }
    }
  } catch (e) { }
}
if ("speechSynthesis" in window) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}
function ttsReady() { return !!(S.sound && S.voice && "speechSynthesis" in window); }
function speak(text, rate) {
  if (!ttsReady() || !text) return;
  try {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = "tr-TR";
    if (voice) u.voice = voice;
    var base = S.speed === "slow" ? 0.78 : (S.speed === "fast" ? 1.08 : 0.93);
    u.rate = clamp((rate || 1) * base, 0.5, 1.6);
    u.pitch = 1.15; u.volume = 1;
    window.speechSynthesis.speak(u);
  } catch (e) { }
}
var AC = null;
function beep(freqs, dur) {
  if (!S.sound) return;
  dur = dur || 0.12;
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    freqs.forEach(function (f, i) {
      var t = AC.currentTime + i * dur * 0.85;
      var o = AC.createOscillator(), g = AC.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.03);
    });
  } catch (e) { }
}
function sndOk() { beep([660, 880, 1180]); }
function sndNo() { beep([320, 240], 0.15); }
function sndWin() { beep([523, 659, 784, 1046, 1318], 0.16); }

/* =====================================================================
   FONEM SESLETİCİ — harf adı değil, sesin kendisi
   Sıra: kayıtlı fonem (manifest) → sessiz harfte WebAudio sentezi →
   ünlü harfte TTS (Türkçede ünlü harfin adı sesiyle aynıdır).
   Sessiz harfler TTS ile söylenirse "be, ce, de" gibi harf adı çıkar;
   bu yüzden burada sentezlenir.
   ===================================================================== */
var SESLI_HARF = "aeıioöuü";
var FONEM_TABANI = "assets/sesler/";

function kayitliFonemYolu(h) {
  try {
    var m = window.ORTAK_SES_KAYITLARI;
    var d = m && m.fonem && m.fonem[h];
    if (!d) return "";
    if (/^[a-z]+:/i.test(d) || d.charAt(0) === "/" || d.indexOf("/") > -1) return d;
    return FONEM_TABANI + "fonem/" + d;
  } catch (e) { return ""; }
}

/* Sessiz harfin ağızdan çıktığı gibi üretimi (ortak ses motoru).
   Tanınmayan harfte veya ses kapalıyken false döner. */
function fonemSentez(h) {
  if (!S.sound) return false;
  if (SESLI_HARF.indexOf(h) > -1) return false;
  try {
    return !!(window.Fonem && window.Fonem.sentez(h));
  } catch (e) { return false; }
}

/* Harfin sesini duyur. Kaynak ne olursa olsun harf ADI söylenmez. */
function sesFonem(h) {
  h = lower(h).charAt(0);
  if (!h || !S.sound) return "kapali";
  var yol = kayitliFonemYolu(h);
  if (yol) {
    try {
      var a = new Audio(yol);
      var p = a.play();
      if (p && p.catch) p.catch(function () { sesFonemYedek(h); });
      return "kayit";
    } catch (e) { }
  }
  return sesFonemYedek(h);
}
function sesFonemYedek(h) {
  if (fonemSentez(h)) return "sentez";
  if (SESLI_HARF.indexOf(h) > -1) { speak(h, 0.72); return "tts"; }
  return "yok";
}
var PRAISE = ["Aferin!", "Harika!", "Bravo!", "Çok güzel!", "Süpersin!", "Muhteşem!", "Tam isabet!"];
var RETRY = ["Olsun, tekrar dene!", "Neredeyse buldun!", "Bir daha bak!", "Hadi bir kez daha!", "Yaklaştın, devam!"];

var cv = $("#confetti"), cx = cv.getContext("2d"), parts = [], raf = null;
function sizeCanvas() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
window.addEventListener("resize", sizeCanvas); sizeCanvas();
var COLORS = ["#ff8fb1", "#5cb3ff", "#5ecf8b", "#ffcf5c", "#b18cff", "#ff9f5a", "#59d6cf"];
function burst(n, ox, oy) {
  n = n || 80;
  for (var i = 0; i < n; i++) {
    parts.push({
      x: ox === undefined ? cv.width * (0.15 + Math.random() * 0.7) : ox,
      y: oy === undefined ? cv.height * 0.32 : oy,
      vx: (Math.random() - 0.5) * 9,
      vy: -4 - Math.random() * 9,
      s: 6 + Math.random() * 9,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: COLORS[rnd(COLORS.length)],
      life: 70 + rnd(50)
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  cx.clearRect(0, 0, cv.width, cv.height);
  for (var i = parts.length - 1; i >= 0; i--) {
    var p = parts[i];
    p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
    if (p.life <= 0 || p.y > cv.height + 40) { parts.splice(i, 1); continue; }
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
    cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore();
  }
  if (parts.length) { raf = requestAnimationFrame(tick); }
  else { raf = null; cx.clearRect(0, 0, cv.width, cv.height); }
}
var toastT = null;
function toast(msg, ms) {
  var el = $("#toast"); el.textContent = msg; el.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(function () { el.classList.remove("on"); }, ms || 2400);
}
