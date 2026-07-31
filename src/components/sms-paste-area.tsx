"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, MessageSquare } from "lucide-react";

interface SmsPasteAreaProps {
  onParse: (text: string) => void;
}

export function SmsPasteArea({ onParse }: SmsPasteAreaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [smsText, setSmsText] = useState("");

  const handleParse = () => {
    if (smsText.trim()) {
      onParse(smsText);
      setSmsText("");
      setIsOpen(false);
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors">
        <div className="flex items-center gap-2 text-zinc-300">
          <MessageSquare className="h-5 w-5 text-indigo-400" />
          <h3 className="font-medium">Or paste SMS transaction messages</h3>
        </div>
        <ChevronDown className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0 space-y-4">
        <div className="text-sm text-zinc-400">
          Paste multiple SMS messages from your bank below. They will be parsed and merged with your PDF transactions.
        </div>
        <textarea
          className="w-full min-h-[150px] p-3 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          placeholder={"E.g.\nRs.499.00 debited from a/c **1234 on 15/07/26 to ZOMATO. Ref: 123456\nRs 1000.00 credited to a/c **1234 on 16-Jul. Ref: 654321"}
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleParse} 
            disabled={!smsText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Parse SMS
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
