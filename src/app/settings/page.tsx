"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Lock, Trash2, Key, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
          <p className="text-zinc-400">Manage your account, privacy, and encryption preferences.</p>
        </header>

        <div className="grid gap-6">
          
          {/* Privacy & Security */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Privacy & Security
            </h2>
            
            <GlassCard className="p-6">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Local Encryption</h3>
                    <p className="text-zinc-400 text-sm">Your data is encrypted locally using AES-256-GCM before syncing.</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                    Enabled
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Encryption Key</h3>
                    <p className="text-zinc-400 text-sm">Manage your zero-knowledge encryption key.</p>
                  </div>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                    <Key className="w-4 h-4" /> Export Key
                  </Button>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-rose-400 mb-1">Clear Local Data</h3>
                    <p className="text-zinc-400 text-sm">Permanently delete all locally cached statements and subscriptions.</p>
                  </div>
                  <Button variant="destructive" className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Clear Data
                  </Button>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Account */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-400" />
              Account
            </h2>
            
            <GlassCard className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Connected Email</h3>
                    <p className="text-zinc-400 text-sm">anshika@example.com (Google Sign-In)</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-rose-400 mb-1">Delete Account</h3>
                    <p className="text-zinc-400 text-sm">Permanently delete your account and all associated data.</p>
                  </div>
                  <Button variant="destructive" className="bg-rose-500 text-white hover:bg-rose-600">
                    Delete Account
                  </Button>
                </div>
              </div>
            </GlassCard>
          </section>

        </div>
      </div>
    </AppShell>
  );
}
