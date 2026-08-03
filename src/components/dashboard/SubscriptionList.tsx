"use client";

import { CheckCircle2, AlertTriangle, MoreVertical, Filter, Send } from "lucide-react";
import { useState } from "react";
import { useDashboardContext } from "@/app/dashboard/context";

export function SubscriptionList() {
  const [filterDormant, setFilterDormant] = useState(false);
  const { setPotentialSavings, setDormantCount, setActiveCount } = useDashboardContext();
  const [cultFitCanceled, setCultFitCanceled] = useState(false);

  let subscriptions = [
    { name: "Netflix", cost: "₹649", category: "Entertainment", status: "keep", logo: "N", color: "bg-[#E50914]", desc: "" },
    { name: "Spotify", cost: "₹119", category: "Entertainment", status: "keep", logo: "S", color: "bg-[#1DB954]", desc: "" },
    { name: "Adobe CC", cost: "₹2,389", category: "Productivity", status: "keep", logo: "A", color: "bg-[#FF0000]", desc: "" },
    { 
      name: "Cult.fit", 
      cost: "₹1,499", 
      category: "Health", 
      status: cultFitCanceled ? "canceled" : "cancel", 
      logo: "C", 
      color: "bg-[#FF3366]",
      desc: "Cult.fit. Last used 90 days ago. Still paying ₹1,499/month."
    },
    { name: "Prime Video", cost: "₹299", category: "Entertainment", status: "keep", logo: "P", color: "bg-[#00A8E1]", desc: "" },
  ];

  if (filterDormant) {
    subscriptions = subscriptions.filter(s => s.status === "cancel" || s.status === "canceled");
  }

  const handleCancelCultFit = () => {
    // Open Gmail draft
    window.open("mailto:hello@cult.fit?subject=Cancel%20My%20Subscription&body=Hi%20team,%0A%0APlease%20cancel%20my%20Cult.fit%20subscription%20effective%20immediately.%0A%0AThank%20you.");
    
    // Update dashboard state
    setCultFitCanceled(true);
    setPotentialSavings(948);
    setDormantCount(1);
    setActiveCount(8);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E2E8F0] overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Subscription Analysis List</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setFilterDormant(!filterDormant)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${filterDormant ? 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/20' : 'bg-white text-[#0F172A]/70 border-[#E2E8F0] hover:bg-zinc-50'}`}
          >
            <Filter className="w-4 h-4" />
            {filterDormant ? 'Showing Dormant Only' : 'Filter to dormant only'}
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-[#E2E8F0]">
        {subscriptions.map((sub, i) => (
          <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-[#F8FAFC] transition-colors group gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0 ${sub.color}`}>
                {sub.logo}
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] flex items-center gap-2">
                  {sub.name}
                </h4>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#0F172A]/50">{sub.category}</span>
                  {sub.desc && (
                    <span className="text-xs font-semibold text-[#F43F5E] mt-0.5">{sub.desc}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-10 sm:ml-auto">
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
                ) : sub.status === "canceled" ? (
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">
                    <span className="text-xs font-bold uppercase tracking-wider">Canceled</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={sub.name === "Cult.fit" ? handleCancelCultFit : undefined}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F43F5E] text-white hover:bg-[#E11D48] transition-colors shadow-sm shadow-[#F43F5E]/20 font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
