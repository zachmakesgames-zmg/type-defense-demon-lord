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

    // Draw dragon breath tiles (below enemies so fire appears under units)
    this.drawDragonBreaths(ctx, state);

    // Draw enemies
    this.drawEnemies(ctx, state);

    // Draw projectiles (above enemies)
    this.drawProjectiles(ctx, state);

    // Draw ghost effects (above projectiles)
    this.drawGhosts(ctx, state);

    // Draw keep and demon lord (above most things, near base)
    this.drawBase(ctx, state);

    // Dev debug overlay — backtick toggle, never visible in production
    if (state.debugMode) this.drawDebugOverlay(ctx, state);
  }

  drawGraves(ctx, state) {
    const img = this.assets['grave'];
    const size = 48;
    for (const grave of Object.values(state.graves)) {
      if (img) {
        ctx.drawImage(img, grave.x - size / 2, grave.y - size / 2, size, size);
      } else {
        // Fallback cross marker
        ctx.strokeStyle = '#888866';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(grave.x, grave.y - 12); ctx.lineTo(grave.x, grave.y + 12);
        ctx.moveTo(grave.x - 8, grave.y - 6); ctx.lineTo(grave.x + 8, grave.y - 6);
        ctx.stroke();
      }
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

      // Code text — large, outlined for legibility over the construction tile
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000000cc';
      ctx.lineWidth = 4;
      ctx.strokeText(site.code, site.x, site.y);
      ctx.fillStyle = '#ffff00';
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

  drawDragonBreaths(ctx, state) {
    const t = state.gameTime;
    const fireImg = this.assets['proj_fire'];

    for (const site of state.sites) {
      if (!site.tower?.breathTile || site.tower.breathTimer <= 0) continue;
      const { gx, gy } = site.tower.breathTile;

      // Tile center (target)
      const tx = gx * TILE_SIZE + TILE_SIZE / 2;
      const ty = gy * TILE_SIZE + TILE_SIZE / 2;
      // Tower center (source)
      const sx = site.x;
      const sy = site.y;

      const dx = tx - sx;
      const dy = ty - sy;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      ctx.save();

      // Fire stream — 6 sprites flowing from tower toward tile
      const NUM_SPRITES = 6;
      const SPRITE_SIZE = 28;
      for (let i = 0; i < NUM_SPRITES; i++) {
        // Each sprite travels along the beam; offset animates forward over time
        const frac = ((i / NUM_SPRITES) + (t * 3) % 1) % 1;
        const bx = sx + dx * frac;
        const by = sy + dy * frac;

        // Fade out near source, bright near target
        const alpha = 0.4 + frac * 0.6;
        const scale = 0.6 + frac * 0.6;
        const sz = SPRITE_SIZE * scale;

        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(angle);
        if (fireImg) {
          ctx.drawImage(fireImg, -sz / 2, -sz / 2, sz, sz);
        } else {
          ctx.fillStyle = `hsl(${20 + frac * 20}, 100%, ${50 + frac * 20}%)`;
          ctx.beginPath();
          ctx.arc(0, 0, sz / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Tile impact glow
      const pulse = 0.6 + 0.4 * Math.sin(t * 25);
      ctx.globalAlpha = pulse * 0.7;
      ctx.fillStyle = '#ff4400';
      ctx.fillRect(gx * TILE_SIZE, gy * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.globalAlpha = pulse * 0.35;
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(gx * TILE_SIZE + 6, gy * TILE_SIZE + 6, TILE_SIZE - 12, TILE_SIZE - 12);

      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  drawEnemies(ctx, state) {
    const t = state.gameTime;

    // Sort so lower-y enemies (closer to screen bottom) draw last = on top
    const sorted = [...state.enemies].sort((a, b) => {
      const pa = getPositionAlongPath(state.segments, state.totalLength, a.progress);
      const pb = getPositionAlongPath(state.segments, state.totalLength, b.progress);
      return pa.y - pb.y;
    });

    for (const enemy of sorted) {
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
    const size = 56;

    for (const effect of state.effects) {
      if (effect.type !== 'ghost') continue;
      const progress = 1 - effect.timer / effect.maxTimer; // 0→1 over lifetime
      const riseY = effect.y - progress * 60;              // rises 60px
      const alpha = Math.max(0, 1 - progress * 1.2);       // fades out

      ctx.globalAlpha = alpha;
      if (img) {
        ctx.drawImage(img, effect.x - size / 2, riseY - size / 2, size, size);
      } else {
        ctx.fillStyle = '#ccccff';
        ctx.beginPath();
        ctx.arc(effect.x, riseY, 18, 0, Math.PI * 2);
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

  drawDebugOverlay(ctx, state) {
    const d = state.debugData;
    if (!d) return;
    const rows = d.towers.length;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.fillRect(4, 4, 344, 30 + rows * 18 + 22);
    ctx.font = '13px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`[DEBUG] gold:${Math.floor(d.gold)}  HP:${Math.floor(d.baseHP)}  g/s≈${d.goldPerSec}`, 10, 10);
    let y = 28;
    for (const t of d.towers) {
      ctx.fillStyle = '#ffff66';
      ctx.fillText(`  ${t.type.padEnd(8)} DPS:${t.dps}  cost:${t.cost}`, 10, y);
      y += 18;
    }
    ctx.fillStyle = '#aaffff';
    ctx.fillText(`boardCost: ${d.boardCost}`, 10, y);
    ctx.restore();
  }
}
