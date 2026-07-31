"use client";

import { useState, useEffect } from "react";
import { Vault } from "@/lib/crypto/vault";
import { Lock, Unlock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes to match vault.ts

export function EncryptionIndicator() {
  const [isLocked, setIsLocked] = useState(Vault.isLocked());
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MS);

  // Track lock state
  useEffect(() => {
    const unsubscribe = Vault.subscribe((locked) => {
      setIsLocked(locked);
      if (!locked) {
        setTimeLeft(TIMEOUT_MS);
      }
    });

    // Check initial state in case it changed before mount
    setIsLocked(Vault.isLocked());

    return unsubscribe;
  }, []);

  // Track activity and countdown
  useEffect(() => {
    if (isLocked) return;

    let lastActivity = Date.now();

    const handleActivity = () => {
      lastActivity = Date.now();
      setTimeLeft(TIMEOUT_MS);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    const interval = setInterval(() => {
      const remaining = TIMEOUT_MS - (Date.now() - lastActivity);
      if (remaining <= 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearInterval(interval);
    };
  }, [isLocked]);

  const handleLockClick = () => {
    Vault.lock();
  };

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  if (isLocked) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 cursor-default">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
              </span>
              <Lock className="w-3 h-3" />
              Locked
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <p>Your vault is locked and encrypted.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button
            onClick={handleLockClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-500 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-600 dark:hover:text-rose-500 transition-colors group"
          >
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 group-hover:bg-rose-400"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:bg-rose-500"></span>
            </span>
            <Unlock className="w-3 h-3 group-hover:hidden" />
            <Lock className="w-3 h-3 hidden group-hover:block" />
            <span className="group-hover:hidden">Unlocked</span>
            <span className="hidden group-hover:block">Lock Now</span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <p>Auto-locking in {formattedTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
