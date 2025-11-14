# Tarot Card Game - Multiplier Edition

A 3D Tarot card game built with PixiJS, featuring animated card flipping, multipliers, and a betting system.

## Technologies Used

- **PixiJS 7.4.2** - 2D WebGL renderer
- **pixi-projection** - 3D transformations and perspective
- **@pixi/layers** - Layered rendering system
- **GSAP** - Animation library for smooth transitions
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

## Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run development server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:8081` (or the port shown in terminal)

4. **Build for production:**
   ```bash
   npm run build
   ```

## Game Flow

### 1. **Idle Mode**

- Game starts with a "Play" button centered on screen
- Bet selector is displayed at the bottom with:
  - `-` button to decrease bet
  - Current bet amount ($1.00 default)
  - `+` button to increase bet
  - Available bets: $0.10, $0.20, $0.50, $1.00, $2.00, $5.00, $10.00, $15.00, $20.00

### 2. **Game Start (Click "Play")**

- Play button fades out
- Bet UI moves to top of screen and becomes non-interactive
- Three cards deal one-by-one with staggered animation
- Cards appear face-down in a fan formation
- "Tap on cards" text appears

### 3. **Gameplay**

- Click any face-down card to flip it face-up
- Each card reveals:
  - A random Tarot card face
  - A multiplier value (0.0x to 10.0x) with color-coding
- Cards flip with smooth GSAP animation (0.6s)
- Click a face-up card to flip it back down

### 4. **Win Condition**

- When all three cards are face-up:
  - Win popup appears with glowing, bouncing text
  - Shows payout calculation: `Bet × (sum of multipliers) = Total Win`
  - Example: `$1.00 × 3.60 = $3.60`
  - Text cycles through rainbow colors (gold → red → magenta → blue → cyan → green → yellow)
  - "Reset" button appears

### 5. **Reset**

- Click "Reset" button to reload the game
- Returns to idle mode with default settings

## Game Features

### 3D Card Effects

- Cards rendered in 3D space with perspective camera
- Euler rotation for realistic flip animation
- Drop shadows for depth
- Layered rendering (shadows → cards → multipliers)

### Multiplier System

- 10 different multiplier values with weighted probabilities
- Loaded from `/public/data/multipliers.json`
- Color-coded display:
  - Gold: 10.0x (3% chance)
  - Red/Orange: 5.0x, 4.0x, 3.0x (6%, 7%, 13%)
  - Light colors: 2.0x, 1.0x (23%, 55%, 9%)
  - Blue/Purple: 0.6x, 0.3x (15%, 50%)
  - Gray: 0.0x (19%)

### Animations

- **Card Dealing**: Staggered entrance with z-axis movement and alpha fade
- **Card Flipping**: 3D rotation around y-axis with depth adjustment
- **Win Popup**: Bouncing scale animation + gradient color cycling
- **UI Transitions**: Smooth fade and position changes

## File Structure

```
src/
├── main.ts                 # Main application entry point
├── CardSprite.ts           # 3D card component with flip logic
├── BetUI.ts               # Betting interface
├── WinMessagePopup.ts     # Win screen with animations
├── TableSprite.ts         # Game table background
├── dealHand.ts            # Card dealing logic
├── multipliers.ts         # Multiplier system
├── loadAssets.ts          # Asset loading utilities
public/
├── data/
│   └── multipliers.json   # Multiplier configuration
├── assets/
│   ├── card_front.png     # Card face template
│   ├── card_back.png      # Card back design
│   └── [card faces...]    # Individual Tarot card images
```

## Configuration

### Modify Multipliers

Edit `/public/data/multipliers.json`:

```json
[
  { "value": 10.0, "chance": 3.0 },
  { "value": 5.0, "chance": 6.0 },
  ...
]
```

- `value`: Multiplier amount
- `chance`: Probability weight (higher = more common)

### Adjust Bet Amounts

Edit `BET_AMOUNTS` array in `src/BetUI.ts`:

```typescript
export const BET_AMOUNTS = [0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 20.0];
```

## Controls

- **Click/Tap**: Flip cards, navigate UI
- **+ / -**: Adjust bet amount (idle mode only)
- **Play**: Start game
- **Reset**: Restart game after win

## Development Notes

- All animations use GSAP for performance and smoothness
- Card state managed through getter/setter properties for automatic animation triggers

## 3D Cards - PixiJS example

- 3D Cards - PixiJS example was used for quicker and more accurate implementation

## AI Usage:

- Claude AI was mainly used for mathematical calculations of positioning, rotation angles, color picking etc.
- Used also for graphical elements and setting correct properties
- Used for creating this README.md

### If there was more time

- Add some more celebration animations to better the user experience
- Added some more styles to all the components
- Add some feature like free spins but with some 5x5 tile reveal game, feature anticipation (if one feature symbol appears on one of the cards next card to open slower then usual to enhance the user experience)
