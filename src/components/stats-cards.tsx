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
        <Card className="h-full bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Monthly Spend
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">
              <AnimatedCounter value={summary.totalMonthlySpend} prefix="₹" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Est. recurring outflow</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="col-span-2 lg:col-span-1">
        <Card className="h-full bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Active Subs
            </CardTitle>
            <Layers className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">
              <AnimatedCounter value={summary.activeCount} />
            </div>
            <p className="text-xs text-slate-500 mt-2">Currently billing</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="col-span-2 lg:col-span-1">
        <Card
          className={`h-full backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)] ${summary.dormantCount > 0 ? "bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]" : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${summary.dormantCount > 0 ? "text-rose-400" : "text-slate-400"}`}
            >
              Money Leaks
            </CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${summary.dormantCount > 0 ? "text-rose-500 animate-pulse" : "text-slate-400"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold tracking-tight ${summary.dormantCount > 0 ? "text-rose-400" : "text-white"}`}
            >
              <AnimatedCounter value={summary.dormantCount} />
            </div>
            <p className={`text-xs mt-2 font-medium ${summary.dormantCount > 0 ? "text-rose-400/80" : "text-slate-500"}`}>
              {summary.dormantCount > 0 ? "🚨 Dormant apps draining money" : "No dormant subs"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="col-span-2 lg:col-span-1">
        <Card className="h-full bg-emerald-500/10 border-emerald-500/20 backdrop-blur-sm hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">
              Potential Savings
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400 tracking-tight">
              <AnimatedCounter
                value={summary.potentialSavings}
                prefix="₹"
                suffix="/mo"
              />
            </div>
            <p className="text-xs text-emerald-400/70 mt-2 font-medium">
              By cancelling dormant subs
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
