# Aşama 4 — Uygulama ve Doğrulama Raporu

**Tarih:** 21.10.2026 (güncelleme: 23.10.2026)
**Kapsam:** Onaylanan P0 + P1 maddeleri (kararlar: `TASKS.md`)
**Dayanak:** TYMM 2026 İlkokul Türkçe Dersi Öğretim Programı, `AGENTS.md` kuralları,
Aşama 1-3 raporları (`arastirma/00-ILK-RAPOR.md` … `03-pedagojik-cerceve-ve-mufredat.md`).

Bu rapor **doğrudan gözlem**, **kaynak bilgisi**, **uzman yorumu** ve **test edilmemiş
varsayım** ayrımını korur. Her iddia için kanıt türü belirtilmiştir.

> **23.10.2026 güncellemesi:** Ana site artık Okuyorum'dur; kök `index.html` bu
> uygulamaya yönlendirir. Hece Rallisi ve Aç Canavar, Okuyorum ana ekranındaki
> **Oyunlar** bölümünden açılır. Okuma Bayramı web/paket dışı arşive alındı.
> Test paketi **90/90** geçer. Aşağıdaki 21.10.2026 bölümleri, aksi belirtilmedikçe
> tarihsel uygulama kaydını anlatır.

---

## 1. Yönetici özeti

- Yayınlanan üç giriş noktası (Okuyorum, Hece Rallisi, Aç Canavar) tek bir
  kanonik veri kaynağına (`assets/veri.js`) bağlandı; Okuma Bayramı arşivde.
- Harf sırası, heceleme ve harf kümesi kuralları tek yerde; dört uygulama aynı sonucu
  üretiyor (doğrudan gözlem + otomatik test).
- `okuma-bayrami` tek dosyadan **7 modüle** ayrıldı; davranış korunarak test edildi.
- Ses: harf adı yerine **fonem** (kayıt → WebAudio sentezi → ünlüde TTS).
- Yazı tipi: TTKB Dik Temel Abece, **kopyalanmadan** `local()` ile; beş girişte etkin.
- Erişilebilirlik: `aria-live`, `focus-visible`, `aria-label`, `prefers-reduced-motion`,
  yakınlaştırmanın açılması.
- Tarayıcı test paketi: **90/90 geçti** (9 kanonik veri, 17 heceleme, 3 adaptör,
  14 havuz/soru, 5 fonem, 8 içerik lint'i, 16 gerçek sayfa yükleme, 5 çevrimdışılık,
  5 Hece Fabrikası).
- İki oyunun ortak yardımcıları tek çekirdekte (`assets/oyun-cekirdek.js`); oyun
  akışları ayrı kaldı.

---

## 2. Değişen dosyalar

### 2.1 Yeni dosyalar

