"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Bell, Wallet } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Animated Background Mesh & Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#10B981]/10 blur-[120px] rounded-full mix-blend-multiply animate-pulse duration-10000" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#0066FF]/10 blur-[120px] rounded-full mix-blend-multiply animate-pulse duration-7000 delay-1000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-[#10B981]/5 blur-[150px] rounded-full mix-blend-multiply animate-pulse duration-10000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Logo />
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-[#0F172A]/70 hover:text-[#0F172A] transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-[#0F172A] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors shadow-md shadow-[#0F172A]/10"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-5xl mx-auto pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Financial Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            This is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#0066FF]">KataCut.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#0F172A]/70 max-w-2xl mx-auto leading-relaxed">
            Privacy-first subscription tracker.
            <br className="hidden md:block" />
            <span className="text-[#0F172A] font-bold">Your financial data never leaves your device.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/register"
              className="flex items-center gap-2 text-base font-semibold bg-[#10B981] text-white px-8 py-4 rounded-full hover:bg-[#059669] transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:scale-105"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 text-base font-semibold bg-white text-[#0F172A] px-8 py-4 rounded-full border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all shadow-sm"
            >
              See Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating Subscription Cards */}
        <div className="w-full mt-24 mb-16 relative h-[300px] flex justify-center items-center perspective-1000">
          <FloatingCard 
            title="Netflix" cost="₹649" date="Renews in 3 days" status="Active"
            delay={0.1} yOffset={-20} xOffset={-250} rotation={-5} color="from-red-50 to-white" iconColor="bg-[#E50914] text-white" letter="N"
          />
          <FloatingCard 
            title="Adobe Creative Cloud" cost="₹2,389" date="Renews in 12 days" status="Active"
            delay={0.3} yOffset={20} xOffset={0} rotation={0} color="from-rose-50 to-indigo-50" iconColor="bg-[#FF0000] text-white" letter="A"
            featured
          />
          <FloatingCard 
            title="Spotify" cost="₹119" date="Renews in 5 days" status="Active"
            delay={0.5} yOffset={-10} xOffset={250} rotation={5} color="from-green-50 to-white" iconColor="bg-[#1DB954] text-white" letter="S"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-[#10B981]" />}
              title="Privacy First"
              description="Your bank statement never leaves your device. Processed locally."
            />
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-[#0066FF]" />}
              title="AI Detection"
              description="Automatically detects recurring payments using advanced edge AI."
            />
            <FeatureCard 
              icon={<Bell className="w-6 h-6 text-[#F59E0B]" />}
              title="Renewal Alerts"
              description="Never miss upcoming renewals and avoid surprise charges."
            />
            <FeatureCard 
              icon={<Wallet className="w-6 h-6 text-[#8B5CF6]" />}
              title="Smart Savings"
              description="Identify dormant subscriptions you forgot you were paying for."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FloatingCard({ title, cost, date, status, delay, yOffset, xOffset, rotation, color, iconColor, letter, featured = false }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset + 50, x: xOffset }}
      animate={{ opacity: 1, y: yOffset, x: xOffset, rotate: rotation }}
      transition={{ duration: 1, delay, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className={`absolute w-64 ${featured ? 'w-72 z-10' : 'z-0'}`}
    >
      <div className={`p-5 rounded-2xl bg-gradient-to-br ${color} border border-[#E2E8F0] shadow-xl shadow-[#0F172A]/5 bg-white`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center font-bold text-lg shadow-sm`}>
            {letter}
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
            {status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#0F172A] mb-1">{title}</h3>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-[#0F172A] tracking-tight">{cost}</span>
          <span className="text-xs font-medium text-[#0F172A]/50 mb-1">{date}</span>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 h-full bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all hover:shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#0F172A] mb-3 tracking-tight">{title}</h3>
      <p className="text-[#0F172A]/70 leading-relaxed">{description}</p>
    </div>
  );
}
