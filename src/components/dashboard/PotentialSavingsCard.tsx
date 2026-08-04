"use client";

import { Coins, ArrowUpRight } from "lucide-react";
import { useGlobalContext } from "@/app/global-context";

export function PotentialSavingsCard() {
  const { potentialSavings } = useGlobalContext();

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E2E8F0] h-full flex flex-col items-center text-center">
      <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-8 w-full text-left">Total Potential Savings</h2>
      
      {/* Semi-circular gauge (CSS implementation) */}
      <div className="relative w-48 h-24 overflow-hidden mb-6">
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-[#E2E8F0]"></div>
        <div 
          className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-[#10B981] border-l-[#10B981] border-b-[#0066FF] border-r-transparent rotate-45"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
        ></div>
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-2">
          <span className="text-sm font-bold text-[#10B981]">Good</span>
          <span className="text-3xl font-extrabold text-[#0F172A] tracking-tighter">35%</span>
        </div>
      </div>
      
      <div className="bg-[#10B981]/10 px-6 py-4 rounded-xl border border-[#10B981]/20 mt-2">
        <div className="text-sm font-medium text-[#10B981] mb-1">Dormant Subs Identified</div>
        <div className="text-2xl font-bold text-[#10B981]">₹{potentialSavings} /mo</div>
      </div>
    </div>
  );
}
