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
      <motion.div variants={item}>
        <Card className="h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Monthly Spend
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              <AnimatedCounter value={summary.totalMonthlySpend} prefix="₹" />
            </div>
            <p className="text-xs text-zinc-500 mt-1">Est. recurring outflow</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Active Subs
            </CardTitle>
            <Layers className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              <AnimatedCounter value={summary.activeCount} />
            </div>
            <p className="text-xs text-zinc-500 mt-1">Currently billing</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card
          className={`h-full border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow bg-gradient-to-br ${summary.dormantCount > 0 ? "from-rose-50 to-white dark:from-rose-950/40 dark:to-zinc-900" : "from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${summary.dormantCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-zinc-500 dark:text-zinc-400"}`}
            >
              Dormant Alerts
            </CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${summary.dormantCount > 0 ? "text-rose-500 dark:text-rose-400" : "text-zinc-400"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${summary.dormantCount > 0 ? "text-rose-600 dark:text-rose-500" : "text-zinc-900 dark:text-zinc-50"}`}
            >
              <AnimatedCounter value={summary.dormantCount} />
            </div>
            <p className="text-xs text-zinc-500 mt-1">Unused for 60+ days</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
              Potential Savings
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              <AnimatedCounter
                value={summary.potentialSavings}
                prefix="₹"
                suffix="/mo"
              />
            </div>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-1">
              By cancelling dormant subs
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
