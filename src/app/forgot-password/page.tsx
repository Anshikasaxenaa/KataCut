"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      setStatus("success");
      setMessage(data.message);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background Blobs for premium effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="w-full p-8 bg-zinc-950/80 border-white/10">
          <div className="flex flex-col items-center mb-8">
            <Logo className="mb-6 scale-125" />
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Forgot Password</h1>
            <p className="text-zinc-400 text-center text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                {message}
              </div>
            )}

            {status === "success" && (
              <div className="p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300" htmlFor="email">Email</label>
              <Input 
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold py-6 shadow-[0_0_20px_rgba(16,185,129,0.15)] mt-4"
              disabled={isLoading || status === "success"}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400 mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Log in
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
