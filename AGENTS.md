# AGENTS — Proje çalışma kuralları

## Amaç
1. sınıf Türkçe ilk okuma-yazma için çevrimdışı, reklamsız, dokunmatik uyumlu etkinlikler geliştirmek.
Üç sistem vardır:
- `uygulama/` — 18 etkinlik + öğretmen paneli + çarkıfelek
- `oyunlar/` — `hece-rallisi`, `ac-canavar`
- `okuma-bayrami-1-sinif.html` — 4 oyun + soru motoru (modüllere ayrıldı)

## Değişmez kurallar
1. **Müfredat:** Türkiye Yüzyılı Maarif Modeli 2026 İlkokul Türkçe Dersi Öğretim Programı (1-4) esas alınır.
2. **Harf sırası:** `a,n,e,t,i,l` / `o,k,u,r,ı,m` / `ü,s,ö,y,d,z` / `ç,b,g,c,ş` / `p,h,v,ğ,f,j`.
3. **Yazı:** Tırnaksız dik temel harfler. Küçük harf önce, büyük harf sonra.
4. **Hece:** `n` harfinden sonra hece çalışması. Kapalı hece açık heceden önce.
5. **Cümle:** 1. grupta cümle/metin yok; cümleler 2. gruptan itibaren.
6. **Renk:** Hece/kelime harflerini renkle ayrıştırma yok. Çerçeve/background serbest.
7. **Görsel:** Öğretilmemiş harf içeren kelimeyi resimle ikame etme. Kelime, resimle aynı olmalı.
8. **Ses:** Harf adıyla ses öğretme. Kayıtlı fonem hedef; TTS yedek ve etiketli.
9. **İçerik:** Somut, mantıklı, doğal cümleler. Uydurma kelime/cümle yok.
10. **Erişilebilirlik:** Klavye, `aria-label`, `focus-visible`, `aria-live`, `prefers-reduced-motion`.
11. **Çevrimdışı:** Dış istek yok. Fontlar yerel. `localStorage` isteğe bağlı.
12. **Telif:** Rakip kod/görsel/ses/metin kopyalanmaz; yalnız ilke çıkarılır.
13. **Font:** TTKB Dik Temel Abece teliflidir; **dosya kopyalanmaz/dağıtılmaz**. Kurulu font `local()` ile kullanılır. Dağıtım için hak sahibinden izin gerekir.
14. **Test:** Her P0/P1/P2/P3 değişikliği `test/` altındaki tarayıcı testleriyle doğrulanır.
15. **Kapsam:** P0 bitmeden yeni oyun/etkinlik eklenmez.

## Dosya düzeni
```
assets/
  veri.js          kanonik 29 harf, kelime, cümle, hecele()
  fonem.js         WebAudio fonem sentezleyici (sessiz harfler)
  oyun-cekirdek.js iki oyunun ortak yardımcıları (depo, ses, efekt, havuz, harf seti)
  font.css         TTKB local() + fallback
  sesler/          kayıtlı fonem manifesti (boş başlar)
  fonts/           font lisans notu (dosya yok)
test/
  test.html        tarayıcı içi testler (86 assertion, iframe dahil)
araclar/
  paket-olustur.ps1  kurulum paketi üretir (dagitim/HeceParki-*.zip)
  web-olustur.ps1    statik web sitesi üretir (dagitim/HeceParki-Web/)
dagitim/           üretilen kurulum/web paketi (kaynak değil)
index.html         oyun parkı (TTKB local font)
404.html           web sitesi hata sayfası
WEB-YAYIN.md       web yayınlama kılavuzu
okuma-bayrami/
  css/stil.css
  js/yardim.js     ortak yardımcılar
  js/veri.js       OrtakVeri adaptörü
  js/soru.js       durum, havuzlar, 6 soru tipi
  js/ses.js        TTS + fonem + efekt
  js/oyun.js       4 oyun, panel, kura
```

## Kanonik veri
Tek kaynak `assets/veri.js` → `window.OrtakVeri`.
- `GROUPS` (5 resmî grup)
- `GRUPLAR` (`uygulama` uyumlu, `TÜM SESLER` dahil)
- `SOZLUK` (kelime + emoji)
- `CUMLER`
- `hecele()`, `harfUyar()`, `heceTuru()`
- `izinliHarfler()`, `kelimeHavuzu()`, `cumleHavuzu()`

Yeni kelime eklerken:
- küçük harf,
- yalnız Türk alfabesi,
- resim kullanılacaksa emoji zorunlu,
- kelime, atandığı grubun kümülatif harfleriyle yazılabilmeli.

## Bilinen sınırlamalar
- Kayıtlı fonem dosyaları henüz yok; TTS yedek.
- `file://` davranışı bu oturumda tam doğrulanamadı.
- Akıllı tahta/touch testi yapılmadı.
- Ücretli platformlar incelenemedi.
