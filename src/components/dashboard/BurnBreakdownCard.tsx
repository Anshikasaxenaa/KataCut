"use client";

import { TrendingUp, MoreHorizontal } from "lucide-react";

export function BurnBreakdownCard() {
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E2E8F0] h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Monthly Burn Breakdown</h2>
        <button className="text-[#0F172A]/40 hover:text-[#0F172A]/70 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-5xl font-extrabold text-[#0F172A] tracking-tighter">₹2,340</span>
          <span className="text-[#0F172A]/50 font-medium text-lg">/mo</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-[#10B981]">
          <TrendingUp className="w-4 h-4" />
          <span>+4.2% from last month</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Progress Bar 1 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-[#0F172A]">Entertainment</span>
            <span className="font-bold text-[#0F172A]">65%</span>
          </div>
          <div className="h-3 w-full bg-[#F8FAFC] rounded-full overflow-hidden border border-[#E2E8F0]/50">
            <div className="h-full bg-[#0066FF] rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Progress Bar 2 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-[#0F172A]">Productivity</span>
            <span className="font-bold text-[#0F172A]">25%</span>
          </div>
          <div className="h-3 w-full bg-[#F8FAFC] rounded-full overflow-hidden border border-[#E2E8F0]/50">
            <div className="h-full bg-[#10B981] rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Progress Bar 3 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-[#0F172A]">Utility & Other</span>
            <span className="font-bold text-[#0F172A]">10%</span>
          </div>
          <div className="h-3 w-full bg-[#F8FAFC] rounded-full overflow-hidden border border-[#E2E8F0]/50">
            <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: '10%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
