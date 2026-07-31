"use client";

import { Home, Plus, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function BottomNav() {
  const [active, setActive] = useState("home");

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around h-20 px-2 relative">
        <button
          onClick={() => {
            setActive("home");
            if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
          }}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            active === "home"
              ? "text-emerald-400"
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          <Home className={cn("h-6 w-6 mb-1 transition-transform", active === "home" && "scale-110")} />
          <span className="text-[10px] font-medium tracking-wide">Dashboard</span>
        </button>

        <div className="flex flex-col items-center justify-center w-full h-full relative">
          <button
            onClick={() => {
              setActive("upload");
              if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
              // Trigger upload logic or scroll to dropzone here
              const dropzone = document.getElementById("upload-dropzone");
              if (dropzone) {
                dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className={cn(
              "absolute -top-6 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform hover:scale-105 active:scale-95",
              active === "upload" 
                ? "bg-emerald-400 text-slate-900" 
                : "bg-emerald-500 text-white"
            )}
          >
            <Plus className="h-7 w-7" />
          </button>
          <span className="text-[10px] font-medium tracking-wide text-slate-500 absolute bottom-3">Add Statement</span>
        </div>

        <button
          onClick={() => {
            setActive("vault");
            if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
          }}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            active === "vault"
              ? "text-emerald-400"
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          <Shield className={cn("h-6 w-6 mb-1 transition-transform", active === "vault" && "scale-110")} />
          <span className="text-[10px] font-medium tracking-wide">Vault</span>
        </button>
      </div>
    </div>
  );
}