| Dosya | İçerik | Gerekçe |
|---|---|---|
| `assets/veri.js` | 29 harf, 5 resmî grup, kelime/cümle bankası, `hecele`, `harfUyar`, `heceTuru`, `heceSirala`, havuzlar | Tek kaynak; öğretilmemiş harfin sızmasını yapısal olarak engeller |
| `assets/fonem.js` | 21 sessiz harf için WebAudio fonem sentezi | Harf adıyla öğretimi kaldırmak |
| `assets/oyun-cekirdek.js` | İki oyunun ortak katmanı: depolama, seslendirme, efekt, konfeti, kelime/hece havuzu, resmî harf setleri | Kopyala-yapıştır yardımcıların tek yerde bakımı (P2-1/P2-2) |
| `assets/font.css` | TTKB `local()` + `--dik-temel` yedek yığını | Lisanslı fontu dağıtmadan kullanmak |
| `assets/sesler/manifest.js` | Boş kayıt manifesti (`fonem`/`hece`/`kelime`) | Kayıtlar geldiğinde kod değişikliği gerektirmemesi |
| `assets/fonts/README.md`, `assets/sesler/README.md` | Lisans ve kayıt kuralları | Telif ve ses kalitesi standardı |
| `okuma-bayrami/js/yardim.js` | `$`, `$$`, `rnd`, `clamp`, `lower`, `yaz` | Modüller arası ortak yardımcılar |
| `okuma-bayrami/js/veri.js` | `OrtakVeri` adaptörü | `okuma-bayrami`'nin kısa adlarını koruyarak tek kaynağa bağlanmak |
| `okuma-bayrami/js/soru.js` | Durum, havuzlar, 6 soru tipi | Tek dosyadaki soru motorunu ayrıştırmak |
| `okuma-bayrami/js/ses.js` | TTS, fonem, efekt, konfeti, toast | Ses katmanını oyundan ayırmak |
| `okuma-bayrami/js/oyun.js` | 4 oyun, panel, kura, puanlar | Oyun katmanı |
| `test/test.html` | 90 tarayıcı testi | P0/P1/P2/P3 doğrulaması |
| `okuma-bayrami/KULLANIM.md` | Oyun ve panel kılavuzu | Öğretmenin kullanabilmesi |
| `OGRETMEN-BASLANGIC.md` | 10 dakikalık kurulum, ses kontrolü, 15 dakikalık ders akışı, sorun giderme | İlk kullanım eşiğini düşürmek (P2-5) |
| `GIZLILIK.md` | Yerel veri envanteri, mikrofon, silme adımları, KVKK sınırı | Şeffaflık ve okul politikasına uyum (P2-6) |
| `KURULUM.md` | Kopyala-çalıştır kurulum, kısayol, mikrofon, güncelleme/geri alma, sorun giderme | Okul cihazında kurulum (P3) |
| `Baslat.cmd`, `Sunucu-Baslat.cmd`, `sunucu.ps1` | Tarayıcıyla açılış + yalnız `localhost:8123` yerel sunucu | Mikrofon için güvenli bağlam; ağa açılmaz |
| `araclar/paket-olustur.ps1` | `dagitim/HeceParki-1.0.zip` + SHA256 sürüm notu üretir | Tekrarlanabilir dağıtım |
| `404.html`, `WEB-YAYIN.md`, `araclar/web-olustur.ps1` | Statik site: hata sayfası, yayın kılavuzu, 21 dosyalık web paketi | Sunucusuz HTML sitesi (P3-5) |

### 2.2 Yeniden yazılan / düzenlenen dosyalar

| Dosya | Değişiklik |
|---|---|
| `okuma-bayrami-1-sinif.html` | Tek dosyadaki HTML + CSS + JS yerine 13 KB'lık kabuk: 2 CSS + 8 script bağlantısı; `aria-live`, `aria-label`, viewport zoom |
| `okuma-bayrami/css/stil.css` | Stiller taşındı; TTKB fontu, `prefers-reduced-motion`, `focus-visible`, `.pasif` |
| `uygulama/js/veri.js` | Kanonik adaptör; 29 harf, `göz` 4. grupta, `ı` 2. grupta |
| `uygulama/js/uygulama.js` | Aşama kapıları, `oHalatCekme` skor, `oHeceSay` 4+, `oHarfAvi` hedef gizleme, diyalog odağı |
| `uygulama/js/ses.js` | Kayıtlı ses → fonem sentezi → TTS sırası |
| `uygulama/index.html` | `assets/font.css` bağlantısı |
| `uygulama/css/stil.css` | Font değişkeni, odak ve hareket azaltma |
| `oyunlar/hece-rallisi/index.html` | Kanonik veri, 5 resmî ön ayar, gerçek hece havuzu, küçük harf, TTKB fontu, zoom; ortak yardımcılar çekirdeğe taşındı |
| `oyunlar/ac-canavar/index.html` | Aynı düzeltmeler + çeldirici üretim hatası; ortak yardımcılar çekirdeğe taşındı |
| `index.html` | Okuyorum'a yönlendirme; iki oyun Okuyorum ana ekranında, Okuma Bayramı yayın dışı |
| `README.md` | Üç giriş, resmî gruplar, ses/font/erişilebilirlik, sınırlamalar |
| `uygulama/KULLANIM.md` | Fontun gömülü olmadığı, yedek içerik olmadığı, sunucu yolu düzeltildi |
| `TASKS.md` | P0/P1 durumları + test günlüğü |

### 2.3 İçerik düzeltmeleri (`assets/veri.js`)

- Uydurma/nadir kelimeler (`yula`, `tala`) ve özel adların küçük harfle karışması
  kaldırıldı; kelime bankası sıfırdan, resmî harf kümelerine göre yazıldı.
