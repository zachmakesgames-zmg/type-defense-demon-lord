import { BALANCE } from '../config/balance.js';

export const WAVES = BALANCE.WAVES;

export const TOTAL_WAVES = WAVES.length;
export const TOTAL_ENEMIES = WAVES.reduce((sum, w) => sum + w.enemyCount, 0);

export function getSpawnInterval(waveIndex) {
  const wave = WAVES[waveIndex];
  const nextWave = WAVES[waveIndex + 1];
  if (!wave) return 1;
  const available = nextWave ? (nextWave.startTime - wave.startTime) : 60;
  return Math.max(0.3, (available - 5) / wave.enemyCount);
}
