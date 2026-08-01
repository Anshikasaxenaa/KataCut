"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileText, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { extractTextFromPDF } from "@/lib/parsers/pdf-extractor";
import { Vault } from "@/lib/crypto/vault";
import { saveData } from "@/lib/storage/indexeddb";
import { useVault } from "@/hooks/useVault";

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLocked } = useVault(); // Custom hook to check if Vault is unlocked

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (isLocked) {
        throw new Error("Vault is locked. Please unlock it first to securely save your data.");
      }

      // 1. Extract text locally
      const text = await extractTextFromPDF(selectedFile);
      
      // 2. Send to our stateless AI proxy route
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze statement.");
      }

      const parsedData = await response.json();

      // 3. Encrypt and save to IndexedDB securely
      await saveData("subscriptions", `ai-parsed-${Date.now()}`, parsedData.subscriptions);
      
      // 4. Force a reload of the dashboard data (in a real app, use a context or SWR to mutate)
      window.dispatchEvent(new Event("subscriptionsUpdated"));

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during processing.");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      processFile(droppedFile);
    }
  }, [isLocked]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  return (
    <div 
      id="upload-dropzone"
      className="w-full p-8 mt-8 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center bg-slate-800/30 backdrop-blur-md relative overflow-hidden group"
      style={{
        borderColor: isDragging ? '#10B981' : '#334155',
        boxShadow: isDragging ? '0 0 40px rgba(16,185,129,0.2) inset' : 'none'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-4 left-4 w-4 h-4 rounded-full border-2 border-slate-700/50"></div>
      <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-slate-700/50"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full border-2 border-slate-700/50"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 border-slate-700/50"></div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm z-10 w-full max-w-md">
          {error}
        </div>
      )}

      {isProcessing ? (
        <div className="flex flex-col items-center z-10 animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Statement...</h3>
          <p className="text-sm text-blue-400 font-medium">Extracting subscriptions via AI</p>
        </div>
      ) : file && !error ? (
        <div className="flex flex-col items-center z-10 animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{file.name}</h3>
          <p className="text-sm text-emerald-400 font-medium">Processed Securely</p>
          <button onClick={() => setFile(null)} className="mt-6 text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4">
            Upload another file
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center z-10 pointer-events-none">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isDragging ? 'bg-emerald-500/20 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-slate-700/50 group-hover:bg-slate-700/80'}`}>
            <UploadCloud className={`w-10 h-10 transition-colors ${isDragging ? 'text-emerald-400' : 'text-slate-400'}`} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Drop Bank Statement PDF here</h3>
          <p className="text-slate-400 mb-8 max-w-sm">
            Drag and drop your e-statement or click to browse.
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 pointer-events-auto cursor-help">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">100% Local Encryption.</span>
            </div>
            {isLocked && (
              <span className="text-xs font-medium text-amber-400 tracking-wide">Vault is locked. Unlock below to process.</span>
            )}
          </div>
        </div>
      )}
      
      {!file && !isProcessing && (
        <input 
          type="file" 
          accept=".pdf" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={handleFileChange}
          disabled={isLocked}
        />
      )}
    </div>
  );
}
