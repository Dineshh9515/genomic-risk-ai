"use client";

import { useState, useEffect } from "react";
import KnowledgeGraph from "@/components/graph/KnowledgeGraph";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Command, Filter, Network, Loader2, Wifi, WifiOff } from "lucide-react";
import type { KnowledgeGraphNode, KnowledgeGraphEdge } from "@/types/gene";

const pathwayFilters = [
  "WNT signaling", "Energy homeostasis", "Zinc transport", "Lipid metabolism",
  "K-ATP channel", "tRNA modification", "mRNA stability", "Cell cycle",
  "Pancreas development", "Circadian rhythm", "STRING interaction",
];

export default function KnowledgeGraphPage() {
  const { currentAnalysis } = useAppStore();
  const genes = currentAnalysis?.genes || ["TCF7L2", "FTO", "SLC30A8", "PPARG", "KCNJ11", "CDKAL1", "IGF2BP2", "MTNR1B"];

  const [nodes, setNodes] = useState<KnowledgeGraphNode[]>([]);
  const [edges, setEdges] = useState<KnowledgeGraphEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>("loading...");
  const [error, setError] = useState<string | null>(null);

  const [activePathways, setActivePathways] = useState<Set<string>>(new Set(pathwayFilters));
  const [commandBarValue, setCommandBarValue] = useState("");

  // Fetch real data from STRING DB + Open Targets on mount
  useEffect(() => {
    async function fetchRealGraphData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/knowledge-graph", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ genes }),
        });

        if (!res.ok) throw new Error("Failed to load knowledge graph data");
        
        const data = await res.json();
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        
        const nodeCount = data.nodes?.length || 0;
        const edgeCount = data.edges?.length || 0;
        setDataSource(`STRING DB v12.0 + Open Targets (${nodeCount} nodes, ${edgeCount} connections)`);
      } catch (err) {
        console.error("Failed to fetch graph data:", err);
        setError("Failed to connect to Knowledge Graph API. Check your internet connection.");
        setDataSource("offline");
      } finally {
        setLoading(false);
      }
    }

    fetchRealGraphData();
  }, [genes]);

  const filteredNodes = nodes.filter(
    (n) => n.pathways.some((p) => activePathways.has(p)) || (n.metadata as Record<string, unknown>)?.isPrimary
  );
  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = edges.filter(
    (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  const togglePathway = (pathway: string) => {
    const next = new Set(activePathways);
    if (next.has(pathway)) next.delete(pathway);
    else next.add(pathway);
    setActivePathways(next);
  };

  return (
    <div className="max-w-full mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-3xl text-white mb-1">Gene Knowledge Graph</h2>
          <p className="font-annotation text-sticky-yellow/60 text-lg">
            real-time gene interaction network — powered by STRING DB &amp; Open Targets
          </p>
          <p className="font-mono text-xs text-neutral mt-3 max-w-3xl leading-relaxed">
            Nodes represent genes involved in your analysis. The dashed connection lines (edges) reveal 
            <strong className="text-white/80"> high-confidence biological interactions</strong> (score &gt; 0.70) backed by experimental data, 
            co-expression, and automated text-mining. Thicker, brighter lines indicate a higher level of evidence 
            that the two genes operate in the same functional pathway or physically interact.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dataSource !== "loading..." && dataSource !== "offline" ? (
            <span className="flex items-center gap-1.5 font-mono text-xs text-safe">
              <Wifi size={12} /> LIVE DATA
            </span>
          ) : dataSource === "offline" ? (
            <span className="flex items-center gap-1.5 font-mono text-xs text-danger">
              <WifiOff size={12} /> OFFLINE
            </span>
          ) : null}
          <span className="font-mono text-xs text-neutral">{filteredNodes.length} nodes · {filteredEdges.length} edges</span>
        </div>
      </motion.div>

      {/* Data source banner */}
      {dataSource !== "loading..." && dataSource !== "offline" && (
        <div className="px-4 py-2 rounded bg-safe/5 border border-dashed border-safe/20">
          <p className="font-mono text-[11px] text-safe/80">📡 {dataSource}</p>
        </div>
      )}

      {/* Command bar */}
      <div className="flex items-center gap-2 stitch-card px-4 py-3">
        <Command size={14} className="text-primary" />
        <input
          type="text"
          value={commandBarValue}
          onChange={(e) => setCommandBarValue(e.target.value)}
          placeholder="Query: 'Show genes in insulin secretion pathway with risk > 0.3'"
          className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral/30"
        />
        <kbd className="px-2 py-0.5 rounded bg-white/5 font-mono text-[10px] text-neutral">⌘K</kbd>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/5 border border-dashed border-danger/20">
          <p className="font-mono text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        {/* Filter panel */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="w-48 flex-shrink-0 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={14} className="text-primary" />
            <span className="font-mono text-xs text-neutral">Pathways</span>
          </div>
          {pathwayFilters.map((pathway) => (
            <label key={pathway} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={activePathways.has(pathway)} onChange={() => togglePathway(pathway)} className="rounded border-panel-border accent-primary" />
              <span className="font-mono text-[11px] text-neutral group-hover:text-white transition-colors">{pathway}</span>
            </label>
          ))}
        </motion.div>

        {/* Graph */}
        <div className="flex-1 stitch-card overflow-hidden relative">
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <Loader2 size={32} className="text-primary animate-spin mx-auto mb-4" />
                <p className="font-headline text-lg text-white mb-1">Fetching real-time data...</p>
                <p className="font-mono text-xs text-neutral">
                  Querying STRING DB &amp; Open Targets for {genes.length} genes
                </p>
              </div>
            </div>
          ) : (
            <KnowledgeGraph nodes={filteredNodes} edges={filteredEdges} />
          )}
        </div>
      </div>
    </div>
  );
}
