"use client";

import { Subscription } from "@/lib/types/subscription";
import { SubscriptionCard } from "./subscription-card";
import { SearchX } from "lucide-react";

interface SubscriptionGridProps {
  subscriptions: Subscription[];
}

export function SubscriptionGrid({ subscriptions }: SubscriptionGridProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-zinc-800 border-dashed rounded-lg bg-zinc-900/30">
        <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
          <SearchX className="h-8 w-8 text-zinc-500" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-200 mb-2">No Subscriptions Found</h3>
        <p className="text-zinc-400 max-w-md">
          We couldn't detect any recurring subscriptions from your parsed transactions yet. Try parsing more data or a longer date range.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((sub) => (
        <SubscriptionCard key={sub.id} subscription={sub} />
      ))}
    </div>
  );
}
