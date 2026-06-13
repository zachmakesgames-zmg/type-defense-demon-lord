// ─── Save Data ───────────────────────────────────────────────────
// localStorage-based progression system

const SAVE_KEY = 'typeDefenseDungeon_progress';

const defaultProgress = {
  // Tracks highest completed level per world: { worldId: highestCompletedLevel }
  completed: {},
  // Best base HP per level: { "w1l1": 85, "w1l2": 100, ... }
  bestHP: {},
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      return { ...defaultProgress, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load save data:', e);
  }
  return { ...defaultProgress };
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

export function completeLevel(world, level, baseHP) {
  const progress = loadProgress();

  // Update highest completed level
  const prevHighest = progress.completed[world] || 0;
  if (level > prevHighest) {
    progress.completed[world] = level;
  }

  // Update best HP
  const key = `w${world}l${level}`;
  const prevBest = progress.bestHP[key] || 0;
  if (baseHP > prevBest) {
    progress.bestHP[key] = baseHP;
  }

  saveProgress(progress);
  return progress;
}

export function isWorldUnlocked(worldId) {
  // Always unlocked for testing/review
  return true;
}

export function isLevelUnlocked(world, level) {
  // Always unlocked for testing/review
  return true;
}

export function getLevelBestHP(world, level) {
  const progress = loadProgress();
  return progress.bestHP[`w${world}l${level}`] || 0;
}

export function resetProgress() {
  localStorage.removeItem(SAVE_KEY);
}
