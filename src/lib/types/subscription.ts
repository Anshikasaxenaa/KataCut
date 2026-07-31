import { NormalizedTransaction } from "./transaction";

export type SubscriptionFrequency =
  "monthly" | "yearly" | "quarterly" | "weekly" | "unknown";
export type SubscriptionStatus =
  "active" | "dormant" | "expiring_soon" | "cancelled";

export interface Subscription {
  id: string;
  merchant: string;
  amount: number;
  frequency: SubscriptionFrequency;
  lastBilled: Date;
  nextBilling: Date | null;
  totalSpent: number;
  occurrenceCount: number;
  status: SubscriptionStatus;
  confidence: number; // 0-100
  dormantDays: number;
  transactions: NormalizedTransaction[];
  firstSeen: Date;
  averageInterval: number; // in days
}

export interface SubscriptionSummary {
  totalMonthlySpend: number;
  activeCount: number;
  dormantCount: number;
  potentialSavings: number;
}
