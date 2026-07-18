// ─── World 1 Level 1 Map ─────────────────────────────────────
const G  = { type: 'ground', rotation: 0 };
const RV = { type: 'road_straight', rotation: 0 };
const RH = { type: 'road_straight', rotation: 90 };
const C1 = { type: 'road_corner', rotation: 0 };      // └
const C2 = { type: 'road_corner', rotation: 90 };     // ┘
const C3 = { type: 'road_corner', rotation: 180 };    // ┐
const C4 = { type: 'road_corner', rotation: 270 };    // ┌

const grid = [
  [G, RV, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, RV, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, RV, G, G, G, G, G, G, G, C4, RH, RH, RH, C3, G, G],
  [G, RV, G, G, G, G, G, G, G, RV, G, G, G, RV, G, G],
  [G, RV, G, C4, RH, RH, RH, RH, RH, C2, G, G, G, RV, G, G],
  [G, RV, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G],
  [G, RV, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G],
  [G, RV, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G],
  [G, RV, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G],
  [G, RV, G, RV, G, G, G, G, G, G, G, G, G, RV, G, G],
  [G, RV, G, RV, G, G, G, RV, G, G, G, G, G, RV, G, G],
  [G, C1, RH, C2, G, G, G, RV, G, G, G, G, G, RV, G, G],
  [G, G, G, G, G, G, G, C1, RH, RH, RH, RH, RH, C2, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
  [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
];

const level1 = {
  world: 1,
  level: 1,
  biome: 'forest',
  grid,
  road: [
    { x: 96, y: 0 },
    { x: 96, y: 736 },
    { x: 224, y: 736 },
    { x: 224, y: 288 },
    { x: 608, y: 288 },
    { x: 608, y: 160 },
    { x: 864, y: 160 },
    { x: 864, y: 800 },
    { x: 480, y: 800 },
    { x: 480, y: 672 }
  ],
  towerSites: [
    { gx: 4, gy: 3 },
    { gx: 8, gy: 3 },
    { gx: 11, gy: 4 },
    { gx: 0, gy: 6 },
    { gx: 14, gy: 6 },
    { gx: 2, gy: 9 },
    { gx: 5, gy: 10 },
    { gx: 11, gy: 10 },
    { gx: 8, gy: 11 },
    { gx: 14, gy: 13 }
  ],
  basePosition: { gx: 7, gy: 7 },
};

export default level1;
