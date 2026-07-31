"use client";

import { motion } from "framer-motion";
import { Subscription } from "@/lib/types/subscription";
import {
  SubscriptionCard,
  SubscriptionCardSkeleton,
} from "./subscription-card";
import { SearchX } from "lucide-react";
import { EmptyState } from "./empty-state";

interface SubscriptionGridProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
}

export function SubscriptionGrid({
  subscriptions,
  isLoading = false,
}: SubscriptionGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SubscriptionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-8 w-8" />}
        title="No subscriptions found"
        description="We couldn't detect any recurring subscriptions from your parsed transactions yet. Try parsing more data or a longer date range."
      />
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {subscriptions.map((sub) => (
        <SubscriptionCard key={sub.id} subscription={sub} />
      ))}
    </motion.div>
  );
}
