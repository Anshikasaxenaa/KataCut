"use client";

import { Check, ChevronDown, ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = "Name (A-Z)" | "Amount (High to Low)" | "Amount (Low to High)" | "Next Billing";

interface SortDropdownProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: SortOption[] = [
  "Name (A-Z)",
  "Amount (High to Low)",
  "Amount (Low to High)",
  "Next Billing"
];

export function SortDropdown({ activeSort, onSortChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 gap-2 font-medium">
        <ListFilter className="w-4 h-4" />
        <span className="hidden sm:inline">Sort: {activeSort}</span>
        <span className="sm:hidden">Sort</span>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onSortChange(option)}
            className="flex items-center justify-between cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          >
            {option}
            {activeSort === option && <Check className="w-4 h-4 text-indigo-500" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
