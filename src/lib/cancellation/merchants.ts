export type Difficulty = "easy" | "medium" | "hard";

export interface MerchantCancellationInfo {
  merchant: string;
  patterns: string[];
  cancelUrl?: string;
  supportEmail?: string;
  phone?: string; // Indian numbers mainly
  cancellationPolicy: string;
  difficulty: Difficulty;
  instructions?: string[];
}

export const merchants: MerchantCancellationInfo[] = [
  // Global & Popular Entertainment
  {
    merchant: "Netflix",
    patterns: ["netflix", "nflx"],
    cancelUrl: "https://www.netflix.com/cancelplan",
    cancellationPolicy:
      "Cancel anytime. You will have access until the end of your billing cycle.",
    difficulty: "easy",
  },
  {
    merchant: "Amazon Prime",
    patterns: ["amazon prime", "prime video", "amzn prime"],
    cancelUrl: "https://www.amazon.in/gp/primecentral",
    cancellationPolicy:
      "Refunds may be provided if you haven't used any Prime benefits.",
    difficulty: "medium",
  },
  {
    merchant: "Spotify",
    patterns: ["spotify"],
    supportEmail: "support@spotify.com",
    cancelUrl: "https://www.spotify.com/account/cancel/",
    cancellationPolicy:
      "Keep your premium features until the next billing date.",
    difficulty: "easy",
  },
  {
    merchant: "YouTube Premium",
    patterns: ["youtube premium", "yt premium", "google youtube"],
    cancelUrl: "https://www.youtube.com/paid_memberships",
    cancellationPolicy:
      "Benefits continue until the end of your billing period.",
    difficulty: "easy",
  },
  {
    merchant: "Apple Music",
    patterns: ["apple music", "itunes", "apple.com/bill"],
    cancelUrl: "https://music.apple.com/account/settings",
    cancellationPolicy: "Cancel at least 24 hours before the renewal date.",
    difficulty: "easy",
  },

  // Indian Food & Delivery
  {
    merchant: "Swiggy One",
    patterns: ["swiggy one", "swiggy"],
    cancellationPolicy:
      "Cancellation must be done via the Swiggy App. No prorated refunds.",
    difficulty: "medium",
    instructions: [
      "Open the Swiggy App",
      "Go to your Profile",
      "Select 'Swiggy One' membership",
      "Scroll to the bottom and tap 'Cancel Membership'",
    ],
  },
  {
    merchant: "Zomato Gold",
    patterns: ["zomato gold", "zomato pro"],
    cancellationPolicy:
      "Cancellation via the app. Active until the end of the term.",
    difficulty: "medium",
    instructions: [
      "Open the Zomato App",
      "Tap on your profile picture",
      "Select 'Zomato Gold'",
      "Tap on 'Manage Membership' and choose Cancel",
    ],
  },
  {
    merchant: "Blinkit",
    patterns: ["blinkit", "grofers"],
    supportEmail: "info@blinkit.com",
    cancellationPolicy:
      "Contact support for any ongoing subscriptions or wallet refunds.",
    difficulty: "hard",
    instructions: [
      "Blinkit does not have a direct cancel button for all subscriptions.",
      "Send an email to info@blinkit.com using the template below.",
      "Alternatively, use the in-app chat support.",
    ],
  },

  // Tech & Productivity
  {
    merchant: "Google One",
    patterns: ["google one", "google storage"],
    cancelUrl: "https://one.google.com/settings/cancel",
    cancellationPolicy:
      "You'll keep your storage until the end of your billing cycle.",
    difficulty: "easy",
  },
  {
    merchant: "iCloud",
    patterns: ["icloud", "apple storage"],
    cancellationPolicy: "Downgrade storage from your Apple device settings.",
    difficulty: "medium",
    instructions: [
      "On iPhone/iPad: Go to Settings > [your name] > iCloud",
      "Tap 'Manage Account Storage' or 'Manage Storage'",
      "Tap 'Change Storage Plan'",
      "Tap 'Downgrade Options' and select the Free plan",
    ],
  },
  {
    merchant: "Microsoft 365",
    patterns: ["microsoft", "msft", "office 365"],
    cancelUrl: "https://account.microsoft.com/services",
    cancellationPolicy:
      "Turn off recurring billing or cancel for a prorated refund if eligible.",
    difficulty: "hard",
    instructions: [
      "Go to the Services & subscriptions page",
      "Find your subscription and select 'Manage'",
      "Select 'Cancel subscription' or 'Turn off recurring billing'",
      "Follow the prompts carefully, as Microsoft may try to offer alternatives",
    ],
  },
  {
    merchant: "Canva Pro",
    patterns: ["canva"],
    cancelUrl: "https://www.canva.com/settings/billing",
    cancellationPolicy:
      "Access Pro features until the end of your billing cycle.",
    difficulty: "easy",
  },
  {
    merchant: "Notion Plus",
    patterns: ["notion"],
    cancelUrl: "https://www.notion.so/my-account#settings",
    cancellationPolicy: "You can downgrade to the free plan at any time.",
    difficulty: "medium",
  },
  {
    merchant: "LinkedIn Premium",
    patterns: ["linkedin", "linkedin premium"],
    cancelUrl: "https://www.linkedin.com/premium/cancel",
    cancellationPolicy:
      "Cancel before your next billing date to avoid charges.",
    difficulty: "medium",
  },

  // Indian OTT & Entertainment
  {
    merchant: "Disney+ Hotstar",
    patterns: ["hotstar", "disney plus"],
    cancelUrl: "https://www.hotstar.com/in/my-account",
    cancellationPolicy: "Cancel before renewal. No refunds for partial months.",
    difficulty: "medium",
  },
  {
    merchant: "SonyLIV",
    patterns: ["sonyliv"],
    cancelUrl: "https://www.sonyliv.com/subscription",
    cancellationPolicy:
      "Cancellation effective at the end of the current billing cycle.",
    difficulty: "medium",
  },
  {
    merchant: "Zee5",
    patterns: ["zee5"],
    cancelUrl: "https://www.zee5.com/myaccount/subscription",
    cancellationPolicy: "Disable auto-renewal from your account settings.",
    difficulty: "medium",
  },
  {
    merchant: "JioCinema Premium",
    patterns: ["jiocinema", "jio cinema"],
    cancelUrl: "https://www.jiocinema.com/account",
    cancellationPolicy:
      "Cancel from the account section in the app or website.",
    difficulty: "easy",
  },
  {
    merchant: "JioSaavn",
    patterns: ["jiosaavn", "saavn"],
    cancelUrl: "https://www.jiosaavn.com/pro",
    cancellationPolicy:
      "Cancel auto-renew from your payment source or app settings.",
    difficulty: "medium",
  },
  {
    merchant: "Gaana",
    patterns: ["gaana", "gaana plus"],
    cancellationPolicy:
      "Cancel from your Google Play or App Store subscriptions.",
    difficulty: "medium",
    instructions: [
      "Gaana Plus is usually billed via app stores.",
      "iOS: Settings > Apple ID > Subscriptions",
      "Android: Play Store > Profile > Payments & subscriptions",
    ],
  },
  {
    merchant: "Airtel Xstream",
    patterns: ["airtel xstream", "xstream"],
    cancellationPolicy: "Manage via the Airtel Thanks app.",
    difficulty: "medium",
  },
  {
    merchant: "Vi Movies",
    patterns: ["vi movies", "vodafone idea"],
    cancellationPolicy: "Manage via the Vi App.",
    difficulty: "medium",
  },

  // Lifestyle & Utility
  {
    merchant: "CRED",
    patterns: ["cred", "cred mint", "cred protect"],
    supportEmail: "support@cred.club",
    cancellationPolicy: "Must contact support or manage via the app directly.",
    difficulty: "hard",
    instructions: [
      "Open the CRED App",
      "Navigate to the specific product (e.g., Mint, Protect)",
      "Look for withdrawal/cancellation options in the settings menu",
      "If unavailable, send an email to support using the template below",
    ],
  },
  {
    merchant: "Times Prime",
    patterns: ["times prime", "timesprime"],
    cancelUrl: "https://www.timesprime.com/profile",
    cancellationPolicy: "Membership cannot be cancelled mid-way for a refund.",
    difficulty: "hard",
    instructions: [
      "Times Prime generally does not offer mid-term cancellations.",
      "You can only disable auto-renewal.",
      "Go to Profile > Membership Details > Turn off auto-renew.",
    ],
  },
  {
    merchant: "ET Prime",
    patterns: ["et prime", "economic times"],
    supportEmail: "care@economictimes.com",
    phone: "1800 1200 004",
    cancellationPolicy: "Contact customer care to cancel recurring payments.",
    difficulty: "hard",
  },
  {
    merchant: "Cult.fit",
    patterns: ["cult fit", "curefit", "cult.fit"],
    cancellationPolicy:
      "Pause or cancel via the app. Cancellation may involve a fee.",
    difficulty: "medium",
    instructions: [
      "Open the Cult.fit App",
      "Go to Profile > Active Packs",
      "Select your membership",
      "Choose 'Pause' or 'Cancel'",
    ],
  },
  {
    merchant: "Audible",
    patterns: ["audible"],
    cancelUrl: "https://www.audible.in/account/details",
    cancellationPolicy:
      "Use your remaining credits before cancelling, or you will lose them.",
    difficulty: "hard",
    instructions: [
      "Go to Audible.in and sign in",
      "Go to Account Details",
      "Click 'Cancel membership'",
      "Follow the multiple screens asking you to stay or pause instead",
    ],
  },
  {
    merchant: "Kindle Unlimited",
    patterns: ["kindle unlimited", "kindle"],
    cancelUrl: "https://www.amazon.in/kucentral",
    cancellationPolicy:
      "Cancel anytime. You will have access until your billing date.",
    difficulty: "easy",
  },
  {
    merchant: "Headspace",
    patterns: ["headspace"],
    cancelUrl: "https://www.headspace.com/subscription/manage",
    cancellationPolicy: "Turn off auto-renew from your account settings.",
    difficulty: "easy",
  },
  {
    merchant: "Calm",
    patterns: ["calm", "calm.com"],
    cancelUrl: "https://www.calm.com/profile/manage-subscription",
    cancellationPolicy:
      "Cancel at least 24 hours before your next billing date.",
    difficulty: "easy",
  },

  // Others
  {
    merchant: "PhonePe Insurance",
    patterns: ["phonepe ins", "phonepe insurance"],
    cancellationPolicy: "Manage via the Insurance section in the PhonePe app.",
    difficulty: "medium",
  },
  {
    merchant: "Paytm First",
    patterns: ["paytm first"],
    cancellationPolicy:
      "Disable auto-renewal from Paytm app > Profile > Paytm First.",
    difficulty: "medium",
  },
  {
    merchant: "Flipkart Plus",
    patterns: ["flipkart plus"],
    cancellationPolicy:
      "Plus memberships are generally point-based and don't require cancellation.",
    difficulty: "easy",
  },
  {
    merchant: "Myntra Insider",
    patterns: ["myntra insider"],
    cancellationPolicy: "Point-based system, no recurring charges to cancel.",
    difficulty: "easy",
  },
  {
    merchant: "Urban Company",
    patterns: ["urban company", "urbanclap"],
    cancellationPolicy: "Cancel memberships via the UC app profile section.",
    difficulty: "medium",
  },
  {
    merchant: "Lenskart Gold",
    patterns: ["lenskart gold"],
    cancellationPolicy:
      "Membership is valid for 1 year, usually non-refundable.",
    difficulty: "hard",
    instructions: [
      "Lenskart Gold is typically a one-time non-refundable fee.",
      "To prevent any future renewals, ensure your saved cards don't have mandates.",
    ],
  },
  {
    merchant: "Tinder Plus",
    patterns: ["tinder"],
    cancellationPolicy: "Cancel via Google Play or App Store.",
    difficulty: "medium",
  },
  {
    merchant: "Bumble Premium",
    patterns: ["bumble"],
    cancellationPolicy: "Cancel via your device's app store subscriptions.",
    difficulty: "medium",
  },
];

export function getMerchantCancellationInfo(
  merchantName: string,
): MerchantCancellationInfo {
  const name = merchantName.toLowerCase();

  // Find matching merchant by pattern
  const match = merchants.find(
    (m) =>
      m.patterns.some((p) => name.includes(p.toLowerCase())) ||
      name === m.merchant.toLowerCase(),
  );

  if (match) {
    return match;
  }

  // Fallback for unknown merchants
  return {
    merchant: merchantName,
    patterns: [],
    cancellationPolicy:
      "Check the merchant's website or app for cancellation instructions. Look for 'Account', 'Billing', or 'Subscriptions' settings.",
    difficulty: "hard",
    instructions: [
      "Log in to the service's website or app.",
      "Look for an 'Account', 'Settings', or 'Billing' section.",
      "Search for 'Manage Subscriptions' or 'Cancel'.",
      "If you can't find it, check your email for the last receipt and look for support contact info.",
      "As a last resort, block the mandate from your bank's app or UPI app.",
    ],
  };
}
