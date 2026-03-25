import type { AnalysisResult, ShapValue, EpistasisPair, VariantSuggestion } from "@/types/analysis";
import type { KnowledgeGraphData, KnowledgeGraphNode, KnowledgeGraphEdge } from "@/types/gene";

// ===== DEMO SHAP VALUES =====
export const DEMO_SHAP_VALUES: ShapValue[] = [
  { gene: "TCF7L2", value: 0.34, pathway: "WNT signaling / beta-cell function", rank: 1, description: "Strongest T2DM risk locus — impairs insulin secretion via WNT pathway disruption" },
  { gene: "FTO", value: 0.22, pathway: "Energy homeostasis / adipogenesis", rank: 2, description: "Obesity-linked locus — increases BMI through altered appetite regulation" },
  { gene: "SLC30A8", value: 0.18, pathway: "Zinc transport / insulin granules", rank: 3, description: "Zinc transporter in beta-cells — affects insulin crystallization and storage" },
  { gene: "PPARG", value: -0.15, pathway: "Lipid metabolism / insulin sensitivity", rank: 4, description: "Nuclear receptor — protective alleles improve insulin sensitivity in adipose tissue" },
  { gene: "KCNJ11", value: 0.12, pathway: "ATP-sensitive K+ channel", rank: 5, description: "Potassium channel subunit — risk alleles cause beta-cell depolarization defects" },
  { gene: "CDKAL1", value: 0.09, pathway: "tRNA modification / proinsulin processing", rank: 6, description: "Modifies tRNA for proinsulin translation — affects insulin processing fidelity" },
  { gene: "IGF2BP2", value: 0.07, pathway: "mRNA stability / beta-cell proliferation", rank: 7, description: "RNA-binding protein — risk variants reduce beta-cell mass maintenance" },
  { gene: "CDKN2A/B", value: 0.05, pathway: "Cell cycle regulation / senescence", rank: 8, description: "Cell cycle inhibitors — risk alleles accelerate beta-cell aging and apoptosis" },
  { gene: "HHEX", value: -0.04, pathway: "Pancreas development", rank: 9, description: "Homeobox transcription factor — essential for normal pancreatic organogenesis" },
  { gene: "MTNR1B", value: 0.11, pathway: "Melatonin signaling / circadian rhythm", rank: 10, description: "Melatonin receptor — risk variants disrupt circadian insulin secretion timing" },
];

// ===== DEMO EPISTASIS PAIRS =====
export const DEMO_EPISTASIS_PAIRS: EpistasisPair[] = [
  { gene1: "TCF7L2", gene2: "FTO", interactionScore: 0.76, combinedRiskDelta: 0.42, pathway: "WNT-adipogenesis crosstalk" },
  { gene1: "TCF7L2", gene2: "SLC30A8", interactionScore: 0.65, combinedRiskDelta: 0.35, pathway: "Beta-cell secretory pathway" },
  { gene1: "FTO", gene2: "PPARG", interactionScore: 0.58, combinedRiskDelta: -0.12, pathway: "Lipid-insulin sensitivity axis" },
  { gene1: "KCNJ11", gene2: "SLC30A8", interactionScore: 0.52, combinedRiskDelta: 0.28, pathway: "Ion channel – zinc transport in islets" },
  { gene1: "TCF7L2", gene2: "KCNJ11", interactionScore: 0.49, combinedRiskDelta: 0.31, pathway: "WNT – K-ATP channel in beta-cells" },
  { gene1: "CDKAL1", gene2: "IGF2BP2", interactionScore: 0.44, combinedRiskDelta: 0.15, pathway: "tRNA modification – mRNA stability" },
  { gene1: "MTNR1B", gene2: "TCF7L2", interactionScore: 0.41, combinedRiskDelta: 0.26, pathway: "Circadian – WNT temporal regulation" },
  { gene1: "FTO", gene2: "IGF2BP2", interactionScore: 0.38, combinedRiskDelta: 0.11, pathway: "RNA metabolism – energy balance" },
  { gene1: "PPARG", gene2: "KCNJ11", interactionScore: 0.33, combinedRiskDelta: -0.08, pathway: "Insulin sensitizer – secretion coupling" },
  { gene1: "CDKN2A/B", gene2: "HHEX", interactionScore: 0.29, combinedRiskDelta: 0.06, pathway: "Cell cycle – pancreas development" },
];

