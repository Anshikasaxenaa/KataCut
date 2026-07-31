"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 px-6 text-center">
      <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-8 shadow-sm">
        <Ghost className="w-12 h-12 text-zinc-400 dark:text-zinc-500 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
        404 - Lost in the Vault
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        The page you are looking for has either been cancelled, hidden, or never
        existed in the first place.
      </p>
      <Button
        asChild
        size="lg"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full px-8 shadow-md"
      >
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
