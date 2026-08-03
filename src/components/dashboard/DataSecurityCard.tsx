"use client";

import { Lock, FileText, UploadCloud, ArrowRight } from "lucide-react";

export function DataSecurityCard() {
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E2E8F0] h-full flex flex-col justify-between">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold mb-4">
          <Lock className="w-3.5 h-3.5" />
          Zero-Knowledge Architecture
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">Local Data Security</h2>
        <p className="text-[#0F172A]/60 text-sm leading-relaxed mb-6">
          Your bank statements are processed entirely on your device. We never store or see your financial data.
        </p>

        {/* 3-Step Diagram */}
        <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]/50 mb-6 flex items-center justify-between">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-[#0F172A]/70" />
            </div>
            <span className="text-[10px] font-bold text-[#0F172A]/70 uppercase tracking-wider">Device</span>
          </div>
          
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent relative">
            <ArrowRight className="w-4 h-4 text-[#E2E8F0] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
          </div>
          
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5 text-[#10B981]" />
            </div>
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Encrypted</span>
          </div>
          
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent relative">
            <ArrowRight className="w-4 h-4 text-[#E2E8F0] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
          </div>
          
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-[#0066FF] border border-[#0066FF] flex items-center justify-center shadow-md shadow-[#0066FF]/20">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">Vault</span>
          </div>
        </div>
      </div>

      <button className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold transition-all shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
        <UploadCloud className="w-5 h-5" />
        Scan New Statement PDF
      </button>
    </div>
  );
}
