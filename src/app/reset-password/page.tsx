"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid reset link. Missing token or email.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
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

  if (status === "success") {
    return (
      <GlassCard className="w-full p-8 bg-zinc-950/80 border-white/10 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
        <p className="text-zinc-400 mb-6">Your password has been successfully updated.</p>
        <Link href="/login">
          <Button className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold">
            Continue to Login
          </Button>
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full p-8 bg-zinc-950/80 border-white/10">
      <div className="flex flex-col items-center mb-8">
        <Logo className="mb-6 scale-125" />
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Set New Password</h1>
        <p className="text-zinc-400 text-center text-sm">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status === "error" && (
          <div className="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {message}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="password">New Password</label>
          <Input 
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-emerald-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold py-6 shadow-[0_0_20px_rgba(16,185,129,0.15)] mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </GlassCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background Blobs for premium effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
