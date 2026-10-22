# İlk Rapor — 1. Sınıf İlk Okuma-Yazma Projesi
## Aşama 1-3: Envanter, Pazar Araştırması, Müfredat ve Pedagojik Çerçeve

**Tarih:** 21 Ekim 2026  
**Durum:** Araştırma tamamlandı; onay alındı; uygulama `arastirma/04-uygulama-raporu.md` içinde.  
**Ayrıntılı belgeler:**
- `arastirma/01-proje-envanteri.md` — dosya/kod envanteri, hatalar, erişilebilirlik, tekrar analizi
- `arastirma/02-piyasa-arastirmasi.md` — Dersekranda, Ramazan Öğretmen, pazar boşlukları
- `arastirma/03-pedagojik-cerceve-ve-mufredat.md` — 2026 programı, kanıt tabanı, uyum matrisi, çerçeve
- `arastirma/04-uygulama-raporu.md` - P0+P1 uygulaması, değişen dosyalar, 90 test sonucu, açık işler

---

## 1. Yönetici özeti

Projede aynı hedefe giden **üç paralel sistem** var:

| Sistem | Güçlü yanı | En büyük sorunu |
|---|---|---|
| `uygulama/` | 15 etkinlik, öğretmen paneli, çark, yerel puanlar | 28 harf (`ı` yok), aşama kapısı yok, TTS tek harf, 1. grupta cümle |
| `oyunlar/` | Eğlenceli yarış/besleme döngüleri, rekorlar | Resmî olmayan harf presetleri, tamamı büyük harf, 194 satır tekrar |
| `okuma-bayrami-1-sinif.html` | **Doğru 29 harf/5 grup**, 6 soru tipi, panel | Harf adı sesi, `qIlkses` cevap sızıntısı, geçersiz heceler |

**Tek cümlelik teşhis:** Proje “çalışıyor” ama **tek bir doğru müfredat/veri çekirdeği** ve **fonem politikası** yok; bu yüzden her sistem farklı yerden sapıyor.

**Önerilen yön:** Büyük bang rewrite değil; **ortak çekirdek + ince kabuk** modeli. Önce veri, heceleme, aşama kapısı ve ses; sonra erişilebilirlik; en son oyun konsolidasyonu. Mevcut 21 etkinlik/oyun kabuğu ve öğretmen paneli korunur.

**Onay istediğim kritik kararlar:**
1. Kanonik veri kaynağı `okuma-bayrami`’nin 29 harfli `GROUPS` verisi mi olacak?
2. Ses stratejisi: kayıtlı fonem/hece seti mi, yoksa doğrulanmış TTS mi?
3. Font: açık lisanslı dik temel font (ör. Andika) değerlendirilsin mi?
4. Kapsam: yalnız P0 düzeltmeleri mi, yoksa P0+P1 konsolidasyonu mu?
5. `okuma-bayrami` tek dosya olarak mı kalacak, yoksa çekirdeğe mi bağlanacak?

---

## 2. Kapsam, yöntem ve kanıt

**İncelenen:** `uygulama/` (HTML/CSS/JS/KULLANIM), `oyunlar/hece-rallisi`, `oyunlar/ac-canavar`, `okuma-bayrami-1-sinif.html`, kök `index.html`, `assets/ortak.js`, `okuyorum-analiz/ANALIZ.md`, mevcut 32+31 test görüntüsü.

**Yöntem:**
- Statik kod incelemesi (dosya:satır).
- Tarayıcıda canlı gezinme (Dersekranda, Ramazan Öğretmen).
- Ağ isteği taraması; harici bağımlılık sayımı.
- Regex/PowerShell ile dosya, DOM ve tekrar ölçümü.
- 2026 resmî program PDF’inin okunması.
- Akademik kaynak taraması (NRP, Ehri, Sailer & Homner, Sweller, Hattie, Roediger, Ryan & Deci, WCAG).

**Kanıt etiketleri:** **D** doğrudan gözlem, **K** kod kanıtı, **S** kaynak belge, **E** uzman yorumu, **A** doğrulanmamış varsayım.

