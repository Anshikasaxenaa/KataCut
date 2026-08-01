import { StatsCards } from "@/components/stats-cards";
import { UploadDropzone } from "@/components/upload-dropzone";
import { SubscriptionGrid } from "@/components/subscription-grid";
import { Subscription, SubscriptionSummary } from "@/lib/types/subscription";

// Mock data for UI demonstration
const mockSummary: SubscriptionSummary = {
  totalMonthlySpend: 2340,
  activeCount: 3,
  dormantCount: 2,
  potentialSavings: 948,
};

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    merchant: "Netflix",
    amount: 649,
    frequency: "monthly",
    status: "active",
    nextBilling: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    confidence: 98,
    totalSpent: 7788,
    dormantDays: 0,
    lastBilled: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    occurrenceCount: 12,
    firstSeen: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    averageInterval: 30,
    transactions: [
      { id: "t1", date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000), amount: 649, rawDescription: "NETFLIX ENTERTAINMENT", type: "debit", merchant: "Netflix", source: "pdf", confidence: 98 },
    ],
  },
  {
    id: "2",
    merchant: "Cult.fit",
    amount: 500,
    frequency: "monthly",
    status: "dormant",
    nextBilling: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    confidence: 95,
    totalSpent: 6000,
    dormantDays: 92, // Dormant warning
    lastBilled: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    occurrenceCount: 12,
    firstSeen: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    averageInterval: 30,
    transactions: [
      { id: "t2", date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), amount: 500, rawDescription: "CUREFIT SERVICES", type: "debit", merchant: "Cult.fit", source: "pdf", confidence: 95 },
    ],
  },
  {
    id: "3",
    merchant: "Spotify",
    amount: 119,
    frequency: "monthly",
    status: "active",
    nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    confidence: 99,
    totalSpent: 1428,
    dormantDays: 0,
    lastBilled: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    occurrenceCount: 12,
    firstSeen: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    averageInterval: 30,
    transactions: [
      { id: "t3", date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), amount: 119, rawDescription: "SPOTIFY PREMIUM", type: "debit", merchant: "Spotify", source: "pdf", confidence: 99 },
    ],
  },
  {
    id: "4",
    merchant: "Adobe Creative Cloud",
    amount: 448,
    frequency: "monthly",
    status: "dormant",
    nextBilling: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    confidence: 90,
    totalSpent: 5376,
    dormantDays: 105,
    lastBilled: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    occurrenceCount: 12,
    firstSeen: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    averageInterval: 30,
    transactions: [
      { id: "t4", date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), amount: 448, rawDescription: "ADOBE SYSTEMS", type: "debit", merchant: "Adobe Creative Cloud", source: "pdf", confidence: 90 },
    ],
  },
  {
    id: "5",
    merchant: "Amazon Prime",
    amount: 1499,
    frequency: "yearly",
    status: "expiring_soon",
    nextBilling: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    confidence: 97,
    totalSpent: 4497,
    dormantDays: 0,
    lastBilled: new Date(Date.now() - 358 * 24 * 60 * 60 * 1000),
    occurrenceCount: 3,
    firstSeen: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000),
    averageInterval: 365,
    transactions: [
      { id: "t5", date: new Date(Date.now() - 358 * 24 * 60 * 60 * 1000), amount: 1499, rawDescription: "AMAZON SELLER SVCS", type: "debit", merchant: "Amazon Prime", source: "pdf", confidence: 97 },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pt-8">
      
      {/* 1. Summary Dashboard Metrics */}
      <section>
        <StatsCards summary={mockSummary} />
      </section>

      {/* 2. Upload Dropzone */}
      <section>
        <UploadDropzone />
      </section>

      {/* 3. Subscription Feed */}
      <section className="pt-4">
        <h2 className="text-xl font-bold text-[#393E41] mb-6 tracking-tight flex items-center gap-2">
          Your Subscriptions
          <span className="text-sm font-normal text-[#393E41]/70 bg-[#393E41]/10 px-2 py-0.5 rounded-full">
            {mockSubscriptions.length} Found
          </span>
        </h2>
        <SubscriptionGrid subscriptions={mockSubscriptions} />
      </section>

    </div>
  );
}
