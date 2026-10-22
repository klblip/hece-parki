# Iki ayri urun icin kurulum paketi uretir (bu betik ASCII yazilmistir):
#   Hece Parki -> dagitim/HeceParki/ + HeceParki-<surum>.zip  (ANA SITE: Okuyorum + iki oyun)
#   Okuyorum   -> dagitim/Okuyorum/  + Okuyorum-<surum>.zip   (yalniz ogretmen etkinlik uygulamasi)
# Kullanim:
#   powershell -ExecutionPolicy Bypass -File araclar/paket-olustur.ps1
#   powershell -ExecutionPolicy Bypass -File araclar/paket-olustur.ps1 -Urun Okuyorum -Surum 1.1
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

# Font dosyalari (ttf/otf/woff) teliflidir: hicbir pakete alinmaz.
function FontDosyalariniCikar($klasor) {
  $yol = Join-Path $klasor "assets\fonts"
  if (Test-Path -LiteralPath $yol) {
    $bulunan = @(Get-ChildItem -LiteralPath $yol -File | Where-Object { $_.Extension -match '^\.(ttf|otf|woff2?)$' })
    if ($bulunan.Count -gt 0) {
      Write-Host "  UYARI: Font dosyalari bulundu; telif nedeniyle pakete alinmadi." -ForegroundColor Yellow
      $bulunan | Remove-Item -Force
    }
  }
}

function YasaklariTara($hedef, $adlar) {
  $bulunan = Get-ChildItem -LiteralPath $hedef -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { $adlar -contains $_.Name }
  foreach ($b in $bulunan) {
    Write-Host ("  PAKETTE OLMAMALI: " + $b.Name) -ForegroundColor Red
    $script:hata = $true
  }
}

function GerekliKontrol($hedef, $gerekli) {
  foreach ($g in $gerekli) {
    if (-not (Test-Path -LiteralPath (Join-Path $hedef $g) -PathType Leaf)) {
      Write-Host "  GEREKLI DOSYA YOK: $g" -ForegroundColor Red
      $script:hata = $true
    }
  }
}

function ZipYaz($hedef, $zipAd, $aciklama, $ozelNot) {
  $zip = Join-Path $dagitim "$zipAd-$Surum.zip"
  if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }
  Adim "Zip yaziliyor: $zip"
  Compress-Archive -LiteralPath $hedef -DestinationPath $zip -CompressionLevel Optimal

  $adet = (Get-ChildItem -LiteralPath $hedef -Recurse -File).Count
  $bayt = (Get-ChildItem -LiteralPath $hedef -Recurse -File | Measure-Object -Property Length -Sum).Sum
  $zipBoyut = [math]::Round((Get-Item -LiteralPath $zip).Length / 1MB, 2)
  $hash = (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash

  $surumNotu = @(
    $aciklama,
    "Surum       : $Surum",
    "Tarih       : $(Get-Date -Format 'yyyy-MM-dd')",
    "Dosya sayisi: $adet",
    "Acik boyut  : $([math]::Round($bayt / 1MB, 2)) MB",
    "Zip boyutu  : $zipBoyut MB",
    "SHA256      : $hash",
    "",
    "Kaynak testleri: 90/90 (test/test.html, yerel sunucu)",
    "Urunler: Hece Parki ana site (Okuyorum + iki oyun); Okuyorum ayri uygulama paketi.",
    "Gizlilik: paket icindeki GIZLILIK.md"
  ) + $ozelNot
  $notYolu = Join-Path $dagitim "$zipAd-$Surum-SURUM.txt"
  Set-Content -LiteralPath $notYolu -Value $surumNotu -Encoding UTF8

  Write-Host ""
  Write-Host "Hazir." -ForegroundColor Green
  Write-Host "  Klasor : $hedef"
  Write-Host "  Zip    : $zip ($zipBoyut MB)"
  Write-Host "  Not    : $notYolu"
  Write-Host "  Dosya  : $adet"
  Write-Host "  SHA256 : $hash"
}

