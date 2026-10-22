# Aşama 1 — Proje Envanteri, Kod Denetimi ve Teknik Durum

**Tarih:** 21 Ekim 2026  
**Kapsam:** `uygulama/`, `oyunlar/`, `okuma-bayrami-1-sinif.html`, kök `index.html`, `assets/ortak.js`  
**Amaç:** Kod yazmadan önce mevcut durumu eksiksiz kaydetmek; çalışan özellikleri korumak; hata, tekrar ve riskleri kanıtlarıyla ortaya koymak.

> **Bu aşamada hiçbir uygulama dosyası değiştirilmedi.** Bu belge yalnızca envanter ve teşhistir.

---

## 0. Kanıt etiketleri ve yöntem

Bu raporda her iddia şu etiketlerden biriyle işaretlenir:

| Etiket | Anlamı | Örnek |
|---|---|---|
| **D** | Doğrudan gözlem: tarayıcıda çalıştırma, ağ isteği, ekran görüntüsü, ölçüm | Canlı sayfada 0 harici istek görülmesi |
| **K** | Kod kanıtı: statik inceleme, dosya:satır | `uygulama/js/veri.js:14` |
| **S** | Kaynak belge: resmî program, akademik yayın, sitenin kendi metni | 2026 Türkçe Öğretim Programı |
| **E** | Uzman yorumu: kanıtlardan çıkarılan değerlendirme | “Bu, sınıf içi kullanımda risklidir” |
| **A** | Doğrulanmamış varsayım | “File:// altında localStorage çalışır” |

**Sınırlama:** Bu oturumda `browser.screenshot` “Screenshot needs a visible tab” hatası verdi; görsel yakalama yapılamadı. Bu nedenle yerleşim/algı iddiaları DOM geometrisi, CSS ve mevcut depo görüntüleriyle sınırlıdır. Görsel doğrulama gerektiren yerlerde **?** kullanıldı.

**Ölçüm yöntemi:** Dosya boyutları ve satır sayıları PowerShell ile; DOM etiket sayıları regex ile; harici istekler `src`/`href` taramasıyla; kod tekrarı satır bazlı küme karşılaştırmasıyla ölçüldü.

---

## 1. Yönetici özeti

Proje, aynı pedagojik hedefe üç ayrı kapıdan giden **üç paralel sistemden** oluşuyor:

1. **`uygulama/`** — 15 etkinlik, 5 ses grubu + “TÜM SESLER”, öğretmen paneli, çarkıfelek, yerel puanlar. En geniş etkinlik kütüphanesi ve en olgun öğretmen araçları burada.
2. **`oyunlar/`** — “Hece Rallisi” ve “Aç Canavar” adlı iki bağımsız, tek dosyalık oyun. En eğlenceli döngüler ve rekabet mekanikleri burada; ancak müfredat ön ayarları resmî programla uyuşmuyor.
3. **`okuma-bayrami-1-sinif.html`** — 4 oyun ve 6 soru tipi tek dosyada. **Resmî 5 grubun tamamı ve 29 harf doğru**; veri modeli diğer iki sistem için referans olmalı.

**En güçlü varlıklar:** `uygulama` etkinlik çeşitliliği ve öğretmen paneli; `okuma-bayrami` doğru harf grupları ve soru üretim motoru; `oyunlar` yarış/ besleme döngüleri ve rekor mekanikleri.

**En ciddi sorunlar (öncelik sırasıyla):**

- `uygulama` 29 harfin **28’ini** kullanıyor; OKURIM grubunda **`ı` yok** (`veri.js:14`). Bu, resmî 2. grubu eksik bırakır.
- `oyunlar` ön ayarları resmî gruplarla uyuşmuyor: 2. seviyede `y,s,d` ekleniyor; `u,r,ı` eksik. Etiketler “1-2. grup” dese de içerik resmî grup değil (`hece-rallisi/index.html:315-318`).
- Harf sesi **TTS ile tek başına** seslendiriliyor; `okuma-bayrami` ayrıca `HARF_ADI` ile **harf adlarını** (“be”, “ce”, “yumuşak ge”) söylüyor (`okuma-bayrami-1-sinif.html:786-790`). 2026 programı ünsüzlerin yazım dışında tek başına sesletilmemesini istiyor.
- `hecele()` iki ünlü yan yana geldiğinde yanlış sonuç veriyor: `aile → ["ai","le"]`, `saat → ["saat"]` (`veri.js:97-115`).
- Aşama filtresi boş kalınca **tüm grup içeriğine** düşüyor; öğretilmemiş harfler görünebilir (`veri.js:132-142`).
- 1. grupta cümle ve cümle etkinlikleri var; program 1. grupta yalnızca ses/hece/kelime öneriyor (`veri.js:9`, `uygulama.js:503+`).
- `okuma-bayrami` “ilk ses” sorusunda resmin yanında **yazılı kelimeyi** gösteriyor; cevabı sızdırıyor (`okuma-bayrami-1-sinif.html:1076-1077`).
- Kök `index.html` bozuk: **26 `<div` / 28 `</div>`, 2 `<a` / 3 `</a>`**; 2. ve 3. kart `.kartlar` dışında kalıyor. Tek harici bağımlılık Google Fonts.
- Erişilebilirlik: ikon düğmelerde `aria-label` yok, `aria-live` yok, `uygulama` ve `oyunlar`’da `:focus-visible` yok, etkinlik kartları tıklanabilir `div`.
- Yazı tipi: Comic Sans / Trebuchet / Baloo 2 kullanılıyor; resmî “tırnaksız dik temel harfler” için tipografik denetim şart.

**Sonuç:** Mevcut kod “çalışıyor” ama tek başına sınıf standardı değil. Doğru strateji, çalışan mekanikleri koruyup **tek bir müfredat/veri çekirdeği** etrafında konsolide etmek; büyük bang rewrite değil.

---

## 2. Dosya envanteri

