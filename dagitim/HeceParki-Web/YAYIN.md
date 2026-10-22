# Hece Parkı — web sitesi olarak yayınlama

Hece Parkı saf **HTML + CSS + JavaScript** sitesidir. Sunucu tarafı kod, veritabanı,
reklam, analitik ve dış istek yoktur. Site klasörünü herhangi bir statik barındırma
hizmetine veya okul web sunucusuna yükleyebilirsiniz.

## Yayına hazır klasör

- **`dagitim/HeceParki-Web/`** — doğrudan yüklenebilir site
- **`dagitim/HeceParki-Web-1.0.zip`** — sıkıştırılmış kopya
- **`dagitim/HeceParki-Web-1.0-SURUM.txt`** — dosya sayısı, boyut, SHA256

Yeniden üretmek için:

```powershell
powershell -ExecutionPolicy Bypass -File araclar/web-olustur.ps1
```

## Hızlı yerel önizleme

1. `dagitim/HeceParki-Web/index.html` dosyasını Chrome/Edge ile açın.
2. Akıllı tahtada **F11** ile tam ekran yapın.
3. Ses ve yazı tipini kontrol edin.

> `file://` altında temel görünüm çalışır. **Mikrofon** ve bazı tarayıcı özellikleri
> için `localhost` veya HTTPS gerekir. Yayınladığınız sitede HTTPS varsa Fonem Stüdyo
> çalışır.

## Yayınlama seçenekleri

### GitHub Pages (ücretsiz, HTTPS)

1. Yeni bir depo açın.
2. `HeceParki-Web` klasörünün **içindeki** dosyaları depo köküne yükleyin.
3. **Settings → Pages → Deploy from a branch → main / (root)** seçin.
4. `https://<kullanıcı>.github.io/<depo>/` adresini açın.

Proje alt klasörde yayınlanacağı için tüm bağlantılar göreli tutulmuştur; ek ayar
gerekmez.

### Netlify / Cloudflare Pages (sürükle-bırak)

- Build komutu **yok**; yayın dizini olarak `HeceParki-Web` klasörünü seçin veya
  klasörü sürükleyip bırakın.

### Okul web sunucusu (IIS / Apache / Nginx)

- Dosyaları web köküne kopyalayın.
- HTTPS kullanmanız önerilir (mikrofon izni için).
- MIME türleri: `.html text/html`, `.css text/css`, `.js text/javascript`,
  `.json application/json`, `.svg image/svg+xml`.
- `404.html` dosyasını özel hata sayfası olarak tanımlayabilirsiniz.

### Yerel ağda paylaşım (isteğe bağlı)

Siteyi okul içi ağda yayınlamak için herhangi bir statik sunucu yeterlidir. Bu paket
sunucu tarafı kod içermez; ağ yapılandırması (IP, güvenlik duvarı, HTTPS) okulun BT
birimine aittir.

## Yazı tipi (TTKB Dik Temel Abece)

- `assets/font.css` yalnızca **`local()`** kullanır; font dosyası indirmez.
- Fontun kurulu olduğu bilgisayarda (bu makine dahil) yazı tipi doğru görünür.
- Ziyaretçinin cihazında font kurulu değilse `Segoe UI` / sistem fontuna düşer;
  düzen bozulmaz.
- Fontu siteye **gömerek dağıtmak** için hak sahibinden yazılı izin gerekir. İzin
  alınmadan `assets/fonts/` içine font dosyası konmaz ve `@font-face url(...)`
  eklenmez. Fontun kurulu olmadığı sınıf cihazlarına fontu ayrıca kurmak en temiz
  yoldur.

## Ses ve mikrofon

- Sessiz harfler WebAudio fonem senteziyle; ünlü/kelime/cümleler tarayıcı TTS'siyle
  okunur.
- TTS tamamen çevrimdışı değildir: cihazda **bulut** ses paketi seçiliyse işletim
  sistemi metni kendi servisine gönderebilir. Yerel Türkçe ses paketi seçin.
- Fonem Stüdyo mikrofonu yalnız **HTTPS** veya **localhost** üzerinde çalışır.
- Kayıtlar cihazda (`localStorage`) kalır; sunucuya yüklenmez.

## Veri ve gizlilik

- Öğrenci adları, puanlar ve ayarlar tarayıcının `localStorage` alanında tutulur.
- Veriler alan adına bağlıdır: site adresi değişirse eski kayıtlar görünmez. Önce
  Okuyorum panelinden **JSON yedeği** alın.
- Uygulama öğrenci verisi göndermez. Yayınladığınız barındırma sağlayıcısı, standart
  web sunucusu günlüklerinde sayfa isteklerini (IP, tarih) tutabilir; bu, uygulamanın
  değil sağlayıcının veri işlemesidir. Ayrıntı: `GIZLILIK.md`.

### localStorage anahtarları

| Anahtar | İçerik |
|---|---|
| `okuyorum_v1` | Puan, aşama, grup kilidi, öğretmen düzenlemeleri, öğrenci listesi, oyun modları |
| `okuma_bayrami_v1` | Öğrenci adları, seçilen harfler, soru tipleri, tur sayısı, ses ayarları, skorlar |
| `ralli_isim` / `canavar_isim` | Son oyuncu adı |
| `ralliRekorlar` / `canavarRekorlar` | Son 20 rekor |
| `fonemKayitlari` | Fonem Stüdyo'da kaydedilen 29 harf (base64 WAV) |

> Normal HTTP/HTTPS sitesinde aynı alan adı altındaki sayfalar bu verileri paylaşır.
> Yazma → sayfa yenileme → başka sayfada okuma testi yapıldı. Tarayıcı verileri
> temizlenirse veya gizli/özgeçmiş modu kullanılırsa kayıtlar silinir; JSON yedeği alın.

## Güncelleme

1. Yeni sürümü yükleyin; dosyaların üzerine yazın.
2. Tarayıcıda **Ctrl+F5** ile önbelleği atlayarak yenileyin.
3. `localStorage` korunur; yine de önce JSON yedeği almanız önerilir.
4. Sürüm notunu (`SURUM.txt`) güncel tutun.

## Yayın öncesi kontrol listesi

- [ ] Ana sayfa açılıyor; 4 kart + 1 "Yakında" görünüyor.
- [ ] Okuyorum, Okuma Bayramı ve iki oyun açılıyor.
- [ ] İki oyunda 29 harf çipi listeleniyor.
- [ ] Ses duyuluyor; sessiz harfte harf adı değil ses çıkıyor.
- [ ] TTKB fontu kurulu cihazda dik temel yazı görünüyor.
- [ ] Adres çubuğunda kilit (HTTPS) var; mikrofon izni isteniyor.
- [ ] Geliştirici araçları → Network: dış alan adına istek yok.
- [ ] `404.html` özel hata sayfası olarak çalışıyor.
- [ ] Gizlilik metni (`GIZLILIK.md`) okul politikasına uygun.

## Bilinen sınırlar

- Bu sürümde **service worker yoktur**; sayfa ilk kez yüklenirken internet gerekir.
  Tam çevrimdışı sınıf kullanımı için `dagitim/HeceParki-1.0.zip` paketini kullanın.
- Statik sitede sunucu tarafı yoktur; sınıf listesi ve puanlar cihazda kalır.
- Akıllı tahta ve gerçek dokunmatik cihazda saha testi yapılmadı.
- Stüdyo kalitesinde, dağıtıma hazır 29 fonem kaydı yok; sentez + TTS kullanılır.
