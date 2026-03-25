// ===== Centralized Bioinformatics API Client =====
// All free, no API keys needed (except optional NCBI key for higher rate limits)

// ---------- 1. mygene.info — Gene Validation & Annotation ----------
export async function fetchGeneInfo(geneSymbol: string) {
  const res = await fetch(
    `https://mygene.info/v1/query?q=symbol:${encodeURIComponent(geneSymbol)}&species=human&fields=symbol,name,entrezgene,ensembl.gene,genomic_pos,pathway.kegg,summary,type_of_gene`
  );
  if (!res.ok) throw new Error(`mygene.info error: ${res.status}`);
  const data = await res.json();
  return data.hits?.[0] || null;
}

export async function fetchMultipleGeneInfo(genes: string[]) {
  const res = await fetch(`https://mygene.info/v1/gene`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `ids=${genes.join(",")}&fields=symbol,name,entrezgene,ensembl.gene,genomic_pos,pathway.kegg,summary,type_of_gene&species=human`,
  });
  if (!res.ok) throw new Error(`mygene.info batch error: ${res.status}`);
  return res.json();
}

// ---------- 2. STRING DB — Gene-Gene Interactions ----------
export interface StringInteraction {
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

export async function fetchStringInteractions(genes: string[], minScore = 700): Promise<StringInteraction[]> {
  const identifiers = genes.join("%0d");
  const res = await fetch(
    `https://string-db.org/api/json/network?identifiers=${identifiers}&species=9606&required_score=${minScore}`
  );
  if (!res.ok) throw new Error(`STRING DB error: ${res.status}`);
  return res.json();
}

// ---------- 3. GWAS Catalog — Variant-Disease Associations ----------
export interface GWASVariantAssociation {
  riskFrequency: string;
  pvalue: number;
  orPerCopyNum: number;
  range: string;
  traitName: string;
  mappedGene: string;
  pubmedId: string;
}

export async function fetchGWASAssociations(rsid: string) {
  const res = await fetch(
    `https://www.ebi.ac.uk/gwas/rest/api/singleNucleotidePolymorphisms/${rsid}/associations`
  );
  if (!res.ok) {
    // Fallback: try the SNP endpoint directly
    const snpRes = await fetch(
      `https://www.ebi.ac.uk/gwas/rest/api/singleNucleotidePolymorphisms/${rsid}`
    );
    if (!snpRes.ok) return [];
    const snpData = await snpRes.json();
    return snpData;
  }
  const data = await res.json();
  return data._embedded?.associations || [];
}

// ---------- 4. ClinVar via NCBI E-utilities — Clinical Significance ----------
export interface ClinVarResult {
  uid: string;
  title: string;
  obj_type: string;
  clinical_significance?: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function fetchClinVarData(rsid: string) {
  // Random delay (jitter) between 300ms–1500ms to scatter parallel requests and prevent NCBI 429
  await delay(300 + Math.random() * 1200);

  // Step 1: Search for the variant in ClinVar
  const searchRes = await fetch(

    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=clinvar&term=${rsid}&retmode=json`
  );
  if (!searchRes.ok) return null;
  const searchData = await searchRes.json();
  const ids = searchData.esearchresult?.idlist || [];

  if (ids.length === 0) return null;

  // Step 2: Fetch summary for the first result
  const summaryRes = await fetch(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=clinvar&id=${ids[0]}&retmode=json`
  );
  if (!summaryRes.ok) return null;
  const summaryData = await summaryRes.json();
  const result = summaryData.result?.[ids[0]];

  return {
    variationId: ids[0],
    title: result?.title || rsid,
    clinicalSignificance: result?.clinical_significance?.description || "Unknown",
    reviewStatus: result?.clinical_significance?.review_status || "Unknown",
    condition: result?.trait_set?.[0]?.trait_name || "Unknown",
    lastEvaluated: result?.clinical_significance?.last_evaluated || "",
  };
}

// ---------- 5. myvariant.info — Aggregated Variant Annotations ----------
export async function fetchVariantInfo(rsid: string) {
  const res = await fetch(
    `https://myvariant.info/v1/variant/${rsid}?fields=clinvar,gwassnps,cadd,dbsnp,snpeff`
  );
  if (!res.ok) return null;
  return res.json();
}

export async function fetchMultipleVariants(rsids: string[]) {
  const res = await fetch(`https://myvariant.info/v1/variant`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `ids=${rsids.join(",")}&fields=clinvar,gwassnps,cadd,dbsnp`,
  });
  if (!res.ok) return [];
  return res.json();
}

// ---------- 6. Open Targets — Gene-Disease Evidence Scores ----------
export interface OpenTargetAssociation {
  approvedSymbol: string;
  score: number;
  datatypeScores: Record<string, number>;
}

export async function fetchOpenTargetsT2DM(geneSymbols?: string[]) {
  const query = `
    query {
      disease(efoId: "EFO_0001360") {
        name
        associatedTargets(page: { size: 50, index: 0 }) {
          count
          rows {
            target {
              id
              approvedSymbol
              approvedName
            }
            score
            datatypeScores {
              id
              score
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.platform.opentargets.org/api/v4/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) return [];
  const data = await res.json();
  const rows = data.data?.disease?.associatedTargets?.rows || [];

  // Filter by provided genes if given
  if (geneSymbols && geneSymbols.length > 0) {
    return rows.filter((r: { target: { approvedSymbol: string } }) =>
      geneSymbols.includes(r.target.approvedSymbol)
    );
  }
  return rows;
}

// ---------- 7. Ensembl REST API — Variant Coordinates & Frequencies ----------
export async function fetchEnsemblVariant(rsid: string) {
  const res = await fetch(
    `https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json`
  );
  if (!res.ok) return null;
  return res.json();
}

export async function fetchEnsemblGeneLocation(geneSymbol: string) {
  const res = await fetch(
    `https://rest.ensembl.org/lookup/symbol/homo_sapiens/${geneSymbol}?content-type=application/json;expand=1`
  );
  if (!res.ok) return null;
  return res.json();
}

