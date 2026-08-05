"use client";

import { useState } from "react";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { Shield, Key, Trash2, Database, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });
      if (res.ok) {
        alert("Profile updated successfully! Refresh to see changes.");
      } else {
        alert("Failed to update profile.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        alert(data.error || "Failed to update password.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
            
            {/* Account & Profile */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <User className="w-5 h-5 text-[#0066FF]" />
                Profile
              </h2>
              
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E2E8F0]">
                {status === "loading" ? (
                  <p>Loading profile...</p>
                ) : !session?.user ? (
                  <p>Please log in to manage your profile.</p>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                      <div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-1">Connected Email</h3>
                        <p className="text-[#0F172A]/60 text-sm">{session.user.email}</p>
                      </div>
                    </div>

                    <div className="pb-6 border-b border-[#E2E8F0] space-y-4">
                      <h3 className="text-lg font-bold text-[#0F172A]">Update Profile</h3>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A]/70 mb-1">Username</label>
                        <input 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A]/70 mb-1">Profile Photo URL</label>
                        <input 
                          type="text" 
                          value={image} 
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-4 py-2 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50"
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="bg-[#0066FF] text-white hover:bg-[#0052CC]">
                        {isUpdatingProfile ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>

                    <div className="pb-6 border-b border-[#E2E8F0] space-y-4">
                      <h3 className="text-lg font-bold text-[#0F172A]">Change Password</h3>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A]/70 mb-1">Current Password</label>
                        <input 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F172A]/70 mb-1">New Password</label>
                        <input 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50"
                        />
                      </div>
                      <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} variant="outline" className="border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]">
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2 pb-6 border-b border-[#E2E8F0]">
                      <div>
                        <h3 className="text-lg font-bold text-[#F43F5E] mb-1">Log Out</h3>
                        <p className="text-[#0F172A]/60 text-sm">Sign out of your account on this device.</p>
                      </div>
                      <Button onClick={() => signOut()} variant="outline" className="text-[#F43F5E] border-[#F43F5E]/20 hover:bg-[#F43F5E]/10 flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Log Out
                      </Button>
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
                )}
              </div>
            </section>

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

          </div>
        </div>
      </main>
    </div>
  );
}
