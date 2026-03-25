"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import type { KnowledgeGraphNode, KnowledgeGraphEdge } from "@/types/gene";
import { GENE_INFO } from "@/lib/mock-data";
import { X, ExternalLink, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeGraphProps {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  type: "gene" | "snp" | "pathway";
  label: string;
  riskScore: number;
  shapValue: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  confidence: number;
  interactionType: string;
  pathwayName: string;
  attentionWeight: number;
}

export default function KnowledgeGraph({ nodes, edges }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });

  const getNodeColor = useCallback((riskScore: number) => {
    if (riskScore < 0.3) return "#00D9FF";
    if (riskScore < 0.6) return "#FF6B35";
    return "#FF3232";
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.length > 0) {
      const matches = new Set(
        nodes
          .filter((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((n) => n.id)
      );
      setHighlightedNodes(matches);
    } else {
      setHighlightedNodes(new Set());
    }
  }, [searchQuery, nodes]);

  // D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // Create zoom group
    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Build simulation data
    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = edges.map((e) => ({
      source: e.source,
      target: e.target,
      confidence: e.confidence,
      interactionType: e.interactionType,
      pathwayName: e.pathwayName,
      attentionWeight: e.attentionWeight,
    }));

    // Force simulation configurations for biological layout
    const simulation = d3.forceSimulation(simNodes)
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance((d) => 120 + (1 - d.confidence) * 150))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    // SVG filters for sketch effect
    const defs = g.append("defs");
    const filter = defs.append("filter").attr("id", "kg-sketch");
    filter.append("feTurbulence").attr("type", "turbulence").attr("baseFrequency", "0.02 0.04").attr("numOctaves", "3").attr("result", "turb");
    filter.append("feDisplacementMap").attr("in", "SourceGraphic").attr("in2", "turb").attr("scale", "2");

    // Draw edges with stitch pattern
    const link = g.append("g")
      .selectAll("g")
      .data(simLinks)
      .join("g");

    // Main dashed line
    const linkLine = link.append("line")
      .attr("stroke", (d) => `rgba(0,217,255,${d.attentionWeight * 0.6})`)
      .attr("stroke-width", (d) => 1 + d.confidence * 2)
      .attr("stroke-dasharray", "6,4")
      .attr("filter", "url(#kg-sketch)");

    // Draw nodes
    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(simNodes)
      .join("g")
      .style("cursor", "pointer");

    // Apply drag behavior (separate call avoids D3 generic type mismatch)
    const dragBehavior = d3.drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    nodeGroup.each(function () {
      d3.select<SVGGElement, SimNode>(this as SVGGElement).call(dragBehavior);
    });

    // Gene nodes — circles with sketch filter
    nodeGroup.filter((d) => d.type === "gene").each(function (d) {
      const node = d3.select(this);
      const color = getNodeColor(d.riskScore);

      // Outer glow
      node.append("circle")
        .attr("r", 28)
        .attr("fill", `${color}15`)
        .attr("filter", "url(#kg-sketch)");

      // Main circle
      node.append("circle")
        .attr("r", 22)
        .attr("fill", `${color}20`)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", d.riskScore > 0.6 ? "none" : "4,2")
        .attr("filter", "url(#kg-sketch)");

      // Pulse animation for high-risk
      if (d.riskScore > 0.6) {
        node.append("circle")
          .attr("r", 22)
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 1)
          .attr("opacity", 0)
          .append("animate")
          .attr("attributeName", "r")
          .attr("values", "22;35")
          .attr("dur", "2s")
          .attr("repeatCount", "indefinite");

        node.select("circle:last-child")
          .append("animate")
          .attr("attributeName", "opacity")
          .attr("values", "0.5;0")
          .attr("dur", "2s")
          .attr("repeatCount", "indefinite");
      }

      // Label
      node.append("text")
        .text(d.label)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#fff")
        .attr("font-size", "10px")
        .attr("font-family", "'DM Mono', monospace");
    });

    // SNP nodes — diamonds
    nodeGroup.filter((d) => d.type === "snp").each(function (d) {
      const node = d3.select(this);
      node.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("x", -7)
        .attr("y", -7)
        .attr("transform", "rotate(45)")
        .attr("fill", "rgba(0,217,255,0.15)")
        .attr("stroke", "#00D9FF")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "3,2")
        .attr("filter", "url(#kg-sketch)");

      node.append("text")
        .text(d.label)
        .attr("text-anchor", "middle")
        .attr("dy", 22)
        .attr("fill", "#8892A4")
        .attr("font-size", "8px")
        .attr("font-family", "'DM Mono', monospace");
    });

    // Click handler
    nodeGroup.on("click", (_event, d) => {
      const original = nodes.find((n) => n.id === d.id);
      if (original) setSelectedNode(original);
    });

    // Tick update
    simulation.on("tick", () => {
      linkLine
        .attr("x1", (d) => (d.source as SimNode).x || 0)
        .attr("y1", (d) => (d.source as SimNode).y || 0)
        .attr("x2", (d) => (d.target as SimNode).x || 0)
        .attr("y2", (d) => (d.target as SimNode).y || 0);

      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, dimensions, getNodeColor]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(500, entry.contentRect.height),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[600px]">
      {/* Search bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 stitch-card px-3 py-2 w-64"
        style={{ background: "rgba(13,15,20,0.9)" }}>
        <Search size={14} className="text-neutral" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search gene..."
          className="bg-transparent font-mono text-xs text-white outline-none flex-1 placeholder:text-neutral/40"
        />
      </div>

      {/* Graph SVG */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />

      {/* Node detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute top-0 right-0 w-80 h-full z-20 stitch-card overflow-y-auto"
            style={{ background: "rgba(13,15,20,0.95)" }}
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline text-lg text-white">{selectedNode.label}</h3>
                <button onClick={() => setSelectedNode(null)} className="text-neutral hover:text-primary">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Risk badge */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-neutral">Risk Score:</span>
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: getNodeColor(selectedNode.riskScore) }}
                  >
                    {(selectedNode.riskScore * 100).toFixed(1)}%
                  </span>
                </div>

                {/* SHAP value */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-neutral">SHAP Value:</span>
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: selectedNode.shapValue > 0 ? "#FF6B35" : "#00FFA3" }}
                  >
                    {selectedNode.shapValue > 0 ? "+" : ""}{selectedNode.shapValue.toFixed(3)}
                  </span>
                </div>

                {/* Gene Info */}
                {GENE_INFO[selectedNode.label] && (
                  <div className="sticky-note p-3">
                    <p className="font-annotation text-sm text-sticky-yellow/80 leading-relaxed">
                      {GENE_INFO[selectedNode.label].function}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono text-[10px] text-neutral">
                        Chr {GENE_INFO[selectedNode.label].chromosome}
                      </span>
                      <a
                        href={`https://www.uniprot.org/uniprot/${GENE_INFO[selectedNode.label].uniprotId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-mono text-[10px] text-primary hover:underline"
                      >
                        UniProt <ExternalLink size={8} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Pathways */}
                <div>
                  <span className="font-mono text-xs text-neutral block mb-2">Pathways:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.pathways.map((p) => (
                      <span key={p} className="px-2 py-1 stitch-card font-mono text-[10px] text-primary">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
