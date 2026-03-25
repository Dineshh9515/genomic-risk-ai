// ===== Gene & Protein Types =====

export interface Gene {
  name: string;
  entrezId: string;
  uniprotId: string;
  description: string;
  organism: string;
  chromosome: string;
  pathways: string[];
  proteinFunction: string;
}

export interface GeneSearchResult {
  geneName: string;
  proteinName: string;
  entryType: string;
  organism: string;
  description: string;
  uniprotAccession: string;
}

export interface StringDBInteraction {
  stringId_A: string;
  stringId_B: string;
  preferredName_A: string;
  preferredName_B: string;
  ncbiTaxonId: number;
  score: number;
  nscore: number;
  fscore: number;
  pscore: number;
  ascore: number;
  escore: number;
  dscore: number;
  tscore: number;
}

export interface KnowledgeGraphNode {
  id: string;
  type: "gene" | "snp" | "pathway";
  label: string;
  riskScore: number;
  shapValue: number;
  pathways: string[];
  x?: number;
  y?: number;
  metadata: Record<string, unknown>;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  confidence: number;
  interactionType: string;
  pathwayName: string;
  attentionWeight: number;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface GWASAssociation {
  riskAllele: string;
  pValue: number;
  orBeta: number;
  traitName: string;
  studyTitle: string;
  pubmedId: string;
}

export interface ClinVarVariant {
  variationId: string;
  name: string;
  clinicalSignificance: string;
  reviewStatus: string;
  lastEvaluated: string;
  condition: string;
}

export interface VariantInfo {
  rsid: string;
  gene: string;
  chromosome: string;
  position: number;
  refAllele: string;
  altAllele: string;
  clinicalSignificance: string;
  populationFrequency: number;
  gwasAssociations: GWASAssociation[];
}
