"use client";

import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number; // 0.0 to 1.0
  size?: number;
  showLabel?: boolean;
}

export default function RiskGauge({ score, size = 200, showLabel = true }: RiskGaugeProps) {
  const clampedScore = Math.max(0, Math.min(1, score));
  const percentage = clampedScore * 100;

  // Arc calculations
  const radius = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;
  const scoreAngle = startAngle + totalAngle * clampedScore;

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function describeArc(start: number, end: number) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const getColor = () => {
    if (clampedScore < 0.25) return "#00FFA3";
    if (clampedScore < 0.5) return "#00D9FF";
    if (clampedScore < 0.75) return "#FF6B35";
    return "#FF3232";
  };

  const getCategory = () => {
    if (clampedScore < 0.25) return "LOW";
    if (clampedScore < 0.5) return "MODERATE";
    if (clampedScore < 0.75) return "HIGH";
    return "CRITICAL";
  };

  const color = getColor();
  const strokeW = size > 100 ? 8 : 4;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />

        {/* Score arc - animated */}
        <motion.path
          d={describeArc(startAngle, scoreAngle)}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 6px ${color}80)`,
          }}
        />

        {/* Glow dot at end */}
        {clampedScore > 0 && (
          <motion.circle
            cx={polarToCartesian(scoreAngle).x}
            cy={polarToCartesian(scoreAngle).y}
            r={strokeW / 2 + 2}
            fill={color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        )}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-headline"
          style={{ fontSize: size > 100 ? size * 0.2 : size * 0.25, color }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {percentage.toFixed(1)}
        </motion.span>
        {showLabel && size > 100 && (
          <>
            <span className="font-mono text-neutral" style={{ fontSize: size * 0.06 }}>
              % risk
            </span>
            <span
              className="font-mono font-medium mt-1"
              style={{ fontSize: size * 0.05, color }}
            >
              {getCategory()}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
