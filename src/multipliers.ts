export interface MultiplierData {
  value: number;
  chance: number;
}

// Multiplier table with values and their respective chances
export const MULTIPLIER_TABLE: MultiplierData[] = [
  { value: 10.0, chance: 3.0 },
  { value: 5.0, chance: 6.0 },
  { value: 3.0, chance: 13.0 },
  { value: 2.0, chance: 23.0 },
  { value: 1.0, chance: 55.0 },
  { value: 4.0, chance: 7.0 },
  { value: 2.0, chance: 9.0 },
  { value: 0.6, chance: 15.0 },
  { value: 0.3, chance: 50.0 },
  { value: 0.0, chance: 19.0 },
];

// Calculate total weight for normalization
const TOTAL_WEIGHT = MULTIPLIER_TABLE.reduce((sum, item) => sum + item.chance, 0);

/**
 * Picks a random multiplier based on weighted chances
 * @returns The selected multiplier value
 */
export function getRandomMultiplier(): number {
  const random = Math.random() * TOTAL_WEIGHT;
  let cumulative = 0;

  for (const multiplier of MULTIPLIER_TABLE) {
    cumulative += multiplier.chance;
    if (random <= cumulative) {
      return multiplier.value;
    }
  }

  // Fallback (should never reach here)
  return MULTIPLIER_TABLE[MULTIPLIER_TABLE.length - 1].value;
}

/**
 * Gets the color for a multiplier value (for visual feedback)
 * @param multiplier The multiplier value
 * @returns Hex color string
 */
export function getMultiplierColor(multiplier: number): string {
  if (multiplier >= 10.0) return '#FFD700'; // Gold
  if (multiplier >= 5.0) return '#FF6B6B'; // Red
  if (multiplier >= 3.0) return '#FF8C42'; // Orange
  if (multiplier >= 2.0) return '#FFA07A'; // Light Orange
  if (multiplier >= 1.0) return '#90EE90'; // Light Green
  if (multiplier >= 0.6) return '#87CEEB'; // Sky Blue
  if (multiplier > 0.0) return '#B0C4DE'; // Light Steel Blue
  return '#808080'; // Gray for 0.0x
}

/**
 * Formats multiplier for display
 * @param multiplier The multiplier value
 * @returns Formatted string (e.g., "2.00x")
 */
export function formatMultiplier(multiplier: number): string {
  return `${multiplier.toFixed(2)}x`;
}
