# Okuyorum — Kullanım Kılavuzu

Tamamen çevrimdışı (offline) çalışan, akıllı tahta ve tablet dostu ilk okuma yazma oyunu.
Kaynak dersekranda.com analizinden yalnızca **ilkeler** çıkarılmış; kod, metin, grafik ve ses tamamen özgün yazılmıştır.

## Nasıl açılır?

Aşağıdaki yollardan biri:

1. **Sunucusuz:** `index.html` dosyasına çift tıkla — klasik tarayıcı sekmesinde çalışır (Chrome/Edge önerilir).
2. **Yerel sunucu (geliştirme için):** proje kökünde
   ```powershell
   powershell -ExecutionPolicy Bypass -File uygulama/sunucu.ps1
   ```
   sonra tarayıcıda `http://localhost:8123/` aç.

> Sınıfta akıllı tahtada kullanırken tarayıcıyı tam ekran (F11) yapın.

## Ekran akışı

1. **Ana ekran** — ⭐ puan çipi ve ses grubu kartları.
2. **Grup ekranı** — üstte hızlı grup geçişi (ANETİL · OKURIM · ÜSÖYDZ · ÇBGCŞ · PHVĞFJ · TÜM SESLER),
   ortada o grubun harf kutuları (basınca harf söylenir), altta etkinlik kartları.
3. **Etkinlik ekranı** — üstte sesli talimat çipi (basınca tekrar okur), ortada büyük dokunmatik tuşlar.
4. **🏆 Sınıf Puan Tablosu** — üst bardaki 🏆 düğmesi; Hafıza, Fabrika Yarışı ve Roket Yarışı bitince oyuncuların
   puanları **sınıf listesine otomatik** yazılır. Haftalık tablo: ilk **3** podyuma çıkar 🥇🥈🥉, listedeki herkes görünür.
   **Yeni hafta** (pazartesi) başlayınca tablo kendiliğinden sıfırlanır ve eski tablonun ilk üçü
   "Geçmiş haftaların şampiyonları" satırına arşivlenir. Puan çipindeki ⭐ ise bütün etkinliklerin toplamıdır.

## Aşama sistemi (harf harf ilerleyiş)

- Grup ekranındaki harf kutularına dokununca aşama o harfe ayarlanır: öğretilen harfe kadar olan harfler **sarı dolgulu** görünür.
- Örnek: ANETİL'de aşama **e** ise etkinliklerde yalnızca **a · n · e** harfleriyle kurulabilen kelimeler/heceler çıkar.
- **Yedek içerik yoktur:** aşamadaki harflerle yeterli kelime/hece kurulamıyorsa o etkinlik kilitlenir ve "Bu aşamada yeterli kelime yok; bir harf daha ilerleyin" uyarısı gösterilir. Öğretilmemiş harf hiçbir koşulda oyuna sokulmaz.
- Cümle gerektiren etkinlikler (Metin Oku, Cümle Kur) **2. gruptan itibaren** açılır; 1. grupta kilitlidir.
- Bu seçim tarayıcıda saklanır; her grup için ayrı ayrı güncellenir.

## Etkinlikler

