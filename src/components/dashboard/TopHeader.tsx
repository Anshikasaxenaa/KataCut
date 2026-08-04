"use client";

import Link from "next/link";
import { Settings, Bell, UserCircle, Receipt, BarChart3, Lock, SlidersHorizontal } from "lucide-react";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8FAFC]/80 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            KataCut
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            <button className="px-4 py-1.5 rounded-full bg-[#0066FF] text-white text-sm font-semibold shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] transition-transform hover:scale-105 active:scale-95">
              Vault
            </button>
            <Link href="/statements" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#0F172A]/70 hover:text-[#0F172A] transition-colors rounded-full hover:bg-black/5">
              <Receipt className="w-4 h-4" />
              Statements
            </Link>
            <Link href="/analysis" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#0F172A]/70 hover:text-[#0F172A] transition-colors rounded-full hover:bg-black/5">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </Link>
            <Link href="/security" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#0F172A]/70 hover:text-[#0F172A] transition-colors rounded-full hover:bg-black/5">
              <Lock className="w-4 h-4" />
              Security
            </Link>
            <Link href="/settings" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#0F172A]/70 hover:text-[#0F172A] transition-colors rounded-full hover:bg-black/5">
              <SlidersHorizontal className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-[#0F172A]/70 hover:text-[#0F172A] hover:bg-black/5 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-[#0F172A]/70 hover:text-[#0F172A] hover:bg-black/5 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F43F5E]"></span>
          </button>
          <button className="ml-2 w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#0F172A]/70 hover:bg-[#0F172A]/10 transition-colors">
            <UserCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
