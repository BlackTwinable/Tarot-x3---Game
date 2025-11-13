import { Texture } from 'pixi.js';
import { Sprite3d } from 'pixi-projection';
import { Group } from '@pixi/layers';

export const tableGroup = new Group(0);

export class TableSprite extends Sprite3d {
  constructor(texture: Texture) {
    super(texture);

    this.anchor.set(0.5);

    this.position3d.x = 0;
    this.position3d.y = -120;
    this.position3d.z = -10;

    this.parentGroup = tableGroup;
  }
}
