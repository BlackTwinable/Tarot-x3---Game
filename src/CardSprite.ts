import { BlurFilter, Graphics, Texture } from 'pixi.js';
import { Container3d, Sprite3d, Text3d } from 'pixi-projection';
import { Group } from '@pixi/layers';
import { TextStyle } from 'pixi.js';
import gsap from 'gsap';
import { getRandomMultiplier, getMultiplierColor, formatMultiplier } from './multipliers';

export const shadowGroup = new Group(1);
export const cardsGroup = new Group(2, (item) => {
  const depth = typeof (item as any).getDepth === 'function' ? (item as any).getDepth() : 0;
  item.zOrder = -depth;

  const parent = item.parent as CardSprite | undefined;
  if (parent && typeof parent.checkFace === 'function') {
    parent.checkFace();
  }
});
export const multipliersGroup = new Group(3);

const blurFilter = new BlurFilter();
blurFilter.blur = 0.2;

export class CardSprite extends Container3d {
  protected shadow: Sprite3d;
  protected inner: Container3d;
  protected back: Sprite3d;
  protected face: Container3d;
  protected multiplierText: Text3d;
  private _code: number;
  public showCode: number;
  public multiplier: number;
  private flipTimeline?: gsap.core.Timeline;
  public isMultiplierSet: boolean = false;

  get code(): number {
    return this._code;
  }

  set code(value: number) {
    if (this._code === value) return;
    this._code = value;

    if (value > 0 && !this.isMultiplierSet) {
      this.multiplier = getRandomMultiplier();
      this.updateMultiplierText();
      this.isMultiplierSet = true;
    }

    this.animateFlip();
  }

  constructor(private cardsTextures: Record<string, Texture>) {
    super();

    const cardTexture = cardsTextures['../public/assets/card_back.png'];
    const shadowGraphic = new Graphics();
    shadowGraphic.beginFill(0x000000, 1);
    shadowGraphic.drawRoundedRect(0, 0, cardTexture.width, cardTexture.height, 20);
    shadowGraphic.endFill();
    shadowGraphic.alpha = 0.6;

    const shadowTexture = (globalThis as any).__PIXI_APP__.renderer.generateTexture(shadowGraphic);
    this.shadow = new Sprite3d(shadowTexture);
    this.shadow.anchor.set(0.5);
    this.shadow.scale3d.set(0.98);
    this.shadow.alpha = 0.7;

    this.shadow.parentGroup = shadowGroup;
    this.inner = new Container3d();
    this.inner.parentGroup = cardsGroup;

    this.addChild(this.shadow);
    this.addChild(this.inner);

    this.back = new Sprite3d(cardsTextures['../public/assets/card_back.png']);
    this.back.anchor.set(0.5);
    this.face = new Container3d();
    this.inner.addChild(this.back);
    this.inner.addChild(this.face);
    this._code = 0;
    this.showCode = -1;
    this.multiplier = 0;
    this.inner.euler.y = Math.PI;
    this.scale3d.set(0.2);

    this.back.renderable = true;
    this.face.renderable = false;

    const textStyle = new TextStyle({
      fontSize: 120,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 8,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 4,
      dropShadowAngle: Math.PI / 4,
      dropShadowBlur: 4,
    });

    this.multiplierText = new Text3d('', textStyle);
    this.multiplierText.anchor.set(0.5);
    this.multiplierText.position3d.x = 0;
    this.multiplierText.position3d.y = 0;
    this.multiplierText.position3d.z = 50;
    this.multiplierText.parentGroup = multipliersGroup;

    this.createFace();
  }

  createFace() {
    const { face } = this;

    if (face.children.length > 0) {
      face.removeChildren();
    }

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

    face.addChild(this.multiplierText);
  }

  updateFace() {
    const { face } = this;

    (face.children[1] as Sprite3d).texture = Texture.EMPTY;
    (face.children[2] as Sprite3d).texture = Texture.EMPTY;
    (face.children[3] as Sprite3d).texture = Texture.EMPTY;
  }

  updateMultiplierText() {
    this.multiplierText.text = formatMultiplier(this.multiplier);
    const color = getMultiplierColor(this.multiplier);
    (this.multiplierText.style as TextStyle).fill = color;

    this.multiplierText.visible = true;
  }

  animateFlip() {
    if (this.flipTimeline) {
      this.flipTimeline.kill();
    }

    const { inner } = this;

    const targetAngle = this._code > 0 ? 0 : Math.PI;

    this.flipTimeline = gsap.timeline();

    this.flipTimeline.to(inner.euler, {
      y: targetAngle,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        inner.position3d.z = -Math.sin(inner.euler.y) * this.back.width;

        this.shadow.euler.y = inner.euler.y;

        this.checkFace();
      },
    });
  }

  update(dt: number) {
    const { inner } = this;
    inner.position3d.z = -Math.sin(inner.euler.y) * this.back.width;
    this.shadow.euler.y = inner.euler.y;
  }

  checkFace() {
    const { inner } = this;
    let cc;

    if (!inner.isFrontFace()) {
      // user sees the back
      cc = 0;
    } else {
      // user sees the face
      cc = this.showCode || this._code;
    }
    if (cc === 0) {
      this.back.renderable = true;
      this.face.renderable = false;
      this.multiplierText.visible = false;
    } else {
      this.back.renderable = false;
      this.face.renderable = true;
      this.multiplierText.visible = true;
    }

    if (cc !== this.showCode) {
      this.showCode = cc;
      this.updateFace();
    }
  }
}
