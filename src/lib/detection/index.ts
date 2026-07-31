import { NormalizedTransaction } from "../types/transaction";
import { Subscription, SubscriptionSummary } from "../types/subscription";
import { groupByMerchant } from "./grouper";
import { detectRecurrence } from "./recurrence";
import { calculateDormancy } from "./dormancy";

/**
 * Pipeline to detect recurring subscriptions from a list of transactions.
 *
 * **Algorithm Decision**: We use a 5% tolerance on the recurring transaction amount
 * to account for GST changes or slight currency variations in Indian subscriptions.
 * Fuzzy matching (Levenshtein distance) is used to group similar merchant names.
 *
 * @param transactions - Array of normalized transactions.
 * @returns Array of identified Subscriptions.
 */
export function detectSubscriptions(
  transactions: NormalizedTransaction[],
): Subscription[] {
  const groups = groupByMerchant(transactions);
  const subscriptions: Subscription[] = [];

  for (const [merchant, groupTxs] of Object.entries(groups)) {
    const subPartial = detectRecurrence(merchant, groupTxs);

    if (subPartial) {
      const { status, dormantDays } = calculateDormancy(subPartial);

      const subscription: Subscription = {
        ...subPartial,
        id: `sub-${merchant.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        status,
        dormantDays,
      } as Subscription;

      subscriptions.push(subscription);
    }
  }

  // Sort: dormant first, then by amount descending
  subscriptions.sort((a, b) => {
    if (a.status === "dormant" && b.status !== "dormant") return -1;
    if (a.status !== "dormant" && b.status === "dormant") return 1;
    return b.amount - a.amount;
  });

  return subscriptions;
}

/**
 * Calculates a summary based on detected subscriptions.
 * Normalizes all frequencies (yearly, quarterly, weekly) into a standardized monthly equivalent.
 *
 * @param subscriptions - Array of detected Subscriptions.
 * @returns SubscriptionSummary containing total monthly spend, active/dormant counts, and potential savings.
 */
export function getSubscriptionSummary(
  subscriptions: Subscription[],
): SubscriptionSummary {
  let totalMonthlySpend = 0;
  let activeCount = 0;
  let dormantCount = 0;
  let potentialSavings = 0;

  for (const sub of subscriptions) {
    if (sub.status === "dormant") {
      dormantCount++;
      // Assume potential savings is the amount of the dormant sub normalized to monthly
      if (sub.frequency === "yearly") {
        potentialSavings += sub.amount / 12;
      } else if (sub.frequency === "weekly") {
        potentialSavings += sub.amount * 4.33;
      } else if (sub.frequency === "quarterly") {
        potentialSavings += sub.amount / 3;
      } else {
        potentialSavings += sub.amount;
      }
    } else {
      activeCount++;
      // Add to monthly spend
      if (sub.frequency === "yearly") {
        totalMonthlySpend += sub.amount / 12;
      } else if (sub.frequency === "weekly") {
        totalMonthlySpend += sub.amount * 4.33;
      } else if (sub.frequency === "quarterly") {
        totalMonthlySpend += sub.amount / 3;
      } else {
        totalMonthlySpend += sub.amount;
      }
    }
  }

  return {
    totalMonthlySpend: Math.round(totalMonthlySpend),
    activeCount,
    dormantCount,
    potentialSavings: Math.round(potentialSavings),
  };
}