**Sınırlama:** `browser.screenshot` çalışmadı; görsel/yerleşim iddiaları DOM/CSS ve mevcut görüntülerle sınırlı. `file://` testi yapılamadı. Ramazan “Ses Birleştirme” oyun içi açılmadı.

---

## 3. Envanter: ne var?

### 3.1 Dosyalar

| Dosya | Boyut | Rol |
|---|---:|---|
| `index.html` | 9,6 KB | “Hece Parkı” giriş; 2 canlı + 1 yakında oyun |
| `assets/ortak.js` | 6,1 KB | Ortak yardımcılar; **hiçbir sayfada kullanılmıyor** |
| `uygulama/index.html` + `css` + `js` | ~116 KB | 15 etkinlik + panel + çark |
| `oyunlar/hece-rallisi/index.html` | 48,4 KB | Tek dosya yarış oyunu |
| `oyunlar/ac-canavar/index.html` | 38,1 KB | Tek dosya besleme/yarış oyunu |
| `okuma-bayrami-1-sinif.html` | 98,8 KB | 4 oyun + 6 soru tipi + panel |
| `README.md`, `KULLANIM.md` | 12,4 KB | Belgeler; `README` güncel değil |

### 3.2 Etkinlik/oyun kabukları (21)

**`uygulama` (15):** Harfi Tanı, Balonu Patlat, Kaç Hece?, Eksik Harfi Bul, Harf Avı, Hece Treni, Metin Oku, Cümle Kur, Zamana Karşı, Kelime Kasası, Sesli Dikte, Kum Havuzu, Halat Çekme, Tavşan Yarışı, Yaz Oynat. Ayrıca çarkıfelek ve öğretmen paneli.

**`oyunlar` (2):** Hece Rallisi (15 kapı, altın kapı, nitro, hayalet arabalar), Aç Canavar (3 tabak, HAMM/burun, 6/8/10 lokma, tek/2 kişi).

**`okuma-bayrami` (4):** Uçan Balon, Tavşan Yarışı, Hafıza Kartları, Cümle Kurma. 6 soru tipi: harf, ilk ses, hece, resim, kelime, eksik.

### 3.3 Veri

- `uygulama`: 5 grup + TÜM SESLER; **28 harf**; **139 benzersiz kelime** (bellekte 278 kayıt, çünkü TÜM SESLER kopyalıyor); 18 cümle.
- `okuma-bayrami`: **29 harf**, doğru 5 grup; **130 kelime**; 24 cümle.
- `oyunlar`: `SOZLUK` **116 kelime**; presetler resmî değil.

### 3.4 Çalışan ve korunacaklar

- `uygulama`: 15 etkinlik, öğretmen paneli (içerik düzenleme, kapsama, kilit, JSON dışa/içe aktarma), çark, puanlar, kum/yaz stüdyosu, `prefers-reduced-motion`.
- `oyunlar`: yarış/besleme döngüleri, rekorlar, 2 kişi modu, klavye 1/2/3.
- `okuma-bayrami`: doğru 29 harf, 4 oyun, 6 tip, panel, `button:focus-visible`.

---

## 4. Müfredat doğrulaması (2026)

**Kaynak:** İlkokul Türkçe Dersi Öğretim Programı (1-4), Türkiye Yüzyılı Maarif Modeli, 2026.  
**PDF:** `https://tymm.meb.gov.tr/assets/pdf/ilkokul-turkce-dersi_20260902_111433_940.pdf`  
**Program sayfası:** `https://tymm.meb.gov.tr/ogretim-programlari/ders/ilkokul-turkce-dersi`  
**Erişim:** 21.10.2026. Eski 2025 PDF’i 404; kullanılmadı.

### 4.1 Gruplar ve süreler

