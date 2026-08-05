"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { UploadCloud, Shield, FileText, CheckCircle2, Loader2, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { extractTextFromPDF } from "@/lib/parsers/pdf-extractor";
import { saveData } from "@/lib/storage/indexeddb";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [textMode, setTextMode] = useState(false);
  const [rawText, setRawText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf" && !droppedFile.name.toLowerCase().endsWith(".pdf")) {
        setError("Invalid file type. Please upload a PDF.");
        return;
      }
      setFile(droppedFile);
      await processPDF(droppedFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
        setError("Invalid file type. Please upload a PDF.");
        return;
      }
      setFile(selectedFile);
      await processPDF(selectedFile);
    }
  };

  const processPDF = async (pdfFile: File) => {
    setIsProcessing(true);
    setSuccess(false);
    try {
      const text = await extractTextFromPDF(pdfFile);
      await analyzeText(text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse PDF.");
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!rawText.trim()) {
      setError("Please paste some text first.");
      return;
    }
    setError(null);
    setIsProcessing(true);
    setSuccess(false);
    try {
      await analyzeText(rawText);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze text.");
      setIsProcessing(false);
    }
  };

  const analyzeText = async (text: string) => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze statement.");
      }

      const parsedData = await response.json();

      // Ensure some defaults for missing data from AI
      const subs = (parsedData.subscriptions || []).map((sub: any) => ({
        ...sub,
        name: sub.merchant || "Unknown",
        cost: "₹" + (sub.amount || 0).toString(),
        category: sub.customDetails || "Subscription",
        status: "keep", // Default status
        logo: (sub.merchant ? sub.merchant.charAt(0) : "?").toUpperCase(),
        color: "bg-[#0066FF]",
        desc: sub.customDetails || ""
      }));

      await saveData("subscriptions", "latest", subs);
      window.dispatchEvent(new Event("subscriptionsUpdated"));
      
      setSuccess(true);
      setIsProcessing(false);
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopHeader />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-2">Analyze Statement</h1>
              <p className="text-[#0F172A]/60">Securely extract subscriptions from your bank statement.</p>
            </div>
            <div className="flex gap-2 bg-[#E2E8F0] p-1 rounded-xl">
              <button 
                onClick={() => setTextMode(false)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${!textMode ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#0F172A]/60 hover:text-[#0F172A]'}`}
              >
                <FileText className="w-4 h-4" /> PDF
              </button>
              <button 
                onClick={() => setTextMode(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${textMode ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#0F172A]/60 hover:text-[#0F172A]'}`}
              >
                <Type className="w-4 h-4" /> Text
              </button>
            </div>
          </header>

          <div className="flex items-center gap-2 p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]">
            <Shield className="w-5 h-5" />
            <p className="text-sm font-medium">Privacy Guaranteed: Your data is processed securely and cached entirely on your device.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#E2E8F0] relative overflow-hidden">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] flex items-center gap-2">
                <Shield className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center h-[400px]"
                >
                  <div className="w-20 h-20 bg-[#0066FF]/10 rounded-full flex items-center justify-center mb-6 border border-[#0066FF]/20">
                    <Loader2 className="w-10 h-10 text-[#0066FF] animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Analyzing with AI...</h3>
                  <p className="text-[#0F172A]/60">Extracting recurring subscriptions and filtering out noise.</p>
                </motion.div>
              ) : success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-[400px]"
                >
                  <div className="w-24 h-24 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Analysis Complete</h3>
                  <p className="text-[#0F172A]/60 mb-8">Subscriptions have been successfully extracted and saved locally.</p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => { setSuccess(false); setFile(null); setRawText(""); }} className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]">
                      Analyze Another
                    </Button>
                    <Button 
                      className="bg-[#10B981] text-white hover:bg-[#059669]"
                      onClick={() => router.push(`/dashboard`)}
                    >
                      View Dashboard
                    </Button>
                  </div>
                </motion.div>
              ) : textMode ? (
                <motion.div
                  key="textMode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col w-full h-[400px]"
                >
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste your raw bank statement or SMS transaction logs here..."
                    className="w-full flex-1 p-6 rounded-2xl border-2 border-[#E2E8F0] focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 resize-none outline-none transition-all text-[#0F172A]"
                  ></textarea>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleTextSubmit} className="bg-[#0066FF] text-white hover:bg-[#0052CC] px-8 py-6 rounded-xl text-lg font-bold shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] transition-transform hover:scale-105 active:scale-95">
                      Analyze Text
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="file-upload"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full h-[400px] rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                      isDragging ? "border-[#0066FF] bg-[#0066FF]/5" : "border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-10 h-10 text-[#0066FF]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Drag & Drop PDF</h3>
                    <p className="text-[#0F172A]/60 mb-6">or click to browse your files</p>
                    <Button variant="secondary" className="bg-[#E2E8F0] text-[#0F172A] hover:bg-[#CBD5E1] pointer-events-none">
                      Select File
                    </Button>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
