import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
        <Scissors className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-[#0F172A]">
          Kata<span className="text-[#10B981]">Cut</span>
        </span>
      )}
    </div>
  );
}
