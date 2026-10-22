/* =====================================================================
   5) EKRAN VE KAPLAMA YÖNETİMİ
   ===================================================================== */
"use strict";

var CUR = "menu";
function showScreen(id) {
  $$(".screen").forEach(function (s) { s.classList.toggle("on", s.id === "scr-" + id); });
  CUR = id;
  $("#btnHome").style.visibility = id === "menu" ? "hidden" : "visible";
}
function showOv(id, on) { $("#" + id).classList.toggle("on", on !== false); }
function openPanel() { $("#panel").classList.add("on"); refreshPanel(); }
function closePanel() { $("#panel").classList.remove("on"); setTimeout(refreshTopbar, 300); }
function setHud(txt) {
  var h = $("#hud");
  if (!txt) { h.hidden = true; h.innerHTML = ""; return; }
  h.hidden = false; h.innerHTML = txt;
}
function warning(title, text) {
  $("#warnTitle").textContent = title;
  $("#warnText").innerHTML = text;
  showOv("ov-warn", true);
}
function needMoreLetters() {
  if (poolLetters().length < 2) {
    warning("Daha fazla harfe ihtiyacımız var 🧩",
      "Oyun üretebilmek için en az <b>2 harf</b> seçili olmalı.<br>Henüz öğretilmeyen harfler oyuna hiç girmez.");
    return true;
  }
  return false;
}

/* =====================================================================
   7) GÖRSEL ÇİZİM (soru görseli + balonlar)
   ===================================================================== */
function speedFactor() { return S.speed === "slow" ? 1.4 : (S.speed === "fast" ? 0.72 : 1); }
function balloonHTML(o) {
  var bg = ["linear-gradient(180deg,#8fd3ff,#4a9eec)", "linear-gradient(180deg,#ffb3cb,#f2739d)",
    "linear-gradient(180deg,#a9ebc2,#4cc27c)", "linear-gradient(180deg,#ffe08a,#ffc23d)",
    "linear-gradient(180deg,#cbb0ff,#9a6dfa)", "linear-gradient(180deg,#ffc39a,#ff9f5a)"];
  var inner = "";
  if (o.face) inner += '<svg class="fface" viewBox="0 0 60 60" aria-hidden="true">' +
    '<circle cx="20" cy="23" r="4.8"/><circle cx="40" cy="23" r="4.8"/>' +
    '<path d="M18 35 C 26 47, 34 47, 42 35"/></svg>';
  if (o.emoji) inner += '<b class="bemoji">' + o.emoji + '</b>';
  if (o.label !== undefined && o.label !== "") inner += '<span class="blabel">' + html(o.label) + '</span>';
  var len = (o.label || "").length;
  var extra = len > 6 ? " lbl-l" : (len > 4 ? " lbl-m" : "");
  return '<span class="bface' + extra + '" style="--bg:' + bg[rnd(bg.length)] + '">' + inner + '</span>' +
    '<i class="bstr"><svg viewBox="0 0 20 60" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M10 0 C 2 15, 18 25, 10 40 C 4 52, 14 56, 10 60" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></i>';
}
function spawnDeco() {
  var zone = $("#flyZone");
  if (!zone || zone.querySelector(".db")) return;
  var bgs = ["linear-gradient(180deg,#ffb3cb,#f2739d)", "linear-gradient(180deg,#a9ebc2,#4cc27c)",
    "linear-gradient(180deg,#ffe08a,#ffc23d)", "linear-gradient(180deg,#cbb0ff,#9a6dfa)",
    "linear-gradient(180deg,#ffc39a,#ff9f5a)", "linear-gradient(180deg,#8fd3ff,#4a9eec)"];
  for (var i = 0; i < 6; i++) {
    var d = document.createElement("span");
    d.className = "db";
    d.style.left = (4 + i * 16 + rnd(8)) + "%";
    d.style.animationDuration = (16 + rnd(12)) + "s";
    d.style.animationDelay = (-rnd(20)) + "s";
    d.style.width = "clamp(18px," + (3 + Math.random() * 2.2).toFixed(1) + "vh,50px)";
    d.innerHTML = balloonHTML({ label: "" });
    d.querySelector(".bface").style.background = "radial-gradient(circle at 33% 26%, rgba(255,255,255,.75), transparent 44%), " +
      bgs[i % bgs.length];
    zone.appendChild(d);
  }
}
var BOXCOL = [
  ["linear-gradient(180deg,#83c9ff,#4a9eec)", "linear-gradient(180deg,#ffc7dc,#f2739d)"],
  ["linear-gradient(180deg,#a9ebc2,#4cc27c)", "linear-gradient(180deg,#ffe08a,#ffc23d)"],
  ["linear-gradient(180deg,#cbb0ff,#9a6dfa)", "linear-gradient(180deg,#ffc39a,#ff9f5a)"],
  ["linear-gradient(180deg,#8fe6e0,#3fc0b7)", "linear-gradient(180deg,#ffd3a3,#ff9f5a)"],
  ["linear-gradient(180deg,#ffd98a,#e9a93a)", "linear-gradient(180deg,#b9c7ff,#7b8ffa)"]
];

/* =====================================================================
   8) TEBRİK EKRANI
   ===================================================================== */
var winCtx = null;
function celebrate(o) {
  winCtx = o;
  var starN = o.stars || 3, sh = "";
  for (var i = 0; i < starN; i++) sh += '<i style="animation-delay:' + (i * 0.14) + 's">⭐</i>';
  $("#winStars").innerHTML = sh;
  $("#winTitle").textContent = o.title || "Aferin!";
  $("#winScore").textContent = o.score || "";
  $("#winSub").innerHTML = o.sub || "";
  $("#winAgain").textContent = o.againText || "🔄 Tekrar Oyna";
  showOv("ov-win", true);
  burst(120); sndWin();
  speak(o.say || (o.title || "Aferin") + " " + (o.voice || ""), 1);
}
function closeWin() { showOv("ov-win", false); winCtx = null; }

/* =====================================================================
   9) OYUN 1 · UÇAN BALON (tek kişilik / sınıfça)
   ===================================================================== */
var FLY = { idx: 0, total: 10, score: 0, item: null, last: "", lane: 0, lanes: 5, lock: true, student: null, gen: 0, pc: 50, timed: null, items: [], boxItems: [], read: [] };
/* Balonun kutuya getireceği okuma parçaları: harf / hece / kelime */
function readItems() {
  var out = [];
  if (S.types.harf) poolLetters().forEach(function (l) { out.push({ t: l, kind: "harf" }); });
  if (S.types.hece) poolSyllables().filter(function (s) { return s.length >= 2; })
    .forEach(function (s) { out.push({ t: s, kind: "hece" }); });
  if (S.types.resim || S.types.kelime || S.types.eksik || S.types.ilkses)
    poolWords().forEach(function (o) { out.push({ t: o.w, kind: "kelime" }); });
  return out;
}
/* Kolaydan zora: kısa harf/heceler daha sık gelsin.
   used: aynı turda aynı parça tekrar etmesin (kutular birbirinden farklı olsun) */
