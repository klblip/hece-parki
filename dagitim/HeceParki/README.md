# 🌱 Hece Parkı — 1. Sınıf İlk Okuma Yazma

Türkiye Yüzyılı Maarif Modeli (TYMM) 2026 İlkokul Türkçe Dersi Öğretim Programı'na
göre hazırlanmış, **çevrimdışı** çalışan, reklamsız ve dokunmatik uyumlu ilk
okuma-yazma etkinlikleri. Dış istek yoktur: yazı tipi, ses ve görseller yerel
dosyalardan gelir.

## Nasıl açılır?

1. `index.html` dosyasına **çift tıkla** → oyun parkı açılır.
2. Kartlardan birine tıkla → ilgili uygulama açılır.
3. Ses için cihaz sesi açık olmalı.

> Kurulum paketinde **`Sunucu-Baslat.cmd`** dosyasına çift tıklayın (yalnız bu
> bilgisayarda `http://localhost:8123/`); puanların sayfalar arasında kalması ve
> mikrofon için bu yol önerilir. Hızlı önizleme için **`Baslat.cmd`** de kullanılabilir.
> Ayrıntı: **`KURULUM.md`**.

> Akıllı tahtada **F11** = tam ekran. Tablet/dizüstünde yakınlaştırma (pinch-zoom) açıktır.

> **Veri kalıcılığı:** `localStorage` adres (origin) başına çalışır. Puan, ad ve
> ayarların sayfalar arasında görünmesi için siteyi **HTTP/HTTPS** ile açın (yayın
> adresi veya `Sunucu-Baslat.cmd`). `file://` ile açılışta bazı tarayıcılar sayfa
> başına ayrı depolama kullanır; bu durumda kayıtlar sayfalar arasında görünmeyebilir.

> İlk kez kullanıyorsanız **`OGRETMEN-BASLANGIC.md`** (10 dakikalık kurulum).
> Gizlilik ve veri saklama: **`GIZLILIK.md`**.

