import { RawTransaction, NormalizedTransaction } from "../types/transaction";
import { parseHDFC } from "./hdfc";
import { parseICICI } from "./icici";
import { normalizeAmount } from "../normalizers/amount";
import { normalizeDate } from "../normalizers/date";
import { normalizeMerchant } from "../normalizers/merchant";

type BankType = "hdfc" | "icici" | "unknown";

/**
 * Detects the originating bank of a given bank statement text.
 *
 * @param text - The raw text extracted from the PDF statement.
 * @returns The identified BankType or 'unknown' if no match is found.
 * @example
 * detectBank("... HDFC BANK LTD ...") // returns 'hdfc'
 */
export function detectBank(text: string): BankType {
  const upperText = text.toUpperCase();
  if (upperText.includes("HDFC BANK")) return "hdfc";
  if (upperText.includes("ICICI BANK")) return "icici";
  return "unknown";
}

function parseSMS(text: string): RawTransaction[] {
  // A simple SMS parser for demonstration
  // Real implementation would look for "Rs." or "INR", "debited", "credited", and a date
  const transactions: RawTransaction[] = [];
  const lines = text.split("\n").filter(Boolean);

  for (const line of lines) {
    const amountMatch = line.match(/(?:Rs\.?|INR)\s*([\d,]+\.?\d*)/i);
    const dateMatch = line.match(
      /on\s+(\d{1,2}[-\/][A-Za-z]+[-\/]\d{2,4}|\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    );
    const isDebit = /(?:debited|spent|paid)/i.test(line);
    const isCredit = /(?:credited|received)/i.test(line);

    if (amountMatch) {
      transactions.push({
        date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString(),
        description: line,
        amount: normalizeAmount(amountMatch[1]),
        type: isCredit ? "credit" : isDebit ? "debit" : "unknown",
      });
    }
  }

  return transactions;
}

/**
 * Parses raw text from a PDF statement or SMS string and normalizes the transactions.
 *
 * **Algorithm Decision**: We parse on the client side using Web Workers to ensure PII
 * (Personal Identifiable Information) like Account Numbers never leave the user's device.
 *
 * @param text - The raw text extracted from PDF or SMS.
 * @param source - The source of the text ('pdf' or 'sms').
 * @returns Array of NormalizedTransaction objects.
 */
export function parseTransactions(
  text: string,
  source: "pdf" | "sms",
): NormalizedTransaction[] {
  let rawTransactions: RawTransaction[] = [];
  let bank: BankType = "unknown";

  if (source === "pdf") {
    bank = detectBank(text);
    if (bank === "hdfc") {
      rawTransactions = parseHDFC(text);
    } else if (bank === "icici") {
      rawTransactions = parseICICI(text);
    } else {
      // Fallback or generic PDF parser could go here
      rawTransactions = parseHDFC(text); // Using HDFC as a naive fallback for now
    }
  } else if (source === "sms") {
    rawTransactions = parseSMS(text);
  }

  return rawTransactions.map((raw, index) => {
    return {
      id: `${source}-${Date.now()}-${index}`,
      date: normalizeDate(raw.date),
      amount: raw.amount,
      type: raw.type === "unknown" ? "debit" : raw.type,
      merchant: normalizeMerchant(raw.description),
      rawDescription: raw.description,
      source,
      confidence: bank === "unknown" && source === "pdf" ? 0.5 : 0.9,
    };
  });
}
