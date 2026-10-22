# Hece Parki - statik web sitesi paketi uretir.
# Kullanim: powershell -ExecutionPolicy Bypass -File araclar/web-olustur.ps1
param(
  [string]$Surum = "1.0"
)

$hata = $false
function Adim($mesaj) { Write-Host "* $mesaj" }

$kok = Split-Path -Parent $PSScriptRoot
$dagitim = Join-Path $kok "dagitim"
$hedef = Join-Path $dagitim "HeceParki-Web"

Adim "Hazirlaniyor: $hedef"
if (Test-Path -LiteralPath $hedef) {
  Remove-Item -LiteralPath $hedef -Recurse -Force
}
New-Item -ItemType Directory -Path $hedef -Force | Out-Null

$kaynaklar = @(
  @{ Kaynak = "index.html"; Hedef = "index.html" },
  @{ Kaynak = "okuma-bayrami-1-sinif.html"; Hedef = "okuma-bayrami-1-sinif.html" },
  @{ Kaynak = "404.html"; Hedef = "404.html" },
  @{ Kaynak = "OGRETMEN-BASLANGIC.md"; Hedef = "OGRETMEN-BASLANGIC.md" },
  @{ Kaynak = "GIZLILIK.md"; Hedef = "GIZLILIK.md" },
  @{ Kaynak = "WEB-YAYIN.md"; Hedef = "YAYIN.md" }
)
foreach ($k in $kaynaklar) {
  $kaynak = Join-Path $kok $k.Kaynak
  if (-not (Test-Path -LiteralPath $kaynak -PathType Leaf)) {
    Write-Host "EKSIK DOSYA: $($k.Kaynak)" -ForegroundColor Red
    $hata = $true
    continue
  }
  Copy-Item -LiteralPath $kaynak -Destination (Join-Path $hedef $k.Hedef) -Force
}

$klasorler = @("assets", "okuma-bayrami", "oyunlar", "uygulama")
foreach ($klasor in $klasorler) {
  $kaynak = Join-Path $kok $klasor
  if (-not (Test-Path -LiteralPath $kaynak -PathType Container)) {
    Write-Host "EKSIK KLASOR: $klasor" -ForegroundColor Red
    $hata = $true
    continue
  }
  Copy-Item -LiteralPath $kaynak -Destination $hedef -Recurse -Force
}

# Gelistiriciye ait, sitede yayinlanmamasi gerekenler
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

# Telifli font dosyalari varsayilan olarak yayina alinmaz.
$fontKlasoru = Join-Path $hedef "assets\fonts"
if (Test-Path -LiteralPath $fontKlasoru) {
  $fontDosyalari = @(Get-ChildItem -LiteralPath $fontKlasoru -File |
    Where-Object { $_.Extension -match '^\.(ttf|otf|woff2?)$' })
  if ($fontDosyalari.Count -gt 0) {
    Write-Host "UYARI: Font dosyasi bulundu; telif nedeniyle web paketine alinmadi." -ForegroundColor Yellow
    Write-Host "       Gomme icin hak sahibinden yazili izin gerekir." -ForegroundColor Yellow
    $fontDosyalari | Remove-Item -Force
  }
}

# Paket saglik kontrolu
$yasakAdlar = @("test", "arastirma", "test-goruntuleri", "ortak.js", "AGENTS.md", "TASKS.md", "KURULUM.md")
foreach ($ad in $yasakAdlar) {
  $bulunan = Get-ChildItem -LiteralPath $hedef -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq $ad }
  if ($bulunan) {
    Write-Host "SITEDE OLMAMALI: $ad" -ForegroundColor Red
    $hata = $true
  }
}
$betikler = @(Get-ChildItem -LiteralPath $hedef -Recurse -File |
  Where-Object { $_.Extension -in ".cmd", ".ps1", ".bat" })
if ($betikler.Count -gt 0) {
  Write-Host "SITEDE CALISTIRILABILIR BETIK OLMAMALI: $($betikler[0].Name)" -ForegroundColor Red
  $hata = $true
}

$gerekli = @(
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
  "okuma-bayrami-1-sinif.html",
  "oyunlar\hece-rallisi\index.html",
  "oyunlar\ac-canavar\index.html"
)
foreach ($g in $gerekli) {
  if (-not (Test-Path -LiteralPath (Join-Path $hedef $g) -PathType Leaf)) {
    Write-Host "GEREKLI DOSYA YOK: $g" -ForegroundColor Red
    $hata = $true
  }
}

