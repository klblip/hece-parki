# Öğretmen hızlı başlangıç — 10 dakika

Bu kılavuz Hece Parkı'nı ilk kez açan öğretmen içindir. Ayrıntılı kullanım:
`uygulama/KULLANIM.md`. Gizlilik: `GIZLILIK.md`.

> **Web sürümü:** Kurulum gerekmez; site adresini açın. `Baslat.cmd` ve
> `Sunucu-Baslat.cmd` yalnız çevrimdışı pakette bulunur. Adlar, puanlar ve ayarlar
> tarayıcıda (`localStorage`) saklanır; sayfa yenilense de kalır.

## 1. Cihazı hazırla (2 dk)

1. Chrome veya Edge açın; akıllı tahtada **F11** ile tam ekran yapın.
2. Cihaz sesini açın; sınıfın duyacağı seviyeyi deneyin.
3. Siteyi açın: yayındaysa site adresini; yerel kurulumda **`Sunucu-Baslat.cmd`**
   (`http://localhost:8123/`). Hızlı önizleme için `Baslat.cmd` veya kök `index.html`
   kullanılabilir; ancak puanların sayfalar arasında kalması ve mikrofon için
   `Sunucu-Baslat.cmd` önerilir. Web sürümünde site adresini kullanın; mikrofon için
   HTTPS gerekir.
4. Açılmazsa pakette **`Sunucu-Baslat.cmd`** ile yerel sunucuyu yeniden başlatın
   (`http://localhost:8123/`).

> Yerel kurulumda internet gerekmez. Web sürümünde sayfa ilk kez yüklenirken bağlantı
> gerekir. Yerel kurulumda bir kez **uçak modunda** açıp sesi ve yazı tipini kontrol
> edin.

## 2. Sesi kontrol et (2 dk)

- **Okuyorum** → bir harf seç → 🔊 düğmesine dokun.
- Sessiz harfte **harf adı değil ses** duyulur (ör. "te" değil, kısa "t" patlaması).
- Ünlü ve kelimelerde tarayıcı sesi (TTS) kullanılır; arayüzde **TTS** etiketi görünür.
- Ses yoksa: cihaz sesi → tarayıcıda Türkçe ses paketi → sayfayı yenile sırasını deneyin.

### Kendi sesinizle fonem kaydı (isteğe bağlı, 10–15 dk)

Okuyorum → öğretmen paneli → **🎤 Fonem Stüdyo**.

- 29 harfi sırayla kaydedin. Sessiz harflerde harf adını değil sesin kendisini söyleyin;
  her harfin altında kısa yönerge var.
- Mikrofon izni ilk kayıtta istenir. Kayıtlar bu tarayıcıda saklanır, hiçbir yere
  gönderilmez.
- Başka cihaza taşımak için **⬇️ kayitlar.js indir** → dosyayı
  `assets/sesler/kayitlar.js` olarak kaydedin → kayıtları kullanacak sayfaya script
  satırını ekleyin:
  - `uygulama/index.html` → `<script src="../assets/sesler/kayitlar.js"></script>`
  - Hece Rallisi ve Aç Canavar şu an kayıtları okumaz; onlarda WebAudio fonem sentezi ve
    TTS kullanılır.
- Kayıt yoksa uygulama WebAudio sentezine, o da yoksa TTS'ye düşer; ders aksamaz.

## 3. Sınıfın yerini işaretle (1 dk)

Okuyorum → öğretmen paneli → **grup kilidi**. Sınıfın geldiği grubu seçin; sonraki
gruplar kilitlenir. Böylece öğrenciler öğretilmemiş harflerle karşılaşmaz.

- 1. grupta cümle/metin yoktur; cümleler 2. gruptan itibaren açılır.
- Hece çalışması `n` harfinden sonra başlar; kapalı hece açık heceden önce gelir.

## 4. Hangi giriş ne zaman? (2 dk)

| Giriş | Ne için | Süre |
|---|---|---|
| **Okuyorum** | Günlük ders: 18 etkinlik, öğretmen paneli, çarkıfelek | 10–20 dk |
| **Hece Rallisi** | Akıcı okuma yarışı; 2 oyuncu veya 2 hayalet araba | 3–5 dk |
| **Aç Canavar** | Hece tanıma; tek canavar veya 2 kişi yarış | 3–5 dk |

Ortak kural: yanlış cevap ceza değil, tekrar fırsatıdır. Ses yeniden okunur, süre
işlemeye devam eder.

## 5. 15 dakikalık ders akışı (örnek)

1. **Isınma (3 dk):** Okuyorum → Harfi Tanı veya Balonu Patlat.
2. **Hece (5 dk):** Hece Treni veya Kaç Hece? — önce kapalı heceler.
3. **Kelime (5 dk):** Eksik Harfi Bul veya Harf Avı.
4. **Kapanış (2–5 dk):** Hece Rallisi'nde iki öğrenci yarışsın; tahtada sırayla
   dokunmalarını sağlayın.

Dokunmatikte tek dokunuş yeterlidir; sayfa kaydırma kilitli olduğu için yanlışlıkla
kaymaz. Tablet/dizüstünde iki parmakla yakınlaştırma açıktır.

## 6. Kayıt, yedek ve dönem sonu (1 dk)

- Puanlar, rekorlar ve ayarlar yalnız **bu cihazda** tutulur.
- Okuyorum panelinden **⬇️ İndir** ile JSON yedeği alın; başka cihaza **⬆️ Yükle** ile
  taşıyın.
- Dönem sonunda: yedek alın → panelden sıfırlayın → `GIZLILIK.md`'deki adımlarla
  öğrenci adlarını ve isteğe bağlı fonem kayıtlarını temizleyin.

## 7. Sorun giderme

| Belirti | Çözüm |
|---|---|
| Ses yok | Cihaz sesi, tarayıcı sekmesi sessizde mi? Türkçe ses paketi kurulu mu? |
| Ses boğuk/yanlış | Fonem Stüdyo'dan o harfi yeniden kaydedin veya TTS ses paketini değiştirin |
| Yazı tipi farklı | TTKB Dik Temel Abece cihazda kurulu değil; sistem fontuna düşer (bkz. `assets/fonts/README.md`) |
| Ekran taşıyor | F11, tarayıcı yakınlaştırmasını %100 yapın |
| Mikrofon açılmıyor | Tarayıcı izni; `file://` yerine yerel sunucu deneyin |
| Kayıtlar kayboldu | Tarayıcı site verileri temizlenmiş olabilir; `kayitlar.js` yedeğini yükleyin |
| Oyun açılmıyor | Dosya yolunu koruyun; klasörü taşımayın; yerel sunucu deneyin |
| `test/test.html` boş | Testler yerel sunucu ister (iframe aynı köken) |

## 8. Bilinen sınırlar

- Dağıtıma hazır fonem/hece/kelime kayıt dosyaları yok; Fonem Stüdyo kaydı, WebAudio
  sentezi ve TTS yedeği kullanılıyor.
- `file://` ile temel açılış doğrulandı; ses, mikrofon ve kalıcılık bu modda denenmedi.
- Akıllı tahta ve gerçek dokunmatik cihazda saha testi yapılmadı.
- Cümlelerin anlam ve bağlam uygunluğu öğretmen değerlendirmesindedir.
