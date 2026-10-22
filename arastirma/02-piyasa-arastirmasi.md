# Aşama 2 — Pazar Araştırması: Türkiye’de 1. Sınıf İlk Okuma-Yazma Dijital Kaynakları

**Tarih:** 21 Ekim 2026  
**Kapsam:** Türkiye’de ücretsiz/ücretli, tarayıcı tabanlı 1. sınıf ilk okuma-yazma oyunları ve etkinlik siteleri  
**Amaç:** Rakip ürünlerin ne yaptığını, hangi pedagojik ve teknik tercihleri kullandığını, nerede boşluk bıraktığını **kopyalamadan** anlamak.

> **Telif ve etik:** Bu raporda hiçbir sitenin kodu, görseli, sesi, metni veya tasarımı kopyalanmadı. Yalnızca davranış, yapı ve ilke düzeyinde gözlem yapıldı. Ekran görüntüleri yalnızca kanıt amacıyla depoda tutuluyor; ürüne taşınmayacak.

---

## 0. Kanıt etiketleri ve yöntem

| Etiket | Anlamı |
|---|---|
| **D** | Doğrudan gözlem: canlı gezinme, tıklama, ağ isteği, ekran görüntüsü |
| **S** | Kaynak metni: sitenin kendi sayfası, yayın tarihi, iddiası |
| **K** | Kod/teknik kanıt: HTML/JS/network izi |
| **E** | Uzman yorumu |
| **A** | Doğrulanmamış varsayım |

**Yöntem:** İki site derinlemesine; diğerleri yüzeysel tarandı. Derinlemesine incelemede ana sayfa, grup sayfası, oyun listesi, en az bir oyun içi akış ve ağ istekleri gözlendi. Oyun içi mekaniklerin bir kısmı (özellikle canvas/ZIM tabanlı olanlar) yalnızca giriş ekranı düzeyinde kaldı; bu yerlerde **?** kullanıldı.

**Önemli sınırlama:** Bu oturumda `browser.screenshot` çalışmadı (“Screenshot needs a visible tab”). Bu nedenle görsel tasarım, renk, tipografi ve yerleşim karşılaştırmaları sınırlıdır; mevcut depo görüntüleri ve DOM/ağ kanıtları kullanıldı.

---

## 1. Manzara: ne tür ürünler var?

Türkiye’de 1. sınıf ilk okuma-yazma dijital kaynakları kabaca beş kümeye ayrılıyor:

1. **Öğretmen siteleri / bağımsız oyun platformları:** Dersekranda, Ramazan Öğretmen, Haluk Özyurt gibi. Ücretsiz, reklamlı veya kısmen reklamsız; çoğu tarayıcı tabanlı; sınıf tahtasına yönelik.
2. **Yayıncı/platform abonelikleri:** Okulistik, Morpa Kampüs, Tonguç Akademi gibi. Üyelik/ödeme duvarı; bu aşamada derinlemesine denetlenmedi.
3. **MEB/EBA ekosistemi:** EBA, ODSGM fasikülleri, ders kitapları. Rol tabanlı erişim veya PDF; etkileşimli oyun deneyimi sınırlı.
4. **Çalışma kağıdı/PDF siteleri:** ilkokul.net, ilkokuldokumanlari.com, mebders.com gibi. Etkileşimli değil; ama içerik ve sıralama açısından rakip.
5. **Mobil uygulamalar:** App Store/Google Play’de harf/hece uygulamaları. Üyelik, reklam ve cihaz kısıtları; bu aşamada denetlenmedi.

Bu raporun derinlemesine kısmı 1. kümedeki iki temsilciye odaklanıyor; çünkü bizim ürünümüz de aynı kümede: **ücretsiz, tarayıcı tabanlı, akıllı tahtada çalışan, öğretmen dostu** bir araç olacak.

---

## 2. Dersekranda — “Okuyorum İlk Okuma Yazma Online”

### 2.1 Kimlik ve erişim

