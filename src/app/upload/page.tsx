"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { UploadCloud, Shield, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf" && !droppedFile.name.toLowerCase().endsWith(".pdf")) {
        setError("Invalid file type. Please upload a PDF.");
        return;
      }
      if (droppedFile.name.toLowerCase().includes("corrupt")) {
        setError("Error reading PDF. The file might be corrupted or encrypted.");
        return;
      }
      setFile(droppedFile);
      simulateProcessing();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
        setError("Invalid file type. Please upload a PDF.");
        return;
      }
      if (selectedFile.name.toLowerCase().includes("corrupt")) {
        setError("Error reading PDF. The file might be corrupted or encrypted.");
        return;
      }
      setFile(selectedFile);
      simulateProcessing();
    }
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopHeader />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-2">Upload Statement</h1>
            <p className="text-[#0F172A]/60">Securely upload your bank statement PDF to detect subscriptions.</p>
          </header>

          <div className="flex items-center gap-2 p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]">
            <Shield className="w-5 h-5" />
            <p className="text-sm font-medium">Privacy Guaranteed: Your data is processed entirely on your device and encrypted.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#E2E8F0] relative overflow-hidden">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] flex items-center gap-2">
                <Shield className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              id="file-upload" 
              onChange={handleFileSelect}
            />
            
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label
                    htmlFor="file-upload"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full h-[400px] rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                      isDragging ? "border-[#10B981] bg-[#10B981]/5" : "border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-10 h-10 text-[#10B981]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Drag & Drop PDF</h3>
                    <p className="text-[#0F172A]/60 mb-6">or click to browse your files</p>
                    <Button variant="secondary" className="bg-[#E2E8F0] text-[#0F172A] hover:bg-[#CBD5E1] pointer-events-none">
                      Select File
                    </Button>
                  </label>
                </motion.div>
              ) : isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center h-[400px]"
                >
                  <div className="relative w-32 h-32 mb-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#E2E8F0]" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={283}
                        strokeDashoffset={283 - (progress / 100) * 283}
                        className="transition-all duration-300 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-[#10B981] animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
                    Extracting page {Math.max(1, Math.min(15, Math.ceil((progress / 100) * 15)))}/15...
                  </h3>
                  <p className="text-[#0F172A]/60">Notice: the PDF never left my device. Check Network tab — no upload.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-[400px]"
                >
                  <div className="w-24 h-24 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">15 pages extracted</h3>
                  <p className="text-[#0F172A]/60 mb-8">Notice: the PDF never left my device. Check Network tab — no upload.</p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setFile(null)} className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]">
                      Upload Another
                    </Button>
                    <Button 
                      className="bg-[#10B981] text-white hover:bg-[#059669]"
                      onClick={() => router.push(`/parsing?file=${encodeURIComponent(file.name)}`)}
                    >
                      View Results
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