- **18 hatalı veya çakışan emoji** temizlendi: `ile`, `oku`, `umut`, `mini`, `kanat`,
  `kural`, `düdük`, `özel`, `ütü`, `örtü`, `sürü`, `eş`, `büyük`, `güzel`, `seç`,
  `pul`, `telefon`, `pijama`.
  Gerekçe: resim kelimeyi doğru göstermiyordu (ör. `kural` = cetvel) veya aynı resim
  iki kelimeye birden ait görünüyordu (ör. `büyük`/`fil` = 🐘).
- `judo` 🤼 → 🥋 (güreş değil, judo).
- Resimli sorularda aynı emojinin iki seçenekte görünmemesi için `poolWordsPicTek()`
  eklendi; `qResim` artık onu kullanıyor.

> **Kanıt türü:** Kelime bankası ve emoji kararları uzman yorumudur; testler yalnızca
> "resim = cevap kelimesi" ve "seçeneklerde tekrar eden resim yok" kurallarını
> doğrular, anlam uygunluğunu otomatik olarak ölçmez.

---

## 3. Doğrulama

### 3.1 Otomatik testler — `test/test.html`

Çalıştırma: yerel sunucu (`http://localhost:8124/test/test.html`), Chrome/Edge.
Sonuç: **90/90 geçti**, konsol hatası yok.

| Bölüm | Test | Ne doğrulanıyor |
|---|---|---|
| 1 · Kanonik veri | 9 | 5 grup, resmî sıra, 29 tekil harf, kümülatif 6-12-18-23-29, alfabe dışı harf yok, kelimeler küçük harf, grup ataması, 1. grup harf kümesi, cümle noktalaması |
| 2 · Heceleme | 17 | `aile`, `saat`, `ana`, `anne`, `kalem`, `domates`, `tren`, `göz`, `mutlu`, `yüksek`, `altın`, `ırmak`, `deniz`, `şimşek`, `aslan` + her hecede ünlü + kapalı→açık sıra |
| 3 · Adaptör | 3 | 29 harf, kelime/cümle sayısı kanonikle aynı, `HARF_ADI` kaldırıldı |
| 4 · Havuz/soru | 14 | Grup 1'de 20+ kelime, cümle kapısı, hece havuzu gerçek kelimelerden, `qIlkses` yazı sızdırmıyor, `qHarf` sessiz, `qEksik` ilk harf + tekrar, 300 soruda tip/indeks, tek doğru cevap, grup 1 harf sınırı, resim=kelime, resim tekrarı yok |
| 5 · Fonem | 5 | Ünlü/sessiz ayrımı, 3 sessiz sentezi, ünlünün sentezlenmemesi, manifest yol yapısı |
| 6 · İçerik lint'i | 8 | Kelime/cümle tekrarı, ilk okunabildiği grup ataması, 10 harf sınırı, cümle uzunluğu, rakam/yabancı harf, `heceler` tutarlılığı |
| 7 · Sayfa yükleme | 16 | İki oyunda resmî ön ayarlar, 29 çip, küçük harf, gerçek heceler, TTKB fontu, zoom, **ortak çekirdek fonksiyonları**; Okuyorum ana ekranında iki oyun bağlantısı; `okuma-bayrami` modülleri, fonem, cümle kapısı, hafıza destesi, panel kapsama özeti, yedek yükleme doğrulaması |
| 8 · Çevrimdışılık | 5 | Kök `index.html`, Okuyorum, Okuma Bayramı ve iki oyunda `src`/`href`/CSS `url()`/`performance` kaynaklarında dış `http(s)` isteği yok |

Testler `iframe` ile **gerçek sayfaları** yükler; yani "modül yüklendi mi", "preset
gerçekten 1. grup mu", "oyun içi hece uydurma mı" soruları tarayıcıda ölçülür.

### 3.2 Elle yapılan kontroller (doğrudan gözlem)

- Kök `index.html`: Okuyorum'a yönlendirme; iki oyun ana ekranda; harici istek yok.
- `okuma-bayrami`: 29 harf, grup 1'de 27 kelime / 20 resimli kelime / 24 hece;
  `hecele("aile") = a-i-le`; `cumlelerAcik()` grup 1'de `false`.
