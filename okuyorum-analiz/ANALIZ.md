# ANALIZ — "Okuyorum İlk Okuma Yazma" Uygulaması

**Kaynak:** https://dersekranda.com/sinif1Sayfalar/okuyorum-online-kullanim.php
**Uygulama kökü (iframe içinde çalışan gerçek adres):** `https://dersekranda.com/veriler/okuyorum/index.html`
**Analiz yöntemi:** Tarayıcı ile canlı gezinti + ekran görüntüleri (`ekrangoruntuleri/`) + ağ (network) istek analizi. Kaynak kodun tümü okunmadı; gözleme dayanır.

> **Telif notu:** Bu rapor yalnızca davranış ve yapısal gözlemleri içerir. Kaynağın görselleri, sesleri ve kodu kopyalanmayacaktır; bizim uygulamamız tamamen özgün olarak yazılacaktır.

---

## 1. Teknoloji ve Genel Mimari

| Konu | Gözlem |
|---|---|
| Teknoloji | ZIM / CreateJS tabanlı **canvas uygulaması** (mantıksal çözünürlük 1440×800) |
| Barındırma | Ana sayfanın içine **iframe** ile gömülü; her etkinlik ayrı klasör, ayrı `index.html` |
| Klasör düzeni | `assetsDosyalar/etkinlikler/{harf}_harfi/{etkinlikAdi}/` + ortak `genelDosyalar/`, `indexGenelDosyalar/` |
| Ses mimarisi | 3 klasör: `sesler/bilgilendirmeSesDosyalari/*.mp3` (etkinlik tanıtım sesleri), `sesler/uygulamaSesleri/*.mp3` (ortak oyun sesleri), `sesler/seslerHeceKelime/*.mp3` (harf–hece–kelime düzeyi kayıtlı sesler) |
| Sürüm kontrolü | URL'lere `?v=20261017…` biçiminde önbellek bozma parametresi ekleniyor |
| Ortak ses havuzu | `dogru.mp3`, `yanlis.mp3`, `yanlis2.mp3`, `alkis.mp3`, `oyun_bitti.mp3`, `tusPress.mp3`, `balonPatlama.mp3`, `bubles.mp3`, `topaVurus.mp3`, `golSevinci.mp3`, `basketSesi.mp3`, `siraBilgisayarda.mp3`, `siraTelefonda.mp3` |
| Bilgi sesleri | Her etkinliğin kendi tanıtım sesi var (ör. `dikteBilgi.mp3`, `metinOkumaBilgi.mp3`, `heceTablosu.mp3`, `carkiFelek.mp3`, `eksikHeceyiBul.mp3`, `elmaBiligi.mp3`, `yarismaBilgi.mp3`, `harfiTanimaBaloncukBilgi.mp3`, `yazmaBilgi.mp3`, `kelimeBaglamaBilgi.mp3`) |
| Kelime sesleri | Harf (a.mp3), hece (al, la, ek…), kelime (elma, kalem, lokum…), cümle/yazım düzeyi (emine, unutma, makine, anneme…) önceden kayıtlı mp3 → **TTS kullanılmıyor, kayıtlı ses dosyaları var** |

**Ortak ekran kalıbı (tüm etkinliklerde):**
- Sol altta **menü (☰)** ve **ev (🏠)** düğmeleri — küçük yuvarlak ikonlar
- Sağ ve solda büyük **ok düğmeleri** — etkinlikler/harfler arasında geçiş
- Üst ortada etkinlik adı "çipi" — bazılarında hoparlör ikonu (tıklayınca bilgi sesi okur)
- Ekranın ortasında genellikle **büyük yeşil oynat (▶) düğmesi** ile oyun başlatma
- Akış: GİRİŞ EKRANI (mod + ayar seçimi) → OYUN EKRANI → BİTİŞ (alkış + oyuna bitti sesi)

---

## 2. Harf Menüsü (a harfi örneği)

Harf ana sayfası: `etkinlikler/{harf}_harfi/anaSayfa/index.html` — harfin kendi etkinlikleri:

