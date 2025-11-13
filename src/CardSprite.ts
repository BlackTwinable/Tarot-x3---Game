import { BlurFilter, Graphics, Texture } from 'pixi.js';
import { Container3d, Sprite3d } from 'pixi-projection';
import { Group } from '@pixi/layers';

export const shadowGroup = new Group(1);
export const cardsGroup = new Group(2, (item) => {
  const depth = typeof (item as any).getDepth === 'function' ? (item as any).getDepth() : 0;
  item.zOrder = -depth;

  const parent = item.parent as CardSprite | undefined;
  if (parent && typeof parent.checkFace === 'function') {
    parent.checkFace();
  }
});

const blurFilter = new BlurFilter();
blurFilter.blur = 0.2;

export class CardSprite extends Container3d {
  protected shadow: Sprite3d;
  protected inner: Container3d;
  protected back: Sprite3d;
  protected face: Container3d;
  public code: number;
  public showCode: number;

  constructor(private cardsTextures: Record<string, Texture>) {
    super();

    const cardTexture = cardsTextures['../public/assets/card_back.png'];
    const shadowGraphic = new Graphics();
    shadowGraphic.beginFill(0x000000, 1);
    shadowGraphic.drawRoundedRect(0, 0, cardTexture.width, cardTexture.height, 20);
    shadowGraphic.endFill();
    shadowGraphic.alpha = 0.6;

    // Convert graphics to texture using renderer
    const shadowTexture = (globalThis as any).__PIXI_APP__.renderer.generateTexture(shadowGraphic);
    // shadow will be under card
    this.shadow = new Sprite3d(shadowTexture);
    this.shadow.anchor.set(0.5);
    this.shadow.scale3d.set(0.98);
    this.shadow.alpha = 0.7;

    this.shadow.parentGroup = shadowGroup;
    this.inner = new Container3d();
    this.inner.parentGroup = cardsGroup;

    this.addChild(this.shadow);
    this.addChild(this.inner);

    // construct "inner" from back and face
    this.back = new Sprite3d(cardsTextures['../public/assets/card_back.png']);
    this.back.anchor.set(0.5);
    this.face = new Container3d();
    this.inner.addChild(this.back);
    this.inner.addChild(this.face);
    this.code = 0;
    this.showCode = -1;
    this.inner.euler.y = Math.PI;
    this.scale3d.set(0.2);

    // construct "face" from four sprites
    this.createFace();
  }

  createFace() {
    const { face } = this;
    face.removeChildren();
    const sprite = new Sprite3d(this.cardsTextures['../public/assets/card_front.png']);
    const sprite2 = new Sprite3d(Texture.EMPTY);
    const sprite3 = new Sprite3d(Texture.EMPTY);
    const sprite4 = new Sprite3d(Texture.EMPTY);
    sprite2.y = -120;
    sprite2.x = -80;
    sprite3.y = 70;
    sprite3.x = 40;
    sprite4.y = -70;
    sprite4.x = -100;

    sprite.anchor.set(0.5);
    sprite2.anchor.set(0.5);
    sprite3.anchor.set(0.5);
    face.addChild(sprite);
    face.addChild(sprite2);
    face.addChild(sprite3);
    face.addChild(sprite4);
  }

  updateFace() {
    const { face } = this;
    (face.children[1] as Sprite3d).texture = Texture.EMPTY;
    (face.children[2] as Sprite3d).texture = Texture.EMPTY;
    (face.children[3] as Sprite3d).texture = Texture.EMPTY;
  }

  update(dt: number) {
    const { inner } = this;
    if (this.code > 0 && inner.euler.y > 0) {
      inner.euler.y = Math.max(0, inner.euler.y - dt * 5);
    }
    if (this.code === 0 && inner.euler.y < Math.PI) {
      inner.euler.y = Math.min(Math.PI, inner.euler.y + dt * 5);
    }
    inner.position3d.z = -Math.sin(inner.euler.y) * this.back.width;

    // assignment is overriden, so its actually calling euler.copyFrom(this.euler)
    this.shadow.euler = inner.euler;
  }

  checkFace() {
    const { inner } = this;
    let cc;

    if (!inner.isFrontFace()) {
      // user sees the back
      cc = 0;
    } else {
      // user sees the face
      cc = this.showCode || this.code;
    }
    if (cc === 0) {
      this.back.renderable = true;
      this.face.renderable = false;
    } else {
      this.back.renderable = false;
      this.face.renderable = true;
    }

    if (cc !== this.showCode) {
      this.showCode = cc;
      this.updateFace();
    }
  }
}