function pickItem(pool, used) {
  if (!pool.length) return null;
  used = used || {};
  var free = pool.filter(function (x) { return !used[x.t] && x.t !== FLY.last; });
  if (!free.length) free = pool.filter(function (x) { return !used[x.t]; });
  if (!free.length) free = pool.slice();
  var sorted = free.slice().sort(function (a, b) { return a.t.length - b.t.length; });
  var k = Math.min(sorted.length - 1, Math.floor(Math.pow(Math.random(), 1.5) * sorted.length));
  return sorted[k];
}
function startQuiz(student) {
  if (needMoreLetters()) return;
  var pool = readItems();
  if (!pool.length) {
    warning("Balonlar için içerik yok 🧩",
      "Seçili harfler ve soru tipleriyle harf/hece/kelime bulunamadı.<br>Öğretmen panelinden harf ekleyin veya soru tiplerini açın.");
    return;
  }
  FLY.items = pool;
  FLY.student = student || FLY.student || null;
  FLY.idx = 0; FLY.score = 0; FLY.lane = 0; FLY.last = ""; FLY.lock = true; FLY.gen++;
  FLY.total = S.count;
  FLY.lanes = clamp(S.count, 3, 5);
  FLY.read = [];
  showScreen("quiz");
  spawnDeco();
  buildBoxes();
  setRead(false);
  updateHudQuiz();
  nextRound();
}
function updateHudQuiz() {
  setHud((FLY.student ? "🧒 " + html(FLY.student) + " · " : "") + "⭐ <span class='pts'>" + FLY.score + "</span> puan");
}
function boxes() { return $$("#boxrow .kbox"); }
/* Kutular baştan dolu ve görünür: hangi harf/hece/kelime olduğu belli olur */
function fillBoxes() {
  var used = {};
  for (var i = 0; i < FLY.lanes; i++) {
    var it = pickItem(FLY.items || [], used) || { t: "?", kind: "hece" };
    used[it.t] = 1;
    FLY.boxItems[i] = it;
    FLY.read[i] = false;
    var k = boxes()[i];
    if (!k) continue;
    k.classList.remove("collect", "target", "filled", "read");
    var f = k.querySelector(".kface");
    f.textContent = it.t;
    f.classList.remove("pop");
    void f.offsetWidth;
    f.classList.add("pop");
  }
}
function buildBoxes() {
  var row = $("#boxrow"); row.innerHTML = "";
  FLY.boxItems = []; FLY.read = [];
  for (var i = 0; i < FLY.lanes; i++) {
    var k = document.createElement("div");
    k.className = "kbox";
    k.style.setProperty("--bg", BOXCOL[i % BOXCOL.length][0]);
    k.style.setProperty("--bg2", BOXCOL[i % BOXCOL.length][1]);
    k.innerHTML = '<span class="kface"></span><span class="tick">✓</span>';
    k.addEventListener("click", function () { if (!FLY.lock) readDone(); });
    row.appendChild(k);
    FLY.boxItems.push(null); FLY.read.push(false);
  }
  fillBoxes();
}
function readAsk(item) {
  var w = item.kind === "harf" ? "harfi" : (item.kind === "hece" ? "heceyi" : "kelimeyi");
  return "🎈 Balonun konduğu kutudaki " + w + " yüksek sesle oku!";
}
function setRead(on) {
  var b = $("#quizNext");
  b.disabled = !on;
  b.classList.toggle("ready", !!on);
}
function nextRound() {
  var gen = FLY.gen;
  if (FLY.idx >= FLY.total) return finishQuiz();
  var unread = [];
  for (var i = 0; i < FLY.lanes; i++) if (!FLY.read[i]) unread.push(i);
  if (!unread.length) {
    /* Tur bitti: kutular toplanır, yerine yeni parçalar gelir */
    return clearWave(function () {
      if (gen !== FLY.gen) return;
      fillBoxes();
      nextRound();
    });
  }
  var lane = unread[rnd(unread.length)];   /* balon rastgele bir kutuya konar */
  var item = FLY.boxItems[lane];
  if (!item) return finishQuiz();
  FLY.lane = lane; FLY.item = item; FLY.idx++; FLY.last = item.t; FLY.lock = true;
  $("#quizCount").textContent = FLY.idx + "/" + FLY.total;
  $("#quizAsk").textContent = "Balon uçuyor... 🎈";
  setRead(false);
  updateHudQuiz();
  flyBalloon(item, lane);
}
/* Balon uçar → hedef kutunun üstüne konar → kutuda büyükçe okunur */
function flyBalloon(item, lane) {
  var gen = FLY.gen, zone = $("#flyZone");
  if (!zone) return;
  var old = zone.querySelector(".flyballoon"); if (old) old.remove();
  var tgt = boxes()[lane];
  if (tgt) tgt.classList.add("target");
  var pc = ((lane + 0.5) / FLY.lanes) * 100;
  FLY.pc = pc;
  var b = document.createElement("div");
  b.className = "flyballoon";
  b.style.setProperty("--bdur", (2 + Math.random()).toFixed(2) + "s");
  b.innerHTML = '<div class="bob">' + balloonHTML({ face: true }) + "</div>";
  b.style.left = "-26%"; b.style.bottom = "34%"; b.style.transition = "none";
  zone.appendChild(b);
  b.getBoundingClientRect();
  var cruise = 1.5 * speedFactor(), land = 1.1 * speedFactor();
  b.style.transition = "left " + cruise + "s cubic-bezier(.42,.05,.35,1), bottom " + (cruise * 0.4) + "s linear, transform .6s";
  setTimeout(function () {
    if (gen !== FLY.gen) return;
    b.style.left = pc + "%"; b.style.bottom = "46%"; b.style.transform = "rotate(-5deg)";
  }, 40);
  clearTimeout(FLY.timed);
  FLY.timed = setTimeout(function () {
    if (gen !== FLY.gen) return;
    b.style.transition = "left .4s ease, bottom " + land + "s cubic-bezier(.45,1.5,.55,1), transform .5s";
    b.style.bottom = "-18px"; b.style.transform = "rotate(2deg)";
    FLY.timed = setTimeout(function () {
      if (gen !== FLY.gen) return;
      b.classList.add("landed");
      if (tgt) tgt.classList.remove("target");
      $("#quizAsk").textContent = readAsk(item);
      FLY.lock = false;
      setRead(true);
      beep([720, 940], 0.1);
      burst(45);
      speak("Şimdi sen oku!", 1);
    }, land * 1000 + 130);
  }, cruise * 1000 + 90);
}
/* "Okudum" → yıldız + tebrik, balon uçup gider, sıradaki balon gelir */
function readDone() {
  if (FLY.lock || !FLY.item) return;
  FLY.lock = true; setRead(false);
  FLY.score += 10; updateHudQuiz();
  sndOk(); burst(90);
  var p = rand(PRAISE);
  $("#quizAsk").textContent = "✅ " + p;
  speak(p + " " + FLY.item.t, 1.05);
  var k = boxes()[FLY.lane];
  if (k) { k.classList.remove("target"); k.classList.add("read"); FLY.read[FLY.lane] = true; }
  var b = $("#flyZone .flyballoon");
  if (b) {
    b.classList.remove("landed");
    b.style.transition = "left 1.2s ease-in, bottom 1.2s ease-out, transform 1.1s";
    b.style.left = Math.min(118, FLY.pc + 42) + "%";
    b.style.bottom = "104%";
    b.style.transform = "rotate(16deg)";
    setTimeout(function () { if (b.parentNode) b.remove(); }, 1250);
  }
  setTimeout(nextRound, 1250);
}
/* Tur bitti: okunmuş kutular toplanır, sonra yeni parçalarla dolar */
function clearWave(cb) {
  var bx = boxes();
  speak("Hepsini okudun! Süper!", 1);
  bx.forEach(function (k, i) { setTimeout(function () { k.classList.add("collect"); }, i * 70); });
  setTimeout(function () {
    bx.forEach(function (k) {
      k.classList.remove("collect", "filled", "target", "read");
      k.querySelector(".kface").textContent = "";
    });
    if (cb) cb();
  }, 780);
}
function finishQuiz() {
  if (FLY.student) {
    var prev = S.scores[FLY.student] || 0;
    if (FLY.score > prev) S.scores[FLY.student] = FLY.score;
    save();
  }
  celebrate({
    title: FLY.student ? "Aferin " + FLY.student + "!" : "Aferin!",
    stars: 3, score: FLY.score + " puan",
    sub: FLY.total + " balon kutuya kondu, hepsini okudun! 📖🎈",
    say: "Aferin! " + FLY.total + " tanesini okudun.",
    againText: "🔄 Yeni Tur"
  });
}