- `uygulama`: ana ekranda 6 grup kartı (5 resmî + TÜM SESLER), TTKB fontu hesaplanmış.
- `hece-rallisi` / `ac-canavar`: 5 ön ayar, 29 harf çipi, `__D.harfler = anetil`,
  oyun içi heceler gerçek ve küçük harf; TTKB fontu etkin; yakınlaştırma açık.
- Oyun içi metinlerde taşma kontrolü: kapı ve tabak etiketlerinde `scrollWidth` ≈
  `clientWidth` (font değişiminden sonra kırpılma yok).
- `okuma-bayrami` paneli: kapsama 5 satır (1. grup 27 kelime/24 hece/cümle yok;
  5. grup 211 kelime/246 hece/132 cümle); yedek indir/yükle ve doğrulama elle denendi.
- `file://` (headless Chrome, `--dump-dom`): kök 5 kart; Okuyorum ana ekranı; Okuma
  Bayramı kapsama 5 satır; Hece Rallisi ve Aç Canavar'da 29 harf çipi. Yani klasik
  scriptler ve ilk render `file://` altında çalışıyor.

### 3.3 Doğrulanamayanlar (dürüst sınırlar)

| Konu | Durum | Neden |
|---|---|---|
| Ekran görüntüsü | Alınamadı | `browser.screenshot` "görünür sekme" istiyor; oturumda masaüstü penceresi görünür değil |
| `file://` ile açılış | Kısmen | `browser.tabs.open` `file://` reddediyor. Headless Chrome ile dört sayfa `file:///` üzerinden açıldı: kök 5 kart, Okuyorum ana ekranı, Okuma Bayramı kapsama 5 satır, iki oyunda 29 harf çipi (JS çalışıyor). Etkileşim, ses/TTS, mikrofon ve `localStorage` kalıcılığı `file://` altında denenmedi |
| Akıllı tahta / gerçek dokunmatik | Yapılmadı | Fiziksel cihaz yok |
| Ücretli platformlar (EBA, Okulistik, Morpa, Tonguç) | İncelenemedi | Erişim yok |
| Kayıtlı fonem/hece/kelime sesleri | Kısmen | Fonem Stüdyo ile öğretmen kendi kaydını alıp `kayitlar.js` olarak taşıyabiliyor; dağıtıma hazır 29 fonem + hece/kelime kaydı yok |
| Cümle doğallığı | Otomatik değil | Dilbilimsel denetim insan kararı gerektiriyor |

---

## 4. Müfredat ve pedagoji kontrol listesi

| Kural (`AGENTS.md`) | Durum | Kanıt |
|---|---|---|
| 1. TYMM 2026 esas | ✅ | `GROUPS` sırası resmî programla aynı (test 1) |
| 2. Harf sırası | ✅ | `anetil / okurım / üsöydz / çbgcş / phvğfj` |
| 3. Tırnaksız dik temel, küçük önce | ✅ | Oyunlarda küçük harf; büyük harf yalnız "Küçük–büyük" modunda eş |
| 4. Hece `n` sonrası, kapalı önce | ✅ | `heceSirala` + test; hece havuzu gerçek kelimelerden |
| 5. 1. grupta cümle yok | ✅ | `cumlelerAcik()` ve `uygulama` `gi<1` kapısı; testte iki yönlü |
| 6. Harfleri renkle ayırma yok | ✅ | Hece/kelime metni tek renk; renk yalnız çerçeve/zemin |
| 7. Kelime = resim | ✅ | `qResim`/`qKelime` yalnız emojili kelime; yeni test resim-kelime eşliğini ve tekrarı denetler |
| 8. Ses adı değil fonem | ✅ | `qHarf.say === ""`, `sesFonem`, `Fonem.sentez`; test |
| 9. Somut, doğal cümle | ⚠️ | Banka gözden geçirildi; otomatik denetim yok |
| 10. Erişilebilirlik | ✅ | `aria-live`, `aria-label`, `focus-visible`, `prefers-reduced-motion`, zoom; kod incelemesi + kısmi test |
| 11. Çevrimdışı | ✅ | Dış `src`/`href` yok; font `local()`, ses sentezi/TTS |
| 12. Telif | ✅ | Rakip kod/görsel/ses/metin kopyalanmadı; yalnız ilke |
| 13. Font lisansı | ✅ | Font dosyası depoda yok; `local()` + yedek yığın |
| 14. Test zorunluluğu | ✅ | 90 test; P0/P1/P2/P3 değişiklikleri kapsandı |
| 15. Kapsam disiplini | ✅ | Yeni oyun/etkinlik eklenmedi |

