import { NextResponse } from "next/server";
import { buildRealKnowledgeGraph, fetchGWASAssociations } from "@/lib/bio-apis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { genes } = body;

    if (!genes || !Array.isArray(genes) || genes.length === 0) {
      return NextResponse.json({ error: "genes array is required" }, { status: 400 });
    }

    // Build knowledge graph from real STRING DB + Open Targets data
    const graph = await buildRealKnowledgeGraph(genes);

    return NextResponse.json({
      nodes: graph.nodes,
      edges: graph.edges,
      metadata: graph.metadata,
    });
  } catch (error) {
    console.error("Knowledge graph error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET endpoint for fetching GWAS associations for a specific variant
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rsid = searchParams.get("rsid");

  if (!rsid) {
    return NextResponse.json({ error: "rsid query param is required" }, { status: 400 });
  }

  try {
    const data = await fetchGWASAssociations(rsid);
    return NextResponse.json({ rsid, associations: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch GWAS data" }, { status: 502 });
  }
}