- **Ana sayfa:** `https://dersekranda.com/`
- **Uygulama tanıtımı:** `https://dersekranda.com/sinif1Sayfalar/okuyorum-online-kullanim.php`
- **Uygulama kökü (iframe içinde):** `https://dersekranda.com/veriler/okuyorum/index.html`
- **1. grup sayfası:** `https://dersekranda.com/1-grup-sesleranetil-online/`
- **Kategori:** `https://dersekranda.com/category/okuyorum-ilk-okuma-yazma-online/`
- **Sayfa tarihi:** “Yayımlanmış 21 Ağustos 2025; güncellenmiş 8 Eylül 2025” (S; sayfa üzerindeki tarih).
- **Erişim:** Ücretsiz, üyeliksiz; akıllı tahta/tablet/bilgisayar/telefon iddiası (S).

### 2.2 Envanter (D + S + K)

| Boyut | Gözlem |
|---|---|
| Harf grupları | 5 resmî grup: ANETİL, OKURIM, ÜSÖYDZ, ÇBGCŞ, PHVĞFJ (S/D) |
| Grup 1 sayfası | 6 harf bağlantısı: A, N, E, T, İ, L (D) |
| Harf başına etkinlik | Yaklaşık 22 etkinlik (D; `okuyorum-analiz/ANALIZ.md`) |
| Etkinlik kapsamı | Tanıma, baloncuk, çoklu seçim, yazma animasyonu, kum havuzu, yaz oynat, araba, elma toplama, hece birleştirme, dikte, metin okuma, ritmik okuma, halat çekme, araba yarışı, futbol, piyon, bal yapma, küp atma, baloncuk, kelime bağlama, kelime tahmin, çarkıfelek, zamana karşı, kelime bulmaca, şut, basket, hece treni, resimli bulmaca, yapboz, eksik hece, tavşan (D/G) |
| Hızlı okuma | 10 ayrı etkinlik: 1 dakika ısınma, göz jimnastiği, sıradakini bul, şimşek kelime, kelime piramidi, ikiz mi?, kelime avı, ışıklı okuma, kayan tekerleme, saçma cümle avı (D/G) |
| Teknoloji | ZIM/CreateJS tabanlı canvas; mantıksal 1440×800; iframe içinde; her etkinlik ayrı klasör (K/D) |
| Ses | Önceden kayıtlı MP3 seti: tanıtım sesleri, ortak efektler, harf/hece/kelime sesleri; TTS yok (K/D) |
| Çevrimdışı | “Uygulamayı indir” seçeneği var; indirilen sürümün tam çevrimdışı davranışı bu oturumda doğrulanmadı (S/? ) |
| Erişilebilirlik | Canvas tabanlı; klavye/ekran okuyucu desteği gözlenmedi; küçük yuvarlak ikon düğmeler (D/E) |

### 2.3 Gözlemlenen güçlü yönler

- **Kapsam ve tekrarlanabilirlik:** Her harf için aynı 22 etkinlik iskeleti; öğretmen bir kez öğrenince tüm harflerde aynı düzeni kullanabiliyor. Bu, bilişsel yükü azaltıyor (E).
- **Kayıtlı ses:** Harf/hece/kelime sesleri MP3 olarak hazır. TTS’in harf adı/fonem belirsizliği yok; telaffuz tutarlılığı yüksek (D/K).
- **Geniş oyun yelpazesi:** Tanıma, yazma, birleştirme, dikte, metin okuma, hızlı okuma ve rekabet oyunları bir arada. Öğretmenin farklı ders aşamaları için seçenek var (E).
- **Ortak ekran kalıbı:** Sol alt menü/ev, sağ-sol oklar, üstte etkinlik adı, ortada büyük oynat. Çocuk için öngörülebilir (D/E).
- **Hız/süre ayarları:** Neredeyse her oyunda süre ±, hız kademesi, adım/atış sayısı. Akıllı tahta için gerekli (E).
- **Yazma kademeleri:** Animasyon → kum → stüdyo; motor beceriden bağımsız yazma pratiği (E).