1. **tanıma** — harf kartlarını tanıma (4 sayfalık kart akışı; doğru → yeşil + ✓; yanlış → kırmızı geri bildirim; dört kart tamamlanınca otomatik ilerleme) — **canlı test edildi ✓**
2. **harfiTanimaOyunu** — baloncuk oyunu: "Dinle, duyduğun harfin baloncuğuna dokun." (A/a baloncukları; balonPatlama sesi)
3. **harfiTanimaOyunu2** — çoklu seçim: "Dinle, duyduğun harflerin hepsine dokun." (A/a kartları)
4. **yazma / yazmaKucuk** — "Harfi Yazma Animation": harf yazılış animasyonu (a / A)
5. **kumHavuzu** — Kum Havuzu: "Kumun üstüne harfi parmağınla yaz." Dokunmatik kum yazma; renk paleti, silgi, süpürge, el imleci; kılavuzlu/kılavuzsuz harf kartları
6. **yazOynat** — Yaz Oynat: tam **yazma stüdyosu** — renk paleti, çizgi biçimleri (kesikli/düz/ızgara/silme), oynatma hız sürgüsü, hoparlör; sağda "**Kayıtlarım**" (+Kaydet, çöp kutusu) ve "**Hazır Yazımlar**" (a, A, aaaaaaa, AAAAAA) → kendi yazını çiz-kaydet-animasyon olarak oynat
7. **arabaOyunuOkuma** — Araba: hızlı okuma; Süre 50 sn ±; doğru harfi (a/e) seçip arabaya bin
8. **elmaOyunuOkuma** — Elma Toplama: Süre 60 sn ±, Hız 3 kademe; ağaçtan doğru harfli elmaları sepete toplama
9. **heceBirlestirme** — hece + hece → kelime kurma (sürükle-bırak) — **canlı test edildi ✓**

---

## 3. Ortak (Standart) Etkinlikler — `linkListesi.js` listesi

Her harf grubunda tekrar edilen ~22 etkinlik. Kanıt sütunu: **E** = canlı testte davranış doğrulandı, **G** = giriş ekranı + ses kaynakları ile doğrulandı, **?** = belirsiz / iç ekran görülmedi.

| Etkinlik | Amaç | Oyun mekaniği / ayarlar | Kanıt |
|---|---|---|---|
| **Hece-Kelime Okuma** | hece→kelime okuma | Standart listede var; ancak a harfinde klasör **404** döndürdü (adlandırma hatası olabilir) | ? (404) |
| **Dikte** | dinleyerek yazma | Girişte mod kartı: "Harf Harf" (a\|l harf kutucukları); modlar: harf/hece/kelime dikte (`dikteBilgi`, `dikteHeceBilgi`, `dikteKelimeBilgi`); klavye girişi (tusPress sesi) | G |
| **Metin Okuma** | metin okuma + hız takibi | Büyük metin paneli, **harf harf vurgulu ilerleme** (okunan kısım kırmızı), resimler; altta "an/ye" harf düğmeleri (vurgu), oynat ▶, **süre 120 sn ±** | G |
| **Ritmik Okuma** | ritim + okuma | "Dinle, sonra sen de ritimle oku." Hece kartları (la-la-Ela); ritim çembeleri vurgulu; ▶ ile dinleme; **tempo sürgüsü (yavaş↔hızlı)**; 1/3 ilerleme göstergesi | G |
| **Hece Birleştirme** | hece→kelime | Hece parçalarını doğru boşluğa sürükleyip kelime kurma | E |
| **Kelimeleri Dokun-Dinle-Oku** | dokun-dinle-okuma | Listede var (`kelimeleriDokunDinleOku`); iç ekranı görülemedi | ? |
| **Halat Çekme** | yarışma | Giriş: **Arkadaşınla / Bilgisayarla**; `yarismaBilgi`; doğru cevap halat çektirir | G |
| **Araba Yarışı** | yarışma | Arkadaşınla/Bilgisayarla + **Yol 1,2,3,4** + **Hız 3 kademe** | G |
| **Yarışma Futbol** | yarışma | Arkadaşınla/Bilgisayarla + **Süre 45 sn ±** + **Hız 3 kademe**; `siraBilgisayarda`/`siraTelefonda` sıra sesleri, `golSevinci` | G |
| **Piyon Oyunu** | piyonlu tahta oyunu | Arkadaşınla/Bilgisayarla + **Seçenek 3/4** + **Adım 5/10/15** | G |
| **Bal Yapma** | kelime oyunu | Arı + kovan petekleri; doğru harf/heceyi peteklere taşıyarak kelime/bal yapma | G |
| **Küp Atma** | zar oyunu | Zar yüzlerinde kelimeler ("bir", "kasaba"); **Takım: Yok/2/3/4** | G |
| **Baloncuk** | kelime patlatma | Süre 45 sn ±, **Hız 4 kademe**; su altında me/ma baloncukları | G |
| **Kelime Bağlama** | kelime eşleştirme | Büyük oynat düğmesi; `kelimeBaglamaBilgi` | G |
| **Kelime Tahmin** | harf harf tahmin | **Boş harf kutuları** + **tam Türkçe ekran klavyesi** (ı, i, ş, ğ, ü, ö, ç) + **a/A büyük-küçük düğmesi**; harf sesleri (z, ç, b, g, c, ş, p, h, v, ğ, f, j) | G |
| **Çarkıfelek** | çark çevirme yarışması | **Kaç takım: Yok/2/3/4** + "Çıkan kelime çarktan çıksın" anahtar düğmesi; `carkiFelek` | G |
| **Zamana Karşı** | hızlı okuma | **Her soru 20 sn ±**; kelime kartları (a/e, al/el) ekranın iki yanında | G |
| **Kelime Bulmaca** | kareli bulmaca | Harf ızgarasında kelimeleri bulma; kelime listesi **hoparlör ikonlu**; 1/2 ilerleme + nokta göstergeleri | G |
| **Şut Atma** | yarışma | `topaVurus`, `yanlis2`, `golSevinci`; iç ekran yükleme animasyonunda yakalandı | G (yükleme) |
| **Basket Atma** | yarışma | Basket potası; **Atış 5/10**; harf kartları (a/al); `basketSesi`, `topaVurus`, `golSevinci` | G |
| **Hece Treni** | hece birleştirme | Trenin boş vagonlarına (**?**) doğru hece kartını eşleştirme (ek+mek → …) | G |
| **Resimli Bulmaca** | eksik harf | Resim (göz) + eksik harf kutuları (L?L?); dogru/yanlis sesleri | G |
| **Yapboz** | görsel bilişsel | **4 parça / 9 parça** seçenekli yapboz; dogru/yanlis, alkış | G |
| **Eksik Heceyi Bul** | hece tamamlama | Girişte "Eksik Olanları Bul" başlığı + bilgi (hoparlör) ve ileri ok | G |
| **Tavşan Oyunu** | kelime yarışı | "Oyunu başlat" çalışıyor — **tavşan yarışı gamification fikrinin kaynağı** | E |

