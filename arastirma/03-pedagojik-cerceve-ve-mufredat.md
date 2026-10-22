# Aşama 3 — Müfredat Doğrulaması ve Pedagojik Çerçeve

**Tarih:** 21 Ekim 2026  
**Amaç:** 2026-2027 eğitim-öğretim yılında geçerli resmî programı doğrulamak; mevcut üç sistemin uyumunu denetlemek; kod yazmadan önce pedagojik çerçeveyi ve içerik kurallarını tanımlamak.

> **Kritik ilke:** Bu belge, “bildiğimiz eski program”a değil, **doğrulanmış güncel resmî metne** dayanır. Eski PDF’ler, 2024 fasikülleri ve piyasadaki etiketler kanıt olarak kullanılmadı; yalnızca karşılaştırma/uyarı amacıyla anıldı.

---

## 0. Kanıt etiketleri

| Etiket | Anlamı |
|---|---|
| **D** | Doğrudan gözlem/çalıştırma |
| **K** | Kod kanıtı (dosya:satır) |
| **S** | Resmî program / akademik kaynak / site metni |
| **E** | Uzman yorumu |
| **A** | Doğrulanmamış varsayım |

---

## 1. Resmî program doğrulaması

### 1.1 Kaynak

| Alan | Bilgi |
|---|---|
| Program | **İlkokul Türkçe Dersi Öğretim Programı (1-4)** |
| Model | **Türkiye Yüzyılı Maarif Modeli (TYMM)** |
| Yıl | **2026** (program listesinde “İLKOKUL TÜRKÇE DERSİ (1-4) (2026)”) |
| Program sayfası | `https://tymm.meb.gov.tr/ogretim-programlari/ders/ilkokul-turkce-dersi` |
| PDF | `https://tymm.meb.gov.tr/assets/pdf/ilkokul-turkce-dersi_20260902_111433_940.pdf` |
| Erişim | 21 Ekim 2026 |
| Eski kaynak | `https://mufredat.meb.gov.tr/Dosyalar/2025825154548470-ilkokul%20t%C3%BCrk%C3%A7e.pdf` → **404**; artık birincil kaynak değil |

**Durum:** 2026 PDF’i indirildi ve ilk okuma-yazma bölümü okundu (S). Eski 2025 PDF’i artık erişilemiyor; arama motoru önbelleklerinde dolaşan içerik **güncel kabul edilmemeli**. Bu rapor yalnızca 2026 metnini esas alır.

### 1.2 Harf grupları ve önerilen süreler

| Sıra | Grup | Harfler | Harf sayısı | Önerilen süre | Kümülatif harf |
|---:|---|---|---:|---:|---:|
| — | Hazırlık | Çizgi, yön, dinleme, motor beceri | — | 1 hafta | — |
| 1 | ANETİL | a, n, e, t, i, l | 6 | 6 hafta | 6 |
| 2 | OKURIM | o, k, u, r, ı, m | 6 | 4 hafta | 12 |
| 3 | ÜSÖYDZ | ü, s, ö, y, d, z | 6 | 2 hafta | 18 |
| 4 | ÇBGCŞ | ç, b, g, c, ş | 5 | 2 hafta | 23 |
| 5 | PHVĞFJ | p, h, v, ğ, f, j | 6 | 2 hafta | 29 |

**Toplam:** 1 + 6 + 4 + 2 + 2 + 2 = **17 hafta**; dönem sonuna doğru **pekiştirme haftası** öneriliyor (S).  
**Not:** Süreler “önerilen”dir; okul takvimi, sınıf düzeyi ve öğrenci ihtiyacına göre uyarlanabilir. Bu, programın esnekliğidir; “her hafta mutlaka bir harf” katı bir kural değildir (E).

**Mevcut proje ile karşılaştırma:**

| Sistem | Grup 1 | Grup 2 | Grup 3 | Grup 4 | Grup 5 | Toplam |
|---|---|---|---|---|---|---|
| Resmî 2026 | a,n,e,t,i,l (6) | o,k,u,r,ı,m (6) | ü,s,ö,y,d,z (6) | ç,b,g,c,ş (5) | p,h,v,ğ,f,j (6) | **29** |
| `uygulama` | a,n,e,t,i,l (6) | o,k,u,r,m (**5**) | ü,s,ö,y,d,z (6) | ç,b,g,c,ş (5) | p,h,v,ğ,f,j (6) | **28** |
| `oyunlar` presets | a,e,l,t,i,n (6) | +o,k,y,s,m,d (6) | +r,b,u,j,z,p,v,c,g (9) | +f,ş,h,ç,ğ,ı,ö,u,ü (9) | — | 29 (dağınık) |
| `okuma-bayrami` | a,n,e,t,i,l (6) | o,k,u,r,ı,m (6) | ü,s,ö,y,d,z (6) | ç,b,g,c,ş (5) | p,h,v,ğ,f,j (6) | **29** |

**Sonuç:** Yalnızca `okuma-bayrami` resmî gruplarla birebir uyumlu. `uygulama` 2. grupta `ı` eksik; `oyunlar` ön ayarları resmî sırayı ve kümeleri bozuyor.

### 1.3 Resmî kurallar (doğrudan alıntılar ve yorum)

Aşağıdaki alıntılar 2026 programının ilk okuma-yazma bölümündendir (S). Her alıntının altında bizim sistemler için anlamı (E) ve mevcut durum (K) verilmiştir.

#### K-1. Yazı biçimi

> **“İlk okuma yazma öğretimi tırnaksız dik temel harflerle gerçekleştirilir.”**

**Anlamı:** Serifsiz, dik, sade harf formları; el yazısı/bitişik eğik yazı değil. `a`, `e`, `i`, `l`, `t` gibi harflerin öğretilen biçimi standart olmalı.

