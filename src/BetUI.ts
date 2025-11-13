import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export const BET_AMOUNTS = [0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 20.0];

export class BetUI extends Container {
  private betIndex: number = 3;
  private betDisplay: Text;
  private betDisplayTop: Text;
  private decreaseButton: Container;
  private increaseButton: Container;
  private decreaseButtonBg: Graphics;
  private increaseButtonBg: Graphics;
  private betFieldBg: Graphics;
  private isActive: boolean = true;

  constructor() {
    super();

    this.betFieldBg = new Graphics();
    this.betFieldBg.beginFill(0x2a2a2a);
    this.betFieldBg.drawRoundedRect(-80, -30, 160, 60, 10);
    this.betFieldBg.endFill();
    this.addChild(this.betFieldBg);

    const betStyle = new TextStyle({
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: '#ffffff',
    });
    this.betDisplay = new Text(this.formatBet(BET_AMOUNTS[this.betIndex]), betStyle);
    this.betDisplay.anchor.set(0.5);
    this.addChild(this.betDisplay);

    this.decreaseButton = this.createButton('-', -150);
    this.decreaseButton.on('pointerdown', () => this.decreaseBet());
    this.addChild(this.decreaseButton);
    this.decreaseButtonBg = this.decreaseButton.children[0] as Graphics;

    this.increaseButton = this.createButton('+', 150);
    this.increaseButton.on('pointerdown', () => this.increaseBet());
    this.addChild(this.increaseButton);
    this.increaseButtonBg = this.increaseButton.children[0] as Graphics;

    const topBetStyle = new TextStyle({
      fontSize: 40,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: '#ffffff',
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowDistance: 2,
      dropShadowBlur: 4,
    });
    this.betDisplayTop = new Text('', topBetStyle);
    this.betDisplayTop.anchor.set(0.5);
    this.betDisplayTop.visible = false;
    this.addChild(this.betDisplayTop);
  }

  private createButton(label: string, xPos: number): Container {
    const button = new Container();
    button.x = xPos;
    button.eventMode = 'static';
    button.cursor = 'pointer';

    const bg = new Graphics();
    bg.beginFill(0x667eea);
    bg.drawRoundedRect(-30, -30, 60, 60, 10);
    bg.endFill();
    button.addChild(bg);

    const style = new TextStyle({
      fontSize: 40,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: '#ffffff',
    });
    const text = new Text(label, style);
    text.anchor.set(0.5);
    button.addChild(text);

    button.on('pointerover', () => {
      if (this.isActive) {
        bg.clear();
        bg.beginFill(0x7a8ef5);
        bg.drawRoundedRect(-30, -30, 60, 60, 10);
        bg.endFill();
      }
    });

    button.on('pointerout', () => {
      if (this.isActive) {
        bg.clear();
        bg.beginFill(0x667eea);
        bg.drawRoundedRect(-30, -30, 60, 60, 10);
        bg.endFill();
      }
    });

    return button;
  }

  private formatBet(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  private decreaseBet(): void {
    if (!this.isActive) {
      return;
    }
    if (this.betIndex > 0) {
      this.betIndex--;
      this.updateDisplay();
    }
  }

  private increaseBet(): void {
    if (!this.isActive) {
      return;
    }
    if (this.betIndex < BET_AMOUNTS.length - 1) {
      this.betIndex++;
      this.updateDisplay();
    }
  }

  private updateDisplay(): void {
    this.betDisplay.text = this.formatBet(BET_AMOUNTS[this.betIndex]);
  }

  public getCurrentBet(): number {
    return BET_AMOUNTS[this.betIndex];
  }

  public deactivate(): void {
    this.isActive = false;

    this.betDisplay.alpha = 0.5;
    this.betFieldBg.alpha = 0.5;

    this.decreaseButton.eventMode = 'none';
    this.increaseButton.eventMode = 'none';
    this.decreaseButton.alpha = 0.5;
    this.increaseButton.alpha = 0.5;

    this.betDisplay.visible = false;
    this.betFieldBg.visible = false;
    this.decreaseButton.visible = false;
    this.increaseButton.visible = false;

    this.betDisplayTop.text = `Bet: ${this.formatBet(BET_AMOUNTS[this.betIndex])}`;
    this.betDisplayTop.visible = true;
  }

  public positionBetOnTop(x: number, y: number): void {
    this.betDisplayTop.x = x;
    this.betDisplayTop.y = y;
  }
}
