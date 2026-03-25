"use client";

import { useRef, useEffect, useState } from "react";
import type { ShapValue } from "@/types/analysis";

interface ShapBeeswarmProps {
  shapValues: ShapValue[];
}

interface BeeswarmDot {
  gene: string;
  shapValue: number;
  featureValue: number;
  x: number;
  y: number;
}

export default function ShapBeeswarm({ shapValues }: ShapBeeswarmProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dots, setDots] = useState<BeeswarmDot[]>([]);
  const [hoveredDot, setHoveredDot] = useState<BeeswarmDot | null>(null);
  const [mounted, setMounted] = useState(false);

  const width = 700;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 60, left: 120 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    // Generate synthetic beeswarm data points
    const generatedDots: BeeswarmDot[] = [];
    shapValues.forEach((sv) => {
      const numDots = 15 + Math.floor(Math.random() * 10);
      for (let i = 0; i < numDots; i++) {
        const baseShap = sv.value;
        const jitteredShap = baseShap + (Math.random() - 0.5) * Math.abs(baseShap) * 1.5;
        const featureValue = Math.random();
        generatedDots.push({
          gene: sv.gene,
          shapValue: jitteredShap,
          featureValue,
          x: 0,
          y: 0,
        });
      }
    });

    // Calculate positions
    const genes = shapValues.map((s) => s.gene);
    const maxShap = Math.max(...generatedDots.map((d) => Math.abs(d.shapValue)), 0.5);
    const yScale = (gene: string) => {
      const idx = genes.indexOf(gene);
      return margin.top + (idx / (genes.length - 1 || 1)) * plotHeight;
    };
    const xScale = (val: number) => margin.left + ((val + maxShap) / (2 * maxShap)) * plotWidth;

    const positioned = generatedDots.map((d) => ({
      ...d,
      x: xScale(d.shapValue),
      y: yScale(d.gene) + (Math.random() - 0.5) * 12,
    }));

    setDots(positioned);
    setTimeout(() => setMounted(true), 100);
  }, [shapValues, plotWidth, plotHeight, margin.left, margin.top]);

  const genes = shapValues.map((s) => s.gene);
  const maxShap = Math.max(...dots.map((d) => Math.abs(d.shapValue)), 0.5);

  const getColor = (featureValue: number) => {
    // Low = cyan, High = amber
    const r = Math.round(0 + featureValue * 255);
    const g = Math.round(217 - featureValue * 110);
    const b = Math.round(255 - featureValue * 200);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg text-white">SHAP Beeswarm</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: "#00D9FF" }} />
            <span className="font-mono text-xs text-neutral">Low feature value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: "#FF6B35" }} />
            <span className="font-mono text-xs text-neutral">High feature value</span>
          </div>
        </div>
      </div>

      <svg ref={svgRef} width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
        {/* Zero line */}
        <line
          x1={margin.left + plotWidth / 2}
          y1={margin.top - 10}
          x2={margin.left + plotWidth / 2}
          y2={height - margin.bottom + 10}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1}
          strokeDasharray="4,4"
        />

        {/* Gene labels */}
        {genes.map((gene, i) => (
          <text
            key={gene}
            x={margin.left - 8}
            y={margin.top + (i / (genes.length - 1 || 1)) * plotHeight}
            textAnchor="end"
            dominantBaseline="middle"
            className="font-mono"
            fill="#8892A4"
            fontSize={11}
          >
            {gene}
          </text>
        ))}

        {/* X-axis label */}
        <text x={width / 2} y={height - 10} textAnchor="middle" fill="#8892A4" fontSize={11} className="font-mono">
          SHAP value (impact on model output)
        </text>

        {/* X-axis ticks */}
        {[-maxShap, -maxShap / 2, 0, maxShap / 2, maxShap].map((val) => (
          <g key={val}>
            <text
              x={margin.left + ((val + maxShap) / (2 * maxShap)) * plotWidth}
              y={height - margin.bottom + 24}
              textAnchor="middle"
              fill="#555"
              fontSize={10}
            >
              {val.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Dots */}
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={mounted ? dot.x : width / 2}
            cy={mounted ? dot.y : height / 2}
            r={3.5}
            fill={getColor(dot.featureValue)}
            opacity={0.75}
            style={{
              transition: `cx 0.8s ease ${i * 2}ms, cy 0.8s ease ${i * 2}ms`,
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredDot(dot)}
            onMouseLeave={() => setHoveredDot(null)}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredDot && (
        <div
          className="absolute stitch-card p-3 pointer-events-none z-50"
          style={{
            left: hoveredDot.x,
            top: hoveredDot.y - 60,
          }}
        >
          <p className="font-mono text-xs text-white">{hoveredDot.gene}</p>
          <p className="font-mono text-xs text-neutral">
            SHAP: <span style={{ color: hoveredDot.shapValue > 0 ? "#FF6B35" : "#00FFA3" }}>
              {hoveredDot.shapValue > 0 ? "+" : ""}{hoveredDot.shapValue.toFixed(3)}
            </span>
          </p>
          <p className="font-mono text-xs text-neutral">
            Feature: {hoveredDot.featureValue.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
