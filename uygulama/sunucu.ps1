# Okuyorum geliştirme sunucusu (PowerShell HttpListener)
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8123/")
$listener.Start()
$map = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"
  ".js"="text/javascript; charset=utf-8"; ".png"="image/png"; ".jpg"="image/jpeg"
  ".jpeg"="image/jpeg"; ".svg"="image/svg+xml"; ".json"="application/json"; ".mp3"="audio/mpeg"
}
Write-Output "Sunucu: http://localhost:8123/"
while($listener.IsListening){
  $ctx = $listener.GetContext()
  $yol = $ctx.Request.Url.AbsolutePath
  if($yol -eq "/"){ $yol="/index.html" }
  $dosya = Join-Path $root ($yol.TrimStart("/") -replace "/","\")
  try{
    if(Test-Path -LiteralPath $dosya -PathType Leaf){
      $ext=[System.IO.Path]::GetExtension($dosya).ToLower()
      $tip = if($map.ContainsKey($ext)){$map[$ext]} else {"application/octet-stream"}
      $bytes=[System.IO.File]::ReadAllBytes($dosya)
      $ctx.Response.ContentType=$tip
      $ctx.Response.ContentLength64=$bytes.Length
      $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    } else {
      $ctx.Response.StatusCode=404
      $mesaj=[Text.Encoding]::UTF8.GetBytes("Bulunamadi: $yol")
      $ctx.Response.OutputStream.Write($mesaj,0,$mesaj.Length)
    }
  } catch { }
  try{ $ctx.Response.OutputStream.Close() } catch { }
}
