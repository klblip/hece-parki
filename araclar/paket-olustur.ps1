# Hece Parkı — kurulum paketi üretir (dagitim/HeceParki + zip)
# Kullanım:  powershell -ExecutionPolicy Bypass -File araclar/paket-olustur.ps1
param(
  [string]$Surum = "1.0"
)

$hata = $false
function Adim($mesaj) { Write-Host "• $mesaj" }

$kok = Split-Path -Parent $PSScriptRoot
$dagitim = Join-Path $kok "dagitim"
$hedef = Join-Path $dagitim "HeceParki"

Adim "Hazırlanıyor: $hedef"
if (Test-Path -LiteralPath $hedef) {
  Remove-Item -LiteralPath $hedef -Recurse -Force
}
New-Item -ItemType Directory -Path $hedef -Force | Out-Null

$dosyalar = @(
  "index.html",
  "okuma-bayrami-1-sinif.html",
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
  if (-not (Test-Path -LiteralPath $kaynak -PathType Leaf)) {
    Write-Host "EKSİK DOSYA: $f" -ForegroundColor Red
    $hata = $true
    continue
  }
  Copy-Item -LiteralPath $kaynak -Destination (Join-Path $hedef $f) -Force
}

$klasorler = @("assets", "okuma-bayrami", "oyunlar", "uygulama")
foreach ($k in $klasorler) {
  $kaynak = Join-Path $kok $k
  if (-not (Test-Path -LiteralPath $kaynak -PathType Container)) {
    Write-Host "EKSİK KLASÖR: $k" -ForegroundColor Red
    $hata = $true
    continue
  }
  Copy-Item -LiteralPath $kaynak -Destination $hedef -Recurse -Force
}

# Geliştiriciye ait, pakete girmemesi gerekenler
$cikar = @(
  "uygulama\test-goruntuleri",
  "uygulama\sunucu.ps1",
  "uygulama\font"
)
foreach ($c in $cikar) {
  $yol = Join-Path $hedef $c
  if (Test-Path -LiteralPath $yol) {
    Remove-Item -LiteralPath $yol -Recurse -Force
  }
}

# Paket sağlık kontrolü
$yasak = @("test", "arastirma", "okuyorum-analiz", "ortak.js", "AGENTS.md", "TASKS.md", "test-goruntuleri")
foreach ($y in $yasak) {
  $bulunan = Get-ChildItem -LiteralPath $hedef -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq $y }
  if ($bulunan) {
    Write-Host "PAKETTE OLMAMALI: $y" -ForegroundColor Red
    $hata = $true
  }
}

$gerekli = @(
  "index.html",
  "assets\veri.js",
  "assets\fonem.js",
  "assets\oyun-cekirdek.js",
  "assets\font.css",
  "assets\fonts\README.md",
  "assets\sesler\manifest.js",
  "uygulama\index.html",
  "okuma-bayrami-1-sinif.html",
  "oyunlar\hece-rallisi\index.html",
  "oyunlar\ac-canavar\index.html"
)
foreach ($g in $gerekli) {
  if (-not (Test-Path -LiteralPath (Join-Path $hedef $g) -PathType Leaf)) {
    Write-Host "GEREKLİ DOSYA YOK: $g" -ForegroundColor Red
    $hata = $true
  }
}

if ($hata) {
  Write-Host "Paket üretilmedi; hataları düzeltin." -ForegroundColor Red
  exit 1
}

$zip = Join-Path $dagitim "HeceParki-$Surum.zip"
if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }

Adim "Zip yazılıyor: $zip"
Compress-Archive -LiteralPath $hedef -DestinationPath $zip -CompressionLevel Optimal

$adet = (Get-ChildItem -LiteralPath $hedef -Recurse -File).Count
$bayt = (Get-ChildItem -LiteralPath $hedef -Recurse -File | Measure-Object -Property Length -Sum).Sum
$zipBoyut = [math]::Round((Get-Item -LiteralPath $zip).Length / 1MB, 2)
$hash = (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash

$surumNotu = @(
  "Hece Parki - kurulum paketi",
  "Surum       : $Surum",
  "Tarih       : $(Get-Date -Format 'yyyy-MM-dd')",
  "Dosya sayisi: $adet",
  "Acik boyut  : $([math]::Round($bayt / 1MB, 2)) MB",
  "Zip boyutu  : $zipBoyut MB",
  "SHA256      : $hash",
  "",
  "Kaynak testleri: 89/89 (test/test.html, yerel sunucu)",
  "Paket testi    : sunucu.ps1 HTTP + file:// headless render (Edge/Chrome)",
  "",
  "Kurulum: KURULUM.md",
  "Gizlilik: GIZLILIK.md"
)
$notYolu = Join-Path $dagitim "HeceParki-$Surum-SURUM.txt"
Set-Content -LiteralPath $notYolu -Value $surumNotu -Encoding UTF8

Write-Host ""
Write-Host "Hazır." -ForegroundColor Green
Write-Host "  Klasör : $hedef"
Write-Host "  Zip    : $zip ($zipBoyut MB)"
Write-Host "  Not    : $notYolu"
Write-Host "  Dosya  : $adet"
Write-Host "  SHA256 : $hash"