| Sıra | Grup | Harfler | Süre |
|---:|---|---|---:|
| — | Hazırlık | Çizgi/yön/dinleme | 1 hafta |
| 1 | ANETİL | a,n,e,t,i,l | 6 hafta |
| 2 | OKURIM | o,k,u,r,ı,m | 4 hafta |
| 3 | ÜSÖYDZ | ü,s,ö,y,d,z | 2 hafta |
| 4 | ÇBGCŞ | ç,b,g,c,ş | 2 hafta |
| 5 | PHVĞFJ | p,h,v,ğ,f,j | 2 hafta |

**Toplam:** 17 hafta + dönem sonu pekiştirme. Süreler öneridir.

### 4.2 Doğrulanan kurallar

1. **Tırnaksız dik temel harfler** kullanılır.
2. **Önce küçük harf, sonra büyük harf.**
3. **Heceye `n` öğretildikten sonra** geçilir.
4. **Kapalı hece → açık hece** sırası önerilir.
5. **Hecede büyük harf kullanılmaz.**
6. **Hece/kelime farklı renkle yazılmaz.**
7. **Öğretilmemiş harfli kelime yerine görsel konmaz.**
8. **Cümleler somut ve mantıksal olarak doğru** olur.
9. **1. grupta yalnız ses/hece/kelime**; cümle/metin **2. gruptan**.
10. **Ünsüzler yazım dışında tek başına sesletilmez.**

### 4.3 Uyum özeti

| Ölçüt | `uygulama` | `oyunlar` | `okuma-bayrami` |
|---|---|---|---|
| 29 harf / resmî grup | ❌ 28 | ⚠️ 29 ama sıra bozuk | ✅ |
| Küçük harf önce | ⚠️ büyük+küçük | ❌ tamamı büyük | ✅/⚠️ |
| `n`den sonra hece | ❌ | ⚠️ | ⚠️ |
| Kapalı→açık hece | ❌ | ❌ | ❌ |
| Hecede büyük harf yok | ⚠️ | ❌ | ✅ |
| Renkli hece yok | ✅/? | ✅/? | ✅/? |
| Görsel ikame yok | ❌ fallback | ⚠️ hece fallback | ✅ |
| Somut cümle | ❌ | — | ⚠️ |
| 1. grupta cümle yok | ❌ | ✅ | ⚠️ |
| Ünsüzü yalıtma | ❌ | ❌ | ❌ |
| Dik temel font | ❌ | ❌ | ⚠️ |
| Çevrimdışı | ✅ | ✅ | ✅ |

**Sonuç:** Tam uyumlu sistem yok. En doğru veri `okuma-bayrami`; en zengin etkinlik `uygulama`; en eğlenceli döngü `oyunlar`.

---

## 5. Pazar araştırması: ne öğrendik?

### 5.1 Dersekranda

- 5 resmî grup; grup 1’de 6 harf; harf başına ~22 etkinlik; 10 hızlı okuma etkinliği.
- ZIM/CreateJS canvas; iframe; kayıtlı MP3 ses; indirme seçeneği.
- **Güçlü:** kapsam, tutarlı ses, ayarlanabilir hız/süre, yazma kademeleri.
- **Zayıf:** canvas erişilebilirliği, iframe/klasör taşıma zorluğu, aşırı uyaran, reklam/izleme durumu doğrulanmadı.

### 5.2 Ramazan Öğretmen

- 29 harf oyunu + 9 ek; Next.js; AdSense/Yandex/GTM/Metrika/Cloudflare.
- “Harfin Yeri Nerede?” gözlemi: 9 soru; `nar` + yazılı “Nar” + BAŞTA/ORTADA/SONDA; yanlışta açıklamasız “Tekrar dene!”; yeni kelime yüklenirken eski geri bildirim; `nar`/`limon` ANETİL dışı harfler.
- “%100 uyumlu” ve “Reklamsız” iddiaları, gözlemle çelişiyor.
- “Ses Birleştirme” sayfası iyi bir hece sırası vaat ediyor (`an, na, ana, en, ne, nene, nane, anne`) ama oyun içi doğrulanmadı.

### 5.3 Pazar boşluğu

Kimse dört ekseni birlikte tutturamıyor:

