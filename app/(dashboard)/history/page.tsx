"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import RiskGauge from "@/components/charts/RiskGauge";
import { Clock, Dna, ArrowRight, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const { analyses } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-headline text-3xl text-white mb-1">Analysis History</h2>
        <p className="font-annotation text-sticky-yellow/60 text-lg">
          {analyses.length} total analyses in your lab notebook
        </p>
      </motion.div>

      <div className="space-y-3">
        {analyses.map((analysis, i) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/analysis/${analysis.id}`} className="stitch-card p-5 flex items-center gap-5 group block">
              <div className="w-16 h-16 flex-shrink-0">
                <RiskGauge score={analysis.riskScore} size={64} showLabel={false} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Dna size={14} className="text-primary" />
                  <h4 className="font-mono text-sm text-white font-medium truncate">{analysis.patientLabel}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono badge-${analysis.riskCategory}`}>
                    {analysis.riskCategory.toUpperCase()}
                  </span>
                </div>
                <p className="font-mono text-xs text-neutral mb-1">
                  {analysis.genes.join(", ")}
                </p>
                <div className="flex items-center gap-3 text-neutral/50">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span className="font-mono text-[10px]">{new Date(analysis.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="font-mono text-[10px]">{analysis.genes.length} genes · {analysis.epistasisPairs.length} epistasis pairs</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-headline text-lg" style={{
                  color: analysis.riskScore < 0.25 ? "#00FFA3" : analysis.riskScore < 0.5 ? "#00D9FF" : analysis.riskScore < 0.75 ? "#FF6B35" : "#FF3232"
                }}>
                  {(analysis.riskScore * 100).toFixed(1)}%
                </span>
                <ArrowRight size={16} className="text-neutral group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}

        {analyses.length === 0 && (
          <div className="stitch-card p-12 text-center">
            <h3 className="font-headline text-xl text-white mb-2">No analyses yet</h3>
            <Link href="/analysis/new" className="btn-primary inline-flex items-center gap-2 mt-4">
              Run First Analysis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