---

## 5. Ses, yazı tipi, erişilebilirlik

### Ses
Sıra: **kayıtlı fonem → WebAudio sentezi → (ünlüde) TTS → sessizlik**.
Sessiz harfte TTS hiç çağrılmaz; böylece "be, ce, de" gibi harf adları oluşmaz.
Hece/kelime/cümle TTS ile okunur. Türkçe ses paketi yoksa ekran metni yedektir.

### Yazı tipi
`assets/font.css` iki `@font-face` tanımlar (normal + kalın) ve `local()` ile cihazda
kurulu **TTKB Dik Temel Abece**'yi seçer. Font yoksa `Segoe UI`/`system-ui`'ye düşer.
Dört uygulamada ve kök `index.html` sayfasında `font-family` bu değişkeni kullanır;
oyunlarda eski `Comic Sans MS` yığını yedek olarak korunmuştur.

> Font dosyası **dağıtılmaz**. Okulda kurulum için hak sahibinden izin gerekir
> (`assets/fonts/README.md`).

### Erişilebilirlik
- Tüm eylemler gerçek `<button>`; `Tab`/`Enter`/`Space` çalışır.
- `:focus-visible` belirgin çerçeve; `prefers-reduced-motion` animasyonları kısar.
- Soru ve bildirim metinleri `aria-live` ile duyurulur.
- Viewport'ta `user-scalable=no` / `maximum-scale=1` **kaldırıldı** (üç girişte).
- Renk tek başına anlam taşımaz: ✓, ses ve metin geri bildirimi birlikte.

### Kurulum paketi (P3)

`araclar/paket-olustur.ps1` yalnız çalışma zamanı dosyalarını toplar:
**24 dosya, 0,11 MB zip**. `test/`, `arastirma/`, `AGENTS.md`, `TASKS.md`, ekran
görüntüleri, geliştirme sunucusu ve TTKB font dosyası pakete girmez. Paket:
`dagitim/HeceParki-1.0.zip` + SHA256 sürüm notu.

- `Baslat.cmd` → `index.html` (varsayılan tarayıcı).
- `Sunucu-Baslat.cmd` → `sunucu.ps1`, yalnız `http://localhost:8123/`; dizin dışına
  çıkış denemesi 403 döner.
- Duman testi: zip bütünlüğü (24/24 dosya hash eşleşmesi), HTTP 200 (kök, Okuyorum,
  iki oyun, çekirdek), `file://` render (Okuyorum ana ekranı; iki oyunda 29 çip;
  kapsama 5 satır), traversal 403.

### Statik web sitesi (P3-5)

`araclar/web-olustur.ps1` aynı çalışma zamanı dosyalarından **21 dosyalık** saf
HTML/CSS/JS site üretir: `dagitim/HeceParki-Web/` + `HeceParki-Web-1.0.zip`.
`.cmd`/`.ps1`, `test/`, `arastirma/`, ekran görüntüleri ve font dosyası yoktur.
Kök `index.html` Okuyorum'a yönlendirir; uygulama ve iki oyun aynı kökenden çalışır.

- Alt klasörde (GitHub Pages benzeri) HTTP testi: Okuyorum ana ekranı + iki oyun kartı,
  iki oyunda 29 çip, `404.html`; konsol hatası yok.
- Bağlantı denetimi: kök-adlı (`/...`) bağlantı yok, tüm yerel `href/src` hedefleri var.
- Dış alan adı taraması: çalışma zamanı dosyalarında dış istek yok.
- Mikrofon için HTTPS/localhost; font yalnız kurulu cihazlarda TTKB, diğerlerinde
  sistem fontu (gömme/dağıtım için yazılı izin gerekir).
- `localStorage`: normal HTTP origin altında yazma → sayfa yenileme → başka sayfada
  okuma doğrulandı. Anahtarlar `GIZLILIK.md` ve `YAYIN.md` içinde listelenir.
