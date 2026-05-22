import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    headers: {
      // Эти заголовки разрешают браузеру без проблем компилировать WebAssembly локально
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },
  build: {
    target: 'esnext'
  },
  // Говорим Vite обрабатывать файлы .wasm как внутренние ресурсы
  assetsInclude: ['**/*.wasm']
});