| Dosya | Boyut | Rol | Harici bağımlılık | Durum |
|---|---:|---|---|---|
| `index.html` | 9,6 KB | “Hece Parkı” giriş sayfası; 2 canlı oyun + 1 “yakında” | Google Fonts (2 istek) | **Bozuk yapı**, eksik envanter |
| `README.md` | 2,9 KB | Proje tanıtımı | — | Güncel değil: yalnız 2 oyunu anlatıyor |
| `assets/ortak.js` | 6,1 KB | Ortak TTS/efekt/depolama yardımcıları | — | **Hiçbir sayfada kullanılmıyor** (K); P2'de kaldırıldı |
| `uygulama/index.html` | 2,7 KB | Uygulama kabuğu + üst çubuk | Yok | Çalışıyor; ikon düğmelerde etiket yok |
| `uygulama/css/stil.css` | 30,0 KB | Tema, animasyon, yerleşim | Yok | `prefers-reduced-motion` var (satır 379); `:focus-visible` yok |
| `uygulama/js/veri.js` | 10,5 KB | Gruplar, kelime/cümle havuzları, `hecele()`, aşama filtresi | Yok | **Müfredat hataları burada** |
| `uygulama/js/ses.js` | 5,2 KB | `speechSynthesis` + WebAudio efektleri | Yok | Harf adı/ses ayrımı yok |
| `uygulama/js/uygulama.js` | 67,4 KB | 15 etkinlik, ekran yönetimi, öğretmen paneli, çark | Yok | Kapsamlı; B-04/B-05/B-06 ve erişilebilirlik sorunları |
| `uygulama/KULLANIM.md` | 9,5 KB | Öğretmen kullanım kılavuzu | — | Özellikler büyük ölçüde doğru; “16 etkinlik” ifadesi 15 + çark |
| `uygulama/sunucu.ps1` | 1,4 KB | Yerel sunucu | — | Geliştirme için |
| `uygulama/test-goruntuleri/` | 32 görsel | Mevcut test kanıtları | — | Eski sürüme ait olabilir |
| `oyunlar/hece-rallisi/index.html` | 48,4 KB | Tek dosya yarış oyunu | Yok | Çalışıyor; ön ayarlar resmî değil |
| `oyunlar/ac-canavar/index.html` | 38,1 KB | Tek dosya besleme/yarış oyunu | Yok | Çalışıyor; motoru büyük ölçüde kopya |
| `okuma-bayrami-1-sinif.html` | 98,8 KB | 4 oyun + 6 soru tipi + öğretmen paneli | Yok | **En doğru müfredat verisi**; cevap sızıntısı var |
| `okuyorum-analiz/ANALIZ.md` | 15,8 KB | Dersekranda “Okuyorum” analizi | — | Pazar araştırmasının ana kanıtı |
| `okuyorum-analiz/ekrangoruntuleri/` | 31 görsel | Dersekranda kanıtları | — | Mevcut |

**Toplam canlı HTML:** 4 giriş dosyası (kök + uygulama + 2 oyun) + 1 tek dosya uygulama = 5.  
**Toplam etkinlik/oyun kabuğu:** 15 (`uygulama`) + 2 (`oyunlar`) + 4 (`okuma-bayrami`) = **21**.

---

## 3. Sistem envanteri

### 3.1 `uygulama/` — ana etkinlik platformu

**Mimari:** Klasik `<script>` dosyaları; çerçeve yok; ekranlar `innerHTML` ile değişiyor; tüm durum `localStorage` anahtarı `okuyorum_v1` altında (`veri.js:56`). Dış istek yok.

**Gruplar:** `ANETİL`, `OKURIM`, `ÜSÖYDZ`, `ÇBGCŞ`, `PHVĞFJ`, `TÜM SESLER`. Son grup, ilk beş grubun kümülatif birleşimi olarak çalışma anında üretiliyor (`veri.js:43-53`).

**Etkinlikler (15):**

| # | Etkinlik | Mekanik | Amaç | Not / risk |
|---:|---|---|---|---|
| 1 | Harfi Tanı | 6 soru; 3 harf seçeneği; dinle → dokun | Harf-ses eşleme | Harf tek başına seslendiriliyor |
| 2 | Balonu Patlat | Harf/hece/kelime modu; 1 hedef + 2 çeldirici; 3 doğru harfte yeni hedef | Dinleme/ayırt etme | Balonlar yükseliyor; hedef değişince eski balonlar siliniyor |
| 3 | Kaç Hece? | Kolay (heceler görünür) / Normal; 1-2-3 düğmesi | Hece farkındalığı | `Math.min(3, ...)`; 4+ hece desteklenmiyor |
| 4 | Eksik Harfi Bul | `t?ne`; doğru harf boşluğa yerleşir | Harf tamamlama | Emoji yok |
| 5 | Harf Avı | Duyulan harf hangi kelimede? | Harf konumu | **Hedef harf ekranda yazılı**; görsel eşleme oluyor |
| 6 | Hece Treni | Hece vagonlarını sırayla diz | Hece birleştirme | 4 kelime; tren kalkıyor |
| 7 | Metin Oku | Cümleyi dinle; kelimeye dokun | Akıcı okuma | 1. grupta cümle var |
| 8 | Cümle Kur | Karışık sözcükleri sırala | Cümle bilgisi | 1. grupta erişilebilir |
| 9 | Zamana Karşı | 60 sn; kelime bul; 8 kişilik tablo | Hızlı tanıma | Süre baskısı varsayılan |
| 10 | Kelime Kasası | Harf şifresi; 3 yanlışta alarm; 4 kasa | Kod çözme | Harf sırası |
| 11 | Sesli Dikte | Duy → harf tuşlarıyla yaz; 5 kelime | Kodlama/yazma | Harf adı riski |
| 12 | Kum Havuzu | Harf seç; parmakla çiz; renk/silgi/süpür | Harf yazımı | Canvas; `touch-action:none` |
| 13 | Halat Çekme | 2 kişi; sırayla soru; 5 doğru kazanır | Rekabet | **Arkadaş modunda skor hatası** |
| 14 | Tavşan Yarışı | 10 soru; kaplumbağayı geç | Hız/doğruluk | Süre yok |
| 15 | Yaz Oynat | Serbest çiz; kaydet; geri oynat | Yazma stüdyosu | localStorage |

