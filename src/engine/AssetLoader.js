// ─── Asset Loader ────────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL; // e.g. '/type-defense-demon-lord/' on GitHub Pages
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
  items.push({ key: 'tile_ground',       path: `${BASE}assets/land/${landTile}.png` });
  // Road tiles (drawn on top of ground)
  items.push({ key: 'tile_road_straight', path: `${BASE}assets/land/Road_Straight.png` });
  items.push({ key: 'tile_road_corner',   path: `${BASE}assets/land/Road_Curve.png` });

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
    items.push({ key, path: `${BASE}assets/towers/${file}.png` });
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
    items.push({ key, path: `${BASE}assets/towers/${file}.png` });
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
    items.push({ key, path: `${BASE}assets/enemies/${file}.png` });
  }

  // Scenery decorations (biome-specific)
  for (const name of (worldDef.scenery || [])) {
    items.push({ key: `scenery_${name}`, path: `${BASE}assets/scenery/${name}.png` });
  }

  // Death / grave effects
  items.push({ key: 'ghost', path: `${BASE}assets/enemies/Ghost.png` });
  items.push({ key: 'grave', path: `${BASE}assets/enemies/Grave.png` });

  // Construction site marker
  items.push({ key: 'tower_site', path: `${BASE}assets/enemies/Construction_Site.png` });

  // Keep and Demon Lord (world-specific)
  items.push({ key: 'keep',       path: `${BASE}assets/keeps/Keep_L${worldId}.png` });
  items.push({ key: 'demon_lord', path: `${BASE}assets/demon_lord/DemonLord_L${worldId}.png` });

  return items;
}

export function getAsset(assets, key) {
  return assets[key] || null;
}

export default { loadLevelAssets, getAsset };
