"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dna,
  Brain,
  Network,
  Shield,
  SlidersHorizontal,
  FileText,
  GitCompare,
  Microscope,
  FlaskConical,
  ArrowRight,
  Zap,
  Database,
} from "lucide-react";
import PencilDivider from "@/components/layout/PencilDivider";

const features = [
  { icon: Brain, title: "GNN + Transformer AI", desc: "Hybrid deep learning pipeline combining Graph Attention Networks with DNABERT-2 embeddings for epistasis-aware risk scoring.", height: "h-72" },
  { icon: Network, title: "Interactive Knowledge Graph", desc: "Explore gene interactions powered by STRING DB with hand-sketched nodes, stitch-pattern edges, and pathway clustering.", height: "h-80" },
  { icon: Shield, title: "SHAP Explainability", desc: "Waterfall and beeswarm visualizations showing exactly which genes push your risk score up or down, with biological annotations.", height: "h-64" },
  { icon: SlidersHorizontal, title: "What-If Simulator", desc: "Toggle genes, swap alleles, and watch your risk score update in real-time. Counterfactual analysis at your fingertips.", height: "h-72" },
  { icon: GitCompare, title: "Patient Comparison", desc: "Side-by-side comparison of two analyses with diff highlighting. Identify unique genetic risk factors between patients.", height: "h-56" },
  { icon: FileText, title: "Clinical PDF Reports", desc: "Export publication-quality reports with risk gauges, SHAP charts, variant tables, and clinical methodology notes.", height: "h-68" },
];

const steps = [
  { icon: FlaskConical, label: "Input Genes", desc: "Select genes of interest" },
  { icon: Dna, label: "DNABERT-2 Embed", desc: "Generate sequence embeddings" },
  { icon: Network, label: "GAT Model", desc: "Graph attention inference" },
  { icon: Microscope, label: "SHAP Attribution", desc: "Explain predictions" },
  { icon: FileText, label: "Risk Report", desc: "Generate clinical report" },
];