### 2.4 Gözlemlenen zayıf yönler / riskler

- **Canvas erişilebilirliği:** Metin DOM’da değil; ekran okuyucu ve klavye kullanıcısı için ciddi bariyer (D/E). WCAG açısından 1.1.1, 1.3.1, 2.1.1, 4.1.2 riskleri.
- **Iframe + ayrı klasör mimarisi:** Öğretmenin tek dosyayla taşıması zor; bağlantı kırılmaları ve sürüm karışıklığı riski (E).
- **Reklam/izleme durumu doğrulanmadı:** Ana sayfada ücretsiz/üyeliksiz deniyor; ancak reklam ve üçüncü taraf izleme durumu bu oturumda ölçülmedi. **?**
- **Aşırı uyaran:** Aynı ekranda çok sayıda ikon, ok, çip ve animasyon; 1. sınıf için dikkat dağıtıcı olabilir (E; görsel doğrulama sınırlı).
- **Cevap sızıntısı riski:** Bazı etkinliklerde yazılı hedef + görsel aynı anda verilebilir; bu oturumda tüm etkinlikler tek tek doğrulanmadı. **?**
- **Müfredat etiketi:** 5 grup doğru; ancak her etkinliğin yalnızca öğretilmiş harfleri kullanıp kullanmadığı denetlenmedi. **?**
- **“İndir” vaadi:** İndirilen paketin sesleri ve etkinlikleri gerçekten kapsayıp kapsamadığı doğrulanmadı. **?**

### 2.5 Bizim için ilke düzeyinde çıkarımlar

1. **Tek iskelet, çok etkinlik:** Aynı gezinme ve geri bildirim kalıbı, öğretmenin bilişsel yükünü azaltır.
2. **Kayıtlı ses, tutarlı telaffuz:** Fonem/hece/kelime sesleri önceden kaydedilmeli; TTS yalnız yedek olmalı.
3. **Ayarlanabilir zorluk:** Süre, hız, adım, harf seti öğretmenin elinde olmalı.
4. **Yazma kademeleri:** İzle → kum → serbest stüdyo ilerlemesi pedagojik olarak sağlam.
5. **Her oyunda tek bir öğrenme hedefi:** Aynı anda harf tanıma + kelime okuma + hız yarışı yapılmamalı.
6. **Erişilebilirlik sonradan eklenmemeli:** Canvas yerine DOM tabanlı, klavye ve ekran okuyucu dostu bileşenler seçilmeli.

---

## 3. Ramazan Öğretmen — 1. Sınıf İlk Okuma Yazma Oyunları

### 3.1 Kimlik ve erişim

- **Site:** `https://www.ramazanogretmen.com/`
- **1. sınıf oyun dizini:** `https://www.ramazanogretmen.com/oyunlar/1-sinif`
- **İlk okuma-yazma yolu:** `/oyunlar/1-sinif/ilk-okuma-yazma`
- **Teknoloji:** Next.js tabanlı site; sayfa kaynağında Next.js izleri; AdSense, Yandex reklamları, Google Tag Manager, Yandex Metrika, Cloudflare (K).
- **Erişim:** Ücretsiz; sayfa “%100 Ücretsiz ve Reklamsız” iddiasında (S).

### 3.2 Envanter

- Bu oturumda ilk okuma-yazma listesinde **38 oyun bağlantısı** sayıldı: 29 harf oyunu + 9 ek oyun (D).
- Ancak 1. sınıf oyun dizinindeki “İlk Okuma Yazma” kartı **“2 OYUN”** gösteriyor (S; 21.10.2026). Bu tutarsızlık, sayfanın dinamik/kişiselleştirilmiş veya kademeli yükleniyor olmasından kaynaklanabilir. **A**; kesin sayı için tekrar ölçüm gerekir.
- Oyunların bir kısmı harf bazlı (“N Sesi”, “İ Sesi” vb.), bir kısmı beceri bazlı (“Ses Birleştirme”, “Harfin Yeri Nerede?”, “Hece Çarkı”).
- Site, “MEB 2026-2027 Maarif Modeli” ve “tam uygunluk” iddiasında (S). Bu iddia bağımsız olarak doğrulanmadı.