**Mevcut durum:**
- `uygulama`: `Comic Sans MS` (K, `stil.css:9`) — yuvarlak, eğlenceli, dik temel formlardan uzak.
- `oyunlar`: `Comic Sans MS` (K, `hece-rallisi:11`, `ac-canavar:12`).
- `okuma-bayrami`: `Trebuchet MS` (K, `:25`) — daha yakın ama “dik temel” için özel olarak seçilmiş değil.
- Kök: `Baloo 2` / `Fredoka` (K) — başlık/display fontu; harf öğretimi için uygun değil.

**Karar:** Font, pedagojik bir bileşen olarak ele alınmalı; “sadece güzel görünsün” değil. Açık lisanslı, Türkçe glifleri tam, dik temel formlara yakın bir font (ör. Andika) değerlendirilmeli; MEB’in izin verdiği fontla karşılaştırılmalı (E/A). Font dosyası yerel olacak; CDN yok.

#### K-2. Küçük harf önce

**Programın ilkesi:** Harflerin öğretiminde **önce küçük harf, sonra büyük harf** esas alınır (S; ilgili bölümdeki açıklamalar).

**Anlamı:** Çocuk önce küçük harfin biçimini ve sesini öğrenmeli; büyük harf ayrı bir aşama olarak, gerektiğinde (cümle başı, özel ad) devreye girmeli.

**Mevcut durum:**
- `uygulama`: Harf kutusu **büyük harf üstte, küçük harf altta** gösteriyor (`uygulama.js:176-178`); aşama bilgisinde de büyük harf önce (`:196-197`). Bu, “önce küçük” ilkesini görsel olarak tersine çeviriyor.
- `oyunlar`: Tüm harf çipleri, heceler, kelimeler `trUpper()` ile **büyük harf** gösteriliyor (`hece-rallisi:575`, `760`, `767`; `ac-canavar:381`, `568`). Oyun boyunca çocuk yalnız büyük harf görüyor.
- `okuma-bayrami`: Kelime ve seçenekler küçük harf; bu olumlu. Ancak cümle bankasında karışık büyük harf var (aşağıda K-7).

**Karar:** Öğretim ekranlarında küçük harf birincil olmalı; büyük harf yalnızca “büyük harf tanıtımı” aşamasında ve cümle başı/özel ad bağlamında gösterilmeli. Oyunlarda büyük harf kullanımı, öğretim aşamasıyla gerekçelendirilmeli; varsayılan küçük harf olmalı.

#### K-3. Heceye geçiş: “n”den sonra

> **“İlk harf grubunun ikinci harfi olan ‘n’ öğretiminden sonra hece öğretimine geçilmelidir.”**

**Anlamı:** Hece çalışmaları, `a` tek başına öğretildikten hemen sonra değil, `n` de öğretildikten sonra başlamalı. Yani en erken `a` ve `n` birlikteyken.

**Mevcut durum:**
- `uygulama`: Aşama `a` iken hece etkinlikleri açılabiliyor; `secimIndex` varsayılanı son harf olduğu için yeni grupta tüm harfler açık (`veri.js:118-121`). Hece etkinlikleri aşama `a`’da da çalışır; hece havuzu `hecele()` ile üretilir. **İhlal riski yüksek.**
- `oyunlar`: 1. seviye kümesi `a,e,l,t,i,n`; `n` var. Ancak kullanıcı harf çiplerinden `n`’i çıkarabiliyor; hece modu hâlâ açık kalıyor. **Kısmi ihlal.**
- `okuma-bayrami`: Öğretmen harf seçimini yapıyor; varsayılan 1. grup (n dahil). Ancak `hece` tipi varsayılan açık; öğretmen yalnız `a` seçerse hece soruları yine gelebilir. **Kısmi ihlal.**

**Karar:** Aşama motoru, “hece etkinlikleri için minimum harf indeksi = n” kuralını uygulamalı. `a` aşamasında hece düğmeleri görünmemeli veya kilitli olmalı; “n’yi öğrenince açılır” mesajı verilmeli.

#### K-4. Kapalı hece önce, açık hece sonra

> Program, hece öğretiminde **kapalı hecelerden açık hecelere** doğru bir sıra önerir (S; ilgili bölüm).

**Anlamı:** `an`, `en`, `at` gibi ünsüzle kapanan heceler önce; `na`, `ne`, `ta` gibi açık heceler sonra. Bu, çocuğun sesi “kapatma” ve “açma” farkını duymasını kolaylaştırır (E).

**Mevcut durum:**
- `uygulama`: `hecele()` kelimeyi hecelere ayırıyor; etkinlikler kapalı/açık ayrımı yapmıyor. `Hece Treni` rastgele kelime seçiyor. **Sıra yok.**
- `oyunlar`: `heceHavuzu()` CV ve VC’yi aynı havuzda üretiyor; sıra yok (`hece-rallisi:539-545`).
- `okuma-bayrami`: `poolSyllables()` önce ünlüleri, sonra CV, sonra VC, sonra CVC üretiyor; ancak `qHece` havuzdan rastgele seçiyor (`:883-894`, `:1082-1093`). **Sıra garanti değil.**

**Karar:** Hece havuzu “kapalı → açık” olarak etiketlenmeli; etkinlikler önce kapalı hece setiyle başlamalı. Bu, öğretmen panelinde bir “hece türü” seçeneği olarak görünmeli.

#### K-5. Hecede büyük harf kullanılmaması

> **“Hece öğretimi sırasında harfin büyük yazılışı kullanılmamalıdır.”**

**Anlamı:** Hece çalışırken `AN`, `NA` değil, `an`, `na`. Büyük harf, hece öğretiminin konusu değil.

