"use client";

import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#F8FAFC] px-6 text-center">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-[#E2E8F0]">
        <Ghost className="w-12 h-12 text-[#10B981] animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] mb-3">
        404 - Lost in the Vault
      </h1>
      <p className="text-[#0F172A]/70 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        The page you are looking for has either been cancelled, hidden, or never
        existed in the first place.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex h-11 items-center justify-center rounded-full bg-[#10B981] px-8 font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:bg-[#059669] transition-all hover:scale-105"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