1. **Doğru 2026 müfredatı**
2. **Kayıtlı, fonem-doğru ses**
3. **Erişilebilirlik**
4. **Reklamsız, çevrimdışı, öğretmen kontrollü**

Bizim fırsatımız tam olarak bu dörtlünün kesişimi.

### 5.4 Rakip ilkelerinden çıkarımlar (kopya değil)

- Tek iskelet, çok etkinlik.
- Kayıtlı ses > TTS.
- Ayarlanabilir hız/süre/harf seti.
- Kısa oyun döngüsü (5-10 soru).
- Büyük hedef, az seçenek.
- Anlamlı geri bildirim.
- Çevrimdışı ve reklamsız.
- Öğretmen paneli.

---

## 6. Pedagojik çerçeve (özet)

### 6.1 Amaç sırası

1. Ses-harf eşlemesi (hece/kelime bağlamında)
2. Birleştirme (blending)
3. Ayırma (segmenting)
4. Kodlama (dictation)
5. Akıcılık
6. Anlama (2. gruptan)
7. Motivasyon (araç, amaç değil)

### 6.2 Ders döngüsü (15-20 dk)

Isınma (2-3) → fonolojik farkındalık (3) → yeni harf (3-4) → birleştirme (4) → kelime okuma (3) → dikte (3) → kapanış (1).

### 6.3 Geri bildirim

- Doğru: onay + model + ilerle.
- Yanlış: nötr + **süreç ipucu** + tekrar; 2. yanlışta modelle ve devam et.
- Yasak: yalnız “Tekrar dene!”, utanç animasyonu, süre dolunca “kaybettin”.

### 6.4 Oyunlaştırma

- Bilişsel hedef önce; puan/star ikincil.
- Kişisel en iyi; varsayılan olarak çocuklar arası sıralama yok.
- Özerklik (seçim), yeterlik (uygun zorluk), ilişkisellik (sınıf/takım).
- Sailer & Homner (2020): bilişsel g=0.49, motivasyonel 0.36, davranışsal 0.25; motivasyon/davranış etkileri daha az stabil. Abartılı “puan motive eder” iddiası yok.

### 6.5 Kanıt tabanı

| Kaynak | Bulgu | Uygulama |
|---|---|---|
| NRP (2000) | PA d=0.86; okuma 0.53; yazım 0.59; harflerle, 1-2 manipülasyon, <20 saat | Kısa, harf bağlantılı PA |
| Ehri et al. (2001) | Sistematik sesbilgisi d=0.41; K-1’de güçlü | Tanımlı kapsam-sıra |
| Sailer & Homner (2020) | Bilişsel .49; motivasyon .36; davranış .25 | Ölçülü oyunlaştırma |
| Sweller (1988) | Dışsal yük, split-attention | Tek odak; aynı anda yazı+resim+ses yok |
| Hattie & Timperley (2007) | Görev/süreç geri bildirimi | İpucu, sadece “yanlış” değil |
| Roediger & Karpicke (2006) | Retrieval practice | Kısa, sık hatırlama |
| Ryan & Deci (2000) | Özerklik/yeterlik/ilişkisellik | Seçim + uygun zorluk |
| WCAG 2.2 | 24×24, odak, kontrast, zoom, motion | Erişilebilirlik bileşende |

### 6.6 İçerik kuralları

- Yalnız öğretilen harfler; asla fallback.
- Somut, doğal, 1-3 hece; emoji-anlam uyumu.
- Cümle 3-5 kelime, somut eylem, dilbilgisel.
- Hece/kelime metni tek renk.
- Harf adı yok; fonem/hece kaydı.
- Dik temel harf; küçük harf birincil.
- Görsel ikame yok.

---

## 7. Ana boşluklar ve fırsatlar

