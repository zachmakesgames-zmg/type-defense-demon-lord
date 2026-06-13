// ─── Full Typing Curriculum ───────────────────────────────────────
// Each world/level defines which NEW keys are introduced and what the
// pedagogical focus is. The active key set is cumulative.

const CURRICULUM = {
  // World 1: Forest — The Home Row
  1: {
    1: { newKeys: ['f', 'j'],           focus: 'Index fingers. Anchor keys and home row muscle memory.' },
    2: { newKeys: ['d', 'k'],           focus: 'Middle fingers. Alternating left and right hand patterns.' },
    3: { newKeys: ['s', 'l'],           focus: 'Ring fingers. Building outward hand awareness.' },
    4: { newKeys: ['a', ';'],           focus: 'Pinkies. Full outer home row now active.' },
    5: { newKeys: ['g', 'h'],           focus: 'Center index reach. Completing the home row.' },
  },
  // World 2: Swamp — The Top Row
  2: {
    1: { newKeys: ['r', 'u'],           focus: 'Index finger reach upward.' },
    2: { newKeys: ['e', 'i'],           focus: 'Middle finger reach. High-frequency letters.' },
    3: { newKeys: ['w', 'o'],           focus: 'Ring finger reach. Phonetic patterns emerge.' },
    4: { newKeys: ['q', 'p'],           focus: 'Pinky reach. Least common letters.' },
    5: { newKeys: ['t', 'y'],           focus: 'Center index reach. Full top row active.' },
  },
  // World 3: Snow — The Bottom Row
  3: {
    1: { newKeys: ['v', 'n'],           focus: 'Index finger reach downward.' },
    2: { newKeys: ['c', 'm'],           focus: 'Middle finger reach downward.' },
    3: { newKeys: ['b', ','],           focus: 'Index stretch (B) and comma. Punctuation rhythm.' },
    4: { newKeys: ['x', '.'],           focus: 'Ring finger reach. Period appears at string ends.' },
    5: { newKeys: ['z', '/'],           focus: 'Pinky reach. Full letter keyboard active.' },
  },
  // World 4: Desert — Capital Letters
  4: {
    1: { newKeys: [],                   focus: 'Shift + home row letters. Opposite-hand Shift practice.',    capitals: 'homerow' },
    2: { newKeys: [],                   focus: 'Shift + top row letters.',                                   capitals: 'toprow' },
    3: { newKeys: [],                   focus: 'Shift + bottom row letters.',                                capitals: 'bottomrow' },
    4: { newKeys: [],                   focus: 'Mixed capitalization across all rows.',                      capitals: 'mixed' },
    5: { newKeys: [],                   focus: 'Speed and accuracy with capitals fully integrated.',         capitals: 'full' },
  },
  // World 5: Badlands — The Number Row
  5: {
    1: { newKeys: ['5', '6'],           focus: 'Index finger reach to number row. Center numbers first.' },
    2: { newKeys: ['4', '7'],           focus: 'Index finger reach slightly outward.' },
    3: { newKeys: ['3', '8'],           focus: 'Middle finger reach to number row.' },
    4: { newKeys: ['2', '9'],           focus: 'Ring finger reach to number row.' },
    5: { newKeys: ['1', '0'],           focus: 'Pinky reach. Full number row active.' },
  },
  // World 6: Tropical — Symbols
  6: {
    1: { newKeys: ["'", '-'],           focus: 'Most common symbols. Right pinky reach.' },
    2: { newKeys: ['!', '?'],           focus: 'High-frequency punctuation. Shift combos.' },
    3: { newKeys: ['@', '#'],           focus: 'Common digital symbols.' },
    4: { newKeys: ['$', '%', '^', '&'], focus: 'Four new symbols. Full keyboard literacy.' },
    5: { newKeys: ['*', '(', ')', '_', '+'], focus: 'Completing the symbol row. Full keyboard active.' },
  },
  // World 7: Corrupted — Fluency (no new keys)
  7: {
    1: { newKeys: [],                   focus: 'Home and top row dominant. Building full-keyboard speed.', fluency: true },
    2: { newKeys: [],                   focus: 'Even distribution across all rows.',                       fluency: true },
    3: { newKeys: [],                   focus: 'Punctuation, capitals, numbers in natural proportions.',   fluency: true },
    4: { newKeys: [],                   focus: 'Higher density and faster timing. Accuracy under pressure.', fluency: true },
    5: { newKeys: [],                   focus: 'Maximum difficulty. 40 WPM for clean victory.',            fluency: true },
  },
};