**Tarayıcı testleri** için yerel sunucu gerekir (iframe'ler aynı kökenden yüklenir):

```powershell
powershell -ExecutionPolicy Bypass -File uygulama/sunucu.ps1   # http://localhost:8123/
# veya proje kökünde herhangi bir statik sunucu, örn. 8124
```

Sonra `http://localhost:<port>/test/test.html` adresini aç. Test paketi **86 test**
içerir (kanonik veri, heceleme, havuzlar, soru motoru, fonem, içerik lint'i, gerçek
sayfa yükleme, çevrimdışılık, Hece Fabrikası ve Roket yarışı).

## Kurulum paketi (çevrimdışı)

Okul cihazına kopyalanacak hazır paket: **`dagitim/HeceParki-1.0.zip`** (32 dosya,
~0,14 MB). İçinde `Baslat.cmd`, `Sunucu-Baslat.cmd`, `KURULUM.md` ve yalnız çalışma
zamanı dosyaları vardır; testler/araştırma raporları girmez.

Yeniden üretmek için:

```powershell
powershell -ExecutionPolicy Bypass -File araclar/paket-olustur.ps1
```

Kurulum adımları: **`KURULUM.md`**. Paket yalnız bu bilgisayarda çalışır; yerel sunucu
`http://localhost:8123/` dinler, ağa açılmaz.

## Web sitesi (statik)

Aynı uygulamanın sunucusuz, yayına hazır HTML sürümü:

- **`dagitim/HeceParki-Web/`** — 29 dosya; `.cmd`/`.ps1`, test ve araştırma yok.
- **`dagitim/HeceParki-Web-1.0.zip`** — sıkıştırılmış kopya.
- **`404.html`** — özel hata sayfası.

Yeniden üretmek için:

```powershell
powershell -ExecutionPolicy Bypass -File araclar/web-olustur.ps1
```

GitHub Pages, Netlify, Cloudflare Pages veya okul web sunucusuna yükleme adımları:
**`WEB-YAYIN.md`**. Site saf HTML/CSS/JS'tir; sunucu tarafı kod, veritabanı ve dış istek
yoktur. Mikrofon için HTTPS veya `localhost` gerekir. Service worker yoktur; tam
çevrimdışı sınıf kullanımı için kurulum paketini kullanın.

> **Font:** `assets/font.css` yalnız `local()` kullanır. Bu bilgisayarda TTKB fontu
> kurulu olduğu için site doğru görünür. Ziyaretçi cihazında font yoksa sistem fontuna
> düşer; font dosyasını siteye gömmek/dağıtmak için hak sahibinden izin gerekir.

## Dört giriş noktası

| # | Uygulama | Dosya | İçerik |
|---|---|---|---|
| 1 | **Okuyorum** | `uygulama/index.html` | 18 etkinlik + öğretmen paneli + Fonem Stüdyo + çarkıfelek |
| 2 | **Okuma Bayramı** | `okuma-bayrami-1-sinif.html` | 4 oyun (Uçan Balon, Tavşan Yarışı, Hafıza, Cümle Kurma) |
| 3 | **Hece Rallisi** | `oyunlar/hece-rallisi/index.html` | Kapı okuma yarışı, 2 hayalet araba, rekorlar |
| 4 | **Aç Canavar** | `oyunlar/ac-canavar/index.html` | Lokma seçme; tek canavar veya 2 kişi yarış |

## Resmî harf sırası

Tek kaynak `assets/veri.js` → `window.OrtakVeri`. Bütün uygulamalar grupları,
kelimeleri ve heceleme kuralını buradan okur.

| Grup | Harfler | Süre (yaklaşık) | Kümülatif |
|---|---|---|---|
| 1 | `a n e t i l` | 6 hafta | 6 harf |
| 2 | `o k u r ı m` | 4 hafta | 12 harf |
| 3 | `ü s ö y d z` | 2 hafta | 18 harf |
| 4 | `ç b g c ş` | 2 hafta | 23 harf |
| 5 | `p h v ğ f j` | 2 hafta | 29 harf |

Hazırlık haftasından sonra toplam 16 hafta. Kurallar:

- Tırnaksız **dik temel harfler**; küçük harf önce, büyük harf sonra.
- Hece çalışması `n` harfinden sonra başlar; **kapalı hece açık heceden önce**.
- Hece/kelime harfleri renkle ayrıştırılmaz (çerçeve ve zemin serbesttir).
- 1. grupta cümle/metin yoktur; cümleler 2. gruptan itibaren açılır.
- Öğretilmemiş harf içeren kelime resimle ikame edilmez; kelime = resim.

## Ses yaklaşımı

- **Sessiz harfler harf adıyla değil, fonem olarak** verilir. Kayıtlı dosya varsa
  (`assets/sesler/`) o çalar; yoksa `assets/fonem.js` WebAudio ile sesi sentezler
  (p/t/k patlamaları, s/ş sürtünmeleri, m/n/l uğultuları).
- Ünlülerde harf adı = ses olduğu için TTS kullanılır ve arayüzde **TTS** etiketi görünür.
- Hece, kelime ve cümleler tarayıcının Türkçe ses motoruyla (`speechSynthesis`) okunur;
  Türkçe ses paketi yoksa ekrandaki yazı yedek görevi görür.
- Kayıt kuralları: `assets/sesler/README.md`.

## Yazı tipi

`assets/font.css` **TTKB Dik Temel Abece** fontunu `local()` ile kullanır; font
dosyası projede **dağıtılmaz** (telif: Prof. Namık Kemal Sarıkavak / TTKB). Font
cihazda kurulu değilse sistem sans-serif yazı tipine düşer, düzen bozulmaz.
Ayrıntı: `assets/fonts/README.md`.

## Erişilebilirlik

- Klavye ile gezinme, görünür `:focus-visible` çerçevesi, `aria-label`'lar.
- Soru metinleri ve bildirimler `aria-live` ile duyurulur.
- `prefers-reduced-motion` açıksa animasyonlar sadeleşir.
- Yakınlaştırma engellenmez; düğmeler en az 44 px dokunma hedefidir.

## Dosya yapısı

```
dagitim/                    → üretilen kurulum ve web paketleri (kaynak değil)
araclar/paket-olustur.ps1   → çevrimdışı kurulum paketini üretir
araclar/web-olustur.ps1     → statik web sitesi paketini üretir
Baslat.cmd                  → hızlı önizleme (file://; veri paylaşımı sınırlı)
Sunucu-Baslat.cmd, sunucu.ps1 → önerilen: localhost:8123 üzerinde yerel HTTP sunucusu
index.html                  → oyun parkı (giriş; TTKB local font)
404.html                    → web sitesi hata sayfası
WEB-YAYIN.md                → web sitesi yayınlama kılavuzu
OGRETMEN-BASLANGIC.md        → 10 dakikalık öğretmen kurulumu
GIZLILIK.md                  → gizlilik ve veri notu
okuma-bayrami-1-sinif.html  → Okuma Bayramı kabuğu (modülleri yükler)
okuma-bayrami/
  css/stil.css              → tema
  js/yardim.js              → ortak küçük yardımcılar ($, rnd, yaz…)
  js/veri.js                → kanonik veri adaptörü (OrtakVeri)
  js/soru.js                → durum, havuzlar, 6 soru tipi
  js/ses.js                 → TTS, fonem, konfeti, toast
  js/oyun.js                → 4 oyun + panel + kura
oyunlar/
  hece-rallisi/index.html   → Hece Rallisi (tek dosya)
  ac-canavar/index.html     → Aç Canavar (tek dosya)
uygulama/
  index.html                → Okuyorum kabuğu
  css/stil.css, js/*.js     → 18 etkinlik, panel, çarkıfelek
assets/
  veri.js                   → 29 harf, 5 grup, kelime/cümle, hecele()
  fonem.js                  → WebAudio fonem sentezi
  oyun-cekirdek.js          → iki oyunun ortak yardımcıları
  font.css                  → TTKB local() + yedek yığın
  sesler/manifest.js        → kayıtlı ses yolları (boş başlar)
  fonts/README.md           → font lisans notu (dosya yok)
test/test.html              → tarayıcı içi testler
arastirma/                  → Aşama 1-4 raporları
```

## Sınıfta kullanım

- Her turun başında kapıdaki/tabaktaki yazıları **sınıfça okutun**, sonra öğrenci
  duyduğuna dokunsun.
- Okuyorum'da öğretmen panelinden **sınıfın yerini (grup kilidi)** işaretleyin;
  sonraki gruplar kilitlenir.
- Yanlış cevap ceza değil, tekrar fırsatıdır: ses yeniden okunur, süre işlemeye devam eder.
- Çarkıfelek ve "Sıradaki Öğrenci" kuraları sırayı kendiliğinden ilerletir.

## Gizlilik

Puanlar, rekorlar, adlar ve ayarlar yalnızca bu cihazda (`localStorage`) saklanır.
Hiçbir veri dışarı gönderilmez; reklam, çerez ve analitik yoktur. Fonem Stüdyo'daki
mikrofon kayıtları da yalnız bu tarayıcıda tutulur. Ayrıntı ve silme adımları:
**`GIZLILIK.md`**. Hızlı temizlik için tarayıcı konsolunda `localStorage.clear()`
yeterlidir (tüm yerel kayıtları siler).

## Bilinen sınırlamalar

- Kayıtlı fonem/hece/kelime dosyaları henüz yok; fonem sentezi ve TTS yedeği kullanılıyor.
- `file://` ile temel açılış (kartlar, ana ekran, 29 harf çipi) headless Chrome'da
  doğrulandı; ses, mikrofon ve `localStorage` kalıcılığı bu modda denenmedi. Sınıf
  kurulumu için yerel sunucu veya kısayol önerilir.
- Akıllı tahta ve gerçek dokunmatik cihaz testi yapılmadı.
- İki oyun ortak yardımcıları (`assets/oyun-cekirdek.js`) kullanır; oyun akışları ayrıdır.
