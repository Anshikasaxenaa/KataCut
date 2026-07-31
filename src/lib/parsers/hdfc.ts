import { RawTransaction } from "../types/transaction";
import { normalizeAmount } from "../normalizers/amount";

/**
 * Parses an HDFC bank statement from extracted text.
 * HDFC statements typically have the format:
 * Date | Narration | Chq./Ref.No. | Value Dt | Withdrawal Amt. | Deposit Amt. | Closing Balance
 * E.g., "15/07/26 UPI-ZOMATO-PAYTM... 123456 15/07/26 499.00 10,000.00"
 */
export function parseHDFC(text: string): RawTransaction[] {
  const transactions: RawTransaction[] = [];
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  // Regex to match a standard HDFC transaction line
  // Looks for a date (DD/MM/YY), followed by some text, and ends with some numbers (withdrawal, deposit, balance)
  // This is a heuristic and might need to be adjusted based on the exact PDF text output
  const dateRegex = /^(\d{2}\/\d{2}\/\d{2})/;
  
  let currentTransaction: Partial<RawTransaction> | null = null;
  let currentNarration: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if the line starts with a date
    const dateMatch = line.match(dateRegex);

    if (dateMatch) {
      // If we have an existing transaction we were building (multi-line narration), save it
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

      // Try to parse the rest of the line
      // A common pattern is: Date (1), Narration (2), Ref No (3), Value Date (4), Withdrawal (5), Deposit (6), Balance (7)
      // Since spaces in narration can break simple splitting, we look at the end of the line for amounts
      
      const parts = line.split(/\s+/);
      
      // Look for the last three numeric values (withdrawal, deposit, balance) or two if one is empty
      // PDF extraction might not align columns perfectly. We'll look for numbers with commas/decimals.
      const amounts = parts.filter(p => /^[\d,]+\.\d{2}$/.test(p));
      
      if (amounts.length >= 2) {
         // Usually, if withdrawal is present, deposit is empty, and vice versa. But PDF text might omit empty columns.
         // Let's assume if there are 2 amounts, it's (Amount, Balance).
         // If there are 3, it could be (Withdrawal, Deposit, Balance) but usually one is 0.00 or empty.
         
         // To be safe, we can look for DR/CR if present, or just assume the first amount is the transaction amount
         const amountStr = amounts[0];
         currentTransaction.amount = normalizeAmount(amountStr);
         
         // HDFC doesn't always explicitly say DR/CR on the line unless it's the balance.
         // We can guess based on position, but it's tricky without fixed width.
         // Let's check if the amount matches "Withdrawal" or "Deposit" by finding its position.
         
         // A better heuristic for HDFC text:
         // Let's just store the amount. The user might need a more robust PDF parser, but we'll try our best.
         // Let's look for " CR" or " DR" in the line.
         if (line.includes(" CR ") || line.endsWith("CR")) {
           currentTransaction.type = "credit";
         } else if (line.includes(" DR ") || line.endsWith("DR")) {
           currentTransaction.type = "debit";
         } else {
           // Fallback: If we can't determine, we'll need to leave it unknown or guess based on narration
           currentTransaction.type = "debit"; // Most transactions are debits
         }
      } else {
         // If we can't find amounts cleanly, we might have to wait for the next line in some PDF extractions
      }

      // Extract narration (everything between date and the amounts/ref numbers)
      // This is a naive extraction
      const narrationMatch = line.match(/^\d{2}\/\d{2}\/\d{2}\s+(.*?)(?:\s+\d{6,})?(?:\s+\d{2}\/\d{2}\/\d{2})?(?:\s+[\d,]+\.\d{2})/);
      if (narrationMatch && narrationMatch[1]) {
        currentNarration.push(narrationMatch[1].trim());
      } else {
        currentNarration.push(line.substring(8).trim()); // Just take everything after date
      }

    } else if (currentTransaction) {
      // If it doesn't start with a date, it might be a continuation of the narration
      // Ignore lines that look like page numbers or headers
      if (!line.includes("Page ") && !line.includes("Closing Balance")) {
        // Also try to find amounts if we missed them on the first line
        const amounts = line.split(/\s+/).filter(p => /^[\d,]+\.\d{2}$/.test(p));
        if (amounts.length > 0 && currentTransaction.amount === 0) {
            currentTransaction.amount = normalizeAmount(amounts[0]);
            if (line.includes(" CR") || line.includes("Deposit")) {
                currentTransaction.type = "credit";
            }
        } else {
            currentNarration.push(line);
        }
      }
    }
  }

  // Push the last transaction
  if (currentTransaction && currentTransaction.date) {
    currentTransaction.description = currentNarration.join(" ");
    transactions.push(currentTransaction as RawTransaction);
  }

  return transactions;
}
