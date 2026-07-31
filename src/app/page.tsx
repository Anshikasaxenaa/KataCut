import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-50 p-4 selection:bg-indigo-500/30">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950"></div>

      <main className="max-w-3xl w-full flex flex-col items-center text-center space-y-12">
        <div className="space-y-6">
          <div className="inline-block rounded-full px-3 py-1 text-sm text-indigo-400 bg-indigo-950/50 border border-indigo-900/50">
            Privacy-first subscription tracking
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
            Kata
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Cut
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Know exactly where your money goes. Secure, simple, and beautifully
            designed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg rounded-full font-medium border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 bg-zinc-950/50"
          >
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16">
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-zinc-200">Total Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400">
                Your financial data stays yours. We don't sell or share your
                subscription habits.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-zinc-200">Smart Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400">
                Get notified before your next billing cycle hits. Never pay for
                forgotten subs.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-zinc-200">
                Beautiful Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400">
                Understand your spending at a glance with clean, actionable
                dashboards.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
