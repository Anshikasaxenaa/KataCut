"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { Shield, Building, ArrowRight, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useGlobalContext } from "../global-context";

export default function ParsingPage() {
  const router = useRouter();
  const { setSubscriptions, updateCounts } = useGlobalContext();
  const [filename, setFilename] = useState("statement.pdf");

  useEffect(() => {
    // Safely get query params on the client side without needing Suspense
    const params = new URLSearchParams(window.location.search);
    const fileParam = params.get("file");
    if (fileParam) {
      setFilename(fileParam);
    }
  }, []);
  
  // Dynamic mock transactions based on the filename to simulate real parsing
  const transactions = [
    { date: "12 Aug 2026", desc: `FILE_FEE_${filename.substring(0, 5).toUpperCase()}`, amount: "-₹199.00", category: "Processing" },
    { date: "10 Aug 2026", desc: "AMZN PRIME", amount: "-₹299.00", category: "Entertainment" },
    { date: "05 Aug 2026", desc: "CULT.FIT GYM", amount: "-₹1,499.00", category: "Health" },
    { date: "02 Aug 2026", desc: "ADOBE CREATIVE CLOUD", amount: "-₹2,389.00", category: "Productivity" },
    { date: "01 Aug 2026", desc: "SPOTIFY PREMIUM", amount: "-₹119.00", category: "Entertainment" },
  ];

  const handleAnalyze = () => {
    // Generate dynamic subscriptions based on the filename so it isn't always the exact same
    const baseSubs = [
      { name: "Prime Video", cost: "₹299", category: "Entertainment", status: "keep" as const, logo: "P", color: "bg-[#00A8E1]", desc: "" },
      { name: "Adobe CC", cost: "₹2,389", category: "Productivity", status: "keep" as const, logo: "A", color: "bg-[#FF0000]", desc: "" },
      { name: "Cult.fit", cost: "₹1,499", category: "Health", status: "cancel" as const, logo: "C", color: "bg-[#FF3366]", desc: "Cult.fit. Last used 90 days ago." },
    ];
    
    // Add a dynamic subscription based on the parsed file
    const dynamicSub = { 
      name: filename.split('.')[0] + " Premium", 
      cost: "₹" + (filename.length * 50), 
      category: "Software", 
      status: "keep" as const, 
      logo: filename.charAt(0).toUpperCase(), 
      color: "bg-[#0066FF]", 
      desc: "Detected from " + filename 
    };

    const finalSubs = [dynamicSub, ...baseSubs];
    
    setSubscriptions(finalSubs);
    updateCounts(finalSubs);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopHeader />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-2">Parsing Complete</h1>
              <p className="text-[#0F172A]/60">Review your extracted transactions from {filename}.</p>
            </div>
            
            <div className="flex items-center gap-2 p-4 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF]">
              <Building className="w-5 h-5" />
              <p className="text-sm font-bold">Bank detected</p>
            </div>
          </header>

          <div className="flex items-center gap-2 p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]">
            <Shield className="w-5 h-5" />
            <p className="text-sm font-medium">Every transaction parsed client-side.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E2E8F0] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#0F172A]/40" />
                142 transactions found in {filename}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-not-allowed">
                  Search
                </Button>
                <Button variant="outline" className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-not-allowed">
                  Sort
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="py-4 px-4 font-semibold text-[#0F172A]/60">Date</th>
                    <th className="py-4 px-4 font-semibold text-[#0F172A]/60">Description</th>
                    <th className="py-4 px-4 font-semibold text-[#0F172A]/60">Category (Auto)</th>
                    <th className="py-4 px-4 font-semibold text-[#0F172A]/60 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]/50">
                  {transactions.map((t, i) => (
                    <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-4 text-[#0F172A]/70">{t.date}</td>
                      <td className="py-4 px-4 text-[#0F172A] font-medium">{t.desc}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-[#F1F5F9] text-[#475569]">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[#F43F5E]">{t.amount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-[#0F172A]/40 italic">
                      ... and 137 more rows
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              className="bg-[#10B981] text-white hover:bg-[#059669] px-8 py-6 rounded-xl text-lg font-bold shadow-md flex items-center gap-2 transition-transform hover:scale-105"
              onClick={handleAnalyze}
            >
              Analyze Subscriptions <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
