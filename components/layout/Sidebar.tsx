"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  Network,
  SlidersHorizontal,
  History,
  GitCompare,
  Settings,
  Dna,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analysis/new", label: "New Analysis", icon: FlaskConical },
  { href: "/knowledge-graph", label: "Knowledge Graph", icon: Network },
  { href: "/simulator", label: "What-If Simulator", icon: SlidersHorizontal },
  { href: "/history", label: "History", icon: History },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
      style={{
        background: "rgba(13,15,20,0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Stitched seam right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-[2px] stitched-seam-right" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 h-16 border-b border-panel-border transition-colors hover:bg-white/[0.02]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #00D9FF, #39FF14)" }}>
          <Dna size={18} className="text-base" />
        </div>
        {sidebarOpen && (
          <span className="font-headline text-lg text-primary tracking-wide">
            GenomicRisk
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary border border-dashed border-stitch-border"
                  : "text-neutral hover:text-primary hover:bg-white/[0.02]"
              }`}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? "text-primary" : "text-neutral group-hover:text-primary"
                }`}
              />
              {sidebarOpen && (
                <span className="text-sm font-mono truncate">{item.label}</span>
              )}
              {isActive && sidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-12 border-t border-panel-border text-neutral hover:text-primary transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Footer annotation */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-t border-panel-border">
          <p className="font-annotation text-sticky-yellow/60 text-xs">
            v0.1.0 — Lab Notebook Edition
          </p>
        </div>
      )}
    </aside>
  );
}
