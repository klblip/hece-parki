# Hece Parkı — yerel sunucu (yalnız bu bilgisayar)
# Kullanım:  powershell -ExecutionPolicy Bypass -File sunucu.ps1
#            powershell -ExecutionPolicy Bypass -File sunucu.ps1 -TarayiciAc
# Yalnız http://localhost bağlanır; ağdaki başka cihazlar erişemez.
param(
  [int]$Port = 8123,
  [switch]$TarayiciAc
)

$kok = [System.IO.Path]::GetFullPath($PSScriptRoot)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
  $listener.Start()
} catch {
  Write-Host ""
  Write-Host "Sunucu baslatilamadi. $Port portu kullanimda olabilir." -ForegroundColor Yellow
  Write-Host "Acik olan Hece Parki penceresini kapatip yeniden deneyin." -ForegroundColor Yellow
  Write-Host ""
  Read-Host "Kapatmak icin Enter"
  exit 1
}

$map = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".ico"  = "image/x-icon"
  ".mp3"  = "audio/mpeg"
  ".wav"  = "audio/wav"
  ".ogg"  = "audio/ogg"
  ".m4a"  = "audio/mp4"
  ".webmanifest" = "application/manifest+json"
}

$adres = "http://localhost:$Port/"
Write-Host ""
Write-Host "  Hece Parki sunucusu calisiyor: $adres" -ForegroundColor Green
Write-Host "  Kapatmak icin bu pencereyi kapatin (veya Ctrl+C)." -ForegroundColor Gray
Write-Host ""

if ($TarayiciAc) {
  Start-Process $adres
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $yol = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
  if ($yol -eq "/") { $yol = "/index.html" }

  try {
    $hedef = [System.IO.Path]::GetFullPath((Join-Path $kok ($yol.TrimStart("/") -replace "/", "\")))
    if (-not $hedef.StartsWith($kok, [System.StringComparison]::OrdinalIgnoreCase)) {
      $ctx.Response.StatusCode = 403
      $ctx.Response.OutputStream.Close()
      continue
    }

    if (Test-Path -LiteralPath $hedef -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($hedef).ToLower()
      $tip = if ($map.ContainsKey($ext)) { $map[$ext] } else { "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($hedef)
      $ctx.Response.ContentType = $tip
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.Headers.Add("Cache-Control", "no-store")
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $mesaj = [System.Text.Encoding]::UTF8.GetBytes("Bulunamadi: $yol")
      $ctx.Response.ContentType = "text/plain; charset=utf-8"
      $ctx.Response.OutputStream.Write($mesaj, 0, $mesaj.Length)
    }
  } catch { }
  try { $ctx.Response.OutputStream.Close() } catch { }
}
