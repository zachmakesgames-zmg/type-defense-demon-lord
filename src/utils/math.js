// ─── Math Utilities ──────────────────────────────────────────────

// Euclidean distance between two points
export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Clamp value between min and max
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Linear interpolation
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Angle from point a to point b in radians
export function angleBetween(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

// Random integer from min (inclusive) to max (exclusive)
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Pick a random element from an array
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
