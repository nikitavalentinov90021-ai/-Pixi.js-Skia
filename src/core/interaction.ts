import * as PIXI from 'pixi.js';

export class SkiaInteractionManager {
  private rootContainer: PIXI.Container;

  constructor(rootContainer: PIXI.Container) {
    this.rootContainer = rootContainer;
  }

  public handleMouseEvent(type: 'pointerdown' | 'pointerup', globalX: number, globalY: number) {
    const hitObject = this.findHitObject(this.rootContainer, new PIXI.Point(globalX, globalY));
    if (hitObject) {
      hitObject.emit(type, { target: hitObject });
    }
  }

  private findHitObject(obj: PIXI.DisplayObject, globalPoint: PIXI.Point): PIXI.DisplayObject | null {
    if (!obj.visible) return null;

    if (obj instanceof PIXI.Container) {
      for (let i = obj.children.length - 1; i >= 0; i--) {
        const hit = this.findHitObject(obj.children[i], globalPoint);
        if (hit) return hit;
      }
    }

    if (obj.interactive || (obj as any).eventMode === 'static' || obj.listenerCount('pointerdown') > 0 || obj.listenerCount('pointerup') > 0) {
      const localPoint = obj.worldTransform.applyInverse(globalPoint);
      if (obj instanceof PIXI.Graphics && obj.containsPoint(localPoint)) {
        return obj;
      }
    }

    return null;
  }
}