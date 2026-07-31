"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed/standalone
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                         (window.navigator as any).standalone || 
                         document.referrer.includes("android-app://");
                         
    if (isStandalone) {
      return;
    }

    // Check if dismissed recently (within 7 days)
    const dismissedAt = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedAt) {
      const dismissDate = new Date(parseInt(dismissedAt, 10));
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      if (dismissDate > sevenDaysAgo) {
        return; // Don't show if dismissed within last 7 days
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Celebrate
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.2 }
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-indigo-600 text-white p-3 shadow-md flex items-center justify-between safe-pt">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-md">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Install KataCut</p>
          <p className="text-xs text-indigo-100 hidden sm:block">Get quick access to your subscriptions from your home screen.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={handleInstall}
          className="bg-white text-indigo-700 hover:bg-zinc-100 h-8 text-xs font-bold"
        >
          Install
        </Button>
        <button onClick={handleDismiss} className="p-1 hover:bg-indigo-700 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