// ---------- 8. UniProt REST API — Gene & Protein Data ----------
export async function searchUniProt(query: string, size = 8) {
  const res = await fetch(
    `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(query)}+AND+organism_id:9606&format=json&size=${size}&fields=gene_names,protein_name,organism_name,accession`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// ---------- 9. ESMFold — Protein 3D Structure Prediction ----------
export async function fetchProteinStructure(aminoAcidSequence: string) {
  const res = await fetch("https://api.esmatlas.com/foldSequence/v1/pdb/", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: aminoAcidSequence,
  });
  if (!res.ok) return null;
  return res.text(); // Returns PDB format text
}

// ============================================================
// COMPOSITE FUNCTIONS — Orchestrate multiple APIs
// ============================================================

/**
 * Full gene analysis pipeline — calls all relevant APIs for a set of genes.
 * This is what the "New Analysis" page and Inngest background job should use.
 */
export async function runFullGenePipeline(genes: string[], snpMap: Record<string, string>) {
  const results = await Promise.allSettled([
    // 1. Validate genes & get annotations via mygene.info
    Promise.all(genes.map((g) => fetchGeneInfo(g))),

    // 2. Get gene-gene interactions from STRING DB
    fetchStringInteractions(genes),

    // 3. Get T2DM association scores from Open Targets
    fetchOpenTargetsT2DM(genes),

    // 4. Get variant data for all SNPs from myvariant.info
    Promise.all(
      Object.values(snpMap)
        .filter(Boolean)
        .map((rsid) => fetchVariantInfo(rsid.split("_")[0]))
    ),

    // 5. Get ClinVar data for SNPs
    Promise.all(
      Object.values(snpMap)
        .filter(Boolean)
        .map((rsid) => fetchClinVarData(rsid.split("_")[0]))
    ),

    // 6. Get GWAS associations for SNPs
    Promise.all(
      Object.values(snpMap)
        .filter(Boolean)
        .map((rsid) => fetchGWASAssociations(rsid.split("_")[0]))
    ),

    // 7. Get Ensembl data for gene locations
    Promise.all(genes.map((g) => fetchEnsemblGeneLocation(g))),
  ]);

  return {
    geneAnnotations: results[0].status === "fulfilled" ? results[0].value : [],
    stringInteractions: results[1].status === "fulfilled" ? results[1].value : [],
    openTargetsScores: results[2].status === "fulfilled" ? results[2].value : [],
    variantAnnotations: results[3].status === "fulfilled" ? results[3].value : [],
    clinvarData: results[4].status === "fulfilled" ? results[4].value : [],
    gwasAssociations: results[5].status === "fulfilled" ? results[5].value : [],
    ensemblLocations: results[6].status === "fulfilled" ? results[6].value : [],
  };
}

/**
 * Build a knowledge graph from real STRING DB data + enrichments.
 */
export async function buildRealKnowledgeGraph(genes: string[]) {
  const [interactions, openTargets] = await Promise.allSettled([
    fetchStringInteractions(genes),
    fetchOpenTargetsT2DM(genes),
  ]);

  const stringData = interactions.status === "fulfilled" ? interactions.value : [];
  const otData = openTargets.status === "fulfilled" ? openTargets.value : [];

  // Build node set from interactions
  const nodeMap = new Map<string, {
    id: string;
    type: "gene" | "snp" | "pathway";
    label: string;
    riskScore: number;
    shapValue: number;
    pathways: string[];
    metadata: Record<string, unknown>;
  }>();

  // Add requested genes as primary nodes
  genes.forEach((gene) => {
    const otEntry = otData.find(
      (r: { target: { approvedSymbol: string }; score: number }) =>
        r.target.approvedSymbol === gene
    );
    nodeMap.set(gene, {
      id: gene,
      type: "gene",
      label: gene,
      riskScore: otEntry ? otEntry.score : 0.5,
      shapValue: 0,
      pathways: ["STRING interaction"],
      metadata: { openTargetsScore: otEntry?.score || null, isPrimary: true },
    });
  });

  // Add discovered genes from STRING DB
  stringData.forEach((interaction: StringInteraction) => {
    const a = interaction.preferredName_A;
    const b = interaction.preferredName_B;
    if (!nodeMap.has(a)) {
      nodeMap.set(a, {
        id: a, type: "gene", label: a, riskScore: 0.3,
        shapValue: 0, pathways: ["STRING interaction"], metadata: { fromStringDB: true },
      });
    }
    if (!nodeMap.has(b)) {
      nodeMap.set(b, {
        id: b, type: "gene", label: b, riskScore: 0.3,
        shapValue: 0, pathways: ["STRING interaction"], metadata: { fromStringDB: true },
      });
    }
  });

  const edges = stringData.map((interaction: StringInteraction) => ({
    source: interaction.preferredName_A,
    target: interaction.preferredName_B,
    confidence: interaction.score,
    interactionType: "physical",
    pathwayName: "STRING interaction",
    attentionWeight: interaction.score,
  }));

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
    metadata: {
      source: "STRING DB v12.0 + Open Targets",
      geneCount: nodeMap.size,
      edgeCount: edges.length,
    },
  };
}
