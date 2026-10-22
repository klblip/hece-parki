/* Okuyorum — Ses Grubu Verisi
   Kanonik kaynak: ../assets/veri.js (window.OrtakVeri)
   Bu dosya yalnızca uygulamanın beklediği globalleri üretir. */
"use strict";

const V = window.OrtakVeri;
if (!V) throw new Error("OrtakVeri yüklenmedi: assets/veri.js");
const GRUPLAR = V.GRUPLAR;
const UNLU = V.SESLI;

/* ---------- kayıt (puan + aşama seçimi + içerik düzenlemeleri) ---------- */
const ANAHTAR = "okuyorum_v1";
let kayit = { puan: 0, secim: {}, icerik: {}, kilit: null, skorlar: [], sonAd: "", ogrListe: [], ozene: true };
function kayitYuk() {
  try {
    const raw = localStorage.getItem(ANAHTAR);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") {
        kayit.puan = (typeof o.puan === "number") ? o.puan : 0;
        kayit.secim = (o.secim && typeof o.secim === "object") ? o.secim : {};
        kayit.icerik = (o.icerik && typeof o.icerik === "object") ? o.icerik : {};
        kayit.kilit = (typeof o.kilit === "number" && o.kilit >= 0 && o.kilit < GRUPLAR.length) ? o.kilit : null;
        kayit.skorlar = (o.skorlar && Array.isArray(o.skorlar)) ? o.skorlar.filter(s => s && typeof s.puan === "number").slice(0, 20) : [];
        kayit.sonAd = (typeof o.sonAd === "string") ? o.sonAd : "";
        kayit.ogrListe = (o.ogrListe && Array.isArray(o.ogrListe)) ? o.ogrListe.filter(x => typeof x === "string" && x.trim()).map(x => x.trim()).slice(0, 60) : [];
        kayit.ozene = (typeof o.ozene === "boolean") ? o.ozene : true;
        kayit.heceMod = (o.heceMod === "kolay" || o.heceMod === "normal") ? o.heceMod : kayit.heceMod;
        kayit.hafizaMod = (typeof o.hafizaMod === "string") ? o.hafizaMod : kayit.hafizaMod;
        kayit.hafizaSkor = (o.hafizaSkor && Array.isArray(o.hafizaSkor)) ? o.hafizaSkor.filter(s => s && typeof s.ad === "string" && typeof s.puan === "number").slice(0, 10) : kayit.hafizaSkor;
      }
    }
  } catch (e) { }
}
function kayitYaz() { try { localStorage.setItem(ANAHTAR, JSON.stringify(kayit)); } catch (e) { } }
kayitYuk();

/* içerik düzenlemelerini varsayılan verinin üzerinden uygula */
const VARSAYILAN = GRUPLAR.map(g => ({ id: g.id, kelimeler: g.kelimeler.slice(), cumleler: g.cumleler.slice() }));
function icerikUygula() {
  GRUPLAR.forEach(g => {
    const d = VARSAYILAN.find(v => v.id === g.id);
    const ic = (kayit.icerik || {})[g.id];
    g.kelimeler = (ic && ic.kelimeler && ic.kelimeler.length) ? ic.kelimeler.slice() : d.kelimeler.slice();
    g.cumleler = (ic && ic.cumleler && ic.cumleler.length) ? ic.cumleler.slice() : d.cumleler.slice();
  });
}
icerikUygula();

/* ---------- yardımcılar ---------- */
function harfUyar(harfSeti, sozcuk) { return V.harfUyar(harfSeti, sozcuk); }
function hecele(w) { return V.hecele(w); }
function heceTuru(h) { return V.heceTuru(h); }
function heceSirala(liste) { return V.heceSirala(liste); }

/* aşama: grubun hangi harfine kadar öğrenildi (önceki grupların harfleri de dahil — kümülatif) */
function secimIndex(g) {
  const s = kayit.secim[g.id];
  return (typeof s === "number" && s >= 0 && s < g.harfler.length) ? s : g.harfler.length - 1;
}
function izinliHarfler(g, kacIdx) {
  const gi = GRUPLAR.indexOf(g);
  return V.izinliHarfler(gi, (typeof kacIdx === "number") ? kacIdx : secimIndex(g));
}
function haftanane(gi) { /* etkinliklerde grup nesnesi */ return GRUPLAR[gi]; }

