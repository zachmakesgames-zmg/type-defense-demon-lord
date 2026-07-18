// ─── Balance Config ───────────────────────────────────────────────
// Single source of truth for all tunable gameplay numbers.
// Playtesting = editing this file only.

export const BALANCE = {

  // ── Grid / rendering ──────────────────────────────────────────
  CELL_PX: 64,               // pixels per grid cell on the 1024×1024 canvas
  METERS_PER_CELL: 2,        // 1 cell = 2 in-game meters (32 px = 1 m)

  // ── Gold economy ──────────────────────────────────────────────
  GOLD_PER_STRING:      25,   // gold per completed 5-char mining string
  GOLD_SENTENCE_BONUS:  50,   // bonus for completing a full sentence
  GOLD_ACCURACY_BONUS:  25,   // bonus for perfect accuracy on a sentence
  GOLD_MAX:           3000,   // hard cap

  // ── Enemy HP & speed ─────────────────────────────────────────
  ENEMY: {
    soldier:     { hp: 60,  speed: 1.5, defense: 0,    immunities: [],                         flameBonus: false, poisonArmorIgnore: false },
    knight:      { hp: 200, speed: 0.8, defense: 0.25, immunities: [],                         flameBonus: false, poisonArmorIgnore: true  },
    assassin:    { hp: 35,  speed: 3.5, defense: 0,    immunities: [],                         flameBonus: false, poisonArmorIgnore: false },
    siegeWeapon: { hp: 500, speed: 0.4, defense: 0.5,  immunities: [],                         flameBonus: true,  poisonArmorIgnore: false },
    zeppelin:    { hp: 80,  speed: 2.0, defense: 0,    immunities: ['gravity','tree','geyser'], flameBonus: false, poisonArmorIgnore: false },
  },

  // ── Towers ────────────────────────────────────────────────────
  // range: in cells (1 cell = CELL_PX pixels)
  // rof: rate-of-fire stat → interval = 2.2 - 0.2*rof (seconds)
  // damage: stat → hp = 10 + (stat-1)*(40/9)
  TOWER: {
    archer: {
      range:  2,    // cells — short range, forces placement near the path
      rof:    5,    // interval ≈ 1.2 s
      damage: 3,    // ≈ 19 HP per hit
      cost:   100,
      splash: 0,
      dot:    0,
      aoe:    false,
      slow:   0,
    },
    geyser: {
      range:       3,     // cells
      fireInterval: 3.6,  // seconds — 50% slower than original 1.8 s
      damage:      7,     // ≈ 37 HP per hit
      cost:        300,
      splash:      2,     // splash radius in cells
      dot:         0,
      aoe:         false,
      slow:        0,
    },
    dragon: {
      range:              2,    // cells
      tileBreath:         true, // special: locks onto a tile and breathes, not a tracking projectile
      breathDuration:     0.5,  // seconds of active fire per attack
      breathCooldown:     1.0,  // seconds between attacks
      breathDamagePerSec: 40,   // HP/sec to enemies on the tile (40 × 0.5s = 20 HP per attack)
      damage:             1,    // reference only (not used in combat)
      cost:               300,
      splash:             0,
      dot:                0,
      aoe:                false,
      slow:               0,
      isFlame:            true,
    },
    tree: {
      range:  2,    // point-blank AoE
      rof:    10,   // interval ≈ 0.2 s (rapid ticks)
      damage: 1,
      cost:   500,
      splash: 0,
      dot:    5,
      aoe:    true,
      slow:   0,
      isPoisonAoE: true,
    },
    gravity: {
      range:  3,    // cells
      rof:    10,
      damage: 0,
      cost:   500,
      splash: 0,
      dot:    0,
      aoe:    true,
      slow:   0.5,  // 50% speed reduction
    },
    warlock: {
      range:  4,    // sniper
      rof:    4,    // interval ≈ 1.4 s
      damage: 9,    // ≈ 50 HP per hit
      cost:   1000,
      splash: 2,
      dot:    0,
      aoe:    false,
      slow:   0,
    },
  },

  // ── Counter mechanics ─────────────────────────────────────────
  FLAME_BONUS_MULTIPLIER:    2.0,  // Dragon vs Siege Weapon: 2× damage + ignores armor
  POISON_IGNORE_ARMOR:       true, // Tree of Dead poison ignores Knight's 25% defense

  // ── Wave timing ───────────────────────────────────────────────
  // groupSize: enemies per burst; groupGap: seconds between bursts
  // Within a burst, enemies spawn SPAWN_INTERVAL apart (tight cluster)
  SPAWN_INTERVAL:  0.25,  // seconds between enemies inside a group
  GROUP_GAP:       4.0,   // seconds between groups
  WAVES: [
    { wave: 1, startTime: 10,  enemyCount: 10, groupSize: 4  },
    { wave: 2, startTime: 60,  enemyCount: 20, groupSize: 5  },
    { wave: 3, startTime: 110, enemyCount: 40, groupSize: 7  },
    { wave: 4, startTime: 170, enemyCount: 80, groupSize: 10 },
    { wave: 5, startTime: 230, enemyCount: 160, groupSize: 15 },
  ],

  // ── Mining economy ────────────────────────────────────────────
  // Estimated productive-mining factor (60% of game time spent actively mining)
  // Used only for calibration reference — not enforced in code.
  // Net gold/sec ≈ GOLD_PER_STRING * WPM * PRODUCTIVE_FACTOR / 60
  PRODUCTIVE_MINING_FACTOR: 0.60,

  // ── Base ──────────────────────────────────────────────────────
  BASE_MAX_HP:          100,
  BASE_DAMAGE_PER_SEC:  1,    // HP lost per second while an enemy is at the base
};