**Ayrıca:** Öğrenci seç çarkı (`🎡`), öğretmen paneli (`⚙️`): grup kilidi, içerik düzenleme, kapsama tablosu, JSON dışa/içe aktarma, skor sıfırlama (`uygulama.js:1100+`).

**Veri sayıları (K):**

| Grup | Harf | Kelime | Cümle |
|---|---:|---:|---:|
| ANETİL | 6 | 25 | 3 |
| OKURIM | **5** | 24 | 4 |
| ÜSÖYDZ | 6 | 29 | 4 |
| ÇBGCŞ | 5 | 36 | 4 |
| PHVĞFJ | 6 | 25 | 3 |
| **Toplam** | **28** | **139 benzersiz** | **18** |

`TÜM SESLER` grubu aynı 139 kelimeyi tekrar taşıdığı için bellekte **278 kelime kaydı** oluşuyor; benzersiz sayı 139.  
**Resmî olması gereken:** 29 harf; 6/6/6/5/6.

**Kelime kalitesi işaretleri (K/E):** `tela`, `nitel`, `nene`, `lila`, `ten` (emoji 🦵 ile anlam uyuşmazlığı), `kul`, `unlu`, `atom`, `motor`, `doz`, `sunu`, `acil`, `bük`, `jale`, `paha`. Cümlelerde: “Kul mutlu.”, “Mini kul oku.”, “On okul.”, “Ses sus.” dilbilgisel/doğal değil. Bunlar 1. sınıf için somutluk ve doğallık ölçütlerini karşılamıyor.

**`hecele()` test sonuçları (D/K):**

| Girdi | Çıktı | Beklenen | Sonuç |
|---|---|---|---|
| `ana` | `a · na` | `a · na` | ✅ |
| `anne` | `an · ne` | `an · ne` | ✅ |
| `kalem` | `ka · lem` | `ka · lem` | ✅ |
| `mutlu` | `mut · lu` | `mut · lu` | ✅ |
| `domates` | `do · ma · tes` | `do · ma · tes` | ✅ |
| `taneli` | `ta · ne · li` | `ta · ne · li` | ✅ |
| `yüksek` | `yük · sek` | `yük · sek` | ✅ |
| `kitap` | `ki · tap` | `ki · tap` | ✅ |
| `aslan` | `as · lan` | `as · lan` | ✅ |
| `tren` | `tren` | `tren` | ✅ |
| `kurt` | `kurt` | `kurt` | ✅ |
| `altın` | `al · tın` | `al · tın` | ✅ |
| `ırmak` | `ır · mak` | `ır · mak` | ✅ |
| `deniz` | `de · niz` | `de · niz` | ✅ |
| `şimşek` | `şim · şek` | `şim · şek` | ✅ |
| `gölge` | `göl · ge` | `göl · ge` | ✅ |
| **`aile`** | **`ai · le`** | `a · i · le` | ❌ |
| **`saat`** | **`saat`** | `sa · at` | ❌ |

**Kök neden:** Ünlü-ünlü dizisinde `arada` boş olduğu için hece kapatılmıyor; iki ünlü aynı hecede birleşiyor (`veri.js:100-109`). `aile` uygulama havuzunda olduğu için bu hata gerçek etkinlikte görülebilir. `saat` uygulama havuzunda yok; `okuma-bayrami` kelime bankasında var ama orada farklı bir heceleme yolu kullanılıyor.

### 3.2 `oyunlar/` — iki bağımsız oyun

**Hece Rallisi:**
- 15 kapı; kapıya yaklaşırken hece seslendirilir; alt şeritten doğru yazılı hece seçilir.
- Modlar: harf / hece / kelime toplama.
- Altın kapı (her 5. kapıda benzer heceler), nitro, saman balyası cezası.
- 8 saniye cevapsız kalırsa araba durur, ses tekrar edilir; saat işler.
- İki hayalet araba: sınıf rekoru + kişisel rekor.
- Rekorlar `localStorage`; bitişte “Sınıfça okuyalım!” listesi.
- Klavye 1/2/3 destekli.

**Aç Canavar:**
- Piknikte 3 tabak; her tabakta yazılı kurabiye; ses dinlenir; doğru kurabiye ağza fırlar.
- Doğru: “HAMM!” + kırıntı + gövde büyür; yanlış: buruna çarpar, tabağa döner, ses tekrar edilir.
- Modlar: harf / hece / kelime.
- 6/8/10 lokmada doyar; yıldız puanı (0-1 hata = 3 yıldız); “En Az Hata” panosu; okuma listesi.
- Tek canavar (bütün sınıf) veya 2 kişi yarış (mavi/pembe).

**Ön ayar sorunu (K):** `harfSetiKur()` `a,e,l,t,i,n` ile başlıyor; 2. seviyede `o,k,y,s,m,d` ekliyor; 3. seviyede `r,b,u,j,z,p,v,c,g`; 4. seviyede `f,ş,h,ç,ğ` + `ı,ö,u,ü` (`hece-rallisi/index.html:553-560`). Resmî sıra `a,n,e,t,i,l` / `o,k,u,r,ı,m` / `ü,s,ö,y,d,z` / `ç,b,g,c,ş` / `p,h,v,ğ,f,j`. Yani:
- 1. seviye harf kümesi doğru ama **sıra** yanlış (`a,e,l,t,i,n`).
- 2. seviye `y,s,d` (3. grup) ekliyor; `u,r,ı` yok.
- 3. seviye 4. ve 5. grup harflerini karıştırıyor.
- 4. seviye tamamlanıyor ama sıra ve etiketler yanlış.

