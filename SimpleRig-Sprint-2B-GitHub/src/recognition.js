function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
}

function flattenPoint(point, view) {
  if (view === "front") return { x: point.x, y: point.z };
  if (view === "left") return { x: point.y, y: point.z };
  return { x: point.x, y: point.y };
}

function bounds(points) {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return {
    minX, minY, maxX, maxY,
    width: Math.max(0.0001, maxX - minX),
    height: Math.max(0.0001, maxY - minY),
    centre: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
  };
}

function pathLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += distance(points[i - 1], points[i]);
  return total;
}

function perpendicularDistance(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const denom = dx * dx + dy * dy;
  if (!denom) return distance(point, lineStart);
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / denom;
  const px = lineStart.x + t * dx;
  const py = lineStart.y + t * dy;
  return Math.hypot(point.x - px, point.y - py);
}

function straightness(points) {
  if (points.length < 2) return 0;
  const start = points[0];
  const end = points[points.length - 1];
  const direct = distance(start, end);
  const travelled = pathLength(points);
  if (!travelled) return 0;
  const ratio = direct / travelled;
  const maxDeviation = Math.max(...points.map(p => perpendicularDistance(p, start, end)));
  const b = bounds(points);
  const diagonal = Math.hypot(b.width, b.height);
  const deviationScore = diagonal ? Math.max(0, 1 - maxDeviation / (diagonal * 0.18)) : 0;
  return Math.max(0, Math.min(1, ratio * 0.65 + deviationScore * 0.35));
}

function circleMetrics(points) {
  if (points.length < 8) return { score: 0, closure: 0, radialConsistency: 0 };
  const b = bounds(points);
  const centre = b.centre;
  const radii = points.map(p => Math.hypot(p.x - centre.x, p.y - centre.y));
  const mean = radii.reduce((a, b) => a + b, 0) / radii.length;
  if (!mean) return { score: 0, closure: 0, radialConsistency: 0 };
  const variance = radii.reduce((sum, r) => sum + (r - mean) ** 2, 0) / radii.length;
  const std = Math.sqrt(variance);
  const radialConsistency = Math.max(0, 1 - std / (mean * 0.42));
  const closureDistance = distance(points[0], points[points.length - 1]);
  const closure = Math.max(0, 1 - closureDistance / (mean * 1.1));
  const aspect = Math.min(b.width, b.height) / Math.max(b.width, b.height);
  const circumference = 2 * Math.PI * mean;
  const lengthFit = Math.max(0, 1 - Math.abs(pathLength(points) - circumference) / circumference);
  const score = radialConsistency * 0.4 + closure * 0.3 + aspect * 0.2 + lengthFit * 0.1;
  return { score: Math.max(0, Math.min(1, score)), closure, radialConsistency, centre, mean, bounds: b };
}

function rectangleMetrics(points) {
  if (points.length < 6) return { score: 0 };
  const b = bounds(points);
  const perimeter = 2 * (b.width + b.height);
  const length = pathLength(points);
  const closure = Math.max(0, 1 - distance(points[0], points[points.length - 1]) / Math.max(b.width, b.height));
  const perimeterFit = Math.max(0, 1 - Math.abs(length - perimeter) / perimeter);
  const aspect = Math.min(b.width, b.height) / Math.max(b.width, b.height);
  const score = closure * 0.45 + perimeterFit * 0.35 + Math.min(1, aspect * 1.8) * 0.2;
  return { score: Math.max(0, Math.min(1, score)), bounds: b };
}

export function recogniseStroke(stroke) {
  const raw = stroke?.points || [];
  if (raw.length < 2) return null;
  const points = raw.map(p => flattenPoint(p, stroke.view));
  const b = bounds(points);
  const size = Math.max(b.width, b.height);
  if (size < 0.12) return null;

  const lineScore = straightness(points);
  const circle = circleMetrics(points);
  const rectangle = rectangleMetrics(points);

  const candidates = [
    {
      type: "rigLine",
      label: "Rig line",
      confidence: lineScore,
      meta: { start: raw[0], end: raw[raw.length - 1] }
    },
    {
      type: "pulley",
      label: "Pulley",
      confidence: circle.score,
      meta: { centre2D: circle.centre, radius: circle.mean }
    },
    {
      type: "winch",
      label: "Winch",
      confidence: rectangle.score,
      meta: { bounds: rectangle.bounds }
    }
  ].sort((a, b) => b.confidence - a.confidence);

  const best = candidates[0];
  if (!best || best.confidence < 0.58) return null;
  return {
    ...best,
    confidence: Math.round(best.confidence * 100),
    strokeId: stroke.id,
    view: stroke.view,
    bounds: b
  };
}

export function recogniseRecentStrokes(strokes, maxAgeCount = 3) {
  const recent = strokes.slice(-maxAgeCount);
  const circleLike = recent
    .map(stroke => ({ stroke, result: recogniseStroke(stroke) }))
    .filter(item => item.result?.type === "pulley" && item.result.confidence >= 68);

  if (circleLike.length >= 2) {
    const a = circleLike[circleLike.length - 2];
    const b = circleLike[circleLike.length - 1];
    if (a.stroke.view === b.stroke.view) {
      const pa = flattenPoint(a.stroke.points[0], a.stroke.view);
      const pb = flattenPoint(b.stroke.points[0], b.stroke.view);
      const ba = bounds(a.stroke.points.map(p => flattenPoint(p, a.stroke.view)));
      const bb = bounds(b.stroke.points.map(p => flattenPoint(p, b.stroke.view)));
      const centreA = ba.centre, centreB = bb.centre;
      const radiusA = Math.max(ba.width, ba.height) / 2;
      const radiusB = Math.max(bb.width, bb.height) / 2;
      const separation = Math.hypot(centreA.x - centreB.x, centreA.y - centreB.y);
      if (separation < (radiusA + radiusB) * 1.7 && separation > Math.min(radiusA, radiusB) * 0.25) {
        return {
          type: "doublePulley",
          label: "Double pulley",
          confidence: Math.min(96, Math.round((a.result.confidence + b.result.confidence) / 2)),
          strokeIds: [a.stroke.id, b.stroke.id],
          view: a.stroke.view
        };
      }
    }
  }
  return null;
}
