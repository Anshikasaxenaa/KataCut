import { Subscription, SubscriptionStatus } from "../types/subscription";

/**
 * Calculates days since the last transaction
 */
function getDaysSince(date: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates dormancy and determines status
 */
export function calculateDormancy(subscription: Partial<Subscription>): {
  status: SubscriptionStatus;
  dormantDays: number;
} {
  if (!subscription.lastBilled || !subscription.frequency) {
    return { status: "active", dormantDays: 0 };
  }

  const daysSinceLast = getDaysSince(subscription.lastBilled);
  let status: SubscriptionStatus = "active";

  // Check if dormant based on frequency
  if (subscription.frequency === "monthly" && daysSinceLast > 40) {
    status = "dormant";
  } else if (subscription.frequency === "yearly" && daysSinceLast > 380) {
    status = "dormant";
  } else if (subscription.frequency === "weekly" && daysSinceLast > 14) {
    status = "dormant";
  } else if (subscription.frequency === "quarterly" && daysSinceLast > 110) {
    status = "dormant";
  }

  // Override to 'dormant' if >60 days regardless of freq (except yearly/quarterly)
  if (
    status !== "dormant" &&
    ["monthly", "weekly", "unknown"].includes(subscription.frequency) &&
    daysSinceLast > 60
  ) {
    status = "dormant";
  }

  // Check if expiring soon (within 7 days of next billing)
  if (status === "active" && subscription.nextBilling) {
    const now = new Date();
    const daysUntilNext = Math.round(
      (subscription.nextBilling.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysUntilNext >= 0 && daysUntilNext <= 7) {
      status = "expiring_soon";
    }
  }

  return { status, dormantDays: daysSinceLast };
}
