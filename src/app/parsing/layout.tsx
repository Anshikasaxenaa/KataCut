import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parsing Statement | KataCut",
  description: "Analyzing your bank statement for recurring subscriptions.",
};

export default function ParsingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
