// ===== Analysis Types =====

export interface AnalysisRequest {
  genes: string[];
  snps: Record<string, string>;
  patientId: string;
}

export interface AnalysisResult {
  id: string;
  patientLabel: string;
  riskScore: number;
  riskCategory: RiskCategory;
  shapValues: ShapValue[];
  geneEmbeddings: Record<string, number[]>;
  attentionScores: Record<string, number>;
  epistasisPairs: EpistasisPair[];
  variantSuggestions: VariantSuggestion[];
  genes: string[];
  snps: Record<string, string>;
  status: AnalysisStatus;
  createdAt: string;
  updatedAt: string;
}

export type RiskCategory = "low" | "moderate" | "high" | "critical";
export type AnalysisStatus = "pending" | "processing" | "complete" | "failed";

export interface ShapValue {
  gene: string;
  value: number;
  pathway: string;
  rank: number;
  description: string;
}

export interface EpistasisPair {
  gene1: string;
  gene2: string;
  interactionScore: number;
  combinedRiskDelta: number;
  pathway: string;
}

export interface VariantSuggestion {
  gene: string;
  currentAllele: string;
  saferAllele: string;
  riskReduction: number;
  epistasisContext: string;
  clinicalSignificance: string;
}

export interface SimulatorScenario {
  id: string;
  analysisId: string;
  name: string;
  geneOverrides: Record<string, GeneOverride>;
  counterfactualScore: number;
  delta: number;
  createdAt: string;
}

export interface GeneOverride {
  included: boolean;
  allele: string;
  originalAllele: string;
}

export interface ComparisonData {
  analysis1: AnalysisResult;
  analysis2: AnalysisResult;
  diffGenes: string[];
}