**Mevcut durum:**
- `uygulama`: Hece vagonları ve seçenekleri küçük harf; ancak üst bilgi ve harf kutusu büyük harf gösteriyor. Hece metni küçük olsa da ekranın genelinde büyük harf baskın. **Kısmi ihlal.**
- `oyunlar`: Hece yazıları `trUpper()` ile büyük (`hece-rallisi:700`, `767`). **Doğrudan ihlal.**
- `okuma-bayrami`: Hece seçenekleri küçük harf (`qHece` `labels` küçük). **Uyumlu.**

**Karar:** Hece etkinliklerinde büyük harf hiç kullanılmamalı; oyunlardaki `trUpper()` hece/kelime metinlerinden kaldırılmalı.

#### K-6. Renk ayrımı yasağı

> **“Hece ve sözcükler farklı renkle yazılmamalıdır.”**

**Anlamı:** Hecenin veya kelimenin parçalarını farklı renklere boyayarak “hece sınırı” öğretmek yasak. Amaç, çocuğun heceyi bütün olarak görmesi; renk, yapay bir ipucu olur.

**Mevcut durum:**
- `uygulama`: `Kaç Hece?` kolay modunda tüm hece çipleri aynı renk (`stil.css:517-521`); `Hece Treni` vagonları aynı stil. **Metin rengi farklılaştırılmamış; uyumlu görünüyor** (K; görsel doğrulama ?).
- `okuma-bayrami`: Harf/hece seçenekleri aynı metin rengi; balonlar farklı arka plan renkleri kullanıyor ama bu “hece metnini renklendirme” değil. **Uyumlu/?**

**Karar:** Renkli arka plan/çerçeve serbest; **metin rengi** ile hece/kelime parçalama yasak. Tasarım rehberine bu ayrım yazılmalı.

#### K-7. Öğretilmemiş harf içeren kelimelerde görsel kullanımı

> **“Cümlelerin oluşturulmasında okunuşu ve yazılışı öğretilmemiş harflerin geçtiği sözcüklerin yerine görseller kullanılmamalıdır.”**

**Anlamı:** Bir kelimede öğretilmemiş harf varsa, o kelimeyi resimle ikame edip cümleyi “resimli” kurmak yasak. Cümle, çocuğun okuyabildiği harflerle kurulmalı; resim, okunamayan kelimenin yerine geçmemeli.

**Mevcut durum:**
- `uygulama`: `izinliKelimeler()` boşsa **tüm grup kelimelerine** düşüyor (`veri.js:132-136`); bu kelimeler emoji ile gösterilebiliyor. **İhlal.**
- `okuma-bayrami`: `poolWords()` ve `poolSentences()` katı harf filtresi kullanıyor (`:876-882`); öğretilmemiş harfli kelime cümleye girmiyor. **Uyumlu.**
- `oyunlar`: `kelimeFiltre()` kelimeleri filtreliyor; ancak `heceHavuzu()` tüm ünlülere düşerek öğretilmemiş seslerle hece üretiyor (`:539-545`). **Kısmi ihlal.**

**Karar:** “Asla fallback” ilkesi: aşama havuzu boşsa etkinlik durur, öğretmen uyarılır; öğretilmemiş harf/resim ikamesi yapılmaz.

#### K-8. Somut ve mantıksal cümleler

> Program, cümlelerin **somut ve mantıksal açıdan doğru** olmasını ister (S; ilgili bölüm).

**Anlamı:** “Kul mutlu.”, “Ses sus.” gibi dilbilgisel olarak bozuk veya anlamsız cümleler 1. sınıf okuma metni olamaz. Cümle, çocuğun dünyasında karşılığı olan, eylem-nesne ilişkisi net bir tümce olmalı.

**Mevcut durum:**
- `uygulama`: “Kul mutlu.”, “Mini kul oku.”, “On okul.”, “Ses sus.” (`veri.js:16,23`). **İhlal.**
- `okuma-bayrami`: Cümle bankası genelde somut (“Ali topu attı.”, “Kedi süt içti.”), ancak bazıları 1. sınıf için ileri (“Ben okula gittim.”) ve baş harf tutarsız (`:828-835`). **Kısmi.**
- `oyunlar`: Cümle yok. **Uygun.**

**Karar:** Cümle bankası için “somutluk, dilbilgisi, harf kümesi, uzunluk” lint’i; öğretmen düzenlemesi olsa bile lint uyarısı.

#### K-9. Birinci grupta yalnızca ses/hece/kelime

> Program, **birinci harf grubunda** yalnızca ses, hece ve kelime düzeyinde çalışılmasını; cümle ve metin çalışmalarının **ikinci gruptan itibaren** başlamasını önerir (S).

**Anlamı:** ANETİL grubunda cümle/metin etkinliği olmamalı. Cümle, çocuğun yeterli harf dağarcığına ulaştığı 2. grupta başlar.

**Mevcut durum:**
- `uygulama`: 1. grupta 3 cümle var (`veri.js:9`); `Metin Oku`, `Cümle Kur` etkinlikleri 1. grupta erişilebilir. **İhlal.**
- `okuma-bayrami`: Varsayılan 1. grupta `Cümle Kurma` oyunu ve `sent` tipi açık; cümleler harf filtresinden geçse bile 1. grupta cümle üretilebiliyor. **Kısmi ihlal.**
- `oyunlar`: Cümle yok; kelime modu 1. seviyede var. **Uygun (cümle açısından).**

**Karar:** Aşama kapısı: `cumle`/`metin` etkinlikleri yalnızca `grupIndex >= 1` (2. grup) ve yeterli harf setiyle açılmalı. 1. grupta “Cümle Kur” kartı görünmemeli veya kilitli olmalı.

#### K-10. Ünsüzlerin tek başına sesletilmemesi

