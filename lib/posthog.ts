import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
}

export const EVENTS = {
  ANALYSIS_STARTED: "analysis_started",
  ANALYSIS_COMPLETED: "analysis_completed",
  SIMULATOR_USED: "simulator_used",
  KNOWLEDGE_GRAPH_QUERIED: "knowledge_graph_queried",
  VARIANT_SUGGESTION_VIEWED: "variant_suggestion_viewed",
  PDF_EXPORTED: "pdf_exported",
  COMPARISON_STARTED: "comparison_started",
} as const;

export default posthog;
