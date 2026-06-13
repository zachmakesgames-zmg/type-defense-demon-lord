// Tower stat scale conversions
// Rate of Fire: 1 = fires every 2s, each +1 reduces by 0.2s
export const rofToSeconds = (r) => 2.0 - (r - 1) * 0.2;

// Range: 1 = 2 meters = 64px (2 tiles), 10 = 20 meters = 640px
export const rangeToPixels = (r) => r * 2 * 32;

// Damage: 1 = 10 damage, 10 = 50 damage (linear interpolation)
export const damageToHP = (d) => 10 + (d - 1) * (40 / 9);

// Cost: 1 = 100g, 10 = 1000g (linear)
export const costFromStat = (c) => c * 100;

// Splash range uses same scale as Range
export const splashToPixels = (s) => s * 2 * 32;

export const TOWERS = {
  archer: {
    id: 'archer',
    name: 'Skeleton Archers',
    description: 'Basic archer tower made of bones and leather, occupied by a skeleton archer.',
    rof: 5,
    range: 7,
    damage: 3,
    costStat: 1,
    cost: 100,
    splash: 0,
    dot: 0,
    aoe: false,
    slow: 0,
    color: '#c8a96e',
    label: 'ARCHER',
    asset: 'skeleton_archer.png',
    projectileSprite: 'proj_arrow',
    projectileSpeed: 350,
  },
  geyser: {
    id: 'geyser',
    name: 'Molten Rock Geyser',
    description: 'Small volcanic crater that launches molten rocks which detonate on impact.',
    rof: 1,
    range: 6,
    damage: 7,
    costStat: 3,
    cost: 300,
    splash: 2,
    dot: 0,
    aoe: false,
    slow: 0,
    color: '#ff6535',
    label: 'GEYSER',
    asset: 'molten_geyser.png',
    projectileSprite: 'proj_rock',
    projectileSpeed: 280,
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon Perch',
    description: 'Dragon perched atop a rock. Breathes fireballs at nearby enemies.',
    rof: 5,
    range: 2,
    damage: 2,
    costStat: 3,
    cost: 300,
    splash: 1,
    dot: 5,
    aoe: false,
    slow: 0,
    isFlame: true, // Flame damage ignores Siege Weapon defense
    color: '#cc3333',
    label: 'DRAGON',
    asset: 'dragon_perch.png',
    projectileSprite: 'proj_fire',
    projectileSpeed: 400,
  },
  tree: {
    id: 'tree',
    name: 'Tree of the Dead',
    description: 'A twisted tree glowing green. Poisonous fog poisons all enemies in range.',
    rof: 10,
    range: 5,
    damage: 1,
    costStat: 5,
    cost: 500,
    splash: 0,
    dot: 5,
    aoe: true,
    slow: 0,
    color: '#33cc66',
    label: 'TREE',
    asset: 'tree_of_dead.png',
    projectileSprite: 'proj_gas',
    projectileSpeed: 200,
  },
  gravity: {
    id: 'gravity',
    name: 'Gravity Well',
    description: 'A black hole emitting magenta radiation. Slows enemies within range by 50%.',
    rof: 10,
    range: 5,
    damage: 0,
    costStat: 5,
    cost: 500,
    splash: 0,
    dot: 0,
    aoe: true,
    slow: 0.5, // 50% speed reduction
    color: '#9933ff',
    label: 'GRAVITY',
    asset: 'gravity_well.png',
  },
  warlock: {
    id: 'warlock',
    name: 'Lightning Warlock',
    description: 'Dark-robed figure atop a crooked stone tower. Fires chain lightning.',
    rof: 4,
    range: 8,
    damage: 9,
    costStat: 10,
    cost: 1000,
    splash: 2,
    dot: 0,
    aoe: false,
    slow: 0,
    color: '#4488ff',
    label: 'WARLOCK',
    asset: 'lightning_warlock.png',
    projectileSprite: 'proj_lightning',
    projectileSpeed: 500,
  },
};

export const TOWER_KEYS = Object.keys(TOWERS);
export const TOWER_LIST = Object.values(TOWERS);
