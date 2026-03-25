"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Save, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import RiskGauge from "@/components/charts/RiskGauge";
import ShapWaterfall from "@/components/charts/ShapWaterfall";
import PencilDivider from "@/components/layout/PencilDivider";
import type { ShapValue, SimulatorScenario, GeneOverride } from "@/types/analysis";

export default function SimulatorPage() {
  const {
    currentAnalysis,
    simulatorOverrides,
    setOverride,
    resetOverrides,
    simulatorHistory,
    addSimulatorSnapshot,
  } = useAppStore();

  const [computing, setComputing] = useState(false);
  const [counterfactualScore, setCounterfactualScore] = useState<number>(currentAnalysis?.riskScore || 0.5);

  const analysis = currentAnalysis;
  const baselineScore = analysis?.riskScore ?? 0.5;

  // Compute counterfactual score from SHAP values
  const computeCounterfactual = useCallback(() => {
    if (!analysis) return;
    setComputing(true);
    setTimeout(() => {
      let score = baselineScore;
      analysis.shapValues.forEach((sv) => {
        const override = simulatorOverrides[sv.gene];
        if (override && !override.included) {
          score -= sv.value * 0.8;
        } else if (override && override.allele !== override.originalAllele) {
          const suggestion = analysis.variantSuggestions.find((v) => v.gene === sv.gene);
          if (suggestion) {
            score -= suggestion.riskReduction;
          }
        }
      });
      score = Math.max(0, Math.min(1, score));
      setCounterfactualScore(score);
      setComputing(false);
    }, 300);
  }, [baselineScore, simulatorOverrides, analysis]);

  useEffect(() => {
    computeCounterfactual();
  }, [computeCounterfactual]);

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="font-headline text-2xl text-white mb-4">No Analysis Selected</h2>
        <p className="font-mono text-sm text-neutral">Run an analysis first to use the simulator.</p>
      </div>
    );
  }

  const delta = counterfactualScore - baselineScore;

  const modifiedShapValues: ShapValue[] = analysis.shapValues.map((sv) => {
    const override = simulatorOverrides[sv.gene];
    if (override && !override.included) {
      return { ...sv, value: 0 };
    }
    if (override && override.allele !== override.originalAllele) {
      const suggestion = analysis.variantSuggestions.find((v) => v.gene === sv.gene);
      return { ...sv, value: sv.value - (suggestion?.riskReduction || 0) };
    }
    return sv;
  });

  const handleSaveScenario = () => {
    const scenario: SimulatorScenario = {
      id: `scenario-${Date.now()}`,
      analysisId: analysis.id,
      name: `Scenario ${simulatorHistory.length + 1}`,
      geneOverrides: { ...simulatorOverrides },
      counterfactualScore,
      delta,
      createdAt: new Date().toISOString(),
    };
    addSimulatorSnapshot(scenario);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-headline text-3xl text-white mb-1">What-If Simulator</h2>
        <p className="font-annotation text-sticky-yellow/60 text-lg">
          modify genes and see risk change in real time — {analysis.patientLabel}
        </p>
      </motion.div>

      <div className="flex gap-6">
        {/* Left: Gene Control Panel */}
        <div className="w-80 flex-shrink-0 space-y-3">
          <h3 className="font-mono text-sm text-neutral mb-2">Gene Controls</h3>
          {analysis.shapValues.map((sv) => {
            const override: GeneOverride = simulatorOverrides[sv.gene] || {
              included: true,
              allele: analysis.snps[sv.gene] || "default",
              originalAllele: analysis.snps[sv.gene] || "default",
            };
            const suggestion = analysis.variantSuggestions.find((v) => v.gene === sv.gene);

            return (
              <div key={sv.gene} className="stitch-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-white">{sv.gene}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={override.included}
                      onChange={(e) =>
                        setOverride(sv.gene, { ...override, included: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/30" />
                  </label>
                </div>

                {override.included && suggestion && (
                  <select
                    value={override.allele}
                    onChange={(e) =>
                      setOverride(sv.gene, { ...override, allele: e.target.value })
                    }
                    className="w-full bg-base border border-dashed border-panel-border rounded px-3 py-2 font-mono text-xs text-white outline-none focus:border-stitch-border"
                  >
                    <option value={suggestion.currentAllele}>{suggestion.currentAllele} (current)</option>
                    <option value={suggestion.saferAllele}>{suggestion.saferAllele} (safer)</option>
                  </select>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral">SHAP: {sv.value > 0 ? "+" : ""}{sv.value.toFixed(3)}</span>
                  {!override.included && (
                    <span className="font-mono text-[10px] text-danger">EXCLUDED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live Visualization */}
        <div className="flex-1 space-y-6">
          {/* Top: Gauge + Delta */}
          <div className="stitch-card p-6">
            <div className="flex items-center gap-8">
              <div className="relative">
                <RiskGauge score={counterfactualScore} size={200} />
                {computing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base/50 rounded-full">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="font-mono text-xs text-neutral">Baseline</p>
                    <p className="font-headline text-2xl text-white">{(baselineScore * 100).toFixed(1)}%</p>
                  </div>
                  <span className="font-mono text-2xl text-neutral">→</span>
                  <div>
                    <p className="font-mono text-xs text-neutral">Modified</p>
                    <p className="font-headline text-2xl" style={{ color: counterfactualScore < baselineScore ? "#00FFA3" : "#FF6B35" }}>
                      {(counterfactualScore * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded font-mono text-sm ${
                  delta < 0 ? "bg-safe/10 text-safe" : delta > 0 ? "bg-danger/10 text-danger" : "bg-white/5 text-neutral"
                }`}>
                  {delta > 0 ? "+" : ""}{(delta * 100).toFixed(1)}% vs baseline
                </div>
              </div>
            </div>
          </div>

          {/* Mini waterfall */}
          <div className="stitch-card p-6">
            <ShapWaterfall shapValues={modifiedShapValues} finalScore={counterfactualScore} />
          </div>

          <PencilDivider />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={resetOverrides} className="btn-outline flex items-center gap-2 text-sm">
              <RotateCcw size={14} /> Reset to Original
            </button>
            <button onClick={handleSaveScenario} className="btn-primary flex items-center gap-2 text-sm">
              <Save size={14} /> Save Scenario
            </button>
          </div>

          {/* History trail */}
          {simulatorHistory.length > 0 && (
            <div>
              <h4 className="font-mono text-sm text-neutral mb-3 flex items-center gap-2">
                <Clock size={14} /> Recent Scenarios
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {simulatorHistory.map((scenario) => (
                  <div key={scenario.id} className="stitch-card p-3 min-w-[140px] flex-shrink-0">
                    <p className="font-mono text-xs text-white mb-1">{scenario.name}</p>
                    <p className="font-headline text-lg" style={{
                      color: scenario.delta < 0 ? "#00FFA3" : "#FF6B35",
                    }}>
                      {(scenario.counterfactualScore * 100).toFixed(1)}%
                    </p>
                    <p className="font-mono text-[10px] text-neutral">
                      {scenario.delta > 0 ? "+" : ""}{(scenario.delta * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