/* =====================================================================
   10) SIRADAKİ ÖĞRENCİ (kura)
   ===================================================================== */
var drawnStudent = null, spinT = null;
function studentList() {
  return String(S.students || "").split(/[\n,;]+/).map(function (s) { return s.trim(); }).filter(Boolean);
}
function openDraw(auto) {
  var list = studentList();
  if (list.length < 2) {
    warning("Sınıf listesi boş 👥",
      "Sıradaki öğrenciyi çekebilmek için öğretmen panelinden sınıf listesini girin.<br>Her satıra bir öğrenci yazın.");
    openPanel();
    return;
  }
  showOv("ov-draw", true);
  if (auto !== false) spinRoulette();
}
function spinRoulette() {
  var list = studentList();
  var used = (S.usedDraw || []).filter(function (n) { return list.indexOf(n) > -1; });
  var remaining = list.filter(function (n) { return used.indexOf(n) < 0; });
  var reset = false;
  if (!remaining.length) { used = []; remaining = list.slice(); reset = true; }
  var el = $("#drawName");
  el.classList.add("rolling");
  $("#drawAgain").disabled = true; $("#drawStart").disabled = true;
  $("#drawBest").textContent = "Kura çekiliyor...";
  $("#drawInfo").textContent = "Bu turda " + used.length + "/" + list.length + " öğrenci sıra aldı.";
  var final = rand(remaining), n = 0, totalTicks = 22 + rnd(8);
  var names = shuffle(list.slice());
  clearInterval(spinT);
  spinT = setInterval(function () {
    el.textContent = names[n % names.length];
    n++; beep([700 + (n % 5) * 60], 0.05);
    if (n >= totalTicks) {
      clearInterval(spinT); spinT = null;
      el.textContent = final; el.classList.remove("rolling");
      drawnStudent = final;
      used.push(final); S.usedDraw = used; save();
      var best = S.scores[final];
      $("#drawBest").innerHTML = "🧒 <b>" + html(final) + "</b> · " + (best ? ("En iyi skoru: <b>" + best + " puan</b> 🏅") : "Henüz skoru yok, hadi başlayalım! 🌱");
      $("#drawInfo").textContent = (reset ? "Yeni tur başladı! " : "") + "Bu turda " + used.length + "/" + list.length + " öğrenci sıra aldı.";
      $("#drawAgain").disabled = false; $("#drawStart").disabled = false;
      burst(70); sndOk(); speak(final + ", senin sıran!", 1);
    }
  }, 90);
}
/* =====================================================================
   11) OYUN 2 · TAVŞAN YARIŞI (2 oyuncu · bölünmüş ekran)
   ===================================================================== */
