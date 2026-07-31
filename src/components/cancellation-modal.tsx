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
  CANCELLATION_REASONS,
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
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className={`h-2 w-12 rounded-full ${step >= 1 ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
            <div
              className={`h-2 w-12 rounded-full ${step >= 2 ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
            <div
              className={`h-2 w-12 rounded-full ${step >= 3 ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
          </div>
          <DialogTitle className="text-xl text-center">
            {step === 1 && "Why are you cancelling?"}
            {step === 2 && "Here's how to cancel"}
            {step === 3 && "All done?"}
          </DialogTitle>
          <DialogDescription className="text-center">
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
                    className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-600 w-4 h-4"
                    />
                    <span className="text-sm font-medium">{r.label}</span>
                  </label>
                ))}
              </div>
              {reason === "other" && (
                <Input
                  placeholder="Please specify..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="mt-2"
                  autoFocus
                />
              )}
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!reason || (reason === "other" && !otherReason)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${getDifficultyColor(merchantInfo.difficulty)}`}
                />
                <span className="font-medium capitalize">
                  Difficulty: {merchantInfo.difficulty}
                </span>
                <span className="text-zinc-500 mx-2">|</span>
                <span className="text-zinc-600 dark:text-zinc-400 text-xs">
                  {merchantInfo.cancellationPolicy}
                </span>
              </div>

              <div className="space-y-3">
                {merchantInfo.cancelUrl && (
                  <Button
                    className="w-full justify-between bg-indigo-600 hover:bg-indigo-700 text-white"
                    asChild
                  >
                    <a
                      href={merchantInfo.cancelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cancel Online <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}

                {merchantInfo.supportEmail && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={handleSendEmail}
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : "Send Cancellation Email"}{" "}
                      <Mail className="w-4 h-4" />
                    </Button>
                    {emailStatus === "success" && (
                      <p className="text-xs text-emerald-600 text-center">
                        Email sent successfully!
                      </p>
                    )}
                    {emailStatus === "error" && (
                      <p className="text-xs text-rose-600 text-center">
                        Failed to send email. Try again.
                      </p>
                    )}
                  </div>
                )}

                {merchantInfo.phone && (
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    asChild
                  >
                    <a
                      href={`tel:${merchantInfo.phone.replace(/[^0-9+]/g, "")}`}
                    >
                      Call Customer Care: {merchantInfo.phone}{" "}
                      <Phone className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {merchantInfo.instructions &&
                merchantInfo.instructions.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" /> Step-by-step
                      instructions
                    </h4>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-indigo-800 dark:text-indigo-400">
                      {merchantInfo.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                )}

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  onClick={markAsCancelled}
                >
                  I've cancelled it!
                </Button>
                <div className="flex justify-between items-center text-sm">
                  <button
                    onClick={handleBack}
                    className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <button
                    onClick={handleRemindLater}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
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
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
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
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Awesome!
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                You've just saved{" "}
                <span className="font-semibold text-emerald-600">
                  ₹{subscription.amount.toLocaleString("en-IN")}
                </span>{" "}
                per{" "}
                {subscription.frequency === "unknown"
                  ? "cycle"
                  : subscription.frequency}
                .
              </p>
              <div className="pt-6">
                <Button className="w-full" onClick={() => onModalChange(false)}>
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
