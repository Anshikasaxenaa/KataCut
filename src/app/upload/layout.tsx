import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Statement | KataCut",
  description: "Securely upload your bank statement PDF to detect subscriptions.",
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