// ===== DEMO VARIANT SUGGESTIONS =====
export const DEMO_VARIANT_SUGGESTIONS: VariantSuggestion[] = [
  { gene: "TCF7L2", currentAllele: "rs7903146_T", saferAllele: "rs7903146_C", riskReduction: 0.31, epistasisContext: "Combined with FTO rs9939609 A→T, interaction score drops 0.76 → 0.43", clinicalSignificance: "Pathogenic" },
  { gene: "FTO", currentAllele: "rs9939609_A", saferAllele: "rs9939609_T", riskReduction: 0.18, epistasisContext: "Reduces adipogenesis-WNT crosstalk with TCF7L2", clinicalSignificance: "Risk factor" },
  { gene: "SLC30A8", currentAllele: "rs13266634_C", saferAllele: "rs13266634_T", riskReduction: 0.14, epistasisContext: "T allele is actually protective — loss of function reduces T2DM risk", clinicalSignificance: "Protective" },
  { gene: "KCNJ11", currentAllele: "rs5219_T", saferAllele: "rs5219_C", riskReduction: 0.09, epistasisContext: "C allele restores normal K-ATP channel gating in beta-cells", clinicalSignificance: "Risk factor" },
  { gene: "MTNR1B", currentAllele: "rs10830963_G", saferAllele: "rs10830963_C", riskReduction: 0.08, epistasisContext: "C allele normalizes melatonin-mediated insulin timing", clinicalSignificance: "Risk factor" },
];

// ===== DEMO ANALYSIS RESULTS =====
export const DEMO_ANALYSES: AnalysisResult[] = [
  {
    id: "analysis-001",
    patientLabel: "Patient Alpha",
    riskScore: 0.72,
    riskCategory: "high",
    shapValues: DEMO_SHAP_VALUES,
    geneEmbeddings: {},
    attentionScores: { TCF7L2: 0.89, FTO: 0.76, SLC30A8: 0.65, PPARG: 0.42, KCNJ11: 0.58, CDKAL1: 0.33, IGF2BP2: 0.28, "CDKN2A/B": 0.21, HHEX: 0.15, MTNR1B: 0.51 },
    epistasisPairs: DEMO_EPISTASIS_PAIRS,
    variantSuggestions: DEMO_VARIANT_SUGGESTIONS,
    genes: ["TCF7L2", "FTO", "SLC30A8", "PPARG", "KCNJ11", "CDKAL1", "IGF2BP2", "CDKN2A/B", "HHEX", "MTNR1B"],
    snps: { TCF7L2: "rs7903146_T", FTO: "rs9939609_A", SLC30A8: "rs13266634_C", KCNJ11: "rs5219_T", MTNR1B: "rs10830963_G" },
    status: "complete",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:05:32Z",
  },
  {
    id: "analysis-002",
    patientLabel: "Patient Beta",
    riskScore: 0.38,
    riskCategory: "moderate",
    shapValues: DEMO_SHAP_VALUES.map((sv) => ({ ...sv, value: sv.value * 0.55 })),
    geneEmbeddings: {},
    attentionScores: { TCF7L2: 0.52, FTO: 0.41, PPARG: 0.72 },
    epistasisPairs: DEMO_EPISTASIS_PAIRS.slice(0, 5),
    variantSuggestions: DEMO_VARIANT_SUGGESTIONS.slice(0, 3),
    genes: ["TCF7L2", "FTO", "PPARG"],
    snps: { TCF7L2: "rs7903146_C", FTO: "rs9939609_T" },
    status: "complete",
    createdAt: "2024-03-18T14:30:00Z",
    updatedAt: "2024-03-18T14:34:12Z",
  },
  {
    id: "analysis-003",
    patientLabel: "Patient Gamma",
    riskScore: 0.15,
    riskCategory: "low",
    shapValues: DEMO_SHAP_VALUES.map((sv) => ({ ...sv, value: sv.value * 0.2 })),
    geneEmbeddings: {},
    attentionScores: { PPARG: 0.88, HHEX: 0.65 },
    epistasisPairs: DEMO_EPISTASIS_PAIRS.slice(0, 2),
    variantSuggestions: DEMO_VARIANT_SUGGESTIONS.slice(0, 1),
    genes: ["PPARG", "HHEX"],
    snps: {},
    status: "complete",
    createdAt: "2024-03-15T09:00:00Z",
    updatedAt: "2024-03-15T09:02:45Z",
  },
];

