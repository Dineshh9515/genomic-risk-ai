"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FlaskConical,
  TrendingUp,
  Activity,
  ArrowRight,
  Clock,
  Dna,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import PencilDivider from "@/components/layout/PencilDivider";
import RiskGauge from "@/components/charts/RiskGauge";

export default function DashboardPage() {
  const { analyses } = useAppStore();

  const totalAnalyses = analyses.length;
  const avgRisk = analyses.reduce((sum, a) => sum + a.riskScore, 0) / (totalAnalyses || 1);
  const highRiskCount = analyses.filter((a) => a.riskCategory === "high" || a.riskCategory === "critical").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-3xl text-white mb-1">Lab Overview</h2>
            <p className="font-annotation text-sticky-yellow/60 text-lg">
              your research at a glance
            </p>
          </div>
          <Link href="/analysis/new" className="btn-primary flex items-center gap-2">
            <FlaskConical size={16} /> New Analysis
          </Link>
        </div>
      </motion.div>

      <PencilDivider />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stitch-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-dashed border-stitch-border flex items-center justify-center">
              <FlaskConical size={20} className="text-primary" />
            </div>
            <span className="font-mono text-sm text-neutral">Total Analyses</span>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-headline text-4xl text-white">
            {totalAnalyses}
          </motion.p>
          <p className="font-annotation text-xs text-sticky-yellow/50 mt-2">
            {totalAnalyses === 0 ? "run your first analysis →" : "across all patients"}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stitch-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-safe/10 border border-dashed border-safe/30 flex items-center justify-center">
              <TrendingUp size={20} className="text-safe" />
            </div>
            <span className="font-mono text-sm text-neutral">Avg Risk Score</span>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-headline text-4xl text-white">
            {(avgRisk * 100).toFixed(1)}%
          </motion.p>
          <p className="font-annotation text-xs text-sticky-yellow/50 mt-2">
            mean across all analyses
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stitch-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 border border-dashed border-danger/30 flex items-center justify-center">
              <Activity size={20} className="text-danger" />
            </div>
            <span className="font-mono text-sm text-neutral">High Risk</span>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-headline text-4xl text-danger">
            {highRiskCount}
          </motion.p>
          <p className="font-annotation text-xs text-sticky-yellow/50 mt-2">
            patients requiring attention
          </p>
        </motion.div>
      </div>

      {/* Recent analyses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-xl text-white">Recent Analyses</h3>
          <Link href="/history" className="font-mono text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {analyses.slice(0, 4).map((analysis, i) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link href={`/analysis/${analysis.id}`} className="stitch-card p-5 flex items-center gap-5 group block">
                <div className="w-20 h-20 flex-shrink-0">
                  <RiskGauge score={analysis.riskScore} size={80} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Dna size={14} className="text-primary" />
                    <h4 className="font-mono text-sm text-white font-medium truncate">
                      {analysis.patientLabel}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono badge-${analysis.riskCategory}`}>
                      {analysis.riskCategory.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-neutral mb-1">
                    {analysis.genes.length} genes · {Object.keys(analysis.snps).length} SNPs
                  </p>
                  <div className="flex items-center gap-1 text-neutral/50">
                    <Clock size={10} />
                    <span className="font-mono text-[10px]">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-neutral group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>

        {analyses.length === 0 && (
          <div className="stitch-card p-12 text-center">
            <Dna size={40} className="text-primary/30 mx-auto mb-4" />
            <h3 className="font-headline text-xl text-white mb-2">No analyses yet</h3>
            <p className="font-mono text-sm text-neutral mb-6">
              Start your first genomic risk analysis to see results here.
            </p>
            <Link href="/analysis/new" className="btn-primary inline-flex items-center gap-2">
              <FlaskConical size={16} /> Run First Analysis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
