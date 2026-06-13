// ─── Game Engine ─────────────────────────────────────────────────
// Core game state management and update loop

import { TOWERS, rofToSeconds, rangeToPixels, damageToHP, splashToPixels } from '../constants/towers.js';
import { ENEMIES, getEnemyTypesForWorld, speedToPixels } from '../constants/enemies.js';
import { WAVES, getSpawnInterval } from '../constants/waves.js';
import { buildWeightedPool, generateCode, generateSentence } from '../constants/curriculum.js';
import { buildSegments, getPositionAlongPath } from '../utils/pathfinding.js';
import { distance } from '../utils/math.js';
import { TILE_SIZE } from './TileMap.js';

const MAX_GOLD = 3000;
const MAX_HP = 100;
const BASE_DAMAGE_PER_SECOND = 1;

export function createGameState(mapData, world, level) {
  const keyPool = buildWeightedPool(world, level);

  // Build road segments from waypoints
  const road = mapData.road || mapData.roads?.[0]?.waypoints || [];
  const { segments, totalLength } = buildSegments(road);

  // Base center position in pixels
  const basePx = {
    x: mapData.basePosition.gx * TILE_SIZE + TILE_SIZE, // center of 2×2
    y: mapData.basePosition.gy * TILE_SIZE + TILE_SIZE,
  };

  // Generate codes for tower sites
  const usedCodes = new Set();
  const sites = mapData.towerSites.map((site, i) => ({
    id: i,
    gx: site.gx,
    gy: site.gy,
    x: site.gx * TILE_SIZE + TILE_SIZE / 2,
    y: site.gy * TILE_SIZE + TILE_SIZE / 2,
    code: generateCode(keyPool, 4, usedCodes),
    tower: null,
  }));

  return {
    world,
    level,
    keyPool,
    road,
    segments,
    totalLength,
    basePx,
    sites,
    enemies: [],
    projectiles: [],
    effects: [],
    gold: 0,
    baseHP: MAX_HP,
    gameTime: 0,
    waveIndex: 0,        // next wave to trigger
    currentWave: 0,      // wave currently active (1-indexed for display)
    spawnQueue: 0,       // enemies remaining to spawn in current wave
    nextSpawnTime: 0,    // game time of next enemy spawn
    enemyIdCounter: 0,
    sentenceAccuracy: true,
    status: 'playing',   // 'playing' | 'won' | 'lost'
  };
}

