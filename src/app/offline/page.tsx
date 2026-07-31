"use client";

import { CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-center">
      <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
        <CloudOff className="w-10 h-10 text-zinc-500" />
      </div>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        You're offline
      </h1>

      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">
        Don't worry, your data is safe on your device. KataCut's privacy-first
        vault works completely offline. Connect to the internet to upload new
        statements or cancel subscriptions.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href="/dashboard"
          className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white hover:bg-indigo-700"
        >
          View Offline Dashboard
        </Link>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
