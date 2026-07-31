"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingDown } from "lucide-react";

// Mock data for demonstration - in a real app, this would come from an API
const cancelledSubscriptions = [
  { id: 1, merchant: "Swiggy One", cancelledDate: new Date("2026-06-15"), amount: 149, frequency: "month" },
  { id: 2, merchant: "Disney+ Hotstar", cancelledDate: new Date("2026-03-10"), amount: 299, frequency: "month" },
  { id: 3, merchant: "Cult.fit", cancelledDate: new Date("2025-12-01"), amount: 1499, frequency: "month" },
];

export function CancellationHistory() {
  // Calculate total monthly savings
  const totalMonthlySavings = cancelledSubscriptions.reduce((acc, sub) => {
    // Standardize to monthly
    let monthlyAmount = sub.amount;
    if (sub.frequency === "year") monthlyAmount = sub.amount / 12;
    if (sub.frequency === "week") monthlyAmount = sub.amount * 4.33;
    return acc + monthlyAmount;
  }, 0);

  // Calculate total saved since cancellation (months since * monthly amount)
  const calculateSavedSince = (date: Date, monthlyAmount: number) => {
    const now = new Date();
    const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    const effectiveMonths = Math.max(1, months); // At least 1 month saved if just cancelled
    return Math.round(effectiveMonths * monthlyAmount);
  };

  if (cancelledSubscriptions.length === 0) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No cancelled subscriptions yet</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            When you cancel unused subscriptions using the "Review & Cancel" button, they will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-none shadow-md overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10">
          <TrendingDown className="w-48 h-48 -mr-10 -mt-10" />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-emerald-100 font-medium mb-1">Total Monthly Savings</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold">₹{Math.round(totalMonthlySavings).toLocaleString("en-IN")}</h2>
            <span className="text-emerald-100 text-lg">/month</span>
          </div>
          <p className="text-sm text-emerald-100 mt-4 opacity-80">
            Great job trimming the fat from your expenses!
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <CardTitle className="text-base font-semibold">Cancelled Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-950/30">
              <TableRow className="border-zinc-100 dark:border-zinc-800">
                <TableHead className="font-medium text-zinc-500">Merchant</TableHead>
                <TableHead className="font-medium text-zinc-500 hidden sm:table-cell">Cancelled On</TableHead>
                <TableHead className="font-medium text-zinc-500">Amount Saved</TableHead>
                <TableHead className="font-medium text-zinc-500 text-right">Total Saved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cancelledSubscriptions.map((sub) => {
                let monthlyAmount = sub.amount;
                if (sub.frequency === "year") monthlyAmount = sub.amount / 12;
                if (sub.frequency === "week") monthlyAmount = sub.amount * 4.33;
                
                const totalSaved = calculateSavedSince(sub.cancelledDate, monthlyAmount);

                return (
                  <TableRow key={sub.id} className="border-zinc-100 dark:border-zinc-800">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {sub.merchant}
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-[10px] py-0 hidden md:inline-flex">
                          Cancelled
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-500 hidden sm:table-cell">
                      {sub.cancelledDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      ₹{Math.round(monthlyAmount).toLocaleString("en-IN")}/mo
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{totalSaved.toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
