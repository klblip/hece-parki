# TASKS — Okuyorum / Hece Parkı / Okuma Bayramı

> Bu dosya Aşama 4 (uygulama) görev listesidir. Aşama 1-4 raporları `arastirma/` altındadır.
> Kural: P0 bitmeden yeni oyun/etkinlik eklenmez. Her görev tamamlandığında test sonucu buraya yazılır.
>
> İşaretler: `[x]` tamam · `[~]` kısmen tamam · `[ ]` açık

## Onaylanan kararlar (21.10.2026)

| # | Karar | Sonuç |
|---|---|---|
| 1 | Kanonik veri | `okuma-bayrami` 29 harfli `GROUPS` verisi temel alınacak |
| 2 | Ses | Kayıtlı fonem seti hedef; TTS yalnız yedek |
| 3 | Font | TTKB Dik Temel Abece kullanılacak (lisans nedeniyle kopyalanmadan, `local()` ile) |
| 4 | Kapsam | P0 + P1 |
| 5 | `okuma-bayrami` | Tek dosya yerine modüllere ayrılacak |
| 6 | Kök `index.html` | Yapı ve font yüklemesi onarılacak |

## P0 — Sınıf güvenliği

- [x] P0-1 Kanonik `assets/veri.js`: 29 harf, 5 grup, resmî sıra, tek kaynak
- [x] P0-2 `hecele()` yeniden yaz + test: `aile`, `saat`, `ana`, `anne`, `kalem`, `domates`, `göz`, `tren`
- [x] P0-3 `uygulama` grup 2'ye `ı` ekle; `göz`'ü 4. gruba taşı; 29 harf
- [x] P0-4 Aşama kapısı: `a` aşamasında kelime/hece yok; 1. grupta cümle yok; fallback yok
- [x] P0-5 `oyunlar` presetlerini kanonik veriden üret; 5 resmî grup; fallback yok
- [x] P0-6 `qIlkses` sızıntısını kaldır: resim + ses, yazılı kelime yok
- [x] P0-7 `oHalatCekme` skor, `oHeceSay` 4+, `oHarfAvi` hedef gizle
- [x] P0-8 Kök `index.html` onarımı: dengeli işaretleme, kartlar `.kartlar` içinde, 4 gerçek giriş
- [x] P0-9 Google Fonts'u kaldır; TTKB fontunu yerel `local()` ile yükle
- [x] P0-10 `aria-label`, `focus-visible`, klavye, `aria-live`, `prefers-reduced-motion`

## P1 — Pedagojik doğruluk ve erişilebilirlik

- [x] P1-1 İçerik denetimi: kelime bankası yeniden yazıldı; uydurma/nadir kelimeler (`yula`, `tala`) ve 18 hatalı/çakışan emoji temizlendi
- [x] P1-2 Kayıtlı fonem/hece seti altyapısı (manifest + yükleyici + yol doğrulama testi); kayıt dosyaları sonra eklenecek
- [x] P1-3 Kapalı → açık hece sırası; hece havuzu yalnız gerçek kelime hecelerinden
- [x] P1-4 Küçük harf önce: öğretim ekranlarında ve oyunlarda küçük harf birincil
- [x] P1-5 TTKB Dik Temel Abece fontu, yerel, dört girişte de etkin; Türkçe glif testi
- [x] P1-6 İçerik lint'i: harf kümesi, grup ataması, hece tutarlılığı, emoji ve resim-kelime eşliği, kelime/cümle tekrarı, cümle uzunluğu ve alfabe denetimi (8 test); cümle doğallığı insan denetiminde
- [x] P1-7 Öğretmen paneli: kapsama özeti (5 grup) + JSON dışa/içe aktarma, doğrulamalı; `uygulama`da kapsama + dışa aktarma zaten vardı
- [x] P1-8 Responsive/mobil: dört girişte de yakınlaştırma açık, dikeyde çalışır (gerçek cihaz testi yok)
- [x] P1-9 Tarayıcı içi test altyapısı (`test/`): 86 test

## P2 — Konsolidasyon (kısmen tamamlandı)

