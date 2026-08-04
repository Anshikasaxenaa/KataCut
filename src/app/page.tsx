"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Bell, Wallet } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background Mesh & Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-7000 delay-1000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-10000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Logo />
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-white text-zinc-950 px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Financial Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            This is <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">KataCut.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Privacy-first subscription tracker.
            <br className="hidden md:block" />
            <span className="text-zinc-300 font-medium">Your financial data never leaves your device.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/register"
              className="flex items-center gap-2 text-base font-semibold bg-emerald-500 text-zinc-950 px-8 py-4 rounded-full hover:bg-emerald-400 transition-all shadow-[0_0_40px_8px_rgba(16,185,129,0.2)] hover:scale-105"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 text-base font-semibold bg-zinc-900 text-white px-8 py-4 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-all"
            >
              See Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating Subscription Cards */}
        <div className="w-full mt-24 mb-16 relative h-[300px] flex justify-center items-center perspective-1000">
          <FloatingCard 
            title="Netflix" cost="₹649" date="Renews in 3 days" status="Active"
            delay={0.1} yOffset={-20} xOffset={-250} rotation={-5} color="from-red-500/20 to-red-600/5"
          />
          <FloatingCard 
            title="Adobe Creative Cloud" cost="₹2,389" date="Renews in 12 days" status="Active"
            delay={0.3} yOffset={20} xOffset={0} rotation={0} color="from-rose-500/20 to-indigo-600/5"
            featured
          />
          <FloatingCard 
            title="Spotify" cost="₹119" date="Renews in 5 days" status="Active"
            delay={0.5} yOffset={-10} xOffset={250} rotation={5} color="from-green-500/20 to-green-600/5"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-zinc-950/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-emerald-400" />}
              title="Privacy First"
              description="Your bank statement never leaves your device. Processed locally."
            />
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-sky-400" />}
              title="AI Detection"
              description="Automatically detects recurring payments using advanced edge AI."
            />
            <FeatureCard 
              icon={<Bell className="w-6 h-6 text-amber-400" />}
              title="Renewal Alerts"
              description="Never miss upcoming renewals and avoid surprise charges."
            />
            <FeatureCard 
              icon={<Wallet className="w-6 h-6 text-indigo-400" />}
              title="Smart Savings"
              description="Identify dormant subscriptions you forgot you were paying for."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FloatingCard({ title, cost, date, status, delay, yOffset, xOffset, rotation, color, featured = false }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset + 50, x: xOffset }}
      animate={{ opacity: 1, y: yOffset, x: xOffset, rotate: rotation }}
      transition={{ duration: 1, delay, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className={`absolute w-64 ${featured ? 'w-72 z-10' : 'z-0'}`}
    >
      <GlassCard className={`p-5 bg-gradient-to-br ${color} border-white/10`}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-inner">
            <div className="w-5 h-5 bg-zinc-700 rounded-full animate-pulse" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
            {status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-white tracking-tight">{cost}</span>
          <span className="text-xs text-zinc-400 mb-1">{date}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <GlassCard hoverEffect className="p-8 h-full">
      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </GlassCard>
  );
}
