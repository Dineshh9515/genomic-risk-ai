"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FlaskConical, Network, SlidersHorizontal, Settings, X, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function CommandBar() {
  const { commandBarOpen, setCommandBarOpen } = useAppStore();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandBarOpen(!commandBarOpen);
      }
      if (e.key === "Escape") {
        setCommandBarOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandBarOpen, setCommandBarOpen]);

  // Focus input on open
  useEffect(() => {
    if (commandBarOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setSearchResults([]);
    }
  }, [commandBarOpen]);

  // Handle search (debounced)
  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/gene-info?gene=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults([data]);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAction = (action: () => void) => {
    setCommandBarOpen(false);
    action();
  };

  return (
    <AnimatePresence>
      {commandBarOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandBarOpen(false)}
            className="absolute inset-0 bg-base/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-base border border-panel-border rounded-lg shadow-2xl overflow-hidden glass-panel"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-panel-border">
              <Search size={18} className="text-primary mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search genes, navigate, or run commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-neutral/50"
              />
              <button
                onClick={() => setCommandBarOpen(false)}
                className="p-1 text-neutral hover:text-white transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Area */}
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {query.length > 0 ? (
                // Search Results
                <div className="px-2">
                  <div className="px-2 py-1 text-xs font-mono text-neutral/60 mb-1">
                    Gene Search ({query})
                  </div>
                  {searching ? (
                    <div className="flex items-center justify-center py-8 text-neutral">
                      <Loader2 size={24} className="animate-spin text-primary" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((gene) => (
                      <button
                        key={gene.symbol}
                        onClick={() => handleAction(() => router.push(`/analysis/new`))}
                        className="w-full text-left px-3 py-3 rounded hover:bg-white/[0.04] transition-colors group flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-headline text-lg text-primary">{gene.symbol}</span>
                          <span className="font-mono text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Hit Enter to add</span>
                        </div>
                        <span className="font-mono text-xs text-neutral truncate max-w-full">
                          {gene.name || "Unknown protein"}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-sm font-mono text-neutral/70">
                      No genes found matching "{query}"
                    </div>
                  )}
                </div>
              ) : (
                // Default Navigation
                <div className="px-2">
                  <div className="px-2 py-1 text-xs font-mono text-neutral/60 mb-1">
                    Quick Navigation
                  </div>
                  
                  <button
                    onClick={() => handleAction(() => router.push("/analysis/new"))}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-neutral hover:text-white hover:bg-white/[0.04] transition-colors group"
                  >
                    <FlaskConical size={16} className="text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="font-mono text-sm">New Analysis</span>
                  </button>

                  <button
                    onClick={() => handleAction(() => router.push("/knowledge-graph"))}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-neutral hover:text-white hover:bg-white/[0.04] transition-colors group"
                  >
                    <Network size={16} className="text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="font-mono text-sm">Knowledge Graph</span>
                  </button>

                  <button
                    onClick={() => handleAction(() => router.push("/simulator"))}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-neutral hover:text-white hover:bg-white/[0.04] transition-colors group"
                  >
                    <SlidersHorizontal size={16} className="text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="font-mono text-sm">What-If Simulator</span>
                  </button>
                  
                  <button
                    onClick={() => handleAction(() => router.push("/settings"))}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-neutral hover:text-white hover:bg-white/[0.04] transition-colors group"
                  >
                    <Settings size={16} className="text-neutral group-hover:text-white transition-colors" />
                    <span className="font-mono text-sm">Settings</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-panel-border bg-base flex justify-between items-center text-[10px] font-mono text-neutral/60">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↑</kbd><kbd className="bg-white/10 px-1 rounded">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↵</kbd> to select</span>
              </div>
              <span><kbd className="bg-white/10 px-1 rounded">ESC</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
