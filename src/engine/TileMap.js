// ─── Tile Map ────────────────────────────────────────────────────
// Renders a 16×16 grid of 64×64 tiles to canvas.
// Each tile is { type: string, rotation: 0|90|180|270 }

export const GRID_SIZE = 16;
export const TILE_SIZE = 64;
export const MAP_SIZE = GRID_SIZE * TILE_SIZE; // 1024

// Tile types
export const TILE_TYPES = {
  GROUND: 'ground',
  DECORATION: 'decoration',
  BOULDER: 'boulder',
  ROAD_STRAIGHT: 'road_straight',
  ROAD_CORNER: 'road_corner',
};

// Convert grid coordinates to pixel coordinates (center of tile)
export function gridToPixel(gx, gy) {
  return {
    x: gx * TILE_SIZE + TILE_SIZE / 2,
    y: gy * TILE_SIZE + TILE_SIZE / 2,
  };
}

// Convert pixel coordinates to grid coordinates
export function pixelToGrid(px, py) {
  return {
    gx: Math.floor(px / TILE_SIZE),
    gy: Math.floor(py / TILE_SIZE),
  };
}

// Render the full tile map to a canvas context
export function renderTileMap(ctx, mapData, assets) {
  for (let gy = 0; gy < GRID_SIZE; gy++) {
    for (let gx = 0; gx < GRID_SIZE; gx++) {
      const tile = mapData.grid[gy]?.[gx];
      if (!tile) continue;

      const px = gx * TILE_SIZE;
      const py = gy * TILE_SIZE;

      // Draw ground under road tiles first
      if (tile.type === 'road_straight' || tile.type === 'road_corner') {
        const groundImg = assets['tile_ground'];
        if (groundImg) {
          ctx.drawImage(groundImg, px, py, TILE_SIZE, TILE_SIZE);
        }
      }

      const img = assets[`tile_${tile.type}`];
      if (img) {
        if (tile.rotation && tile.rotation !== 0) {
          // Rotate around tile center
          ctx.save();
          ctx.translate(px + TILE_SIZE / 2, py + TILE_SIZE / 2);
          ctx.rotate((tile.rotation * Math.PI) / 180);
          ctx.drawImage(img, -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
          ctx.restore();
        } else {
          ctx.drawImage(img, px, py, TILE_SIZE, TILE_SIZE);
        }
      } else {
        // Fallback: draw colored rectangle
        renderFallbackTile(ctx, tile, px, py);
      }
    }
  }
}

// Cache the tile map to an offscreen canvas for performance
export function cacheTileMap(mapData, assets) {
  const offscreen = document.createElement('canvas');
  offscreen.width = MAP_SIZE;
  offscreen.height = MAP_SIZE;
  const ctx = offscreen.getContext('2d');

  // Fill background with dark ground color
  ctx.fillStyle = '#1a1a0e';
  ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

  renderTileMap(ctx, mapData, assets);
  return offscreen;
}

// Fallback rendering when images aren't available
function renderFallbackTile(ctx, tile, px, py) {
  const colors = {
    ground: '#2d5a1e',
    decoration: '#1e4a15',
    boulder: '#3a3a2a',
    road_straight: '#5a4a30',
    road_corner: '#5a4a30',
  };

  ctx.fillStyle = colors[tile.type] || '#2d5a1e';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Draw grid line
  ctx.strokeStyle = '#ffffff08';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

  // Visual indicator for road tiles
  if (tile.type === 'road_straight' || tile.type === 'road_corner') {
    ctx.fillStyle = '#6a5a40';
    if (tile.type === 'road_straight') {
      // Vertical road by default
      const roadWidth = TILE_SIZE * 0.6;
      const offset = (TILE_SIZE - roadWidth) / 2;
      ctx.save();
      if (tile.rotation === 90 || tile.rotation === 270) {
        ctx.fillRect(px, py + offset, TILE_SIZE, roadWidth);
      } else {
        ctx.fillRect(px + offset, py, roadWidth, TILE_SIZE);
      }
      ctx.restore();
    } else {
      // Corner: bottom-right by default
      const roadWidth = TILE_SIZE * 0.6;
      const offset = (TILE_SIZE - roadWidth) / 2;
      ctx.fillRect(px + offset, py + offset, roadWidth, roadWidth);
    }
  }

  // Decoration indicator
  if (tile.type === 'decoration') {
    ctx.fillStyle = '#0a3a06';
    ctx.beginPath();
    ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Boulder indicator
  if (tile.type === 'boulder') {
    ctx.fillStyle = '#555544';
    ctx.beginPath();
    ctx.ellipse(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
