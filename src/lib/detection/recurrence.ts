import { NormalizedTransaction } from "../types/transaction";
import { Subscription, SubscriptionFrequency } from "../types/subscription";
import { KNOWN_MERCHANTS_DB } from "./known-merchants";
import { predictNextBilling } from "./predictor";

/**
 * Calculates percentage difference between two amounts
 */
function calculateVariance(amounts: number[]): number {
  if (amounts.length <= 1) return 0;

  // Compare max and min to see total spread
  const max = Math.max(...amounts);
  const min = Math.min(...amounts);

  if (min === 0) return 100; // prevent divide by zero

  return ((max - min) / min) * 100;
}

/**
 * Filter out non-subscriptions based on keywords and heuristics
 */
function isNonSubscription(group: NormalizedTransaction[]): boolean {
  // If it's a huge amount (e.g. rent) that has varying descriptions like IMPS/NEFT
  const avgAmount = group.reduce((acc, t) => acc + t.amount, 0) / group.length;

  // Rent usually round numbers, high amount, transfer
  if (avgAmount > 8000 && avgAmount % 500 === 0) {
    const isTransfer = group.some(
      (t) =>
        t.rawDescription.includes("IMPS") || t.rawDescription.includes("NEFT"),
    );
    if (isTransfer) return true;
  }

  // EMI and SIP keywords
  const filterKeywords = [
    "EMI",
    "LOAN",
    "SIP",
    "MUTUAL FUND",
    "SALARY",
    "ATM",
    "CASH",
    "WITHDRAWAL",
  ];

  for (const t of group) {
    const desc = t.rawDescription.toUpperCase();
    if (filterKeywords.some((kw) => desc.includes(kw))) {
      return true;
    }
  }

  return false;
}

/**
 * Analyzes a group of transactions to see if they form a subscription
 */
export function detectRecurrence(
  merchant: string,
  group: NormalizedTransaction[],
): Partial<Subscription> | null {
  if (group.length < 2) return null;
  if (isNonSubscription(group)) return null;

  // Sort chronological
  const sorted = [...group].sort((a, b) => a.date.getTime() - b.date.getTime());

  const intervals: number[] = [];
  const amounts = sorted.map((t) => t.amount);

  for (let i = 1; i < sorted.length; i++) {
    const diffTime = Math.abs(
      sorted[i].date.getTime() - sorted[i - 1].date.getTime(),
    );
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    intervals.push(diffDays);
  }

  const averageInterval =
    intervals.reduce((acc, val) => acc + val, 0) / intervals.length;

  // Determine frequency
  let frequency: SubscriptionFrequency = "unknown";
  if (averageInterval >= 25 && averageInterval <= 35) frequency = "monthly";
  else if (averageInterval >= 80 && averageInterval <= 100)
    frequency = "quarterly";
  else if (averageInterval >= 350 && averageInterval <= 380)
    frequency = "yearly";
  else if (averageInterval >= 6 && averageInterval <= 8) frequency = "weekly";

  // If we can't determine a regular frequency, check if it matches a known merchant
  const knownMatch = KNOWN_MERCHANTS_DB.find(
    (km) => km.merchant.toLowerCase() === merchant.toLowerCase(),
  );

  if (frequency === "unknown" && !knownMatch) {
    // Too irregular to be a subscription and not known
    return null;
  }

  if (frequency === "unknown" && knownMatch) {
    frequency = knownMatch.frequency;
  }

  // Calculate amount consistency
  const variance = calculateVariance(amounts);
  let confidence = 50; // base confidence

  if (variance <= 5)
    confidence += 30; // High amount consistency
  else if (variance <= 15)
    confidence += 10; // Medium consistency
  else confidence -= 20; // Low consistency (might be a regular grocery shop instead of a sub)

  // Boost confidence if interval is highly regular
  const { nextBilling, stdDev } = predictNextBilling(
    sorted[sorted.length - 1].date,
    averageInterval,
    intervals,
  );

  if (stdDev < 3) confidence += 20;
  else if (stdDev < 7) confidence += 10;
  else confidence -= 10;

  // Boost confidence if known merchant
  if (knownMatch) confidence += 20;

  // Adjust by occurrence count
  if (sorted.length > 3) confidence += 10;

  // Cap at 100, floor at 0
  confidence = Math.max(0, Math.min(100, confidence));

  // If confidence is too low after all checks, skip it
  if (confidence < 30) return null;

  return {
    merchant: knownMatch ? knownMatch.merchant : merchant,
    amount: amounts[amounts.length - 1], // latest amount
    frequency,
    lastBilled: sorted[sorted.length - 1].date,
    nextBilling,
    totalSpent: amounts.reduce((acc, val) => acc + val, 0),
    occurrenceCount: sorted.length,
    confidence,
    transactions: sorted,
    firstSeen: sorted[0].date,
    averageInterval,
  };
}
