import { RawTransaction } from "../types/transaction";
import { normalizeAmount } from "../normalizers/amount";

/**
 * Parses an ICICI bank statement from extracted text.
 * ICICI statements typically use DD/MM/YYYY or DD-Mon-YYYY format.
 * Amounts often have "Dr." and "Cr." suffixes.
 */
export function parseICICI(text: string): RawTransaction[] {
  const transactions: RawTransaction[] = [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Matches DD/MM/YYYY or DD-Mon-YYYY
  const dateRegex = /^(\d{2}[\/\-](?:\d{2}|[A-Za-z]{3})[\/\-]\d{4})/;

  let currentTransaction: Partial<RawTransaction> | null = null;
  let currentNarration: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const dateMatch = line.match(dateRegex);

    if (dateMatch) {
      if (currentTransaction && currentTransaction.date) {
        currentTransaction.description = currentNarration.join(" ");
        transactions.push(currentTransaction as RawTransaction);
      }

      currentTransaction = {
        date: dateMatch[1],
        type: "unknown",
        amount: 0,
      };
      currentNarration = [];

      // Extract amounts
      // ICICI often has amount followed by Dr. or Cr.
      const amountRegex = /([\d,]+\.\d{2})\s*(Dr\.|Cr\.|DR|CR)/i;
      const amountMatch = line.match(amountRegex);

      if (amountMatch) {
        currentTransaction.amount = normalizeAmount(amountMatch[1]);
        currentTransaction.type = amountMatch[2].toLowerCase().includes("cr")
          ? "credit"
          : "debit";
      } else {
        // Try finding amounts without suffix
        const parts = line.split(/\s+/);
        const amounts = parts.filter((p) => /^[\d,]+\.\d{2}$/.test(p));
        if (amounts.length > 0) {
          currentTransaction.amount = normalizeAmount(amounts[0]);
          currentTransaction.type = "debit"; // default
        }
      }

      // Extract narration (naive approach: take words between date and amount)
      let narration = line.replace(dateRegex, "").trim();
      if (amountMatch) {
        narration = narration.replace(amountMatch[0], "").trim();
      }

      // Remove trailing balance if present
      narration = narration.replace(/[\d,]+\.\d{2}$/, "").trim();

      currentNarration.push(narration);
    } else if (currentTransaction) {
      // Continuation of narration
      if (!line.includes("Page ") && !line.includes("Opening Balance")) {
        // Also look for amounts if we missed them
        const amountRegex = /([\d,]+\.\d{2})\s*(Dr\.|Cr\.|DR|CR)/i;
        const amountMatch = line.match(amountRegex);
        if (amountMatch && currentTransaction.amount === 0) {
          currentTransaction.amount = normalizeAmount(amountMatch[1]);
          currentTransaction.type = amountMatch[2].toLowerCase().includes("cr")
            ? "credit"
            : "debit";
          currentNarration.push(line.replace(amountMatch[0], "").trim());
        } else {
          currentNarration.push(line);
        }
      }
    }
  }

  if (currentTransaction && currentTransaction.date) {
    currentTransaction.description = currentNarration.join(" ");
    transactions.push(currentTransaction as RawTransaction);
  }

  return transactions;
}
