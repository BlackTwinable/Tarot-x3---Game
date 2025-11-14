import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';

export class WinMessagePopup extends Container {
  private background: Graphics;
  private shadow: Graphics;
  private payoutText: Text;
  private resetButton: Container;
  private onResetCallback: () => void;
  private glowTimeline?: gsap.core.Timeline;
  private bounceTimeline?: gsap.core.Timeline;
  private colorProxy = { r: 255, g: 215, b: 0 };

  constructor(onReset: () => void) {
    super();
    this.onResetCallback = onReset;
    this.visible = false;

    this.shadow = new Graphics();
    this.shadow.beginFill(0x000000, 0.3);
    this.shadow.drawRoundedRect(-210, -110, 420, 220, 20);
    this.shadow.endFill();
    this.shadow.x = 8;
    this.shadow.y = 8;
    this.addChild(this.shadow);

    this.background = new Graphics();

    this.background.beginFill(0x3a3a3a);
    this.background.drawRoundedRect(-200, -100, 400, 200, 20);
    this.background.endFill();

    this.background.beginFill(0x5a5a5a, 0.5);
    this.background.drawRoundedRect(-200, -100, 400, 80, 20);
    this.background.endFill();

    this.background.lineStyle(3, 0x7a7a7a, 1);
    this.background.drawRoundedRect(-200, -100, 400, 200, 20);

    this.addChild(this.background);

    const payoutStyle = new TextStyle({
      fontSize: 36,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: '#FFD700',
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 4,
      dropShadowAngle: Math.PI / 4,
      dropShadowBlur: 8,
      align: 'center',
    });

    this.payoutText = new Text('', payoutStyle);
    this.payoutText.anchor.set(0.5);
    this.payoutText.y = -30;
    this.addChild(this.payoutText);

    this.resetButton = this.createResetButton();
    this.resetButton.y = 50;
    this.addChild(this.resetButton);
  }

  private createResetButton(): Container {
    const button = new Container();
    button.eventMode = 'static';
    button.cursor = 'pointer';

    const buttonShadow = new Graphics();
    buttonShadow.beginFill(0x000000, 0.3);
    buttonShadow.drawRoundedRect(-72, -22, 144, 44, 10);
    buttonShadow.endFill();
    buttonShadow.x = 3;
    buttonShadow.y = 3;
    button.addChild(buttonShadow);

    const bg = new Graphics();
    bg.beginFill(0x667eea);
    bg.drawRoundedRect(-70, -20, 140, 40, 10);
    bg.endFill();

    bg.beginFill(0x7a8ef5, 0.4);
    bg.drawRoundedRect(-70, -20, 140, 15, 10);
    bg.endFill();

    bg.lineStyle(2, 0x8a9eff, 1);
    bg.drawRoundedRect(-70, -20, 140, 40, 10);
    button.addChild(bg);

    const style = new TextStyle({
      fontSize: 20,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: '#ffffff',
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 2,
      dropShadowBlur: 2,
    });
    const text = new Text('Reset', style);
    text.anchor.set(0.5);
    button.addChild(text);

    button.on('pointerover', () => {
      bg.clear();
      bg.beginFill(0x7a8ef5);
      bg.drawRoundedRect(-70, -20, 140, 40, 10);
      bg.endFill();
      bg.beginFill(0x8a9eff, 0.4);
      bg.drawRoundedRect(-70, -20, 140, 15, 10);
      bg.endFill();
      bg.lineStyle(2, 0x9aafff, 1);
      bg.drawRoundedRect(-70, -20, 140, 40, 10);
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.beginFill(0x667eea);
      bg.drawRoundedRect(-70, -20, 140, 40, 10);
      bg.endFill();
      bg.beginFill(0x7a8ef5, 0.4);
      bg.drawRoundedRect(-70, -20, 140, 15, 10);
      bg.endFill();
      bg.lineStyle(2, 0x8a9eff, 1);
      bg.drawRoundedRect(-70, -20, 140, 40, 10);
    });

    button.on('pointerdown', () => {
      this.onResetCallback();
    });

    return button;
  }

  private startAnimations(): void {
    if (this.glowTimeline) {
      this.glowTimeline.kill();
    }
    if (this.bounceTimeline) {
      this.bounceTimeline.kill();
    }

    this.bounceTimeline = gsap.timeline({ repeat: -1 });
    this.bounceTimeline.to(this.payoutText.scale, {
      x: 1.15,
      y: 1.15,
      duration: 0.5,
      ease: 'power1.inOut',
    });
    this.bounceTimeline.to(this.payoutText.scale, {
      x: 1.0,
      y: 1.0,
      duration: 0.5,
      ease: 'power1.inOut',
    });

    this.glowTimeline = gsap.timeline({ repeat: -1 });

    this.glowTimeline.to(this.colorProxy, {
      r: 255,
      g: 69,
      b: 0,
      duration: 0.8,
      onUpdate: () => this.updateTextColor(),
    });

    this.glowTimeline.to(this.colorProxy, {
      r: 255,
      g: 0,
      b: 255,
      duration: 0.8,
      onUpdate: () => this.updateTextColor(),
    });

    this.glowTimeline.to(this.colorProxy, {
      r: 0,
      g: 100,
      b: 255,
      duration: 0.8,
      onUpdate: () => this.updateTextColor(),
    });

    this.glowTimeline.to(this.colorProxy, {
      r: 0,
      g: 255,
      b: 255,
      duration: 0.8,
      onUpdate: () => this.updateTextColor(),
    });

    this.glowTimeline.to(this.colorProxy, {
      r: 50,
      g: 255,
      b: 50,
      duration: 0.8,
      onUpdate: () => this.updateTextColor(),
    });

    this.glowTimeline.to(this.colorProxy, {
      r: 255,
      g: 255,
      b: 0,
      duration: 0.8,
      onUpdate: () => this.updateTextColor(),
    });

    this.glowTimeline.to(this.colorProxy, {
      r: 255,
      g: 215,
      b: 0,
      duration: 0.8,
      onUpdate: () => this.updateTextColor(),
    });
  }

  private updateTextColor(): void {
    const { r, g, b } = this.colorProxy;
    const color = (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
    const hexColor = `#${color.toString(16).padStart(6, '0')}`;
    this.payoutText.style.fill = hexColor;

    this.payoutText.style.dropShadowColor = hexColor;
    this.payoutText.style.dropShadowBlur = 12;
  }

  private stopAnimations(): void {
    if (this.glowTimeline) {
      this.glowTimeline.kill();
      this.glowTimeline = undefined;
    }
    if (this.bounceTimeline) {
      this.bounceTimeline.kill();
      this.bounceTimeline = undefined;
    }

    this.payoutText.scale.set(1);
    this.colorProxy = { r: 255, g: 215, b: 0 };
    this.updateTextColor();
  }

  public show(bet: number, totalMultiplier: number): void {
    const payout = bet * totalMultiplier;
    this.payoutText.text = `TOTAL WIN: \n $${payout.toFixed(2)}`;
    this.visible = true;

    this.startAnimations();
  }

  public hide(): void {
    this.visible = false;
    this.stopAnimations();
  }
}
