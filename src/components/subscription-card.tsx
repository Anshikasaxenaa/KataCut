"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Subscription } from "@/lib/types/subscription";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, AlertTriangle, ChevronDown, Info } from "lucide-react";
import { CancelButton } from "./cancel-button";
import { getMerchantCancellationInfo } from "@/lib/cancellation/merchants";

interface SubscriptionCardProps {
  subscription: Subscription;
}

const getBrandStyles = (merchantName: string) => {
  const m = merchantName.toLowerCase();
  if (m.includes("netflix")) return { bg: "bg-[#E50914]", text: "text-white" };
  if (m.includes("spotify")) return { bg: "bg-[#1DB954]", text: "text-white" };
  if (m.includes("amazon")) return { bg: "bg-[#FF9900]", text: "text-zinc-900" };
  if (m.includes("google")) return { bg: "bg-[#4285F4]", text: "text-white" };
  if (m.includes("swiggy")) return { bg: "bg-[#FC8019]", text: "text-white" };
  if (m.includes("zomato")) return { bg: "bg-[#E23744]", text: "text-white" };
  if (m.includes("microsoft")) return { bg: "bg-[#00A4EF]", text: "text-white" };
  if (m.includes("apple")) return { bg: "bg-zinc-900 dark:bg-white", text: "text-white dark:text-zinc-900" };
  if (m.includes("disney") || m.includes("hotstar")) return { bg: "bg-[#113CCF]", text: "text-white" };
  
  // Default hash-based color
  const colors = [
    { bg: "bg-indigo-500", text: "text-white" },
    { bg: "bg-purple-500", text: "text-white" },
    { bg: "bg-pink-500", text: "text-white" },
    { bg: "bg-rose-500", text: "text-white" },
    { bg: "bg-teal-500", text: "text-white" },
    { bg: "bg-sky-500", text: "text-white" }
  ];
  const charCode = merchantName.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

export function SubscriptionCardSkeleton() {
  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
          <Skeleton className="h-6 w-[80px] rounded-full" />
        </div>
        
        <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Skeleton className="w-5 h-5 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { merchant, amount, frequency, status, nextBilling, confidence, totalSpent, dormantDays } = subscription;
  const brand = getBrandStyles(merchant);
  const initial = merchant.charAt(0).toUpperCase();
  const merchantInfo = getMerchantCancellationInfo(merchant);

  const getDifficultyColor = (diff: string) => {
    if (diff === 'easy') return 'bg-emerald-500';
    if (diff === 'medium') return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const statusConfig = {
    active: { label: "Active", dot: "bg-emerald-500", classes: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20" },
    dormant: { label: "Dormant", dot: "bg-rose-500", classes: "text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20" },
    expiring_soon: { label: "Expiring Soon", dot: "bg-amber-500", classes: "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20" },
    cancelled: { label: "Cancelled", dot: "bg-zinc-500", classes: "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" },
  };

  const currentStatus = statusConfig[status];

  return (
    <motion.div layout>
      <Card className={`bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40 overflow-hidden ${status === 'dormant' ? 'border-l-4 border-l-rose-500' : ''}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left outline-none focus-visible:bg-zinc-50 dark:focus-visible:bg-zinc-800/50"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${brand.bg} ${brand.text} shadow-sm`}>
                  {initial}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px] sm:max-w-[180px]">{merchant}</h3>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">₹{amount.toLocaleString("en-IN")}</span>
                    <span className="text-zinc-300 dark:text-zinc-600">/</span>
                    <span className="capitalize">{frequency === 'unknown' ? 'cycle' : frequency}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <div 
                  className={`w-2 h-2 rounded-full cursor-help ${getDifficultyColor(merchantInfo.difficulty)}`}
                  title={`Cancellation: ${merchantInfo.difficulty === 'easy' ? 'Easy (cancel online anytime)' : merchantInfo.difficulty === 'medium' ? 'Medium (requires navigation or email)' : 'Hard (requires phone call or multi-step process)'}`}
                />
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${currentStatus.classes}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                  {currentStatus.label}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
              <div>
                <p className="text-zinc-500 dark:text-zinc-500 text-xs mb-1">Next Billing</p>
                <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {nextBilling ? nextBilling.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Unknown'}
                </div>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-500 text-xs mb-1">Confidence</p>
                <div className="text-zinc-700 dark:text-zinc-300">
                  {confidence}%
                </div>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-500 text-xs mb-1">Total Spent</p>
                <div className="text-zinc-700 dark:text-zinc-300">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {status === 'dormant' && (
              <div className="mt-4 flex items-center gap-2 p-2.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 text-xs border border-rose-100 dark:border-rose-500/20">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                No activity detected in {dormantDays} days. Consider cancelling.
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-center pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              </motion.div>
            </div>
          </CardContent>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 pt-0 bg-zinc-50/50 dark:bg-zinc-950/30">
                <h4 className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Recent Transactions</h4>
                <div className="space-y-3">
                  {subscription.transactions.slice(-5).reverse().map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between text-sm">
                      <div className="flex flex-col">
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{tx.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-[11px] truncate max-w-[150px]" title={tx.rawDescription}>{tx.rawDescription}</span>
                      </div>
                      <span className="text-zinc-900 dark:text-zinc-100 font-medium">₹{tx.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">View all history</span>
                  <CancelButton subscription={subscription} isDormant={status === 'dormant'} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
