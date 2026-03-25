import { NextResponse } from "next/server";
import { fetchClinVarData, fetchVariantInfo, fetchGWASAssociations } from "@/lib/bio-apis";

// GET /api/variant?rsid=rs7903146
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rsid = searchParams.get("rsid");

  if (!rsid) {
    return NextResponse.json({ error: "rsid query param is required" }, { status: 400 });
  }

  try {
    // Fetch from all three variant sources in parallel
    const [clinvar, myvariant, gwas] = await Promise.allSettled([
      fetchClinVarData(rsid),
      fetchVariantInfo(rsid),
      fetchGWASAssociations(rsid),
    ]);

    return NextResponse.json({
      rsid,
      clinvar: clinvar.status === "fulfilled" ? clinvar.value : null,
      myvariant: myvariant.status === "fulfilled"
        ? {
            clinvarSignificance: myvariant.value?.clinvar?.rcv?.[0]?.clinical_significance,
            cadd: myvariant.value?.cadd?.phred,
            dbsnp: {
              alleles: myvariant.value?.dbsnp?.alleles,
              chrom: myvariant.value?.dbsnp?.chrom,
              gene: myvariant.value?.dbsnp?.gene,
            },
          }
        : null,
      gwas: gwas.status === "fulfilled" ? gwas.value : null,
      sources: ["ClinVar (NCBI)", "myvariant.info", "GWAS Catalog (EBI)"],
    });
  } catch (error) {
    return NextResponse.json({ error: "Variant lookup failed" }, { status: 502 });
  }
}
