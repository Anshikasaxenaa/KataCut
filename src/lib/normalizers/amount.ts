/**
 * Parses amount strings and returns a number.
 * Handles "₹499", "INR 499", "1,499.00", "499/-", "499.00", etc.
 */
export function normalizeAmount(amountStr: string | number): number {
  if (typeof amountStr === "number") return amountStr;

  if (!amountStr) return 0;

  // Remove currency symbols, commas, spaces, and trailing symbols like '/-'
  let cleanStr = amountStr
    .replace(/[₹$,]/g, "")
    .replace(/INR/gi, "")
    .replace(/-$/, "") // Trailing minus/dash
    .replace(/\/-$/, "") // Trailing "/-"
    .replace(/\s/g, "");

  // If there's a Dr or Cr indicator at the end (sometimes happens if not split cleanly)
  cleanStr = cleanStr.replace(/CR$/i, "").replace(/DR$/i, "");

  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
}
