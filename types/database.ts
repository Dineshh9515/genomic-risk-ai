// ===== Database Types (Supabase table shapes) =====

export interface DBAnalysis {
  id: string;
  user_id: string;
  patient_label: string;
  genes: string[];
  snps: Record<string, string>;
  risk_score: number;
  risk_category: string;
  shap_values: Record<string, unknown>[];
  attention_scores: Record<string, number>;
  epistasis_pairs: Record<string, unknown>[];
  variant_suggestions: Record<string, unknown>[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DBSimulatorScenario {
  id: string;
  user_id: string;
  analysis_id: string;
  name: string;
  gene_overrides: Record<string, unknown>;
  counterfactual_score: number;
  delta: number;
  created_at: string;
}

export interface DBKGCache {
  gene_set_hash: string;
  graph_data: Record<string, unknown>;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  plan: "free" | "pro" | "research";
  analysisCount: number;
  stripeCustomerId: string | null;
  createdAt: string;
}

export type SubscriptionPlan = "free" | "pro" | "research";

export const PLAN_LIMITS: Record<SubscriptionPlan, { analyses: number; pdfExport: boolean; comparison: boolean; apiAccess: boolean }> = {
  free: { analyses: 3, pdfExport: false, comparison: false, apiAccess: false },
  pro: { analyses: Infinity, pdfExport: true, comparison: true, apiAccess: false },
  research: { analyses: Infinity, pdfExport: true, comparison: true, apiAccess: true },
};
