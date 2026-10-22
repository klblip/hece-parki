# Okuma Bayramı — Kullanım Kılavuzu

`okuma-bayrami-1-sinif.html` — 1. sınıf için dört okuma oyunu, öğretmen paneli ve
sıradaki öğrenci kurası. Tamamen çevrimdışı çalışır; veri, ses ve yazı tipi yerel
dosyalardan gelir.

## Açma

- `okuma-bayrami-1-sinif.html` dosyasına çift tıkla, **veya**
- yerel sunucu üzerinden `http://localhost:<port>/okuma-bayrami-1-sinif.html`.

Akıllı tahtada F11 ile tam ekran yapın. Sayfa sekiz ayrı yerel dosya yükler
(`assets/veri.js`, `assets/fonem.js`, `assets/sesler/manifest.js` ve
`okuma-bayrami/js/` altındaki beş modül); bu nedenle dosyaları tek tek taşımayın,
klasör yapısını koruyun.

## Ekran akışı

1. **Ana menü** — dört oyun kartı, üstte seçili harf özeti ve `🎯 Sıradaki Öğrenci`.
2. **Oyun ekranı** — soru, seçenekler, sayaç ve 🔊 tekrar dinle düğmesi.
3. **Tebrik ekranı** — puan/yıldız, `🔄 Tekrar Oyna`, `🎯 Sıradaki Öğrenci`, `🏠 Ana Menü`.

## Harf seçimi ve aşama kapısı

- Varsayılan seçim **1. grup**: `a n e t i l`.
- Yalnızca seçili harflerle yazılabilen kelimeler, o kelimelerin gerçek heceleri ve
  o harflerle kurulabilen cümleler üretilir. Öğretilmemiş harf oyuna **hiç girmez**.
- En az **2 harf** seçili olmalı; değilse oyun başlamaz ve panel yönlendirmesi çıkar.
- **Cümle Kurma 2. gruptan itibaren açılır.** 1. grupta cümle oyunu kapalıdır; kart
  ve panel sayacı bunu açıkça gösterir (AGENTS kural 5).
- Seçim, oyun sayısı, hız ve puanlar tarayıcıda (`localStorage`, anahtar
  `okuma_bayrami_v1`) saklanır.

## Oyunlar

### 🎈 Uçan Balon
Kutular baştan doludur ve içindeki harf/hece/kelime görünür. Balon rastgele bir
kutuya konar; çocuk o kutudakini **yüksek sesle okur**, sonra `✅ Okudum, Sıradaki`
düğmesine basar. Tüm kutular okununca yeni parçalar gelir. Kutular her turda yeniden
dolar; panelden soru sayısı seçilir (5/10/15/20, kutu sayısı 3–5). Doğru/yanlış ayrımı
yoktur — amaç **akıcı okuma**, ceza yoktur.

### 🐰 Tavşan Yarışı
Ekran ikiye ayrılır; aynı soru iki tarafa da sorulur. Doğru cevabı **ilk** veren
oyuncu puan alır ve kendi şeridinde ilerler. Hedef puan panelden seçilir (5/10/15).
İsimler sınıf listesinden veya serbest yazılarak girilir; karakterler seçilebilir.

### 🎴 Hafıza Kartları
Dört mod vardır (oyun içindeki çiplerden değiştirilir):

| Mod | Eşleşme |
|---|---|
| 🔤 Aynı harf | Aynı **küçük** harf |
| 🔠 Küçük – büyük | Küçük harf ↔ büyük harf |
| 🔈 Aynı hece | Aynı hece (iki kez) |
| 🧩 Hece + harfler | Hece ↔ heceyi oluşturan harfler |

6 çift, hamle ve süre sayacı. Harf modunda `ı` ile `l` karışmaması için ikisi aynı
desteye birlikte konmaz.

### 🧱 Cümle Kurma
Karışık kelime kartlarına sırayla dokunulur; cümle tamamlanınca sesli okunur.
Cümleler noktalama işaretlerinden arındırılarak eşleştirilir, yani `,` `.` `!` `?`
sıralamayı etkilemez. Beş cümlelik tur; **yalnızca 2. grup ve sonrasında** açılır.

## Soru tipleri (Uçan Balon ve Tavşan Yarışı)

| Tip | Soru | Görsel | Seçenekler |
|---|---|---|---|
| `harf` | Duyduğun sesin harfini bul | — | Harfler (ses **fonem** olarak verilir) |
| `ilkses` | Bu varlık hangi sesle başlıyor? | Yalnız emoji | Harfler |
| `hece` | Duyduğun heceyi bul | — | Gerçek kelimelerden gelen heceler |
| `resim` | Resmi doğru kelimeyle eşleştir | Emoji | Kelimeler |
| `kelime` | Duyduğun kelimeyi bul | — | Emoji + kelime |
| `eksik` | Eksik harfi tamamla | Maskeli kelime + emoji | Harfler |

Kurallar:

- Çeldiriciler rastgele değil, **benzer** seçeneklerden üretilir (ortak harf, aynı
  uzunluk, aynı baş/son harf) — böylece çocuk gerçekten ayrım yapmak zorunda kalır.
- `ilkses` sorusunda kelime **yazıyla gösterilmez**; yalnızca resim ve ses vardır
  (okuma değil, ilk ses farkındalığı).