> **“Ünsüz harflerde harfin yazım aşaması dışında tek başına sesletilmemesine azami özen gösterilmelidir.”**

**Anlamı:** `/b/`, `/k/` gibi ünsüzleri tek başına “be”, “ke” diye seslendirmek öğretim hatası. Ünsüz, hece veya kelime içinde duyurulmalı; yalıtılmış ses yalnız yazım aşamasında ve dikkatli biçimde.

**Mevcut durum:**
- `uygulama`: `konus(hedef)` ile tek harf seslendiriliyor (`uygulama.js:498`); TTS harf adı okuyabilir (`ses.js:76-112`). **Yüksek risk.**
- `okuma-bayrami`: `HARF_ADI` ile “be”, “ce”, “yumuşak ge” (`:786-790`); `qHarf` `say` olarak bunu kullanıyor (`:1064`). **Doğrudan ihlal.**
- `oyunlar`: Harf modu tek harf seslendiriyor; `soyle(hedef)` benzeri yol. **Yüksek risk.**

**Karar:** Harf tanıtımı ve harf oyunları yeniden tasarlanmalı:
- Fonolojik farkındalık: ses, **hece/kelime içinde** sunulur (“Bu ses `ba`’da mı, `ab`’de mi?”).
- Harf-ses eşleme: harf gösterilir, **hece** sesi çalınır (`ba`), çocuk harfi seçer; tek başına `/b/` yok.
- Yazım aşamasında öğretmen sesi/modeli kullanılır; uygulama otomatik tek ünsüz sesi vermez.
- Kayıtlı fonem seti varsa bile, programın bu uyarısı nedeniyle **yalıtılmış ünsüz** varsayılan olmamalı.

**Not:** Bu, “harf sesi öğretilmeyecek” demek değil; “ünsüz tek başına sesletilmeyecek” demek. Fonem farkındalığı hece/kelime bağlamında korunur (E).

---

## 2. Uyum matrisi

**Durum:** ✅ uyumlu · ⚠️ kısmi/riskli · ❌ uyumsuz · ? doğrulanmadı

| Resmî ölçüt | `uygulama` | `oyunlar` | `okuma-bayrami` | Kanıt |
|---|---|---|---|---|
| 29 harf / 5 resmî grup | ❌ 28, `ı` yok | ⚠️ 29 ama sıra/küme dağınık | ✅ | K |
| Küçük harf önce | ⚠️ büyük+küçük birlikte, büyük üstte | ❌ tamamı büyük | ✅ kelime/seçenek küçük; cümle bankası karışık | K |
| Heceye `n`den sonra | ❌ `a` aşamasında açık | ⚠️ `n` var ama kaldırılabilir | ⚠️ öğretmen `a` seçerse açık | K |
| Kapalı hece önce | ❌ sıra yok | ❌ sıra yok | ❌ rastgele | K |
| Hecede büyük harf yok | ⚠️ hece küçük, ekran büyük | ❌ hece büyük | ✅ | K |
| Hece/kelime farklı renk yok | ✅/ ? | ✅/ ? | ✅/ ? | K |
| Öğretilmemiş harfte görsel ikame yok | ❌ fallback | ⚠️ hece fallback | ✅ | K |
| Somut/mantıklı cümle | ❌ | — (cümle yok) | ⚠️ | K |
| 1. grupta yalnız ses/hece/kelime | ❌ cümle var | ✅ cümle yok | ⚠️ `sent` açık | K |
| Ünsüz tek başına sesletilmez | ❌ TTS tek harf | ❌ harf modu | ❌ `HARF_ADI` | K |
| Tırnaksız dik temel harf | ❌ Comic Sans | ❌ Comic Sans | ⚠️ Trebuchet | K |
| Cümle başı büyük harf tutarlı | ⚠️ | — | ⚠️ | K |
| Öğretmen kontrolü | ✅ panel | ⚠️ sınırlı | ✅ panel | K |
| Çevrimdışı | ✅ | ✅ | ✅ | D |

**Özet:** Hiçbir sistem resmî ölçütlerin tamamını karşılamıyor. En yakın `okuma-bayrami` (veri ve küçük harf), en zayıf `oyunlar` (büyük harf ve sıra). `uygulama` en zengin etkinlik setine sahip ama müfredat kapısı ve ses politikası en riskli.

---

## 3. Kanıt tabanı: pedagojik çerçevenin dayanakları

Aşağıdaki tablo, çerçevenin “neden böyle” sorusuna akademik dayanak verir. Etki büyüklükleri kaynaktan alınmıştır; bizim bağlamımıza aktarım **E**’dir.

