import { MerchantCancellationInfo } from "./merchants";

export type EmailTemplateType = "formal" | "casual" | "firm";

export interface UserDetails {
  name: string;
  email: string;
  subscriptionName: string;
  amount: number;
  since?: string;
  lastBilled?: string;
}

export interface CancellationReason {
  id: string;
  label: string;
  text: string;
}

export const CANCELLATION_REASONS: CancellationReason[] = [
  {
    id: "expensive",
    label: "Too expensive",
    text: "I am finding the subscription too expensive for my current budget.",
  },
  {
    id: "unused",
    label: "Don't use it anymore",
    text: "I am no longer using the service enough to justify the cost.",
  },
  {
    id: "alternative",
    label: "Found better alternative",
    text: "I have found an alternative service that better meets my needs.",
  },
  { id: "other", label: "Other", text: "Personal reasons." },
];

export function generateCancellationEmail(
  merchant: MerchantCancellationInfo,
  userDetails: UserDetails,
  reasonText?: string,
) {
  const to = merchant.supportEmail || "support@merchant.com";
  const subject = `Cancellation Request for ${userDetails.subscriptionName} - ${userDetails.name}`;

  let templateType: EmailTemplateType = "casual";
  if (merchant.difficulty === "hard") templateType = "firm";
  if (merchant.merchant.match(/bank|insurance|cred|prime/i))
    templateType = "formal";

  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let body = "";

  const reasonLine = reasonText
    ? `The reason for this cancellation is: ${reasonText}`
    : "I have decided to discontinue using the service.";

  switch (templateType) {
    case "firm":
      body = `To the Customer Support Team at ${merchant.merchant},

This is a formal request to cancel my subscription for ${userDetails.subscriptionName}, effective immediately.

Account Details:
Name: ${userDetails.name}
Registered Email: ${userDetails.email}
Last Billed Amount: ₹${userDetails.amount}
${userDetails.lastBilled ? `Last Billed Date: ${userDetails.lastBilled}` : ""}

${reasonLine}

Please ensure that no further charges are made to my payment method. As per the RBI guidelines on recurring payments and the Consumer Protection Act, I expect my cancellation request to be processed promptly without any unreasonable delays or attempts to charge my account further.

Please confirm the cancellation in writing via email once it has been processed.

Thank you,
${userDetails.name}
${dateStr}`;
      break;

    case "formal":
      body = `Dear ${merchant.merchant} Team,

I am writing to formally request the cancellation of my ${userDetails.subscriptionName} subscription.

My details are as follows:
- Name: ${userDetails.name}
- Email associated with account: ${userDetails.email}
- Subscription Amount: ₹${userDetails.amount}

${reasonLine}

Kindly process this cancellation and ensure my payment method is not charged for any future billing cycles. I would appreciate an email confirmation once the cancellation is complete.

Sincerely,
${userDetails.name}`;
      break;

    case "casual":
    default:
      body = `Hi ${merchant.merchant} Support,

I'd like to cancel my ${userDetails.subscriptionName} subscription.

Account Name: ${userDetails.name}
Email: ${userDetails.email}

${reasonLine}

Please process this cancellation and confirm once it's done so I know I won't be billed for the next cycle.

Thanks!
${userDetails.name}`;
      break;
  }

  return { to, subject, body };
}
