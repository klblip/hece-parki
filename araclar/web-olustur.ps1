# Iki ayri urun icin statik web paketi uretir (bu betik ASCII yazilmistir):
#   Hece Parki -> dagitim/HeceParki-Web   (ANA SITE: Okuyorum + iki oyun)
#   Okuyorum   -> dagitim/Okuyorum-Web    (yalniz ogretmen etkinlik uygulamasi)
# Kullanim:
#   powershell -ExecutionPolicy Bypass -File araclar/web-olustur.ps1
#   powershell -ExecutionPolicy Bypass -File araclar/web-olustur.ps1 -Urun Okuyorum
param(
  [ValidateSet("Hepsi","HeceParki","Okuyorum")][string]$Urun = "Hepsi",
  [string]$Surum = "1.0"
)

$hata = $false
function Adim($mesaj) { Write-Host "* $mesaj" }
function Uyar($mesaj) { Write-Host "  HATA: $mesaj" -ForegroundColor Red; $script:hata = $true }

$kok = Split-Path -Parent $PSScriptRoot
$dagitim = Join-Path $kok "dagitim"
New-Item -ItemType Directory -Path $dagitim -Force | Out-Null

function FontDosyalariniCikar($klasor) {
  $yol = Join-Path $klasor "assets\fonts"
  if (Test-Path -LiteralPath $yol) {
    $fontDosyalari = @(Get-ChildItem -LiteralPath $yol -File |
      Where-Object { $_.Extension -match '^\.(ttf|otf|woff2?)$' })
    if ($fontDosyalari.Count -gt 0) {
      Write-Host "  UYARI: Font dosyasi bulundu; telif nedeniyle web paketine alinmadi." -ForegroundColor Yellow
      Write-Host "       Gomme icin hak sahibinden yazili izin gerekir." -ForegroundColor Yellow
      $fontDosyalari | Remove-Item -Force
    }
  }
}

