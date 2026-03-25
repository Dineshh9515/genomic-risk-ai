"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, User, Command, Settings, LogOut, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analysis/new": "New Analysis",
  "/knowledge-graph": "Knowledge Graph",
  "/simulator": "What-If Simulator",
  "/history": "Analysis History",
  "/compare": "Patient Comparison",
  "/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setCommandBarOpen } = useAppStore();
  const supabase = createClient();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // Real user state
  const [user, setUser] = useState<any>(null);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const title = Object.entries(routeTitles).find(
    ([path]) => pathname === path || pathname?.startsWith(path + "/")
  )?.[1] || "GenomicRisk AI";

  // Fetch logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    // Listen to changes (e.g., signup/signout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowProfile(false);
    setUser(null);
    router.push("/login");
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Dr. Researcher";
  const displayEmail = user?.email || "researcher@lab.edu";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-panel-border bg-base/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="font-headline text-xl text-white/90">{title}</h1>
        <span className="font-annotation text-sticky-yellow/50 text-sm hidden sm:block">
          // lab notebook
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Command bar shortcut */}
        <button
          onClick={() => setCommandBarOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-dashed border-panel-border text-neutral hover:text-primary hover:border-stitch-border transition-all text-xs font-mono"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search genes...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 text-[10px]">
            <Command size={10} />K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-lg text-neutral hover:text-primary hover:bg-white/[0.03] transition-all"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-bio-green animate-pulse" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 glass-panel border border-panel-border rounded-lg shadow-xl overflow-hidden py-2"
              >
                <div className="px-4 py-2 border-b border-panel-border flex items-center justify-between">
                  <span className="font-headline text-lg text-white">Notifications</span>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">1 new</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer border-l-2 border-primary">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-primary/10 rounded-full text-primary">
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-white font-mono">Analysis Complete</p>
                        <p className="text-xs text-neutral mt-0.5 leading-relaxed">
                          Your analysis for Patient Alpha is ready to view. Contains 3 new variant insights.
                        </p>
                        <p className="text-[10px] text-neutral/50 mt-1 font-mono">Just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4 text-center">
                    <p className="text-xs text-neutral font-mono">No other notifications</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg text-neutral hover:text-primary hover:bg-white/[0.03] transition-all"
          >
            <div className="w-8 h-8 rounded-full border border-dashed border-stitch-border flex items-center justify-center bg-primary/10 overflow-hidden">
              {avatarUrl ? (
                 <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-primary" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 glass-panel border border-panel-border rounded-lg shadow-xl py-2"
              >
                <div className="px-4 py-3 border-b border-panel-border mb-2">
                  <p className="font-mono text-sm text-white font-medium truncate">{displayName}</p>
                  <p className="font-mono text-xs text-neutral truncate">{displayEmail}</p>
                </div>
                
                <div className="px-2">
                  <button
                    onClick={() => {
                      router.push("/settings");
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded text-neutral hover:text-white hover:bg-white/[0.04] transition-colors font-mono text-sm"
                  >
                    <Settings size={14} /> Account Settings
                  </button>
                  <div className="h-px bg-panel-border my-1 mx-2" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded text-danger/80 hover:text-danger hover:bg-danger/10 transition-colors font-mono text-sm"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
