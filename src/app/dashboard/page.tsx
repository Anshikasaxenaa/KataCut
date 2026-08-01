"use client";

import { TopNavigation } from "@/components/dashboard-rebuild/TopNavigation";
import { ProjectsTimeline } from "@/components/dashboard-rebuild/ProjectsTimeline";
import { TaskStatus } from "@/components/dashboard-rebuild/TaskStatus";
import { ProjectProgress } from "@/components/dashboard-rebuild/ProjectProgress";
import { ActivityList } from "@/components/dashboard-rebuild/ActivityList";
import { TeamInsights } from "@/components/dashboard-rebuild/TeamInsights";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F6F7EB] text-[#393E41] pb-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <TopNavigation />
        
        <main className="mt-8 space-y-6">
          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[460px]">
            <div className="lg:col-span-2 h-full">
              <ProjectsTimeline />
            </div>
            <div className="lg:col-span-1 h-full">
              <TaskStatus />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto lg:h-[420px]">
            <div className="h-full">
              <ProjectProgress />
            </div>
            <div className="h-full">
              <ActivityList />
            </div>
            <div className="h-full">
              <TeamInsights />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
