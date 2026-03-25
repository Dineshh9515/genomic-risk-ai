import { NextResponse } from "next/server";
import { fetchGeneInfo } from "@/lib/bio-apis";

// GET /api/gene-info?gene=TCF7L2
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const geneSymbol = searchParams.get("gene");

  if (!geneSymbol) {
    return NextResponse.json({ error: "gene query param is required" }, { status: 400 });
  }

  try {
    const data = await fetchGeneInfo(geneSymbol);
    if (!data) {
      return NextResponse.json({ error: `Gene '${geneSymbol}' not found` }, { status: 404 });
    }

    return NextResponse.json({
      symbol: data.symbol,
      name: data.name,
      entrezGene: data.entrezgene,
      ensemblGene: data.ensembl?.gene,
      summary: data.summary,
      typeOfGene: data.type_of_gene,
      genomicPosition: data.genomic_pos
        ? {
            chromosome: data.genomic_pos.chr,
            start: data.genomic_pos.start,
            end: data.genomic_pos.end,
            strand: data.genomic_pos.strand,
          }
        : null,
      pathways: data.pathway?.kegg?.map((p: { id: string; name: string }) => ({
        id: p.id,
        name: p.name,
      })) || [],
      source: "mygene.info",
    });
  } catch {
    return NextResponse.json({ error: "mygene.info request failed" }, { status: 502 });
  }
}

// POST /api/gene-info — batch gene info
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { genes } = body;

    if (!genes || !Array.isArray(genes)) {
      return NextResponse.json({ error: "genes array is required" }, { status: 400 });
    }

    const results = await Promise.all(
      genes.map((gene: string) =>
        fetchGeneInfo(gene).catch(() => null)
      )
    );

    return NextResponse.json({
      genes: results.map((data, i) => ({
        query: genes[i],
        found: !!data,
        symbol: data?.symbol,
        name: data?.name,
        summary: data?.summary?.slice(0, 300),
        chromosome: data?.genomic_pos?.chr,
        pathways: data?.pathway?.kegg?.map((p: { name: string }) => p.name) || [],
      })),
      source: "mygene.info",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
