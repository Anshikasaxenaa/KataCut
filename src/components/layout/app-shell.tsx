"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, LogOut, Settings, Upload, Zap } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/use-auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950/50 p-6 flex flex-col hidden md:flex">
        <Logo className="mb-12" />
        <nav className="flex-1 space-y-2">
          <NavItem href="/dashboard" icon={<CreditCard className="w-5 h-5" />} label="Dashboard" active={pathname === "/dashboard"} />
          <NavItem href="/upload" icon={<Upload className="w-5 h-5" />} label="Upload Statement" active={pathname === "/upload"} />
          <NavItem href="/insights" icon={<Zap className="w-5 h-5" />} label="AI Insights" active={pathname === "/insights"} />
          <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={pathname === "/settings"} />
        </nav>
        <button 
          onClick={logout}
          className="flex items-center gap-3 text-zinc-400 hover:text-rose-400 transition-colors mt-auto px-4 py-3 rounded-xl hover:bg-white/5"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? "bg-white/10 text-white shadow-inner border border-white/5" 
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
