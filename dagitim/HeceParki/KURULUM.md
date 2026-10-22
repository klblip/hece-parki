# Hece Parkı — kurulum kılavuzu

Bu klasör, 1. sınıf ilk okuma-yazma etkinliklerinin **çevrimdışı** kurulumudur.
İnternet, hesap, kurulum sihirbazı gerekmez. Kopyala → aç.

## Hızlı kurulum (3 adım)

1. Zip dosyasını açın ve `HeceParki` klasörünü **`C:\HeceParki`** gibi kısa bir yola
   çıkarın (Masaüstü veya Belgeler de olur).
2. **`Sunucu-Baslat.cmd`** dosyasına çift tıklayın → oyun parkı
   `http://localhost:8123/` adresinde açılır. (Hızlı önizleme için `Baslat.cmd` de
   kullanılabilir; ancak sayfalar arasında ortak `localStorage` ve mikrofon için
   `Sunucu-Baslat.cmd` önerilir.)
3. Akıllı tahtada **F11** ile tam ekran yapın, cihaz sesini açın.

> Mikrofonla fonem kaydı ve puanların sayfalar arasında kalması için
> **`Sunucu-Baslat.cmd`** ile açın. Sunucu yalnız `http://localhost:8123/` adresini
> dinler; internete açılmaz.

## Kısayol oluşturma

- `Sunucu-Baslat.cmd` → sağ tık → **Gönder → Masaüstü (kısayol oluştur)**.
- Kısayolu **Hece Parkı** olarak yeniden adlandırın; isterseniz sağ tık → Özellikler →
  **Simge Değiştir** ile bir simge seçin.
- Akıllı tahtanın masaüstüne veya görev çubuğuna sabitleyin.

## Paket içeriği

