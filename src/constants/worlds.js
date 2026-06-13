export const WORLDS = [
  { id: 1, name: 'The Dark Forest',   biome: 'forest',    color: '#2d6a2d', levels: 5 },
  { id: 2, name: 'Murky Swamp',       biome: 'swamp',     color: '#2a5c4a', levels: 5 },
  { id: 3, name: 'Frozen Wastes',     biome: 'snow',      color: '#5588aa', levels: 5 },
  { id: 4, name: 'Scorched Desert',   biome: 'desert',    color: '#cc7722', levels: 5 },
  { id: 5, name: 'The Badlands',      biome: 'badlands',  color: '#7a3d1a', levels: 5 },
  { id: 6, name: 'Tropical Shores',   biome: 'tropical',  color: '#4ab830', levels: 5 },
  { id: 7, name: 'Corrupted Realm',   biome: 'corrupted', color: '#8844ff', levels: 5 },
];

export const TOTAL_WORLDS = WORLDS.length;
export const LEVELS_PER_WORLD = 5;
export const TOTAL_LEVELS = TOTAL_WORLDS * LEVELS_PER_WORLD; // 35

export function getWorld(worldId) {
  return WORLDS.find(w => w.id === worldId);
}