const techStack = [
  { name: "Supabase", role: "Database, Auth & Row Level Security" },
  { name: "Pinecone", role: "Vector search for gene embeddings" },
  { name: "Inngest", role: "Background job orchestration" },
  { name: "Stripe", role: "Subscription billing (Free/Pro/Research)" },
  { name: "Resend", role: "Transactional email delivery" },
  { name: "PostHog", role: "Product analytics & event tracking" },
  { name: "Sentry", role: "Error tracking & monitoring" },
  { name: "STRING DB", role: "Real gene-gene interaction data" },
  { name: "UniProt", role: "Gene & protein annotation" },
  { name: "ClinVar", role: "Variant clinical significance" },
  { name: "GWAS Catalog", role: "Genome-wide association studies" },
  { name: "Open Targets", role: "Gene-disease evidence scores" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Animated DNA Helix Background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={i}>
                <circle
                  cx={400 + Math.sin((i / 20) * Math.PI * 4) * 120}
                  cy={30 * i}
                  r={4}
                  fill="#00D9FF"
                  opacity={0.6}
                >
                  <animate attributeName="cy" values={`${30 * i};${30 * i + 600};${30 * i}`} dur="8s" repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${400 + Math.sin((i / 20) * Math.PI * 4) * 120};${400 - Math.sin((i / 20) * Math.PI * 4) * 120};${400 + Math.sin((i / 20) * Math.PI * 4) * 120}`} dur="4s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx={400 - Math.sin((i / 20) * Math.PI * 4) * 120}
                  cy={30 * i}
                  r={4}
                  fill="#39FF14"
                  opacity={0.4}
                >
                  <animate attributeName="cy" values={`${30 * i};${30 * i + 600};${30 * i}`} dur="8s" repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${400 - Math.sin((i / 20) * Math.PI * 4) * 120};${400 + Math.sin((i / 20) * Math.PI * 4) * 120};${400 - Math.sin((i / 20) * Math.PI * 4) * 120}`} dur="4s" repeatCount="indefinite" />
                </circle>
                {i < 19 && (
                  <line
                    x1={400 + Math.sin((i / 20) * Math.PI * 4) * 120}
                    y1={30 * i}
                    x2={400 - Math.sin((i / 20) * Math.PI * 4) * 120}
                    y2={30 * i}
                    stroke="#00D9FF"
                    strokeWidth="0.5"
                    opacity={0.2}
                  >
                    <animate attributeName="y1" values={`${30 * i};${30 * i + 600};${30 * i}`} dur="8s" repeatCount="indefinite" />
                    <animate attributeName="y2" values={`${30 * i};${30 * i + 600};${30 * i}`} dur="8s" repeatCount="indefinite" />
                  </line>
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full stitch-card mb-8 text-xs font-mono text-primary">
              <Zap size={12} />
              Powered by GNN + Transformer Hybrid AI
            </div>

            <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl text-white leading-tight mb-6">
              Your DNA.{" "}
              <span className="bg-gradient-to-r from-primary to-bio-green bg-clip-text text-transparent">
                Decoded.
              </span>{" "}
              <span className="text-primary">Defended.</span>
            </h1>

            <div className="font-mono text-neutral text-lg sm:text-xl mb-10 flex items-center justify-center gap-1">
              <span className="text-primary">&gt;</span>
              <span>Predicting Type 2 Diabetes risk at the genomic level</span>
              <span className="w-[2px] h-5 bg-primary animate-blink" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/analysis/new" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                Start Free Analysis <ArrowRight size={16} />
              </Link>
              <Link href="/dashboard" className="btn-outline flex items-center gap-2 text-base px-8 py-3">
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral/40">
          <span className="font-annotation text-sm">scroll to explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-primary/40 to-transparent" />
        </div>
      </section>

      <PencilDivider />

      {/* ===== FEATURES ===== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl sm:text-5xl text-white mb-4">
            Clinical-Grade Analysis Tools
          </h2>
          <p className="font-annotation text-sticky-yellow/70 text-xl">
            every tool a genomics researcher needs, in one platform
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`stitch-card p-6 break-inside-avoid ${feature.height}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-dashed border-stitch-border flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-headline text-xl text-white mb-2">{feature.title}</h3>
                <p className="font-mono text-sm text-neutral leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <PencilDivider />

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl sm:text-5xl text-white mb-4">
            How It Works
          </h2>
          <p className="font-annotation text-sticky-yellow/70 text-xl">
            from raw genes to actionable clinical insight in 5 steps
          </p>
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-start justify-between gap-4">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-[2px]"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, rgba(0,217,255,0.3) 0px, rgba(0,217,255,0.3) 8px, transparent 8px, transparent 16px)",
            }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center flex-1"
              >
                <div className="w-16 h-16 rounded-full bg-base border-2 border-dashed border-stitch-border flex items-center justify-center mb-4 z-10">
                  <Icon size={24} className="text-primary" />
                </div>
                <span className="font-annotation text-sticky-yellow text-xs mb-1">Step {i + 1}</span>
                <h3 className="font-mono text-sm text-white font-medium mb-1">{step.label}</h3>
                <p className="font-mono text-xs text-neutral">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <PencilDivider />

      {/* ===== TECH STACK ===== */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-headline text-4xl text-white mb-4">Integrated Stack</h2>
          <p className="font-annotation text-sticky-yellow/70 text-lg">
            real APIs, real data, production-grade infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="stitch-card p-4 group relative"
            >
              <div className="flex items-center gap-2 mb-1">
                <Database size={14} className="text-primary" />
                <span className="font-mono text-sm text-white">{tech.name}</span>
              </div>
              <p className="font-mono text-xs text-neutral">{tech.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-panel-border py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00D9FF, #39FF14)" }}>
              <Dna size={16} className="text-base" />
            </div>
            <span className="font-headline text-lg text-primary">GenomicRisk AI</span>
          </div>
          <p className="font-annotation text-neutral/50 text-sm">
            Where DNA meets intelligence. Built for researchers, by researchers.
          </p>
          <p className="font-mono text-xs text-neutral/30">
            © 2024 GenomicRisk AI
          </p>
        </div>
      </footer>
    </div>
  );
}
