"use client";

import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = ({ title, description, variant }: any) => {
    if (typeof window !== "undefined") {
      // Basic fallback since actual shadcn toast hook is complex
      alert(`${title}\n${description}`);
    }
  };

  return { toast, toasts };
}