// ─── Get cumulative active keys for a given world/level ──────────

export function getActiveKeys(world, level) {
  const keys = new Set();

  for (let w = 1; w <= world; w++) {
    const maxL = w === world ? level : 5;
    for (let l = 1; l <= maxL; l++) {
      const entry = CURRICULUM[w]?.[l];
      if (entry) {
        for (const k of entry.newKeys) keys.add(k);
      }
    }
  }

  return [...keys];
}

// ─── Get level info ──────────────────────────────────────────────

export function getLevelInfo(world, level) {
  return CURRICULUM[world]?.[level] || null;
}

// ─── Key Ratio System ────────────────────────────────────────────
// New Keys: 40% | Current World Keys (prev levels): 35% | Previous World Keys: 25%
// When a category doesn't exist, its % rolls into New Keys.

export function getKeyPool(world, level) {
  const info = getLevelInfo(world, level);
  if (!info) return { pool: [], newKeys: [], currentWorldKeys: [], previousWorldKeys: [] };

  const newKeys = [...info.newKeys];

  // Current world keys: keys from previous levels of this world
  const currentWorldKeys = [];
  for (let l = 1; l < level; l++) {
    const prev = CURRICULUM[world]?.[l];
    if (prev) currentWorldKeys.push(...prev.newKeys);
  }

  // Previous world keys: all keys from all worlds before this one
  const previousWorldKeys = [];
  for (let w = 1; w < world; w++) {
    for (let l = 1; l <= 5; l++) {
      const prev = CURRICULUM[w]?.[l];
      if (prev) previousWorldKeys.push(...prev.newKeys);
    }
  }

  return { newKeys, currentWorldKeys, previousWorldKeys };
}

// Generate a weighted pool of characters respecting the 40/35/25 ratio
export function buildWeightedPool(world, level) {
  const { newKeys, currentWorldKeys, previousWorldKeys } = getKeyPool(world, level);

  // Handle edge cases per design doc
  let newPct = 0.40, curPct = 0.35, prevPct = 0.25;

  if (previousWorldKeys.length === 0 && currentWorldKeys.length === 0) {
    // World 1, Level 1: 100% new
    newPct = 1.0; curPct = 0; prevPct = 0;
  } else if (previousWorldKeys.length === 0) {
    // World 1, Level 2+: new gets prev's share
    newPct = 0.40 + 0.25; curPct = 0.35; prevPct = 0;
  } else if (currentWorldKeys.length === 0) {
    // World 2+ Level 1: new gets current's share
    newPct = 0.40 + 0.35; curPct = 0; prevPct = 0.25;
  }

  // For World 7 (fluency) or World 4 (capitals), use all active keys
  if (newKeys.length === 0) {
    const allKeys = getActiveKeys(world, level);
    return allKeys;
  }

  // Build pool: repeat each key proportionally
  const POOL_SIZE = 100;
  const pool = [];
  const addKeys = (keys, pct) => {
    if (keys.length === 0) return;
    const count = Math.round(POOL_SIZE * pct);
    for (let i = 0; i < count; i++) {
      pool.push(keys[i % keys.length]);
    }
  };

  addKeys(newKeys, newPct);
  addKeys(currentWorldKeys, curPct);
  addKeys(previousWorldKeys, prevPct);

  return pool.length > 0 ? pool : getActiveKeys(world, level);
}

// ─── String Generation ───────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random string of n characters from the given key pool
export function generateString(pool, length = 5) {
  return Array.from({ length }, () => pickRandom(pool)).join('');
}

// Generate a sentence of 5 random strings
export function generateSentence(pool, wordLength = 5, wordCount = 5) {
  const used = new Set();
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    let word;
    let attempts = 0;
    do {
      word = generateString(pool, wordLength);
      attempts++;
    } while (used.has(word) && attempts < 50);
    used.add(word);
    words.push(word);
  }
  return words;
}

// Generate a unique code (for tower sites and build menu)
export function generateCode(pool, length = 5, exclude = new Set()) {
  let code;
  let attempts = 0;
  do {
    code = generateString(pool, length);
    attempts++;
  } while (exclude.has(code) && attempts < 100);
  exclude.add(code);
  return code;
}

export default CURRICULUM;