| # | Boşluk | Kanıt | Fırsat |
|---:|---|---|---|
| 1 | `ı` eksik; 28 harf | K `veri.js:14` | Kanonik 29 harf verisi |
| 2 | `oyunlar` presetleri resmî değil | K `hece-rallisi:553-560` | Tek veri kaynağından preset |
| 3 | `hecele()` hatalı | K `aile`, `saat` | Testli heceleme servisi |
| 4 | Aşama fallback | K `veri.js:132-142` | “Asla fallback” kapısı |
| 5 | 1. grupta cümle | K `veri.js:9` | Aşama kapısı (cümle ≥ 2. grup) |
| 6 | TTS tek harf / harf adı | K `ses.js`, `HARF_ADI` | Kayıtlı fonem/hece |
| 7 | `qIlkses` cevap sızıntısı | K `:1076-1077` | Resim + ses; yazı yok |
| 8 | `qEksik` sınırlı | K `:1130` | Havuz + konum çeşitliliği |
| 9 | Geçersiz heceler (`ğa`) | K `:883-894` | Türkçe hece envanteri |
| 10 | Büyük harf baskın | K `trUpper` | Küçük harf varsayılan |
| 11 | Dik temel font yok | K CSS | Lisanslı yerel font |
| 12 | Erişilebilirlik | K `aria-*` yok | `aria-label`, `aria-live`, focus |
| 13 | Root bozuk | K 26/28 div, 2/3 a | HTML onarımı |
| 14 | Google Fonts | K `index.html:7-8` | Yerel font |
| 15 | 194 satır tekrar | D/K | Ortak çekirdek |
| 16 | `assets/ortak.js` ölü | K grep 0 | Kullan veya kaldır |
| 17 | İçerik kalitesi | K “Kul mutlu.” | Lint + editör |
| 18 | Reklam/izleme yok | D/K | “Reklamsız” konumlandırma |
| 19 | Mobil dikey kısıt | K `rotate` | Gerçek responsive |
| 20 | Öğretmen paneli güçlü | K | Koru ve genişlet |

---

## 8. Önerilen yön: “çekirdek + ince kabuk”

### 8.1 Neden bu?

- Üç sistemi tek anda birleştirmek yüksek risk; çalışan 21 kabuk var.
- Asıl sorun kod değil, **veri ve ses**. Önce onları tekilleştirmek, en yüksek faydayı en düşük riskle verir.
- `file://` ve “tek dosya” vaadi korunmalı; bu yüzden framework/build yok.

### 8.2 Hedef mimari

```
cekirdek/
  veri.js        → 29 harf, 5 grup, kelime/cümle/hece bankası, hecele()
  ses.js         → kayıtlı fonem/hece/kelime + TTS yedeği + efektler
  depo.js        → localStorage sürümleme, içe/dışa aktarma
  erisim.js      → aria-label, focus, aria-live, reduced-motion
  motor.js       → aşama kapısı, soru üretimi, geri bildirim
etkinlikler/     → uygulama etkinlikleri (mevcut adlar korunur)
oyunlar/         → iki oyun (çekirdeği kullanacak şekilde uyarlanır)
okuma-bayrami/   → mevcut tek dosya (çekirdeği gömmek opsiyonel)
```

**Teknik kısıt:** `file://` altında `fetch()` ile JSON okunmaz; `import/export` de sorun çıkarabilir. Veri **klasik `<script>` + global nesne** olarak yüklenmeli.

### 8.3 Alternatifler

| Seçenek | Açıklama | Değerlendirme |
|---|---|---|
| A. `uygulama`’yı tek merkez yap | `okuma-bayrami` verisini ve oyunlarını içine taşı | Orta risk; `okuma-bayrami` tek dosya vaadi kaybolur |
| B. `okuma-bayrami`’yi merkez yap | 15 etkinliği tek dosyaya taşı | Yüksek risk; dosya şişer, bakım zorlaşır |
| **C. Ortak çekirdek + mevcut kabuklar** | Veri/ses/motor ortak; kabuklar ince kalır | **Önerilen**; aşamalı, geri dönülebilir |
| D. Framework’e geç | React/Vue + build | Reddedilir; offline/tek dosya/karmaşıklık |

---

## 9. Konsolidasyon maliyet/risk/fayda

