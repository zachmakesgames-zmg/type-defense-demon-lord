// ─── Renderer ────────────────────────────────────────────────────
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
    this.tileCache = cacheTileMap(mapData, assets);
  }

  render(state) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    ctx.clearRect(0, 0, W, H);

    if (this.tileCache) {
      ctx.drawImage(this.tileCache, 0, 0);
    } else {
      ctx.fillStyle = '#1a2a0e';
      ctx.fillRect(0, 0, W, H);
    }

    // Draw graves (persistent, beneath everything else)
    this.drawGraves(ctx, state);

    // Draw tower sites
    this.drawTowerSites(ctx, state);

    // Draw placed towers
    this.drawTowers(ctx, state);

    // Draw enemies
    this.drawEnemies(ctx, state);

    // Draw projectiles (above enemies)
    this.drawProjectiles(ctx, state);

    // Draw ghost effects (above projectiles)
    this.drawGhosts(ctx, state);

    // Draw keep and demon lord (above most things, near base)
    this.drawBase(ctx, state);
  }

  drawGraves(ctx, state) {
    const img = this.assets['grave'];
    if (!img) return;
    const size = 32;
    for (const grave of Object.values(state.graves)) {
      ctx.drawImage(img, grave.x - size / 2, grave.y - size / 2, size, size);
    }
  }

  drawTowerSites(ctx, state) {
    for (const site of state.sites) {
      if (site.tower) continue;

      const img = this.assets['tower_site'];
      if (img) {
        ctx.drawImage(img, site.x - TILE_SIZE / 2, site.y - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = '#ffffff08';
        ctx.fillRect(site.x - 24, site.y - 24, 48, 48);
        ctx.strokeStyle = '#77ff7744';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(site.x - 24, site.y - 24, 48, 48);
      }

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

      const assetKey = `tower_${towerDef.asset.replace('.png', '')}`;
      const img = this.assets[assetKey];

      if (img) {
        ctx.drawImage(img, site.x - TILE_SIZE / 2, site.y - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
      } else {
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

      ctx.fillStyle = '#ffffff44';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(site.code, site.x, site.y + 34);
    }
  }

  drawEnemies(ctx, state) {
    const t = state.gameTime;

    for (const enemy of state.enemies) {
      const pos = getPositionAlongPath(state.segments, state.totalLength, enemy.progress);

      // Wobble: subtle side-to-side + vertical bob to imply walking
      const wobbleX = Math.sin(t * 8 + enemy.id * 1.7) * 2;
      const wobbleY = Math.abs(Math.sin(t * 8 + enemy.id * 1.7)) * -2;
      const dx = pos.x + wobbleX;
      const dy = pos.y + wobbleY;

      // Shadow
      ctx.fillStyle = '#00000044';
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 14, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      const assetKey = `enemy_${enemy.type}`;
      const img = this.assets[assetKey];
      const size = enemy.type === 'siegeWeapon' ? 28 : 22;

      if (img) {
        if (enemy.flashTimer > 0) {
          ctx.globalAlpha = 0.5;
          ctx.drawImage(img, dx - size, dy - size, size * 2, size * 2);
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffffff88';
          ctx.beginPath();
          ctx.arc(dx, dy, size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.drawImage(img, dx - size, dy - size, size * 2, size * 2);
        }
      } else {
        // Fallback colored circle
        let color = '#e85d3f';
        if (enemy.type === 'knight') color = '#8888cc';
        else if (enemy.type === 'assassin') color = '#44aa66';
        else if (enemy.type === 'siegeWeapon') color = '#aa7733';
        else if (enemy.type === 'zeppelin') color = '#cc4444';
        if (enemy.flashTimer > 0) color = '#ffffff';
        else if (enemy.slowTimer > 0) color = '#cc88ff';
        else if (enemy.dotTimer > 0) color = '#88ff88';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(dx, dy, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // HP bar
      const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
      const barW = size * 1.6;
      const barH = 3;
      const barX = pos.x - barW / 2;
      const barY = pos.y - size - 8;
      ctx.fillStyle = '#222';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = hpPct > 0.5 ? '#44ff44' : hpPct > 0.25 ? '#ffff44' : '#ff4444';
      ctx.fillRect(barX, barY, barW * hpPct, barH);
    }
  }

  drawProjectiles(ctx, state) {
    for (const proj of state.projectiles) {
      const img = this.assets[proj.sprite];
      const size = 16;
      ctx.save();
      ctx.translate(proj.x, proj.y);
      ctx.rotate(proj.angle);
      if (img) {
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawGhosts(ctx, state) {
    const img = this.assets['ghost'];
    const size = 32;

    for (const effect of state.effects) {
      if (effect.type !== 'ghost') continue;
      const progress = 1 - effect.timer / effect.maxTimer; // 0→1
      const riseY = effect.y - progress * 40;             // rises 40px
      const alpha = 1 - progress;                          // fades out

      ctx.globalAlpha = alpha;
      if (img) {
        ctx.drawImage(img, effect.x - size / 2, riseY - size / 2, size, size);
      } else {
        ctx.fillStyle = '#aaaaff';
        ctx.beginPath();
        ctx.arc(effect.x, riseY, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  drawBase(ctx, state) {
    const bx = state.basePx.x;
    const by = state.basePx.y;
    const keepSize = TILE_SIZE * 2; // 128px

    // Keep sprite
    const keepImg = this.assets['keep'];
    if (keepImg) {
      ctx.drawImage(keepImg, bx - keepSize / 2, by - keepSize / 2, keepSize, keepSize);
    } else {
      const hpPct = Math.max(0, state.baseHP / 100);
      ctx.fillStyle = '#190a30';
      ctx.fillRect(bx - keepSize / 2, by - keepSize / 2, keepSize, keepSize);
      const borderColor = hpPct > 0.5 ? '#8866ff' : hpPct > 0.25 ? '#ffaa00' : '#ff4444';
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(bx - keepSize / 2, by - keepSize / 2, keepSize, keepSize);
      ctx.fillStyle = '#ccaaff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BASE', bx, by);
    }

    // Demon Lord stands directly below the keep
    const dlImg = this.assets['demon_lord'];
    const dlSize = TILE_SIZE;
    if (dlImg) {
      ctx.drawImage(dlImg, bx - dlSize / 2, by + keepSize / 2 - 8, dlSize, dlSize);
    }
  }
}
