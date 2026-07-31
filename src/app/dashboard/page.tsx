"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseTransactions, detectBank } from "@/lib/parsers";
import { NormalizedTransaction } from "@/lib/types/transaction";
import { Subscription, SubscriptionSummary } from "@/lib/types/subscription";
import { detectSubscriptions, getSubscriptionSummary } from "@/lib/detection";
import { TransactionsTable } from "@/components/transactions-table";
import { SmsPasteArea } from "@/components/sms-paste-area";
import { StatsCards } from "@/components/stats-cards";
import { SubscriptionGrid } from "@/components/subscription-grid";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [extractedPdfText, setExtractedPdfText] = useState("");
  const [transactions, setTransactions] = useState<NormalizedTransaction[]>([]);
  const [detectedBank, setDetectedBank] = useState<string>("unknown");
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subSummary, setSubSummary] = useState<SubscriptionSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Dummy PDF parsing completion for demonstration
  // In reality, this would be triggered by a PDF.js worker
  useEffect(() => {
    if (extractedPdfText) {
      setIsProcessing(true);
      const bank = detectBank(extractedPdfText);
      setDetectedBank(bank);
      const parsed = parseTransactions(extractedPdfText, "pdf");
      
      // Merge with existing SMS transactions (if any)
      setTransactions(prev => {
        const smsTx = prev.filter(t => t.source === "sms");
        return [...parsed, ...smsTx];
      });
    } else {
       // Clear pdf transactions if text is empty
       setTransactions(prev => prev.filter(t => t.source === "sms"));
    }
  }, [extractedPdfText]);

  const handleSmsParse = (smsText: string) => {
    setIsProcessing(true);
    const parsedSms = parseTransactions(smsText, "sms");
    setTransactions(prev => [...prev, ...parsedSms]);
  };

  // Run subscription detection whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      // Small timeout to allow UI to show processing state if needed
      const timer = setTimeout(() => {
        const subs = detectSubscriptions(transactions);
        const summary = getSubscriptionSummary(subs);
        setSubscriptions(subs);
        setSubSummary(summary);
        setIsProcessing(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSubscriptions([]);
      setSubSummary(null);
      setIsProcessing(false);
    }
  }, [transactions]);

  const confidenceScore = transactions.length > 0 
    ? transactions.reduce((acc, t) => acc + t.confidence, 0) / transactions.length 
    : 1;
    
  const bankDisplayName = detectedBank === "hdfc" ? "HDFC Bank Statement" : 
                          detectedBank === "icici" ? "ICICI Bank Statement" : "Unknown Format";

  const sourceCounts = transactions.reduce((acc, t) => {
    acc[t.source] = (acc[t.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sourcesCount = Object.keys(sourceCounts).length;

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-4 bg-zinc-950 text-zinc-50 pb-20">
        <div className="w-full max-w-6xl space-y-8">
          <header className="mb-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">Welcome back, {user?.email}</p>
          </header>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl">PDF Statement Parsing (Mock)</CardTitle>
              <CardDescription className="text-zinc-400">
                Paste your extracted PDF bank statement text here to test the parsers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                placeholder="Paste HDFC or ICICI statement text here..."
                value={extractedPdfText}
                onChange={(e) => setExtractedPdfText(e.target.value)}
              />
            </CardContent>
          </Card>

          <SmsPasteArea onParse={handleSmsParse} />

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-indigo-500" />
              <p>Analyzing transactions and detecting subscriptions...</p>
            </div>
          )}

          {!isProcessing && subSummary && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold mb-4">Subscription Intelligence</h2>
                <StatsCards summary={subSummary} />
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Detected Subscriptions</h2>
                <SubscriptionGrid subscriptions={subscriptions} />
              </div>
            </div>
          )}

          {!isProcessing && transactions.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-zinc-800/50 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <div>
                  <h2 className="text-xl font-semibold">All Transactions</h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    Found {transactions.length} transactions from {sourcesCount} source{sourcesCount > 1 ? 's' : ''}.
                  </p>
                </div>
                
                {extractedPdfText && (
                  <Badge variant="outline" className={`px-3 py-1 ${detectedBank === 'unknown' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'}`}>
                    Detected: {bankDisplayName}
                  </Badge>
                )}
              </div>

              {confidenceScore < 0.7 && (
                <div className="flex items-center gap-3 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm">We had some trouble parsing this statement format. Some transactions or amounts might be inaccurate. Please verify manually.</p>
                </div>
              )}

              <TransactionsTable transactions={transactions} />
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
