"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type FilterOption = "All" | "Active" | "Dormant" | "Expiring Soon";

interface FilterBarProps {
  options: { label: FilterOption; count: number }[];
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export function FilterBar({
  options,
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 py-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:static overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 min-w-max pb-1 sm:pb-0">
        {options.map((option) => {
          const isActive = activeFilter === option.label;

          return (
            <button
              key={option.label}
              onClick={() => onFilterChange(option.label)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                isActive
                  ? "text-indigo-700 dark:text-indigo-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {option.label}
                <span
                  className={cn(
                    "flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none min-w-[20px]",
                    isActive
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
                  )}
                >
                  {option.count}
                </span>
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
