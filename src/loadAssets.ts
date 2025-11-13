import { Assets, Texture } from 'pixi.js';

export async function loadCardAssets(): Promise<Record<string, Texture>> {
  const cardsTextures = await Assets.load([
    '../public/assets/card_front.png',
    '../public/assets/card_back.png',
  ]);
  return cardsTextures;
}

export async function loadTableAsset(): Promise<Texture> {
  const tableTexture = await Assets.load('/assets/table.png');
  return tableTexture;
}
