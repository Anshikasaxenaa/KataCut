"use client";

import { CheckCircle2, AlertTriangle, MoreVertical } from "lucide-react";

export function SubscriptionList() {
  const subscriptions = [
    { name: "Netflix", cost: "₹649", category: "Entertainment", status: "keep", logo: "N", color: "bg-[#E50914]" },
    { name: "Spotify", cost: "₹119", category: "Entertainment", status: "keep", logo: "S", color: "bg-[#1DB954]" },
    { name: "Adobe CC", cost: "₹2,389", category: "Productivity", status: "keep", logo: "A", color: "bg-[#FF0000]" },
    { name: "Cult.fit", cost: "₹1,499", category: "Health", status: "cancel", logo: "C", color: "bg-[#FF3366]" },
    { name: "Prime Video", cost: "₹299", category: "Entertainment", status: "keep", logo: "P", color: "bg-[#00A8E1]" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E2E8F0] overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Subscription Analysis List</h2>
        <button className="text-sm font-semibold text-[#0066FF] hover:text-[#0052CC] transition-colors">
          View All
        </button>
      </div>
      
      <div className="divide-y divide-[#E2E8F0]">
        {subscriptions.map((sub, i) => (
          <div key={i} className="p-4 sm:p-6 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${sub.color}`}>
                {sub.logo}
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A]">{sub.name}</h4>
                <span className="text-sm font-medium text-[#0F172A]/50">{sub.category}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="hidden sm:block text-right">
                <div className="font-bold text-[#0F172A]">{sub.cost}</div>
                <div className="text-xs font-medium text-[#0F172A]/40">per month</div>
              </div>
              
              <div className="w-[140px] flex justify-end">
                {sub.status === "keep" ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Keep</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Cancel - Dormant</span>
                  </div>
                )}
              </div>
              
              <button className="text-[#0F172A]/30 hover:text-[#0F172A]/70 transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
