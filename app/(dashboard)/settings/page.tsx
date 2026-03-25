"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, CreditCard, Bell, Shield, Key, Loader2 } from "lucide-react";
import PencilDivider from "@/components/layout/PencilDivider";
import { createClient } from "@/lib/supabase/client";

const plans = [
  { name: "Free", price: "$0", features: ["3 analyses/month", "Basic SHAP charts", "Knowledge graph view"], current: true },
  { name: "Pro", price: "$19/mo", features: ["Unlimited analyses", "PDF export", "Comparison mode", "What-If Simulator", "Priority support"], current: false },
  { name: "Research", price: "$49/mo", features: ["Everything in Pro", "API access", "Priority ML queue", "Bulk analysis", "Custom integrations"], current: false },
];

export default function SettingsPage() {
  const supabase = createClient();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (user) {
        setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
        setEmail(user.email || "");
      }
      setLoading(false);
    });
  }, [supabase.auth]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, name: name }
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-headline text-3xl text-white mb-1">Settings</h2>
        <p className="font-annotation text-sticky-yellow/60 text-lg">
          manage your account, subscription, and preferences
        </p>
      </motion.div>

      <PencilDivider />

      {/* Profile */}
      <section className="stitch-card p-6 relative min-h-[250px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <User size={18} className="text-primary" />
              <h3 className="font-headline text-lg text-white">Profile</h3>
            </div>
            
            {message && (
              <div className={`p-3 border border-dashed rounded text-sm font-mono text-center ${
                message.type === "success" ? "bg-safe/10 border-safe/30 text-safe" : "bg-danger/10 border-danger/30 text-danger"
              }`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-neutral block mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-base border border-dashed border-panel-border rounded px-3 py-2 font-mono text-sm text-white outline-none focus:border-stitch-border transition-colors" 
                  disabled={saving}
                />
              </div>
              <div>
                <label className="font-mono text-xs text-neutral block mb-1">Email <span className="text-[10px] text-neutral/50 ml-1">(Cannot change here)</span></label>
                <input 
                  type="email" 
                  value={email} 
                  disabled
                  className="w-full bg-base/50 border border-dashed border-panel-border rounded px-3 py-2 font-mono text-sm text-neutral outline-none cursor-not-allowed" 
                />
              </div>
            </div>
            <button 
              onClick={handleSaveProfile} 
              disabled={saving}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : "Save Changes"}
            </button>
          </motion.div>
        )}
      </section>

      {/* Subscription */}
      <section className="stitch-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={18} className="text-primary" />
          <h3 className="font-headline text-lg text-white">Subscription</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`stitch-card p-4 ${plan.current ? "border-primary/50" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-white font-medium">{plan.name}</span>
                {plan.current && <span className="px-2 py-0.5 rounded text-[10px] font-mono badge-moderate">CURRENT</span>}
              </div>
              <p className="font-headline text-2xl text-primary mb-3">{plan.price}</p>
              <ul className="space-y-1">
                {plan.features.map((f) => (
                  <li key={f} className="font-mono text-xs text-neutral flex items-center gap-1.5">
                    <span className="text-safe">✓</span> {f}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <button className="btn-outline w-full mt-4 text-xs">Upgrade</button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* API Keys */}
      <section className="stitch-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key size={18} className="text-primary" />
          <h3 className="font-headline text-lg text-white">API Keys</h3>
        </div>
        <p className="font-mono text-sm text-neutral mb-4">
          Available on Research plan. Generate API keys for programmatic access.
        </p>
        <button className="btn-outline text-sm" disabled>Generate API Key (Research plan required)</button>
      </section>
    </div>
  );
}