var RACE = {
  t: [{ name: "1. Oyuncu", emoji: "🐰", score: 0, lock: 0 },
      { name: "2. Oyuncu", emoji: "🐢", score: 0, lock: 0 }],
  target: 10, q: null, lock: true, round: 0, timer: null
};
var EMOJIS = ["🐰", "🐢", "🐿️", "🐝", "🐬", "🦁", "🚗", "🚀", "🦄", "🐧", "🐨", "⭐"];
function openRaceSetup() {
  if (needMoreLetters()) return;
  var test = nextQuestion();
  if (!test) {
    warning("Soru üretilemedi 🧩", "Seçili harflerle yarış sorusu oluşturulamadı. Öğretmen panelinden harf ekleyin.");
    return;
  }
  var list = studentList();
  [0, 1].forEach(function (i) {
    var sel = $("#selP" + i); sel.innerHTML = "";
    var defs = ["1. Oyuncu", "2. Oyuncu"];
    var opts = list.length ? list.slice() : defs;
    defs.forEach(function (d, di) {
      if (!list.length || di === i) {
        var o = document.createElement("option"); o.value = d; o.textContent = d; sel.appendChild(o);
      }
    });
    if (list.length) {
      list.forEach(function (nm) {
        var o = document.createElement("option"); o.value = nm; o.textContent = nm; sel.appendChild(o);
      });
      sel.value = (i === 0 && drawnStudent && list.indexOf(drawnStudent) > -1) ? drawnStudent : list[i % list.length];
    }
    var es = $("#selE" + i); es.innerHTML = "";
    EMOJIS.forEach(function (e) {
      var o = document.createElement("option"); o.value = e; o.textContent = e; es.appendChild(o);
    });
    es.value = EMOJIS[i];
  });
  $("#raceInfo").textContent = list.length ? "" : "İpucu: Öğretmen panelinden öğrenci listesini girerseniz isimler otomatik gelir.";
  showOv("ov-race", true);
}
function startRace() {
  RACE.t[0].name = $("#selP0").value || "1. Oyuncu";
  RACE.t[1].name = $("#selP1").value || "2. Oyuncu";
  RACE.t[0].emoji = $("#selE0").value; RACE.t[1].emoji = $("#selE1").value;
  RACE.target = S.raceTarget; RACE.round = 0;
  RACE.t[0].score = 0; RACE.t[1].score = 0;
  showOv("ov-race", false);
  showScreen("race");
  $("#run0").textContent = RACE.t[0].emoji; $("#run1").textContent = RACE.t[1].emoji;
  $("#pn0").textContent = "🧒 " + RACE.t[0].name; $("#pn1").textContent = "🧒 " + RACE.t[1].name;
  $("#rn0").textContent = RACE.t[0].name; $("#rn1").textContent = RACE.t[1].name;
  $("#raceCount").textContent = "0 - 0";
  setHud("🐰 İlk " + RACE.target + " puana ulaşan kazanır!");
  updateTrack();
  raceRound();
}
function updateTrack() {
  [0, 1].forEach(function (i) {
    var pc = clamp(RACE.t[i].score / RACE.target, 0, 1);
    $("#fill" + i).style.width = (pc * 100) + "%";
    $("#run" + i).style.left = (4 + pc * 88) + "%";
  });
}
function paintRaceVisual(q) {
  var el = $("#raceEmoji"), v = q.visual || { type: "none" }, t = "";
  if (v.type === "emoji") t = '<span style="font-size:clamp(22px,6.6vh,58px);line-height:1">' + v.value + "</span>";
  else if (v.type === "mask") t = '<span style="font-weight:900;font-size:clamp(18px,5vh,44px)">' + html(v.value) + "</span>";
  /* Cevap görselde GÖSTERİLMEZ: ses yoksa da doğru harf/hece ekrana yazılmaz. */
  el.innerHTML = t;
}
function raceRound() {
  if (RACE.t[0].score >= RACE.target || RACE.t[1].score >= RACE.target) return raceFinish();
  var q = nextQuestion();
  if (!q) return raceFinish();
  RACE.q = q; RACE.lock = false; RACE.round++;
  RACE.t[0].lock = 0; RACE.t[1].lock = 0;
  $("#raceAsk").textContent = q.ask;
  paintRaceVisual(q);
  [0, 1].forEach(function (i) { renderSide(i, q); $("#msg" + i).classList.remove("on"); });
  soruyuDuyur(q);
  clearTimeout(RACE.timer);
  RACE.timer = setTimeout(function () {
    if (!RACE.lock && RACE.q) {
      RACE.lock = true; markCorrectAll();
      speak(RACE.q.harf ? "Doğru cevabı işaretledim. Yeni soru geliyor." :
        "Doğru cevap " + (RACE.q.reveal || "") + ". Yeni soru geliyor.", 1);
      setTimeout(raceRound, 1600);
    }
  }, 16000);
}
/* Soruyu sesle sorar: harf sorusunda harf adı değil sesin kendisi */
function soruyuDuyur(q) {
  if (!q) return;
  if (q.harf) sesFonem(q.harf);
  else speak(q.say, 1);
}
function renderSide(i, q) {
  var box = $("#opts" + i); box.innerHTML = "";
  var order = shuffle(q.options.map(function (o, k) { return k; }));
  order.forEach(function (oi) {
    var o = q.options[oi];
    var b = document.createElement("button");
    b.className = "opt" + (o.cls === "pic" ? " pic" : "");
    b.innerHTML = o.cls === "pic" ? '<span>' + o.emoji + "</span>" : "<span>" + html(o.label) + "</span>";
    b.dataset.i = oi;
    b.addEventListener("click", function () { racePick(i, oi, b); });
    box.appendChild(b);
  });
}
function sideMsg(i, txt) {
  var m = $("#msg" + i); m.textContent = txt; m.classList.add("on");
  setTimeout(function () { m.classList.remove("on"); }, 1400);
}
function markCorrectAll() {
  [0, 1].forEach(function (i) {
    $$("#opts" + i + " .opt").forEach(function (b) {
      b.classList.add("dis");
      if (Number(b.dataset.i) === RACE.q.answer) b.classList.add("ok");
    });
  });
}
/* Bir oyuncunun tüm seçenekleri bittiyse turda cevap veremez */
function raceSideOut(i) {
  var list = $$("#opts" + i + " .opt");
  for (var k = 0; k < list.length; k++) { if (!list[k].classList.contains("dis")) return false; }
  return true;
}
function racePick(i, oi, btn) {
  if (RACE.lock || RACE.t[i].lock > Date.now()) return;
  var q = RACE.q;
  if (oi === q.answer) {
    RACE.lock = true; clearTimeout(RACE.timer);
    btn.classList.add("ok");
    RACE.t[i].score++;
    $("#wb" + i).classList.add("on");
    setTimeout(function () { $("#wb" + i).classList.remove("on"); }, 900);
    updateTrack(); sndOk(); burst(70);
    $("#raceCount").textContent = RACE.t[0].score + " - " + RACE.t[1].score;
    var p = rand(PRAISE);
    sideMsg(i, "✅ " + p);
    speak(q.harf ? p : p + " " + (q.reveal || ""), 1.05);
    markCorrectAll();
    if (RACE.t[i].score >= RACE.target) { setTimeout(raceFinish, 900); }
    else { setTimeout(raceRound, 1200); }
  } else {
    /* Yapıcı geri bildirim: utandırmadan tekrar denemeye teşvik.
       Sadece o seçenek kapanır, kısa bir bekleme sonrası yeniden denenebilir. */
    btn.classList.add("no"); btn.classList.add("dis"); btn.disabled = true;
    sndNo();
    RACE.t[i].lock = Date.now() + 700;
    sideMsg(i, "💪 " + rand(RETRY));
    beep([300, 220], 0.12);
    if (raceSideOut(0) && raceSideOut(1)) {
      RACE.lock = true; clearTimeout(RACE.timer); markCorrectAll();
      speak(RACE.q.harf ? "Doğru cevabı işaretledim." : "Doğru cevap " + (RACE.q.reveal || ""), 1);
      setTimeout(raceRound, 1600);
    }
  }
}
function raceFinish() {
  RACE.lock = true; clearTimeout(RACE.timer);
  var w = RACE.t[0].score > RACE.t[1].score ? 0 : (RACE.t[1].score > RACE.t[0].score ? 1 : -1);
  var title, sub, say;
  if (w < 0) { title = "Berabere! 🤝"; sub = "İki oyuncu da harika okudu!"; say = "Berabere, tebrikler!"; }
  else {
    title = "🏆 " + RACE.t[w].name + " kazandı!";
    sub = RACE.t[w].emoji + " " + RACE.t[w].score + " - " + RACE.t[1 - w].score + " " + RACE.t[1 - w].emoji +
      "<br>" + RACE.t[1 - w].name + " de çok iyi savaştı! 👏";
    say = RACE.t[w].name + " kazandı! " + RACE.t[w].score + " puan.";
    var pre = S.scores[RACE.t[w].name] || 0;
    if (RACE.t[w].score > pre) { S.scores[RACE.t[w].name] = RACE.t[w].score; save(); }
  }
  celebrate({ title: title, stars: 3, score: RACE.t[0].score + " - " + RACE.t[1].score, sub: sub, say: say, againText: "🔄 Yeni Yarış" });
}

/* =====================================================================
   12) OYUN 3 · HAFIZA KARTLARI
   ===================================================================== */
var MEM = { cards: [], first: -1, lock: false, moves: 0, found: 0, pairs: 6, t0: 0, timer: null };
var MEM_MODES = [
  { k: "harf", t: "🔤 Aynı harf", d: "Aynı küçük harfi eşleştir" },
  { k: "buyuk", t: "🔠 Küçük – büyük", d: "Küçük harfle o harfin büyüğünü eşleştir" },
  { k: "hece", t: "🔈 Aynı hece", d: "Aynı heceyi okuyup eşini bul" },
  { k: "birles", t: "🧩 Hece + harfler", d: "Heceyi, onu oluşturan harflerle eşleştir" }
];
/* Hafıza destesi: yalnızca harf ve heceler (resim yok).
   Küçük harf esastır; büyük harf yalnızca "buyuk" modunda, küçüğün eşi olarak gelir. */
