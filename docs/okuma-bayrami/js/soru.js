/* =====================================================================
   3) DURUM VE localStorage
   ===================================================================== */
"use strict";

var KEY = "okuma_bayrami_v1";
var DEF = {
  students: "",
  letters: ["a", "n", "e", "t", "i", "l"],
  types: { harf: true, ilkses: true, hece: true, resim: true, kelime: true, eksik: true },
  count: 10, speed: "normal", raceTarget: 10, memMode: "harf",
  sound: true, voice: true, pics: true, tips: true,
  usedDraw: [], scores: {}
};
var S = JSON.parse(JSON.stringify(DEF));
try {
  var raw = localStorage.getItem(KEY);
  if (raw) {
    var j = JSON.parse(raw);
    Object.keys(DEF).forEach(function (k) { if (j[k] !== undefined) S[k] = j[k]; });
    S.types = Object.assign({}, DEF.types, j.types || {});
    S.scores = j.scores || {};
    S.usedDraw = j.usedDraw || [];
  }
} catch (e) { }
if (!S.letters || !S.letters.length) S.letters = DEF.letters.slice();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { }
}
/* --- Harf / içerik havuzları (KATI FİLTRE) --- */
function lettersOf(text) {
  var out = [], s = lower(text);
  for (var i = 0; i < s.length; i++) { if (TR_ALPHA.indexOf(s[i]) > -1 && out.indexOf(s[i]) < 0) out.push(s[i]); }
  return out;
}
function poolLetters() {
  var act = S.letters;
  var out = [];
  GROUPS.forEach(function (g) { g.letters.forEach(function (l) { if (act.indexOf(l) > -1 && out.indexOf(l) < 0) out.push(l); }); });
  return out;
}
function allowed(text) {
  var L = lettersOf(text), ok = true;
  L.forEach(function (l) { if (S.letters.indexOf(l) < 0) ok = false; });
  return ok;
}
function poolWords() { return WORDS.filter(function (o) { return allowed(o.w); }); }
/* Resimle sorulacak kelimeler: emojisi olmayan kelime resimli soruda kullanılmaz
   (AGENTS kural 7: kelime ile resim aynı olmalı). */
function poolWordsPic() { return poolWords().filter(function (o) { return !!o.e; }); }
/* Resimli soruda bir resim yalnızca bir kelimeyi gösterebilsin: aynı emojiyi
   paylaşan ikinci kelime (ör. baba/babam) resim havuzuna girmez. */
function poolWordsPicTek() {
  var gorulen = {}, out = [];
  poolWordsPic().forEach(function (o) {
    if (gorulen[o.e]) return;
    gorulen[o.e] = 1; out.push(o);
  });
  return out;
}
function poolSentences() { return SENTENCES.filter(function (s) { return allowed(s); }); }
/* Cümleler 2. gruptan itibaren açılır (AGENTS kural 5). */
function cumlelerAcik() {
  var g1 = GROUPS[0].letters, L = poolLetters();
  return !L.every(function (l) { return g1.indexOf(l) > -1; });
}
/* Hece havuzu: uydurma harf dizileri değil, gerçek kelimelerin heceleri.
   Kapalı heceler önce gelir (heceSirala), böylece "at" "ta"dan önce sorulur. */
function poolSyllables() {
  var out = [];
  poolWords().forEach(function (o) {
    hecele(o.w).forEach(function (h) { if (out.indexOf(h) < 0) out.push(h); });
  });
  return heceSirala(out);
}
/* Yakın (benzer) seçenekler: harf benzerliği + uzunluk + baş/son harf */
function nearby(pool, target, n) {
  var tset = {}; String(target).split("").forEach(function (c) { tset[c] = 1; });
  var scored = pool.filter(function (x) { return x !== target; }).map(function (x) {
    var sc = 0, seen = {};
    String(x).split("").forEach(function (c) { if (!seen[c]) { seen[c] = 1; if (tset[c]) sc += 2; } });
    if (String(x).length === String(target).length) sc += 1;
    if (String(x)[0] === String(target)[0]) sc += 1;
    if (String(x).slice(-1) === String(target).slice(-1)) sc += 1;
    return { x: x, sc: sc, r: Math.random() };
  });
  scored.sort(function (a, b) { return b.sc - a.sc || a.r - b.r; });
  return scored.slice(0, n).map(function (o) { return o.x; });
}
/* =====================================================================
   6) SORU ÜRETİCİSİ (yalnızca seçili harfler!)
   ===================================================================== */
