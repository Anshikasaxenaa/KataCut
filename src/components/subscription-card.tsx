"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Subscription } from "@/lib/types/subscription";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  AlertTriangle,
  ChevronDown,
  Info,
  Trash2,
  Share2,
} from "lucide-react";
import { CancelButton } from "./cancel-button";
import { getMerchantCancellationInfo } from "@/lib/cancellation/merchants";
import { CancellationModal } from "./cancellation-modal";

interface SubscriptionCardProps {
  subscription: Subscription;
}

const getBrandStyles = (merchantName: string) => {
  const m = merchantName.toLowerCase();
  if (m.includes("netflix")) return { bg: "bg-[#E50914]", text: "text-white" };
  if (m.includes("spotify")) return { bg: "bg-[#1DB954]", text: "text-white" };
  if (m.includes("amazon"))
    return { bg: "bg-[#FF9900]", text: "text-zinc-900" };
  if (m.includes("google")) return { bg: "bg-[#4285F4]", text: "text-white" };
  if (m.includes("swiggy")) return { bg: "bg-[#FC8019]", text: "text-white" };
  if (m.includes("zomato")) return { bg: "bg-[#E23744]", text: "text-white" };
  if (m.includes("microsoft"))
    return { bg: "bg-[#00A4EF]", text: "text-white" };
  if (m.includes("apple"))
    return {
      bg: "bg-zinc-900 dark:bg-white",
      text: "text-white dark:text-zinc-900",
    };
  if (m.includes("disney") || m.includes("hotstar"))
    return { bg: "bg-[#113CCF]", text: "text-white" };

  // Default hash-based color
  const colors = [
    { bg: "bg-indigo-500", text: "text-white" },
    { bg: "bg-purple-500", text: "text-white" },
    { bg: "bg-pink-500", text: "text-white" },
    { bg: "bg-rose-500", text: "text-white" },
    { bg: "bg-teal-500", text: "text-white" },
    { bg: "bg-sky-500", text: "text-white" },
  ];
  const charCode = merchantName.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

export function SubscriptionCardSkeleton() {
  return (
    <Card className="bg-white border-[#393E41]/10 overflow-hidden backdrop-blur-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full bg-slate-700/50" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px] bg-slate-700/50" />
              <Skeleton className="h-3 w-[80px] bg-slate-700/50" />
            </div>
          </div>
          <Skeleton className="h-6 w-[80px] rounded-full bg-slate-700/50" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 bg-slate-700/50" />
            <Skeleton className="h-4 w-24 bg-slate-700/50" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 bg-slate-700/50" />
            <Skeleton className="h-4 w-12 bg-slate-700/50" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 bg-slate-700/50" />
            <Skeleton className="h-4 w-20 bg-slate-700/50" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center pt-3 border-t border-slate-700/50">
          <Skeleton className="w-5 h-5 rounded-md bg-slate-700/50" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    merchant,
    amount,
    frequency,
    status,
    nextBilling,
    confidence,
    totalSpent,
    dormantDays,
  } = subscription;
  const brand = getBrandStyles(merchant);
  const initial = merchant.charAt(0).toUpperCase();
  const merchantInfo = getMerchantCancellationInfo(merchant);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `KataCut - ${merchant}`,
          text: `I tracked my ${merchant} subscription on KataCut! It costs ₹${amount}/${frequency}. I'm finding forgotten subscriptions easily.`,
          url: window.location.origin,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === "easy") return "bg-emerald-500";
    if (diff === "medium") return "bg-amber-500";
    return "bg-rose-500";
  };

  const statusConfig = {
    active: {
      label: "Active",
      dot: "bg-emerald-400",
      classes:
        "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
    },
    dormant: {
      label: "Dormant",
      dot: "bg-rose-400",
      classes:
        "text-rose-400 bg-rose-500/10 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
    },
    expiring_soon: {
      label: "Upcoming",
      dot: "bg-amber-400",
      classes:
        "text-amber-400 bg-amber-500/10 border border-amber-500/20",
    },
    cancelled: {
      label: "Cancelled",
      dot: "bg-slate-400",
      classes:
        "text-slate-400 bg-slate-800 border border-slate-700",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="relative overflow-hidden rounded-xl bg-rose-500 mb-4 group touch-pan-y shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      {/* Swipe Action Background Layer */}
      <div className="absolute inset-y-0 right-0 flex items-center justify-end px-6 text-white font-medium w-full">
        <div
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Trash2 className="w-5 h-5 mb-1" />
          <span className="text-xs">Cancel</span>
        </div>
      </div>

      <motion.div
        layout
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        className="relative z-10 w-full"
      >
        <Card
          className={`bg-white border-[#393E41]/10 backdrop-blur-md transition-all duration-300 hover:shadow-xl overflow-hidden ${status === "dormant" ? "border-l-4 border-l-rose-500" : ""}`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-left outline-none focus-visible:bg-slate-700/50"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${brand.bg} ${brand.text} shadow-sm`}
                  >
                    {initial}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#393E41] truncate max-w-[140px] sm:max-w-[180px]">
                      {merchant}
                    </h3>
                    <div className="text-sm text-[#393E41]/70 flex items-center gap-1">
                      <span className="font-medium text-[#393E41]">
                        ₹{amount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[#393E41]/60">
                        /
                      </span>
                      <span className="capitalize">
                        {frequency === "unknown" ? "cycle" : frequency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full cursor-help ${getDifficultyColor(merchantInfo.difficulty)}`}
                    title={`Cancellation: ${merchantInfo.difficulty === "easy" ? "Easy (cancel online anytime)" : merchantInfo.difficulty === "medium" ? "Medium (requires navigation or email)" : "Hard (requires phone call or multi-step process)"}`}
                  />
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${currentStatus.classes}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} ${status === 'dormant' ? 'animate-pulse' : ''}`}
                    />
                    {currentStatus.label}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                <div>
                  <p className="text-[#393E41]/70 text-xs mb-1">
                    Next Billing
                  </p>
                  <div className="flex items-center gap-1.5 text-[#393E41]">
                    <Calendar className="w-3.5 h-3.5 text-[#393E41]/70" />
                    {nextBilling
                      ? nextBilling.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })
                      : "Unknown"}
                  </div>
                </div>
                <div>
                  <p className="text-[#393E41]/70 text-xs mb-1">
                    Confidence
                  </p>
                  <div className="text-[#393E41]">
                    {confidence}%
                  </div>
                </div>
                <div>
                  <p className="text-[#393E41]/70 text-xs mb-1">
                    Total Spent
                  </p>
                  <div className="text-[#393E41]">
                    ₹{totalSpent.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {status === "dormant" && (
                <div className="mt-4 flex items-center gap-2 p-2.5 rounded-md bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  No activity detected in {dormantDays} days. Consider
                  cancelling.
                </div>
              )}

              <div className="mt-4 flex items-center justify-center pt-3 border-t border-[#393E41]/10">
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#393E41]/70" />
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
                <div className="px-5 pb-5 pt-4 bg-[#F6F7EB] border-t border-[#393E41]/10">
                  <h4 className="text-[10px] font-semibold text-[#393E41]/60 uppercase tracking-wider mb-3">
                    Recent Transactions
                  </h4>
                  <div className="space-y-3">
                    {subscription.transactions
                      .slice(-5)
                      .reverse()
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex flex-col">
                            <span className="text-[#393E41] font-medium">
                              {tx.date.toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span
                              className="text-[#393E41]/60 text-[11px] truncate max-w-[150px]"
                              title={tx.rawDescription}
                            >
                              {tx.rawDescription}
                            </span>
                          </div>
                          <span className="text-[#393E41] font-medium">
                            ₹{tx.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#393E41]/10 flex gap-3 items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      className="flex-1 text-sm font-medium py-2 rounded-md bg-[#393E41]/10 text-[#393E41] hover:bg-[#393E41]/20 transition-colors"
                    >
                      Keep
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }}
                      className="flex-1 text-sm font-medium py-2 rounded-md bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-colors"
                    >
                      One-Click Cancel
                    </button>
                  </div>
                  
                  <div className="mt-3 flex justify-between">
                    <span className="text-xs text-[#E94F37] font-medium cursor-pointer hover:underline">
                      View all history
                    </span>
                    <button
                      onClick={handleShare}
                      className="text-xs text-[#393E41]/70 hover:text-[#393E41] font-medium flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
      <CancellationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        subscription={subscription}
      />
    </div>
  );
}