### 3.3 Vaka: “Harfin Yeri Nerede?” (D)

Bu oyun canlı olarak açıldı ve gözlendi:

| Gözlem | Ayrıntı |
|---|---|
| Soru sayısı | 9 soru |
| Puan | Her soru 10 puan |
| Etiket | “ANETİL” / “1. Grup” |
| 1. soru | Görsel: `nar.webp`; yazılı kelime: “Nar”; seçenekler: BAŞTA / ORTADA / SONDA |
| Yanlış cevap | “Tekrar dene!”; ek açıklama/ipucu yok |
| Geri bildirim süresi | Bir sonraki kelime (“Limon”) yüklenirken önceki geri bildirim ekranda kalıyor (stale feedback) |
| Harf kümesi | `nar` ve `limon` kelimeleri ANETİL dışı harfler içeriyor: `r`, `m`, `o` |
| Etiket iddiası | Sayfa “%100 uyumlu” diyor; gözlem bunu desteklemiyor |

**Pedagojik değerlendirme (E):**
- “Harf nerede?” etkinliği, sesin kelimedeki konumunu fark ettirmek için değerli bir fonolojik farkındalık görevidir.
- Ancak hedef harf `n` ise, `nar` uygun; `limon` da `n` içeriyor ama `m,o` gibi öğretilmemiş harfler var. 1. grupta “sadece öğretilen harfler” ilkesi ihlal edilmiş.
- Yazılı kelimenin gösterilmesi, “harfin yeri” görevini görsel taramaya indirgiyor; çocuk kelimeyi okumadan da `n` harfini arayabilir. Bu, hedeflenen fonolojik farkındalığı zayıflatır.
- “Tekrar dene!” tek başına düzeltici geri bildirim değil; çocuk neyi yanlış yaptığını öğrenmiyor. Hattie & Timperley (2007) anlamında “feed-forward” yok.
- Eski geri bildirimin yeni kelimeyle aynı anda görünmesi, çalışma belleğinde karışıklık yaratır (E).

### 3.4 Vaka: “Ses Birleştirme Oyunu” (S + ?)

Sayfa metni (S):
- “1. Grup (ANETİL) A, N ve E seslerinin fonolojik birleşimini sağlamak.”
- “8 kademeli fonolojik birleştirme parkuru.”
- “AN, NA, ANA; EN, NE, NENE, NANE, ANNE.”
- “Gerçekçi demiryolu ve buharlı tren fiziği”, “Türkçe sesli okuma.”
- “%100 Ücretsiz ve Reklamsız.”

**Gözlem:** Bu oturumda oyun arayüzü açılmadı; yalnızca tanıtım metni görüldü. Bu nedenle mekanik, ses kalitesi ve gerçekten çevrimdışı olup olmadığı **doğrulanmadı** (?).

**Yorum (E):** Sayfa metnindeki hece sırası pedagojik olarak makul: kapalı heceler (`an`, `en`) ve açık heceler (`na`, `ne`) birlikte; `ana`, `nene`, `nane`, `anne` gibi anlamlı kelimeler. Ancak metin “A, N ve E” diyor; `T` ve `İ` henüz yokken `nane`/`anne` gibi kelimelerde `e` var, sorun yok; `anne` iki hece. Bu, “n’den sonra hece” kuralıyla uyumlu görünüyor. Yine de **görsel/işitsel doğrulama olmadan** başarılı sayılmamalı.

### 3.5 Reklam ve izleme çelişkisi (D/K)