- **GitHub Pages:** https://klblip.github.io/hece-parki/ — `main` dalı `/docs`
  klasöründen yayınlandı; ana sayfa 5 kart/18 etkinlik, Hece Rallisi 29 çip,
  özel 404 ve sayfalar arası `localStorage` HTTPS üzerinde doğrulandı.

---

## 6. Açık işler

### P1 durumu
P1'in tamamı kapandı. Otomatikleştirilemeyen tek konu **cümle doğallığı**: lint
yapısal kuralları (uzunluk, tekrar, alfabe, grup) denetliyor; anlam ve bağlam uygunluğu
öğretmen değerlendirmesinde kalıyor.

### P2 (kısmen tamamlandı)
1. ✅ **Ortak oyun çekirdeği:** `hece-rallisi` ve `ac-canavar` betiklerinin %42'si
   birebir aynıydı. Depolama, seslendirme, efekt, konfeti/kalp, kelime-hece havuzu ve
   resmî harf setleri `assets/oyun-cekirdek.js`'e alındı; oyun akışı (kapı/tabak,
   kurulum, skor) her dosyada kaldı. İki oyun da çekirdeği `veri.js` ve `fonem.js`'ten
   sonra yükler.
2. ✅ Kullanılmayan `assets/ortak.js` kaldırıldı (yedek: oturum dışı arşiv).
3. ⚠️ Ses kayıtları: **Fonem Stüdyo** ile öğretmen kendi sesini kaydedip
   `kayitlar.js` olarak taşıyabiliyor (mikrofon → kırpma → 22 kHz WAV). Stüdyo
   kalitesinde, dağıtıma hazır 29 fonem + hece/kelime kaydı henüz yok.
4. Akıllı tahta ve tablette saha testi; `file://` davranışının doğrulanması.
5. ✅ Öğretmen onboarding (`OGRETMEN-BASLANGIC.md`) ve gizlilik/veri notu
   (`GIZLILIK.md`: yerel saklama, mikrofon, silme, KVKK sınırı).

---

## 7. Riskler ve geri alma

| Risk | Etki | Önlem |
|---|---|---|
| TTKB fontu cihazda yok | Düzen kayabilir | Yedek yığın + oyunlarda eski font; taşma testi |
| TTS sesi yok/boğuk | Okuma desteği zayıflar | Fonem sentezi + ekran metni; panelde uyarı |
| Emoji desteği eski cihazda eksik | Resim görünmez | Kelime yazıyla da sunulur; resim sorusu tek başına zorunlu değil |
| Modül ayrımı | Eksik script → boş ekran | `test/test.html` gerçek yükleme testi; `OrtakVeri` yoksa açık hata |
| Ortak çekirdek yüklenmezse | İki oyun açılmaz | `veri.js → fonem.js → oyun-cekirdek.js` sırası; iki oyunda çekirdek fonksiyon testi |
| Veri değişikliği | Eski `localStorage` içeriği | Varsayılan içerik kanonik dosyadan; öğretmen düzenlemeleri `okuyorum_v1` içinde tutulur |

Geri alma: kod tek tek dosya bazında eski sürüme alınabilir; `assets/veri.js` tek
kaynak olduğu için içerik geri alımı tüm uygulamaları birlikte etkiler (bilinçli tasarım).

---

## 8. Sonuç

P0 ve P1'in tamamı ile P2'nin konsolidasyon, onboarding ve gizlilik maddeleri
tamamlandı; Okuyorum ana site, Hece Rallisi ve Aç Canavar entegre; aynı müfredat
kurallarıyla çalışıyor ve bunu **90 otomatik test** doğruluyor. Çevrimdışı kurulum
paketi (`dagitim/HeceParki-1.0.zip`, 24 dosya) ve sunucusuz statik web sitesi
(`dagitim/HeceParki-Web/`, 21 dosya) üretildi; zip bütünlüğü, HTTP/alt klasör,
bağlantı denetimi ve `file://` render duman testlerinden geçti. Kalan işler yeni
özellik değil, **saha kurulumu ve içerik kaydı**dır: akıllı tahtada gerçek kurulum
turu, stüdyo kalitesinde ses kayıtları ve `file://` altında ses/mikrofon/kalıcılık
doğrulaması.
