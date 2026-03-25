"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import CommandBar from "@/components/layout/CommandBar";
import { useAppStore } from "@/lib/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
      <CommandBar />
    </div>
  );
}
