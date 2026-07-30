import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KataCut - Privacy First Subscription Tracking",
  description: "KataCut - Know where your money goes. Privacy-first subscription tracking.",
};

import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
// Note: Toaster component from shadcn is usually a separate component or provider
// But if it's just the 'toaster' from ui we should use the proper one.
// The shadcn component usually provides a Toaster component in toaster.tsx.
// Let's check what was actually generated in components/ui.
// For now, I'll assume we can use the Toaster from use-toast or toaster if available.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          {/* Note: I'll need to check if Toaster exists, if not I'll create it or run shadcn again */}
        </AuthProvider>
      </body>
    </html>
  );
}
