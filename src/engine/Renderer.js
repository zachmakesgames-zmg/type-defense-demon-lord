// ─── Renderer ────────────────────────────────────────────────────
// Draws the full game frame to the canvas each tick

import { TOWERS, rangeToPixels } from '../constants/towers.js';
import { getPositionAlongPath } from '../utils/pathfinding.js';
import { TILE_SIZE, MAP_SIZE, cacheTileMap } from './TileMap.js';

export class Renderer {
  constructor(canvas, mapData, assets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assets = assets;
    this.mapData = mapData;
    this.tileCache = null;

    // Build tile map cache
    this.tileCache = cacheTileMap(mapData, assets);
  }

  render(state) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Draw cached tile map background
    if (this.tileCache) {
      ctx.drawImage(this.tileCache, 0, 0);
    } else {
      ctx.fillStyle = '#1a2a0e';
      ctx.fillRect(0, 0, W, H);
    }

    // Draw road path (fallback visual on top of tiles) if assets are missing
    const hasRoadAssets = this.assets['tile_road_straight'] && this.assets['tile_road_corner'];
    if (!hasRoadAssets) {
      this.drawRoadPath(ctx, state);
    }

    // Draw tower sites
    this.drawTowerSites(ctx, state);

    // Draw placed towers
    this.drawTowers(ctx, state);

    // Draw enemies
    this.drawEnemies(ctx, state);

    // Draw base
    this.drawBase(ctx, state);
  }

  drawRoadPath(ctx, state) {
    if (!state.road || state.road.length < 2) return;

    // Draw road as layered strokes for depth (like the prototype)
    const drawRoad = (width, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(state.road[0].x, state.road[0].y);
      for (let i = 1; i < state.road.length; i++) {
        ctx.lineTo(state.road[i].x, state.road[i].y);
      }
      ctx.stroke();
    };

    // Layered road effect
    drawRoad(48, '#1e0d06');   // dark border
    drawRoad(40, '#3a2510');   // main road
    drawRoad(36, '#4a3018');   // lighter center

    // Dashed center line
    ctx.strokeStyle = '#6a502888';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([14, 12]);
    ctx.beginPath();
    ctx.moveTo(state.road[0].x, state.road[0].y);
    for (let i = 1; i < state.road.length; i++) {
      ctx.lineTo(state.road[i].x, state.road[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawTowerSites(ctx, state) {
    for (const site of state.sites) {
      if (site.tower) continue; // Occupied sites drawn in drawTowers

      const img = this.assets['tower_site'];
      if (img) {
        ctx.drawImage(img, site.x - TILE_SIZE / 2, site.y - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
      } else {
        // Fallback: glowing green square
        ctx.fillStyle = '#ffffff08';
        ctx.fillRect(site.x - 24, site.y - 24, 48, 48);
        ctx.strokeStyle = '#77ff7744';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(site.x - 24, site.y - 24, 48, 48);
      }

      // Draw code
      ctx.fillStyle = '#88ff88';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(site.code, site.x, site.y);
    }
  }

  drawTowers(ctx, state) {
    for (const site of state.sites) {
      if (!site.tower) continue;

      const towerDef = TOWERS[site.tower.type];
      if (!towerDef) continue;

      // Range ring (subtle)
      const rangePx = rangeToPixels(towerDef.range);
      ctx.fillStyle = towerDef.color + '0a';
      ctx.beginPath();
      ctx.arc(site.x, site.y, rangePx, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = towerDef.color + '20';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(site.x, site.y, rangePx, 0, Math.PI * 2);
      ctx.stroke();

      // Tower sprite
      const assetKey = `tower_${towerDef.asset.replace('.png', '')}`;
      const img = this.assets[assetKey];

      if (img) {
        ctx.drawImage(img, site.x - TILE_SIZE / 2, site.y - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
      } else {
        // Fallback: colored square with label
        ctx.fillStyle = '#1e0d36';
        ctx.fillRect(site.x - 24, site.y - 24, 48, 48);
        ctx.strokeStyle = towerDef.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(site.x - 24, site.y - 24, 48, 48);

        ctx.fillStyle = towerDef.color;
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(towerDef.label, site.x, site.y);
      }

      // Code below tower (smaller, dimmer)
      ctx.fillStyle = '#ffffff44';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(site.code, site.x, site.y + 34);
    }
  }

  drawEnemies(ctx, state) {
    for (const enemy of state.enemies) {
      const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);

      // Shadow
      ctx.fillStyle = '#00000044';
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 12, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Enemy sprite
      const assetKey = `enemy_${enemy.type}`;
      const img = this.assets[assetKey];
      const size = enemy.type === 'siegeWeapon' ? 28 : enemy.type === 'zeppelin' ? 24 : 20;

      if (img) {
        // Apply flash tint
        if (enemy.flashTimer > 0) {
          ctx.globalAlpha = 0.5;
          ctx.drawImage(img, pos.x - size, pos.y - size, size * 2, size * 2);
          ctx.globalAlpha = 1;
          // White overlay
          ctx.fillStyle = '#ffffff88';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.drawImage(img, pos.x - size, pos.y - size, size * 2, size * 2);
        }
      } else {
        // Fallback: colored circle
        let color = '#e85d3f'; // soldier default
        if (enemy.type === 'knight') color = '#8888cc';
        else if (enemy.type === 'assassin') color = '#44aa66';
        else if (enemy.type === 'siegeWeapon') color = '#aa7733';
        else if (enemy.type === 'zeppelin') color = '#cc4444';

        if (enemy.flashTimer > 0) color = '#ffffff';
        else if (enemy.slowTimer > 0) color = '#cc88ff';
        else if (enemy.dotTimer > 0) color = '#88ff88';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff22';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // HP bar
      const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
      const barW = size * 1.6;
      const barH = 3;
      const barX = pos.x - barW / 2;
      const barY = pos.y - size - 6;

      ctx.fillStyle = '#222';
      ctx.fillRect(barX, barY, barW, barH);

      ctx.fillStyle = hpPct > 0.5 ? '#44ff44' : hpPct > 0.25 ? '#ffff44' : '#ff4444';
      ctx.fillRect(barX, barY, barW * hpPct, barH);
    }
  }

  drawBase(ctx, state) {
    const bx = state.basePx.x;
    const by = state.basePx.y;
    const baseSize = TILE_SIZE * 2; // 128px for 2×2 base

    const img = this.assets['base'];
    if (img) {
      ctx.drawImage(img, bx - baseSize / 2, by - baseSize / 2, baseSize, baseSize);
    } else {
      // Fallback: colored square
      const hpPct = Math.max(0, state.baseHP / 100);
      ctx.fillStyle = '#190a30';
      ctx.fillRect(bx - baseSize / 2, by - baseSize / 2, baseSize, baseSize);

      const borderColor = hpPct > 0.5 ? '#8866ff' : hpPct > 0.25 ? '#ffaa00' : '#ff4444';
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(bx - baseSize / 2, by - baseSize / 2, baseSize, baseSize);

      ctx.fillStyle = '#ccaaff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BASE', bx, by);
    }
  }
}