| İş | Maliyet | Risk | Fayda | Öncelik |
|---|---|---|---|---|
| Kanonik veri modülü | Düşük | Düşük | Yüksek | **P0** |
| `hecele()` + testler | Düşük | Düşük | Yüksek | **P0** |
| `uygulama` 29 harf + `göz` | Düşük | Düşük | Yüksek | **P0** |
| `oyunlar` preset + fallback | Düşük | Orta | Yüksek | **P0** |
| Aşama kapısı (cümle ≥ 2. grup) | Orta | Orta | Yüksek | **P0** |
| `qIlkses` sızıntı | Düşük | Düşük | Yüksek | **P0** |
| `oHalatCekme`/`oHeceSay`/`oHarfAvi` | Düşük | Düşük | Orta-yüksek | **P0** |
| Root HTML + font | Düşük | Düşük | Orta | **P0** |
| Erişilebilirlik katmanı | Orta | Düşük | Yüksek | **P1** |
| İçerik lint’i + editör | Orta | Orta | Yüksek | **P1** |
| Kayıtlı ses seti | Orta-yüksek | Düşük | Yüksek | **P1** |
| Ortak ses/depo modülü | Orta | Orta | Orta | **P1** |
| Oyunları çekirdeğe bağla | Yüksek | Orta | Orta | **P2** |
| `okuma-bayrami`’yi böl | Orta | Yüksek | Düşük | **Yapma** |
| Framework’e geç | Çok yüksek | Yüksek | Düşük | **Yapma** |
| Sıfırdan yaz | Çok yüksek | Çok yüksek | Belirsiz | **Yapma** |

---

## 10. Önerilen görev listesi (Aşama 4+)

### P0 — Sınıf güvenliği (kod yazmadan önce onay)

| ID | Görev | Kabul ölçütü |
|---|---|---|
| P0-1 | Kanonik `veri.js` oluştur | 29 harf, 5 grup, resmî sıra; tek kaynak |
| P0-2 | `hecele()` yeniden yaz + test | `aile`, `saat`, `ana`, `anne`, `kalem`, `domates` doğru |
| P0-3 | `uygulama` grup 2’ye `ı` ekle; `göz`’ü taşı | 29 harf; `göz` doğru grupta |
| P0-4 | Aşama kapısı | `a` aşamasında hece yok; 1. grupta cümle yok; fallback yok |
| P0-5 | `oyunlar` presetlerini kanonik veriden üret | `ANETİL`/`OKURIM`... resmî; fallback yok |
| P0-6 | `qIlkses` sızıntısını kaldır | Resim + ses; yazılı kelime yok |
| P0-7 | `oHalatCekme` skor, `oHeceSay` 4+, `oHarfAvi` hedef gizle | 3 hata kapanır |
| P0-8 | Root HTML onarımı | 26/28 div, 2/3 a → dengeli; kartlar `.kartlar` içinde |
| P0-9 | Google Fonts’u kaldır | 0 harici istek; fallback testi |
| P0-10 | `aria-label`, `focus-visible`, klavye, `aria-live` | Temel WCAG smoke test |

### P1 — Pedagojik doğruluk ve erişilebilirlik

| ID | Görev | Kabul ölçütü |
|---|---|---|
| P1-1 | İçerik denetimi | Şüpheli 15 kelime + 4 cümle karara bağlı |
| P1-2 | Kayıtlı fonem/hece seti | Harf adı yok; `ğ` başta yok |
| P1-3 | Kapalı→açık hece sırası | Hece havuzu etiketli; etkinlik sırası |
| P1-4 | Küçük harf önce | Öğretim ekranlarında küçük harf birincil |
| P1-5 | Dik temel font | Lisanslı, yerel, Türkçe glif tam |
| P1-6 | İçerik lint’i | Harf kümesi, hece, doğallık, emoji |
| P1-7 | Öğretmen paneli genişletme | Kapsama, dışa aktarma, önizleme |
| P1-8 | Responsive/mobil | Dikeyde çalışır; zoom açık |
| P1-9 | Test altyapısı | Tarayıcı içi assertion veya Playwright |

