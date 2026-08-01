"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedDonutChart } from "@/components/ui/animated-donut-chart";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardPage() {
  const subscriptions = [
    { name: "Netflix", cost: "₹649", renewal: "Renews in 3 days", status: "Active", logo: "N" },
    { name: "Spotify", cost: "₹119", renewal: "Renews in 5 days", status: "Active", logo: "S" },
    { name: "Prime Video", cost: "₹299", renewal: "Renews in 8 days", status: "Active", logo: "P" },
    { name: "Adobe CC", cost: "₹2,389", renewal: "Renews in 12 days", status: "Active", logo: "A" },
    { name: "Cult.fit", cost: "₹1,499", renewal: "Renews in 2 days", status: "Dormant", logo: "C" },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Good Evening, Anshika 👋
            </h1>
            <p className="text-zinc-400">Here's your subscription overview for this month.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            A
          </div>
        </header>

        {/* Hero Stats */}
        <GlassCard className="p-8 md:p-12 bg-gradient-to-br from-emerald-950/20 to-sky-950/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6">
              <div>
                <p className="text-zinc-400 font-medium mb-2">Monthly Subscription Spend</p>
                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">₹2,340</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-zinc-300 font-medium">7 Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <span className="text-zinc-300 font-medium">2 Dormant</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-white/5">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-zinc-300">Next renewal in 3 days</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <AnimatedDonutChart percentage={78} label="78%" sublabel="of budget" />
            </div>
          </div>
        </GlassCard>

        {/* Subscription List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold tracking-tight text-white">Your Subscriptions</h3>
            <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub, i) => (
              <SubscriptionCard key={i} {...sub} index={i} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SubscriptionCard({ name, cost, renewal, status, logo, index }: any) {
  const isDormant = status === "Dormant";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut" }}
    >
      <GlassCard 
        hoverEffect 
        className={`p-6 ${isDormant ? "bg-amber-950/20 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]" : ""}`}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-inner">
            {logo}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
            isDormant 
              ? "bg-amber-500/20 text-amber-400 border-amber-500/20" 
              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
          }`}>
            {status}
          </span>
        </div>
        
        <h4 className="text-xl font-bold text-white mb-1">{name}</h4>
        <div className="flex items-end justify-between mb-6">
          <span className="text-3xl font-bold text-white tracking-tight">{cost}</span>
          <span className="text-sm text-zinc-400 mb-1">{renewal}</span>
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1 bg-zinc-800 text-white hover:bg-zinc-700">
            Details
          </Button>
          <Button variant="destructive" className="flex-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300">
            Cancel
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
