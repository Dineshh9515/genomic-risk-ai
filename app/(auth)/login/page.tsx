"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dna, Mail, Lock, Github, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setError(null);
    
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 cursor-pointer hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #00D9FF, #39FF14)" }}>
            <Dna size={28} className="text-base" />
          </Link>
          <h1 className="font-headline text-3xl text-white mb-1">Welcome Back</h1>
          <p className="font-annotation text-sticky-yellow/60">
            return to your lab notebook
          </p>
        </div>

        <div className="stitch-card p-8 space-y-6">
          {error && (
            <div className="p-3 bg-danger/10 border border-dashed border-danger/30 rounded text-danger text-sm font-mono text-center">
              {error}
            </div>
          )}

          {/* Social login */}
          <div className="space-y-3">
            <button 
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-dashed border-panel-border rounded text-white hover:border-stitch-border hover:bg-white/[0.02] transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome size={18} /> Continue with Google
            </button>
            <button 
              onClick={() => handleOAuthLogin("github")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-dashed border-panel-border rounded text-white hover:border-stitch-border hover:bg-white/[0.02] transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github size={18} /> Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-panel-border" />
            <span className="font-mono text-xs text-neutral">or</span>
            <div className="flex-1 h-[1px] bg-panel-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-neutral block mb-1">Email</label>
              <div className="flex items-center gap-2 border border-dashed border-panel-border rounded px-3 py-2 focus-within:border-stitch-border transition-colors">
                <Mail size={14} className="text-neutral" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="researcher@lab.edu"
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral/40" 
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-neutral block mb-1">Password</label>
              <div className="flex items-center gap-2 border border-dashed border-panel-border rounded px-3 py-2 focus-within:border-stitch-border transition-colors">
                <Lock size={14} className="text-neutral" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral/40" 
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={14} /></>}
            </button>
          </form>

          <p className="text-center font-mono text-xs text-neutral">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
