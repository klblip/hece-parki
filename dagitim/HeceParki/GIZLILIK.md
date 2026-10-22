# Gizlilik ve veri notu

**Son güncelleme:** 22.10.2026
**Kapsam:** Hece Parkı (kök `index.html`), Okuyorum (`uygulama/`), Okuma Bayramı
(`okuma-bayrami-1-sinif.html`), Hece Rallisi ve Aç Canavar (`oyunlar/`).

## Kısa özet

- Hesap, giriş, reklam, çerez, analitik ve izleme **yoktur**.
- Uygulama hiçbir veriyi bir sunucuya **göndermez**; bütün dosyalar yereldir.
- Puanlar, adlar ve ayarlar yalnızca bu cihazın tarayıcısında (`localStorage`) tutulur.
- Mikrofon yalnızca **Fonem Stüdyo**'da, açık izinle ve yalnız kayıt sırasında kullanılır.
- Kayıtlar cihazdan dışarı çıkmaz; dışa aktarma öğretmenin başlattığı bir dosya indirmedir.

## Ağ ve dış istekler

- Dört girişte de dış `http(s)` bağlantısı yoktur; bu, otomatik testle denetlenir.
- **Web sürümü:** Sayfa dosyaları barındırma sağlayıcısından gelir; sağlayıcı standart
  web sunucusu günlüklerinde sayfa isteklerini (IP, tarih) tutabilir. Uygulama öğrenci
  verisi göndermez. Web sürümünde sunucu tarafı kod yoktur.
- Kurulum paketindeki yerel sunucu yalnız `http://localhost:8123/` adresini dinler;
  ağdaki başka cihazlar erişemez (mikrofon için güvenli bağlam sağlar).
- Yazı tipi `local()` ile cihazda kurulu fonttan gelir; font indirilmez.
- Sesler sırayla: `localStorage` kaydı → `assets/fonem.js` WebAudio sentezi → tarayıcı TTS.
- **TTS sınırı (dürüst not):** Seslendirmeyi tarayıcı/işletim sistemi yapar. Cihazda
  "bulut" ses paketi seçiliyse işletim sistemi metni kendi servisine gönderebilir;
  uygulama bunu denetleyemez. Tam çevrimdışı kullanım için cihazın **yerel** Türkçe
  ses paketini seçin ve bir kez uçak modunda deneyin.

## Cihazda saklanan veriler

| Anahtar | İçerik | Nerede oluşur |
|---|---|---|
| `okuyorum_v1` | Puan, aşama seçimi, grup kilidi, öğretmenin kelime/cümle düzenlemeleri, skorlar, son oyuncu adı, öğrenci listesi (en fazla 60 ad), oyun modları | Okuyorum |
| `okuma_bayrami_v1` | Öğrenci adları, seçilen harfler, soru tipleri, tur sayısı, ses ayarları, skorlar | Okuma Bayramı |
| `ralli_isim` | Son oyuncu adı | Hece Rallisi |
| `ralliRekorlar` | Son 20 rekor (ad, süre, mod) | Hece Rallisi |
| `canavar_isim` | Son oyuncu ad(lar)ı | Aç Canavar |
| `canavarRekorlar` | Son 20 rekor (ad, süre, mod) | Aç Canavar |
| `fonemKayitlari` | 29 harfin öğretmen sesiyle kaydı (base64 WAV) | Fonem Stüdyo |

Kelime ve cümle bankası bu anahtarlarda değil, `assets/veri.js` dosyasındadır.
Öğretmenin panelden yaptığı içerik düzenlemeleri `okuyorum_v1` içinde saklanır.

> **Web sürümü:** `localStorage` alan adına bağlıdır. Site adresi değişirse (ör. yeni
> alan adı veya alt klasör) eski kayıtlar görünmeyebilir; önce Okuyorum panelinden
> JSON yedeği alın.

## Mikrofon (Fonem Stüdyo)

- Mikrofon yalnızca **"Kaydı başlat"** düğmesine basıldığında açılır; kayıt
  durdurulunca ses izi kapatılır.
- Tarayıcı izin ister. İzin verilmezse kayıt alınmaz; uygulamanın diğer bölümleri
  çalışmaya devam eder.
- Ses, tarayıcının içinde işlenir (sessizlik kırpma, seviye normalizasyonu, 22 kHz mono
  WAV). Hiçbir aşamada sunucuya yüklenmez.
- Kayıt, `localStorage`'a base64 metin olarak yazılır. Tarayıcı kotası (genellikle
  5–10 MB) dolabilir; dolduğunda uygulama kaydı yalnız o oturum için tutar ve
  `kayitlar.js` indirmeyi önerir.
- **Silme:** Stüdyoda harf bazında 🗑 veya **"Hepsini sil"**. Ayrıca tarayıcı
  konsolunda `localStorage.removeItem("fonemKayitlari")`.
- **Dışa aktarma:** "kayitlar.js indir" yalnızca bu cihaza dosya indirir. Dosyayı
  paylaşmak veya başka cihaza kopyalamak öğretmenin sorumluluğundadır.
- Mikrofon erişimi tarayıcıda güvenli bağlam ister. Sorun olursa `file://` yerine
  yerel sunucu (`http://localhost:...`) kullanın.

## Öğrenci adları

- Ad girmek **isteğe bağlıdır**; boş bırakılabilir.
- Adlar rekor tablolarında ve öğretmen listesinde görünür.
- Ortak kullanılan akıllı tahtada adlar kişisel veri sayılabilir; dönem sonunda
  temizleyin.
- Panelden indirilen JSON yedekleri ve `kayitlar.js` de bu adları içerebilir;
  paylaşırken dikkat edin.

## Verileri silme

1. **Uygulama içi:** Okuyorum panelinde sıfırlama; oyunlarda rekor temizleme;
   Fonem Stüdyo'da "Hepsini sil".
2. **Tarayıcı:** Site verilerini temizleyin veya konsolda `localStorage.clear()`.
3. `localStorage.clear()` bu cihazdaki **tüm** uygulama verilerini ve fonem
   kayıtlarını siler; geri alınamaz. Öncesinde JSON yedeği alın.

## Uyum notu

- Bu uygulama veri **toplamaz, aktarmaz ve profillemez**; yalnız yerel saklar.
- KVKK kapsamında veri sorumluluğu okulun/kurumun politikasına bağlıdır.
- Bu metin hukuki görüş değildir; kurumunuzun gizlilik politikasına göre uyarlayın.
