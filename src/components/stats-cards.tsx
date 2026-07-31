import { SubscriptionSummary } from "@/lib/types/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Layers, AlertTriangle, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  summary: SubscriptionSummary;
}

export function StatsCards({ summary }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-zinc-900 border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Monthly Spend</CardTitle>
          <IndianRupee className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-50">
            ₹{summary.totalMonthlySpend.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Est. recurring outflow</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Active Subscriptions</CardTitle>
          <Layers className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-50">{summary.activeCount}</div>
          <p className="text-xs text-zinc-500 mt-1">Currently billing</p>
        </CardContent>
      </Card>

      <Card className={`border-zinc-800 bg-gradient-to-br ${summary.dormantCount > 0 ? 'from-rose-950/40 to-zinc-900' : 'from-zinc-900 to-zinc-900/50'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${summary.dormantCount > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
            Dormant Alerts
          </CardTitle>
          <AlertTriangle className={`h-4 w-4 ${summary.dormantCount > 0 ? 'text-rose-400' : 'text-zinc-400'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${summary.dormantCount > 0 ? 'text-rose-500' : 'text-zinc-50'}`}>
            {summary.dormantCount}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Unused for 60+ days</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 bg-gradient-to-br from-emerald-950/20 to-zinc-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-500">Potential Savings</CardTitle>
          <TrendingDown className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-400">
            ₹{summary.potentialSavings.toLocaleString("en-IN")}/mo
          </div>
          <p className="text-xs text-emerald-500/70 mt-1">By cancelling dormant subs</p>
        </CardContent>
      </Card>
    </div>
  );
}
