// ─── Path Utilities ──────────────────────────────────────────────
// A road is defined as a list of waypoints [{x, y}, ...] in pixel coordinates.
// Enemies travel along the road from waypoint[0] to waypoint[last].

// Pre-compute road segments with cumulative distances
export function buildSegments(waypoints) {
  const segments = [];
  let cumulative = 0;

  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i].x - waypoints[i - 1].x;
    const dy = waypoints[i].y - waypoints[i - 1].y;
    const len = Math.hypot(dx, dy);
    segments.push({
      x0: waypoints[i - 1].x,
      y0: waypoints[i - 1].y,
      x1: waypoints[i].x,
      y1: waypoints[i].y,
      length: len,
      cumulative,
    });
    cumulative += len;
  }

  return { segments, totalLength: cumulative };
}

// Get pixel position along a road given progress (0 to totalLength)
export function getPositionAlongPath(segments, totalLength, progress) {
  const p = Math.max(0, Math.min(progress, totalLength));

  for (const seg of segments) {
    if (p <= seg.cumulative + seg.length) {
      const t = (p - seg.cumulative) / seg.length;
      return {
        x: seg.x0 + (seg.x1 - seg.x0) * t,
        y: seg.y0 + (seg.y1 - seg.y0) * t,
      };
    }
  }

  // Past the end — return final waypoint
  const last = segments[segments.length - 1];
  return { x: last.x1, y: last.y1 };
}

// Get direction (angle in radians) at a given progress point along a road
export function getDirectionAlongPath(segments, totalLength, progress) {
  const p = Math.max(0, Math.min(progress, totalLength));

  for (const seg of segments) {
    if (p <= seg.cumulative + seg.length) {
      return Math.atan2(seg.y1 - seg.y0, seg.x1 - seg.x0);
    }
  }

  const last = segments[segments.length - 1];
  return Math.atan2(last.y1 - last.y0, last.x1 - last.x0);
}