**`heceHavuzu()` sorunu (K):** Seçili ünlü sayısı 2’den azsa **tüm ünlülere** düşüyor (`hece-rallisi/index.html:539-545`). Bu, öğretilmemiş ünlülerle CV/VC heceleri üretir; “sadece seçili harfler” garantisi bozulur.

**`SOZLUK` sorunu (K/E):** Hece dizileri elle yazılmış; bazı maddeler nadir/şüpheli (`yula`, `tala`) ve `Ali` gibi özel adlar küçük harfle geçiyor. `kelimeFiltre()` harf kümesini kontrol ediyor ama hece dizisinin doğruluğunu kontrol etmiyor.

### 3.3 `okuma-bayrami-1-sinif.html` — en doğru müfredat, en hazır soru motoru

**Mimari:** Tek dosya; klasik JS; ekranlar `section`; `localStorage` anahtarı `okuma_bayrami_v1` (`satır 840`). Dış istek yok.

**Gruplar (K):** 5 grup, 29 harf, resmî sırayla (`satır 777-783`). Bu, projedeki **tek doğru referans**.

**Oyunlar (4):**
1. **Uçan Balon** (`quiz`) — balon rastgele bir kutuya konar; kutudaki harf/hece/kelimeyi oku.
2. **Tavşan Yarışı** (`race`) — 2 oyuncu; doğru cevap tavşanı koşturur.
3. **Hafıza Kartları** (`mem`) — harf/hece eşlerini bul.
4. **Cümle Kurma** (`sent`) — kelimeleri doğru sıraya diz.

**Soru tipleri (6):** `harf`, `ilkses`, `hece`, `resim`, `kelime`, `eksik` (`satır 1144-1149`).

**Öğretmen paneli:** Öğrenci listesi, harf seçimi, soru tipleri, soru sayısı, hız, yarış hedefi, hafıza modu, ses/konuşma/resim/ipucu anahtarları, skorlar (`satır 678+`). Ayrıca “Sıradaki Öğrenci” çekilişi.

**Kritik içerik hataları:**
- **`qIlkses` cevap sızıntısı:** Görsel `{type:"emoji", value:w.e, cap:w.w}`; resmin altında kelimenin yazılışı var (`satır 1076-1077`). Çocuk ilk harfi görüyor; soru “ilk ses” değil, “yazılı ilk harfi eşleştirme” oluyor.
- **`HARF_ADI` harf adları:** `b:"be"`, `c:"ce"`, `ğ:"yumuşak ge"` (`satır 786-790`). Harf sesi değil, harf adı. 2026 programının “ünsüzü tek başına sesletme” uyarısıyla çelişir.
- **`qEksik` sınırlı havuz:** Yalnızca tüm harfleri benzersiz kelimeler; eksik harf asla ilk harf değil (`i = 1 + rnd(len-1)`, `satır 1130`). Bu, ilk harf farkındalığını hiç ölçmüyor ve havuzu daraltıyor.
- **`poolSyllables` geçersiz heceler:** Tüm ünsüz+ünlü kombinasyonlarını üretiyor (`satır 883-894`); `ğa`, `ğe` gibi Türkçede hece başında bulunmayan diziler ve anlamsız CVC’ler oluşabiliyor.
- **Cümle bankası büyük/küçük harf tutarsızlığı:** “anne, ata bak.” küçük başlarken “Ali ata bak.” büyük başlıyor (`satır 828-835`). Özel ad büyük harfi doğru; ancak cümle başı tutarlı değil.
- **`qResim` / `qKelime`:** Resim-adı ve kelime tanıma ölçüyor; kod çözme değil. Bu kötü değil, ama etiketlenmesi ve sıralaması gerekir.

### 3.4 Kök `index.html` ve `assets/ortak.js`

**Kök sayfa:**
- 2 canlı oyun kartı (Hece Rallisi, Aç Canavar), 1 “yakında” kartı.
- Kartların içinde hem `<a>` hem `<button onclick>` var; iç içe geçiş riski.
- **Bozuk yapı (K):** 26 `<div` açılışı, 28 `</div>` kapanışı; 2 `<a` açılışı, 3 `</a>` kapanışı. 1. karttan sonra fazladan `</div></div></a>` var (`satır 130-132`). Bu, HTML ayrıştırıcısının kartları `.kartlar` dışına taşımasına yol açar.
- **Harici bağımlılık:** Google Fonts (`Fredoka`, `Baloo 2`) — projedeki tek harici istek. Çevrimdışı açılışta font düşer; tasarım değişir.
- **Erişilebilirlik:** “Yakında” kartı `div`; içindeki devre dışı düğme klavye odağı alamaz. Başlık hiyerarşisi tek `h2` + `h3`; ana içerikte `h1` yok (logo `div`).
- **Animasyon:** Güneş dönüyor, bulutlar kayıyor; `prefers-reduced-motion` yok.

**`assets/ortak.js`:**
- `TR_UPPER`, `TUM_HARFLER`, `SESLILER`, `soyle()`, `efekt()`, depolama yardımcıları içeriyor.
- **Hiçbir HTML bu dosyayı yüklemiyor** (K: `grep` sonucu 0 eşleşme). İki oyun aynı yardımcıları kendi içine kopyalamış; `uygulama` ise farklı API’li `ses.js` kullanıyor.
- Bu, “ortak dosya var” yanılsaması yaratıyor; gerçekte üç ayrı kopya var.

---

## 4. Hata listesi (önem sırasına göre)

**Önem:** S1 = sınıfta kullanımdan önce zorunlu; S2 = yüksek; S3 = orta; S4 = düşük/kozmetik.

