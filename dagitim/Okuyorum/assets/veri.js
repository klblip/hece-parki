/* =====================================================================
   ORTAK VERİ — 1. sınıf ilk okuma-yazma (TYMM 2026)
   Tek kaynak: harf grupları, kelime bankası, cümle bankası, heceleme.
   Çevrimdışı çalışır; ES modülü değildir (file:// uyumlu).
   ===================================================================== */
(function (global) {
  "use strict";

  /* 1) RESMÎ HARF GRUPLARI — 2026 İlkokul Türkçe Dersi Öğretim Programı */
  var GROUPS = [
    { no: 1, id: "anetil", ad: "ANETİL", renk: "#e74c3c", letters: ["a", "n", "e", "t", "i", "l"] },
    { no: 2, id: "okurim", ad: "OKURIM", renk: "#27ae60", letters: ["o", "k", "u", "r", "ı", "m"] },
    { no: 3, id: "usoydz", ad: "ÜSÖYDZ", renk: "#2980b9", letters: ["ü", "s", "ö", "y", "d", "z"] },
    { no: 4, id: "cbgcs", ad: "ÇBGCŞ", renk: "#8e44ad", letters: ["ç", "b", "g", "c", "ş"] },
    { no: 5, id: "phvfj", ad: "PHVĞFJ", renk: "#d35400", letters: ["p", "h", "v", "ğ", "f", "j"] }
  ];
  var SESLI = "aeıioöuü".split("");
  var ALFABE = "abcçdefgğhıijklmnoöprsştuüvyz".split("");

  /* 2) KELİME BANKASI — [kelime, emoji] ; emoji yoksa "" */
  var HAM_KELIMELER = [
    /* 1. grup (a,n,e,t,i,l) */
    ["ana", "👩"], ["anne", "👩‍🍼"], ["at", "🐴"], ["et", "🥩"], ["tel", "📞"],
    ["net", "🥅"], ["tane", "🔢"], ["lale", "🌷"], ["tat", "😋"], ["alet", "🧰"],
    ["atlet", "🏃"], ["anten", "📡"], ["nine", "👵"], ["nane", "🌿"], ["el", "✋"],
    ["aile", "👪"], ["ile", ""], ["ilan", "📢"], ["in", "🕳️"], ["tatil", "🧳"],
    ["atla", ""], ["anlat", ""], ["atlat", ""], ["inle", ""], ["elin", ""],
    ["lila", "🟣"], ["telli", ""],
    /* 2. grup (+ o,k,u,r,ı,m) */
    ["on", "🔟"], ["ok", "🏹"], ["oku", ""], ["okul", "🏫"], ["kol", "💪"],
    ["kor", "🔥"], ["un", "🌾"], ["otur", "🪑"], ["umut", ""], ["mutlu", "😄"],
    ["mini", ""], ["mor", "💜"], ["motor", "🏍️"], ["altın", "🪙"], ["kale", "🏰"],
    ["kule", "🗼"], ["arı", "🐝"], ["kar", "❄️"], ["limon", "🍋"], ["omlet", "🍳"],
    ["tren", "🚂"], ["martı", "🐦"], ["not", "📝"], ["kanat", ""], ["inek", "🐄"],
    ["kutu", "📦"], ["kural", ""], ["kumru", "🕊️"], ["mantar", "🍄"], ["kilit", "🔒"],
    ["terlik", "🩴"], ["kum", "🏖️"], ["mum", "🕯️"], ["kulak", "👂"], ["kurt", "🐺"],
    ["ırmak", "🏞️"], ["okur", ""], ["kuru", ""], ["ulu", ""],
    /* 3. grup (+ ü,s,ö,y,d,z) */
    ["süt", "🥛"], ["ses", "🔊"], ["ay", "🌙"], ["yol", "🛣️"], ["uyu", "😴"],
    ["oyun", "🎮"], ["yedi", "7️⃣"], ["düz", "📏"], ["diz", "🦵"], ["dede", "👴"],
    ["düdük", ""], ["söz", "💬"], ["yüz", "💯"], ["zil", "🔔"], ["tuz", "🧂"],
    ["iz", "👟"], ["deniz", "🌊"], ["özel", ""], ["üzüm", "🍇"], ["yaz", "🌞"],
    ["kaz", "🪿"], ["ördek", "🦆"], ["yıldız", "🌟"], ["dondurma", "🍦"], ["ütü", ""],
    ["örtü", ""], ["sürü", ""], ["dünya", "🌍"], ["yumurta", "🥚"], ["zar", "🎲"],
    ["dokuz", "9️⃣"], ["kuzu", "🐏"], ["zeytin", "🫒"], ["yıldırım", "⚡"], ["yüzük", "💍"],
    ["uydu", "🛰️"], ["müze", "🏛️"], ["ödül", "🏆"], ["saat", "⌚"], ["aslan", "🦁"],
    ["dedi", ""], ["dolu", ""], ["doldur", ""], ["uzun", ""],
    /* 4. grup (+ ç,b,g,c,ş) */
    ["uç", ""], ["aç", ""], ["iç", ""], ["bir", "1️⃣"], ["bal", "🍯"],
    ["bul", ""], ["bil", ""], ["bol", ""], ["baba", "👨"], ["babam", "👨"],
    ["abla", "👩"], ["boya", "🎨"], ["buz", "🧊"], ["gün", "🌞"], ["gece", "🌙"],
    ["gel", ""], ["gül", "🌹"], ["gölge", ""], ["çocuk", "🧒"], ["şu", ""],
    ["şeker", "🍬"], ["şimşek", "⚡"], ["şişe", "🍶"], ["güneş", "☀️"], ["başla", ""],
    ["yük", ""], ["geç", ""], ["çok", ""], ["aş", "🍲"], ["eş", ""],
    ["baş", ""], ["büyük", ""], ["güzel", ""], ["seç", ""], ["göz", "👁️"],
    ["çilek", "🍓"], ["balık", "🐟"], ["gözlük", "👓"], ["kuş", "🐦‍⬛"], ["çiçek", "🌸"],
    ["üç", "3️⃣"], ["beş", "5️⃣"], ["bulut", "☁️"], ["çorba", "🍲"], ["çay", "🍵"],
    ["gemi", "🚢"], ["böcek", "🐞"], ["keçi", "🐐"], ["çanta", "🎒"], ["bıçak", "🔪"],
    ["bebek", "👶"], ["çam", "🌲"], ["çikolata", "🍫"], ["ceket", "🧥"], ["çekirge", "🦗"],
    ["yengeç", "🦀"], ["balina", "🐋"], ["gitar", "🎸"], ["çekiç", "🔨"], ["uçak", "✈️"],
    ["kelebek", "🦋"], ["tavşan", "🐰"], ["örümcek", "🕷️"],
    /* 5. grup (+ p,h,v,ğ,f,j) */
    ["pul", ""], ["pil", "🔋"], ["puf", "💨"], ["hava", "⛅"], ["duvar", "🧱"],
    ["ağ", "🕸️"], ["ağla", "😢"], ["ufak", ""], ["fide", "🌱"], ["füze", "🚀"],
    ["judo", "🥋"], ["pazar", "🏪"], ["bahar", "🌸"], ["doğru", "✅"], ["ağaç", "🌳"],
    ["kitap", "📖"], ["havuç", "🥕"], ["fil", "🐘"], ["fare", "🐭"], ["pasta", "🍰"],
    ["portakal", "🍊"], ["patates", "🥔"], ["telefon", ""], ["penguen", "🐧"], ["vazo", "🏺"],
    ["dağ", "⛰️"], ["kuğu", "🦢"], ["yaprak", "🍃"], ["kaplan", "🐯"], ["horoz", "🐓"],
    ["peynir", "🧀"], ["fırça", "🖌️"], ["pijama", ""], ["fener", "🔦"], ["şapka", "🎩"],
    ["fotoğraf", "📷"], ["av", ""], ["hile", ""]
  ];

  /* 3) CÜMLE BANKASI — somut, doğal, kısa */
  var CUMLER = [
    "Anne, lale al.", "Ali, lale al.", "Ali, et al.", "Anne, et al.",
    "Nine, nane al.", "Lale, nane al.", "Ali, tel al.", "Anne, tel al.",
    "Nine, lale al.", "Lale, et al.",
    "Oku, Ali.", "Ali, otur.", "Anne, otur.", "Ali, un al.",
    "Anne, un al.", "Ali, kum al.", "Ali, okur.", "O, okur.",
    "Otur, oku.", "Ali, otur, oku.", "Anne, oku.", "O, otur.",
    "Ali, süt al.", "Anne, süt al.", "Dede, süt al.", "Dede, otur.",
    "Dede, oku.", "Yol uzun.", "Sus, Ali.", "Ali, sus.",
    "Dede, un al.", "Oyun oyna.", "Kuzu ot yedi.", "Elma yedim.",
    "Masayı temizledim.", "Ellerimi yıkadım.",
    "Güzel gün.", "Baba, gel.", "Çocuk, oku.", "Baba, bal al.",
    "Baba, buz al.", "Baba, gül al.", "Baba, çay al.", "Çocuk, gül.",
    "Baba, gül.", "Baba, çorba al.", "Çocuk, çorba iç.", "Bir güzel gün.",
    "Baba, bir gül al.", "Kedi süt içti.", "Kuş uçtu.", "Balık yüzdü.",
    "Ben elma yedim.", "Kedi balık yedi.", "Ayşe okula gitti.", "Kitabımı okudum.",
    "Çantamı aldım.", "Su içtim.", "Süt içtim.", "Açım.",
    "Çok mutluyum.", "Çok güldüm.", "Çok çalıştım.", "Çok güzel.",
    "Çok büyük.", "Çok küçük.", "Balonu şişirdim.", "Şarkı söyledim.",
    "Lambayı yaktım.", "Yorgunum.",
    "Hava güzel.", "Hava sıcak.", "Hava soğuk.", "Ağaç büyük.",
    "Ağaç uzun.", "Doğru yol uzun.", "Bir büyük ağaç.", "Babam pazara gitti.",
    "Annem pazara gitti.", "Fare peynir yedi.", "Ali topu attı.", "Anne pasta yaptı.",
    "Dede nane topladı.", "Mehmet okula gitti.", "Zeynep kitap okudu.", "Fatma çiçek aldı.",
    "Osman topu attı.", "Elif süt içti.", "Bugün hava güzel.", "Yarın okula gideceğim.",
    "Topumu attım.", "Resim yaptım.", "Dişimi fırçaladım.", "Parkta oynadım.",
    "Öğretmenimi dinledim.", "Pencereyi açtım.", "Kapıyı kapattım.", "Peynir yedim.",
    "Karpuz yedim.", "Portakal yedim.", "Çilek topladım.", "Gül topladım.",
    "Çiçek topladım.", "İp atladım.", "Koşu yaptım.", "Ağladım.",
    "Sevindim.", "Heyecanlıyım.", "Meraklıyım.", "Uykum var.",
    "Keyfim yerinde.", "Çok sevindim.", "Çok üzüldüm.", "Çok korktum.",
    "Çok yoruldum.", "Çok acıktım.", "Çok susadım.", "Çok uyudum.",
    "Çok ağladım.", "Çok konuştum.", "Çok düşündüm.", "Çok sevdim.",
    "Çok beğendim.", "Çok teşekkür ederim.", "Çok iyi.", "Çok kötü.",
    "Çok sıcak.", "Çok soğuk.", "Çok uzun.", "Çok kısa.",
    "Çok hızlı.", "Çok yavaş."
  ];

  /* 4) YARDIMCILAR */
  function kucult(s) {
    return String(s == null ? "" : s).toLocaleLowerCase("tr-TR");
  }
  function harfUyar(set, metin) {
    var s = kucult(metin);
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (ALFABE.indexOf(c) > -1 && set.indexOf(c) < 0) return false;
    }
    return true;
  }
  function hecele(w) {
    var s = kucult(w);
    if (!s) return [];
    var sesli = [];
    for (var i = 0; i < s.length; i++) if (SESLI.indexOf(s[i]) > -1) sesli.push(i);
    if (sesli.length <= 1) return [s];
    var out = [], start = 0;
    for (var v = 0; v < sesli.length - 1; v++) {
      var v1 = sesli[v], v2 = sesli[v + 1];
      var ara = s.slice(v1 + 1, v2);
      var kes;
      if (ara.length === 0) kes = v2;            /* a-i-le */
      else if (ara.length === 1) kes = v1 + 1;   /* a-na */
      else kes = v2 - 1;                         /* kal-em → ka-lem */
      out.push(s.slice(start, kes));
      start = kes;
    }
    out.push(s.slice(start));
    return out.filter(Boolean);
  }
  function heceTuru(hece) {
    var s = kucult(hece), son = s[s.length - 1];
    if (!son || SESLI.indexOf(son) < 0) return "kapali";
    return "acik";
  }
  function heceSirala(list) {
    return list.slice().sort(function (a, b) {
      var ta = heceTuru(a) === "kapali" ? 0 : 1;
      var tb = heceTuru(b) === "kapali" ? 0 : 1;
      return ta - tb || a.length - b.length || a.localeCompare(b, "tr");
    });
  }

  /* 5) KELİME/CÜMLE GRUPLARINI HESAPLA */
  var kumulatif = [];
  var harfSetleri = [];
  GROUPS.forEach(function (g, i) {
    kumulatif = kumulatif.concat(g.letters);
    harfSetleri[i] = kumulatif.slice();
  });
  function ilkGrup(metin) {
    for (var i = 0; i < harfSetleri.length; i++) {
      if (harfUyar(harfSetleri[i], metin)) return i + 1;
    }
    return 5;
  }

  var SOZLUK = [];
  var gorulen = {};
  HAM_KELIMELER.forEach(function (p) {
    var w = kucult(p[0]).trim();
    if (!w || gorulen[w]) return;
    gorulen[w] = true;
    SOZLUK.push({ w: w, e: p[1] || "", g: ilkGrup(w), heceler: hecele(w) });
  });

  var CUMLELER = [];
  var cumleGorulen = {};
  CUMLER.forEach(function (s) {
    var t = String(s).trim();
    if (!t || cumleGorulen[t]) return;
    cumleGorulen[t] = true;
    CUMLELER.push({ s: t, g: ilkGrup(t) });
  });

  /* 6) `uygulama` uyumlu GRUPLAR (TÜM SESLER dahil) */
  var GRUPLAR = GROUPS.map(function (g) {
    var kelimeler = SOZLUK.filter(function (o) { return o.g === g.no; }).map(function (o) { return o.w; });
    var cumleler = CUMLELER.filter(function (c) { return c.g === g.no; }).map(function (c) { return c.s; });
    var emoji = {};
    SOZLUK.forEach(function (o) { if (o.g === g.no && o.e) emoji[o.w] = o.e; });
    return {
      id: g.id, ad: g.ad, renk: g.renk, no: g.no,
      harfler: g.letters.slice(), kelimeler: kelimeler, cumleler: cumleler, emoji: emoji
    };
  });
  var tumHarfler = [];
  GROUPS.forEach(function (g) {
    g.letters.forEach(function (h) { if (tumHarfler.indexOf(h) < 0) tumHarfler.push(h); });
  });
  var tumKelimeler = SOZLUK.map(function (o) { return o.w; });
  var tumCumleler = CUMLELER.map(function (c) { return c.s; });
  var tumEmoji = {};
  SOZLUK.forEach(function (o) { if (o.e) tumEmoji[o.w] = o.e; });
  GRUPLAR.push({
    id: "tum", ad: "TÜM SESLER", renk: "#00897b", tum: true,
    harfler: tumHarfler, kelimeler: tumKelimeler.slice(), cumleler: tumCumleler.slice(), emoji: tumEmoji
  });

  /* 7) HAVUZLAR */
  function izinliHarfler(grupIndex, harfIndex) {
    var g = GRUPLAR[grupIndex];
    if (!g) return [];
    if (g.tum) return tumHarfler.slice();
    var onceki = GRUPLAR.slice(0, grupIndex).reduce(function (a, gg) {
      if (!gg.tum) a = a.concat(gg.harfler);
      return a;
    }, []);
    var k = (typeof harfIndex === "number") ? harfIndex : g.harfler.length - 1;
    g.harfler.slice(0, k + 1).forEach(function (h) { if (onceki.indexOf(h) < 0) onceki.push(h); });
    return onceki;
  }
  function kelimeHavuzu(grupIndex) {
    var out = [];
    for (var i = 0; i <= grupIndex && i < GRUPLAR.length; i++) {
      GRUPLAR[i].kelimeler.forEach(function (w) { if (out.indexOf(w) < 0) out.push(w); });
    }
    return out;
  }
  function cumleHavuzu(grupIndex) {
    var out = [];
    for (var i = 0; i <= grupIndex && i < GRUPLAR.length; i++) {
      GRUPLAR[i].cumleler.forEach(function (c) { if (out.indexOf(c) < 0) out.push(c); });
    }
    return out;
  }
  function izinliKelimeler(grupIndex, harfIndex) {
    var set = izinliHarfler(grupIndex, harfIndex);
    return kelimeHavuzu(grupIndex).filter(function (w) { return harfUyar(set, w); });
  }
  function izinliCumleler(grupIndex, harfIndex) {
    var set = izinliHarfler(grupIndex, harfIndex);
    return cumleHavuzu(grupIndex).filter(function (c) { return harfUyar(set, c); });
  }
  function heceHavuzu(grupIndex, harfIndex) {
    var out = [];
    izinliKelimeler(grupIndex, harfIndex).forEach(function (w) {
      hecele(w).forEach(function (h) { if (out.indexOf(h) < 0) out.push(h); });
    });
    return heceSirala(out);
  }

  /* 8) ÖRNEK KELİME (harfin sesini harf adıyla değil, kelimeyle duyurmak için) */
  var ORNEK_KELIME = {
    a: "ana", n: "nane", e: "el", t: "at", i: "il", l: "lale",
    o: "ok", k: "kal", u: "un", r: "kar", "ı": "ırmak", m: "mum",
    "ü": "ütü", s: "ses", "ö": "öz", y: "yol", d: "dede", z: "zil",
    "ç": "çay", b: "bal", g: "gül", c: "cam", "ş": "şu",
    p: "pil", h: "havuç", v: "vazo", "ğ": "dağ", f: "fil", j: "judo"
  };

  global.OrtakVeri = {
    GROUPS: GROUPS,
    GRUPLAR: GRUPLAR,
    SOZLUK: SOZLUK,
    CUMLELER: CUMLELER,
    SESLI: SESLI,
    ALFABE: ALFABE,
    TUM_HARFLER: tumHarfler,
    TUM_KELIMELER: tumKelimeler,
    TUM_CUMLELER: tumCumleler,
    ORNEK_KELIME: ORNEK_KELIME,
    kucult: kucult,
    harfUyar: harfUyar,
    hecele: hecele,
    heceTuru: heceTuru,
    heceSirala: heceSirala,
    ilkGrup: ilkGrup,
    izinliHarfler: izinliHarfler,
    izinliKelimeler: izinliKelimeler,
    izinliCumleler: izinliCumleler,
    kelimeHavuzu: kelimeHavuzu,
    cumleHavuzu: cumleHavuzu,
    heceHavuzu: heceHavuzu
  };
})(window);