function memDeck(mode) {
  var L = poolLetters();
  var syl = poolSyllables().filter(function (s) { return s.length >= 2; });
  var deck = [], label = "";
  if (mode === "hece" || mode === "birles") {
    var pool = shuffle(syl).slice(0, 6);
    if (pool.length < 3) return null;
    pool.forEach(function (s) {
      var id = "s" + s;
      if (mode === "hece") {
        deck.push({ id: id, face: html(s), cls: "" });
        deck.push({ id: id, face: html(s), cls: "" });
      } else {
        deck.push({ id: id, face: html(s), cls: "" });
        deck.push({ id: id, face: html(s.split("").join(" ")), cls: "harfler" });
      }
    });
    label = (mode === "hece") ? "🔈 Aynı heceyi bul" : "🧩 Heceyi harfleriyle eşleştir";
  } else {
    var pl = shuffle(L).slice(0, 3);
    /* 'ı' ile 'l' aynı destede görsel olarak karışabildiği için 'l' varsa 'ı' çıkarılır */
    if (pl.indexOf("ı") > -1 && pl.indexOf("l") > -1) pl = pl.filter(function (x) { return x !== "ı"; });
    if (pl.length < 2) return null;
    pl.forEach(function (l) {
      var up = l.toLocaleUpperCase("tr-TR");
      if (mode === "buyuk") {
        deck.push({ id: "h" + l, face: l, cls: "" });
        deck.push({ id: "h" + l, face: up, cls: "buyuk" });
      } else {
        deck.push({ id: "h" + l, face: l, cls: "" });
        deck.push({ id: "h" + l, face: l, cls: "" });
      }
    });
    label = (mode === "buyuk") ? "🔠 Küçük harfle büyük harfini eşleştir" : "🔤 Aynı küçük harfi eşleştir";
  }
  return { deck: deck, label: label };
}
function renderMemModes() {
  var box = $("#memModes");
  if (!box) return;
  box.innerHTML = "";
  MEM_MODES.forEach(function (m) {
    var b = document.createElement("button");
    b.className = "pill" + (S.memMode === m.k ? " on" : "");
    b.textContent = m.t;
    b.title = m.d;
    b.addEventListener("click", function () {
      S.memMode = m.k; save(); buildMemory();
    });
    box.appendChild(b);
  });
}
function buildMemory() {
  if (needMoreLetters()) return;
  renderMemModes();
  var built = memDeck(S.memMode || "harf");
  if (!built) {
    warning("Hafıza kartları için içerik yetersiz 🧩",
      "Bu mod için yeterli harf/hece yok.<br>Öğretmen panelinden harf ekleyin. (Hece eşleştirme için en az 3 hece gerekir.)");
    return;
  }
  MEM.cards = shuffle(built.deck); MEM.first = -1; MEM.lock = false;
  MEM.moves = 0; MEM.found = 0; MEM.pairs = MEM.cards.length / 2; MEM.t0 = Date.now();
  var grid = $("#memGrid");
  grid.style.gridTemplateRows = "repeat(" + Math.ceil(MEM.cards.length / 4) + ",1fr)";
  grid.innerHTML = "";
  MEM.cards.forEach(function (c, i) {
    var b = document.createElement("button");
    b.className = "mcard"; b.dataset.i = i;
    b.setAttribute("aria-label", "Kapalı kart " + (i + 1));
    b.innerHTML = '<div class="inner"><div class="mface mfront">❓</div><div class="mface mback' +
      (c.cls ? " " + c.cls : "") + '">' + c.face + "</div></div>";
    b.addEventListener("click", function () { memFlip(i, b); });
    grid.appendChild(b);
  });
  $("#memInfo").textContent = built.label + " · " + MEM.pairs + " çift";
  $("#memMoves").textContent = "Hamle: 0";
  $("#memTime").textContent = "Süre: 0 sn";
  clearInterval(MEM.timer);
  MEM.timer = setInterval(function () {
    $("#memTime").textContent = "Süre: " + Math.floor((Date.now() - MEM.t0) / 1000) + " sn";
  }, 1000);
  showScreen("mem");
  setHud("🎴 Eşleri bul!");
}
function memFlip(i, el) {
  if (MEM.lock) return;
  if (el.classList.contains("open") || el.classList.contains("done")) return;
  el.classList.add("open");
  var kart = MEM.cards[i];
  if (kart) el.setAttribute("aria-label", "Açık kart: " + String(kart.face).replace(/<[^>]*>/g, ""));
  beep([520 + i * 20], 0.06);
  if (MEM.first < 0) { MEM.first = i; return; }
  var a = MEM.first, b = i; MEM.first = -1; MEM.moves++;
  $("#memMoves").textContent = "Hamle: " + MEM.moves;
  var ea = $('.mcard[data-i="' + a + '"]'), eb = el;
  if (MEM.cards[a].id === MEM.cards[b].id) {
    ea.classList.add("done"); eb.classList.add("done");
    MEM.found++; sndOk(); burst(40);
    speak(rand(PRAISE), 1.05);
    /* Kısa bir "bulundu" gösteriminden sonra kartlar kaybolur */
    setTimeout(function () { ea.classList.add("gone"); eb.classList.add("gone"); }, 520);
    setTimeout(function () {
      if (ea) ea.classList.add("off");
      if (eb) eb.classList.add("off");
    }, 1100);
    if (MEM.found === MEM.pairs) {
      clearInterval(MEM.timer);
      var sec = Math.floor((Date.now() - MEM.t0) / 1000);
      var stars = MEM.moves <= MEM.pairs + 4 ? 3 : (MEM.moves <= MEM.pairs * 2 ? 2 : 1);
      setTimeout(function () {
        celebrate({
          title: "Tüm eşleri buldun! 🎉", stars: stars, score: MEM.moves + " hamle · " + sec + " sn",
          sub: "Hafızan harika çalışıyor! 🧠", say: "Aferin! Tüm eşleri buldun.", againText: "🔄 Yeni Oyun"
        });
      }, 500);
    }
  } else {
    MEM.lock = true; sndNo();
    setTimeout(function () {
      ea.classList.remove("open"); eb.classList.remove("open"); MEM.lock = false;
      ea.setAttribute("aria-label", "Kapalı kart");
      eb.setAttribute("aria-label", "Kapalı kart");
    }, 850);
  }
}
/* =====================================================================
   13) OYUN 4 · CÜMLE KURMA
   ===================================================================== */
