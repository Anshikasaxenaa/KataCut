"use client";

import { TopHeader } from "@/components/dashboard/TopHeader";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "../global-context";
import { useEffect, useState } from "react";

export default function InsightsPage() {
  const { subscriptions } = useGlobalContext();
  const [dynamicInsights, setDynamicInsights] = useState<any[]>([]);

  useEffect(() => {
    // Generate insights based on the actual subscriptions in context
    const generated = [];
    
    // Check if we have dynamic subscriptions (mock ones based on filename)
    const hasDynamicSub = subscriptions.some(s => s.desc.includes("Detected from"));
    if (hasDynamicSub) {
      const dynSub = subscriptions.find(s => s.desc.includes("Detected from"));
      generated.push({
        type: "savings",
        title: "New Subscription Detected",
        description: `We noticed a new recurring charge for ${dynSub?.name}. Are you sure you want to keep this?`,
        action: `Review ${dynSub?.name}`,
        icon: <TrendingDown className="w-6 h-6 text-[#10B981]" />,
        color: "emerald"
      });
    }

    // Always add some base insights for flavor
    generated.push({
      type: "warning",
      title: "Upcoming Price Hike",
      description: "Netflix is increasing its premium plan to ₹749/month starting next billing cycle.",
      action: "Review Plan",
      icon: <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />,
      color: "amber"
    });
    
    generated.push({
      type: "optimization",
      title: "Overlap Detected",
      description: "You are subscribed to both Spotify Premium and Apple Music. Consolidating could save you ₹119/month.",
      action: "Compare Features",
      icon: <Zap className="w-6 h-6 text-[#0066FF]" />,
      color: "sky"
    });

    setDynamicInsights(generated);
  }, [subscriptions]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopHeader />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>AI Powered</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-2">Smart Insights</h1>
            <p className="text-[#0F172A]/60">Personalized recommendations based on your subscription habits.</p>
          </header>

          <div className="grid grid-cols-1 gap-6">
            {dynamicInsights.map((insight, i) => (
              <InsightCard key={i} {...insight} index={i} />
            ))}
          </div>
          
          <div className="bg-white rounded-2xl p-8 mt-12 border-dashed border-[#E2E8F0] border-2 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#94A3B8]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">You're all caught up!</h3>
            <p className="text-[#0F172A]/60 max-w-sm">Upload a more recent bank statement to generate fresh insights and savings opportunities.</p>
            <Button variant="outline" className="mt-6 border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]">
              Upload New Statement
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function InsightCard({ title, description, action, icon, color, index }: any) {
  const colorStyles = {
    emerald: "bg-[#10B981]/10 border-[#10B981]/20",
    amber: "bg-[#F59E0B]/10 border-[#F59E0B]/20",
    sky: "bg-[#0066FF]/10 border-[#0066FF]/20"
  }[color as "emerald" | "amber" | "sky"];

  const buttonStyles = {
    emerald: "bg-[#10B981] text-white hover:bg-[#059669] shadow-sm",
    amber: "bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-sm",
    sky: "bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-sm"
  }[color as "emerald" | "amber" | "sky"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut" }}
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm border border-[#E2E8F0]">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorStyles}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">{title}</h3>
          <p className="text-[#0F172A]/70 leading-relaxed">{description}</p>
        </div>
        <Button className={`flex-shrink-0 w-full md:w-auto ${buttonStyles}`}>
          {action}
        </Button>
      </div>
    </motion.div>
  );
}
