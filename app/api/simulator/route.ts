import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { geneOverrides, baselineScore, shapValues } = body;

    // Lightweight counterfactual using linear SHAP approximation
    let modifiedScore = baselineScore;

    for (const [gene, override] of Object.entries(geneOverrides)) {
      const ov = override as { included: boolean; allele: string; originalAllele: string };
      const sv = (shapValues as Array<{ gene: string; value: number }>)?.find(
        (s) => s.gene === gene
      );
      if (!sv) continue;

      if (!ov.included) {
        modifiedScore -= sv.value * 0.8;
      } else if (ov.allele !== ov.originalAllele) {
        modifiedScore -= Math.abs(sv.value) * 0.5;
      }
    }

    modifiedScore = Math.max(0, Math.min(1, modifiedScore));
    const delta = modifiedScore - baselineScore;
    const category =
      modifiedScore < 0.25 ? "low" :
      modifiedScore < 0.5 ? "moderate" :
      modifiedScore < 0.75 ? "high" : "critical";

    return NextResponse.json({
      counterfactualScore: modifiedScore,
      delta,
      category,
      method: "Linear SHAP approximation (real-time)",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