| Yol | İçerik |
|---|---|
| `index.html` | Oyun parkı (4 giriş + yakında) |
| `uygulama/` | Okuyorum: 18 etkinlik, öğretmen paneli, Fonem Stüdyo, çarkıfelek |
| `okuma-bayrami-1-sinif.html` + `okuma-bayrami/` | Okuma Bayramı: 4 oyun + soru motoru |
| `oyunlar/hece-rallisi/` | Hece Rallisi |
| `oyunlar/ac-canavar/` | Aç Canavar |
| `assets/` | Kanonik veri, fonem sentezi, ortak oyun çekirdeği, font CSS'i |
| `Baslat.cmd` | Hızlı önizleme (file://; sayfalar arası veri paylaşımı sınırlı) |
| `Sunucu-Baslat.cmd` + `sunucu.ps1` | Önerilen: yalnız bu bilgisayarda yerel HTTP sunucusu (localStorage + mikrofon) |
| `README.md`, `OGRETMEN-BASLANGIC.md`, `GIZLILIK.md` | Tanıtım, 10 dakikalık başlangıç, gizlilik |
| `uygulama/KULLANIM.md`, `okuma-bayrami/KULLANIM.md` | Ayrıntılı kullanım |

**Pakette yoktur:** testler (`test/`), araştırma raporları (`arastirma/`), geliştirici
notları (`AGENTS.md`, `TASKS.md`), ekran görüntüleri ve TTKB font dosyası. `README.md`
kaynak projenin tanıtımıdır; orada geçen test/araştırma/web yolları bu pakette bulunmaz.

## Gereksinimler

- Windows 10/11, Chrome veya Edge (güncel).
- Ses çıkışı (hoparlör/akıllı tahta).
- Mikrofon yalnız Fonem Stüdyo'da ve isteğe bağlı.
- İnternet **gerekmez**; dış istek yoktur.

## Yazı tipi (TTKB Dik Temel Abece)

Font teliflidir ve pakete **dahil edilmez**. Cihazda kuruluysa `local()` ile kullanılır;
kurulu değilse sistem sans-serif yazı tipine düşer ve düzen bozulmaz. Kurulum/izin
bilgisi: `assets/fonts/README.md`.

## Ses

- Sessiz harfler harf adıyla değil **fonem** olarak verilir (kayıt → WebAudio sentezi).
- Ünlü, hece, kelime ve cümleler tarayıcının Türkçe sesiyle okunur (TTS).
- Türkçe ses paketi yoksa ekrandaki yazı yedek görev görür.
- İsteğe bağlı: Okuyorum → öğretmen paneli → **🎤 Fonem Stüdyo** ile kendi sesinizi
  kaydedin. Kayıtlar yalnız bu tarayıcıda tutulur; taşımak için `kayitlar.js` indirin.

## Mikrofon ve yerel sunucu

`Sunucu-Baslat.cmd`:

- Yalnız `http://localhost:8123/` adresini dinler; **ağdaki başka cihazlar erişemez**.
- Pencereyi kapatınca sunucu durur.
- 8123 doluysa uyarı verir; açık Hece Parkı penceresini kapatıp yeniden deneyin.
- Tarayıcı otomatik açılır; açılmazsa adresi elle yazın.

> Okul ağında birden çok cihazdan erişim bu paketin kapsamı **dışındadır**. Gerekirse
> ayrı bir statik sunucu ve güvenlik duvarı yapılandırması gerekir.

## Güncelleme

1. Önce Okuyorum panelinden **⬇️ İndir** ile JSON yedeği alın (adlar/skorlar/ayarlar).
2. Yeni sürümün `HeceParki` klasörünü aynı yola kopyalayın; sorular sorulursa
   **değiştir/üzerine yaz** deyin.
3. `Sunucu-Baslat.cmd` ile açın; puanlar ve ayarlar `localStorage`'da korunur.

> `localStorage` tarayıcıya ve adrese bağlıdır. `file://` ile açılan sayfalar bazı
> tarayıcılarda ayrı depolama kullanır; kayıtların sayfalar arasında görünmesi için
> `Sunucu-Baslat.cmd` (HTTP) kullanın. Dosya yolu değişirse eski kayıtlar görünmeyebilir;
> bu yüzden klasörü sabit bir yolda tutun.

## Geri alma ve kaldırma

- **Geri alma:** önceki sürümün zip'ini aynı klasöre açın.
- **Kaldırma:** `HeceParki` klasörünü silin; tarayıcıda site verilerini temizleyin
  (adres çubuğu → site bilgileri → verileri temizle).
- Ayrıntılı silme: `GIZLILIK.md`.

## İlk açılışta kontrol listesi

- [ ] `index.html` açılıyor, 4 kart + 1 "Yakında" görünüyor.
- [ ] Okuyorum ana ekranı ve 18 etkinlik kartı görünüyor.
- [ ] Hece Rallisi ile Aç Canavar'da 29 harf çipi listeleniyor.
- [ ] Ses duyuluyor; sessiz harfte "te" değil kısa ses çıkıyor.
- [ ] TTKB fontu kuruluysa yazı tipi dik temel; değilse okunaklı sistem fontu.
- [ ] F11 tam ekran ve dokunmatik tek dokunuş çalışıyor.
- [ ] Mikrofon gerekiyorsa `Sunucu-Baslat.cmd` ile açılıp kayıt alınabiliyor.

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| Çift tıkta "Windows korumalı" uyarısı | **Ek bilgi → Yine de çalıştır**. Zip'i indirdiyseniz: zip → sağ tık → Özellikler → **Engellemeyi kaldır** → yeniden çıkarın |
| `Baslat.cmd` açılmıyor | `index.html` dosyasına sağ tık → **Birlikte aç → Chrome/Edge** |
| Ses yok | Cihaz sesi, tarayıcı sekmesi, Türkçe ses paketi |
| Mikrofon açılmıyor | `Sunucu-Baslat.cmd` kullanın; tarayıcı iznini verin |
| 8123 dolu | Açık sunucu penceresini kapatın veya bilgisayarı yeniden başlatın |
| Eski puanlar yok | Klasör yolu değişmiş olabilir; sabit yol kullanın, JSON yedeğini yükleyin |
| Font farklı | TTKB fontu cihazda kurulu değil (bkz. `assets/fonts/README.md`) |

## Bilinen sınırlar

- `file://` ile temel açılış doğrulandı; ses, mikrofon ve kalıcılık bu modda tam
  denenmedi. Mikrofon için sunucu modu önerilir.
- Akıllı tahta ve gerçek dokunmatik cihazda saha testi yapılmadı.
- Stüdyo kalitesinde, dağıtıma hazır 29 fonem kaydı yok; sentez + TTS yedeği kullanılır.
- Cümlelerin anlam/bağlam uygunluğu öğretmen değerlendirmesindedir.
