// StitchEdge — SVG edge renderer with stitch pattern
// Used within the KnowledgeGraph component as a visual element

interface StitchEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  color?: string;
}

export default function StitchEdge({ x1, y1, x2, y2, confidence, color = "#00D9FF" }: StitchEdgeProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const tickSpacing = 15;
  const numTicks = Math.floor(length / tickSpacing);
  const angle = Math.atan2(dy, dx);
  const perpAngle = angle + Math.PI / 2;
  const tickLength = 4;

  const ticks = [];
  for (let i = 1; i <= numTicks; i++) {
    const t = (i * tickSpacing) / length;
    const cx = x1 + t * dx;
    const cy = y1 + t * dy;
    ticks.push({
      x1: cx + Math.cos(perpAngle) * tickLength,
      y1: cy + Math.sin(perpAngle) * tickLength,
      x2: cx - Math.cos(perpAngle) * tickLength,
      y2: cy - Math.sin(perpAngle) * tickLength,
    });
  }

  return (
    <g>
      {/* Main dashed line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={1 + confidence * 2}
        strokeDasharray="6,4"
        strokeOpacity={confidence * 0.7}
        filter="url(#sketch-filter-subtle)"
      />
      {/* Perpendicular tick marks (stitch pattern) */}
      {ticks.map((tick, i) => (
        <line
          key={i}
          x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2}
          stroke={color}
          strokeWidth={1}
          strokeOpacity={confidence * 0.5}
        />
      ))}
    </g>
  );
}
