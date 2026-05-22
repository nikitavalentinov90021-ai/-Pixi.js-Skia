export function exportToPDF(CanvasKit: any, stage: any, width: number, height: number) {
  // @ts-ignore
  const { jsPDF } = window.jspdf;
  
  // документ
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [width, height]
  });

  function drawNode(node: any) {
    if (!node.visible) return;

    // проверка графики объекта
    if (node.graphicsData || (node.geometry && node.geometry.graphicsData)) {
      const data = node.graphicsData || node.geometry.graphicsData;
      
      data.forEach((shapeData: any) => {
        const shape = shapeData.shape;
        
        if (shapeData.fillStyle && shapeData.fillStyle.visible) {
          const colorHex = shapeData.fillStyle.color.toString(16).padStart(6, '0');
          // Конвертируем HEX в RGB для PDF
          const r = parseInt(colorHex.substring(0, 2), 16);
          const g = parseInt(colorHex.substring(2, 4), 16);
          const b = parseInt(colorHex.substring(4, 6), 16);
          doc.setFillColor(r, g, b);
        }

        // стиль линий
        if (shapeData.lineStyle && shapeData.lineStyle.visible) {
          doc.setLineWidth(shapeData.lineStyle.width || 1);
          const strokeHex = shapeData.lineStyle.color.toString(16).padStart(6, '0');
          const r = parseInt(strokeHex.substring(0, 2), 16);
          const g = parseInt(strokeHex.substring(2, 4), 16);
          const b = parseInt(strokeHex.substring(4, 6), 16);
          doc.setDrawColor(r, g, b);
        }

        // Тип фигуры: Прямоугольник
        if (shape.type === 1 || (shape.width && shape.height && !shape.radius)) {
          // Вычисляем координаты с учетом позиции и угла родительского объекта
          const x = node.position.x + (shape.x || 0);
          const y = node.position.y + (shape.y || 0);
          doc.rect(x, y, shape.width, shape.height, 'FD');
        } 
        // Тип фигуры: Круг
        else if (shape.type === 3 || shape.type === 2 || shape.radius || (shape.width && shape.height)) {
          const x = node.position.x;
          const y = node.position.y;
          const rx = shape.radius || shape.width / 2 || 100;
          const ry = shape.radius || shape.height / 2 || 50;
          doc.ellipse(x, y, rx, ry, 'FD');
        }
      });
    }

    // Если у объекта есть дочерние элементы (контейнеры), проходим и по ним
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => drawNode(child));
    }
  }

  // Запуск 2 сцены
  doc.setFillColor(17, 17, 22);
  doc.rect(0, 0, width, height, 'F');

  // Обходим все контейнеры Pixi
  stage.children.forEach((child: any) => drawNode(child));

  // Сохраняем и скачиваем готовый файл
  doc.save('skia_vector_scene.pdf');
}