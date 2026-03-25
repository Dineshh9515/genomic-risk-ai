"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/types/analysis";
import RiskGauge from "@/components/charts/RiskGauge";
import ShapWaterfall from "@/components/charts/ShapWaterfall";
import ShapBeeswarm from "@/components/charts/ShapBeeswarm";
import EpistasisMatrix from "@/components/charts/EpistasisMatrix";
import VariantSuggestions from "@/components/analysis/VariantSuggestions";
import PencilDivider from "@/components/layout/PencilDivider";
import { GENE_INFO } from "@/lib/mock-data";
import { ExternalLink } from "lucide-react";

interface RiskReportProps {
  analysis: AnalysisResult;
}

export default function RiskReport({ analysis }: RiskReportProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center gap-6"
      >
        <RiskGauge score={analysis.riskScore} size={180} />
        <div>
          <h2 className="font-headline text-2xl text-white mb-1">{analysis.patientLabel}</h2>
          <p className="font-mono text-sm text-neutral mb-3">
            {analysis.genes.length} genes analyzed · {Object.keys(analysis.snps).length} SNPs ·{" "}
            {analysis.epistasisPairs.length} epistasis pairs
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.genes.map((gene) => (
              <span key={gene} className="px-2 py-1 stitch-card font-mono text-xs text-primary">
                {gene}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <PencilDivider />

      {/* SHAP Waterfall */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="stitch-card p-6"
      >
        <ShapWaterfall shapValues={analysis.shapValues} finalScore={analysis.riskScore} />
      </motion.section>

      {/* SHAP Beeswarm */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="stitch-card p-6"
      >
        <ShapBeeswarm shapValues={analysis.shapValues} />
      </motion.section>

      <PencilDivider />

      {/* Per-Gene Bio Mapping ("sticky note" cards) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-lg text-white">Gene Biological Mapping</h3>
          <span className="font-annotation text-sticky-yellow/60 text-sm">
            annotated by our research team
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.shapValues.slice(0, 9).map((sv, i) => {
            const info = GENE_INFO[sv.gene];
            return (
              <motion.div
                key={sv.gene}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="sticky-note p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-white font-medium">{sv.gene}</span>
                  <span
                    className="font-mono text-xs px-2 py-0.5 rounded"
                    style={{
                      background: sv.value > 0 ? "rgba(255,107,53,0.15)" : "rgba(0,255,163,0.15)",
                      color: sv.value > 0 ? "#FF6B35" : "#00FFA3",
                    }}
                  >
                    {sv.value > 0 ? "+" : ""}{sv.value.toFixed(3)}
                  </span>
                </div>
                <p className="font-annotation text-sm text-sticky-yellow/80 mb-2 leading-relaxed">
                  {sv.description}
                </p>
                <div className="flex items-center gap-2 text-neutral/50">
                  <span className="font-mono text-[10px]">{sv.pathway}</span>
                  {info && (
                    <a
                      href={`https://www.uniprot.org/uniprot/${info.uniprotId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <PencilDivider />

      {/* Epistasis Matrix */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="stitch-card p-6"
      >
        <EpistasisMatrix
          pairs={analysis.epistasisPairs}
          genes={analysis.genes.slice(0, 8)}
        />
      </motion.section>

      <PencilDivider />

      {/* Variant Suggestions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <VariantSuggestions suggestions={analysis.variantSuggestions} />
      </motion.section>
    </div>
  );
}