// ===== DEMO KNOWLEDGE GRAPH =====
export function generateDemoKnowledgeGraph(genes: string[]): KnowledgeGraphData {
  const allGenes = genes.length > 0 ? genes : ["TCF7L2", "FTO", "SLC30A8", "PPARG", "KCNJ11", "CDKAL1", "IGF2BP2", "CDKN2A/B", "HHEX", "MTNR1B"];

  const pathwayMap: Record<string, string> = {
    TCF7L2: "WNT signaling", FTO: "Energy homeostasis", SLC30A8: "Zinc transport",
    PPARG: "Lipid metabolism", KCNJ11: "K-ATP channel", CDKAL1: "tRNA modification",
    IGF2BP2: "mRNA stability", "CDKN2A/B": "Cell cycle", HHEX: "Pancreas development",
    MTNR1B: "Circadian rhythm",
  };

  const riskMap: Record<string, number> = {
    TCF7L2: 0.89, FTO: 0.76, SLC30A8: 0.65, PPARG: 0.25, KCNJ11: 0.58,
    CDKAL1: 0.33, IGF2BP2: 0.28, "CDKN2A/B": 0.21, HHEX: 0.15, MTNR1B: 0.51,
  };

  const snpMap: Record<string, string[]> = {
    TCF7L2: ["rs7903146", "rs12255372"], FTO: ["rs9939609", "rs1558902"],
    SLC30A8: ["rs13266634"], PPARG: ["rs1801282"], KCNJ11: ["rs5219"],
    CDKAL1: ["rs7754840"], MTNR1B: ["rs10830963"],
  };

  const nodes: KnowledgeGraphNode[] = [];
  const edges: KnowledgeGraphEdge[] = [];

  allGenes.forEach((gene, i) => {
    const shapVal = DEMO_SHAP_VALUES.find((s) => s.gene === gene)?.value || 0;
    nodes.push({
      id: gene,
      type: "gene",
      label: gene,
      riskScore: riskMap[gene] || 0.3,
      shapValue: shapVal,
      pathways: [pathwayMap[gene] || "Unknown"],
      metadata: { index: i },
    });

    // Add SNP nodes
    const snps = snpMap[gene] || [];
    snps.forEach((snp) => {
      nodes.push({
        id: snp,
        type: "snp",
        label: snp,
        riskScore: riskMap[gene] || 0.3,
        shapValue: shapVal * 0.8,
        pathways: [pathwayMap[gene] || "Unknown"],
        metadata: { parentGene: gene },
      });
      edges.push({
        source: gene,
        target: snp,
        confidence: 0.95,
        interactionType: "variant_of",
        pathwayName: pathwayMap[gene] || "Unknown",
        attentionWeight: 0.9,
      });
    });
  });

  // Add gene-gene interaction edges based on epistasis pairs
  DEMO_EPISTASIS_PAIRS.forEach((pair) => {
    if (allGenes.includes(pair.gene1) && allGenes.includes(pair.gene2)) {
      edges.push({
        source: pair.gene1,
        target: pair.gene2,
        confidence: pair.interactionScore,
        interactionType: "epistasis",
        pathwayName: pair.pathway,
        attentionWeight: pair.interactionScore * 0.8,
      });
    }
  });

  return { nodes, edges };
}

// ===== GENE INFO DATABASE =====
export const GENE_INFO: Record<string, { fullName: string; function: string; chromosome: string; uniprotId: string }> = {
  TCF7L2: { fullName: "Transcription Factor 7 Like 2", function: "Transcription factor in WNT signaling pathway. Key regulator of beta-cell proliferation and insulin secretion.", chromosome: "10q25.2", uniprotId: "Q9NQB0" },
  FTO: { fullName: "Fat Mass and Obesity Associated", function: "RNA demethylase involved in energy homeostasis and adipogenesis regulation.", chromosome: "16q12.2", uniprotId: "Q9C0B1" },
  SLC30A8: { fullName: "Solute Carrier Family 30 Member 8", function: "Zinc transporter expressed in pancreatic beta-cells. Essential for insulin crystallization and storage.", chromosome: "8q24.11", uniprotId: "Q8IWU4" },
  PPARG: { fullName: "Peroxisome Proliferator Activated Receptor Gamma", function: "Nuclear receptor regulating lipid metabolism and insulin sensitivity in adipose tissue.", chromosome: "3p25.2", uniprotId: "P37231" },
  KCNJ11: { fullName: "Potassium Channel Inwardly Rectifying Subfamily J Member 11", function: "Subunit of ATP-sensitive potassium channel in beta-cells. Controls insulin secretion response to glucose.", chromosome: "11p15.1", uniprotId: "Q14654" },
  CDKAL1: { fullName: "CDK5 Regulatory Subunit Associated Protein 1 Like 1", function: "Methylthiotransferase modifying tRNA for accurate proinsulin translation.", chromosome: "6p22.3", uniprotId: "Q5VV42" },
  IGF2BP2: { fullName: "Insulin-Like Growth Factor 2 mRNA Binding Protein 2", function: "RNA-binding protein regulating mRNA stability and translation. Involved in beta-cell maintenance.", chromosome: "3q27.2", uniprotId: "Q9Y6M1" },
  "CDKN2A/B": { fullName: "Cyclin Dependent Kinase Inhibitor 2A/B", function: "Cell cycle regulators that control beta-cell proliferation and senescence.", chromosome: "9p21.3", uniprotId: "P42771" },
  HHEX: { fullName: "Hematopoietically Expressed Homeobox", function: "Homeobox transcription factor essential for ventral pancreas development.", chromosome: "10q23.33", uniprotId: "Q03014" },
  MTNR1B: { fullName: "Melatonin Receptor 1B", function: "G-protein coupled melatonin receptor. Mediates circadian regulation of insulin secretion.", chromosome: "11q14.3", uniprotId: "P49286" },
};