- [x] P2-1 Ortak ses/depo modülü: `assets/oyun-cekirdek.js` (depolama, seslendirme, efekt, konfeti, kelime/hece havuzu)
- [x] P2-2 `oyunlar` oyunlarını çekirdeğe bağla: iki motor da `veri.js` → `fonem.js` → `oyun-cekirdek.js` sırasıyla yükleniyor
- [x] P2-3 `okuma-bayrami` verisini çekirdeğe bağla (modül ayrımı + `OrtakVeri` adaptörü yapıldı)
- [x] P2-8 Kullanılmayan `assets/ortak.js` kaldırıldı (0 referans)
- [ ] P2-4 Akıllı tahta/touch testi — `file://` temel açılış headless Chrome'da doğrulandı (kök 5 kart, iki oyunda 29 çip); ses/mikrofon/kalıcılık denenmedi
- [x] P2-5 Öğretmen onboarding: `OGRETMEN-BASLANGIC.md` (10 dk kurulum, ders akışı, sorun giderme)
- [x] P2-6 Gizlilik/veri notu: `GIZLILIK.md` (yerel saklama, mikrofon, silme, KVKK sınırı)
- [x] P2-7 README/KULLANIM güncelle

## P3 — Dagitim (okul kurulumu)

- [x] P3-1 Kurulum paketi üreticisi: `araclar/paket-olustur.ps1` → `dagitim/HeceParki-1.0.zip` + SHA256 sürüm notu
- [x] P3-2 Başlatıcılar: `Baslat.cmd`, `Sunucu-Baslat.cmd`, `sunucu.ps1` (yalnız `localhost:8123`, dizin dışına çıkış 403)
- [x] P3-3 `KURULUM.md`: kopyala-çalıştır, kısayol, mikrofon, güncelleme/geri alma, sorun giderme
- [x] P3-4 Paket duman testi: 32 dosya, zip bütünlüğü, HTTP 200, `file://` render (5 kart, 29 çip), traversal 403
- [x] P3-5 Statik web sitesi: `araclar/web-olustur.ps1` → `dagitim/HeceParki-Web/` (29 dosya, `.cmd`/`.ps1` yok) + zip
- [x] P3-6 Web sitesi testi: alt klasör HTTP 200, 5 kart, 29 çip, 5 kapsama satırı, 404, bağlantı denetimi, konsol temiz
- [ ] P3-7 Akıllı tahtada gerçek kurulum turu (P2-4 ile birlikte)
- [ ] P3-8 Tek tık kurulum (isteğe bağlı: imzalı MSIX/exe)

## Test günlüğü

| Tarih | Test | Sonuç | Not |
|---|---|---|---|
| 21.10.2026 | Aşama 1-3 envanteri | ✅ | Kod değişikliği yok |
| 21.10.2026 | Onay toplantısı | ✅ | 6 karar onaylandı |
| 21.10.2026 | `test/test.html` ilk koşu | ✅ 45/45 | Kanonik veri, heceleme, havuzlar, soru motoru |
| 21.10.2026 | `test/test.html` + iframe | ✅ 56/56 | İki oyun + `okuma-bayrami` gerçek yükleme |
| 21.10.2026 | Font/zoom + manifest + resim eşliği | ✅ 59/59 | Oyunlarda TTKB fontu, yakınlaştırma, emoji testleri |
| 21.10.2026 | Panel kapsama/yedek + içerik lint'i | ✅ 69/69 | 5 grup kapsama, yedek doğrulama, 8 lint testi |
| 22.10.2026 | Ortak oyun çekirdeği (P2-1/P2-2) | ✅ 71/71 | İki oyunda çekirdek fonksiyonları + gerçek hece havuzu; ölü `ortak.js` kaldırıldı |
| 22.10.2026 | Onboarding + gizlilik + çevrimdışı testleri | ✅ 76/76 | 5 sayfada dış istek yok; `OGRETMEN-BASLANGIC.md`, `GIZLILIK.md` |
| 22.10.2026 | Kurulum paketi 1.0 | ✅ | 32 dosya, zip bütünlüğü doğrulandı; HTTP 200 + `file://` render (5 kart, 29 çip); traversal 403 |
| 22.10.2026 | Web sitesi paketi 1.0 | ✅ | 29 dosya, `.cmd`/`.ps1` yok; alt klasörde HTTP 200 (5 kart, 29 çip, 5 kapsama); bağlantı denetimi; konsol temiz; kök TTKB fontu |
| 22.10.2026 | `test/test.html` güncel koşu | ✅ 86/86 | Hece Fabrikası + Roket testleri dahil; konsol hatası yok |
| 22.10.2026 | localStorage kalıcılığı | ✅ | HTTP sitesinde yaz → yenile → başka sayfa oku; anahtarlar `okuyorum_v1`, `okuma_bayrami_v1`, oyun/rekor/fonem |
| 22.10.2026 | GitHub Pages yayını | ✅ | https://klblip.github.io/hece-parki/ — `main`/`docs`; 18 etkinlik, 5 kart, 29 çip, 404, localStorage |
| 21.10.2026 | Kök `index.html` kartları | ✅ 4/4 HTTP 200 | Dış bağlantı yok |