var SENT = { queue: [], target: [], built: [], idx: 0, total: 5, score: 0, lock: false };
function startSentence() {
  if (needMoreLetters()) return;
  /* AGENTS kural 5: 1. grupta cümle/metin yok. Cümleler 2. gruptan itibaren. */
  if (!cumlelerAcik()) {
    warning("Cümleler 2. grupta başlar 📖",
      "İlk grupta yalnızca ses, hece ve kelime çalışılır.<br>Cümle kurmak için öğretmen panelinden <b>2. grubu</b> ekleyin.");
    return;
  }
  var pool = poolSentences();
  if (!pool.length) {
    warning("Cümle kurulamıyor 🧩",
      "Seçili harflerle cümle oluşturulamadı.<br>Öğretmen panelinden yeni harfler ekleyerek cümle havuzunu büyütebilirsiniz.");
    return;
  }
  SENT.queue = []; SENT.total = clamp(S.count, 3, 12);
  var bag = shuffle(pool);
  for (var i = 0; i < SENT.total; i++) SENT.queue.push(bag[i % bag.length]);
  SENT.idx = 0; SENT.score = 0;
  showScreen("sent");
  nextSentence();
}
function nextSentence() {
  if (SENT.idx >= SENT.total) return finishSentence();
  SENT.lock = false; SENT.built = [];
  var s = SENT.queue[SENT.idx]; SENT.idx++;
  SENT.target = lower(s).replace(/[.!?]+$/, "").replace(/[,]/g, "").split(/\s+/).filter(Boolean);
  SENT.bank = shuffle(SENT.target.slice());
  $("#sentCount").textContent = SENT.idx + "/" + SENT.total;
  setHud("🧱 <span class='pts'>" + SENT.score + "</span> puan");
  renderSentence();
  speak(SENT.target.join(" "), 1);
}
function renderSentence() {
  var slots = $("#sentSlots"), bank = $("#sentBank");
  slots.classList.remove("ok", "no"); slots.innerHTML = "";
  if (!SENT.built.length) {
    slots.innerHTML = '<div class="hint" style="font-size:clamp(12px,2vh,18px)">👇 Aşağıdaki kelimelere sırayla dokun</div>';
  }
  SENT.built.forEach(function (w, i) {
    var b = document.createElement("button");
    b.className = "chip in" + (SENT.lock ? " used" : "");
    b.textContent = w;
    b.addEventListener("click", function () {
      if (SENT.lock) return;
      SENT.built.splice(i, 1); SENT.bank.push(w); renderSentence(); beep([420], 0.06);
    });
    slots.appendChild(b);
  });
  bank.innerHTML = "";
  SENT.bank.forEach(function (w, i) {
    var b = document.createElement("button");
    b.className = "chip";
    b.textContent = w;
    b.addEventListener("click", function () {
      if (SENT.lock) return;
      SENT.built.push(w); SENT.bank.splice(i, 1); beep([560], 0.06);
      renderSentence();
      if (SENT.built.length === SENT.target.length) checkSentence();
    });
    bank.appendChild(b);
  });
}
function checkSentence() {
  var ok = SENT.built.join(" ") === SENT.target.join(" ");
  var slots = $("#sentSlots");
  if (ok) {
    SENT.lock = true; SENT.score += 10;
    slots.classList.add("ok"); sndOk(); burst(90);
    var full = SENT.target.join(" ");
    full = full.charAt(0).toLocaleUpperCase("tr-TR") + full.slice(1) + ".";
    setHud("🧱 <span class='pts'>" + SENT.score + "</span> puan");
    speak(rand(PRAISE) + " " + full, 1);
    setTimeout(nextSentence, 1600);
  } else {
    slots.classList.add("no"); sndNo();
    speak(rand(RETRY), 1.05);
    $$(".chip", slots).forEach(function (c) { c.classList.add("shakeX"); });
    SENT.lock = true;
    setTimeout(function () {
      SENT.lock = false;
      SENT.bank = SENT.bank.concat(SENT.built); SENT.built = [];
      renderSentence();
    }, 900);
  }
}
function finishSentence() {
  var stars = SENT.score >= SENT.total * 10 ? 3 : (SENT.score >= SENT.total * 6 ? 2 : 1);
  if (drawnStudent) { var p = S.scores[drawnStudent] || 0; if (SENT.score > p) { S.scores[drawnStudent] = SENT.score; save(); } }
  celebrate({
    title: "Cümleler tamam! 🧱", stars: stars, score: SENT.score + " puan",
    sub: SENT.total + " cümle kurdun. Okuma bayramına hazırsın! 🎉",
    say: "Aferin! Cümleleri tamamladın.", againText: "🔄 Yeni Turlar"
  });
}

/* =====================================================================
   14) ÖĞRETMEN PANELİ
   ===================================================================== */
function refreshTopbar() {
  var L = poolLetters();
  $("#lettersMini").innerHTML = L.length ? L.map(function (l) { return "<b>" + l + "</b>"; }).join("") :
    '<b style="color:#c76">harf seçilmedi</b>';
  $("#btnSound").textContent = S.sound ? "🔊" : "🔇";
  $("#btnSound").classList.toggle("off", !S.sound);
  $("#menuSub").textContent = "Seçili harfler: " + (L.length ? L.join(", ") : "yok") +
    " · " + poolWords().length + " kelime · " +
    (cumlelerAcik() ? poolSentences().length + " cümle hazır" : "cümleler 2. gruptan sonra açılır");
  document.body.classList.toggle("hide-pics", !S.pics);
}
/* Kapsama özeti: resmî grup sırasına göre kümülatif harf setiyle üretilebilen
   kelime/hece/cümle sayıları. Öğretmen "hangi gruba kadar ne var?" sorusunu
   panelden görebilsin. */
function kapsamaYaz() {
  var box = $("#coverage"); if (!box) return;
  box.innerHTML = "";
  GROUPS.forEach(function (g, i) {
    var set = [], k;
    for (k = 0; k <= i; k++) set = set.concat(GROUPS[k].letters);
    var kelime = 0, cumle = 0, heceler = {};
    WORDS.forEach(function (o) {
      if (!V.harfUyar(set, o.w)) return;
      kelime++;
      hecele(o.w).forEach(function (h) { heceler[h] = 1; });
    });
    SENTENCES.forEach(function (s) { if (V.harfUyar(set, s)) cumle++; });
    var sp = document.createElement("span");
    sp.textContent = g.no + ". grup sonunda: " + kelime + " kelime · " +
      Object.keys(heceler).length + " hece · " + (i === 0 ? "cümle yok" : cumle + " cümle");
    box.appendChild(sp);
  });
}

