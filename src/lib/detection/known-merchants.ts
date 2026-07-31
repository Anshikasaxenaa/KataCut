import { SubscriptionFrequency } from "../types/subscription";

export interface KnownMerchant {
  merchant: string;
  typicalAmount?: number;
  frequency: SubscriptionFrequency;
  category: string;
}

export const KNOWN_MERCHANTS_DB: KnownMerchant[] = [
  { merchant: "Netflix", typicalAmount: 649, frequency: "monthly", category: "Entertainment" },
  { merchant: "Netflix", typicalAmount: 199, frequency: "monthly", category: "Entertainment" },
  { merchant: "Netflix", typicalAmount: 499, frequency: "monthly", category: "Entertainment" },
  { merchant: "Amazon Prime", typicalAmount: 1499, frequency: "yearly", category: "Entertainment" },
  { merchant: "Amazon Prime", typicalAmount: 299, frequency: "monthly", category: "Entertainment" },
  { merchant: "Spotify", typicalAmount: 119, frequency: "monthly", category: "Music" },
  { merchant: "YouTube Premium", typicalAmount: 129, frequency: "monthly", category: "Entertainment" },
  { merchant: "Swiggy One", typicalAmount: 99, frequency: "monthly", category: "Food" },
  { merchant: "Swiggy One", typicalAmount: 899, frequency: "yearly", category: "Food" },
  { merchant: "Zomato Gold", typicalAmount: 149, frequency: "monthly", category: "Food" },
  { merchant: "Google One", typicalAmount: 130, frequency: "monthly", category: "Cloud" },
  { merchant: "Google One", typicalAmount: 1300, frequency: "yearly", category: "Cloud" },
  { merchant: "iCloud", typicalAmount: 75, frequency: "monthly", category: "Cloud" },
  { merchant: "iCloud", typicalAmount: 219, frequency: "monthly", category: "Cloud" },
  { merchant: "Microsoft 365", typicalAmount: 489, frequency: "monthly", category: "Software" },
  { merchant: "Microsoft 365", typicalAmount: 4899, frequency: "yearly", category: "Software" },
  { merchant: "Disney+ Hotstar", typicalAmount: 1499, frequency: "yearly", category: "Entertainment" },
  { merchant: "Disney+ Hotstar", typicalAmount: 899, frequency: "yearly", category: "Entertainment" },
  { merchant: "Disney+ Hotstar", typicalAmount: 299, frequency: "monthly", category: "Entertainment" },
  { merchant: "SonyLIV", typicalAmount: 299, frequency: "monthly", category: "Entertainment" },
  { merchant: "SonyLIV", typicalAmount: 999, frequency: "yearly", category: "Entertainment" },
  { merchant: "Zee5", typicalAmount: 699, frequency: "yearly", category: "Entertainment" },
  { merchant: "JioSaavn", typicalAmount: 99, frequency: "monthly", category: "Music" },
  { merchant: "JioSaavn", typicalAmount: 399, frequency: "yearly", category: "Music" },
  { merchant: "Gaana", typicalAmount: 99, frequency: "monthly", category: "Music" },
  { merchant: "CRED", typicalAmount: 0, frequency: "monthly", category: "Finance" },
  { merchant: "Times Prime", typicalAmount: 1199, frequency: "yearly", category: "Lifestyle" },
  { merchant: "ET Prime", typicalAmount: 2499, frequency: "yearly", category: "News" },
  { merchant: "Cult.fit", typicalAmount: 1500, frequency: "monthly", category: "Fitness" },
  { merchant: "Audible", typicalAmount: 199, frequency: "monthly", category: "Books" },
  { merchant: "Kindle Unlimited", typicalAmount: 169, frequency: "monthly", category: "Books" },
  { merchant: "Apple Music", typicalAmount: 99, frequency: "monthly", category: "Music" },
  { merchant: "LinkedIn Premium", typicalAmount: 900, frequency: "monthly", category: "Professional" },
  { merchant: "Canva Pro", typicalAmount: 499, frequency: "monthly", category: "Design" },
  { merchant: "Notion Plus", typicalAmount: 800, frequency: "monthly", category: "Software" },
  { merchant: "Headspace", typicalAmount: 1499, frequency: "yearly", category: "Health" },
  { merchant: "Calm", typicalAmount: 3999, frequency: "yearly", category: "Health" },
];
