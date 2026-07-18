// ─── World 1 Level 3 Map ─────────────────────────────────────
const G  = { type: 'ground', rotation: 0 };
const RV = { type: 'road_straight', rotation: 0 };
const RH = { type: 'road_straight', rotation: 90 };
const C1 = { type: 'road_corner', rotation: 0 };      // └
const C2 = { type: 'road_corner', rotation: 90 };     // ┘
const C3 = { type: 'road_corner', rotation: 180 };    // ┐
const C4 = { type: 'road_corner', rotation: 270 };    // ┌

const grid = [
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, C4, RH, RH, RH, RH, RH, RH, C3, G, G, G, G, G, G, G],
  [G, RV, G, G, G, G, G, G, RV, G, G, G, G, G, G, G],
  [G, RV, G, G, G, G, G, G, RV, G, G, G, G, G, G, G],
  [G, RV, G, G, G, C4, RH, RH, C2, G, G, G, G, G, G, G],
  [G, RV, G, G, G, RV, G, G, G, G, G, G, G, G, G, G],
  [G, RV, G, G, G, RV, G, G, G, G, G, G, G, G, G, G],
  [G, RV, G, G, G, G, G, G, G, G, G, C4, RH, RH, RH, RH],
  [G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G, G],
  [G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G, G],
  [G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G, G],
  [G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G, G],
  [G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G, G],
  [G, C1, RH, RH, RH, RH, RH, RH, RH, RH, RH, C2, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
];

const level3 = {
  world: 1,
  level: 3,
  biome: 'forest',
  grid,
  road: [
    { x: 1024, y: 544 },
    { x: 736, y: 544 },
    { x: 736, y: 928 },
    { x: 96, y: 928 },
    { x: 96, y: 160 },
    { x: 544, y: 160 },
    { x: 544, y: 352 },
    { x: 352, y: 352 },
    { x: 352, y: 480 }
  ],
  towerSites: [
    { gx: 4, gy: 1 },
    { gx: 2, gy: 3 },
    { gx: 5, gy: 4 },
    { gx: 9, gy: 4 },
    { gx: 3, gy: 7 },
    { gx: 12, gy: 9 },
    { gx: 2, gy: 13 },
    { gx: 6, gy: 13 },
    { gx: 7, gy: 13 },
    { gx: 10, gy: 13 }
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level3;
