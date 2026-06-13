// ─── Asset Loader ────────────────────────────────────────────────
// Pre-loads all images for a given biome/level before gameplay starts.

const imageCache = new Map();

function loadImage(path) {
  if (imageCache.has(path)) {
    return Promise.resolve(imageCache.get(path));
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(path, img);
      resolve(img);
    };
    img.onerror = () => {
      console.warn(`Failed to load image: ${path}`);
      // Return a placeholder instead of failing
      resolve(null);
    };
    img.src = path;
  });
}

// Load all assets needed for a level
export async function loadLevelAssets(biome, onProgress) {
  const manifest = buildManifest(biome);
  const total = manifest.length;
  let loaded = 0;

  const results = {};

  for (const { key, path } of manifest) {
    const img = await loadImage(path);
    results[key] = img;
    loaded++;
    if (onProgress) onProgress(loaded / total);
  }

  return results;
}

function buildManifest(biome) {
  const items = [];

  // Terrain tiles
  const tileTypes = ['ground', 'decoration', 'boulder', 'road_straight', 'road_corner'];
  for (const type of tileTypes) {
    items.push({
      key: `tile_${type}`,
      path: `/assets/tiles/${biome}/${type}.png`,
    });
  }

  // Towers
  const towerFiles = [
    'skeleton_archer', 'molten_geyser', 'dragon_perch',
    'tree_of_dead', 'gravity_well', 'lightning_warlock',
  ];
  for (const name of towerFiles) {
    items.push({
      key: `tower_${name}`,
      path: `/assets/towers/${name}.png`,
    });
  }

  // Enemies
  const enemyFiles = ['soldier', 'knight', 'assassin', 'siege_weapon', 'zeppelin'];
  for (const name of enemyFiles) {
    items.push({
      key: `enemy_${name}`,
      path: `/assets/enemies/${name}.png`,
    });
  }

  // Base
  items.push({ key: 'base', path: '/assets/base/base.png' });

  // Tower site marker
  items.push({ key: 'tower_site', path: '/assets/ui/tower_site.png' });

  return items;
}

// Get a cached image by key
export function getAsset(assets, key) {
  return assets[key] || null;
}

export default { loadLevelAssets, getAsset };
