"use client";

import { motion } from "framer-motion";
import type { ShapValue } from "@/types/analysis";

interface ShapWaterfallProps {
  shapValues: ShapValue[];
  finalScore: number;
}

export default function ShapWaterfall({ shapValues, finalScore }: ShapWaterfallProps) {
  const sorted = [...shapValues].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const maxAbsValue = Math.max(...sorted.map((v) => Math.abs(v.value)), 0.01);
  const barMaxWidth = 280;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg text-white">SHAP Waterfall</h3>
        <span className="font-annotation text-sticky-yellow/60 text-sm">
          feature attribution breakdown
        </span>
      </div>

      {sorted.map((sv, i) => {
        const isPositive = sv.value > 0;
        const barWidth = (Math.abs(sv.value) / maxAbsValue) * barMaxWidth;

        return (
          <motion.div
            key={sv.gene}
            initial={{ opacity: 0, x: isPositive ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-3 py-2 group"
          >
            {/* Gene label */}
            <div className="w-24 text-right flex-shrink-0">
              <span className="font-mono text-sm text-neutral group-hover:text-white transition-colors">
                {sv.gene}
              </span>
            </div>

            {/* Bar area - centered */}
            <div className="flex-1 relative" style={{ height: 32 }}>
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10" />

              {/* Bar */}
              <motion.div
                className="absolute top-1 bottom-1 rounded"
                style={{
                  width: barWidth,
                  left: isPositive ? "50%" : `calc(50% - ${barWidth}px)`,
                  background: isPositive
                    ? "linear-gradient(90deg, #FF6B35, #FF9A5C)"
                    : "linear-gradient(90deg, #00D9FF, #00FFA3)",
                  boxShadow: isPositive
                    ? "0 0 12px rgba(255,107,53,0.3)"
                    : "0 0 12px rgba(0,217,255,0.3)",
                }}
                initial={{ width: 0 }}
                animate={{ width: barWidth }}
                transition={{ delay: i * 0.08 + 0.2, duration: 0.5, ease: "easeOut" }}
              />

              {/* Annotation */}
              <motion.span
                className="absolute font-annotation text-xs"
                style={{
                  top: -14,
                  left: isPositive ? "52%" : `calc(48% - ${barWidth}px)`,
                  color: isPositive ? "#FF9A5C" : "#00FFA3",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: i * 0.08 + 0.5 }}
              >
                {isPositive ? "↑" : "↓"} {sv.gene} {isPositive ? "pushed risk" : "reduced risk"}{" "}
                {isPositive ? "+" : ""}
                {sv.value.toFixed(2)}
              </motion.span>
            </div>

            {/* Value */}
            <div className="w-16 flex-shrink-0">
              <span
                className="font-mono text-sm font-medium"
                style={{ color: isPositive ? "#FF6B35" : "#00FFA3" }}
              >
                {isPositive ? "+" : ""}
                {sv.value.toFixed(3)}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Final score line */}
      <motion.div
        className="flex items-center gap-3 pt-4 mt-4 border-t border-dashed border-stitch-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: sorted.length * 0.08 + 0.5 }}
      >
        <div className="w-24 text-right">
          <span className="font-mono text-sm text-primary font-medium">Final Score</span>
        </div>
        <div className="flex-1 relative h-8">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"
            style={{
              left: `calc(50% + ${((finalScore - 0.5) / 0.5) * (barMaxWidth / 2)}px)`,
              boxShadow: "0 0 12px rgba(0,217,255,0.6), 0 0 24px rgba(0,217,255,0.3)",
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="w-16 flex-shrink-0">
          <span className="font-headline text-lg text-primary">{(finalScore * 100).toFixed(1)}%</span>
        </div>
      </motion.div>
    </div>
  );
}
