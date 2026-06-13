// 5 waves per level, no breaks — each wave begins at a fixed time
export const WAVES = [
  { wave: 1, startTime: 10,  enemyCount: 10 },
  { wave: 2, startTime: 60,  enemyCount: 15 },
  { wave: 3, startTime: 110, enemyCount: 20 }, // 1 min 50 sec
  { wave: 4, startTime: 170, enemyCount: 25 }, // 2 min 50 sec
  { wave: 5, startTime: 230, enemyCount: 30 }, // 3 min 50 sec
];

export const TOTAL_WAVES = WAVES.length;
export const TOTAL_ENEMIES = WAVES.reduce((sum, w) => sum + w.enemyCount, 0); // 100

// Spawn interval per wave (seconds between each enemy spawn)
// Calibrated so all enemies in a wave spawn before the next wave starts
export function getSpawnInterval(waveIndex) {
  const wave = WAVES[waveIndex];
  const nextWave = WAVES[waveIndex + 1];
  if (!wave) return 1;

  // Time available = gap to next wave (or 60s for last wave)
  const available = nextWave ? (nextWave.startTime - wave.startTime) : 60;
  // Leave a small buffer at the end
  return Math.max(0.3, (available - 5) / wave.enemyCount);
}
