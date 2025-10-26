# Astro Live Sky demo

Минимальный проект для аудита: компонент живого неба, две страницы, простейший предпросмотр.

## Запуск

```powershell
# dev (автоподбор порта 3000–3005)
./start-dev.ps1

# прод-предпросмотр (фикс-порт, через простой сервер)
./start-preview.ps1
```

## Структура
- src/components/HeroLiveSky.astro
- src/pages/index.astro
- src/pages/live-sky.astro
- scripts/simple-preview.mjs
- start-dev.ps1 / start-preview.ps1
- package.json / astro.config.mjs / tsconfig.json

Примечание: крупные изображения из `public/live-sky` не включены в аудит-репозиторий.
