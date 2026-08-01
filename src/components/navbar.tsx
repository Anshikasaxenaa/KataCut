"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { UserCircle, ShieldCheck } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b border-[#393E41]/10 bg-[#F6F7EB]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold text-[#393E41] tracking-tight"
            >
              KataCut
            </Link>
            
            {/* Vault Encrypted Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E94F37]/10 border border-[#E94F37]/20 shadow-[0_0_10px_rgba(233,79,55,0.15)]">
              <ShieldCheck className="w-4 h-4 text-[#E94F37]" />
              <span className="text-xs font-medium text-[#E94F37]">Local Vault Encrypted</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Mobile Vault Badge (Icon only) */}
            <div className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-[#E94F37]/10 border border-[#E94F37]/20 shadow-[0_0_10px_rgba(233,79,55,0.15)]">
               <ShieldCheck className="w-4 h-4 text-[#E94F37]" />
            </div>

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="icon"
                className="text-[#393E41]/70 hover:text-[#393E41] hover:bg-[#393E41]/10 rounded-full"
                onClick={logout}
                title="Profile & Settings"
              >
                <UserCircle className="w-6 h-6" />
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#393E41]/70 hover:text-[#393E41] hover:bg-[#393E41]/10 rounded-full"
                >
                  <UserCircle className="w-6 h-6" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