- Sayfa “Reklamsız” diyor; ancak sayfa kaynağında **AdSense**, **Yandex reklamları**, **Google Tag Manager**, **Yandex Metrika** ve **Cloudflare** izleri var.
- Bu, sınıf içi kullanımda üç risk doğurur:
  1. **Dikkat:** Reklam görselleri çocuğun odağını dağıtır.
  2. **Gizlilik:** Üçüncü taraf izleme, öğrenci/öğretmen verisi toplayabilir.
  3. **Güven:** “Reklamsız” iddiası ile teknik gerçek çelişiyor; öğretmenin siteye güveni zedelenir.
- Reklamların görünürlüğü ve izleme çerezlerinin niteliği bu oturumda ayrıntılı ölçülmedi; ancak varlığı yeterli bir uyarı işareti. **E**

### 3.6 Gözlemlenen güçlü yönler

- **Geniş ve güncel içerik:** 29 harf oyunu + ek oyunlar; 2026 programına atıf.
- **Harf bazlı ilerleme:** Öğretmenin sınıfın geldiği harfe göre oyun seçmesi kolay.
- **Somut görselleştirme:** 3D illüstrasyonlar, tren, çark gibi çocuk ilgisini çeken temalar (S).
- **Kısa oyun döngüleri:** 9 soru / 10 puan gibi küçük oturumlar; ders içinde parça parça kullanılabilir.
- **Mobil/akıllı tahta uyumu iddiası:** Büyük dokunmatik butonlar (S; doğrulanmadı).

### 3.7 Gözlemlenen zayıf yönler

- **Etiket-doğruluk uyuşmazlığı:** “ANETİL” etiketi altında ANETİL dışı harfler; “%100 uyumlu” iddiası.
- **Cevap sızıntısı:** Yazılı kelime + görsel aynı anda; görev görsel aramaya dönüşüyor.
- **Zayıf geri bildirim:** “Tekrar dene!” açıklamasız; düzeltici ipucu yok.
- **Stale feedback:** Yeni soru yüklenirken eski geri bildirim görünür.
- **Reklam/izleme:** “Reklamsız” iddiasıyla çelişen üçüncü taraf kodlar.
- **Ölçüm eksikliği:** Oyun içi tüm mekanikler, ses kalitesi ve çevrimdışı davranış doğrulanmadı.
- **Erişilebilirlik:** Bu oturumda klavye/ekran okuyucu desteği gözlenmedi; görsel doğrulama sınırlı.

---

## 4. Diğer erişilebilir kaynaklar (yüzeysel tarama)

Bu kaynaklar derinlemesine denetlenmedi; yalnızca pazarın çeşitliliğini göstermek için listelendi.

| Kaynak | Tür | Gözlem | Kanıt |
|---|---|---|---|
| `halukozyurt.com.tr/games/class/1` | Öğretmen sitesi / oyun dizini | 65 oyun; harf hissettirme, ses bulma, hece/kelime okuma, cümle okuma, adam asmaca vb. | S (sayfa) |
| `ilkokul.net/1-grup-anetil/` | Etkinlik dizini | ANETİL grubu; harf bazlı etkinlik bağlantıları | S |
| `ilkokuldokumanlari.com/okuma-metinleri/` | PDF/okuma metinleri | 2025-2026 metinleri; ANETİL okuma metinleri | S |
| `mebders.com` | PDF/çalışma kağıdı | 1. sınıf okuma metinleri, boyama, kes-yapıştır | S |
| `odsgm.meb.gov.tr` | Resmî fasikül | 2024 tarihli fasiküllerde eski sıra: `A-N-E-T`, `İ-L-O-K-U`... | S |
| EBA | Resmî platform | Rol/oturum gerektirir; bu aşamada denetlenmedi | ? |
| Okulistik / Morpa Kampüs / Tonguç | Abonelik platformları | Üyelik/ödeme duvarı; bu aşamada denetlenmedi | ? |
| App Store / Google Play uygulamaları | Mobil | Mağaza/hesap gerektirir; bu aşamada denetlenmedi | ? |

