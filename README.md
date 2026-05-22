# Тестовое задание: Интеграция Pixi.js ➔ Skia (CanvasKit WASM)

Приложение на TypeScript, демонстрирующее синхронизацию контейнеров Pixi.js с графическим движком Skia, поддержку интерактивных событий (`pointerdown` / `pointerup`) на обоих холстах и экспорт сцены в чистый векторный PDF.

## Стек технологий
* **TypeScript**
* **Pixi.js v7** (Legacy Canvas режим)
* **Skia / CanvasKit WASM** (через CDN для стабильности WebAssembly контекста)
* **jsPDF** (для гарантированного построения векторных PDF-команд в веб-окружении)
* **Vite** (сборщик проекта)

## Инструкция по запуску локально

1. Установите зависимости:
   ```bash
   npm install

   Запустите локальный сервер разработки:
Bash

npm run dev

Откройте в браузере: http://localhost:3000/

### 2. Сделай финальный экспорт PDF
Запусти приложение, нажми кнопку **«Экспорт в векторный PDF»** и сохрани скачанный файл `skia_vector_scene.pdf`. Он понадобится для отправки, так как в ТЗ просят прикрепить готовый пример файла.

---

## 🚀 Шаг 2: Выливаем код на GitHub и Хостинг

### 1. Загрузка на GitHub
1. Зайди на [github.com](https://github.com/) и создай новый публичный репозиторий (например, `pixi-skia-test`).
2. В терминале VS Code останови сервер (`Ctrl + C`) и отправь код командами:
   ```bash
   git init
   git add .
   git commit -m "feat: complete test task with pixi and skia"
   git branch -M main
   git remote add origin ССЫЛКА_НА_ТВОЙ_РЕПОЗИТОРИЙ
   git push -u origin main