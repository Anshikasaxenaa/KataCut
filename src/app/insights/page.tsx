"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InsightsPage() {
  const insights = [
    {
      type: "savings",
      title: "Potential Savings Identified",
      description: "You haven't used your Cult.fit membership in 3 months. Canceling it could save you ₹1,499/month.",
      action: "Cancel Cult.fit",
      icon: <TrendingDown className="w-6 h-6 text-emerald-400" />,
      color: "emerald"
    },
    {
      type: "warning",
      title: "Upcoming Price Hike",
      description: "Netflix is increasing its premium plan to ₹749/month starting next billing cycle.",
      action: "Review Plan",
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      color: "amber"
    },
    {
      type: "optimization",
      title: "Overlap Detected",
      description: "You are subscribed to both Spotify Premium and Apple Music. Consolidating could save you ₹119/month.",
      action: "Compare Features",
      icon: <Zap className="w-6 h-6 text-sky-400" />,
      color: "sky"
    }
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Smart Insights</h1>
          <p className="text-zinc-400">Personalized recommendations based on your subscription habits.</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {insights.map((insight, i) => (
            <InsightCard key={i} {...insight} index={i} />
          ))}
        </div>
        
        <GlassCard className="p-8 mt-12 bg-zinc-900/30 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
          <p className="text-zinc-400 max-w-sm">Upload a more recent bank statement to generate fresh insights and savings opportunities.</p>
          <Button variant="outline" className="mt-6 border-white/10 text-white hover:bg-white/5">
            Upload New Statement
          </Button>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function InsightCard({ title, description, action, icon, color, index }: any) {
  const colorStyles = {
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    sky: "bg-sky-500/10 border-sky-500/20"
  }[color as "emerald" | "amber" | "sky"];

  const buttonStyles = {
    emerald: "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    amber: "bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    sky: "bg-sky-500 text-zinc-950 hover:bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
  }[color as "emerald" | "amber" | "sky"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut" }}
    >
      <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorStyles}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-zinc-400 leading-relaxed">{description}</p>
        </div>
        <Button className={`flex-shrink-0 w-full md:w-auto ${buttonStyles}`}>
          {action}
        </Button>
      </GlassCard>
    </motion.div>
  );
}
