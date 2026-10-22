/* =====================================================================
   1) YARDIMCI FONKSİYONLAR
   Klasik <script> olarak yüklenir (file:// uyumlu). Sayfa genelinde
   $, $$, rnd, rand, shuffle, clamp, lower, html kullanılabilir.
   ===================================================================== */
"use strict";

var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var rnd = function (n) { return Math.floor(Math.random() * n); };
var rand = function (a) { return a[rnd(a.length)]; };
function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
function lower(s) { return String(s).toLocaleLowerCase("tr-TR"); }
function upper(s) { return String(s).toLocaleUpperCase("tr-TR"); }
function html(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
  });
}
