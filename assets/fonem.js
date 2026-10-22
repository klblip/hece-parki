/* =====================================================================
   FONEM SESLETİCİ — ortak
   Harf ADI değil, sesin kendisi. Sessiz harfler WebAudio ile
   sentezlenir; ünlüler çağıran sayfada TTS ile söylenir.
   Kullanım: Fonem.sentez("k") → true (ses üretildi) / false (tanınmadı)
   ===================================================================== */
(function (global) {
  "use strict";

  var SESLI = "aeıioöuü";
  var ac = null;

  function baglam() {
    if (ac) {
      if (ac.state === "suspended") { try { ac.resume(); } catch (e) { } }
      return ac;
    }
    try {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      return ac;
    } catch (e) { return null; }
  }

  /* Sessiz harfin ağızdan çıktığı gibi üretimi. */
  function sentez(harf) {
    var h = String(harf || "").toLocaleLowerCase("tr-TR").charAt(0);
    if (!h || SESLI.indexOf(h) > -1) return false;
    var c = baglam();
    if (!c) return false;

    function gurultu(sure, ses, fc, gecikme) {
      var n = Math.max(1, Math.floor(c.sampleRate * sure));
      var buf = c.createBuffer(1, n, c.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      var kaynak = c.createBufferSource(); kaynak.buffer = buf;
      var bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = fc; bp.Q.value = 1.2;
      var g = c.createGain();
      var t0 = c.currentTime + (gecikme || 0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(ses, t0 + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + sure);
      kaynak.connect(bp); bp.connect(g); g.connect(c.destination);
      kaynak.start(t0); kaynak.stop(t0 + sure + 0.05);
    }
    function ugultu(f, sure, gecikme, ses, lof) {
      var o = c.createOscillator(); o.type = "sawtooth"; o.frequency.value = f;
      var lo = c.createBiquadFilter(); lo.type = "lowpass"; lo.frequency.value = lof || 600;
      var g = c.createGain();
      var t0 = c.currentTime + (gecikme || 0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(ses || 0.18, t0 + 0.04);
      g.gain.linearRampToValueAtTime(0.0001, t0 + sure);
      o.connect(lo); lo.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + sure + 0.05);
    }

    switch (h) {
      case "p": gurultu(0.06, 0.50, 700); return true;
      case "b": ugultu(110, 0.09); gurultu(0.05, 0.30, 600, 0.02); return true;
      case "t": gurultu(0.05, 0.55, 4500); return true;
      case "d": ugultu(120, 0.08); gurultu(0.05, 0.35, 4000, 0.02); return true;
      case "k": gurultu(0.07, 0.50, 2800); return true;
      case "g": ugultu(115, 0.09); gurultu(0.07, 0.35, 2500, 0.02); return true;
      case "f": gurultu(0.16, 0.25, 5000); return true;
      case "v": ugultu(110, 0.16); gurultu(0.16, 0.12, 3500, 0.02); return true;
      case "s": gurultu(0.16, 0.30, 7500); return true;
      case "z": ugultu(105, 0.16); gurultu(0.16, 0.15, 5000, 0.02); return true;
      case "ş": gurultu(0.16, 0.30, 3200); return true;
      case "j": ugultu(105, 0.16); gurultu(0.16, 0.15, 2200, 0.02); return true;
      case "ç": gurultu(0.04, 0.40, 4000); gurultu(0.12, 0.25, 3000, 0.05); return true;
      case "c": ugultu(115, 0.05); gurultu(0.12, 0.20, 2500, 0.02); return true;
      case "h": gurultu(0.16, 0.12, 1200); return true;
      case "m": ugultu(150, 0.20, 0, 0.20, 400); return true;
      case "n": ugultu(180, 0.20, 0, 0.20, 500); return true;
      case "l": ugultu(320, 0.18, 0, 0.20, 900); return true;
      case "r": ugultu(180, 0.18, 0, 0.22, 700); return true;
      case "y": ugultu(420, 0.14, 0, 0.18, 1500); return true;
      case "ğ": ugultu(140, 0.12, 0, 0.08, 300); return true;
    }
    return false;
  }

  function sesliMi(harf) {
    return SESLI.indexOf(String(harf || "").toLocaleLowerCase("tr-TR").charAt(0)) > -1;
  }

  global.Fonem = { sentez: sentez, sesliMi: sesliMi };
})(window);