| ID | Önem | Sistem | Bulgu | Kanıt | Etki | Düzeltme yönü (kod yazmadan) |
|---|---|---|---|---|---|---|
| B-01 | S1 | `uygulama` | OKURIM’de `ı` yok; 28 harf | K `veri.js:14` | Resmî 2. grup eksik; `ı` ile başlayan kelimeler yok | Kanonik veriye geçiş; `o,k,u,r,ı,m` |
| B-02 | S1 | `uygulama` | `göz` ÜSÖYDZ’de ama `g` 4. grupta | K `veri.js:22` | Kelime TÜM SESLER’e kadar ulaşılamaz | Kelimeyi 4. gruba taşı veya `g` öğretilene kadar gizle |
| B-03 | S1 | `uygulama` | `hecele("aile")` → `ai·le`; `hecele("saat")` → `saat` | D/K `veri.js:97-115` | Hece etkinliklerinde yanlış model | Türkçe heceleme kuralı + birim testleri |
| B-04 | S2 | `uygulama` | `oHeceSay` 3’ten fazla heceyi 3 kabul ediyor | K `uygulama.js:424` | 4+ heceli kelimede yanlış cevap | Dinamik seçenek sayısı veya 1-4 |
| B-05 | S2 | `uygulama` | Arkadaş modunda her doğru `skor.b++` | K `uygulama.js:954` | Arkadaşın puanı “Sen” hanesine yazılıyor | `skor[kime]++` |
| B-06 | S2 | `uygulama` | Harf Avı hedef harfi ekranda yazıyor | K `uygulama.js:482` | Görsel eşleme; ses ayırt etme değil | Harfi gizle; yalnız ses + kelime seçenekleri |
| B-07 | S1 | `uygulama` | Aşama havuzu boşsa tüm gruba düşüyor | K `veri.js:132-142` | Öğretilmemiş harf görünebilir | Boşsa etkinliği kilitle/uyar; asla tüm havuza düşme |
| B-08 | S1 | `uygulama` | 1. grupta cümle ve cümle etkinlikleri | K `veri.js:9`, `uygulama.js:503+` | Programın “1. grup ses/hece/kelime” kuralına aykırı | Aşama kapısı: cümle/metin ≥ 2. grup |
| B-09 | S1 | `oyunlar` | Ön ayarlar resmî grup değil | K `hece-rallisi:315-318,553-560`; `ac-canavar:186-189,361+` | Yanlış harf kümesiyle oyun | Kanonik veriden ön ayar üret |
| B-10 | S1 | `oyunlar` | `heceHavuzu` 2’den az ünlüde tüm ünlülere düşüyor | K `hece-rallisi:539-545` | Öğretilmemiş ünlüler | Yeterli ünlü yoksa hece modunu kapat |
| B-11 | S2 | `okuma-bayrami` | `qIlkses` resim + yazılı kelime | K `1076-1077` | Cevap sızıntısı | `cap` kaldır; yalnız ses + resim |
| B-12 | S3 | `okuma-bayrami` | `qEksik` benzersiz harf + ilk harf yok | K `1123-1130` | Sınırlı havuz; ilk harf ölçülmüyor | Havuzu genişlet; konum çeşitlendir |
| B-13 | S2 | `okuma-bayrami` | `poolSyllables` geçersiz `ğa` vb. | K `883-894` | Anlamsız/olmayan heceler | Türkçe hece envanteri + `ğ` başlangıç yasağı |
| B-14 | S1 | `okuma-bayrami` | `HARF_ADI` harf adları | K `786-790` | “be/ce/yumuşak ge” sesi | Fonem kaydı veya hece içinde ses |
| B-15 | S1 | `uygulama` | TTS tek harfi adıyla okuyabilir | K `ses.js:76-112`; D değil | Fonem belirsizliği | Kayıtlı fonem/hece seti; TTS’i doğrula |
| B-16 | S2 | `uygulama` | Şüpheli kelime/cümleler | K `veri.js:8,15,16,22,29,36` | Doğal olmayan dil modeli | İçerik denetimi + lint |
| B-17 | S2 | kök | Bozuk HTML; kartlar kapsayıcı dışında | K `index.html:108-170`; D sayım | Yerleşim/erişilebilirlik bozulur | Yapıyı düzelt; tek `<a>` kullan |
| B-18 | S3 | kök | Google Fonts bağımlılığı | K `index.html:7-8` | Çevrimdışı tasarım düşer | Yerel font veya sistem yığını |
| B-19 | S3 | `assets` | `ortak.js` kullanılmıyor | K grep 0 | Bakım yanılsaması; üç kopya | Ortak modüle geç veya sil |
| B-20 | S3 | `oyunlar` | ~194 satır birebir tekrar | D/K satır kümesi | Çift bakım; hata kaçırma | Ortak çekirdek |
| B-21 | S1 | tümü | `aria-label`, `aria-live`, `role` yok | K grep 0 | Ekran okuyucu/klavye erişimi yok | Erişilebilirlik katmanı |
| B-22 | S2 | tümü | `user-scalable=no` | K `uygulama/index.html:5`, `okuma-bayrami:5`, oyunlar:5 | Yakınlaştırma engeli | Kaldır veya `maximum-scale` gevşet |
| B-23 | S1 | `uygulama`/`oyunlar` | Büyük harf önce/tek başına | K `uygulama.js:176-178`; `hece-rallisi:575` | “Önce küçük harf” kuralına aykırı | Küçük harf önce; büyük harf ayrı aşama |
| B-24 | S2 | tümü | Dik temel harf fontu yok | K CSS `font-family` | Harf formları resmî değil | Lisansı doğrulanmış dik temel font |
| B-25 | S3 | `okuma-bayrami` | Cümle başı büyük/küçük tutarsız | K `828-835` | Yazım modeli tutarsız | Cümle bankası standardı |
| B-26 | S2 | `uygulama` | Yeni grup varsayılan olarak son harfe açık | K `veri.js:118-121` | Öğretmen ayarlamazsa tüm grup açık | Varsayılan `null` / ilk harf; açık ilerletme |
| B-27 | S1 | `uygulama` | Cümle filtresi boşsa tüm cümlelere düşüyor | K `veri.js:137-142` | Öğretilmemiş harfli cümle | Aynı “asla fallback” kuralı |
| B-28 | S3 | `oyunlar` | Elle yazılmış hece dizileri | K `SOZLUK` | Yanlış heceleme | Kanonik heceleme |
| B-29 | S3 | `okuma-bayrami` | `qResim`/`qKelime` kod çözme değil | K `1095-1119` | Etiket/amaç uyuşmazlığı | Etkinlik amacını yeniden adlandır |
| B-30 | S2 | tümü | Odak yönetimi yok; ekran değişiminde odak kayboluyor | K `innerHTML` ekranlar | Klavye kullanıcısı kaybolur | `focus()` + başlık duyurusu |
| B-31 | S2 | `uygulama` | `:focus-visible` yok | K CSS grep | Klavye odağı görünmez | Odak stili |
| B-32 | S2 | `uygulama` | Etkinlik kartları `div` + click | K `uygulama.js:206` | Klavye/rol yok | `<button>` veya `role/tabindex` |
| B-33 | S3 | kök/oyunlar | `prefers-reduced-motion` yok | K CSS grep | Hareket hassasiyeti | Medya sorgusu |
| B-34 | S2 | kök | İç içe `<a>`/`button` | K `index.html:109-151` | Geçersiz etkileşim | Tek gezinme öğesi |
| B-35 | S4 | `uygulama` | “16 etkinlik” ifadesi | K `KULLANIM.md:99` | Envanter tutarsızlığı | 15 + çark olarak düzelt |

