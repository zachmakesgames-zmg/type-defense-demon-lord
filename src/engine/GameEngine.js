// ─── Game Engine ─────────────────────────────────────────────────
// Core game state management and update loop

import { TOWERS, rofToSeconds, rangeToPixels, damageToHP, splashToPixels } from '../constants/towers.js';
import { ENEMIES, getEnemyTypesForWorld, speedToPixels } from '../constants/enemies.js';
import { WAVES, getSpawnInterval } from '../constants/waves.js';
import { buildWeightedPool, generateCode, generateSentence } from '../constants/curriculum.js';
import { buildSegments, getPositionAlongPath } from '../utils/pathfinding.js';
import { distance } from '../utils/math.js';
import { TILE_SIZE } from './TileMap.js';
import { BALANCE } from '../config/balance.js';

const MAX_GOLD             = BALANCE.GOLD_MAX;
const MAX_HP               = BALANCE.BASE_MAX_HP;
const BASE_DAMAGE_PER_SECOND = BALANCE.BASE_DAMAGE_PER_SEC;

// Prefer explicit fireInterval override over rof formula
const fireInterval = (towerDef) => towerDef.fireInterval ?? rofToSeconds(towerDef.rof);

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
    effects: [],   // ghost animations
    graves: {},    // cellKey → { x, y } — one grave per 64×64 cell
    gold: 0,
    baseHP: MAX_HP,
    gameTime: 0,
    waveIndex: 0,
    currentWave: 0,
    spawnQueue: 0,
    spawnGroupSize: 0,
    spawnGroupRemaining: 0,
    nextSpawnTime: 0,
    enemyIdCounter: 0,
    sentenceAccuracy: true,
    status: 'playing',
    debugMode: false,
    debugData: null,
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
      state.spawnGroupSize = wave.groupSize || wave.enemyCount;
      state.spawnGroupRemaining = state.spawnGroupSize;
      state.nextSpawnTime = state.gameTime;
      state.currentWave = state.waveIndex + 1;
      state.waveIndex++;
    }
  }

  // Spawn enemies from queue — group-burst mode
  if (state.spawnQueue > 0 && state.gameTime >= state.nextSpawnTime) {
    spawnEnemy(state);
    state.spawnQueue--;
    state.spawnGroupRemaining--;

    if (state.spawnGroupRemaining <= 0 && state.spawnQueue > 0) {
      // End of group — pause before next burst
      state.spawnGroupRemaining = Math.min(state.spawnGroupSize, state.spawnQueue);
      state.nextSpawnTime = state.gameTime + BALANCE.GROUP_GAP;
    } else {
      // Inside a group — tight interval
      state.nextSpawnTime = state.gameTime + BALANCE.SPAWN_INTERVAL;
    }
  }

  // ── Update enemies ─────────────────────────────────────────────
  for (const enemy of state.enemies) {
    // Slow effect
    if (enemy.slowTimer > 0) {
      enemy.slowTimer -= dt;
      if (enemy.slowTimer <= 0) enemy.slowMultiplier = 1;
    }

    // Damage over time (10 ticks/sec; armor ignored when flagged by poison source)
    if (enemy.dotTimer > 0) {
      enemy.dotTimer -= dt;
      const rawTick = 10 * dt;
      enemy.hp -= enemy.dotIgnoresArmor ? rawTick : rawTick * (1 - (enemy.defense || 0));
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

  // ── Update projectiles (damage must land BEFORE death check) ───
  const remainingProjectiles = [];
  for (const proj of state.projectiles) {
    const target = state.enemies.find(e => e.id === proj.targetId);
    if (!target || target.hp <= 0) continue;

    const targetPos = getPositionAlongPath(state.segments, state.totalLength, target.progress);
    proj.angle = Math.atan2(targetPos.y - proj.y, targetPos.x - proj.x);
    proj.x += Math.cos(proj.angle) * proj.speed * dt;
    proj.y += Math.sin(proj.angle) * proj.speed * dt;

    const dist = distance({ x: proj.x, y: proj.y }, targetPos);
    if (dist < 12) {
      target.hp -= calculateDamage(proj.damage, target, proj.towerDef);
      target.flashTimer = 0.08;
      // Flame DoT only applies to enemies flagged flameBonus (Siege Weapon)
      if (proj.dot && (!proj.towerDef.isFlame || target.flameBonus)) {
        target.dotTimer = proj.dot;
        target.dotIgnoresArmor = !!proj.towerDef.isFlame;
      }
      if (proj.splash) {
        const splashPx = splashToPixels(proj.splash);
        for (const enemy of state.enemies) {
          if (enemy.id === target.id || enemy.atBase) continue;
          const epos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);
          if (distance(epos, targetPos) <= splashPx) {
            enemy.hp -= calculateDamage(proj.damage * 0.5, enemy, proj.towerDef);
            enemy.flashTimer = 0.08;
          }
        }
      }
    } else {
      remainingProjectiles.push(proj);
    }
  }
  state.projectiles = remainingProjectiles;

  // Handle dead enemies — spawn ghost + place grave AFTER damage lands
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) {
      const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);
      state.effects.push({ type: 'ghost', x: pos.x, y: pos.y, timer: 2.0, maxTimer: 2.0 });
      const cellKey = `${Math.floor(pos.x / TILE_SIZE)},${Math.floor(pos.y / TILE_SIZE)}`;
      if (!state.graves[cellKey]) {
        state.graves[cellKey] = {
          x: Math.floor(pos.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2,
          y: Math.floor(pos.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2,
        };
      }
    }
  }

  // Update ghost timers
  state.effects = state.effects.filter(e => { e.timer -= dt; return e.timer > 0; });

  // Remove dead enemies
  state.enemies = state.enemies.filter(e => e.hp > 0);

  // ── Tower firing ───────────────────────────────────────────────
  for (const site of state.sites) {
    if (!site.tower) continue;
    const towerDef = TOWERS[site.tower.type];
    if (!towerDef) continue;

    // ── Dragon tile-breath ─────────────────────────────────────
    if (towerDef.tileBreath) {
      const tw = site.tower;

      // Currently breathing — damage everything on the locked tile
      if (tw.breathTimer > 0) {
        tw.breathTimer -= dt;
        // Tile center in pixels
        const tileCx = tw.breathTile.gx * TILE_SIZE + TILE_SIZE / 2;
        const tileCy = tw.breathTile.gy * TILE_SIZE + TILE_SIZE / 2;
        const hitRadius = TILE_SIZE * 0.75; // slightly larger than half-tile so edge walkers get hit
        for (const enemy of state.enemies) {
          if (enemy.atBase) continue;
          const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);
          if (distance(pos, { x: tileCx, y: tileCy }) <= hitRadius) {
            enemy.hp -= towerDef.breathDamagePerSec * dt;
            enemy.flashTimer = 0.08;
          }
        }
        if (tw.breathTimer <= 0) {
          tw.breathTile = null;
          tw.cooldown = towerDef.breathCooldown;
        }
        continue;
      }

      // On cooldown — wait
      tw.cooldown -= dt;
      if (tw.cooldown > 0) continue;

      // Ready — find first enemy in range and lock onto its tile
      const rangePx = rangeToPixels(towerDef.range);
      let target = null;
      let bestProgress = -1;
      for (const enemy of state.enemies) {
        if (enemy.atBase) continue;
        const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);
        if (distance({ x: site.x, y: site.y }, pos) <= rangePx && enemy.progress > bestProgress) {
          bestProgress = enemy.progress;
          target = enemy;
        }
      }
      if (target) {
        const pos = getPositionAlongPath(state.segments, state.totalLength, target.progress);
        tw.breathTile = { gx: Math.floor(pos.x / TILE_SIZE), gy: Math.floor(pos.y / TILE_SIZE) };
        tw.breathTimer = towerDef.breathDuration;
      }
      continue;
    }

    site.tower.cooldown -= dt;
    if (site.tower.cooldown > 0) continue;

    const rangePx = rangeToPixels(towerDef.range);

    if (towerDef.aoe) {
      // AOE: instantly affect all enemies in range (no projectile)
      let hitAny = false;
      for (const enemy of state.enemies) {
        if (enemy.atBase) continue;
        const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);
        const dist = distance({ x: site.x, y: site.y }, pos);
        if (dist <= rangePx) {
          if (enemy.immunities.includes(site.tower.type)) continue;
          hitAny = true;
          if (towerDef.slow) {
            enemy.slowMultiplier = 1 - towerDef.slow;
            enemy.slowTimer = fireInterval(towerDef) + 0.1;
          }
          if (towerDef.dot) { enemy.dotTimer = towerDef.dot; enemy.dotIgnoresArmor = !!towerDef.isPoisonAoE; }
          if (towerDef.damage > 0) {
            enemy.hp -= calculateDamage(towerDef.flatDamage ?? damageToHP(towerDef.damage), enemy, towerDef);
            enemy.flashTimer = 0.08;
          }
        }
      }
      site.tower.cooldown = hitAny ? fireInterval(towerDef) : 0.05;
    } else {
      // Single target: spawn a projectile toward the furthest enemy in range
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
        const targetPos = getPositionAlongPath(state.segments, state.totalLength, target.progress);
        state.projectiles.push({
          id: state.enemyIdCounter++,
          x: site.x,
          y: site.y,
          targetId: target.id,
          speed: towerDef.projectileSpeed || 300,
          damage: towerDef.flatDamage ?? damageToHP(towerDef.damage),
          dot: towerDef.dot || 0,
          splash: towerDef.splash || 0,
          towerType: site.tower.type,
          towerDef,
          sprite: towerDef.projectileSprite || 'proj_arrow',
          angle: Math.atan2(targetPos.y - site.y, targetPos.x - site.x),
        });
        site.tower.cooldown = fireInterval(towerDef);
      }
    }
  }

  // ── Dev debug data ────────────────────────────────────────────
  if (state.debugMode) {
    state.debugData = computeDebugData(state);
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
  // Tree poison vs Knight: ignores armor
  if (towerDef.isPoisonAoE && enemy.poisonArmorIgnore && BALANCE.POISON_IGNORE_ARMOR) {
    return baseDamage;
  }
  // Dragon flame vs Siege: direct hits still reduced by armor, but the burn DoT ignores it
  return baseDamage * (1 - (enemy.defense || 0));
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
    defense: type.defense || 0,
    immunities: type.immunities || [],
    flameBonus: type.flameBonus || false,
    poisonArmorIgnore: type.poisonArmorIgnore || false,
    progress: 0,
    dotTimer: 0,
    dotIgnoresArmor: false,
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

  site.tower = { type: towerType, cooldown: 0, breathTimer: 0, breathTile: null };
  state.gold -= towerDef.cost;
  return true;
}