| Etkinlik | Amaç | Not |
|---|---|---|
| 🔤 Harfi Tanı | Dinlenen harfi 3 seçenek arasından bul | 6 soru, bitince +5 bonus |
| 🎈 Balonu Patlat | Mod seç: **Harf / Hece / Kelime**. <br>- **Harf:** duyulan harfin balonunu patla; **3 taneyi patlayınca yeni harf** konuşulur. <br>- **Hece/Kelime:** duyulanı patla; doğrusunda yeni hedef, yanlışta hedef tekrar okunur. | Ekranda sadece **1 hedef + 2 çeldirici** balon; hedef değişince eski balonlar silinir, balonlar alttan yavaşça yükselir |
| 🔢 Kaç Hece? | Oyuna girince **🟢 Kolay / 🔵 Normal** seçilir. **Kolay:** kelime hecelere **de · de** gibi ayırılıp görünür; **Normal:** kelime tek parça, kulak dinler. Her ikisinde 1/2/3 düğmesiyle cevap | Oyun içinde "🔁 Mod" çipiyle mod değiştirilir |
| 🧩 Eksik Harfi Bul | Kelime eksik harfiyle (**t?ne**) görünür; doğru harf seçilince **boşluğa yerleşir**, tam kelime 2-3 sn ekranda kalır, sonra yeni soru | Ekranlarda emoji gösterilmez |
| 🔍 Harf Avı | Duyulan harf **hangi kelimede gizli?** Doğru kelimeyi bul | Sadece yazıyla çalışır — görsel yok |
| 🚂 Hece Treni | Vagonlara sırasıyla heceleri bindir; tren **kalkar**, vagonlar **birleşip tek vagon** olur ve kelimenin bütün hâli ekranda kalır | Lokomotif 🚂 + tekerlekli vagonlar |
| 🏭 Hece Fabrikası | Resimli kelimenin **hece parçalarını** (2 çeldirici araya karışmış) sırayla makineye ver; dişlı döner, ürün **şeride düşer**: kelime + resim birleşmiş hâlde çıkar | 🔊 kelime tekrar · 🧩 hece hece dinle · 📜 **ham madde seçici** (kendi kelimesini seçer) · 🧑 tek / 👥 **3 yarışmacı** modu — isimler öğrenci listesinden otomatik gelir, 🏆 "Fabrika şampiyonları" tablosu saklanır |
| 🕵️ Kelime Kasası | Kelimeyi dinle; harf şifresine **sırayla** dokun — her doğru harfte kasa lambası yanar, bitince **kasa açılır** 💎 | 3 yanlışta alarm 🚨; 4 kasa |
| ✏️ Sesli Dikte | Kelime **1 kez** duyulur; aşama harfleriyle **deftere yaz**; "✓ Yaz"e bas — doğruysa kutular **yeşile döner**, yanlışsa defter sarsılır | 🔊 Kelimeyi dinle · 🐢 **Harf harf** dinle · 💡 **Hece hece** dinle · ⌫ Sil — dinleme düğmelerine her basışta yeniden söyler; 5 kelime |
| 📖 Metin Oku | Cümleyi sesli dinle, kelime kelime takip et | Kelimeye basınca o kelimeyi okur |
| 🧺 Cümle Kur | Cümleyi dinle, karışık sözcüklere **sırayla** dokun | Sözcükler karışık gelir, tamamlanınca okunur |
| ⏱️ Zamana Karşı | Önce **🏆 En iyiler** tablosu görünür → **▶ Başla!** ile 60 saniyede duyulan kelimeyi bul | Süre bitince adını yazıp **💾 Skoru Kaydet** ile tabloya gir (8 kişiye kadar saklanır) |
| 🏖️ Kum Havuzu | Aşamadaki harflerden birini seç, rehberin üstünü kumda çiz | Renk + silgi + süpür araçları |
| 🤝 Halat Çekme | İki kişilik sıralı soru — halat tarafına çek | Arkadaşınla / Bilgisayarla |
| 🐰 Tavşan Yarışı | 10 soruda kaplumbağayı geç | Doğru cevap tavşanı atlatır |
| 🚀 Roket Yarışı (3 Kişi) | Üç yarışmacı **öğrenci listesinden otomatik** seçilir; sıranız gelince kelimeyi dinleyin, doğruya dokunun — roketiniz bir yıldız ilerler; ilk 4 yıldız kazanır | Yanlışta soru sıradakine geçer · 🚀 "Roket şampiyonları" tablosu · en fazla 9 soru |
| 🎨 Yaz Oynat | Serbest çiz, kaydet, çizimi "geri oynat" | Kaydedilen çizimler tıklanabilir |
| 🃏 Hafıza Kartları | **İki kişilik!** İsimler **öğrenci listesinden otomatik gelir** (açılışta rastgele ikili seçilmiş gelir — gerekirse çipe dokunup değiştir, ya da 🎲 Rastgele). Girişte **🏆 En çok eş bulanlar** lider tablosu beklir. Sonra tür seç (Harf–Kelime / Hece–Hece / Kelime–Resim) ve 12 kapalı kartta 6 eş bulun. Sırayla oynanır: eş bulan tekrar oynar, bulamayan sırayı devreder; her oyuncunun eşi puan çubuğunda sayılır. Bitişte kazanan (veya berabere) puanları **lider tablosuna** toplanır | Kart çevirirken içeriği sesli duyulur (açık/eşleşmiş karta tekrar dokunmak sesi yeniden okur); "🔁 Tür değiştir" ve "🔄 Yeniden karıştır" çipleri; bitişte Yeniden Oyna / 👥 Oyuncuları değiştir |

## Puanlama & gamifikasyon

- Her doğru cevap puan ekler (etkinlik başına +2…+5; yarışta bitişe kadar +10).
- Puan ana ekrandaki **tavşanı** pistte ilerletir (🐢 tarafa göre).
- Puan tarayıcı belleğinde (`localStorage`) saklanır — kapatıp açınca sürer.
- Üst çubuktaki 🐰 49 sayacı toplam puanı gösterir.