---

## 5. Erişilebilirlik denetimi

**Ölçüt:** WCAG 2.2 AA temel maddeleri + çocuk kullanımı için uzman önerileri. Renk kontrastı ve gerçek ekran okuyucu testi yapılmadı; bu satırlar **?**.

| Ölçüt | Gereklilik | `uygulama` | `oyunlar` | `okuma-bayrami` | Kanıt |
|---|---|---|---|---|---|
| 1.1.1 | Metin dışı içerik alternatifi | ❌ ikonlar emoji, `aria-label` yok | ❌ aynı | ❌ aynı | K |
| 1.3.1 | Bilgi ve ilişkiler | ⚠️ kartlar `div` | ⚠️ oyun alanı görsel | ✅ çoğu `button` | K |
| 1.4.3 | Kontrast | ? | ? | ? | Ölçülmedi |
| 1.4.4 | Metin yeniden boyutlandırma | ❌ `user-scalable=no` | ❌ | ❌ | K |
| 1.4.10 | Reflow | ⚠️ yatay taşma olabilir | ⚠️ `overflow:hidden` | ⚠️ dikeyde “döndür” katmanı | K |
| 2.1.1 | Klavye | ❌ `div` kartlar, canvas | ⚠️ kısmi (1/2/3) | ⚠️ kısmi | K |
| 2.4.3 | Odak sırası | ❌ dinamik ekran | ⚠️ | ⚠️ | K/E |
| 2.4.7 | Görünür odak | ❌ | ❌ | ✅ `button:focus-visible` | K |
| 2.5.8 | Hedef boyutu (min 24×24) | ✅ büyük | ✅ | ✅ | K/E |
| 2.3.1 | Hareket | ✅ `prefers-reduced-motion` | ❌ | ❌ | K |
| 4.1.2 | Ad/rol/değer | ❌ | ❌ | ⚠️ | K |
| 4.1.3 | Durum mesajları | ❌ `aria-live` yok | ❌ | ❌ | K |
| 1.2.1 | Sesli içerik alternatifi | ⚠️ metin var, ama ses zorunlu değil | ⚠️ | ⚠️ | K |
| 3.2.2 | Girdiyle bağlam değişimi | ⚠️ ekran geçişleri | ⚠️ | ⚠️ | E |

**Öne çıkanlar:**
- İkon düğmeler (`🏠 ☰ 🔊 🎡 ⚙️`) yalnızca emoji ile adlandırılmış; `title` bazılarında var, `aria-label` yok.
- `uygulama` etkinlik kartları `<div class="akt">` + `addEventListener("click")`; `tabindex`, `role="button"`, `keydown` yok.
- `aria-live` hiç yok; doğru/yanlış geri bildirimi yalnızca görsel/sesli.
- `okuma-bayrami` `button:focus-visible` ile diğerlerinden ayrılıyor; bu korunmalı.
- `okuma-bayrami` dikey telefonda “döndür” katmanı gösteriyor; bu, telefon kullanımını fiilen yatayla sınırlıyor.
- Emoji tabanlı görseller ekran okuyucuda “nar”, “ateş” gibi okunabilir; ancak amaçlanan anlamı her zaman vermez (ör. `ten` → 🦵).

---

## 6. Çevrimdışı, akıllı tahta, dokunmatik, mobil ve performans

### 6.1 Çevrimdışı

| Sistem | Harici istek | Değerlendirme |
|---|---|---|
| `uygulama` | 0 | ✅ Tamamen yerel; ses, işletim sistemi sesine bağlı |
| `oyunlar` | 0 | ✅ Tamamen yerel |
| `okuma-bayrami` | 0 | ✅ Tamamen yerel |
| Kök `index.html` | 2 (Google Fonts) | ❌ Ağ yoksa font düşer; fallback var ama tasarım değişir |

**Koşullu çevrimdışı:** `speechSynthesis` bazı tarayıcılarda “Natural/Online” sesleri ağdan çeker. Windows’ta yalnızca `Microsoft Tolga - Turkish (Turkey)` kuruluysa yerel çalışır; Edge’de doğal ses ağ gerektirebilir. Bu nedenle “tam çevrimdışı” iddiası **ses politikasına bağlıdır** ve test edilmelidir (A).

**`file://` davranışı:** Tüm sayfalar klasik script kullandığı için `file://` altında açılabilir. Ancak `localStorage`’ın `file://` kaynağında tarayıcıya göre paylaşımı değişir; Chrome’da dosya başına ayrı mı, tüm `file://` için ortak mı olduğu sürüme bağlıdır. Bu oturumda `file://` testi yapılamadı (tarayıcı aracı `file://` kabul etmiyor). **A** olarak işaretlendi; sınıf öncesi test şart.