function optCount() { return clamp(poolLetters().length, 2, 4); }
function pickDistinct(pool, correct, n, keyFn) {
  var key = keyFn || function (x) { return x; };
  var seen = {}; seen[key(correct)] = 1;
  var out = [];
  var sorted = nearby(pool, correct, pool.length);
  for (var i = 0; i < sorted.length && out.length < n; i++) {
    var k = key(sorted[i]);
    if (seen[k]) continue;
    seen[k] = 1; out.push(sorted[i]);
  }
  return out;
}
function buildOpts(correct, pool, n, keyFn) {
  var others = pickDistinct(pool, correct, n - 1, keyFn);
  if (others.length < 1) return null;
  var labels = shuffle([correct].concat(others));
  return { labels: labels, answer: labels.indexOf(correct) };
}
function qHarf() {
  var L = poolLetters(); if (L.length < 2) return null;
  var a = rand(L);
  var b = buildOpts(a, L, Math.min(optCount(), L.length));
  if (!b) return null;
  /* Harf ADI söylenmez: sesli harfte TTS harfin sesini, sessiz harfte
     ses sentezleyici ağızdan çıktığı gibi duyurur (bkz. ses.js → sesFonem). */
  return {
    type: "harf", ask: "Duyduğun sesin harfini bul 🔉", say: "", harf: a, reveal: a,
    visual: { type: "none" },
    options: b.labels.map(function (x) { return { label: x, cls: "harf" }; }),
    answer: b.answer
  };
}
function qIlkses() {
  var W = poolWordsPic(); if (W.length < 2) return null;
  var w = rand(W), first = lower(w.w)[0], L = poolLetters();
  var b = buildOpts(first, L, Math.min(optCount(), L.length));
  if (!b) return null;
  /* Kelime yazıyla GÖSTERİLMEZ (okuma değil, ilk ses farkındalığı).
     Varlık resimle verilir, adı sesle söylenir. */
  return {
    type: "ilkses", ask: "Bu varlık hangi sesle başlıyor?", say: w.w, reveal: first,
    visual: { type: "emoji", value: w.e },
    options: b.labels.map(function (x) { return { label: x, cls: "harf" }; }),
    answer: b.answer
  };
}
function qHece() {
  var syl2 = poolSyllables().filter(function (s) { return s.length >= 2; });
  if (syl2.length < 2) return null;
  var a = rand(syl2);
  var b = buildOpts(a, syl2, Math.min(optCount(), syl2.length));
  if (!b) return null;
  return {
    type: "hece", ask: "Duyduğun heceyi bul 🔈", say: a, reveal: a,
    visual: { type: "none" },
    options: b.labels.map(function (x) { return { label: x, cls: "hece" }; }),
    answer: b.answer
  };
}
function qResim() {
  if (!S.pics) return null;
  var W = poolWordsPicTek(); if (W.length < 2) return null;
  var w = rand(W), labels = W.map(function (o) { return o.w; });
  var b = buildOpts(w.w, labels, Math.min(optCount(), labels.length));
  if (!b) return null;
  return {
    type: "resim", ask: "Resmi doğru kelimeyle eşleştir", say: w.w, reveal: w.w,
    emoji: w.e, visual: { type: "emoji", value: w.e },
    options: b.labels.map(function (x) { return { label: x, cls: "kel" }; }),
    answer: b.answer
  };
}
function qKelime() {
  if (!S.pics) return null;
  var W = poolWordsPic(); if (W.length < 3) return null;
  var emap = {}; W.forEach(function (o) { emap[o.w] = o.e; });
  var w = rand(W), labels = W.map(function (o) { return o.w; });
  var b = buildOpts(w.w, labels, Math.min(optCount(), labels.length), function (x) { return emap[x]; });
  if (!b) return null;
  return {
    type: "kelime", ask: "Duyduğun kelimeyi bul 👂", say: w.w, reveal: w.w,
    visual: { type: "none" },
    options: b.labels.map(function (x) { return { label: x, emoji: emap[x], cls: "pic" }; }),
    answer: b.answer
  };
}
function qEksik() {
  /* Eksik harf her konumda olabilir (ilk harf dahil) ve kelimede
     tekrar eden harfler de sorulabilir. */
  var W = poolWords().filter(function (o) { return o.w.length >= 3; });
  if (!W.length) return null;
  var w = rand(W), i = rnd(w.w.length), miss = w.w[i];
  var shown = w.w.slice(0, i) + "_" + w.w.slice(i + 1);
  var L = poolLetters();
  var b = buildOpts(miss, L, Math.min(optCount(), L.length));
  if (!b) return null;
  return {
    type: "eksik", ask: "Eksik harfi tamamla ✏️", say: w.w, reveal: miss,
    emoji: w.e, visual: { type: "mask", value: shown, pic: w.e },
    options: b.labels.map(function (x) { return { label: x, cls: "harf" }; }),
    answer: b.answer
  };
}
function nextQuestion() {
  var gens = [];
  if (S.types.harf) gens.push(qHarf);
  if (S.types.ilkses) gens.push(qIlkses);
  if (S.types.hece) gens.push(qHece);
  if (S.types.resim) gens.push(qResim);
  if (S.types.kelime) gens.push(qKelime);
  if (S.types.eksik) gens.push(qEksik);
  gens = shuffle(gens);
  for (var i = 0; i < gens.length; i++) {
    try { var q = gens[i](); if (q) return q; } catch (e) { }
  }
  return null;
}