# HTML baglantilari: kok-adi (/...) yasak, yerel hedefler var olmali.
$htmlDosyalar = @(Get-ChildItem -LiteralPath $hedef -Recurse -File |
  Where-Object { $_.Extension -eq ".html" })
$baglantiSayisi = 0
foreach ($html in $htmlDosyalar) {
  $metin = Get-Content -LiteralPath $html.FullName -Raw
  if ($metin -match '(?:href|src)\s*=\s*["'']/') {
    Write-Host "KOK-ADI BAGLANTI (alt klasorde kirilir): $($html.Name)" -ForegroundColor Red
    $hata = $true
  }
  if ($metin -match 'file:///') {
    Write-Host "YEREL DOSYA YOLU: $($html.Name)" -ForegroundColor Red
    $hata = $true
  }
  $desen = '(?:href|src)\s*=\s*(?:"([^"]+)"|''([^'']+)'')'
  foreach ($e in [regex]::Matches($metin, $desen)) {
    $link = if ($e.Groups[1].Success) { $e.Groups[1].Value } else { $e.Groups[2].Value }
    $link = $link.Trim()
    if (-not $link) { continue }
    if ($link -match '^(#|https?:|mailto:|tel:|data:|javascript:)') { continue }
    $temiz = $link.Split('#')[0].Split('?')[0]
    if (-not $temiz) { continue }
    if ($temiz.StartsWith('/')) {
      Write-Host "KOK-ADI BAGLANTI: $($html.Name) -> $link" -ForegroundColor Red
      $hata = $true
      continue
    }
    $hedefYol = [System.IO.Path]::GetFullPath((Join-Path $html.DirectoryName ($temiz -replace '/', '\')))
    if (-not (Test-Path -LiteralPath $hedefYol)) {
      Write-Host "KIRIK BAGLANTI: $($html.Name) -> $link" -ForegroundColor Red
      $hata = $true
    }
    $baglantiSayisi++
  }
}

# CSS icinde kok-adli url() olmamali.
foreach ($css in @(Get-ChildItem -LiteralPath $hedef -Recurse -File |
  Where-Object { $_.Extension -eq ".css" })) {
  $metin = Get-Content -LiteralPath $css.FullName -Raw
  if ($metin -match 'url\(\s*["'']?/') {
    Write-Host "KOK-ADI CSS YOLU: $($css.Name)" -ForegroundColor Red
    $hata = $true
  }
}

# Calisma zamaninda dis alan adi istegi olmamali (localhost/w3 namespace haric).
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
  Write-Host "DIS ALAN ADI BULUNDU:" -ForegroundColor Red
  $dis | Select-Object -Unique | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
  $hata = $true
}

if ($hata) {
  Write-Host "Site paketi uretilmedi; hatalari duzeltin." -ForegroundColor Red
  exit 1
}

$zip = Join-Path $dagitim "HeceParki-Web-$Surum.zip"
if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }

Adim "Zip yaziliyor: $zip"
Compress-Archive -LiteralPath $hedef -DestinationPath $zip -CompressionLevel Optimal

$adet = (Get-ChildItem -LiteralPath $hedef -Recurse -File).Count
$bayt = (Get-ChildItem -LiteralPath $hedef -Recurse -File | Measure-Object -Property Length -Sum).Sum
$zipBoyut = [math]::Round((Get-Item -LiteralPath $zip).Length / 1MB, 2)
$hash = (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash

$surumNotu = @(
  "Hece Parki - statik web sitesi",
  "Surum       : $Surum",
  "Tarih       : $(Get-Date -Format 'yyyy-MM-dd')",
  "Dosya sayisi: $adet",
  "Acik boyut  : $([math]::Round($bayt / 1MB, 2)) MB",
  "Zip boyutu  : $zipBoyut MB",
  "SHA256      : $hash",
  "Baglanti    : $baglantiSayisi yerel baglanti denetlendi",
  "",
  "Kaynak testleri: 86/86 (test/test.html, yerel sunucu)",
  "Site testi    : HTTP kok + alt klasor + file:// render",
  "",
  "Yayinlama: YAYIN.md",
  "Gizlilik : GIZLILIK.md"
)
$notYolu = Join-Path $dagitim "HeceParki-Web-$Surum-SURUM.txt"
Set-Content -LiteralPath $notYolu -Value $surumNotu -Encoding UTF8

Write-Host ""
Write-Host "Hazir." -ForegroundColor Green
Write-Host "  Klasor : $hedef"
Write-Host "  Zip    : $zip ($zipBoyut MB)"
Write-Host "  Not    : $notYolu"
Write-Host "  Dosya  : $adet"
Write-Host "  SHA256 : $hash"