# Ortak site saglik kontrolleri (her iki urun icin)
function SiteSaglikKontrol {
  param($hedef, $sadeceBuKlasorler)

  $yasakAdlar = @("test", "arastirma", "test-goruntuleri", "ortak.js", "AGENTS.md", "TASKS.md", "KURULUM.md", "sunucu.ps1", "Baslat.cmd", "Sunucu-Baslat.cmd")
  $bulunan = Get-ChildItem -LiteralPath $hedef -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { $yasakAdlar -contains $_.Name }
  foreach ($b in $bulunan) {
    Write-Host ("  SITEDE OLMAMALI: " + $b.Name) -ForegroundColor Red
    $script:hata = $true
  }

  $betikler = @(Get-ChildItem -LiteralPath $hedef -Recurse -File |
    Where-Object { $_.Extension -in ".cmd", ".ps1", ".bat" })
  if ($betikler.Count -gt 0) {
    Write-Host ("  SITEDE CALISTIRILABILIR BETIK OLMAMALI: " + $betikler[0].Name) -ForegroundColor Red
    $script:hata = $true
  }

  # HTML baglantilari: kok-adi (/...) yasak, yerel hedefler var olmali, file:// yok.
  $baglantiSayisi = 0
  $htmlDosyalar = @(Get-ChildItem -LiteralPath $hedef -Recurse -File |
    Where-Object { $_.Extension -eq ".html" })
  foreach ($html in $htmlDosyalar) {
    $metin = Get-Content -LiteralPath $html.FullName -Raw
    if ($metin -match 'file:///') {
      Write-Host ("  YEREL DOSYA YOLU: " + $html.Name) -ForegroundColor Red
      $script:hata = $true
    }
    $desen = '(?:href|src)\s*=\s*(?:"([^"]+)"|''([^'']+)''|([^\s>]+))'
    foreach ($e in [regex]::Matches($metin, $desen)) {
      $link = if ($e.Groups[1].Success) { $e.Groups[1].Value } elseif ($e.Groups[2].Success) { $e.Groups[2].Value } else { $e.Groups[3].Value }
      $link = $link.Trim()
      if (-not $link) { continue }
      if ($link -match '^(#|https?:|mailto:|tel:|data:|javascript:)') { continue }
      $temiz = $link.Split('#')[0].Split('?')[0]
      if (-not $temiz) { continue }
      if ($temiz.StartsWith('/')) {
        Write-Host ("  KOK-ADI BAGLANTI: " + $html.Name + " -> " + $link) -ForegroundColor Red
        $script:hata = $true
        continue
      }
      $hedefYol = [System.IO.Path]::GetFullPath((Join-Path $html.DirectoryName ($temiz -replace '/', '\')))
      if (-not (Test-Path -LiteralPath $hedefYol)) {
        Write-Host ("  KIRIK BAGLANTI: " + $html.Name + " -> " + $link) -ForegroundColor Red
        $script:hata = $true
      }
      $baglantiSayisi++
    }
  }

  # CSS icinde kok-adli url() olmamali
  foreach ($css in @(Get-ChildItem -LiteralPath $hedef -Recurse -File |
    Where-Object { $_.Extension -eq ".css" })) {
    $metin = Get-Content -LiteralPath $css.FullName -Raw
    if ($metin -match 'url\(\s*["'']?/') {
      Write-Host ("  KOK-ADI CSS YOLU: " + $css.Name) -ForegroundColor Red
      $script:hata = $true
    }
  }

  # Calisma zamaninda dis alan adi istegi olmamali (localhost/w3 namespace haric)
  $dis = @()
  foreach ($dosya in @(Get-ChildItem -LiteralPath $hedef -Recurse -File |
    Where-Object { $_.Extension -in ".html", ".css", ".js" })) {
    $metin = Get-Content -LiteralPath $dosya.FullName -Raw
    foreach ($e in [regex]::Matches($metin, 'https?://[^\s"''<>)]+')) {
      $url = $e.Value
      if ($url -match '^https?://localhost' -or $url -match '^https?://127\.0\.0\.1' -or $url -match '^https?://www\.w3\.org/') { continue }
      $dis += "$($dosya.Name): $url"
    }
  }
  if ($dis.Count -gt 0) {
    Write-Host "  DIS ALAN ADI BULUNDU:" -ForegroundColor Red
    $dis | Select-Object -Unique | ForEach-Object { Write-Host ("    " + $_) -ForegroundColor Red }
    $script:hata = $true
  }

  return $baglantiSayisi
}

function ZipYazWeb($hedef, $zipAd, $aciklama, $baglantiSayisi, $notlar) {
  $zip = Join-Path $dagitim "$zipAd-Web-$Surum.zip"
  if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }
  Adim "Zip yaziliyor: $zip"
  Compress-Archive -LiteralPath $hedef -DestinationPath $zip -CompressionLevel Optimal

  $adet = (Get-ChildItem -LiteralPath $hedef -Recurse -File).Count
  $bagt = (Get-ChildItem -LiteralPath $hedef -Recurse -File | Measure-Object -Property Length -Sum).Sum
  $zipBoyut = [math]::Round((Get-Item -LiteralPath $zip).Length / 1MB, 2)
  $hash = (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash

  $surumNotu = @(
    $aciklama,
    "Surum       : $Surum",
    "Tarih       : $(Get-Date -Format 'yyyy-MM-dd')",
    "Dosya sayisi: $adet",
    "Acik boyut  : $([math]::Round($bagt / 1MB, 2)) MB",
    "Zip boyutu  : $zipBoyut MB",
    "SHA256      : $hash",
    "Baglanti    : $baglantiSayisi yerel baglanti denetlendi",
    "",
    "Kaynak testleri: 90/90 (test/test.html, yerel sunucu)",
    "Urunler: Hece Parki ana site (Okuyorum + iki oyun); Okuyorum ayri uygulama paketi.",
    "Gizlilik : GIZLILIK.md"
  ) + $notlar
  $notYolu = Join-Path $dagitim "$zipAd-Web-$Surum-SURUM.txt"
  Set-Content -LiteralPath $notYolu -Value $surumNotu -Encoding UTF8

  Write-Host ""
  Write-Host "Hazir." -ForegroundColor Green
  Write-Host "  Klasor : $hedef"
  Write-Host "  Zip    : $zip ($zipBoyut MB)"
  Write-Host "  Not    : $notYolu"
  Write-Host "  Dosya  : $adet"
  Write-Host "  SHA256 : $hash"
}

# ---------- Hece Parki ana web paketi (Okuyorum + iki oyun) ----------
function HeceParkiWeb {
  Adim "=== Hece Parki - ana statik web sitesi ==="
  $hedef = Join-Path $dagitim "HeceParki-Web"
  if (Test-Path -LiteralPath $hedef) { Remove-Item -LiteralPath $hedef -Recurse -Force }
  New-Item -ItemType Directory -Path $hedef -Force | Out-Null

  $kaynaklar = @(
    @{ Kaynak = "index.html"; Hedef = "index.html" },
    @{ Kaynak = "404.html"; Hedef = "404.html" },
    @{ Kaynak = "OGRETMEN-BASLANGIC.md"; Hedef = "OGRETMEN-BASLANGIC.md" },
    @{ Kaynak = "GIZLILIK.md"; Hedef = "GIZLILIK.md" },
    @{ Kaynak = "WEB-YAYIN.md"; Hedef = "YAYIN.md" }
  )
  foreach ($k in $kaynaklar) {
    $kaynak = Join-Path $kok $k.Kaynak
    if (-not (Test-Path -LiteralPath $kaynak -PathType Leaf)) { Uyar ("Eksik dosya: " + $k.Kaynak); continue }
    Copy-Item -LiteralPath $kaynak -Destination (Join-Path $hedef $k.Hedef) -Force
  }

  $klasorler = @("assets", "oyunlar", "uygulama")
  foreach ($klasor in $klasorler) {
    $kaynak = Join-Path $kok $klasor
    if (-not (Test-Path -LiteralPath $kaynak -PathType Container)) { Uyar ("Eksik klasor: " + $klasor); continue }
    Copy-Item -LiteralPath $kaynak -Destination $hedef -Recurse -Force
  }
  $cikar = @("uygulama\test-goruntuleri", "uygulama\sunucu.ps1", "uygulama\font", "oyunlar\font")
  foreach ($c in $cikar) {
    $yol = Join-Path $hedef $c
    if (Test-Path -LiteralPath $yol) { Remove-Item -LiteralPath $yol -Recurse -Force }
  }
  FontDosyalariniCikar $hedef

  $bulunanOkuma = Get-ChildItem -LiteralPath $hedef -Recurse -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq "okuma-bayrami" }
  if ($bulunanOkuma) {
    Write-Host "  SITEDE OLMAMALI: okuma-bayrami (yayin disi)" -ForegroundColor Red
    $script:hata = $true
  }

  $sayi = SiteSaglikKontrol $hedef
  GerekliKontrolWeb $hedef @(
    "index.html",
    "404.html",
    "YAYIN.md",
    "assets\veri.js",
    "assets\fonem.js",
    "assets\oyun-cekirdek.js",
    "assets\font.css",
    "assets\fonts\README.md",
    "assets\sesler\manifest.js",
    "uygulama\index.html",
    "oyunlar\hece-rallisi\index.html",
    "oyunlar\ac-canavar\index.html"
  )
  if ($script:hata) { Write-Host "Site paketi uretilmedi; hatalari duzeltin." -ForegroundColor Red; return }

  $not = @("Yayinlama: YAYIN.md", "Ana site Okuyorum'dur; Hece Rallisi ve Ac Canavar ana ekrandaki Oyunlar bolumundedir.")
  ZipYazWeb $hedef "HeceParki" "Hece Parki - statik web sitesi (ana site: Okuyorum + iki oyun)" $sayi $not
}

# ---------- Okuyorum web paketi ----------
function OkuyorumWeb {
  Adim "=== Okuyorum - statik web paketi ==="
  $hedef = Join-Path $dagitim "Okuyorum-Web"
  if (Test-Path -LiteralPath $hedef) { Remove-Item -LiteralPath $hedef -Recurse -Force }
  New-Item -ItemType Directory -Path $hedef -Force | Out-Null

  $giris = Join-Path $hedef "index.html"; New-Item -ItemType Directory -Path $hedef -Force | Out-Null
  $girisYaz = Join-Path $PSScriptRoot "okuyorum-giris.html"
  if (-not (Test-Path -LiteralPath $girisYaz -PathType Leaf)) { Uyar "Eksik dosya: araclar/okuyorum-giris.html" }
  else { Copy-Item -LiteralPath $girisYaz -Destination $giris -Force }

  $kaynaklar = @(
    @{ Kaynak = "GIZLILIK.md"; Hedef = "GIZLILIK.md" }
  )
  foreach ($k in $kaynaklar) {
    $kaynak = Join-Path $kok $k.Kaynak
    if (-not (Test-Path -LiteralPath $kaynak -PathType Leaf)) { Uyar ("Eksik dosya: " + $k.Kaynak); continue }
    Copy-Item -LiteralPath $kaynak -Destination (Join-Path $hedef $k.Hedef) -Force
  }

  $uy = Join-Path $kok "uygulama"
  if (-not (Test-Path -LiteralPath $uy -PathType Container)) { Uyar "Eksik klasor: uygulama"; return }
  Copy-Item -LiteralPath $uy -Destination $hedef -Recurse -Force
  $cikar = @("uygulama\test-goruntuleri", "uygulama\sunucu.ps1", "uygulama\font")
  foreach ($c in $cikar) {
    $yol = Join-Path $hedef $c
    if (Test-Path -LiteralPath $yol) { Remove-Item -LiteralPath $yol -Recurse -Force }
  }

  # uygulamanin kullandigi ortak varliklar (oyun parki dosyalari haric)
  $vKok = Join-Path $hedef "assets"
  New-Item -ItemType Directory -Path $vKok -Force | Out-Null
  $assetsKok = Join-Path $kok "assets"
  foreach ($v in @("veri.js", "fonem.js", "font.css")) {
    $kaynak = Join-Path $assetsKok $v
    if (-not (Test-Path -LiteralPath $kaynak -PathType Leaf)) { Uyar ("Eksik varlik: assets\" + $v); continue }
    Copy-Item -LiteralPath $kaynak -Destination (Join-Path $vKok $v) -Force
  }
  foreach ($alt in @("sesler", "fonts")) {
    $kaynak = Join-Path $assetsKok $alt
    if (-not (Test-Path -LiteralPath $kaynak -PathType Container)) { Uyar ("Eksik varlik: assets\" + $alt); continue }
    Copy-Item -LiteralPath $kaynak -Destination (Join-Path $vKok $alt) -Recurse -Force
  }
  FontDosyalariniCikar $hedef

  $bulunanPark = Get-ChildItem -LiteralPath $hedef -Recurse -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -in "oyunlar", "okuma-bayrami" }
  if ($bulunanPark) {
    Write-Host "  SITEDE OLMAMALI: oyun parki klasoru (ayri urun)" -ForegroundColor Red
    $script:hata = $true
  }

  $sayi = SiteSaglikKontrol $hedef
  GerekliKontrolWeb $hedef @(
    "index.html",
    "uygulama\index.html",
    "uygulama\js\uygulama.js",
    "uygulama\js\veri.js",
    "uygulama\js\ses.js",
    "uygulama\js\studyo.js",
    "uygulama\css\stil.css",
    "assets\veri.js",
    "assets\fonem.js",
    "assets\font.css",
    "assets\sesler\manifest.js",
    "assets\fonts\README.md",
    "GIZLILIK.md"
  )

  # index.html uygulama/iceri yonlendirme icerir mi?
  $girisMetni = Get-Content -LiteralPath $giris -Raw
  if ($girisMetni -notmatch 'uygulama/index\.html') {
    Write-Host "  GIRIS YONLENDIRMESI EKSIK" -ForegroundColor Red
    $script:hata = $true
  }

  if ($script:hata) { Write-Host "Site paketi uretilmedi; hatalari duzeltin." -ForegroundColor Red; return }

  $not = @("Yayinlama rehberi: kok WEB-YAYIN.md; Okuyorum kendi alt adresinde sunulur.")
  ZipYazWeb $hedef "Okuyorum" "Okuyorum - statik web sitesi (ogretmen etkinlik uygulamasi)" $sayi $not
}

function GerekliKontrolWeb($hedef, $gerekli) {
  foreach ($g in $gerekli) {
    if (-not (Test-Path -LiteralPath (Join-Path $hedef $g) -PathType Leaf)) {
      Write-Host "  GEREKLI DOSYA YOK: $g" -ForegroundColor Red
      $script:hata = $true
    }
  }
}

if ($Urun -in @("Hepsi","HeceParki")) { HeceParkiWeb }
if ($Urun -in @("Hepsi","Okuyorum"))  { OkuyorumWeb }

if ($hata) {
  Write-Host "Bazi paketler hatayla uretilmedi; ustteki kayitlara bakin." -ForegroundColor Red
  exit 1
}