---

## 4. Hızlı Okuma Bölümü — "Okuyorum Tüm Sesler Online"

`etkinliklerTurkce/hizliOkumaEtkinlikleri/anaSayfa/index.html` — harf grubundan bağımsız, "tüm sesler" düzeyinde **10 hızlı okuma etkinliği:**

1. **1 Dakika Isınma** — 1 dakikalık kronometreyle hızlı okuma
2. **Göz Jimnastiği** — göz ritmi animasyonu
3. **Sıradakini Bul** — rakam ızgarasında sıradakini bulma
4. **Şimşek Kelime** — kelime ("top") bir an görünüp kaybolur; anında okuma
5. **Kelime Piramidi** — piramit satırlarında yukarıdan aşağı okuma
6. **İkiz mi?** — benzer kelimeleri karşılaştırma (masa/kasa)
7. **Kelime Avı** — birebir benzer harf kümeleri arasında doğru kelimeyi bulma
8. **Işıklı Okuma** — vurgulu okuma (Can **top** attı)
9. **Kayan Tekerleme** — kayan metinle okuma
10. **Saçma Cümle Avı** — saçma cümleleri bulup işaretleme

**Kanıt:** menü + etkinlik ikonları doğrulandı; etkinlik iç detayları bu aşamada menü düzeyinde (G).

---

## 5. UX Kalıpları (bizim uygulamaya taşınacak)

