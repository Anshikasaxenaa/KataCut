import { Play } from "lucide-react";

export function TeamInsights() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Team Insights Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] flex-1">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">Team Insights</h2>
        
        {/* Mock Bar Chart */}
        <div className="h-24 w-full flex items-end gap-1 mb-6">
          {[40, 60, 45, 80, 50, 70, 90, 55, 65, 40, 85, 75, 45, 60, 50, 70, 30, 80, 65, 95, 55, 70, 45, 85, 60].map((height, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-t-sm ${i === 20 ? 'bg-[#0066FF]' : 'bg-[#e6f0ff]'}`}
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>

        <div className="flex -space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-zinc-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Insight1" 
              alt="Team member" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-zinc-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Insight2" 
              alt="Team member" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Time Tracker Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-zinc-900 mb-4">Time Tracker</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-zinc-900 tracking-tight">08:40:20</div>
            <div className="text-sm text-zinc-500 font-medium mt-2">On Going Start Hi-Fi New Project</div>
          </div>
          <button className="w-12 h-12 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/30 transition-colors shrink-0">
            <Play className="w-5 h-5 ml-1" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
