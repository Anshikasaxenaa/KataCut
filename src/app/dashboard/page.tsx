"use client";

import { TopHeader } from "@/components/dashboard/TopHeader";
import { DataSecurityCard } from "@/components/dashboard/DataSecurityCard";
import { BurnBreakdownCard } from "@/components/dashboard/BurnBreakdownCard";
import { PotentialSavingsCard } from "@/components/dashboard/PotentialSavingsCard";
import { SubscriptionList } from "@/components/dashboard/SubscriptionList";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopHeader />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Top-Left: Local Data Security (Spans 1 col on LG) */}
          <div className="lg:col-span-1">
            <DataSecurityCard />
          </div>

          {/* Top-Right: Monthly Burn Breakdown (Spans 2 cols on LG) */}
          <div className="lg:col-span-2">
            <BurnBreakdownCard />
          </div>

          {/* Bottom-Left: Potential Savings (Spans 1 col on LG) */}
          <div className="lg:col-span-1">
            <PotentialSavingsCard />
          </div>

          {/* Bottom-Right: Subscription List (Spans 2 cols on LG) */}
          <div className="lg:col-span-2">
            <SubscriptionList />
          </div>
          
        </div>
      </main>
    </div>
  );
}
