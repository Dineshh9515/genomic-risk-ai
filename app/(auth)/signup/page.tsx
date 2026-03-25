"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dna, Mail, Lock, User, Github, Chrome, ArrowRight, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordValid = password.length >= 8;
  const emailValid = email.includes("@") && email.includes(".");

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || !passwordValid || !name) {
      setError("Please fill in all fields correctly.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Wait a moment then redirect or tell them to check email (if confirm required)
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    }
  };

  const handleOAuthSignup = async (provider: "google" | "github") => {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 cursor-pointer hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #00D9FF, #39FF14)" }}>
            <Dna size={28} className="text-base" />
          </Link>
          <h1 className="font-headline text-3xl text-white mb-1">Create Account</h1>
          <p className="font-annotation text-sticky-yellow/60">start your genomic research journey</p>
        </div>

        <div className="stitch-card p-8 space-y-6">
          {error && (
            <div className="p-3 bg-danger/10 border border-dashed border-danger/30 rounded text-danger text-sm font-mono text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-safe/10 border border-dashed border-safe/30 rounded text-safe text-sm font-mono text-center">
              Success! Taking you to the dashboard...
              <br />
              <span className="text-xs text-white/60">(If you have email confirmations enabled in Supabase, please check your inbox.)</span>
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={() => handleOAuthSignup("google")}
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-dashed border-panel-border rounded text-white hover:border-stitch-border hover:bg-white/[0.02] transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome size={18} /> Sign up with Google
            </button>
            <button 
              onClick={() => handleOAuthSignup("github")}
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-dashed border-panel-border rounded text-white hover:border-stitch-border hover:bg-white/[0.02] transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github size={18} /> Sign up with GitHub
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-panel-border" />
            <span className="font-mono text-xs text-neutral">or</span>
            <div className="flex-1 h-[1px] bg-panel-border" />
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-neutral block mb-1">Full Name</label>
              <div className="flex items-center gap-2 border border-dashed border-panel-border rounded px-3 py-2 focus-within:border-stitch-border transition-colors">
                <User size={14} className="text-neutral" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Dr. Jane Doe"
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral/40" 
                  disabled={loading || success}
                />
              </div>
            </div>
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
                  disabled={loading || success}
                />
                {emailValid && <Check size={14} className="text-safe" />}
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
                  placeholder="Min 8 characters"
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral/40" 
                  disabled={loading || success}
                />
                {passwordValid && <Check size={14} className="text-safe" />}
              </div>
              <div className="mt-1 flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-1 h-1 rounded-full" style={{
                    background: password.length >= i * 3
                      ? password.length >= 12 ? "#00FFA3" : password.length >= 8 ? "#00D9FF" : "#FF6B35"
                      : "rgba(255,255,255,0.06)"
                  }} />
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || success || !emailValid || !passwordValid || !name}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={14} /></>}
            </button>
          </form>

          <p className="text-center font-mono text-xs text-neutral">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
