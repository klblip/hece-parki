# Kayıtlı ses seti — kayıt ve dosya kuralları

## Amaç
Harf adıyla ses öğretmemek. Her fonem, o sesin kendisi olarak kaydedilir.
TTS yalnızca yedektir; arayüzde "TTS" etiketiyle belirtilir.

## Dosya adları
- Fonem: `assets/sesler/fonem/<harf>.mp3` — örn. `a.mp3`, `n.mp3`, `ş.mp3`
- Hece: `assets/sesler/hece/<hece>.mp3` — örn. `an.mp3`, `na.mp3`
- Kelime: `assets/sesler/kelime/<kelime>.mp3` — örn. `anne.mp3`

`ğ` için başta kayıt yoktur; yalnızca hece/kelime içinde kaydedilir.

## Teknik
- Format: MP3, 44.1 kHz, mono, 96–128 kbps
- Süre: fonem 250–500 ms; hece 400–700 ms; kelime 600–1200 ms
- Baş/son sessizlik: 80–120 ms
- Tepe: -3 dBFS; hedef ses yüksekliği: -16 LUFS
- Gürültü tabanı: < -50 dBFS

## Kayıt yönergesi
1. Fonem kaydı: harf adı değil, ses. Örn. `n` için "ne" değil, "n" sesi.
2. Patlamalı seslerde (p, t, k, b, d, g, c, ç) gereksiz ünlü eklemeyin.
3. `ğ` yalnızca hece/kelime içinde; başta kullanılmaz.
4. Her kayıt aynı mikrofon, aynı mesafe, aynı oda.
5. Kayıttan sonra `manifest.js` içine yolu ekleyin.

## Manifest örneği
```js
window.ORTAK_SES_KAYITLARI = {
  fonem: { "a": "assets/sesler/fonem/a.mp3", "n": "assets/sesler/fonem/n.mp3" },
  hece:  { "an": "assets/sesler/hece/an.mp3", "na": "assets/sesler/hece/na.mp3" },
  kelime:{ "anne": "assets/sesler/kelime/anne.mp3" }
};
```

## Test
`test/test.html` içinde "Ses manifesti" bölümü, manifestteki her yolun
dosya olarak var olup olmadığını listeler. Dosya yoksa TTS yedeği devreye girer.
