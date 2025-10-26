Param(
  [int]$Port = 4020
)

Set-Location $PSScriptRoot
Write-Host "Сборка проекта…" -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Сборка завершилась с ошибкой" -ForegroundColor Red
  exit 1
}

Write-Host "Запуск предпросмотра на http://127.0.0.1:$Port/ …" -ForegroundColor Green
$env:PORT = "$Port"
node .\scripts\simple-preview.mjs
