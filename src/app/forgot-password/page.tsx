"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 overflow-hidden">
      {/* Background Blobs for premium effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-[#F59E0B]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-[#F43F5E]/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="w-full p-8 md:p-10 bg-white rounded-2xl shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0]">
          <div className="flex flex-col items-center mb-8">
            <Logo className="mb-6 scale-125" />
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-2">Forgot Password</h1>
            <p className="text-[#0F172A]/60 text-center text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="p-3 text-sm text-[#F43F5E] bg-[#F43F5E]/10 border border-[#F43F5E]/20 rounded-xl">
                {message}
              </div>
            )}

            {status === "success" && (
              <div className="p-3 text-sm text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl">
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F172A]" htmlFor="email">Email</label>
              <Input 
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus-visible:ring-[#10B981] shadow-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#10B981] text-white hover:bg-[#059669] font-bold py-6 shadow-[0_4px_20px_rgba(16,185,129,0.2)] mt-4"
              disabled={isLoading || status === "success"}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center text-sm text-[#0F172A]/60 mt-6 font-medium">
            Remember your password?{" "}
            <Link href="/login" className="text-[#10B981] hover:text-[#059669] font-bold transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
