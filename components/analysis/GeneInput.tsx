"use client";

import { useState, useCallback } from "react";
import { Search, X, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GeneInputProps {
  selectedGenes: string[];
  onGenesChange: (genes: string[]) => void;
}

interface SearchResult {
  geneName: string;
  proteinName: string;
  organism: string;
  accession: string;
}

export default function GeneInput({ selectedGenes, onGenesChange }: GeneInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchGenes = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      // Use UniProt API for real gene search
      const res = await fetch(
        `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(term)}+AND+organism_id:9606&format=json&size=8&fields=gene_names,protein_name,organism_name,accession`
      );
      const data = await res.json();
      const mapped: SearchResult[] = (data.results || []).map((r: Record<string, unknown>) => {
        const genes = r.genes as Array<{ geneName?: { value: string } }> | undefined;
        const proteinDesc = r.proteinDescription as { recommendedName?: { fullName?: { value: string } } } | undefined;
        return {
          geneName: genes?.[0]?.geneName?.value || "Unknown",
          proteinName: proteinDesc?.recommendedName?.fullName?.value || "Unknown protein",
          organism: "Homo sapiens",
          accession: (r.primaryAccession as string) || "",
        };
      });
      setResults(mapped);
      setShowDropdown(true);
    } catch {
      // Fallback to common T2DM genes
      const fallback = ["TCF7L2", "FTO", "SLC30A8", "PPARG", "KCNJ11", "CDKAL1", "IGF2BP2", "MTNR1B", "HHEX", "CDKN2A"]
        .filter((g) => g.toLowerCase().includes(term.toLowerCase()))
        .map((g) => ({ geneName: g, proteinName: "T2DM associated gene", organism: "Homo sapiens", accession: "" }));
      setResults(fallback);
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const addGene = (gene: string) => {
    if (!selectedGenes.includes(gene)) {
      onGenesChange([...selectedGenes, gene]);
    }
    setQuery("");
    setShowDropdown(false);
  };

  const removeGene = (gene: string) => {
    onGenesChange(selectedGenes.filter((g) => g !== gene));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-headline text-lg text-white">Gene Selection</h3>
        <span className="font-annotation text-sticky-yellow/60 text-sm">
          search via UniProt API (real-time)
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center gap-2 stitch-card px-4 py-3">
          <Search size={16} className="text-neutral" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              searchGenes(e.target.value);
            }}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            placeholder="Search gene name (e.g., TCF7L2, FTO, PPARG)..."
            className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-neutral/50 outline-none"
          />
          {loading && <Loader2 size={16} className="text-primary animate-spin" />}
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && results.length > 0 && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-1 z-50 stitch-card overflow-hidden"
              style={{ background: "rgba(13,15,20,0.98)" }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {results.map((result) => (
                <button
                  key={result.accession || result.geneName}
                  onClick={() => addGene(result.geneName)}
                  disabled={selectedGenes.includes(result.geneName)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors border-b border-panel-border last:border-0 disabled:opacity-30"
                >
                  <Plus size={14} className="text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-white font-medium">{result.geneName}</span>
                      {selectedGenes.includes(result.geneName) && (
                        <span className="text-[10px] font-mono text-primary">ADDED</span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-neutral truncate">{result.proteinName}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected genes */}
      {selectedGenes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGenes.map((gene) => (
            <motion.span
              key={gene}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 stitch-card font-mono text-sm text-primary"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {gene}
              <button onClick={() => removeGene(gene)} className="hover:text-danger transition-colors">
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* Quick add - common T2DM genes */}
      <div>
        <p className="font-annotation text-sticky-yellow/40 text-xs mb-2">
          Quick add — common T2DM risk genes:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["TCF7L2", "FTO", "SLC30A8", "PPARG", "KCNJ11", "CDKAL1", "IGF2BP2", "MTNR1B"].map((gene) => (
            <button
              key={gene}
              onClick={() => addGene(gene)}
              disabled={selectedGenes.includes(gene)}
              className="px-2 py-1 font-mono text-xs border border-dashed border-panel-border text-neutral hover:text-primary hover:border-stitch-border transition-all disabled:opacity-20 disabled:cursor-not-allowed rounded"
            >
              + {gene}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
