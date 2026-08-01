import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});


export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://your-vercel-url.vercel.app"),
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
};

import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { BottomNav } from "@/components/bottom-nav";
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
      className={`${plusJakarta.variable} font-sans h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F6F7EB] text-[#393E41] selection:bg-[#E94F37]/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <InstallPrompt />
            <AuthProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <BottomNav />
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
