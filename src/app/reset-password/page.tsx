"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
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
      <div className="w-full p-8 md:p-10 bg-white rounded-2xl shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0] text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Password Reset!</h2>
        <p className="text-[#0F172A]/60 mb-6">Your password has been successfully updated.</p>
        <Link href="/login">
          <Button className="w-full bg-[#10B981] text-white hover:bg-[#059669] font-bold py-6 shadow-md shadow-[#10B981]/20">
            Continue to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-8 md:p-10 bg-white rounded-2xl shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0]">
      <div className="flex flex-col items-center mb-8">
        <Logo className="mb-6 scale-125" />
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-2">Set New Password</h1>
        <p className="text-[#0F172A]/60 text-center text-sm">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status === "error" && (
          <div className="p-3 text-sm text-[#F43F5E] bg-[#F43F5E]/10 border border-[#F43F5E]/20 rounded-xl">
            {message}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#0F172A]" htmlFor="password">New Password</label>
          <Input 
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus-visible:ring-[#10B981] shadow-sm"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#10B981] text-white hover:bg-[#059669] font-bold py-6 shadow-[0_4px_20px_rgba(16,185,129,0.2)] mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 overflow-hidden">
      {/* Background Blobs for premium effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-[#10B981]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-[#0066FF]/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="text-[#0F172A] text-center font-bold">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
