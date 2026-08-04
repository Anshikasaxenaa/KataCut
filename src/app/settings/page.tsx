"use client";

import { TopHeader } from "@/components/dashboard/TopHeader";
import { Shield, Key, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopHeader />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Settings</h1>
            <p className="text-[#0F172A]/60">Manage your account, privacy, and encryption preferences.</p>
          </header>

          <div className="grid gap-6">
            
            {/* Privacy & Security */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#10B981]" />
                Privacy & Security
              </h2>
              
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E2E8F0]">
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A] mb-1">Local Encryption</h3>
                      <p className="text-[#0F172A]/60 text-sm">Your data is encrypted locally using AES-256-GCM before syncing.</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-xs font-bold uppercase tracking-wider">
                      Enabled
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A] mb-1">Encryption Key</h3>
                      <p className="text-[#0F172A]/60 text-sm">Manage your zero-knowledge encryption key.</p>
                    </div>
                    <Button onClick={() => alert("Exporting key...")} variant="outline" className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2">
                      <Key className="w-4 h-4" /> Export Key
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#F43F5E] mb-1">Clear Local Data</h3>
                      <p className="text-[#0F172A]/60 text-sm">Permanently delete all locally cached statements and subscriptions.</p>
                    </div>
                    <Button onClick={() => {
                        if (confirm("Are you sure you want to clear local data?")) {
                          alert("Local data cleared.");
                        }
                      }} variant="destructive" className="bg-[#F43F5E]/10 text-[#F43F5E] hover:bg-[#F43F5E]/20 border border-[#F43F5E]/20 flex items-center gap-2 shadow-none">
                      <Trash2 className="w-4 h-4" /> Clear Data
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Account */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#0066FF]" />
                Account
              </h2>
              
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E2E8F0]">
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A] mb-1">Connected Email</h3>
                      <p className="text-[#0F172A]/60 text-sm">anshika@example.com (Google Sign-In)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#F43F5E] mb-1">Delete Account</h3>
                      <p className="text-[#0F172A]/60 text-sm">Permanently delete your account and all associated data.</p>
                    </div>
                    <Button onClick={() => {
                        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                          alert("Account deleted.");
                        }
                      }} variant="destructive" className="bg-[#F43F5E] text-white hover:bg-[#E11D48] shadow-sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