- `resim` ve `kelime` soruları yalnızca **emojisi olan** kelimeleri kullanır; kelime
  ile resim birbirini tutar (AGENTS kural 7).
- `eksik` sorusunda eksik harf kelimenin herhangi bir yerinde olabilir (ilk harf
  dahil) ve tekrar eden harfler de sorulabilir.
- Hece havuzu uydurma harf dizisi içermez: yalnızca seçili kelimelerin gerçek
  heceleri; **kapalı heceler açık hecelerden önce** gelir.

## Ses

1. **Kayıtlı fonem** varsa (`assets/sesler/manifest.js`) o çalar.
2. Yoksa sessiz harf **WebAudio ile sentezlenir** (`assets/fonem.js`): p/t/k
   patlamaları, s/ş sürtünmeleri, m/n/l uğultuları.
3. Ünlü harfte harf adı = ses olduğu için TTS kullanılır.
4. Hece, kelime, cümle: tarayıcının Türkçe ses motoru. Türkçe ses yoksa yazı yedek.

**Harf adı söylenmez** ("be", "ce" gibi). `harf` sorusunda `say` alanı boştur ve ses
fonemden gelir. Paneldeki ses notu bu sırayı (kayıt → sentez → TTS) açıklar.

Ses efektleri (doğru/yanlış/tebrik) WebAudio ile üretilir; dosya gerekmez.
Üst çubuktaki 🔊 tüm sesleri kapatır.

## Öğretmen paneli

Üst çubuktaki ⚙️ ile açılır:

1. **Harf seçimi** — beş resmî grup + tek tek harf; altında seçimle üretilebilen
   hece/kelime/cümle sayıları.
2. **Soru tipleri** — altı tipin açma/kapama anahtarı.
3. **Soru sayısı / süre** — tur uzunluğu.
4. **Oyun hızı** — yavaş / normal / hızlı (TTS hızını da etkiler).
5. **Yarış hedef puanı** — 5 / 10 / 15.
6. **Ses ve resim desteği** — genel ses, konuşma sesi, resimli kelime desteği, tam
   ekran ipucu. TTS/fonem davranışını açıklayan not burada.
7. **Sınıf listesi** — her satıra bir öğrenci; harfe göre sırala, kura sırasını sıfırla.
8. **Kayıtlı başarılar** — öğrenci başına en iyi puan; skorları veya tüm ayarları sıfırla.
9. **Kapsama ve yedek** — her gruba kadar kaç kelime/hece/cümle üretilebildiğini gösterir;
   `⬇️ Ayarları indir` harf seçimi, soru tipleri, hız, hedef puan, sınıf listesi ve
   başarıları JSON olarak dışa aktarır, `⬆️ Yedek yükle` geri alır. Yüklenen dosya
   doğrulanır: geçersiz harf, hız veya hedef puan yok sayılır. Kelime/cümle içeriği
   kanonik dosyadan geldiği için yedeğe dahil değildir.

## Kura

`🎯 Sıradaki Öğrenci` (üst çubuk veya menü) rastgele bir öğrenci seçer, adını büyük
kartta gösterir ve `▶️ Oyunu Başlat` ile o oyuncuyla devam eder. Herkes bir kez sıra
alınca liste sıfırlanır; istenirse `🎲 Yeniden Çek` ile tekrar çekilir.

## Erişilebilirlik

- Tüm düğmeler gerçek `<button>`; `Tab` ile gezinilir, `Enter`/`Space` ile seçilir.
- `:focus-visible` çerçevesi görünür.
- Soru metni `#quizAsk`, yarış metni `#raceAsk` ve bildirim `#toast` `aria-live` ile
  duyurulur.
- `Escape` açık panelleri/katmanları kapatır.
- `prefers-reduced-motion` açıksa animasyonlar kısalır; yakınlaştırma açıktır.
- Renk tek başına anlam taşımaz: doğru cevap ✓ ve sesli geri bildirimle de belirtilir.

## Teknik yapı

```
okuma-bayrami-1-sinif.html   → kabuk (HTML + 2 CSS + 8 script bağlantısı)
okuma-bayrami/css/stil.css   → tema, kartlar, tahta/hafıza/soru düzeni
okuma-bayrami/js/yardim.js   → $, $$, rnd, clamp, lower, upper, html
okuma-bayrami/js/veri.js     → OrtakVeri adaptörü (GROUPS, WORDS, SENTENCES, hecele)
okuma-bayrami/js/soru.js     → S durumu, havuzlar, 6 soru üreticisi
okuma-bayrami/js/ses.js      → TTS, fonem, efektler, konfeti, toast
okuma-bayrami/js/oyun.js     → 4 oyun, panel, kura, puanlar
```

Modüller ayrı `<script>` etiketleriyle yüklendiği için üst düzey `var`/`function`
tanımları bilinçli olarak global bırakılmıştır; IIFE içine alınmamalıdır.
Veri **üretilmez**, `assets/veri.js` tek kaynaktır.

## Bilinen sınırlamalar

- Kayıtlı fonem/hece/kelime dosyası henüz yok; sentez + TTS yedeği kullanılıyor.
- Öğretmen paneli içerik düzenleme (kelime/cümle ekleme) bu sürümde yok; içerik
  `assets/veri.js` üzerinden yönetilir.
- Dokunmatik akıllı tahtada gerçek cihaz testi yapılmadı.
