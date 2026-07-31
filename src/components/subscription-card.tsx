"use client";

import { useState } from "react";
import { Subscription } from "@/lib/types/subscription";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubscriptionCardProps {
  subscription: Subscription;
}

const getBrandColor = (merchantName: string) => {
  const m = merchantName.toLowerCase();
  if (m.includes("netflix")) return "bg-red-600 text-white";
  if (m.includes("spotify")) return "bg-green-500 text-black";
  if (m.includes("amazon")) return "bg-orange-500 text-white";
  if (m.includes("youtube")) return "bg-red-500 text-white";
  if (m.includes("google")) return "bg-blue-500 text-white";
  if (m.includes("apple")) return "bg-zinc-200 text-black";
  if (m.includes("swiggy")) return "bg-orange-600 text-white";
  if (m.includes("zomato")) return "bg-red-600 text-white";
  if (m.includes("hotstar")) return "bg-indigo-600 text-white";
  if (m.includes("microsoft")) return "bg-blue-600 text-white";
  
  // Default hash-based color
  const colors = [
    "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-rose-500",
    "bg-amber-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500"
  ];
  const charCode = merchantName.charCodeAt(0) || 0;
  return `${colors[charCode % colors.length]} text-white`;
};

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { merchant, amount, frequency, status, nextBilling, confidence, totalSpent, dormantDays } = subscription;
  const brandColor = getBrandColor(merchant);
  const initial = merchant.charAt(0).toUpperCase();

  const statusConfig = {
    active: { label: "Active", classes: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" },
    dormant: { label: "Dormant", classes: "border-rose-500/30 text-rose-500 bg-rose-500/10" },
    expiring_soon: { label: "Expiring Soon", classes: "border-amber-500/30 text-amber-500 bg-amber-500/10" },
    cancelled: { label: "Cancelled", classes: "border-zinc-500/30 text-zinc-400 bg-zinc-500/10" },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card className={`bg-zinc-900 border-zinc-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/40 overflow-hidden ${status === 'dormant' ? 'border-l-4 border-l-rose-500' : ''}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full text-left">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${brandColor}`}>
                  {initial}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 truncate max-w-[140px] sm:max-w-[180px]">{merchant}</h3>
                  <div className="text-sm text-zinc-400 flex items-center gap-1">
                    <span>₹{amount.toLocaleString("en-IN")}</span>
                    <span className="text-zinc-500">/</span>
                    <span className="capitalize">{frequency === 'unknown' ? 'cycle' : frequency}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={currentStatus.classes}>
                {currentStatus.label}
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
              <div>
                <p className="text-zinc-500 text-xs mb-1">Next Billing</p>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {nextBilling ? nextBilling.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Unknown'}
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-xs mb-1">Confidence</p>
                <div className="text-zinc-300">
                  {confidence}%
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-xs mb-1">Total Spent</p>
                <div className="text-zinc-300">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {status === 'dormant' && (
              <div className="mt-4 flex items-center gap-2 p-2 rounded-md bg-rose-500/10 text-rose-500 text-xs border border-rose-500/20">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                No activity detected in {dormantDays} days. Consider cancelling.
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-center pt-3 border-t border-zinc-800">
              <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-5 pb-5 pt-0 bg-zinc-950/30">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recent Transactions</h4>
            <div className="space-y-3">
              {subscription.transactions.slice(-5).reverse().map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-zinc-300">{tx.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span className="text-zinc-500 text-xs truncate max-w-[150px]" title={tx.rawDescription}>{tx.rawDescription}</span>
                  </div>
                  <span className="text-zinc-100 font-medium">₹{tx.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
