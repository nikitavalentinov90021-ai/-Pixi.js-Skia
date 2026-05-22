import * as PIXI from 'pixi.js';
import { SkiaRenderer } from './core/skiaRenderer';
import { SkiaInteractionManager } from './core/interaction';
import { exportToPDF } from './core/pdfExporter';

const WIDTH = 800;
const HEIGHT = 600;

async function initApp() {
  // 1. Иниц Pixi.js
  const pixiApp = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 0x111116
  });
  await pixiApp.init?.({ width: WIDTH, height: HEIGHT });
  document.getElementById('pixi-app')?.appendChild(pixiApp.view as HTMLCanvasElement);

  // @ts-ignore
  const CanvasKit = await CanvasKitInit({
    locateFile: (file) => `https://unpkg.com/canvaskit-wasm@0.39.1/bin/${file}`
  });

  const skCanvasEl = document.getElementById('skia-canvas') as HTMLCanvasElement;
  const skSurface = CanvasKit.MakeWebGLCanvasSurface(skCanvasEl);
  if (!skSurface) return;
  const skCanvas = skSurface.getCanvas();

  // Модули рендера и кликов
  const skiaRenderer = new SkiaRenderer(CanvasKit);
  const interactionManager = new SkiaInteractionManager(pixiApp.stage);

  const logEl = document.getElementById('logger')!;
  const log = (msg: string) => { logEl.innerText = `Лог событий: ${msg}`; };

  // 3. Создаем базовую сцену по ТЗ
  const mainContainer = new PIXI.Container();
  const subContainer = new PIXI.Container();
  const g1 = new PIXI.Graphics();
  const g2 = new PIXI.Graphics();
  const g3 = new PIXI.Graphics();
  const g4 = new PIXI.Graphics();

  g1.beginFill('#ff0000').drawEllipse(0, 0, 200, 100).endFill();
  g1.position.set(200, 100);
  g1.angle = 30;
  g1.interactive = true;
  g1.on('pointerdown', () => log('g1 (Красный эллипс) pointerdown!'));

  g2.beginFill('#0000ff').drawRect(-50, -75, 100, 150).endFill();
  g2.position.set(120, 60);
  g2.angle = 15;
  g2.scale.set(1.5, 1.7);
  g2.interactive = true;
  g2.on('pointerdown', () => log('g2 (Синий прямоугольник) pointerdown!'));

  g3.lineStyle(10, '#ffffff', 1).moveTo(0, 0).lineTo(150, 100);
  g3.angle = -20;
  g4.lineStyle(10, '#ffff00', 1).moveTo(0, 70).lineTo(150, -30);
  g4.angle = 20;

  subContainer.position.set(75, 50);
  subContainer.addChild(g3, g4);
  mainContainer.addChild(subContainer, g1, g2);
  pixiApp.stage.addChild(mainContainer);

  // 4. Главный бесконечный цикл синхронизации
  pixiApp.ticker.add(() => {
    pixiApp.render();
    skCanvas.clear(CanvasKit.Color(17, 17, 22, 1.0));
    skiaRenderer.renderContainer(pixiApp.stage, skCanvas);
    skSurface.flush();
  });

  // 5. Обработка кликов на холсте Skia
  skCanvasEl.addEventListener('mousedown', (e) => {
    const rect = skCanvasEl.getBoundingClientRect();
    interactionManager.handleMouseEvent('pointerdown', e.clientX - rect.left, e.clientY - rect.top);
  });

  // 6. Логика интерактивных кнопок
  document.getElementById('btn-random')?.addEventListener('click', () => {
    const randGraphics = new PIXI.Graphics();
    const colors = [0xff00ff, 0x00ffff, 0x00ff00, 0xffa500];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    randGraphics.beginFill(randomColor).drawRect(-30, -30, 60, 60).endFill();
    randGraphics.position.set(Math.random() * (WIDTH - 150) + 75, Math.random() * (HEIGHT - 150) + 75);
    randGraphics.angle = Math.random() * 360;
    randGraphics.interactive = true;
    randGraphics.on('pointerdown', () => log('Случайный квадрат pointerdown!'));
    mainContainer.addChild(randGraphics);
    log('Добавлен новый квадрат!');
  });

  let activeScene = 1;
  document.getElementById('btn-scene')?.addEventListener('click', () => {
    mainContainer.visible = !mainContainer.visible;
    activeScene = mainContainer.visible ? 1 : 2;
    log(mainContainer.visible ? 'Возврат к Сцене 1.' : 'Переключено на пустую Сцену 2.');
  });

  document.getElementById('btn-pdf')?.addEventListener('click', () => {
    exportToPDF(CanvasKit, pixiApp.stage, WIDTH, HEIGHT);
    log('Векторный PDF успешно скачан!');
  });
}

initApp();