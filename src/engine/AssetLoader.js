// ─── Asset Loader ────────────────────────────────────────────────
const imageCache = new Map();

function loadImage(path) {
  if (imageCache.has(path)) return Promise.resolve(imageCache.get(path));
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { imageCache.set(path, img); resolve(img); };
    img.onerror = () => { console.warn(`Failed to load: ${path}`); resolve(null); };
    img.src = path;
  });
}

export async function loadLevelAssets(worldDef, onProgress) {
  const manifest = buildManifest(worldDef);
  const total = manifest.length;
  let loaded = 0;
  const results = {};
  for (const { key, path } of manifest) {
    results[key] = await loadImage(path);
    loaded++;
    if (onProgress) onProgress(loaded / total);
  }
  return results;
}

function buildManifest(worldDef) {
  const items = [];
  const { landTile, id: worldId } = worldDef;

  // Ground tile (fills every cell)
  items.push({ key: 'tile_ground',       path: `/assets/land/${landTile}.png` });
  // Road tiles (drawn on top of ground)
  items.push({ key: 'tile_road_straight', path: `/assets/land/Road_Straight.png` });
  items.push({ key: 'tile_road_corner',   path: `/assets/land/Road_Curve.png` });

  // Tower sprites
  const towers = [
    ['tower_skeleton_archer',  'Tower_Skeleton'],
    ['tower_molten_geyser',    'Tower_Geyser'],
    ['tower_dragon_perch',     'Tower_Dragon'],
    ['tower_tree_of_dead',     'Tower_Tree'],
    ['tower_gravity_well',     'Tower_GravityWell'],
    ['tower_lightning_warlock','Tower_Wizard'],
  ];
  for (const [key, file] of towers) {
    items.push({ key, path: `/assets/towers/${file}.png` });
  }

  // Projectile sprites
  const projectiles = [
    ['proj_arrow',     'Projectile_Arrow'],
    ['proj_fire',      'Projectile_Fire'],
    ['proj_gas',       'Projectile_Gas'],
    ['proj_lightning', 'Projectile_Lightning'],
    ['proj_rock',      'Projectile_Rock'],
  ];
  for (const [key, file] of projectiles) {
    items.push({ key, path: `/assets/towers/${file}.png` });
  }

  // Enemy unit sprites
  const enemies = [
    ['enemy_soldier',     'Unit_Pesant'],
    ['enemy_knight',      'Unit_Knight'],
    ['enemy_assassin',    'Unit_Rogue'],
    ['enemy_siegeWeapon', 'Unit_Calvary'],
    ['enemy_zeppelin',    'Unit_Wizard'],
  ];
  for (const [key, file] of enemies) {
    items.push({ key, path: `/assets/enemies/${file}.png` });
  }

  // Death / grave effects
  items.push({ key: 'ghost', path: '/assets/enemies/Ghost.png' });
  items.push({ key: 'grave', path: '/assets/enemies/Grave.png' });

  // Construction site marker
  items.push({ key: 'tower_site', path: '/assets/enemies/Construction_Site.png' });

  // Keep and Demon Lord (world-specific)
  items.push({ key: 'keep',       path: `/assets/keeps/Keep_L${worldId}.png` });
  items.push({ key: 'demon_lord', path: `/assets/demon_lord/DemonLord_L${worldId}.png` });

  return items;
}

export function getAsset(assets, key) {
  return assets[key] || null;
}

export default { loadLevelAssets, getAsset };
