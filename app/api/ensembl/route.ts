import { NextResponse } from "next/server";
import { fetchEnsemblVariant, fetchEnsemblGeneLocation } from "@/lib/bio-apis";

// GET /api/ensembl?type=variant&id=rs7903146
// GET /api/ensembl?type=gene&id=TCF7L2
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "variant";
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }

  try {
    if (type === "gene") {
      const data = await fetchEnsemblGeneLocation(id);
      if (!data) return NextResponse.json({ error: "Gene not found" }, { status: 404 });
      return NextResponse.json({
        gene: id,
        chromosome: data.seq_region_name,
        start: data.start,
        end: data.end,
        strand: data.strand,
        biotype: data.biotype,
        description: data.description,
        ensemblId: data.id,
        source: "Ensembl REST API",
      });
    } else {
      const data = await fetchEnsemblVariant(id);
      if (!data) return NextResponse.json({ error: "Variant not found" }, { status: 404 });
      return NextResponse.json({
        rsid: id,
        name: data.name,
        source: data.source,
        mappings: data.mappings,
        ancestralAllele: data.ancestral_allele,
        minorAllele: data.minor_allele,
        maf: data.MAF,
        populations: data.populations?.slice(0, 10),
        apiSource: "Ensembl REST API",
      });
    }
  } catch {
    return NextResponse.json({ error: "Ensembl API request failed" }, { status: 502 });
  }
}
