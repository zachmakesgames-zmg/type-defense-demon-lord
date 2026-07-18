import { BALANCE } from '../config/balance.js';

const { CELL_PX } = BALANCE;
const B = BALANCE.TOWER;

// range stat (cells) → pixels
export const rangeToPixels = (r) => r * CELL_PX;

// rate-of-fire stat → seconds between shots
export const rofToSeconds = (r) => 2.2 - 0.2 * r;

// damage stat → HP dealt per hit
export const damageToHP = (d) => 10 + (d - 1) * (40 / 9);

// splash stat (cells) → pixels
export const splashToPixels = (s) => s * CELL_PX;

export const TOWERS = {
  archer: {
    id: 'archer',
    name: 'Skeleton Archers',
    description: 'Basic archer tower. Reliable single-target damage.',
    ...B.archer,
    color: '#c8a96e',
    label: 'ARCHER',
    asset: 'skeleton_archer.png',
    projectileSprite: 'proj_arrow',
    projectileSpeed: 350,
  },
  geyser: {
    id: 'geyser',
    name: 'Molten Rock Geyser',
    description: 'Launches molten rocks that detonate on impact.',
    ...B.geyser,
    color: '#ff6535',
    label: 'GEYSER',
    asset: 'molten_geyser.png',
    projectileSprite: 'proj_rock',
    projectileSpeed: 280,
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon Perch',
    description: 'Point-blank flame. Devastates armored siege weapons.',
    ...B.dragon,
    color: '#cc3333',
    label: 'DRAGON',
    asset: 'dragon_perch.png',
    projectileSprite: 'proj_fire',
    projectileSpeed: 400,
  },
  tree: {
    id: 'tree',
    name: 'Tree of the Dead',
    description: 'Poison cloud damages all nearby enemies. Pierces armor.',
    ...B.tree,
    color: '#33cc66',
    label: 'TREE',
    asset: 'tree_of_dead.png',
    projectileSprite: 'proj_gas',
    projectileSpeed: 200,
  },
  gravity: {
    id: 'gravity',
    name: 'Gravity Well',
    description: 'Slows all nearby enemies by 50%.',
    ...B.gravity,
    color: '#9933ff',
    label: 'GRAVITY',
    asset: 'gravity_well.png',
  },
  warlock: {
    id: 'warlock',
    name: 'Lightning Warlock',
    description: 'Long-range chain lightning. The capstone tower.',
    ...B.warlock,
    color: '#4488ff',
    label: 'WARLOCK',
    asset: 'lightning_warlock.png',
    projectileSprite: 'proj_lightning',
    projectileSpeed: 500,
  },
};

export const TOWER_KEYS = Object.keys(TOWERS);
export const TOWER_LIST = Object.values(TOWERS);
