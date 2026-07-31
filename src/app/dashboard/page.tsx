"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseTransactions, detectBank } from "@/lib/parsers";
import { NormalizedTransaction } from "@/lib/types/transaction";
import { TransactionsTable } from "@/components/transactions-table";
import { SmsPasteArea } from "@/components/sms-paste-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [extractedPdfText, setExtractedPdfText] = useState("");
  const [transactions, setTransactions] = useState<NormalizedTransaction[]>([]);
  const [detectedBank, setDetectedBank] = useState<string>("unknown");
  
  // Dummy PDF parsing completion for demonstration
  // In reality, this would be triggered by a PDF.js worker
  useEffect(() => {
    if (extractedPdfText) {
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
    const parsedSms = parseTransactions(smsText, "sms");
    setTransactions(prev => [...prev, ...parsedSms]);
  };

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
        <div className="w-full max-w-6xl space-y-6">
          <header className="mb-8">
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

          {transactions.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <div>
                  <h2 className="text-xl font-semibold">Extracted Transactions</h2>
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
