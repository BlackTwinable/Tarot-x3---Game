import { Application, TextStyle } from 'pixi.js';
import { Camera3d, Container3d, Text3d } from 'pixi-projection';
import { CardSprite } from './CardSprite';
import { TableSprite } from './TableSprite';
import { dealHandAnimated } from './dealHand';
import { loadCardAssets, loadTableAsset } from './loadAssets';
import { BetUI } from './BetUI';
import { WinMessagePopup } from './WinMessagePopup';
import { loadMultiplierTable } from './multipliers';

(async () => {
  const app = new Application({ background: '#000', resizeTo: window });
  (globalThis as any).__PIXI_APP__ = app;

  document.getElementById('pixi-container')!.appendChild(app.view as HTMLCanvasElement);

  // REPLACEING THE DEFAULT STAGE WITH Container3D TO SUPPORT 3D OBJECTS
  app.stage = new Container3d();

  //LOADING THE ASSETS
  const cardsTextures = await loadCardAssets();
  await loadMultiplierTable();

  //ADDING THE CAMERA TO THE STAGE TO HAVEV A PERSPECTIVE VIEW
  const camera = new Camera3d();
  camera.position.set(app.screen.width / 2, app.screen.height / 2);
  camera.setPlanes(350, 30, 10000);
  camera.euler.x = Math.PI / 5.5;
  app.stage.addChild(camera);

  // LOAD AND CREATE THE TABLE
  const tableTexture = await loadTableAsset();
  const table = new TableSprite(tableTexture);
  table.scale3d.set(0.8);
  camera.addChild(table);

  const cards = new Container3d();
  cards.position3d.x = 0;
  cards.position3d.y = -50;
  cards.position3d.z = 0;
  cards.scale3d.set(2);
  camera.addChild(cards);

  // BET UI
  const betUI = new BetUI();
  betUI.x = app.screen.width / 2;
  betUI.y = app.screen.height - 100;
  app.stage.addChild(betUI);

  // WIN MESSAGE
  const winPopup = new WinMessagePopup(() => {
    // Reset callback
    location.reload();
  });
  winPopup.x = app.screen.width / 2;
  winPopup.y = app.screen.height / 2;
  app.stage.addChild(winPopup);

  // Game state
  let isGameActive = false;

  function checkWinCondition() {
    let allFaceUp = true;
    let totalMultiplier = 0;

    for (let i = 0; i < cards.children.length; i++) {
      const card = cards.children[i] as CardSprite;
      if (card.code === 0) {
        allFaceUp = false;
        break;
      }
      totalMultiplier += card.multiplier;
    }

    if (allFaceUp && cards.children.length > 0) {
      const currentBet = betUI.getCurrentBet();
      setTimeout(() => {
        winPopup.show(currentBet, totalMultiplier);
      }, 1000);
      isGameActive = false;
    }
  }

  function onClick(event: any) {
    if (!isGameActive) {
      return;
    }

    const { target } = event;
    if (target.code === 0) {
      const num = ((Math.random() * 13) | 0) + 2;
      const suit = ((Math.random() * 4) | 0) + 1;
      target.code = suit * 16 + num;

      checkWinCondition();
    } else {
      target.code = 0;
      winPopup.hide();
    }
  }

  function addText(txt: string | undefined) {
    const style = new TextStyle({
      fontSize: 80,
      fontFamily: 'Arial',
      fill: '#f5ffe3',
      dropShadow: true,
      dropShadowColor: 'rgba(1, 1, 1, 0.4)',
      dropShadowDistance: 6,
      wordWrap: false,
    });
    const basicText = new Text3d(txt, style);
    basicText.position3d.x = -240;
    basicText.position3d.y = 20;
    camera.addChild(basicText);
  }

  async function startGame() {
    betUI.deactivate();
    betUI.positionBetOnTop(0, -app.screen.height + 200);

    await dealHandAnimated(cards, cardsTextures, onClick, 0.3);

    addText('Tap on cards');

    isGameActive = true;
  }

  const playButton = document.getElementById('play-button') as HTMLButtonElement;
  if (playButton) {
    playButton.addEventListener('click', () => {
      playButton.classList.add('hidden');
      startGame();
    });
  }

  app.ticker.add((deltaTime) => {
    for (let i = 0; i < cards.children.length; i++) {
      const card = cards.children[i] as CardSprite;
      card.update(deltaTime / 60.0);
    }

    // We are gonna sort and show correct side of card,
    // so we need updateTransform BEFORE the sorting will be called.
    // otherwise this part will be tardy by one frame
    camera.updateTransform();

    for (let i = 0; i < cards.children.length; i++) {
      (cards.children[i] as CardSprite).checkFace();
    }
  });

  app.start();
})();
