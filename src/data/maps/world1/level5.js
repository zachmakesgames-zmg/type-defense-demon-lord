// ─── World 1 Level 5 Map ─────────────────────────────────────
const G  = { type: 'ground', rotation: 0 };
const RV = { type: 'road_straight', rotation: 0 };
const RH = { type: 'road_straight', rotation: 90 };
const C1 = { type: 'road_corner', rotation: 0 };      // └
const C2 = { type: 'road_corner', rotation: 90 };     // ┘
const C3 = { type: 'road_corner', rotation: 180 };    // ┐
const C4 = { type: 'road_corner', rotation: 270 };    // ┌

const grid = [
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, C4, RH, RH, RH, RH, RH, RH, RH, RH, RH, C3, G, G, G],
  [G, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G],
  [G, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G, G],
  [RH, RH, C2, G, G, G, G, G, G, G, G, G, RV, G, G, G],
  [G, G, G, G, G, G, C4, RH, RH, RH, C3, G, C1, RH, C3, G],
  [G, G, G, C4, RH, RH, C2, G, G, G, RV, G, G, G, RV, G],
  [G, G, G, RV, G, G, G, G, G, G, RV, G, C4, RH, C2, G],
  [G, G, G, RV, G, G, G, G, G, G, RV, G, RV, G, G, G],
  [G, G, G, RV, G, G, G, G, G, G, G, G, RV, G, G, G],
  [G, G, G, RV, G, G, G, G, G, G, G, G, RV, G, G, G],
  [G, G, G, RV, G, C4, RH, C3, G, G, G, G, RV, G, G, G],
  [G, G, G, RV, G, RV, G, RV, G, G, G, G, RV, G, G, G],
  [G, G, G, C1, RH, C2, G, C1, RH, RH, RH, RH, C2, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
];

const level5 = {
  world: 1,
  level: 5,
  biome: 'forest',
  grid,
  road: [
    { x: 0, y: 288 },
    { x: 160, y: 288 },
    { x: 160, y: 96 },
    { x: 800, y: 96 },
    { x: 800, y: 352 },
    { x: 928, y: 352 },
    { x: 928, y: 480 },
    { x: 800, y: 480 },
    { x: 800, y: 864 },
    { x: 480, y: 864 },
    { x: 480, y: 736 },
    { x: 352, y: 736 },
    { x: 352, y: 864 },
    { x: 224, y: 864 },
    { x: 224, y: 416 },
    { x: 416, y: 416 },
    { x: 416, y: 352 },
    { x: 672, y: 352 },
    { x: 672, y: 544 }
  ],
  towerSites: [
    { gx: 5, gy: 2 },
    { gx: 10, gy: 2 },
    { gx: 13, gy: 2 },
    { gx: 3, gy: 5 },
    { gx: 11, gy: 5 },
    { gx: 7, gy: 6 },
    { gx: 13, gy: 6 },
    { gx: 11, gy: 9 },
    { gx: 2, gy: 10 },
    { gx: 6, gy: 12 }
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level5;
