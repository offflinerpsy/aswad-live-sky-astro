param(
	[int]$Port = 3000
)

# Запуск Astro dev сервера с автоподбором свободного порта в диапазоне 3000–3005
Set-Location $PSScriptRoot

function Test-PortFree([int]$p){
	try {
		$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $p)
		$listener.Start(); $listener.Stop(); return $true
	} catch { return $false }
}

$chosen = $null
foreach($p in $Port..3005){ if(Test-PortFree $p){ $chosen = $p; break } }
if(-not $chosen){
	Write-Host "Нет свободного порта в диапазоне $Port..3005. Завершение." -ForegroundColor Red
	exit 1
}

Write-Host "Запуск Astro dev сервера на порту $chosen…" -ForegroundColor Green
Write-Host "URL: http://localhost:$chosen/" -ForegroundColor Yellow

# Пробрасываем выбранный порт в astro dev
npm run dev -- --port $chosen
