"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      alert("Google Sign In requires additional OAuth setup without NextAuth.");
      setIsGoogleLoading(false);
    } catch (err) {
      console.error(err);
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full max-w-md p-8 md:p-10 bg-white rounded-2xl shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0]">
      <div className="flex flex-col items-center mb-8">
        <Logo className="mb-6 scale-125" />
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-2">Welcome back</h1>
        <p className="text-[#0F172A]/60 text-center text-sm">
          Enter your details below to log in to your account.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-[#F43F5E] bg-[#F43F5E]/10 border border-[#F43F5E]/20 rounded-xl">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0F172A]" htmlFor="email">Email</label>
            <Input 
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus-visible:ring-[#10B981] shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#0F172A]" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#10B981] hover:text-[#059669] font-medium">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus-visible:ring-[#10B981] shadow-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#10B981] text-white hover:bg-[#059669] font-bold py-6 shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#E2E8F0]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-semibold tracking-wider">
            <span className="bg-white px-2 text-[#0F172A]/40">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-[#F8FAFC] font-medium py-6 shadow-sm"
          disabled={isLoading || isGoogleLoading}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {isGoogleLoading ? "Connecting..." : "Google"}
        </Button>
        
        <div className="text-center text-sm text-[#0F172A]/60 pt-2 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#10B981] hover:text-[#059669] font-bold transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 overflow-hidden">
      {/* Background Blobs for premium effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-[#10B981]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-[#0066FF]/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="text-[#0F172A] text-center font-bold">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
