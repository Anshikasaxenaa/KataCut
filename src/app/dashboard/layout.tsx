import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | KataCut",
  description: "View and manage your active and dormant subscriptions.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