1. **Giriş ekranı kalıbı:** Her oyun — mod seçimi *(Bilgisayarla tek / Arkadaşınla 2 oyuncu / Takım 2-4)* + ön ayarlar (süre ±, hız, adım, atış) → tek büyük ▶
2. **Büyük dokunma hedefleri:** oynat düğmesi, ok düğmeleri, süre/hız kademe düğmeleri hep büyük
3. **Ortak geri bildirim sesleri:** doğru → `dogru`, yanlış → `yanlis`/`yanlis2`, oyun sonu → `alkis` + `oyun_bitti`
4. **Sıra bildirimi:** çift oyuncuda `siraTelefonda` / `siraBilgisayarda` ("sıra kimde" sesi)
5. **Mekanik efekt sesleri:** `balonPatlama`, `topaVurus`, `golSevinci`, `tusPress`
6. **İlerleme göstergeleri:** 1/3, 1/2 sayfa göstergeleri ve nokta dizileri
7. **Vurgulu okuma:** metin okurken harf harf renkli vurgu + destekleyici resim
8. **Hız ayarı her yerde:** tempo sürgüsü / 3-4 kademe hız / saniye ± — birinci sınıf akıllı tahta için zorunlu
9. **Yazma kademeleri:** animasyonlu izleme → kum üzerine parmak yazma → kendi yazını kaydet-oynat (stüdyo)
10. **Karakter/gamification motifleri:** tavşan, araba, elma, bale arısı, top/pota, tren — ilerleme ödüllendirme (görsel ödül: fazla elma, daha uzak araba, daha çok bal)

---

## 6. Doğrulanmışlar / Belirsizler

### Canlı testte kesinleşenler ✅
- tanıma kart akışı (yeşil/✓ doğru, kırmızı/yanlış geri bildirimi, otomatik ilerleme)
- heceBirlestirme sürükle-bırak görsel tepkisi
- tavsanOyunu "oyunu başlat" düğmesi
- cumleOkuma düğme akışı
- Tüm etkinlikler giriş ekranı açıyor; bilgi sesleri ağ kayıtlarında mp3 olarak netleşti
- Kelime Tahmin ekran klavyesi; Çarkıfelek takım seçimi; araba yarışı yol/hız; futbol süre; piyon adım/seçenek; yapboz parça sayısı; zamana karşı saniye; baloncuk süre+hız
- Kum yazma ve Yaz Oynat stüdyosu görsel doğrulandı

### Belirsiz / doğrulama gerektirenler ❓
- `heceKelimeOkuma` klasörü 404 (adlandırma hatası olabilir)
- Programatik tıklamalar bazı oyunların iç ekranına geçişi tetiklemedi; oyunun oynanış iç akışı (puanlama detayı, seviye ilerlemesi) içinse doğrulanamadı
- Yapboz, Eksik Olanları Bul, Şut Atma içerikleri yalnız giriş/yükleme düzeyinde görüldü
- Hızlı Okuma 10 etkinliğin iç oynanışları menü düzeyinde
- `kelimeleriDokunDinleOku` iç ekranı görülmedi
- Dikte oyunu içi klavye-yazma akışı ve Çarkıfelek oyun içi döngüsü doğrulanmadı

### Ortak ana bulgu
Ses dosyaları harici servis değil **statik mp3 seti** → bizim uygulamada kendi kayıtlı seslerimizle **tam offline** çalışmak mümkün.

---

## 7. Bizim Uygulamamıza Taşınacaklar (Önerilen Liste)

1. **Tek HTML dosyası / basit dosya kümesi** — internet olmadan çalışsın (offline-first)
2. **Ses grubu seçimi:** ANETİL, OKURIM, ÜSÖYDZ, ÇBGCŞ, PHVĞFJ + "Tüm Sesler" — büyük harf sekme düğmeleri
3. **Etkinlik kütüphanesi** (her ses grubunda sıralı):
   - **Harf tanıma:** tanıma kartları, baloncuk patlatma, çoklu-dokunma oyunu
   - **Yazma:** yazılış animasyonu izle → kum havuzu parmak yazma (canvas) → serbest yazma stüdyosu
   - **Hece → kelime:** hece treni, hece birleştirme (sürükle-bırak), eksik heceyi bul
   - **Kelime → cümle/metin:** metin okuma (vurgulu ilerleme), ritmik okuma (tempo sürgüsü), dikte modları
   - **Oyunlar:** baloncuk (süre+hız), elma toplama, araba yarışı (yol/hız), basket/şut (atış), halat çekme, küp atma, kelime bulmaca, kelime tahmin (Türkçe klavye), yapboz (4/9 parça)
