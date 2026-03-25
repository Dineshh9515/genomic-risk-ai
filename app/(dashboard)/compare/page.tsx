"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import RiskGauge from "@/components/charts/RiskGauge";
import ShapWaterfall from "@/components/charts/ShapWaterfall";
import PencilDivider from "@/components/layout/PencilDivider";
import { GitCompare, ArrowRight } from "lucide-react";

export default function ComparePage() {
  const { analyses, compareIds, setCompareIds } = useAppStore();
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const analysis1 = analyses.find((a) => a.id === compareIds[0]) || analyses[0] || null;
  const analysis2 = analyses.find((a) => a.id === compareIds[1]) || analyses[1] || null;

  const diffGenes = analysis1 && analysis2
    ? analysis1.genes.filter((g) => !analysis2.genes.includes(g))
        .concat(analysis2.genes.filter((g) => !analysis1.genes.includes(g)))
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-headline text-3xl text-white mb-1">Patient Comparison</h2>
        <p className="font-annotation text-sticky-yellow/60 text-lg">
          side-by-side analysis comparison
        </p>
      </motion.div>

      {/* Selectors */}
      <div className="flex items-center gap-4">
        <select
          value={compareIds[0] || ""}
          onChange={(e) => setCompareIds([e.target.value, compareIds[1]])}
          className="flex-1 bg-base border border-dashed border-stitch-border rounded px-4 py-3 font-mono text-sm text-white outline-none"
        >
          <option value="">Select Patient 1</option>
          {analyses.map((a) => (
            <option key={a.id} value={a.id}>{a.patientLabel} — {(a.riskScore * 100).toFixed(1)}%</option>
          ))}
        </select>
        <GitCompare size={20} className="text-primary flex-shrink-0" />
        <select
          value={compareIds[1] || ""}
          onChange={(e) => setCompareIds([compareIds[0], e.target.value])}
          className="flex-1 bg-base border border-dashed border-stitch-border rounded px-4 py-3 font-mono text-sm text-white outline-none"
        >
          <option value="">Select Patient 2</option>
          {analyses.map((a) => (
            <option key={a.id} value={a.id}>{a.patientLabel} — {(a.riskScore * 100).toFixed(1)}%</option>
          ))}
        </select>
      </div>

      {/* Diff toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showDiffOnly}
          onChange={(e) => setShowDiffOnly(e.target.checked)}
          className="accent-primary"
        />
        <span className="font-mono text-sm text-neutral">Show only differing genes ({diffGenes.length})</span>
      </label>

      {/* Comparison panels */}
      {analysis1 && analysis2 ? (
        <div className="grid grid-cols-2 gap-6">
          {/* Panel 1 */}
          <div className="space-y-4">
            <div className="stitch-card p-6 text-center">
              <h3 className="font-mono text-sm text-neutral mb-3">{analysis1.patientLabel}</h3>
              <RiskGauge score={analysis1.riskScore} size={160} />
            </div>
            <div className="stitch-card p-4">
              <ShapWaterfall
                shapValues={showDiffOnly
                  ? analysis1.shapValues.filter((s) => diffGenes.includes(s.gene))
                  : analysis1.shapValues}
                finalScore={analysis1.riskScore}
              />
            </div>
            <div className="stitch-card p-4">
              <h4 className="font-mono text-sm text-neutral mb-2">Genes</h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis1.genes.map((g) => (
                  <span key={g} className={`px-2 py-1 stitch-card font-mono text-xs ${
                    diffGenes.includes(g) ? "text-danger border-danger/30" : "text-primary"
                  }`}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="space-y-4">
            <div className="stitch-card p-6 text-center">
              <h3 className="font-mono text-sm text-neutral mb-3">{analysis2.patientLabel}</h3>
              <RiskGauge score={analysis2.riskScore} size={160} />
            </div>
            <div className="stitch-card p-4">
              <ShapWaterfall
                shapValues={showDiffOnly
                  ? analysis2.shapValues.filter((s) => diffGenes.includes(s.gene))
                  : analysis2.shapValues}
                finalScore={analysis2.riskScore}
              />
            </div>
            <div className="stitch-card p-4">
              <h4 className="font-mono text-sm text-neutral mb-2">Genes</h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis2.genes.map((g) => (
                  <span key={g} className={`px-2 py-1 stitch-card font-mono text-xs ${
                    diffGenes.includes(g) ? "text-danger border-danger/30" : "text-primary"
                  }`}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="stitch-card p-12 text-center">
          <GitCompare size={40} className="text-primary/30 mx-auto mb-4" />
          <h3 className="font-headline text-xl text-white mb-2">Select Two Analyses</h3>
          <p className="font-mono text-sm text-neutral">
            Choose two patient analyses above to compare them side by side.
          </p>
        </div>
      )}
    </div>
  );
}
