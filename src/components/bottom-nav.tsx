"use client";

import { Home, Upload, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function BottomNav() {
  const [active, setActive] = useState("home");

  const navItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "history", label: "History", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActive(item.id);
              if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate(10);
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] transition-colors",
              active === item.id
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 mb-1 transition-transform",
                active === item.id && "scale-110",
              )}
            />
            <span className="text-[10px] font-medium tracking-wide">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
