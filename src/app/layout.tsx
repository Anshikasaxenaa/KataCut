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
  description:
    "Upload your bank statement to find and cancel forgotten subscriptions. 100% private, zero-knowledge encryption.",
  keywords: [
    "subscription tracker",
    "personal finance",
    "privacy",
    "bank statement parser",
    "zero knowledge",
  ],
  authors: [{ name: "KataCut Team" }],
  creator: "KataCut Team",
  openGraph: {
    title: "KataCut - Privacy First Subscription Tracking",
    description:
      "Upload your bank statement to find and cancel forgotten subscriptions. Your data never leaves your device.",
    url: "https://your-vercel-url.vercel.app",
    siteName: "KataCut",
    images: [
      {
        url: "/screenshots/dashboard.png",
        width: 1080,
        height: 1920,
        alt: "KataCut Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KataCut - Privacy First Subscription Tracking",
    description: "Find and cancel forgotten subscriptions with 100% privacy.",
    images: ["/screenshots/dashboard.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://your-vercel-url.vercel.app",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KataCut",
  },
  themeColor: "#0f172a",
};

import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { ErrorBoundary } from "@/components/error-boundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <InstallPrompt />
            <AuthProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
