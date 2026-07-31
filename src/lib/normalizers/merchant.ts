export const KNOWN_MERCHANTS: Record<string, string> = {
  "NETFLIX.COM": "Netflix",
  "NETFLIX": "Netflix",
  "AMAZON PRIME": "Amazon Prime",
  "AMZN PRIME": "Amazon Prime",
  "SPOTIFY": "Spotify",
  "SWIGGY": "Swiggy",
  "ZOMATO": "Zomato",
  "GOOGLE YOUTUBE": "YouTube Premium",
  "YOUTUBE": "YouTube Premium",
  "DISNEY+ HOTSTAR": "Disney+ Hotstar",
  "HOTSTAR": "Disney+ Hotstar",
  "MICROSOFT 365": "Microsoft 365",
  "GOOGLE ONE": "Google One",
  "UBER": "Uber",
  "OLA": "Ola",
  "BLINKIT": "Blinkit",
  "ZEPTO": "Zepto",
  "CRED": "CRED",
  "PAYTM": "Paytm",
  "PHONEPE": "PhonePe",
  "GPAY": "Google Pay",
  "AIRTEL": "Airtel",
  "JIO": "Jio",
};

/**
 * Capitalizes the first letter of each word in a string.
 */
function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

/**
 * Cleans and maps a raw transaction description into a friendly merchant name.
 */
export function normalizeMerchant(rawDescription: string): string {
  if (!rawDescription) return "Unknown Merchant";

  const upperDesc = rawDescription.toUpperCase();

  // Try exact or includes match for known merchants
  for (const [key, value] of Object.entries(KNOWN_MERCHANTS)) {
    if (upperDesc.includes(key)) {
      return value;
    }
  }

  // UPI Extraction
  // Examples: "UPI-ZOMATO-PAYTM@PAYTM-..." or "UPI/ZOMATO/..."
  const upiMatch = upperDesc.match(/UPI(?:-|\/)([^-\/@]+)/);
  if (upiMatch && upiMatch[1]) {
    const upiMerchant = upiMatch[1].trim();
    return toTitleCase(upiMerchant);
  }

  // POS / ECOM Extraction
  // E.g., "POS XXXXXX ZOMATO" or "ECOM XXXXXX SWIGGY"
  const posEcomMatch = upperDesc.match(/(?:POS|ECOM)[\s\d]+([A-Z\s]+)/);
  if (posEcomMatch && posEcomMatch[1]) {
    return toTitleCase(posEcomMatch[1].trim());
  }

  // IMPS/NEFT extraction
  const transferMatch = upperDesc.match(/(?:IMPS|NEFT)[\/\-](?:[A-Z0-9]+)[\/\-]([A-Z\s]+)/);
  if (transferMatch && transferMatch[1]) {
     return toTitleCase(transferMatch[1].trim());
  }

  // Fallback: take the first significant word/phrase
  const words = rawDescription
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["UPI", "POS", "ECOM", "IMPS", "NEFT", "RTGS", "DR", "CR"].includes(w.toUpperCase()));

  if (words.length > 0) {
    return toTitleCase(words.slice(0, 3).join(" ")); // up to first 3 words
  }

  // Ultimate fallback
  return toTitleCase(rawDescription.substring(0, 20).trim());
}