### 6.2 Akıllı tahta

- `uygulama`: `min(92vw, 880px)` ve `clamp()` ile ölçekleniyor; 1920×1080’de büyük hedefler. ✅
- `oyunlar`: `overflow:hidden`, sabit sahne; 16:9’a yakın; küçük ekranda dikey taşma riski. ⚠️
- `okuma-bayrami`: `100%` yükseklik, `overflow:hidden`, `vh` tabanlı; 16:9 akıllı tahtaya göre tasarlanmış. ✅
- **Ortak sorun:** F11 tam ekran kullanıcıya bırakılmış; otomatik tam ekran yok. Öğretmen için ipucu var.

### 6.3 Dokunmatik

- `uygulama`: `#kum` üzerinde `touch-action:none`; diğer alanlarda varsayılan. Pointer Events kullanılıyor (K). ✅
- `okuma-bayrami`: `touch-action:manipulation`; sürükleme yok. ✅
- `oyunlar`: dokunmatik düğmeler; `user-select:none`. ✅
- **Risk:** Uzun sayfalarda `touch-action:none` yalnız canvas’a uygulanmış; iyi. Ancak `body{overflow:hidden}` olan oyunlarda küçük ekranda içerik kırpılabilir.

### 6.4 Mobil

- `uygulama`: 680px ve 760px medya sorguları var; üst çubuk sıkışabilir; FAB sağ altta içerikle çakışabilir. ⚠️
- `okuma-bayrami`: 860px altı dikeyde “döndür” katmanı; telefon deneyimi yatayla sınırlı. ⚠️
- `oyunlar`: 600px altı tek sütun; oyun sahnesi dikeyde sıkışabilir. ⚠️
- **Ortak:** `user-scalable=no`; düşük görüşlü kullanıcı yakınlaştıramaz. ❌

### 6.5 Performans

- Dosya boyutları 2,7–98,8 KB; harici kütüphane yok; ilk yükleme hızlı. ✅
- `uygulama` ve `okuma-bayrami` tek büyük JS; DOM `innerHTML` ile yeniden kuruluyor; ekran geçişlerinde GC baskısı olabilir. ⚠️
- `setTimeout` zincirleri ekran değişince temizlenmiyor; arka planda kalan zamanlayıcılar ses/geri bildirim sızıntısı yapabilir. **E** (kodda merkezî temizleme yok).
- Canvas (`Kum Havuzu`, `Yaz Oynat`) pointer olaylarıyla çiziyor; `requestAnimationFrame` kullanımı sınırlı. Akıllı tahtada kabul edilebilir. ✅
- `speechSynthesis.cancel()` her konuşmada çağrılıyor; art arda tıklamada kesilme olabilir. ⚠️
- Emoji render’ı platforma bağlı; aynı emoji Windows/Android/iOS’ta farklı görünür. Görsel tutarlılık riski. **E**

---

## 7. Kod tekrarı ve konsolidasyon haritası

### 7.1 Ölçülen tekrar

- `hece-rallisi` 922 satır, `ac-canavar` 731 satır.
- Trim edilmiş, 15 karakterden uzun **194 satır birebir aynı** (D/K). Bu, iki oyunun ortak gövdesinin yaklaşık **%21’i** (194/922).
- Tekrar eden bloklar:
  - CSS reset, renk değişkenleri, sahne/tepe çubuğu stilleri.
  - `TR_UPPER`, `TUM_HARFLER`, `SESLILER`, `trUpper()`.
  - `SOZLUK`, `kelimeFiltre()`, `heceHavuzu()`, `benzerHarf()`, `harfSetiKur()`.
  - `soyle()`, `efekt()`, ses aç/kapat.
  - `localStorage` kayıt/okuma, rekor tablosu, bitiş ekranı.
- `assets/ortak.js` bu blokların bir kısmını zaten içeriyor ama **hiçbir sayfada yüklenmiyor**. Yani “ortak” dosya ölü kod; gerçekte iki kopya + bir yarım kopya var.

### 7.2 Neden hemen birleştirmemeli?

- Her oyun “tek dosya, çift tıkla aç” vaadiyle çalışıyor. Ortak dosyaya geçmek bu vaadi zayıflatır; yine de klasik `<script src="../ortak/...">` ile `file://` altında çalışır (fetch/ES module değil).
- `uygulama` zaten çok dosyalı; orada ortak modül doğal.
- `okuma-bayrami` tek dosya; onu bölmek öğretmenin tek dosyayı kopyalama alışkanlığını bozar.

### 7.3 Önerilen konsolidasyon sınırı

**Aşamalı, “çekirdek + ince kabuk” modeli:**

```
cekirdek/
  veri.js        → 29 harf, 5 grup, kelime/cümle/hece bankası, hecele()
  ses.js         → fonem/hece/kelime kayıtları + TTS yedeği + efektler
  depo.js        → localStorage sürümleme, içe/dışa aktarma
  erisim.js      → aria-label, focus, aria-live, reduced-motion yardımcıları
  motor.js       → aşama kapısı, soru üretimi, geri bildirim
etkinlikler/     → uygulama etkinlikleri (mevcut isimler korunur)
oyunlar/         → mevcut iki oyun (çekirdeği kullanacak şekilde uyarlanır)
okuma-bayrami/   → mevcut tek dosya (çekirdeği gömmek için opsiyonel)
```

**Teknik kısıt:** `file://` altında `fetch()` ile JSON okumak CORS nedeniyle çalışmaz. Bu yüzden veri **JS global nesnesi** olarak yüklenmeli; `import`/`export` de `file://`’da sorun çıkarabilir. Klasik `<script>` + IIFE en güvenli yol.

### 7.4 Konsolidasyon maliyet/risk/fayda

