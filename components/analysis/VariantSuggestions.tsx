"use client";

import { motion } from "framer-motion";
import type { VariantSuggestion } from "@/types/analysis";
import { ArrowRight, Shield, AlertTriangle } from "lucide-react";

interface VariantSuggestionsProps {
  suggestions: VariantSuggestion[];
}

export default function VariantSuggestions({ suggestions }: VariantSuggestionsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg text-white">Variant Suggestions</h3>
        <span className="font-annotation text-sticky-yellow/60 text-sm">
          epistasis-aware allele recommendations
        </span>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={suggestion.gene}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stitch-card overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-dashed border-panel-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-white font-medium">{suggestion.gene}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  suggestion.clinicalSignificance === "Pathogenic" ? "badge-high" :
                  suggestion.clinicalSignificance === "Protective" ? "badge-low" : "badge-moderate"
                }`}>
                  {suggestion.clinicalSignificance}
                </span>
              </div>
              <span className="font-mono text-xs text-safe">
                -{(suggestion.riskReduction * 100).toFixed(0)}% risk
              </span>
            </div>

            {/* Before → After */}
            <div className="flex items-stretch">
              {/* Current (danger side) */}
              <div className="flex-1 p-5" style={{ background: "rgba(255,107,53,0.04)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-danger" />
                  <span className="font-mono text-xs text-danger/70">CURRENT ALLELE</span>
                </div>
                <p className="font-mono text-lg text-white mb-1">{suggestion.currentAllele}</p>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #FF6B35, #FF9A5C)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(suggestion.riskReduction + 0.5) * 100}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                  />
                </div>
              </div>

              {/* Arrow center */}
              <div className="flex items-center justify-center px-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={20} className="text-primary" />
                </motion.div>
              </div>

              {/* Safer (safe side) */}
              <div className="flex-1 p-5" style={{ background: "rgba(0,255,163,0.04)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-safe" />
                  <span className="font-mono text-xs text-safe/70">SAFER ALLELE</span>
                </div>
                <p className="font-mono text-lg text-white mb-1">{suggestion.saferAllele}</p>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #00FFA3, #00D9FF)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(0.5 - suggestion.riskReduction) * 100 + 20}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                  />
                </div>
              </div>
            </div>

            {/* Epistasis context */}
            <div className="px-5 py-3 border-t border-dashed border-panel-border">
              <p className="font-annotation text-sticky-yellow/70 text-sm">
                ⚡ {suggestion.epistasisContext}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
