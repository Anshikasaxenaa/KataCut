"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CancellationModal } from "./cancellation-modal";
import { Subscription } from "@/lib/types/subscription";

interface CancelButtonProps {
  subscription: Subscription;
  isDormant?: boolean;
}

export function CancelButton({
  subscription,
  isDormant = false,
}: CancelButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={isDormant ? "outline" : "ghost"}
        size="sm"
        className={
          isDormant
            ? "border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:text-rose-400"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the card expansion
          setIsModalOpen(true);
        }}
      >
        {isDormant ? "Review & Cancel" : "Manage Subscription"}
      </Button>

      <CancellationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        subscription={subscription}
      />
    </>
  );
}
