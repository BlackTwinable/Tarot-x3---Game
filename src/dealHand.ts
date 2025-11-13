import { Container3d } from 'pixi-projection';
import { Texture } from 'pixi.js';
import { CardSprite } from './CardSprite';
import gsap from 'gsap';

export async function dealHandAnimated(
  cards: Container3d,
  cardsTextures: Record<string, Texture>,
  onClick: (event: any) => void,
  delayBetweenCards: number
): Promise<void> {
  cards.removeChildren();
  // FAN
  const cardSpacing = 100;
  const fanAngle = -25 * (Math.PI / 180);
  const arcHeight = -20;

  const masterTimeline = gsap.timeline();

  for (let i = 0; i < 3; i++) {
    const card = new CardSprite(cardsTextures);

    const offset = i - 1; // -1, 0, 1
    card.position3d.x = offset * cardSpacing;
    card.position3d.y = Math.abs(offset) * arcHeight;
    card.euler.z = offset * fanAngle;
    card.position3d.z = -500;
    card.alpha = 0;

    card.code = 0;
    card.update(0);
    card.interactive = true;
    card.on('mouseup', onClick);
    card.on('touchend', onClick);
    cards.addChild(card);

    masterTimeline.to(
      card.position3d,
      {
        z: 0,
        duration: 0.5,
        ease: 'back.out(1.5)',
      },
      i * delayBetweenCards
    );

    masterTimeline.to(
      card,
      {
        alpha: 1,
        duration: 0.4,
        ease: 'power2.out',
      },
      i * delayBetweenCards
    );
  }

  // Wait for timeline to complete
  await new Promise<void>((resolve) => {
    masterTimeline.eventCallback('onComplete', () => resolve());
  });
}
