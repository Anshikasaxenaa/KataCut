export interface RawTransaction {
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit" | "unknown";
  reference?: string;
}

export interface NormalizedTransaction {
  id: string;
  date: Date;
  amount: number;
  type: "debit" | "credit";
  merchant: string;
  rawDescription: string;
  source: "pdf" | "sms";
  confidence: number;
}