4. **Tek/Çift oyuncu modları** her yarışma oyununda ("Bilgisayarla" / "Arkadaşınla") + takım (2/3/4) seçenekleri
5. **Ön ayarlar:** süre ± (20-120 sn), hız 3-4 kademe, adım/atış sayısı, a/A büyük-küçük harf düğmesi
6. **Sesler (özgün, kayıtlı):** bilgi sesleri (her etkinlik için), doğru/yanlış/alkış/oyun bitti, sıra bildirimi, mekanik efektler (balon patlama, top vuruşu, gol sevinci) — **TTS değil, önceden kayıt**
7. **Gamification — Tavşan Yarışı:** tüm oyunlardan kazanılan puanlar tavşanı parkurda ileri taşır (bizim orijinal katkı)
8. **UI:** büyük dokunma düğmeleri, ☰/🏠 köşe düğmeleri, ok düğmeleriyle grup/harf geçişi, bilgi çipleri, ilerleme noktaları — çocuk için net, basit ve renkli
9. **Görsel destek:** vurgulu metin okuma, kesikli yol çizgileri gibi çocuğa yol gösteren ipuçları
10. **Yazma kaydı:** yazOynat benzeri kendi yazını kaydet-oynat — **localStorage** tabanlı, dışa paylaşım yok

---

## 8. Ekran Görüntüleri (`ekrangoruntuleri/`)

| Dosya | İçerik |
|---|---|
| 01-ana-ekran.png | Okuyorum ana menü |
| 02-dikte-giris.jpeg | Dikte giriş ekranı (Harf Harf kartı) |
| 03-metin-okuma-giris.jpeg | Metin okuma (vurgulu okuma, 120 sn, an/ye) |
| 04-ritmik-okuma-giris.jpeg | Ritmik okuma (la-la-Ela, tempo sürgüsü) |
| 06-halat-cekme-giris.jpeg / -tiklama | Arkadaşınla/Bilgisayarla |
| 07-araba-yarisi-giris.jpeg | Yol 1-4 + Hız |
| 08-yarisma-futbol-giris.jpeg | Süre 45 + Hız |
| 09-piyon-oyunu-giris.jpeg | Seçenek 3/4 + Adım 5/10/15 |
| 10-bal-yapma-giris.jpeg | Arı/kovan kelime oyunu |
| 11-kup-atma-giris.jpeg | Takım Yok/2/3/4 |
| 12-baloncuk-giris.jpeg | Süre 45 + Hız 4 kademe |
| 13-kelime-baglama-giris.jpeg | Büyük oynat düğmesi |
| 14-kelime-tahmin-giris.jpeg | Türkçe ekran klavyesi + boş kutular |
| 15-carcik-felek-giris.jpeg | Kaç takım oynuyor? |
| 16-hizli-okuma-zaman-giris.jpeg | Zamana Karşı 20 sn |
| 17-kelime-bulmaca-giris.jpeg | Kelime listesi hoparlör + ızgara |
| 18-sut-atma-yukleniyor.jpeg | Yükleme çipi |
| 19-basket-atma-giris.jpeg | Atış 5/10, pota, harf kartları |
| 20-hece-treni-giris.jpeg | Tren + (?) vagonlar + ek/mek |
| 21-resimli-bulmaca-giris.jpeg | Göz resmi + L?L? kutular |
| 22-puzzle-giris.jpeg | 4/9 parça seçimi |
| 23-eksik-heceyi-bul-giris.jpeg | Başlık + bilgi ikonu |
| 24-harfi-tanima-1-baloncuk.jpeg | A/a baloncukları |
| 25-harfi-tanima-2-coklu.jpeg | A/a kartları (hepsine dokun) |
| 26-yazma-yukleniyor.jpeg | Yazma yükleniyor |
| 28-kum-havuzu.jpeg | Kum yazma arayüzü (a/A kartı, palet, silgi, süpürge) |
| 29-yaz-oynat-studyo.jpeg | Yazma stüdyosu (renk, çizim, Kayıtlarım, Hazır Yazımlar) |
| 30-araba-oyunu-giris.jpeg | Süre 50, harf kartları a/e |
| 31-elma-toplama-giris.jpeg | Süre 60, Hız kademe, ağaç+sepet |
| 32-tum-sesler-hizli-okuma-menu.jpeg | Hızlı Okuma 10 etkinlik menüsü |

(Not: 05 numarası 404 veren heceKelimeOkuma'ya, 27 numarası yazmaKucuk yükleme karesine ayrılmıştı — kaydedilmedi.)

---

*Sonraki adım: kullanıcı onayı sonrası 7. bölümdeki çerçevede özgün uygulama (HTML/CSS/JS) geliştirilecek.*
