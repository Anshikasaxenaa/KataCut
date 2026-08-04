"use client";

import { TrendingUp, MoreHorizontal } from "lucide-react";
import { useGlobalContext } from "@/app/global-context";

export function BurnBreakdownCard() {
  const { subscriptions } = useGlobalContext();

  // Calculate dynamic breakdown
  const totalBurn = subscriptions.reduce((acc, sub) => {
    const costNum = parseInt(sub.cost.replace(/[^\d]/g, ''), 10) || 0;
    return acc + costNum;
  }, 0);

  const categories = subscriptions.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + (parseInt(sub.cost.replace(/[^\d]/g, ''), 10) || 0);
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3); // top 3

  const colors = ["bg-[#0066FF]", "bg-[#10B981]", "bg-[#F59E0B]"];

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E2E8F0] h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Monthly Burn Breakdown</h2>
        <button onClick={() => alert("More options coming soon!")} className="text-[#0F172A]/40 hover:text-[#0F172A]/70 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-5xl font-extrabold text-[#0F172A] tracking-tighter">₹{totalBurn.toLocaleString('en-IN')}</span>
          <span className="text-[#0F172A]/50 font-medium text-lg">/mo</span>
        </div>
        {subscriptions.length > 0 ? (
          <div className="flex items-center gap-2 text-sm font-medium text-[#10B981]">
            <TrendingUp className="w-4 h-4" />
            <span>Active spending</span>
          </div>
        ) : (
           <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <span>No data to display</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {subscriptions.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#E2E8F0] rounded-xl">
             <span className="text-sm font-medium text-zinc-500">Upload a statement to see breakdown</span>
          </div>
        ) : (
          sortedCategories.map(([category, amount], idx) => {
            const percentage = totalBurn > 0 ? Math.round((amount / totalBurn) * 100) : 0;
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#0F172A]">{category}</span>
                  <span className="font-bold text-[#0F172A]">{percentage}%</span>
                </div>
                <div className="h-3 w-full bg-[#F8FAFC] rounded-full overflow-hidden border border-[#E2E8F0]/50">
                  <div className={`h-full ${colors[idx % colors.length]} rounded-full`} style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
