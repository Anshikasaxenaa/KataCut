"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl text-zinc-50">Welcome, {user?.email}</CardTitle>
            <CardDescription className="text-zinc-400">
              Your KataCut dashboard is being prepared.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-zinc-800 border-dashed p-8 text-center bg-zinc-950/50">
              <p className="text-zinc-500">Dashboard coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