**Önemli gözlem (S):** ODSGM’nin 2024 tarihli 1. sınıf fasiküllerinde harf sırası `A-N-E-T`, `İ-L-O-K-U`, `R-I-M-Ü-S`, `Ö-Y-D-Z`, `Ç-B-G-C-Ş-P`, `H-V-Ğ-F-J` biçiminde. Bu, 2026 programının `a,n,e,t,i,l` / `o,k,u,r,ı,m` sırasından **farklı**. Piyasada eski materyaller hâlâ dolaşımda; öğretmenlerin kafası karışabilir. Bizim ürünümüz 2026 sırasını açıkça etiketlemeli ve “güncel program” rozeti taşımalı.

---

## 5. Erişilemeyen kaynaklar ve sınırlamalar

| Kaynak | Neden erişilemedi | Bu rapora etkisi |
|---|---|---|
| EBA | Rol/oturum gereksinimi; canlı gezinme yapılamadı | Resmî dijital içerikle karşılaştırma eksik |
| Okulistik | Üyelik/ödeme duvarı | Ücretli pazarın içerik derinliği bilinmiyor |
| Morpa Kampüs | Üyelik/ödeme duvarı | Aynı |
| Tonguç Akademi | Üyelik/ödeme duvarı; yoğun reklam/ürün yapısı | Aynı |
| App Store / Google Play | Hesap/mağaza arayüzü; tarayıcıdan içerik incelemesi sınırlı | Mobil pazarın mekanikleri bilinmiyor |
| Ramazan “Ses Birleştirme” oyun içi | Oyun arayüzü açılmadı | Mekanik/ses/çevrimdışı doğrulanmadı |
| Dersekranda bazı canvas etkinlikleri | Programatik tıklama iç ekrana geçmedi | Oyun içi puanlama/ilerleme doğrulanmadı |

**Genel sınırlama:** Pazar payı, trafik, kullanıcı memnuniyeti ve gelir verileri bu raporun kapsamı dışında. Bu rapor **ürün gözlemi** ve **pedagojik/teknik analiz**tir; pazar büyüklüğü iddiası taşımaz.

---

## 6. Karşılaştırma matrisi

**Puanlama:** 1 = zayıf, 5 = güçlü; `?` = doğrulanmadı. Puanlar kanıta dayalı uzman yorumudur (E), mutlak gerçek değildir.

| Ölçüt | Dersekranda | Ramazan Öğretmen | Bizim mevcut proje | Not |
|---|---:|---:|---:|---|
| Resmî 2026 grup sırası | 4 | 2 | 2 | Dersekranda 5 grup doğru; Ramazan etiketleri tutarsız; bizde `ı` eksik |
| 29 harf bütünlüğü | 4 | 4 | 2 | Bizde 28 |
| Fonem/hece ses kalitesi | 5 | 3? | 2 | Dersekranda kayıtlı MP3; bizde TTS |
| Etkinlik çeşitliliği | 5 | 5 | 4 | 22/letter + 10 hızlı okuma; 38 oyun; bizde 21 kabuk |
| Geri bildirim kalitesi | 4 | 2 | 3 | Ramazan’da açıklamasız “Tekrar dene!” |
| Cevap sızıntısı yokluğu | 3? | 1 | 2 | Ramazan’da yazılı kelime + görsel; bizde `qIlkses` |
| Erişilebilirlik | 1 | 1? | 2 | Canvas/DOM dışı; bizde de eksik |
| Çevrimdışı | 3? | 2? | 5 | Bizde 0 harici istek (kök hariç) |
| Reklam/izleme yokluğu | 3? | 1 | 5 | Ramazan’da AdSense/Yandex/GTM/Metrika |
| Öğretmen araçları | 3 | 1? | 4 | Bizde panel + içerik düzenleme |
| İçerik doğallığı | 4? | 3? | 2 | Bizde “Kul mutlu.” gibi cümleler |
| Akıllı tahta uyumu | 5 | 4? | 4 | Büyük hedefler; F11 |
| Mobil uyum | 3? | 3? | 2 | `user-scalable=no`, dikey kısıt |
| Sürdürülebilirlik / bakım | 3 | 3 | 2 | Bizde üç kopya, 194 satır tekrar |
| Özgünlük / telif riski | — | — | 5 | Bizim kod özgün; rakiplerden kopya yok |

