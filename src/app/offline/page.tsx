"use client";

import { CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-[#F8FAFC] text-center">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#E2E8F0]">
        <CloudOff className="w-10 h-10 text-[#64748B]" />
      </div>

      <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
        You're offline
      </h1>

      <p className="text-[#0F172A]/70 max-w-md mb-8 leading-relaxed">
        Don't worry, your data is safe on your device. KataCut's privacy-first
        vault works completely offline. Connect to the internet to upload new
        statements or cancel subscriptions.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href="/dashboard"
          className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-[#10B981] px-8 text-sm font-bold text-white hover:bg-[#059669] shadow-sm transition-colors"
        >
          View Offline Dashboard
        </Link>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
