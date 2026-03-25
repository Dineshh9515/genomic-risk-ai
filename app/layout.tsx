import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GenomicRisk AI — Clinical-Grade T2DM Genomic Risk Prediction",
  description: "Predict Type 2 Diabetes risk at the genomic level using GNN + Transformer hybrid AI, SHAP explainability, and interactive gene knowledge graphs.",
  keywords: ["genomics", "type 2 diabetes", "risk prediction", "SHAP", "knowledge graph", "AI", "GNN"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-base text-white antialiased">
        {/* Global SVG Filters */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="sketch-filter">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.015 0.02"
                numOctaves="3"
                seed="2"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="3"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <filter id="sketch-filter-subtle">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.01 0.015"
                numOctaves="2"
                seed="5"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="1.5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
