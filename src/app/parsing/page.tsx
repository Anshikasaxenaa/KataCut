"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Building, ArrowRight, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParsingPage() {
  const router = useRouter();
  
  // Mock 5 rows for visual representation
  const transactions = [
    { date: "12 Aug 2026", desc: "NETFLIX.COM", amount: "-₹649.00", category: "Entertainment" },
    { date: "10 Aug 2026", desc: "AMZN PRIME", amount: "-₹299.00", category: "Entertainment" },
    { date: "05 Aug 2026", desc: "CULT.FIT GYM", amount: "-₹1,499.00", category: "Health" },
    { date: "02 Aug 2026", desc: "ADOBE CREATIVE CLOUD", amount: "-₹2,389.00", category: "Productivity" },
    { date: "01 Aug 2026", desc: "SPOTIFY PREMIUM", amount: "-₹119.00", category: "Entertainment" },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Parsing Complete</h1>
            <p className="text-zinc-400">Review your extracted transactions.</p>
          </div>
          
          <div className="flex items-center gap-2 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Building className="w-5 h-5" />
            <p className="text-sm font-bold">HDFC Bank detected</p>
          </div>
        </header>

        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Shield className="w-5 h-5" />
          <p className="text-sm font-medium">Every transaction parsed client-side.</p>
        </div>

        <GlassCard className="p-6 md:p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-zinc-400" />
              142 transactions found
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 cursor-not-allowed">
                Search
              </Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 cursor-not-allowed">
                Sort
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 font-semibold text-zinc-400">Date</th>
                  <th className="py-4 px-4 font-semibold text-zinc-400">Description</th>
                  <th className="py-4 px-4 font-semibold text-zinc-400">Category (Auto)</th>
                  <th className="py-4 px-4 font-semibold text-zinc-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((t, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-zinc-300">{t.date}</td>
                    <td className="py-4 px-4 text-white font-medium">{t.desc}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-rose-400">{t.amount}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-zinc-500 italic">
                    ... and 137 more rows
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
        
        <div className="flex justify-end pt-4">
          <Button 
            className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400 px-8 py-6 rounded-xl text-lg font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-transform hover:scale-105"
            onClick={() => router.push('/dashboard')}
          >
            Analyze Subscriptions <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
