"use client";

import { useAppStore } from "@/lib/store";
import RiskReport from "@/components/analysis/RiskReport";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Network, SlidersHorizontal } from "lucide-react";

export default function AnalysisDetailPage() {
  const params = useParams();
  const { analyses } = useAppStore();
  const analysis = analyses.find((a) => a.id === params.id);

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="font-headline text-2xl text-white mb-4">Analysis Not Found</h2>
        <p className="font-mono text-sm text-neutral mb-6">
          The analysis you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-mono text-sm text-neutral hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/knowledge-graph" className="btn-outline flex items-center gap-2 text-xs py-2 px-3">
            <Network size={14} /> View Knowledge Graph
          </Link>
          <Link href="/simulator" className="btn-outline flex items-center gap-2 text-xs py-2 px-3">
            <SlidersHorizontal size={14} /> What-If Simulator
          </Link>
        </div>
      </div>

      <RiskReport analysis={analysis} />
    </div>
  );
}