export function updateGame(state, dt) {
  if (state.status !== 'playing') return;

  state.gameTime += dt;

  // ── Wave spawning ──────────────────────────────────────────────
  if (state.waveIndex < WAVES.length) {
    const wave = WAVES[state.waveIndex];
    if (state.gameTime >= wave.startTime && state.spawnQueue === 0) {
      state.spawnQueue = wave.enemyCount;
      state.nextSpawnTime = state.gameTime;
      state.currentWave = state.waveIndex + 1;
      state.waveIndex++;
    }
  }

  // Spawn enemies from queue
  if (state.spawnQueue > 0 && state.gameTime >= state.nextSpawnTime) {
    spawnEnemy(state);
    state.spawnQueue--;
    const interval = getSpawnInterval(state.waveIndex - 1);
    state.nextSpawnTime = state.gameTime + interval;
  }

  // ── Update enemies ─────────────────────────────────────────────
  for (const enemy of state.enemies) {
    // Slow effect
    if (enemy.slowTimer > 0) {
      enemy.slowTimer -= dt;
      if (enemy.slowTimer <= 0) enemy.slowMultiplier = 1;
    }

    // Damage over time
    if (enemy.dotTimer > 0) {
      enemy.dotTimer -= dt;
      enemy.hp -= 10 * dt; // 1 point per tick, 10 ticks per second
    }

    // Flash timer
    if (enemy.flashTimer > 0) enemy.flashTimer -= dt;

    // Movement
    const speedPx = speedToPixels(enemy.speed) * enemy.slowMultiplier;
    enemy.progress += speedPx * dt;

    // Check if reached base
    if (enemy.progress >= state.totalLength) {
      enemy.progress = state.totalLength;
      enemy.atBase = true;
      state.baseHP -= BASE_DAMAGE_PER_SECOND * dt;
    }
  }

  // Remove dead enemies
  state.enemies = state.enemies.filter(e => e.hp > 0);

  // ── Tower firing ───────────────────────────────────────────────
  for (const site of state.sites) {
    if (!site.tower) continue;
    const towerDef = TOWERS[site.tower.type];
    if (!towerDef) continue;

    site.tower.cooldown -= dt;
    if (site.tower.cooldown > 0) continue;

    const rangePx = rangeToPixels(towerDef.range);

    if (towerDef.aoe) {
      // Area effect: affect all enemies in range
      let hitAny = false;
      for (const enemy of state.enemies) {
        if (enemy.atBase) continue;
        const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);
        const dist = distance({ x: site.x, y: site.y }, pos);

        if (dist <= rangePx) {
          // Check immunity
          if (enemy.immunities.includes(site.tower.type)) continue;

          hitAny = true;

          if (towerDef.slow) {
            enemy.slowMultiplier = 1 - towerDef.slow;
            enemy.slowTimer = rofToSeconds(towerDef.rof) + 0.1;
          }
          if (towerDef.dot) {
            enemy.dotTimer = towerDef.dot;
          }
          if (towerDef.damage > 0) {
            const dmg = calculateDamage(damageToHP(towerDef.damage), enemy, towerDef);
            enemy.hp -= dmg;
            enemy.flashTimer = 0.08;
          }
        }
      }
      site.tower.cooldown = hitAny ? rofToSeconds(towerDef.rof) : 0.05;
    } else {
      // Single target: find closest enemy to base within range
      let target = null;
      let bestProgress = -1;

      for (const enemy of state.enemies) {
        if (enemy.atBase) continue;
        if (enemy.immunities.includes(site.tower.type)) continue;

        const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);
        const dist = distance({ x: site.x, y: site.y }, pos);

        if (dist <= rangePx && enemy.progress > bestProgress) {
          bestProgress = enemy.progress;
          target = enemy;
        }
      }

      if (target) {
        const dmg = calculateDamage(damageToHP(towerDef.damage), target, towerDef);
        target.hp -= dmg;
        target.flashTimer = 0.08;

        if (towerDef.dot) {
          target.dotTimer = towerDef.dot;
        }

        // Splash damage
        if (towerDef.splash) {
          const splashPx = splashToPixels(towerDef.splash);
          const targetPos = getPositionAlongPath(state.segments, state.totalLength, target.progress);

          for (const enemy of state.enemies) {
            if (enemy.id === target.id) continue;
            if (enemy.atBase) continue;
            if (enemy.immunities.includes(site.tower.type)) continue;

            const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);
            if (distance(pos, targetPos) <= splashPx) {
              const splashDmg = calculateDamage(damageToHP(towerDef.damage) * 0.5, enemy, towerDef);
              enemy.hp -= splashDmg;
              enemy.flashTimer = 0.08;
            }
          }
        }

        site.tower.cooldown = rofToSeconds(towerDef.rof);
      }
    }
  }

  // ── Win/Loss check ─────────────────────────────────────────────
  if (state.baseHP <= 0) {
    state.baseHP = 0;
    state.status = 'lost';
  } else if (
    state.waveIndex >= WAVES.length &&
    state.spawnQueue === 0 &&
    state.enemies.length === 0
  ) {
    state.status = 'won';
  }
}

// ── Damage Calculation ───────────────────────────────────────────
function calculateDamage(baseDamage, enemy, towerDef) {
  // Siege Weapon: flame damage ignores defense entirely
  if (enemy.flameWeakness && towerDef.isFlame) {
    return baseDamage;
  }
  // Apply defense reduction
  return baseDamage * (1 - enemy.defense);
}

// ── Spawn an enemy ───────────────────────────────────────────────
function spawnEnemy(state) {
  const availableTypes = getEnemyTypesForWorld(state.world);
  // For now, pick randomly weighted toward soldiers in early worlds
  const type = pickEnemyType(availableTypes, state.world);

  state.enemies.push({
    id: state.enemyIdCounter++,
    type: type.id,
    hp: type.hp,
    maxHp: type.hp,
    speed: type.speed,
    defense: type.defense,
    immunities: type.immunities || [],
    flameWeakness: type.flameWeakness || false,
    progress: 0,
    dotTimer: 0,
    slowTimer: 0,
    slowMultiplier: 1,
    flashTimer: 0,
    atBase: false,
  });
}

function pickEnemyType(types, world) {
  if (types.length === 1) return types[0];

  // Weighted: newer enemy types appear less frequently
  // Soldiers always have highest weight
  const weights = types.map((t, i) => {
    if (t.id === 'soldier') return 5;
    if (i === types.length - 1) return 2; // newest type
    return 3;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < types.length; i++) {
    r -= weights[i];
    if (r <= 0) return types[i];
  }
  return types[0];
}

// ── Tower Building ───────────────────────────────────────────────
export function buildTower(state, siteId, towerType) {
  const site = state.sites.find(s => s.id === siteId);
  if (!site) return false;

  const towerDef = TOWERS[towerType];
  if (!towerDef) return false;

  if (state.gold < towerDef.cost) return false;

  // Refund if replacing
  if (site.tower) {
    const oldDef = TOWERS[site.tower.type];
    if (oldDef) {
      state.gold += Math.floor(oldDef.cost * 0.2);
    }
  }

  site.tower = { type: towerType, cooldown: 0 };
  state.gold -= towerDef.cost;
  return true;
}

// ── Mining Gold ──────────────────────────────────────────────────
export function awardMiningGold(state, amount) {
  state.gold = Math.min(MAX_GOLD, state.gold + amount);
}
