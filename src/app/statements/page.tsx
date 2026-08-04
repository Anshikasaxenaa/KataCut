"use client";

import { TopHeader } from "@/components/dashboard/TopHeader";

export default function StatementsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopHeader />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-8">Statements Vault</h1>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0] text-center">
          <p className="text-[#0F172A]/60">This feature is coming soon.</p>
        </div>
      </main>
    </div>
  );
}