**Matrisin okunuşu:**
- Dersekranda **içerik ve ses**te güçlü; **erişilebilirlik ve sürdürülebilirlik**te zayıf.
- Ramazan **kapsam ve görsel çekicilik**te güçlü; **doğruluk, geri bildirim ve reklamsızlık**ta zayıf.
- Bizim proje **çevrimdışı, öğretmen araçları ve özgünlük**te güçlü; **müfredat doğruluğu, ses ve içerik**te zayıf.
- Kimse dört ekseni birlikte tutturamıyor: **doğru müfredat + kayıtlı ses + erişilebilirlik + reklamsız çevrimdışı**. Fırsat burada.

---

## 7. İlke düzeyinde çıkarımlar (kopyalamadan)

Aşağıdakiler rakip ürünlerin **düzeninden** çıkarılmış ilkelerdir; hiçbir görsel/kod/metin kopyalanmadı.

### 7.1 Öğretmen için

1. **Tek giriş, tek iskelet:** Öğretmen bir kez “grup → harf → etkinlik” akışını öğrenmeli; her oyunda yeni gezinme olmamalı.
2. **Ayarlar görünür ve kalıcı:** Süre, hız, harf seti, soru sayısı; bir kez seçilince hatırlanmalı.
3. **Sınıf yönetimi:** Öğrenci seçme, sıra takibi, rekor tablosu; öğretmenin sınıf ritüeline uymalı.
4. **Tek dosya / kolay taşıma:** Akıllı tahtadan tahtaya kopyalanabilmeli; kurulum gerektirmemeli.
5. **Ders planına oturma:** 10-15 dakikalık oturumlar; her oturumda tek hedef.

### 7.2 Çocuk için

6. **Büyük hedef, az seçenek:** Bir ekranda 2-4 dokunma hedefi; ince motor zorlanmamalı.
7. **Ses + görsel + yazı birlikte değil, sıralı:** Aynı anda üç kanal vermek yerine önce dinle, sonra gör, sonra oku.
8. **Hata tolere edilmeli:** Yanlışta ceza değil, ipucu ve tekrar; “tekrar dene” yeterli değil.
9. **Somut ve anlamlı içerik:** 1. sınıf için soyut kelimeler (“nitel”, “paha”) ve bozuk cümleler (“Kul mutlu.”) kullanılmamalı.
10. **Kısa döngü:** 5-10 soru; bitişte net bir kazanım ve küçük bir kutlama.

### 7.3 Teknik için

11. **Kayıtlı ses > TTS:** Fonem, hece ve kelime için önceden kayıt; TTS yalnız yedek.
12. **DOM tabanlı erişilebilirlik:** Canvas yerine HTML düğmeler; `aria-label`, `aria-live`, `focus-visible`.
13. **Çevrimdışı önce:** Harici font/CDN yok; tüm varlıklar yerel.
14. **Tek veri kaynağı:** Harf grupları, kelimeler, heceler tek modülden; üç kopya yok.
15. **Test edilebilir motor:** `hecele()`, aşama kapısı, soru üretimi birim testli.

---

## 8. Pazar boşlukları ve fırsatlar

