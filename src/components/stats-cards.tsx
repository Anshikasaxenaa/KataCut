"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, Variants } from "framer-motion";
import { SubscriptionSummary } from "@/lib/types/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Layers, AlertTriangle, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  summary: SubscriptionSummary;
}

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [hasMounted, setHasMounted] = useState(false);
  const spring = useSpring(0, { mass: 1, stiffness: 75, damping: 20 });
  const display = useTransform(
    spring,
    (current) =>
      `${prefix}${Math.round(current).toLocaleString("en-IN")}${suffix}`,
  );

  useEffect(() => {
    setHasMounted(true);
    spring.set(value);
  }, [value, spring]);

  if (!hasMounted)
    return (
      <span>
        {prefix}0{suffix}
      </span>
    );
  return <motion.span>{display}</motion.span>;
}

export function StatsCards({ summary }: StatsCardsProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={item} className="col-span-2 lg:col-span-1">
        <Card className="h-full bg-white border-[#393E41]/10 backdrop-blur-sm hover:bg-[#F6F7EB] transition-all shadow-[0_0_15px_rgba(0,0,0,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#393E41]/70">
              Monthly Spend
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-[#393E41]/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#393E41] tracking-tight">
              <AnimatedCounter value={summary.totalMonthlySpend} prefix="₹" />
            </div>
            <p className="text-xs text-[#393E41]/60 mt-2">Est. recurring outflow</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="col-span-2 lg:col-span-1">
        <Card className="h-full bg-white border-[#393E41]/10 backdrop-blur-sm hover:bg-[#F6F7EB] transition-all shadow-[0_0_15px_rgba(0,0,0,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#393E41]/70">
              Active Subs
            </CardTitle>
            <Layers className="h-4 w-4 text-[#393E41]/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#393E41] tracking-tight">
              <AnimatedCounter value={summary.activeCount} />
            </div>
            <p className="text-xs text-[#393E41]/60 mt-2">Currently billing</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="col-span-2 lg:col-span-1">
        <Card
          className={`h-full backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(0,0,0,0.05)] ${summary.dormantCount > 0 ? "bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]" : "bg-white border-[#393E41]/10 hover:bg-[#F6F7EB]"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${summary.dormantCount > 0 ? "text-rose-600" : "text-[#393E41]/70"}`}
            >
              Money Leaks
            </CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${summary.dormantCount > 0 ? "text-rose-600 animate-pulse" : "text-[#393E41]/70"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold tracking-tight ${summary.dormantCount > 0 ? "text-rose-600" : "text-[#393E41]"}`}
            >
              <AnimatedCounter value={summary.dormantCount} />
            </div>
            <p className={`text-xs mt-2 font-medium ${summary.dormantCount > 0 ? "text-rose-600/80" : "text-[#393E41]/60"}`}>
              {summary.dormantCount > 0 ? "🚨 Dormant apps draining money" : "No dormant subs"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="col-span-2 lg:col-span-1">
        <Card className="h-full bg-[#E94F37]/10 border-[#E94F37]/20 backdrop-blur-sm hover:bg-[#E94F37]/20 transition-all shadow-[0_0_15px_rgba(233,79,55,0.1)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#E94F37]">
              Potential Savings
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-[#E94F37]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E94F37] tracking-tight">
              <AnimatedCounter
                value={summary.potentialSavings}
                prefix="₹"
                suffix="/mo"
              />
            </div>
            <p className="text-xs text-[#E94F37]/70 mt-2 font-medium">
              By cancelling dormant subs
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