// ── Mining Gold ──────────────────────────────────────────────────
export function awardMiningGold(state, amount) {
  state.gold = Math.min(MAX_GOLD, state.gold + amount);
}

// ── Dev Debug Overlay ────────────────────────────────────────────
// Toggle with backtick key. Never shown to players.
export function toggleDebug(state) {
  state.debugMode = !state.debugMode;
}

export function computeDebugData(state) {
  if (!state.debugMode) return null;

  const towers = state.sites
    .filter(s => s.tower)
    .map(s => {
      const def = TOWERS[s.tower.type];
      const interval = rofToSeconds(def.rof);
      const hitDmg = damageToHP(def.damage);
      const dps = def.damage > 0 ? (hitDmg / interval).toFixed(1) : '0';
      return { type: def.label, dps, cost: def.cost, site: s.id };
    });

  const boardCost = state.sites
    .filter(s => s.tower)
    .reduce((sum, s) => sum + (TOWERS[s.tower.type]?.cost || 0), 0);

  // Gold/sec estimate: GOLD_PER_STRING at 20 WPM (1 string per 1.5s), 60% productive
  const goldPerSec = (BALANCE.GOLD_PER_STRING / 1.5 * BALANCE.PRODUCTIVE_MINING_FACTOR).toFixed(1);

  return { towers, boardCost, goldPerSec, gold: state.gold, baseHP: state.baseHP };
}
