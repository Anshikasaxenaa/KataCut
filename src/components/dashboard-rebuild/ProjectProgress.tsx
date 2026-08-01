import { MoreVertical } from "lucide-react";

export function ProjectProgress() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-zinc-900">Project Progress</h2>
        <button className="text-zinc-400 hover:text-zinc-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Semi-circle Donut Chart */}
        <div className="relative w-64 h-32 overflow-hidden mb-6">
          <svg className="w-full h-full" viewBox="0 0 200 100">
            {/* Background Arc (Green part) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#00d284"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Foreground Arc (Blue part - 76%) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#0066FF"
              strokeWidth="24"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 * (1 - 0.76)} // 251.2 is PI * 80
            />
          </svg>
          
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
            <span className="text-4xl font-bold text-zinc-900">76%</span>
            <span className="text-xs text-zinc-500 font-medium">Project Completed</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between w-full mt-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-zinc-900">26</span>
            <div className="flex items-center gap-1.5 mt-1 text-zinc-500">
              <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
              <span className="text-xs font-medium">Done</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-zinc-900">56</span>
            <div className="flex items-center gap-1.5 mt-1 text-zinc-500">
              <div className="w-2 h-2 rounded-full bg-[#00d284]"></div>
              <span className="text-xs font-medium">Our Progress</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-zinc-900">46</span>
            <div className="flex items-center gap-1.5 mt-1 text-zinc-500">
              <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
              <span className="text-xs font-medium">Still Working</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