| Kaynak | Temel bulgu | Bizim için anlamı | Etiket |
|---|---|---|---|
| **National Reading Panel (2000)** | Fonolojik farkındalık (PA) eğitimi: PA sonuçlarında **d=0.86**, okumada **0.53**, yazımda **0.59**. En iyi sonuç: harflerle birlikte, 1-2 manipülasyon türü, küçük grup, **20 saatten az**. | PA kısa, odaklı ve harf bağlantılı olmalı; yılda onlarca saatlik “genel dinleme” değil. | S/E |
| **Ehri, Nunes, Stahl & Willows (2001)** | Sistematik sesbilgisi öğretimi genel etki **d=0.41**; anaokulu/1. sınıfta daha güçlü. | Rastgele harf oyunları değil, tanımlı kapsam-sıra; her harf öncekiyle birleşmeli. | S/E |
| **Sailer & Homner (2020)** | Oyunlaştırma meta-analizi: bilişsel **g=0.49**, motivasyonel **0.36**, davranışsal **0.25**; motivasyon/davranış etkileri yüksek titizlikte daha az stabil. | Oyunlaştırma öğrenmeyi destekler ama “puan yağmuru” değil; bilişsel hedefe hizmet etmeli. | S/E |
| **Sweller (1988); Cognitive Load Theory** | Dışsal bilişsel yük, split-attention ve gereksiz tekrar öğrenmeyi zorlaştırır. | Aynı anda yazı + resim + ses + animasyon verme; bir kanal, bir odak. | S/E |
| **Hattie & Timperley (2007)** | Geri bildirim güçlü ama değişken; görev/süreç düzeyi, benlik düzeyinden daha etkili. | “Tekrar dene!” yetersiz; “İlk sesi düşün”, “Heceyi birlikte oku” gibi süreç ipucu. | S/E |
| **Roediger & Karpicke (2006)** | Test/geri çağırma, tekrar okumadan daha kalıcı öğrenme sağlar. | Her oturumda kısa, düşük riskli hatırlama; aralıklı tekrar. | S/E |
| **Ryan & Deci (2000); Self-Determination Theory** | Özerklik, yeterlik, ilişkisellik içsel motivasyonu besler. | Seçim (harf/oyun), uygun zorluk, sınıf/ takım işbirliği; yarışma tek motivasyon olmamalı. | S/E |
| **Deci, Koestner & Ryan (1999)** | Dışsal ödüller, beklenen ve göreve bağlı olduğunda içsel motivasyonu zayıflatabilir. | Puan/star öğrenmenin yerine geçmemeli; “mastery” odaklı geri bildirim. | S/E |
| **WCAG 2.2 (W3C, 2023)** | 2.5.8 hedef boyutu (min 24×24), 2.4.7 görünür odak, 1.4.4 metin boyutlandırma, 1.4.3 kontrast, 2.3.1 hareket. | Erişilebilirlik sonradan değil, bileşen seçiminden itibaren. | S/E |
| **Hunicke, LeBlanc & Zubek (2004); MDA** | Mekanik → dinamik → estetik; oyun tasarımı önce döngü, sonra görsel. | Önce “dinle → seç → geri bildirim” döngüsü; sonra tema/karakter. | S/E |
| **Castles, Rastle & Nation (2018)** | Okuma gelişimi: sesbilgisel farkındalık + harf-ses + akıcılık + kelime dağarcığı + anlama birlikte. | Tek bir oyun türü yeterli değil; denge gerekir. | S/E |

**Etki büyüklüklerinin yorumu:** d/g değerleri “bu uygulama şu kadar etkili olacak” demek değildir; grup ortalamasıdır. Sınıf bağlamı, uygulama sadakati ve öğretmen desteği sonucu değiştirir (E).

---

## 4. Pedagojik çerçeve taslağı

### 4.1 Amaç hiyerarşisi

1. **Doğru ses-harf eşlemesi:** Çocuk, öğretilen harfin sesini hece/kelime içinde tanır.
2. **Birleştirme (blending):** Heceleri ve sesleri birleştirerek kelime okur.
3. **Ayırma (segmenting):** Duyduğu kelimeyi hecelere/seslere ayırır.
4. **Kodlama (encoding):** Duyduğu/istediği kelimeyi harflerle yazar.
5. **Akıcılık:** Tanıdık kelimeleri doğru ve akıcı okur.
6. **Anlama:** Kısa cümle/metni anlar; 2. gruptan itibaren.
7. **Motivasyon:** Okumayı “yapılması gereken” değil, “başarılabilir” bir etkinlik olarak deneyimler.

**Öncelik:** 1-4 olmadan 5-6’ya geçilmemeli. Oyunlar 1-6’yı desteklemeli, yerine geçmemeli (E).

### 4.2 Ders döngüsü (15-20 dakika)

| Aşama | Süre | Etkinlik | İlke |
|---|---:|---|---|
| Isınma/tekrar | 2-3 dk | Önceki harf/hece kartları; hızlı hatırlama | Aralıklı tekrar, düşük risk |
| Fonolojik farkındalık | 3 dk | Dinle, sesi bul; hece sayısı; ilk ses | Harf göstermeden, kısa |
| Yeni harf | 3-4 dk | Küçük harf biçimi; ses hece içinde; yazım yönü | Küçük harf önce; ünsüzü yalıtma |
| Birleştirme | 4 dk | Kapalı → açık hece; hece → kelime | Somut, az seçenek |
| Kelime okuma | 3 dk | Öğretilen harflerle 3-5 kelime | Kontrollü sözcük dağarcığı |
| Kodlama/dikte | 3 dk | Duy → yaz; hece/kelime | Üretim, tanıma değil |
| Kapanış | 1 dk | Ne öğrendik? Bir kelime/cümle | Öz değerlendirme |

**1. grup için:** Cümle/metin aşaması yok; 2. gruptan itibaren eklenir.
**2. grup ve sonrası:** Kısa cümle (3-5 kelime), ardından 2-3 cümlelik metin; metin önce öğretmenle, sonra bağımsız.

### 4.3 Etkinlik türleri ve bilişsel yük

| Tür | Örnek | Bilişsel yük | Ne zaman |
|---|---|---|---|
| Tanıma | Harfi/heceyi/kelimeyi seç | Düşük | Yeni harf sonrası |
| Eşleme | Aynı heceyi bul; resim-kelime | Düşük-orta | Pekiştirme |
| Birleştirme | Hece treni; hece + hece | Orta | `n` sonrası |
| Ayırma | Kaç hece? İlk ses? | Orta | `n` sonrası |
| Kodlama | Dikte; eksik harf | Yüksek | Harf öğrenildikten sonra |
| Akıcılık | Süreli okuma; tekrar okuma | Yüksek | 2. grup sonrası |
| Metin | Cümle/metin okuma | Yüksek | 2. grup sonrası |

**Kural:** Aynı oturumda en fazla **bir** yüksek yük etkinliği; diğerleri düşük/orta olmalı (E, CLT).

