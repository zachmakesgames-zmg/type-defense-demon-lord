export const WORLDS = [
  { id: 1, name: 'The Dark Forest',   biome: 'forest',    landTile: 'Land_Grass',       color: '#2d6a2d', levels: 5,
    scenery: ['Scenery_Tree', 'Scenery_PineTree', 'Scenery_Rock', 'Scenery_Well'] },
  { id: 2, name: 'Murky Swamp',       biome: 'swamp',     landTile: 'Land_Swamp',       color: '#2a5c4a', levels: 5,
    scenery: ['Scenery_SwampStump', 'Scenery_AcidPool'] },
  { id: 3, name: 'Frozen Wastes',     biome: 'snow',      landTile: 'Land_Snow',        color: '#5588aa', levels: 5,
    scenery: ['Scenery_SnowPine', 'Scenery_SnowRock', 'Scenery_PineTree'] },
  { id: 4, name: 'Scorched Desert',   biome: 'desert',    landTile: 'Land_Desert',      color: '#cc7722', levels: 5,
    scenery: ['Scenery_CactusBig', 'Scenery_CactusSmall', 'Scenery_Crater', 'Scenery_Well'] },
  { id: 5, name: 'The Badlands',      biome: 'badlands',  landTile: 'Land_RedWaste',    color: '#7a3d1a', levels: 5,
    scenery: ['Scenery_Rock', 'Scenery_Crater', 'Scenery_Skull', 'Scenery_Weapons'] },
  { id: 6, name: 'Tropical Shores',   biome: 'tropical',  landTile: 'Land_Tropical',    color: '#4ab830', levels: 5,
    scenery: ['Scenery_TropicalTree', 'Scenery_TropicalBush', 'Scenery_TropicalRock'] },
  { id: 7, name: 'Corrupted Realm',   biome: 'corrupted', landTile: 'Land_PurpleWaste', color: '#8844ff', levels: 5,
    scenery: ['Scenery_AcidPool', 'Scenery_Skull', 'Scenery_Weapons', 'Scenery_Rock'] },
];

export const TOTAL_WORLDS = WORLDS.length;
export const LEVELS_PER_WORLD = 5;
export const TOTAL_LEVELS = TOTAL_WORLDS * LEVELS_PER_WORLD; // 35

export function getWorld(worldId) {
  return WORLDS.find(w => w.id === worldId);
}
