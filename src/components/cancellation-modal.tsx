"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getMerchantCancellationInfo,
} from "@/lib/cancellation/merchants";
import { generateCancellationEmail } from "@/lib/cancellation/generator";
import { Subscription } from "@/lib/types/subscription";
import confetti from "canvas-confetti";
import {
  ExternalLink,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { CANCELLATION_REASONS as ReasonsList } from "@/lib/cancellation/generator";

interface CancellationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription;
}

export function CancellationModal({
  isOpen,
  onOpenChange,
  subscription,
}: CancellationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reason, setReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const merchantInfo = getMerchantCancellationInfo(subscription.merchant);

  const handleNext = () => setStep(2);
  const handleBack = () => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3);

  const resetState = () => {
    setStep(1);
    setReason("");
    setOtherReason("");
    setEmailStatus("idle");
  };

  const onModalChange = (open: boolean) => {
    if (!open && step > 1 && step < 3) {
      if (
        !window.confirm(
          "Are you sure you want to close? Your progress will be lost.",
        )
      ) {
        return;
      }
    }
    onOpenChange(open);
    if (!open) setTimeout(resetState, 300);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    setEmailStatus("idle");
    const finalReason =
      reason === "other"
        ? otherReason
        : ReasonsList.find((r) => r.id === reason)?.text;

    const emailData = generateCancellationEmail(
      merchantInfo,
      {
        name: "John Doe", // Mock user
        email: "john@example.com", // Mock user
        subscriptionName: subscription.merchant,
        amount: subscription.amount,
        lastBilled: subscription.transactions[0]?.date.toLocaleDateString(),
      },
      finalReason,
    );

    try {
      const res = await fetch("/api/cancel/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      if (res.ok) {
        setEmailStatus("success");
      } else {
        setEmailStatus("error");
      }
    } catch (e) {
      setEmailStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  const handleRemindLater = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Schedule mock notification
          setTimeout(() => {
            new Notification(`Reminder: Cancel ${subscription.merchant}`, {
              body: `Don't forget to cancel your subscription to save ₹${subscription.amount}/cycle.`,
              icon: "/favicon.ico",
            });
          }, 3000); // 3 seconds for demo instead of 3 days
        }
      });
    }
    setStep(3);
  };

  const markAsCancelled = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setStep(3);
    // Here you would trigger an API call to update the subscription status
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === "easy") return "bg-emerald-500";
    if (diff === "medium") return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onModalChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900/80 backdrop-blur-xl border-slate-700/50 text-white p-6 shadow-2xl rounded-t-3xl sm:rounded-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className={`h-1.5 w-12 rounded-full ${step >= 1 ? "bg-emerald-500" : "bg-slate-700/50"}`}
            />
            <div
              className={`h-1.5 w-12 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-slate-700/50"}`}
            />
            <div
              className={`h-1.5 w-12 rounded-full ${step >= 3 ? "bg-emerald-500" : "bg-slate-700/50"}`}
            />
          </div>
          <DialogTitle className="text-xl text-center font-bold tracking-tight">
            {step === 1 && "Why are you cancelling?"}
            {step === 2 && "Here's how to cancel"}
            {step === 3 && "All done?"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            {step === 2 &&
              `We've gathered the exact steps to cancel ${subscription.merchant}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                {ReasonsList.map((r) => (
                  <label
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-slate-800 border-slate-600"
                    />
                    <span className="text-sm font-medium text-slate-200">{r.label}</span>
                  </label>
                ))}
              </div>
              {reason === "other" && (
                <Input
                  placeholder="Please specify..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="mt-2 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                  autoFocus
                />
              )}
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!reason || (reason === "other" && !otherReason)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] rounded-full px-6"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${getDifficultyColor(merchantInfo.difficulty)}`}
                />
                <span className="font-medium capitalize text-slate-200">
                  Difficulty: {merchantInfo.difficulty}
                </span>
                <span className="text-slate-600 mx-2">|</span>
                <span className="text-slate-400 text-xs">
                  {merchantInfo.cancellationPolicy}
                </span>
              </div>

              <div className="space-y-3">
                {merchantInfo.cancelUrl && (
                  <a
                    href={merchantInfo.cancelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-between bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] rounded-xl h-12 px-4 text-sm font-medium transition-colors"
                  >
                    Cancel Online <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {merchantInfo.supportEmail && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 hover:text-white rounded-xl h-12"
                      onClick={handleSendEmail}
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : "Send Cancellation Email"}{" "}
                      <Mail className="w-4 h-4 text-slate-400" />
                    </Button>
                    {emailStatus === "success" && (
                      <p className="text-xs text-emerald-400 text-center font-medium">
                        Email sent successfully!
                      </p>
                    )}
                    {emailStatus === "error" && (
                      <p className="text-xs text-rose-400 text-center font-medium">
                        Failed to send email. Try again.
                      </p>
                    )}
                  </div>
                )}

                {merchantInfo.phone && (
                  <a
                    href={`tel:${merchantInfo.phone.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex w-full items-center justify-between border border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 hover:text-white rounded-xl h-12 px-4 text-sm font-medium transition-colors"
                  >
                    Call Customer Care: {merchantInfo.phone}{" "}
                    <Phone className="w-4 h-4 text-slate-400" />
                  </a>
                )}
              </div>

              {merchantInfo.instructions &&
                merchantInfo.instructions.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-emerald-500" /> Step-by-step
                      instructions
                    </h4>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-400">
                      {merchantInfo.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                )}

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  className="w-full bg-white text-slate-900 hover:bg-slate-200 rounded-xl h-12 font-semibold"
                  onClick={markAsCancelled}
                >
                  I've cancelled it!
                </Button>
                <div className="flex justify-between items-center text-sm px-2">
                  <button
                    onClick={handleBack}
                    className="text-slate-400 hover:text-white flex items-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <button
                    onClick={handleRemindLater}
                    className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                  >
                    Remind me later
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Awesome!
              </h3>
              <p className="text-slate-400">
                You've just saved{" "}
                <span className="font-semibold text-emerald-400">
                  ₹{subscription.amount.toLocaleString("en-IN")}
                </span>{" "}
                per{" "}
                {subscription.frequency === "unknown"
                  ? "cycle"
                  : subscription.frequency}
                .
              </p>
              <div className="pt-6">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-12" onClick={() => onModalChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
