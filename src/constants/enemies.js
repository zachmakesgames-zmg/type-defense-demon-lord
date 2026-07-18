import { BALANCE } from '../config/balance.js';

const E = BALANCE.ENEMY;

export const ENEMIES = {
  soldier: {
    id: 'soldier',
    name: 'Soldier',
    description: 'Standard human infantry unit.',
    ...E.soldier,
    asset: 'soldier.png',
    introducedWorld: 1,
  },
  knight: {
    id: 'knight',
    name: 'Knight',
    description: 'Heavily armored human warrior. Vulnerable to poison.',
    ...E.knight,
    asset: 'knight.png',
    introducedWorld: 3,
  },
  assassin: {
    id: 'assassin',
    name: 'Assassin',
    description: 'Swift elven striker. Slow it down.',
    ...E.assassin,
    asset: 'assassin.png',
    introducedWorld: 4,
  },
  siegeWeapon: {
    id: 'siegeWeapon',
    name: 'Siege Weapon',
    description: 'Gnome-engineered war machine. Highly flammable.',
    ...E.siegeWeapon,
    asset: 'siege_weapon.png',
    introducedWorld: 5,
  },
  zeppelin: {
    id: 'zeppelin',
    name: 'Zeppelin Bomber',
    description: 'Dwarf airship. Immune to ground effects.',
    ...E.zeppelin,
    asset: 'zeppelin.png',
    introducedWorld: 6,
  },
};

export function getEnemyTypesForWorld(worldNum) {
  return Object.values(ENEMIES).filter(e => e.introducedWorld <= worldNum);
}

// Speed in meters/sec → pixels/sec (32 px = 1 m)
export const speedToPixels = (metersPerSec) => metersPerSec * 32;