/* aşamaya göre süzülmüş havuzlar — BOŞSA BOŞ DÖNER (fallback yok) */
function izinliKelimeler(g) {
  const set = izinliHarfler(g);
  const gi = GRUPLAR.indexOf(g);
  const hav = g.tum ? GRUPLAR[5].kelimeler : kelimeHavuzu(gi);
  return hav.filter(w => harfUyar(set, w));
}
function izinliCumleler(g) {
  const set = izinliHarfler(g);
  const gi = GRUPLAR.indexOf(g);
  const hav = g.tum ? GRUPLAR[5].cumleler : cumleHavuzu(gi);
  return hav.filter(c => harfUyar(set, c));
}
function izinliHeceHavuzu(g) {
  const sy = new Set();
  izinliKelimeler(g).forEach(w => hecele(w).forEach(s => sy.add(s)));
  return heceSirala([...sy]);
}
/* kümülatif havuzlar (gruba kadar) */
function kelimeHavuzu(gi) {
  const out = [];
  for (let i = 0; i <= gi; i++) GRUPLAR[i].kelimeler.forEach(w => { if (!out.includes(w)) out.push(w); });
  return out;
}
function cumleHavuzu(gi) {
  const out = [];
  for (let i = 0; i <= gi; i++) GRUPLAR[i].cumleler.forEach(c => { if (!out.includes(c)) out.push(c); });
  return out;
}
/* yönetici paneli için aşama kapsama özeti */
function kapsamaOzeti(g) {
  const gi = GRUPLAR.indexOf(g);
  return g.harfler.map((h, hi) => {
    const set = izinliHarfler(g, hi);
    const uy = (g.tum ? GRUPLAR[5].kelimeler : kelimeHavuzu(gi)).filter(w => harfUyar(set, w));
    return {
      indeks: hi, harf: h, harfler: set.join("·"),
      adet: uy.length,
      kelimeler: uy.join(", "),
      heceAdet: uy.reduce((a, w) => a + hecele(w).length, 0)
    };
  });
}

/* ---------- etkinlik listesi ---------- */
const ETKINLIK = [
  { id: "harftanima", ad: "Harfi Tanı", ico: "🔤", gerek: "harf" },
  { id: "baloncuk", ad: "Balonu Patlat", ico: "🎈", gerek: "harf" },
  { id: "heceSay", ad: "Kaç Hece?", ico: "🔢", gerek: "kelime" },
  { id: "eksikharf", ad: "Eksik Harfi Bul", ico: "🧩", gerek: "kelime" },
  { id: "harfAvi", ad: "Harf Avı", ico: "🔍", gerek: "kelime" },
  { id: "heceTreni", ad: "Hece Treni", ico: "🚂", gerek: "kelime" },
  { id: "heceBina", ad: "Hece Fabrikası", ico: "🏭", gerek: "kelime" },
  { id: "metinOkuma", ad: "Metin Oku", ico: "📖", gerek: "cumle" },
  { id: "cumleKur", ad: "Cümle Kur", ico: "🧺", gerek: "cumle" },
  { id: "zamanaKarsi", ad: "Zamana Karşı", ico: "⏱️", gerek: "kelime" },
  { id: "kelimeKasasi", ad: "Kelime Kasası", ico: "🕵️", gerek: "kelime" },
  { id: "sesliDikte", ad: "Sesli Dikte", ico: "✏️", gerek: "kelime" },
  { id: "kumHavuzu", ad: "Kum Havuzu", ico: "🏖️", gerek: "harf" },
  { id: "halatCekme", ad: "Halat Çekme (2 Kişi)", ico: "🤝", gerek: "kelime" },
  { id: "tavsanYarisi", ad: "Tavşan Yarışı", ico: "🐰", gerek: "kelime" },
  { id: "roket", ad: "Roket Yarışı (3 Kişi)", ico: "🚀", gerek: "kelime" },
  { id: "yazOynat", ad: "Yaz Oynat", ico: "🎨", gerek: "harf" },
  { id: "hafiza", ad: "Hafıza Kartları", ico: "🃏", gerek: "harf" }
];

/* ---------- etkinlik talimatları ---------- */
const TALIMAT = {
  harftanima: "Duyduğun sesi bul. Dinlemek için 🔊 dokun.",
  baloncuk: "Harf, hece veya kelime balonu seç. Duyduğun balonu patlat!",
  heceSay: "Kelimeyi dinle, kaç heceli? Say ve düğmeye dokun.",
  eksikharf: "Kelimenin eksik harfini bul, doğru harfe dokun.",
  harfAvi: "Duyduğun ses hangi kelimede? Dinle ve doğru kelimeyi bul.",
  heceTreni: "Hece vagonlarını sıraya diz, kelimeyi tamamla!",
  heceBina: "Resme bak! Hece parçalarını sırayla makineye ver, kelimeyi birleştir.",
  metinOkuma: "Cümleyi dinle, benimle birlikte oku.",
  cumleKur: "Cümleyi dinle, sözcüklere sırayla dokunup cümleyi kur!",
  zamanaKarsi: "Süreye karşı! Duyduğun kelimeyi hızlıca bul.",
  kelimeKasasi: "Kelimeyi dinle, şifre harflerine sırayla dokun ve kasayı aç!",
  sesliDikte: "Kelimeyi iyi dinle, harf tuşlarıyla deftere yaz, \"✓ Yaz\"e bas!",
  kumHavuzu: "Kumun üzerine harfi parmağınla yaz.",
  halatCekme: "Sırayla soruları çözün, halatı tarafınıza çekin!",
  tavsanYarisi: "Doğru cevap tavşanı ilerletir. Kaplumbağayı geçebilir misin?",
  roket: "Sıranız gelince kelimeyi dinleyin, doğru kelimeye dokunun — roketiniz yıldıza ulaşır!",
  yazOynat: "Ekrana istediğini çiz, kaydet ve oynat!",
  hafiza: "Kartları çevir, eşini bul! Harf–kelime, hece–hece ya da kelime–resim."
};