function refreshPanel() {
  var box = $("#letterBox"); box.innerHTML = "";
  GROUPS.forEach(function (g) {
    var row = document.createElement("div");
    row.className = "chips"; row.style.marginBottom = "6px";
    var lab = document.createElement("span"); lab.className = "glabel";
    lab.textContent = g.no + ". Grup"; row.appendChild(lab);
    g.letters.forEach(function (l) {
      var b = document.createElement("button");
      b.className = "chiplet" + (S.letters.indexOf(l) > -1 ? " on" : "");
      b.textContent = l;
      b.addEventListener("click", function () {
        var i = S.letters.indexOf(l);
        if (i > -1) { if (S.letters.length <= 1) return toast("En az bir harf seçili kalmalı."); S.letters.splice(i, 1); }
        else S.letters.push(l);
        save(); refreshPanel(); refreshTopbar();
      });
      row.appendChild(b);
    });
    var all = document.createElement("button");
    all.className = "pill"; all.textContent = "tümü";
    all.addEventListener("click", function () {
      var has = g.letters.every(function (l) { return S.letters.indexOf(l) > -1; });
      g.letters.forEach(function (l) {
        var i = S.letters.indexOf(l);
        if (has) { if (S.letters.length > 1) S.letters.splice(i, 1); }
        else if (i < 0) S.letters.push(l);
      });
      save(); refreshPanel(); refreshTopbar();
    });
    row.appendChild(all);
    box.appendChild(row);
  });
  var quick = document.createElement("div");
  quick.className = "chips"; quick.style.marginTop = "4px";
  [["Tümü", null], ["Temizle", "clear"], ["1-2. Grup", [1, 2]], ["1-3. Grup", [1, 2, 3]]].forEach(function (p) {
    var b = document.createElement("button"); b.className = "pill"; b.textContent = p[0];
    b.addEventListener("click", function () {
      if (p[1] === null) S.letters = GROUPS.reduce(function (a, g) { return a.concat(g.letters); }, []);
      else if (p[1] === "clear") S.letters = poolLetters().length > 1 ? [poolLetters()[0]] : S.letters.slice(0, 1);
      else S.letters = GROUPS.filter(function (g) { return p[1].indexOf(g.no) > -1; })
        .reduce(function (a, g) { return a.concat(g.letters); }, []);
      if (!S.letters.length) S.letters = ["a"];
      save(); refreshPanel(); refreshTopbar();
    });
    quick.appendChild(b);
  });
  box.appendChild(quick);

  var tb = $("#typeBox"); tb.innerHTML = "";
  [["harf", "🔤 Harf sesleri"], ["ilkses", "👂 İlk harf"], ["hece", "🔈 Hece okuma"],
   ["resim", "🖼️ Resim → kelime"], ["kelime", "👂 Kelime → resim"], ["eksik", "✏️ Eksik harf"]].forEach(function (t) {
    var b = document.createElement("button");
    b.className = "pill" + (S.types[t[0]] ? " on" : "");
    b.textContent = t[1];
    b.addEventListener("click", function () {
      S.types[t[0]] = !S.types[t[0]];
      if (!Object.keys(S.types).some(function (k) { return S.types[k]; })) S.types.harf = true;
      save(); refreshPanel();
    });
    tb.appendChild(b);
  });

  function pillRow(el, values, cur, setter) {
    el.innerHTML = "";
    values.forEach(function (v) {
      var b = document.createElement("button");
      b.className = "pill" + (String(cur) === String(v[0]) ? " on" : "");
      b.textContent = v[1];
      b.addEventListener("click", function () { setter(v[0]); save(); refreshPanel(); refreshTopbar(); });
      el.appendChild(b);
    });
  }
  pillRow($("#countBox"), [[5, "5 soru"], [10, "10 soru"], [15, "15 soru"], [20, "20 soru"]], S.count, function (v) { S.count = v; });
  pillRow($("#speedBox"), [["slow", "🐌 Yavaş"], ["normal", "🚶 Normal"], ["fast", "🚀 Hızlı"]], S.speed, function (v) { S.speed = v; });
  pillRow($("#targetBox"), [[5, "5 puan"], [10, "10 puan"], [15, "15 puan"]], S.raceTarget, function (v) { S.raceTarget = v; });

  $("#tgSound").classList.toggle("on", S.sound);
  $("#tgVoice").classList.toggle("on", S.voice);
  $("#tgPics").classList.toggle("on", S.pics);
  $("#tgTips").classList.toggle("on", S.tips);
  $("#ttsHint").innerHTML = "Konuşma sesi tarayıcının Türkçe sesiyle çalışır. <b>Harf sesleri harf adıyla değil, sesin kendisiyle</b> verilir (kayıtlı fonem → ses sentezi → ünlüde TTS). Ses duyulmuyorsa cihazın Türkçe ses paketini kontrol edin; oyun ses olmadan da soruları yazarak sürdürür.";
  $("#studentsTa").value = S.students || "";
  var list = studentList();
  $("#stuInfo").innerHTML = list.length ? list.length + " öğrenci kayıtlı · bu turda " +
    (S.usedDraw || []).filter(function (n) { return list.indexOf(n) > -1; }).length + " öğrenci sıra aldı." :
    "Henüz öğrenci eklenmedi.";
  var counts = $("#counts");
  counts.innerHTML = "<span>📚 " + poolWords().length + " kelime</span><span>🔈 " + poolSyllables().length +
    " hece</span><span>🧱 " + (cumlelerAcik() ? poolSentences().length + " cümle" : "cümle: 2. gruptan sonra") + "</span><span>🔤 " + poolLetters().length + " harf</span>";
  var sc = $("#scoreBox"); sc.innerHTML = "";
  var names = Object.keys(S.scores || {});
  if (!names.length) sc.innerHTML = "<span>Henüz kayıtlı başarı yok 🌱</span>";
  else names.sort(function (a, b) { return S.scores[b] - S.scores[a]; }).forEach(function (n) {
    sc.appendChild(Object.assign(document.createElement("span"), { textContent: "🏅 " + n + ": " + S.scores[n] }));
  });
  kapsamaYaz();
}
function goHome() {
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { }
  clearInterval(MEM.timer); clearTimeout(RACE.timer); clearTimeout(FLY.timed);
  FLY.lock = true; FLY.gen++; RACE.lock = true; SENT.lock = true;
  closeWin(); showOv("ov-draw", false); showOv("ov-race", false);
  showScreen("menu"); setHud(""); refreshTopbar();
}

/* =====================================================================
   15) OLAY BAĞLANTILARI
   ===================================================================== */
