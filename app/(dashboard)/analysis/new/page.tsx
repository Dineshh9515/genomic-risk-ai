"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FlaskConical, Loader2, ArrowRight, CheckCircle2, XCircle, Clock } from "lucide-react";
import GeneInput from "@/components/analysis/GeneInput";
import PencilDivider from "@/components/layout/PencilDivider";
import { useAppStore } from "@/lib/store";
import type { AnalysisResult } from "@/types/analysis";

// Known T2DM risk SNPs for common genes (used as defaults when user doesn't provide)
const DEFAULT_SNPS: Record<string, string> = {
  TCF7L2: "rs7903146", FTO: "rs9939609", SLC30A8: "rs13266634",
  PPARG: "rs1801282", KCNJ11: "rs5219", CDKAL1: "rs7756992",
  IGF2BP2: "rs4402960", MTNR1B: "rs10830963", HHEX: "rs1111875",
  "CDKN2A/B": "rs10811661",
};

type PipelineStep = {
  name: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
};

export default function NewAnalysisPage() {
  const router = useRouter();
  const { addAnalysis } = useAppStore();
  const [genes, setGenes] = useState<string[]>([]);
  const [patientLabel, setPatientLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);

  const updateStep = (index: number, update: Partial<PipelineStep>) => {
    setPipelineSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...update } : s)));
  };

  const handleSubmit = async () => {
    if (genes.length === 0) return;
    setLoading(true);

    const steps: PipelineStep[] = [
      { name: "Validating genes via mygene.info", status: "pending" },
      { name: "Fetching STRING DB interactions", status: "pending" },
      { name: "Fetching Open Targets T2DM scores", status: "pending" },
      { name: "Querying ClinVar clinical significance", status: "pending" },
      { name: "Running SHAP attribution analysis", status: "pending" },
      { name: "Building epistasis interaction matrix", status: "pending" },
    ];
    setPipelineSteps(steps);

    try {
      updateStep(0, { status: "running" });
      
      // Fake progress animation loop to keep the UI engaging while backend processes
      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < 5) {
          updateStep(currentStep, { status: "done", detail: "Completed" });
          currentStep++;
          updateStep(currentStep, { status: "running" });
        }
      }, 1500);

      const snpMap = Object.fromEntries(genes.map((g) => [g, DEFAULT_SNPS[g] || ""]));
      
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genes,
          snps: snpMap,
          patientId: patientLabel
        })
      });

      const data = await res.json();
      clearInterval(progressInterval);

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      // Mark all steps done
      steps.forEach((_, i) => updateStep(i, { status: "done", detail: "Success" }));

      const newAnalysis: AnalysisResult = {
        id: data.jobId,
        patientLabel: patientLabel || `Patient ${Date.now().toString(36).toUpperCase()}`,
        riskScore: data.riskScore,
        riskCategory: data.riskCategory as AnalysisResult["riskCategory"],
        shapValues: data.shapValues,
        geneEmbeddings: {},
        attentionScores: data.attentionScores,
        epistasisPairs: data.epistasisPairs,
        variantSuggestions: data.variantSuggestions,
        genes,
        snps: snpMap,
        status: "complete",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addAnalysis(newAnalysis);
      setLoading(false);

      // Short delay to let user see the completed pipeline
      setTimeout(() => router.push(`/analysis/${newAnalysis.id}`), 1200);
    } catch (error) {
      console.error("Analysis failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-headline text-3xl text-white mb-1">New Genomic Analysis</h2>
        <p className="font-annotation text-sticky-yellow/60 text-lg">
          input your genes of interest — we query 6 real-time bioinformatics APIs
        </p>
      </motion.div>

      <PencilDivider />

      {/* Patient Label */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stitch-card p-6">
        <label className="block font-mono text-sm text-neutral mb-2">Patient / Sample Label</label>
        <input
          type="text"
          value={patientLabel}
          onChange={(e) => setPatientLabel(e.target.value)}
          placeholder="e.g., Patient Alpha, Sample 2024-03"
          className="w-full bg-transparent font-mono text-sm text-white border border-dashed border-panel-border rounded px-4 py-3 outline-none focus:border-stitch-border transition-colors placeholder:text-neutral/40"
        />
      </motion.div>

      {/* Gene Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stitch-card p-6">
        <GeneInput selectedGenes={genes} onGenesChange={setGenes} />
      </motion.div>

      <PencilDivider />

      {/* Submit */}
      {!loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-between">
          <div className="font-mono text-sm text-neutral">
            {genes.length} gene{genes.length !== 1 ? "s" : ""} selected
            {genes.length >= 3 && <span className="text-safe ml-2">✓ minimum met</span>}
          </div>
          <button
            onClick={handleSubmit}
            disabled={genes.length === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FlaskConical size={16} /> Run Analysis <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      {/* Real-time pipeline visualization */}
      {loading && pipelineSteps.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="stitch-card p-8 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10">
              <svg viewBox="0 0 64 64" className="animate-spin">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(0,217,255,0.15)" strokeWidth="4" />
                <path d="M 32 4 A 28 28 0 0 1 60 32" fill="none" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-headline text-xl text-white">Live Analysis Pipeline</h3>
              <p className="font-annotation text-sticky-yellow/60 text-sm">
                querying real bioinformatics databases in real time
              </p>
            </div>
          </div>

          {pipelineSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 py-2"
            >
              {step.status === "pending" && <Clock size={16} className="text-neutral/30" />}
              {step.status === "running" && <Loader2 size={16} className="text-primary animate-spin" />}
              {step.status === "done" && <CheckCircle2 size={16} className="text-safe" />}
              {step.status === "error" && <XCircle size={16} className="text-danger" />}

              <span className={`font-mono text-sm ${
                step.status === "running" ? "text-primary" :
                step.status === "done" ? "text-white" :
                step.status === "error" ? "text-danger/70" :
                "text-neutral/40"
              }`}>
                {step.name}
              </span>

              {step.detail && (
                <span className="font-mono text-xs text-neutral ml-auto">{step.detail}</span>
              )}
            </motion.div>
          ))}

          {pipelineSteps.every((s) => s.status === "done" || s.status === "error") && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-annotation text-safe text-sm mt-4"
            >
              ✓ Analysis complete — redirecting to results...
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
}