### 4.4 Geri bildirim politikası

**Doğru:**
1. Kısa onay: “Evet, `an`.?”
2. Model: doğru sesi/heceyi bir kez söyle.
3. İlerle: bir sonraki soruya geç; gereksiz kutlama yapma.

**Yanlış:**
1. Nötr tepki: “Bir daha dinle.”
2. **Süreç ipucu:** “İlk sesi düşün.” / “Bu hece `a` ile başlıyor.” / “Heceyi birlikte okuyalım.”
3. Tekrar deneme hakkı (1-2).
4. Hâlâ yanlışsa: doğruyu modelle, kısa açıkla, devam et. Cezalandırma/“can kaybı” yok.

**Yasak:**
- Yalnızca “Tekrar dene!” / “Yanlış!”.
- Utanç verici ses/animasyon.
- Süre dolunca “kaybettin” ekranı.
- Doğru cevabı görselin yanına yazmak.

**Dayanak:** Hattie & Timperley (2007) görev/süreç düzeyi geri bildirim; Kluger & DeNisi (1996) olumsuz/benlik odaklı geri bildirimin performansı düşürebileceği uyarısı (S/E).

### 4.5 Oyunlaştırma politikası

**İlkeler:**
1. **Bilişsel hedef önce:** Her oyunun tek bir öğrenme hedefi olsun; puan/star ikincil.
2. **Mastery odaklı:** Kişisel en iyi, doğruluk, tekrar; başkalarıyla sıralama varsayılan değil.
3. **Özerklik:** Harf/oyun seçimi; zorluk ayarı; “tekrar oyna” kolay.
4. **Yeterlik:** %70-80 başarı ile ilerleme; çok kolay/çok zor kaçın.
5. **İlişkisellik:** Sınıf/ takım modu; akranla yardımlaşma; alay yok.
6. **Sürpriz değil, öngörülebilirlik:** Aynı doğru davranış aynı geri bildirimi almalı.

**Kanıt sınırı:** Sailer & Homner (2020) etkileri orta düzeyde; motivasyon/davranış etkileri zayıf. Bu nedenle “puanlar çocuğu okumaya motive eder” iddiası abartılmamalı (E).

### 4.6 Değerlendirme

**Amaç:** Öğretmene “kim, hangi harfte, hangi kelimede zorlanıyor?” sorusunun yanıtını vermek; çocuğu etiketlemek değil.

**Önerilen ölçütler:**
- **Harf-ses:** 1 dakikada doğru seslendirilen harf sayısı (öğretilen set).
- **Hece/kelime:** 1 dakikada doğru okunan kelime; hata türü (harf atlama, yer değiştirme, hece birleştirme).
- **Dikte:** 5 kelimede doğru yazım; hata türü.
- **Anlama:** 2-3 cümlelik metinde 2 soru (2. grup sonrası).

**İlkeler:**
- Kısa (1-3 dk), düşük risk, oyun içinde gizli.
- Bireysel veri **yalnız cihazda**; varsayılan olarak dışarı gönderilmez.
- Öğretmen dışa aktarabilir (CSV/JSON); öğrenci adı yerine kod kullanılabilir.
- “Mastery” eşiği: 2 oturumda %80; bu bir öneridir, program kuralı değil (E/A).

### 4.7 Erişilebilirlik ve evrensel tasarım

**İlkeler:**
1. **Birden fazla temsil:** Ses + yazı + görsel; ama aynı anda değil, sıralı.
2. **Birden fazla eylem:** Dokunma, klavye, işaretçi; sürükleme zorunlu değil.
3. **Birden fazla etkileşim:** Bireysel, ikili, sınıf; rekabet zorunlu değil.
4. **Ayarlanabilirlik:** Yazı boyutu, kontrast, hareket azaltma, ses kapatma.
5. **Hata toleransı:** Geri al, tekrar dene, ipucu.

**WCAG 2.2 AA hedefleri:**
- 2.5.8: en az 24×24 CSS px; çocuk için 48×48 önerilir.
- 2.4.7: görünür odak.
- 1.4.4: %200 yakınlaştırma.
- 1.4.3: 4.5:1 metin kontrastı.
- 2.3.1: hareket azaltma; `prefers-reduced-motion`.
- 4.1.2: ad/rol/değer; `aria-label`.
- 4.1.3: durum mesajları; `aria-live`.

**Bilişsel erişilebilirlik:**
- Ekranda tek talimat; kısa cümle.
- Aynı düğme aynı yerde.
- Zamanlayıcı varsayılan kapalı; istenirse açılır.
- Hata sonrası ekran sıfırlanmaz; cevap korunur.

---

## 5. İçerik kalite kuralları

Bu kurallar, hem otomatik lint hem öğretmen paneli için temel olmalı.

### 5.1 Kelime kuralları

| Kural | Açıklama | Örnek ihlal |
|---|---|---|
| Yalnız öğretilen harfler | Kelime, aşamadaki harf kümesinin alt kümesi olmalı | `göz` ÜSÖYDZ’de `g` yok |
| Somut ve resmedilebilir | Çocuğun bildiği nesne/eylem | `nitel`, `paha`, `tela` |
| 1-3 hece | 1. sınıf için; 4+ ancak ileri aşama | `doldur` 2, `domates` 3 |
| Doğal Türkçe | Yaygın, standart kullanım | `kul`, `bük`, `sunu` |
| Özel ad değil | İstisna: bilinçli özel ad öğretimi | `Ali`, `Jale` |
| Emoji-anlam uyumu | Emoji tek başına anlamı taşımalı | `ten` → 🦵 |
| Heceleme doğru | Dilbilimsel hece sınırı | `aile` → `ai·le` |

### 5.2 Cümle kuralları

