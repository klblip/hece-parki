/* =====================================================================
   2) MÜFREDAT · KANONİK VERİ ADAPTÖRÜ
   Tek kaynak: assets/veri.js → window.OrtakVeri
   Burada veri ÜRETİLMEZ; yalnızca okuma-bayrami'nin beklediği kısa
   adlara bağlanır. Harf sırası, grup içerikleri ve heceleme kuralı
   böylece bütün projede aynı kalır.
   ===================================================================== */
"use strict";

var V = window.OrtakVeri;

if (!V) {
  throw new Error("OrtakVeri yüklenmedi: assets/veri.js bu dosyadan önce çağrılmalı.");
}

/* 5 resmî grup — letters dizisi kopyalanır ki bu sayfa ona yazmasın */
var GROUPS = V.GROUPS.map(function (g) {
  return { no: g.no, id: g.id, ad: g.ad, letters: g.letters.slice() };
});

var TR_ALPHA = V.ALFABE.join("");

/* Kelime bankası: { w: kelime, e: emoji, g: ilk okunabildiği grup } */
var WORDS = V.SOZLUK.map(function (o) { return { w: o.w, e: o.e, g: o.g }; });

/* Cümle bankası: düz metin (ilk harf büyük, noktalama var) */
var SENTENCES = V.TUM_CUMLELER.slice();

/* Heceleme kuralı tek yerde: assets/veri.js */
function hecele(w) { return V.hecele(w); }
function heceSirala(liste) { return V.heceSirala(liste); }