### P2 — Konsolidasyon ve deneyim

| ID | Görev | Kabul ölçütü |
|---|---|---|
| P2-1 | Ortak ses/depo modülü | Üç sistem aynı API |
| P2-2 | Oyunları çekirdeğe bağla | Tek harf seti; tek `hecele` |
| P2-3 | `okuma-bayrami` verisini çekirdeğe bağla | Tek dosya korunur; veri kopyalanmaz |
| P2-4 | Akıllı tahta/touch testi | 3 cihazda 5 dk görev |
| P2-5 | Öğretmen onboarding | 1 sayfa hızlı başlangıç |
| P2-6 | Gizlilik/veri notu | Yerel, adsız, isteğe bağlı |
| P2-7 | README/KULLANIM güncelle | Envanterle uyumlu |

**P0 dışında hiçbir şey önerilmez**; P0 tamamlanmadan yeni oyun/etkinlik eklenmemeli.

---

## 11. Onay için kararlar

Lütfen aşağıdaki beş kararı onaylayın veya değiştirin:

1. **Kanonik veri:** `okuma-bayrami`’nin 29 harfli `GROUPS` verisi temel alınsın mı?
2. **Ses:** Kayıtlı fonem/hece seti hedeflensin; TTS yalnız yedek kalsın mı?
3. **Font:** Açık lisanslı dik temel font (Andika/eşdeğeri) değerlendirilsin mi?
4. **Kapsam:** Aşama 4’te yalnız P0 mı, yoksa P0+P1 mi yapılsın?
5. **`okuma-bayrami`:** Tek dosya olarak korunsun, yalnız verisi mi ortaklaştırılsın?

**Ek onay:** P0-8/P0-9 kapsamında kök `index.html`’in yapısı ve font yüklemesi değişecek; bu, mevcut görünümü küçük ölçüde etkileyebilir. Onaylıyor musunuz?

---

## 12. Ne yapmayacağız (yanlış yol)

- Üç sistemi aynı anda tek dosyaya sıkıştırmak.
- Framework/build eklemek.
- Rakip görsellerini/kodunu kopyalamak.
- “%100 uyumlu” gibi doğrulanamayan iddialar.
- Reklam/izleme eklemek.
- Harf adıyla “ses” öğretmek.
- Cevabı görselin yanına yazmak.
- Öğretilmemiş harfleri “oyun bozulmasın” diye göstermek.
- P0 bitmeden yeni oyun eklemek.

---

## 13. Sınırlamalar

1. **Görsel doğrulama:** Ekran görüntüsü alınamadı; renk/tipografi/yerleşim iddiaları sınırlı.
2. **`file://`:** Test edilemedi; `localStorage` ve ses izinleri sınıf öncesi doğrulanmalı.
3. **Ses:** Yalnız `Microsoft Tolga` kurulu; fonem mi harf adı mı okuduğu doğrulanmadı.
4. **Pazar:** Ücretli platformlar (EBA, Okulistik, Morpa, Tonguç) erişilemedi; pazar payı bilinmiyor.
5. **Oyun içi:** Dersekranda’nın bazı canvas etkinlikleri ve Ramazan “Ses Birleştirme” doğrulanmadı.
6. **Ölçüm:** Etki büyüklükleri grup ortalamasıdır; bizim sınıfımızda aynı sonucu garanti etmez.

---

## 14. Kapanış

Bu rapor, **Aşama 1-3’ü** kapatıyor. Kod değişikliği yapılmadı; yalnızca dört araştırma belgesi oluşturuldu.

**Önerim:** P0 listesiyle başlayalım; ilk iş kanonik veri + `hecele()` + aşama kapısı olsun. Bu üçü, projedeki hataların büyük kısmını tek seferde kapatır.

**Onayınızı bekliyorum.** Onaydan sonra `TASKS.md` ve `AGENTS.md` dosyalarını oluşturup Aşama 4’e geçeceğim.