| Kural | Açıklama |
|---|---|
| 3-5 kelime | 1. sınıf için kısa |
| Somut eylem | “Ali topu attı.” |
| Dilbilgisel | Özne-yüklem uyumu; tamlama doğru |
| Harf kümesi | Yalnız öğretilen harfler |
| Tek anlam | Mecaz/soyutlama yok |
| Cümle başı büyük | 2. gruptan itibaren tutarlı |
| Özel ad büyük | `Ali`, `Ayşe` |
| Görsel ikame yok | Öğretilmemiş kelime resimle değiştirilmez |

**Örnek iyi cümleler:** “Ali topu attı.”, “Kedi süt içti.”, “Anne lale al.”  
**Örnek kötü cümleler:** “Kul mutlu.”, “Mini kul oku.”, “On okul.”, “Ses sus.”

### 5.3 Ses ve telaffuz kuralları

1. **Fonem kaydı:** Harf adı değil, ses/hece kaydı. Ör. `/b/` yalıtılmış değil; `ba`, `be`, `bı`, `bi`, `bo`, `bü`, `bu` bağlamında.
2. **Hece kaydı:** Kapalı/açık ayrımı; `an`, `na`, `en`, `ne`.
3. **Kelime kaydı:** Doğal vurgu; yapay robot ses yok.
4. **TTS yedeği:** Yalnızca kayıt yoksa; harf adı okumayacak şekilde metin normalizasyonu.
5. **Sessiz harf:** `ğ` asla hece başında değil; `yumuşak g` adı kullanılmaz.
6. **Bölgesel telaffuz:** Standart Türkiye Türkçesi; öğretmen kaydı opsiyonel.

### 5.4 Görsel ve tipografi kuralları

1. **Dik temel harf:** Serifsiz, dik, sade; el yazısı/bitişik eğik değil.
2. **Küçük harf birincil:** Öğretim ekranlarında küçük harf; büyük harf ayrı aşama.
3. **Harf formu tutarlı:** `a`, `e`, `i`, `l`, `t` aynı font ailesinde; el yazısı taklidi yok.
4. **Renk:** Hece/kelime metni tek renk; arka plan/çerçeve farklı olabilir.
5. **Kontrast:** 4.5:1; koyu metin/açık zemin.
6. **Emoji:** Anlamı net değilse kullanma; özel SVG tercih et.
7. **Hareket:** Varsayılan sakin; `prefers-reduced-motion`.

---

## 6. Aşama/etkinlik eşlemesi (öneri)

| Aşama | Harfler | Açık etkinlikler | Kapalı etkinlikler | Not |
|---|---|---|---|---|
| Hazırlık | — | Dinleme, çizgi, yön, eşleme | Harf/hece/kelime | 1 hafta |
| 1a | a | Harf tanıma (hece bağlamında), yazım | Hece, kelime, cümle | `n` yok |
| 1b | a,n | Harf, kapalı hece (`an`), açık hece (`na`), `ana` | Cümle/metin | `n` sonrası |
| 1c | a,n,e,t,i,l | Hece, kelime, kısa dikte | Cümle/metin | 1. grup sonu |
| 2 | +o,k,u,r,ı,m | Kelime, kısa cümle, metin | Serbest uzun metin | Cümle başlar |
| 3 | +ü,s,ö,y,d,z | Cümle, metin, akıcılık | — | 2 hafta |
| 4 | +ç,b,g,c,ş | Metin, akıcılık, dikte | — | 2 hafta |
| 5 | +p,h,v,ğ,f,j | Metin, akıcılık, anlama | — | 2 hafta |
| Pekiştirme | Tümü | Tekrar, oyun, değerlendirme | — | Dönem sonu |

**Not:** Bu tablo, programın “önerilen süre” ve “1. grupta cümle yok” ilkelerinden türetilmiş bir **uygulama önerisidir** (E); resmî programın birebir tablosu değildir.

---

## 7. Mevcut içerikle ilgili somut kararlar

### 7.1 Korunacaklar

- `okuma-bayrami` `GROUPS` verisi: 29 harf, resmî sıra. **Kanonik referans.**
- `uygulama` etkinlik çeşitliliği ve öğretmen paneli.
- `oyunlar` yarış/ besleme döngüleri; ancak harf seti ve büyük harf politikası düzeltilecek.
- `okuma-bayrami` `button:focus-visible`.
- `uygulama` `prefers-reduced-motion`.

### 7.2 Değişecekler

| Alan | Mevcut | Hedef |
|---|---|---|
| Grup 2 | `o,k,u,r,m` | `o,k,u,r,ı,m` |
| `göz` | ÜSÖYDZ | 4. grup veya TÜM SESLER |
| `hecele()` | Ünlü-ünlü hatası | Türkçe kural + test |
| Aşama fallback | Tüm havuza düşüyor | Boşsa dur/uyar |
| 1. grup cümle | Var | Yok; 2. gruptan |
| Harf sesi | TTS tek harf | Kayıtlı hece/fonem; yalıtma yok |
| `HARF_ADI` | Harf adı | Kaldır veya yalnız yazım aşamasında |
| `qIlkses` | Resim + yazılı kelime | Resim + ses; yazı yok |
| Oyunlarda büyük harf | Tamamı büyük | Küçük harf varsayılan |
| Font | Comic Sans/Trebuchet | Dik temel, lisanslı |
| Root font | Google Fonts | Yerel/sistem |

### 7.3 İçerik denetim listesi (kelime/cümle)

**Hemen işaretlenenler:** `tela`, `nitel`, `nene`, `lila`, `ten`, `kul`, `unlu`, `atom`, `motor`, `doz`, `sunu`, `acil`, `bük`, `jale`, `paha`; cümleler “Kul mutlu.”, “Mini kul oku.”, “On okul.”, “Ses sus.”.