# ---------- Hece Parki ana kurulum paketi (Okuyorum + iki oyun) ----------
function HeceParkiPaketi {
  Adim "=== Hece Parki ana kurulum paketi ==="
  $hedef = Join-Path $dagitim "HeceParki"
  if (Test-Path -LiteralPath $hedef) { Remove-Item -LiteralPath $hedef -Recurse -Force }
  New-Item -ItemType Directory -Path $hedef -Force | Out-Null

  $dosyalar = @(
    "index.html",
    "README.md",
    "OGRETMEN-BASLANGIC.md",
    "GIZLILIK.md",
    "KURULUM.md",
    "Baslat.cmd",
    "Sunucu-Baslat.cmd",
    "sunucu.ps1"
  )
  foreach ($f in $dosyalar) {
    $kaynak = Join-Path $kok $f
    if (-not (Test-Path -LiteralPath $kaynak -PathType Leaf)) { Uyar "Eksik dosya: $f"; continue }
    Copy-Item -LiteralPath $kaynak -Destination (Join-Path $hedef $f) -Force
  }

  $klasorler = @("assets", "oyunlar", "uygulama")
  foreach ($k in $klasorler) {
    $kaynak = Join-Path $kok $k
    if (-not (Test-Path -LiteralPath $kaynak -PathType Container)) { Uyar "Eksik klasor: $k"; continue }
    Copy-Item -LiteralPath $kaynak -Destination $hedef -Recurse -Force
  }

  $cikar = @("uygulama\test-goruntuleri", "uygulama\sunucu.ps1", "uygulama\font", "oyunlar\font")
  foreach ($c in $cikar) {
    $yol = Join-Path $hedef $c
    if (Test-Path -LiteralPath $yol) { Remove-Item -LiteralPath $yol -Recurse -Force }
  }
  FontDosyalariniCikar $hedef

  YasaklariTara $hedef @("test", "arastirma", "okuyorum-analiz", "okuma-bayrami", "AGENTS.md", "TASKS.md", "test-goruntuleri", "ortak.js")
  GerekliKontrol $hedef @(
    "index.html",
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
  if ($script:hata) { Write-Host "Hece Parki paketi uretilmedi; hatalari duzeltin." -ForegroundColor Red; return }

  $not = @("Bu paket ana sitedir: Okuyorum + Hece Rallisi + Ac Canavar. Okuma Bayrami yayin disidir.")
  ZipYaz $hedef "HeceParki" "Hece Parki - kurulum paketi (ana site: Okuyorum + iki oyun)" $not
}

# ---------- Okuyorum (ogretmen etkinlik uygulamasi) ----------
function OkuyorumPaketi {
  Adim "=== Okuyorum kurulum paketi ==="
  $hedef = Join-Path $dagitim "Okuyorum"
  if (Test-Path -LiteralPath $hedef) { Remove-Item -LiteralPath $hedef -Recurse -Force }
  New-Item -ItemType Directory -Path $hedef -Force | Out-Null

  $uy = Join-Path $kok "uygulama"
  if (-not (Test-Path -LiteralPath $uy -PathType Container)) { Uyar "Eksik klasor: uygulama"; return }
  Copy-Item -LiteralPath $uy -Destination $hedef -Recurse -Force
  $cikar = @("uygulama\test-goruntuleri", "uygulama\font")
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
    if (-not (Test-Path -LiteralPath $kaynak -PathType Leaf)) { Uyar "Eksik varlik: assets\$v"; continue }
    Copy-Item -LiteralPath $kaynak -Destination (Join-Path $vKok $v) -Force
  }
  foreach ($alt in @("sesler", "fonts")) {
    $kaynak = Join-Path $assetsKok $alt
    if (-not (Test-Path -LiteralPath $kaynak -PathType Container)) { Uyar "Eksik varlik: assets\$alt"; continue }
    Copy-Item -LiteralPath $kaynak -Destination (Join-Path $vKok $alt) -Recurse -Force
  }
  FontDosyalariniCikar $hedef

  # baslat kisa yolu (ASCII icerik)
  $cmd = Join-Path $hedef "Okuyorum.cmd"
  $cmdSatir = '@echo off' + [Environment]::NewLine +
    'rem Okuyorum - ogretmen etkinlik uygulamasi (Hece Parkindan ayri urun)' + [Environment]::NewLine +
    'start "" "%~dp0uygulama\index.html"'
  Set-Content -LiteralPath $cmd -Value $cmdSatir -Encoding ASCII

  # kullanici bilgisi: UTF-8 kaynak dosyadan byte olarak kopyalanir (kodlama bozulmasin)
  $bilgiKaynak = Join-Path $PSScriptRoot "okuyorum-kurulum-bilgi.md"
  if (-not (Test-Path -LiteralPath $bilgiKaynak -PathType Leaf)) { Uyar "Eksik dosya: araclar/okuyorum-kurulum-bilgi.md" }
  else { Copy-Item -LiteralPath $bilgiKaynak -Destination (Join-Path $hedef "OKUYORUM-README.md") -Force }

  YasaklariTara $hedef @("test", "arastirma", "okuyorum-analiz", "oyunlar", "okuma-bayrami", "AGENTS.md", "TASKS.md", "test-goruntuleri", "ortak.js", "oyun-cekirdek.js")
  GerekliKontrol $hedef @(
    "uygulama\index.html",
    "uygulama\css\stil.css",
    "uygulama\js\uygulama.js",
    "uygulama\js\veri.js",
    "uygulama\js\ses.js",
    "uygulama\js\studyo.js",
    "uygulama\KULLANIM.md",
    "assets\veri.js",
    "assets\fonem.js",
    "assets\font.css",
    "assets\sesler\manifest.js",
    "assets\fonts\README.md",
    "Okuyorum.cmd",
    "OKUYORUM-README.md"
  )
  if ($script:hata) { Write-Host "Okuyorum paketi uretilmedi; hatalari duzeltin." -ForegroundColor Red; return }

  $not = @("Bu paket ogretmen etkinlik uygulamasidir; Hece Parki ana paketi (HeceParki-*.zip) iki oyunu da icerir.")
  ZipYaz $hedef "Okuyorum" "Okuyorum - kurulum paketi (ogretmen etkinlik uygulamasi)" $not
}

if ($Urun -in @("Hepsi","HeceParki")) { HeceParkiPaketi }
if ($Urun -in @("Hepsi","Okuyorum"))  { OkuyorumPaketi }

if ($hata) {
  Write-Host "Bazi paketler hatayla uretilmedi; ustteki kayitlara bakin." -ForegroundColor Red
  exit 1
}
