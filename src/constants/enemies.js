export const ENEMIES = {
  soldier: {
    id: 'soldier',
    name: 'Soldier',
    description: 'Standard human infantry unit.',
    hp: 60,
    speed: 1.5, // meters per second
    defense: 0, // percentage of incoming damage blocked
    immunities: [],
    asset: 'soldier.png',
    introducedWorld: 1, // Worlds 1-2
  },
  knight: {
    id: 'knight',
    name: 'Knight',
    description: 'Heavily armored human warrior.',
    hp: 200,
    speed: 0.8,
    defense: 0.25, // 25% damage blocked
    immunities: [],
    asset: 'knight.png',
    introducedWorld: 3,
  },
  assassin: {
    id: 'assassin',
    name: 'Assassin',
    description: 'Swift elven striker that slips through gaps in defenses.',
    hp: 35,
    speed: 3.5,
    defense: 0,
    immunities: [],
    asset: 'assassin.png',
    introducedWorld: 4,
  },
  siegeWeapon: {
    id: 'siegeWeapon',
    name: 'Siege Weapon',
    description: 'Gnome-engineered armored war machine. Nearly impervious, but highly flammable.',
    hp: 500,
    speed: 0.4,
    defense: 0.5, // 50% damage blocked
    immunities: [],
    flameWeakness: true, // Dragon Perch flame ignores defense entirely
    asset: 'siege_weapon.png',
    introducedWorld: 5,
  },
  zeppelin: {
    id: 'zeppelin',
    name: 'Zeppelin Bomber',
    description: 'Dwarf-built airship impervious to ground effects.',
    hp: 80,
    speed: 2.0,
    defense: 0,
    immunities: ['gravity', 'tree', 'geyser'], // Immune to Gravity Well, Tree of Dead, Molten Rock Geyser
    asset: 'zeppelin.png',
    introducedWorld: 6,
  },
};

// Which enemy types are available per world
export function getEnemyTypesForWorld(worldNum) {
  const types = [];
  for (const enemy of Object.values(ENEMIES)) {
    if (enemy.introducedWorld <= worldNum) {
      types.push(enemy);
    }
  }
  return types;
}

// Speed in meters/sec → pixels/sec (1 meter = 32px per design doc)
export const speedToPixels = (metersPerSec) => metersPerSec * 32;
