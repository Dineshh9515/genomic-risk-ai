import { NextResponse } from "next/server";
import { fetchStringInteractions, fetchOpenTargetsT2DM } from "@/lib/bio-apis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genes = searchParams.get("genes")?.split(",") || ["TCF7L2", "FTO", "PPARG", "KCNJ11", "SLC30A8"];

  // Fetch real STRING DB interaction data
  const [interactionsResult, otResult] = await Promise.allSettled([
    fetchStringInteractions(genes),
    fetchOpenTargetsT2DM(genes),
  ]);

  const interactions = interactionsResult.status === "fulfilled" ? interactionsResult.value : [];
  const otScores = otResult.status === "fulfilled" ? otResult.value : [];

  // Build Open Targets score lookup
  const scoreMap: Record<string, number> = {};
  otScores.forEach((row: { target: { approvedSymbol: string }; score: number }) => {
    scoreMap[row.target.approvedSymbol] = row.score;
  });

  // Transform STRING interactions into epistasis-like pairs
  const pairs = interactions.map((interaction) => ({
    gene1: interaction.preferredName_A,
    gene2: interaction.preferredName_B,
    interactionScore: interaction.score / 1000,
    combinedRiskDelta:
      ((scoreMap[interaction.preferredName_A] || 0.1) +
        (scoreMap[interaction.preferredName_B] || 0.1)) * 0.2,
    pathway: "STRING DB interaction (experimental + text-mining evidence)",
    experimentalScore: interaction.escore / 1000,
    textMiningScore: interaction.tscore / 1000,
    databaseScore: interaction.dscore / 1000,
  }));

  return NextResponse.json({
    pairs,
    method: "STRING DB v12.0 interactions + Open Targets enrichment",
    source: "Real gene-gene interaction data",
    totalInteractions: interactions.length,
  });
}
