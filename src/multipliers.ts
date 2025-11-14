export interface MultiplierData {
  value: number;
  chance: number;
}

let MULTIPLIER_TABLE: MultiplierData[] = [];
let TOTAL_WEIGHT = 0;

export async function loadMultiplierTable(): Promise<void> {
  const response = await fetch('/data/multipliers.json');
  MULTIPLIER_TABLE = await response.json();
  TOTAL_WEIGHT = MULTIPLIER_TABLE.reduce((sum, item) => sum + item.chance, 0);
}

export function getMultiplierTable(): MultiplierData[] {
  return MULTIPLIER_TABLE;
}

export function getRandomMultiplier(): number {
  const random = Math.random() * TOTAL_WEIGHT;
  let cumulative = 0;

  for (const multiplier of MULTIPLIER_TABLE) {
    cumulative += multiplier.chance;
    if (random <= cumulative) {
      return multiplier.value;
    }
  }

  return MULTIPLIER_TABLE[MULTIPLIER_TABLE.length - 1].value;
}

export function getMultiplierColor(multiplier: number): string {
  const colors = [
    '#FFD700',
    '#FF6B6B',
    '#FF8C42',
    '#FFA07A',
    '#90EE90',
    '#87CEEB',
    '#A4B31C',
    '#B0C4DE',
    '#D315FA',
    '#808080',
  ];
  const multiplierIndex = MULTIPLIER_TABLE.map((m) => {
    return m.value;
  }).indexOf(multiplier);
  return multiplier === 2 ? (Math.random() < 0.5 ? colors[3] : colors[6]) : colors[multiplierIndex];
}

export function formatMultiplier(multiplier: number): string {
  return `${multiplier.toFixed(2)}x`;
}
