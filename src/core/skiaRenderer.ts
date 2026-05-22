import * as PIXI from 'pixi.js';
import type { CanvasKit, Canvas, Paint } from 'canvaskit-wasm';

export class SkiaRenderer {
  private ck: CanvasKit;

  constructor(ck: CanvasKit) {
    this.ck = ck;
  }

  public renderContainer(container: PIXI.Container, skCanvas: Canvas) {
    this.renderObject(container, skCanvas);
  }

  private renderObject(obj: PIXI.DisplayObject, skCanvas: Canvas) {
    if (!obj.visible || obj.alpha === 0) return;

    skCanvas.save();

    const m = obj.transform.localTransform;
    const skMatrix = [
      m.a,  m.c,  m.tx,
      m.b,  m.d,  m.ty,
      0,    0,    1
    ];
    
    skCanvas.concat(skMatrix);

    if (obj instanceof PIXI.Graphics) {
      this.drawGraphics(obj, skCanvas);
    }

    if (obj instanceof PIXI.Container && obj.children.length > 0) {
      for (const child of obj.children) {
        this.renderObject(child, skCanvas);
      }
    }

    skCanvas.restore();
  }

  private drawGraphics(graphics: PIXI.Graphics, skCanvas: Canvas) {
    const graphicsData = graphics.geometry.graphicsData;

    for (const data of graphicsData) {
      if (data.fillStyle && data.fillStyle.visible) {
        const paint = new this.ck.Paint();
        paint.setAntiAlias(true);
        paint.setStyle(this.ck.PaintStyle.Fill);
        paint.setColor(this.convertColor(data.fillStyle.color, data.fillStyle.alpha));
        
        this.drawShape(data.shape, paint, skCanvas);
        paint.delete();
      }

      if (data.lineStyle && data.lineStyle.visible && data.lineStyle.width > 0) {
        const strokePaint = new this.ck.Paint();
        strokePaint.setAntiAlias(true);
        strokePaint.setStyle(this.ck.PaintStyle.Stroke);
        strokePaint.setStrokeWidth(data.lineStyle.width);
        strokePaint.setColor(this.convertColor(data.lineStyle.color, data.lineStyle.alpha));
        
        this.drawShape(data.shape, strokePaint, skCanvas);
        strokePaint.delete();
      }
    }
  }

  private drawShape(shape: any, paint: Paint, skCanvas: Canvas) {
    if (shape instanceof PIXI.Rectangle) {
      const rect = this.ck.XYWHRect(shape.x, shape.y, shape.width, shape.height);
      skCanvas.drawRect(rect, paint);
    } 
    else if (shape instanceof PIXI.Ellipse) {
      const rect = this.ck.XYWHRect(
        shape.x - shape.width, 
        shape.y - shape.height, 
        shape.width * 2, 
        shape.height * 2
      );
      skCanvas.drawOval(rect, paint);
    } 
    else if (shape instanceof PIXI.Polygon) {
      const points = shape.points;
      if (points.length < 4) return;

      const path = new this.ck.Path();
      path.moveTo(points[0], points[1]);
      for (let i = 2; i < points.length; i += 2) {
        path.lineTo(points[i], points[i+1]);
      }
      
      skCanvas.drawPath(path, paint);
      path.delete();
    }
  }

  private convertColor(hexColor: number, alpha: number): Float32Array {
    const r = ((hexColor >> 16) & 0xFF) / 255;
    const g = ((hexColor >> 8) & 0xFF) / 255;
    const b = (hexColor & 0xFF) / 255;
    return new Float32Array([r, g, b, alpha]);
  }
}