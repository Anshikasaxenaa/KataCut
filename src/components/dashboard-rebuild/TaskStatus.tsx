import { MoreVertical } from "lucide-react";

export function TaskStatus() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-900">Task Status</h2>
        <button className="text-zinc-400 hover:text-zinc-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">76%</h1>
      </div>

      <div className="space-y-8 flex-1 flex flex-col justify-end">
        
        {/* High Priority */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold text-zinc-700">High Priority</span>
          </div>
          <div className="relative h-10 w-full bg-transparent flex items-center">
            <div className="absolute left-0 bg-blue-500 h-10 rounded-l-full rounded-r-[12px] flex items-center shadow-sm z-10" style={{ width: '60%', backgroundImage: 'linear-gradient(to right, #3b82f6 85%, #2563eb 100%)' }}>
              <span className="text-white font-bold ml-4 text-sm">60%</span>
            </div>
            {/* 3D End Cap Effect */}
            <div className="absolute h-10 w-4 bg-blue-600 rounded-full" style={{ left: 'calc(60% - 8px)', zIndex: 5 }}></div>
          </div>
        </div>

        {/* Medium Priority */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold text-zinc-700">Medium Priority</span>
          </div>
          <div className="relative h-10 w-full bg-transparent flex items-center">
            <div className="absolute left-0 bg-emerald-400 h-10 rounded-l-full rounded-r-[12px] flex items-center shadow-sm z-10" style={{ width: '46%', backgroundImage: 'linear-gradient(to right, #34d399 85%, #10b981 100%)' }}>
              <span className="text-white font-bold ml-4 text-sm">46%</span>
            </div>
            {/* 3D End Cap Effect */}
            <div className="absolute h-10 w-4 bg-emerald-500 rounded-full" style={{ left: 'calc(46% - 8px)', zIndex: 5 }}></div>
          </div>
        </div>

        {/* Low Priority */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold text-zinc-700">Low Priority</span>
          </div>
          <div className="relative h-10 w-full bg-transparent flex items-center">
            <div className="absolute left-0 bg-amber-400 h-10 rounded-l-full rounded-r-[12px] flex items-center shadow-sm z-10" style={{ width: '38%', backgroundImage: 'linear-gradient(to right, #fbbf24 85%, #f59e0b 100%)' }}>
              <span className="text-white font-bold ml-4 text-sm">38%</span>
            </div>
            {/* 3D End Cap Effect */}
            <div className="absolute h-10 w-4 bg-amber-500 rounded-full" style={{ left: 'calc(38% - 8px)', zIndex: 5 }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}
