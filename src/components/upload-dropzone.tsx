"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileText, Lock, CheckCircle2 } from "lucide-react";

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

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
      {/* Vault Door Aesthetics */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-4 left-4 w-4 h-4 rounded-full border-2 border-slate-700/50"></div>
      <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-slate-700/50"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full border-2 border-slate-700/50"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 border-slate-700/50"></div>

      {file ? (
        <div className="flex flex-col items-center z-10 animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{file.name}</h3>
          <p className="text-sm text-emerald-400 font-medium">Ready to process securely</p>
          <button onClick={() => setFile(null)} className="mt-6 text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4">
            Upload a different file
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
          
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 pointer-events-auto cursor-help" title="Your data is processed locally and never uploaded to any server.">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">100% Local Processing. Your document never leaves this device.</span>
          </div>
        </div>
      )}
      
      {/* Invisible file input overlay for click to upload */}
      {!file && (
        <input 
          type="file" 
          accept=".pdf" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
      )}
    </div>
  );
}
