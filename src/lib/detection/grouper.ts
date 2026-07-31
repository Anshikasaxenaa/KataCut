import { NormalizedTransaction } from "../types/transaction";

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Aggressive normalization for merchant names to group them effectively
 */
function aggressiveNormalize(name: string): string {
  let normalized = name.toLowerCase();

  // Remove special chars
  normalized = normalized.replace(/[^a-z0-9\s]/g, " ");

  // Remove common suffixes
  const suffixes = [
    " com",
    " inc",
    " ltd",
    " pvt",
    " private",
    " limited",
    " llc",
    " co",
  ];
  for (const suffix of suffixes) {
    if (normalized.endsWith(suffix)) {
      normalized = normalized.slice(0, -suffix.length);
    }
  }

  // Condense spaces
  return normalized.replace(/\s+/g, " ").trim();
}

/**
 * Groups transactions by merchant using fuzzy matching
 * Minimum 2 transactions per group
 */
export function groupByMerchant(
  transactions: NormalizedTransaction[],
): Record<string, NormalizedTransaction[]> {
  const groups: Record<string, NormalizedTransaction[]> = {};

  // Base map of original merchant name to aggressive normalized form
  const normalizedNames = new Map<string, string>();
  transactions.forEach((t) => {
    normalizedNames.set(t.merchant, aggressiveNormalize(t.merchant));
  });

  for (const t of transactions) {
    // Only consider debits for subscriptions
    if (t.type !== "debit") continue;

    const normT = normalizedNames.get(t.merchant) || "";

    // Hardcoded rules as requested
    // "AMAZON PRIME VIDEO" and "AMAZON" → separate. "GOOGLE YOUTUBE" and "GOOGLE PLAY" → separate
    let matchedGroup: string | null = null;

    for (const groupName of Object.keys(groups)) {
      const normGroup = aggressiveNormalize(groupName);

      // If one is Amazon Prime and the other is Amazon, don't group
      if (
        (normT.includes("amazon prime") && normGroup === "amazon") ||
        (normGroup.includes("amazon prime") && normT === "amazon")
      ) {
        continue;
      }

      // If one is Google Youtube and the other is Google Play, don't group
      if (
        (normT.includes("google youtube") &&
          normGroup.includes("google play")) ||
        (normGroup.includes("google youtube") && normT.includes("google play"))
      ) {
        continue;
      }

      // Exact match after normalization (e.g. NETFLIX.COM and NETFLIX)
      if (normT === normGroup) {
        matchedGroup = groupName;
        break;
      }

      // Fuzzy match using Levenshtein distance
      // Allow max distance of 2 for strings > 5 chars
      if (normT.length > 5 && normGroup.length > 5) {
        const dist = levenshtein(normT, normGroup);
        if (dist <= 2) {
          matchedGroup = groupName;
          break;
        }
      }

      // Inclusion match (if one strictly contains the other and length diff is small)
      if (
        (normT.includes(normGroup) || normGroup.includes(normT)) &&
        Math.abs(normT.length - normGroup.length) <= 4
      ) {
        matchedGroup = groupName;
        break;
      }
    }

    if (matchedGroup) {
      groups[matchedGroup].push(t);
    } else {
      // Use the original merchant name as the group key
      groups[t.merchant] = [t];
    }
  }

  // Filter groups with minimum 2 transactions
  const finalGroups: Record<string, NormalizedTransaction[]> = {};
  for (const [key, txs] of Object.entries(groups)) {
    if (txs.length >= 2) {
      finalGroups[key] = txs;
    }
  }

  return finalGroups;
}