**Karar:** Her biri için üç seçenek:
1. **Değiştir:** Daha somut/yaygın eşdeğer (ör. `nitel` → `tel`? `tela` → `tal`?).
2. **Taşı:** Daha ileri grup/aşama.
3. **Kaldır:** 1. sınıf için uygun değilse.

Bu kararlar Aşama 4’te öğretmen paneli + içerik lint’i ile birlikte verilmeli; bu raporda yalnızca ölçüt ve örnek var.

---

## 8. Açık sorular ve karar bekleyen noktalar

| # | Soru | Neden önemli | Öneri |
|---:|---|---|---|
| 1 | Fonem/hece sesleri kim tarafından kaydedilecek? | Telaffuz tutarlılığı ve telif | Öğretmen + dil uzmanı; açık lisans/izin |
| 2 | Hangi font kullanılacak? | Dik temel harf uyumu | Andika/eşdeğeri; lisans doğrula |
| 3 | Harf adı etkinlikleri tamamen kalkacak mı? | Program “tek başına sesletme” diyor | Hayır; hece/kelime bağlamına taşı |
| 4 | Büyük harf ne zaman? | “Önce küçük” kuralı | 1. grup sonunda tanıtım; cümle başında kullanım |
| 5 | 1. grupta cümle gerçekten yasak mı? | Program önerisi | Uygulamada 2. gruptan başlat |
| 6 | Mastery eşiği ne? | İlerleme/geribildirim | %80/2 oturum (öneri) |
| 7 | Öğrenci verisi tutulacak mı? | Gizlilik | Yerel, isteğe bağlı, adsız |
| 8 | Reklam/izleme olacak mı? | Sınıf güveni | Hayır; “reklamsız/izlemesiz” konumlandırma |
| 9 | `ğ` nasıl öğretilecek? | Hece başında yok | Kelime içinde (`dağ`, `ağaç`); asla başta |
| 10 | Bölgesel telaffuz farkı? | Standart/yerel | Standart; öğretmen kaydı opsiyonel |

---

## 9. Kaynakça

**Resmî program**
- Millî Eğitim Bakanlığı. (2026). *İlkokul Türkçe Dersi Öğretim Programı (1-4)*. Türkiye Yüzyılı Maarif Modeli.  
  `https://tymm.meb.gov.tr/assets/pdf/ilkokul-turkce-dersi_20260902_111433_940.pdf`

**Akademik**
- Castles, A., Rastle, K., & Nation, K. (2018). Ending the reading wars: Reading acquisition from novice to expert. *Psychological Science in the Public Interest, 19*(1), 5–51.
- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin, 125*(6), 627–668.
- Ehri, L. C., Nunes, S. R., Stahl, S. A., & Willows, D. M. (2001). Systematic phonics instruction helps students learn to read: Evidence from the National Reading Panel’s meta-analysis. *Review of Educational Research, 71*(3), 393–447.
- Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research, 77*(1), 81–112.
- Hunicke, R., LeBlanc, M., & Zubek, R. (2004). MDA: A formal approach to game design and game research. *AAAI Workshop on Challenges in Game AI*.
- Kluger, A. N., & DeNisi, A. (1996). The effects of feedback interventions on performance: A historical review, a meta-analysis, and a preliminary feedback intervention theory. *Psychological Bulletin, 119*(2), 254–284.
- National Reading Panel. (2000). *Teaching children to read: An evidence-based assessment of the scientific research literature on reading and its implications for reading instruction*. NICHD.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249–255.
- Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. *American Psychologist, 55*(1), 68–78.
- Sailer, M., & Homner, L. (2020). The gamification of learning: A meta-analysis. *Educational Psychology Review, 32*, 77–112.
- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science, 12*(2), 257–285.
- W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*.

**Pazar/teknik**
- Dersekranda. “Okuyorum İlk Okuma Yazma Online.” `https://dersekranda.com/category/okuyorum-ilk-okuma-yazma-online/` (erişim 21.10.2026).
- Ramazan Öğretmen. “1. Sınıf İlk Okuma Yazma.” `https://www.ramazanogretmen.com/oyunlar/1-sinif/ilk-okuma-yazma` (erişim 21.10.2026).
- Proje içi: `okuyorum-analiz/ANALIZ.md`; `arastirma/01-proje-envanteri.md`; `arastirma/02-piyasa-arastirmasi.md`.

---

## 10. Sonuç: çerçevenin özeti

1. **Müfredat doğrulandı:** 29 harf, 5 grup, 6/4/2/2/2 hafta + 1 hazırlık; `a,n,e,t,i,l` / `o,k,u,r,ı,m` / `ü,s,ö,y,d,z` / `ç,b,g,c,ş` / `p,h,v,ğ,f,j`.
2. **En büyük uyum açığı veri ve ses:** `uygulama` 28 harf; `oyunlar` resmî olmayan preset; `okuma-bayrami` harf adı; tümünde ünsüzü yalıtma riski.
3. **Pedagojik çerçeve:** Sistematik sesbilgisi + kısa PA + küçük harf + kapalı→açık hece + kontrollü kelime + 2. gruptan cümle + anlamlı geri bildirim + ölçülü oyunlaştırma + erişilebilirlik.
4. **İçerik kuralları:** Somut, doğal, yalnız öğretilen harfler; görsel ikame yok; renkli hece yok; harf adı yok.
5. **Karar:** Önce veri ve ses çekirdeği; sonra etkinlik kapıları; sonra erişilebilirlik; en son oyun konsolidasyonu.

---

*Bu belge Aşama 3’ü kapatır. Nihai ilk rapor `00-ILK-RAPOR.md` dosyasındadır. Kod değişikliği için onay beklenmektedir.*
