import { Container3d } from 'pixi-projection';
import { Texture } from 'pixi.js';
import { CardSprite } from './CardSprite';

export function dealHand(
  cards: Container3d,
  cardsTextures: Record<string, Texture>,
  onClick: (event: any) => void
) {
  cards.removeChildren();
  // FAN
  const cardSpacing = 100;
  const fanAngle = -25 * (Math.PI / 180);
  const arcHeight = -20;

  for (let i = 0; i < 3; i++) {
    const card = new CardSprite(cardsTextures);

    const offset = i - 1; // -1, 0, 1
    card.position3d.x = offset * cardSpacing;

    card.position3d.y = Math.abs(offset) * arcHeight;

    card.euler.z = offset * fanAngle;

    card.code = 0;
    card.update(0);
    card.interactive = true;
    card.on('mouseup', onClick);
    card.on('touchend', onClick);
    cards.addChild(card);
  }
}
