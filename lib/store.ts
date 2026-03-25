import { create } from "zustand";
import type { AnalysisResult, SimulatorScenario, GeneOverride } from "@/types/analysis";
import { DEMO_ANALYSES } from "@/lib/mock-data";

interface AppState {
  // Current analysis
  currentAnalysis: AnalysisResult | null;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;

  // Analysis history
  analyses: AnalysisResult[];
  addAnalysis: (analysis: AnalysisResult) => void;

  // Simulator state
  simulatorOverrides: Record<string, GeneOverride>;
  setOverride: (gene: string, override: GeneOverride) => void;
  resetOverrides: () => void;
  simulatorHistory: SimulatorScenario[];
  addSimulatorSnapshot: (scenario: SimulatorScenario) => void;

  // Comparison
  compareIds: [string | null, string | null];
  setCompareIds: (ids: [string | null, string | null]) => void;

  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  commandBarOpen: boolean;
  setCommandBarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentAnalysis: DEMO_ANALYSES[0],
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  analyses: DEMO_ANALYSES,
  addAnalysis: (analysis) =>
    set((state) => ({ analyses: [analysis, ...state.analyses] })),

  simulatorOverrides: {},
  setOverride: (gene, override) =>
    set((state) => ({
      simulatorOverrides: { ...state.simulatorOverrides, [gene]: override },
    })),
  resetOverrides: () => set({ simulatorOverrides: {} }),
  simulatorHistory: [],
  addSimulatorSnapshot: (scenario) =>
    set((state) => ({
      simulatorHistory: [scenario, ...state.simulatorHistory].slice(0, 5),
    })),

  compareIds: [null, null],
  setCompareIds: (ids) => set({ compareIds: ids }),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  commandBarOpen: false,
  setCommandBarOpen: (open) => set({ commandBarOpen: open }),
}));