## Ses

- Talimatlar ve kelimeler tarayıcının Türkçe ses motoruyla (`speechSynthesis`) okunur — internet gerekmez (Windows'ta Türkçe ses paketi kuruluysa). Bir adet ses yoksa ekrandaki metin yedek görevi görür.
- **Kelimeler/harfler NET modda okunur:** çok yavaş söyleme → uzun boşluk → bir yavaş tekrar — çocuk iki kez, sakin sakin duyar.
- 🐢 **Ağır dinle (dikte):** harfler **harf harf, aralarında ~2.5 sn sessizlik** okunur; hece ipucu da **hece hece** aralarla söyler.
- 🎵 **Sessiz harfler fonem olarak çalınır:** ses temelli yaklaşımda "te/pe/ke" gibi harf adı okunmaz; p,t,k,b,d,g patlamaları, f,s,ş sürtünmeleri, m,n/l,r,y uğultuları WebAudio ile sentezlenerek "ağızdan çıktığı gibi" verilir. Kayıtlı fonem varsa (`assets/sesler/`) o çalar; yoksa sentez; TTS yalnızca ünlü/hece/kelime ve yedek olarak kullanılır.
- 🚫 Oyun talimatları, tebrikler ve yönetici mesajları sesli söylenmez — bunlar ekranda yazı olarak görünür, tepkiler ses efektleriyle verilir.
- ✏️ **Yazı tipi:** **TTKB Dik Temel Abecesi** kullanılır — çocuğun defterindeki yazıyla aynı biçim. Font dosyası projede **dağıtılmaz** (telif); `assets/font.css` cihazda kurulu fontu `local()` ile seçer, kurulu değilse sistem sans-serif yazı tipine düşer. Ayrıntı: `assets/fonts/README.md`.
- 🔈 **Ses boğuksa (ÖNEMLİ):** bilgisayarda eski kalitede tek Türkçe ses (ör. "Tolga") kurulu olabilir. Çok daha net ses için: **Edge tarayıcıda açmak** (internet varsa "Emel (Natural)" gibi doğal sesler otomatik seçilir) veya Windows Ayarları → Saat ve Dil → Dil ve Bölge → Türkçe → **Konuşma paketini yükle**. İyi ses kurulunca oyun onu otomatik kullanır.
- Doğru/yanlış/balon patlama/kutlama ses efektleri **WebAudio** ile canlı üretilir (dosya yok).
- 🔊 düğmesi tüm sesleri açar/kapatır.

## Ayarlar

- 🏠 → ana ekran, ☰ → grup etkinliklerine dön, 🔊/🔇 ses aç-kapa, 🎡 → **öğrenci seç (çarkıfelek)**, ⚙️ → **yönetici paneli**.
- Ayrıca ekranın **sağ alt köşesinde sabit "🎡 Öğrenci seç" düğmesi** durur; oyun sırasında sayfa kaydırılsa bile görünür.

## 🎡 Öğrenci seç (çarkıfelek)
Ekranın sağ altındaki **🎡 Öğrenci seç** düğmesine (veya üst çubuktaki 🎡) basınca ekranın ortasında çarkılır katmanı açılır: çark **kendi kendine döner**, durunca gelen isim büyük kartta gösterilir 🎉, sonra katman **kendiliğinden kaybolur** ve sen eski ekranına dönersin. "✕" ile erken kapatabilirsin; isim geldikten sonra "⟳ Çevir" ile tekrar çevirebilirsin. İşlem sırasında bulunduğun oyuna/etkinliğe hiçbir şey olmaz — sadece yüzeye gelen bir katmandır.
- Puanı sıfırlamak için: geliştirici konsolda `localStorage.clear()` (veya tarayıcı verilerini temizleme).

## ⚙️ Yönetici paneli (öğretmen için)

Üst çubuktaki **⚙️** ile açılır:
- **📍 Sınıfın yeri (grup kilidi)**: Bir grubu işaretle; ondan sonraki gruplar ana ekranda 🔒 ile kilitlenir, öğrenci giremez (ana ekranda ve grup yetmeklerinde). "🔓 Kilidi kaldır" ile açılır. Yanındaki **🧹 Skor tablosunu sıfırla** Zamana Karşı rekorlarını temizler.
- **🎡 Kim Tahtaya Gelecek? (Çarkıfelek — üst çubuktaki 🎡 ile kullanılır)**: Öğrenci isimlerini **satır başına bir tane** yazıp "💾 Listeyi kaydet"e bas. Üst çubuktaki **🎡 Öğrenci seç** düğmesi listeyi okur; çark otomatik döner ve gelen kişi tahtaya çıkar. **"Aynı kişi üst üste gelmesin"** anahtarıyla son gelenin tekrar çekilmesi engellenir (açık/kapalı). Liste, yedek JSON'a (ogrListe) dahildir.
- Grup seç → **Kelimeleri** ve **Cümleleri** düzenle (her satıra bir öğe). Hece listesi kelimelerden otomatik hesaplanır (Türkçe kuralına göre: a-na, ta-ne-li, o-kul, mu-tlu...).
- **📝 Cümleler hangi aşamada çıkar?** Cümle listesinin altında her cümlenin hangi aşamadan itibaren kullanılabileceğini gösterir (✗ ise sonraki grupların harfleri gerekiyor).
- **Harf aşamalarına göre kapsama tablosu**: her aşama için kaç kelime-hece çıkar ve hangileri olduğu listelenir.
- **💾 Kaydet** düzenlemeyi bu tarayıcıda saklar, **♻️ Bu grubu sıfırla** varsayılana döndürür.
- **⬇️ İndir / ⬆️ Yükle**: içeriği, aşama seçimlerini, grup kilidini ve skor tablosunu JSON yedek dosyası olarak dışa aktar / içe aktar — akıllı tahtadan akıllı tahtaya taşımak için.
- İçerik `localStorage`'da tutulur; internet gerektirmez.

## 🎤 Fonem Stüdyo (kendi sesinle kayıt)

Yönetici panelinde:
- 29 harfin sırasiyla listesi çıkar; **sessiz harflerde harf adını ("te") DEĞİL sesin kendisini** söyle — her harfin altında nasıl çıkacağına dair not var.
- **🎙️ Kaydı başlat** → sesi söyle → **⏳ DURDUR** → kayıt otomatik kırpılır, ses seviyesi düzelir, dinletilir. Ardından **💾 Kaydet** tuşuyla kalıcılaştır (otomatik de kaydolur; 💾 hem onay hem onarım içindir). Beğenmezsen aynı harfi seçip yeniden kaydet.
- Kayıtlar Okuyorum etkinliklerinde **önce kullanılır**; kayıt yoksa WebAudio fonem sentezi, o da yoksa TTS yedeği.
- **⬇️ kayitlar.js indir**: kayıtları dosya olarak alır. Dosyayı `assets/sesler/kayitlar.js` olarak kaydedip `uygulama/index.html` sayfasına `<script src="../assets/sesler/kayitlar.js"></script>` satırını ekleyin. Hece Rallisi ve Aç Canavar kayıtları okumaz (fonem sentezi + TTS).
- Mikrofon izni, ilk kayıtta tarayıcı ister; kayıtlar yalnız bu tarayıcıda saklanır.

## Teknik yapısı

```
uygulama/
  index.html   → iskelet + üst çubuk (assets/font.css bağlar)
  css/stil.css → tema (gökyüzü-çayır), büyük dokunmatik tuşlar, canlı dekor
  js/veri.js   → assets/veri.js adaptörü + grup/kelime/cümle havuzları, etkinlik metinleri
  js/ses.js    → WebAudio efektleri + Türkçe seslendirme + fonem
  js/uygulama.js → ekran yönetimi + 18 etkinlik + çarkıfelek motoru
  js/studyo.js   → 🎤 Fonem Stüdyo: mikrofonla fonem kaydı, kırpma, WAV, kayitlar.js dışa aktarma
  sunucu.ps1   → opsiyonel yerel sunucu (8123); kurulum paketinde kök `Sunucu-Baslat.cmd`
  test-goruntuleri/ → geliştirme ekran görüntüleri (pakette yok)
assets/
  veri.js      → 29 harf, 5 resmî grup, kelime/cümle, hecele() — tek kaynak
  fonem.js     → ortak WebAudio fonem sentezleyici
  oyun-cekirdek.js → iki oyunun ortak yardımcıları
  font.css     → TTKB local() + yedek yığın
```

Kanonik veri tek yerde tutulur: `assets/veri.js`. `uygulama` ve iki oyun da harf
sırasını, kelime bankasını ve heceleme kuralını buradan okur; bu yüzden kelime
eklerken yalnızca `assets/veri.js` düzenlenir.

Tarayıcı gereksinimi: Chrome/Edge (Pointer Events + speechSynthesis destekli). Tablet ve akıllı tahta dokunmaları pointer olaylarıyla desteklenir; `touch-action:none` ile sayfa kaydırma engellenir.
