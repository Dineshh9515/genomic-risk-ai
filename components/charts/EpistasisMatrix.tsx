"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EpistasisPair } from "@/types/analysis";

interface EpistasisMatrixProps {
  pairs: EpistasisPair[];
  genes: string[];
}

export default function EpistasisMatrix({ pairs, genes }: EpistasisMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<EpistasisPair | null>(null);

  const getScore = (g1: string, g2: string): number => {
    const pair = pairs.find(
      (p) => (p.gene1 === g1 && p.gene2 === g2) || (p.gene1 === g2 && p.gene2 === g1)
    );
    return pair?.interactionScore || 0;
  };

  const getPair = (g1: string, g2: string): EpistasisPair | undefined => {
    return pairs.find(
      (p) => (p.gene1 === g1 && p.gene2 === g2) || (p.gene1 === g2 && p.gene2 === g1)
    );
  };

  const getHeatColor = (score: number): string => {
    if (score === 0) return "rgba(255,255,255,0.02)";
    if (score < 0.3) return `rgba(0,217,255,${score})`;
    if (score < 0.6) return `rgba(255,107,53,${score * 0.8})`;
    return `rgba(255,50,50,${Math.min(score, 0.9)})`;
  };

  const cellSize = 60;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg text-white">Epistasis Interaction Matrix</h3>
        <span className="font-annotation text-sticky-yellow/60 text-sm">
          click a cell to see interaction details
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Column headers */}
          <div className="flex" style={{ paddingLeft: 100 }}>
            {genes.map((gene) => (
              <div
                key={`col-${gene}`}
                className="flex items-end justify-center font-mono text-[10px] text-neutral"
                style={{ width: cellSize, height: 60 }}
              >
                <span className="transform -rotate-45 origin-bottom-left whitespace-nowrap">
                  {gene}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {genes.map((rowGene, ri) => (
            <div key={rowGene} className="flex items-center">
              {/* Row label */}
              <div className="w-[100px] text-right pr-3 flex-shrink-0">
                <span className="font-mono text-xs text-neutral">{rowGene}</span>
              </div>

              {/* Cells */}
              {genes.map((colGene, ci) => {
                const score = ri === ci ? 1 : getScore(rowGene, colGene);
                const pair = ri !== ci ? getPair(rowGene, colGene) : undefined;
                const isDiagonal = ri === ci;

                return (
                  <motion.div
                    key={`${rowGene}-${colGene}`}
                    className={`flex items-center justify-center border border-panel-border ${
                      isDiagonal ? "" : "cursor-pointer"
                    }`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      background: isDiagonal
                        ? "repeating-linear-gradient(45deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 2px, transparent 2px, transparent 6px)"
                        : getHeatColor(score),
                    }}
                    whileHover={!isDiagonal && score > 0 ? { scale: 1.1, zIndex: 10 } : {}}
                    onClick={() => pair && setSelectedCell(pair)}
                  >
                    {!isDiagonal && score > 0 && (
                      <span className="font-mono text-[10px] text-white/80">
                        {score.toFixed(2)}
                      </span>
                    )}
                    {isDiagonal && (
                      <span className="font-mono text-[10px] text-neutral/30">—</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCell(null)}
          >
            <motion.div
              className="stitch-card p-8 max-w-lg w-full mx-4"
              style={{ background: "rgba(13,15,20,0.95)" }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-headline text-xl text-white mb-2">
                {selectedCell.gene1} × {selectedCell.gene2}
              </h3>
              <p className="font-annotation text-sticky-yellow/70 text-sm mb-6">
                {selectedCell.pathway}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="stitch-card p-4">
                  <p className="font-mono text-xs text-neutral mb-1">Interaction Score</p>
                  <p className="font-headline text-2xl text-primary">
                    {selectedCell.interactionScore.toFixed(2)}
                  </p>
                </div>
                <div className="stitch-card p-4">
                  <p className="font-mono text-xs text-neutral mb-1">Combined Risk Delta</p>
                  <p
                    className="font-headline text-2xl"
                    style={{
                      color: selectedCell.combinedRiskDelta > 0 ? "#FF6B35" : "#00FFA3",
                    }}
                  >
                    {selectedCell.combinedRiskDelta > 0 ? "+" : ""}
                    {selectedCell.combinedRiskDelta.toFixed(2)}
                  </p>
                </div>
              </div>

              <p className="font-mono text-sm text-neutral">
                Replacing both alleles reduces combined risk score from{" "}
                <span className="text-danger">
                  {(0.5 + selectedCell.combinedRiskDelta).toFixed(2)}
                </span>{" "}
                to <span className="text-safe">0.50</span>
              </p>

              <button
                onClick={() => setSelectedCell(null)}
                className="btn-outline mt-6 w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