$$(".gamecard").forEach(function (c) {
  c.addEventListener("click", function () {
    var g = c.dataset.game;
    if (g === "quiz") { LAST = "quiz"; startQuiz(drawnStudent); }
    else if (g === "race") { LAST = "race"; openRaceSetup(); }
    else if (g === "mem") { LAST = "mem"; buildMemory(); }
    else if (g === "sent") { LAST = "sent"; startSentence(); }
  });
});
var LAST = "quiz";
$("#quizBack").addEventListener("click", goHome);
$("#memBack").addEventListener("click", goHome);
$("#sentBack").addEventListener("click", goHome);
$("#btnHome").addEventListener("click", goHome);
$("#quizSay").addEventListener("click", function () { if (FLY.item) speak(FLY.item.t, 1); });
$("#quizNext").addEventListener("click", function () { readDone(); });
$("#raceSay").addEventListener("click", function () { soruyuDuyur(RACE.q); });
$("#sentSay").addEventListener("click", function () { speak(SENT.target.join(" "), 1); });
$("#menuDraw").addEventListener("click", function () { openDraw(true); });
$("#btnDraw").addEventListener("click", function () { openDraw(true); });
$("#btnPanel").addEventListener("click", openPanel);
$("#panelClose").addEventListener("click", closePanel);
$("#drawAgain").addEventListener("click", spinRoulette);
$("#drawClose").addEventListener("click", function () { showOv("ov-draw", false); });
$("#drawStart").addEventListener("click", function () {
  showOv("ov-draw", false); LAST = "quiz"; startQuiz(drawnStudent);
});
$("#raceGo").addEventListener("click", startRace);
$("#raceCancel").addEventListener("click", function () { showOv("ov-race", false); });
$("#memNew").addEventListener("click", buildMemory);
$("#winAgain").addEventListener("click", function () {
  closeWin();
  if (LAST === "race") startRace();
  else if (LAST === "mem") buildMemory();
  else if (LAST === "sent") startSentence();
  else startQuiz(FLY.student);
});
$("#winMenu").addEventListener("click", goHome);
$("#winDraw").addEventListener("click", function () { closeWin(); showScreen("menu"); setHud(""); openDraw(true); });
$("#warnPanel").addEventListener("click", function () { showOv("ov-warn", false); openPanel(); });
$("#warnClose").addEventListener("click", function () { showOv("ov-warn", false); });
$("#rotateOk").addEventListener("click", function () { $("#rotate").classList.remove("show"); });
$("#btnSound").addEventListener("click", function () {
  S.sound = !S.sound; save(); refreshTopbar(); refreshPanel();
  toast(S.sound ? "Ses açıldı 🔊" : "Ses kapatıldı 🔇");
  if (S.sound) speak("Ses açıldı", 1);
});
$("#btnFull").addEventListener("click", function () {
  var d = document;
  try {
    if (!d.fullscreenElement && !d.webkitFullscreenElement) {
      if (d.documentElement.requestFullscreen) d.documentElement.requestFullscreen();
      else if (d.documentElement.webkitRequestFullscreen) d.documentElement.webkitRequestFullscreen();
      else toast("Bu tarayıcı tam ekranı desteklemiyor.");
    } else {
      if (d.exitFullscreen) d.exitFullscreen();
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
    }
  } catch (e) { toast("Tam ekran açılamadı."); }
});
$("#tgSound").addEventListener("click", function () { S.sound = !S.sound; save(); refreshPanel(); refreshTopbar(); });
$("#tgVoice").addEventListener("click", function () { S.voice = !S.voice; save(); refreshPanel(); if (S.voice) speak("Konuşma sesi açık", 1); });
$("#tgPics").addEventListener("click", function () { S.pics = !S.pics; save(); refreshPanel(); refreshTopbar(); });
$("#tgTips").addEventListener("click", function () { S.tips = !S.tips; save(); refreshPanel(); });
$("#stuSave").addEventListener("click", function () {
  S.students = $("#studentsTa").value; S.usedDraw = []; save();
  refreshPanel(); toast("Sınıf listesi kaydedildi ✅ (" + studentList().length + " öğrenci)");
});
$("#stuSort").addEventListener("click", function () {
  var l = studentList().sort(function (a, b) { return a.localeCompare(b, "tr"); });
  S.students = l.join("\n"); save(); refreshPanel();
});
$("#stuDrawReset").addEventListener("click", function () {
  S.usedDraw = []; save(); refreshPanel(); toast("Kura sırası sıfırlandı 🎲");
});
$("#scoreReset").addEventListener("click", function () { S.scores = {}; save(); refreshPanel(); toast("Skorlar sıfırlandı 🧹"); });
$("#allReset").addEventListener("click", function () {
  S = JSON.parse(JSON.stringify(DEF)); save(); refreshPanel(); refreshTopbar(); toast("Tüm ayarlar sıfırlandı ♻️");
});

/* Yedek: ayarlar + sınıf listesi + başarılar. İçerik kanonik dosyadan gelir. */
function yedekIndir() {
  try {
    var paket = { uygulama: "okuma-bayrami", surum: 1, tarih: new Date().toISOString(), ayarlar: S };
    var blob = new Blob([JSON.stringify(paket, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var d = new Date();
    a.href = url;
    a.download = "okuma-bayrami-ayarlar-" + d.getFullYear() + "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + ".json";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); if (a.parentNode) a.remove(); }, 1500);
    toast("Ayarlar indirildi ⬇️");
  } catch (e) { toast("Yedek indirilemedi."); }
}
function yedekUygula(a) {
  if (!a || typeof a !== "object") throw new Error("boş yedek");
  var yeni = JSON.parse(JSON.stringify(DEF));
  if (Array.isArray(a.letters)) {
    var gecerli = a.letters.filter(function (l) { return TR_ALPHA.indexOf(l) > -1; });
    if (gecerli.length) yeni.letters = gecerli;
  }
  if (a.types && typeof a.types === "object") {
    Object.keys(DEF.types).forEach(function (k) { if (typeof a.types[k] === "boolean") yeni.types[k] = a.types[k]; });
  }
  if (typeof a.students === "string") yeni.students = a.students;
  if ([5, 10, 15, 20].indexOf(a.count) > -1) yeni.count = a.count;
  if (["slow", "normal", "fast"].indexOf(a.speed) > -1) yeni.speed = a.speed;
  if ([5, 10, 15].indexOf(a.raceTarget) > -1) yeni.raceTarget = a.raceTarget;
  if (["harf", "buyuk", "hece", "birles"].indexOf(a.memMode) > -1) yeni.memMode = a.memMode;
  ["sound", "voice", "pics", "tips"].forEach(function (k) { if (typeof a[k] === "boolean") yeni[k] = a[k]; });
  if (Array.isArray(a.usedDraw)) {
    yeni.usedDraw = a.usedDraw.filter(function (n) { return typeof n === "string"; });
  }
  if (a.scores && typeof a.scores === "object") {
    Object.keys(a.scores).forEach(function (n) {
      if (typeof a.scores[n] === "number" && isFinite(a.scores[n])) yeni.scores[n] = a.scores[n];
    });
  }
  S = yeni; save(); refreshPanel(); refreshTopbar();
}
$("#backupSave").addEventListener("click", yedekIndir);
$("#backupLoad").addEventListener("click", function () { $("#backupFile").click(); });
$("#backupFile").addEventListener("change", function () {
  var girdi = this, dosya = girdi.files && girdi.files[0];
  if (!dosya) return;
  var okuyucu = new FileReader();
  okuyucu.onload = function () {
    try {
      var j = JSON.parse(String(okuyucu.result));
      yedekUygula(j && j.ayarlar ? j.ayarlar : j);
      toast("Yedek yüklendi ✅");
    } catch (e) {
      toast("Dosya okunamadı: geçerli bir yedek değil.");
    } finally {
      girdi.value = "";
    }
  };
  okuyucu.onerror = function () { girdi.value = ""; toast("Dosya okunamadı."); };
  okuyucu.readAsText(dosya);
});
document.addEventListener("contextmenu", function (e) { if (!/INPUT|TEXTAREA/.test(e.target.tagName)) e.preventDefault(); });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") { closePanel(); showOv("ov-draw", false); showOv("ov-race", false); showOv("ov-warn", false); }
});

/* =====================================================================
   16) BAŞLAT
   ===================================================================== */
function boot() {
  if (window.matchMedia("(orientation: portrait) and (max-width:860px)").matches && S.tips) $("#rotate").classList.add("show");
  refreshPanel(); refreshTopbar(); showScreen("menu");
  if (!("speechSynthesis" in window)) toast("Bu tarayıcı konuşma sesini desteklemiyor. Sorular yazıyla gösterilecek.", 4200);
}
boot();

