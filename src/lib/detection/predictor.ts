import { Subscription } from "../types/subscription";

/**
 * Calculates standard deviation of a number array
 */
function standardDeviation(arr: number[]): number {
  if (arr.length <= 1) return 0;
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const variance =
    arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    (arr.length - 1);
  return Math.sqrt(variance);
}

/**
 * Predicts the next billing date for a subscription.
 * Also adjusts confidence based on standard deviation of intervals.
 */
export function predictNextBilling(
  lastBilled: Date,
  averageInterval: number,
  intervals: number[],
): { nextBilling: Date | null; stdDev: number } {
  if (averageInterval <= 0) {
    return { nextBilling: null, stdDev: 0 };
  }

  const nextBilling = new Date(
    lastBilled.getTime() + averageInterval * 24 * 60 * 60 * 1000,
  );
  const stdDev = standardDeviation(intervals);

  return { nextBilling, stdDev };
}