| Boşluk | Kanıt | Fırsat |
|---|---|---|
| **Doğru müfredat + güncel etiket** | Ramazan’da ANETİL dışı harfler; bizde `ı` eksik; eski fasikül sırası dolaşımda | “2026 programına tam uyumlu” rozeti + denetlenebilir grup verisi |
| **Fonem doğruluğu** | Dersekranda kayıtlı MP3; bizde TTS; `HARF_ADI` harf adı | Kayıtlı fonem/hece seti; “harf adı değil, ses” ilkesi |
| **Cevap sızıntısı yok** | Ramazan’da yazılı kelime + görsel; bizde `qIlkses` | Görseli yalnız ipucu olarak kullan; cevabı gizle |
| **Anlamlı geri bildirim** | Ramazan’da açıklamasız “Tekrar dene!” | “İlk sesi düşün”, “Heceyi birlikte oku” gibi ipuçları |
| **Reklamsız / izlemesiz** | Ramazan’da AdSense/Yandex/GTM/Metrika | “Sınıfta reklamsız, veri toplamaz” konumlandırma |
| **Erişilebilirlik** | Canvas tabanlı rakipler; bizde de eksik | Klavye + ekran okuyucu + az hareket modu |
| **Öğretmen paneli** | Dersekranda sınırlı; Ramazan’da yok | Mevcut paneli güçlendir: içerik, kapsama, dışa aktarma |
| **Tek dosya taşınabilirlik** | Dersekranda iframe/klasör; Ramazan Next.js | “İndir, çift tıkla, çalışır” |
| **Dikey/telefon** | `okuma-bayrami` dikeyde döndür istiyor | Gerçek responsive; öğretmen telefonuyla da kullanabilsin |
| **Tanılama** | Rakiplerde öğrenci bazlı ilerleme yok | Yerel, gizlilik dostu ilerleme raporu (opsiyonel) |

---

## 9. Bizim konumlandırma önerisi

**Tek cümle:** “2026 Türkiye Yüzyılı Maarif Modeli’ne tam uyumlu, reklamsız, çevrimdışı, akıllı tahtada tek dokunuşla çalışan; öğretmene içerik ve aşama kontrolü veren ilk okuma-yazma oyunları.”

**Farklılaştırıcı üçlü:**
1. **Doğruluk:** 29 harf, 5 grup, resmî sıra, aşama kapısı; denetlenebilir.
2. **Ses:** Kayıtlı fonem/hece/kelime; TTS yalnız yedek; harf adı yok.
3. **Sınıf dostu:** Reklamsız, izlemesiz, çevrimdışı, erişilebilir, öğretmen paneli.

**Yapılmaması gerekenler:**
- Rakiplerin görsel stilini/karakterlerini taklit etmek.
- “%100 uyumlu” gibi doğrulanamayan iddialar.
- Reklam/izleme ekleyip “reklamsız” demek.
- Cevabı görselin yanına yazmak.
- Harf adıyla “ses” öğretmek.

---

## 10. Sınırlamalar ve sonraki ölçümler

1. **Görsel doğrulama eksik:** Ekran görüntüsü alınamadı; renk/tipografi/yerleşim karşılaştırmaları sınırlı.
2. **Oyun içi mekaniklerin bir kısmı doğrulanmadı:** Özellikle canvas/ZIM tabanlı Dersekranda etkinlikleri ve Ramazan “Ses Birleştirme”.
3. **Reklam/izleme ölçümü:** Ramazan’da varlık kanıtlandı; görünürlük/sıklık ölçülmedi. Dersekranda ölçülmedi.
4. **Pazar payı/trafik:** Bilinmiyor; bu rapor ürün gözlemine dayanır.
5. **Ücretli platformlar:** Erişilemedi; rekabet değerlendirmesi eksik.
6. **Eski materyal karışıklığı:** 2024 fasikülleri ile 2026 programı arasındaki sıra farkı, saha uygulamasında önemli bir risk; öğretmen iletişiminde açıkça ele alınmalı.

**Sonraki ölçüm önerileri:**
- Aynı oyunları 3 farklı cihazda (akıllı tahta, tablet, telefon) 5 dakikalık görevle test etmek.
- Ses kayıtlarını fonem doğruluğu açısından uzman/öğretmen paneline dinletmek.
- Reklam/izleme envanterini ağ paneliyle belgelemek.
- Öğretmenlerle 5 görüşme: hangi ekranı neden atlıyorlar, hangi ayarı istiyorlar.

---

*Bu belge Aşama 2’yi kapatır. Aşama 3 pedagojik çerçeve ve müfredat doğrulaması ayrı dosyadadır.*