| Seçenek | Maliyet | Risk | Fayda | Karar |
|---|---|---|---|---|
| Veriyi tek JS modülüne taşı | Düşük | Düşük | Yüksek (tek doğru kaynak) | **Önerilir, ilk iş** |
| `hecele()` ve içerik lint’i | Düşük | Düşük | Yüksek | **Önerilir** |
| Ses katmanını birleştir | Orta | Orta (ses API farkları) | Orta-yüksek | Önerilir, P1 |
| İki oyunun ortak motoru | Orta | Orta (tek dosya vaadi) | Orta | Önerilir, P2 |
| `okuma-bayrami`’yi parçala | Orta | Yüksek (tek dosya alışkanlığı) | Düşük-orta | **Önerilmez**; veriyi kopyala, dosyayı koru |
| Tümünü framework’e taşı | Çok yüksek | Yüksek | Düşük (offline/karmaşıklık) | **Reddedilir** |
| Sıfırdan yeniden yaz | Çok yüksek | Çok yüksek | Belirsiz | **Reddedilir** |

---

## 8. Korunacaklar listesi (regresyon önleme)

Aşağıdakiler çalışıyor ve yeni mimaride **aynen korunmalı**:

**`uygulama`:**
- 15 etkinliğin tamamı ve adları.
- Öğretmen paneli: grup kilidi, içerik düzenleme, kapsama tablosu, JSON dışa/içe aktarma, skor sıfırlama.
- Çarkıfelek ve “aynı kişi üst üste gelmesin” anahtarı.
- Yerel puan/rozet sistemi (`okuyorum_v1`), tavşan pisti.
- Büyük dokunmatik hedefler, sesli talimat çipi, WebAudio efektleri.
- `prefers-reduced-motion` desteği (satır 379).
- Kum Havuzu ve Yaz Oynat canvas araçları.

**`oyunlar`:**
- Hece Rallisi: 15 kapı, altın kapı, nitro, saman balyası, 8 sn kuralı, iki hayalet araba, sınıf rekoru, “Sınıfça okuyalım!”.
- Aç Canavar: 3 tabak, HAMM/burun, 6/8/10 lokma, yıldız, “En Az Hata”, tek/2 kişi.
- Klavye 1/2/3, `localStorage` rekorları.

**`okuma-bayrami`:**
- 5 grup / 29 harf doğru veri.
- 4 oyun ve 6 soru tipi.
- Öğretmen paneli: harf seçimi, tip seçimi, sayı, hız, yarış hedefi, hafıza modu, ses/resim/ipucu.
- `button:focus-visible`.
- Tek dosya çalışma biçimi.

**Kök:**
- “Hece Parkı” kimliği ve iki canlı oyun bağlantısı.
- “Yakında” kartı (yeni oyunlar için yer).

---

## 9. Test günlüğü ve sınırlamalar

| Test | Yöntem | Sonuç |
|---|---|---|
| Dosya boyutları | PowerShell `Get-ChildItem` | Tamam |
| DOM etiket sayıları | Regex | `index.html`: 26 `<div` / 28 `</div>`, 2 `<a` / 3 `</a>` |
| Harici istekler | `src`/`href` taraması | Yalnız kökte 2 Google Fonts |
| `hecele()` | Node yok; kod simülasyonu + statik iz | 16 doğru, 2 hatalı |
| Grup/kelime sayıları | Regex + sayım | 139 benzersiz; 278 kayıt |
| Kod tekrarı | Satır kümesi | 194 birebir satır |
| `assets/ortak.js` kullanımı | `grep` | 0 referans |
| Erişilebilirlik | Statik `grep` + CSS | `aria-label`/`aria-live`/`role` yok |
| Ekran görüntüsü | `browser.screenshot` | ❌ “visible tab” hatası |
| `file://` | `browser.tabs.open` | ❌ reddedildi |
| Ramazan “ses-birlestirme” | Canlı gezinme | ❌ oyun arayüzü açılmadı |

**Açık kalan doğrulamalar:**
- `speechSynthesis` ile tek harfin gerçekten fonem mi, harf adı mı okunduğu.
- `file://` altında `localStorage` paylaşımı ve ses izinleri.
- Akıllı tahta dokunmatik gecikmesi.
- Renk kontrastı ve gerçek ekran okuyucu akışı.
- 4+ heceli kelime eklendiğinde `oHeceSay` davranışı.

---

## 10. Aşama 4 için envanter kaynaklı gereksinimler

1. **Tek doğru veri kaynağı:** 29 harf, 5 grup, resmî sıra; `TÜM SESLER` türetilmiş olmalı.
2. **Aşama motoru:** harf indeksi + “n’den sonra hece” + “kapalı hece önce” + “cümle/metin ≥ 2. grup” kuralları tek yerde.
3. **Heceleme servisi:** Türkçe kurallara uygun, birim testli; ünlü-ünlü dizileri, `ğ` davranışı, ünsüz kümeleri.
4. **Ses politikası:** fonem/hece/kelime için kayıtlı ses; TTS yalnız yedek; harf adı yok.
5. **İçerik lint’i:** harf kümesi, hece sayısı, somutluk, doğal dil, emoji-anlam uyumu.
6. **Erişilebilirlik katmanı:** `aria-label`, `aria-live`, `focus-visible`, klavye, `prefers-reduced-motion`.
7. **Font politikası:** dik temel harf formları; lisans doğrulaması; yerel dosya.
8. **Test altyapısı:** tarayıcı içi assertion sayfası veya Playwright; `hecele`, grup, aşama, soru üretimi için regresyon.
9. **Belge güncellemesi:** `README.md` ve `KULLANIM.md` gerçek envanterle hizalanmalı.
10. **Geri dönüş planı:** her adımda eski giriş dosyaları korunmalı; kullanıcı akışı bozulmamalı.

---

*Bu belge Aşama 1’i kapatır. Aşama 2 pazar araştırması, Aşama 3 pedagojik çerçeve ve nihai ilk rapor ayrı dosyalardadır. Kod değişikliği için onay beklenmektedir.*
