import { Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PrivacyBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-700 dark:text-emerald-500 cursor-default">
            <Shield className="w-4 h-4" />
            Zero-Knowledge Architecture
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-zinc-900 border-zinc-800 text-zinc-100 p-3">
          <p className="text-sm">
            Your bank data never leaves your device. It is encrypted with
            AES-256-GCM before storage using a passphrase only you know. Even we
            can't access it.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
