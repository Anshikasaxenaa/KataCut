"use client";

import { TopHeader } from "@/components/dashboard/TopHeader";
import { DataSecurityCard } from "@/components/dashboard/DataSecurityCard";
import { BurnBreakdownCard } from "@/components/dashboard/BurnBreakdownCard";
import { PotentialSavingsCard } from "@/components/dashboard/PotentialSavingsCard";
import { SubscriptionList } from "@/components/dashboard/SubscriptionList";
import { DashboardProvider, useDashboardContext } from "./context";
import { Activity, Moon } from "lucide-react";

function DashboardContent() {
  const { activeCount, dormantCount } = useDashboardContext();
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopHeader />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#E2E8F0]">
              <Activity className="w-5 h-5 text-[#10B981]" />
              <span className="font-bold text-[#0F172A]">{activeCount} <span className="text-sm font-medium text-[#0F172A]/50">Active</span></span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#E2E8F0]">
              <Moon className="w-5 h-5 text-[#F59E0B]" />
              <span className="font-bold text-[#0F172A]">{dormantCount} <span className="text-sm font-medium text-[#0F172A]/50">Dormant</span></span>
            </div>
          </div>
        </div>

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

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
