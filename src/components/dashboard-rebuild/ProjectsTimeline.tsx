import { ArrowUpRight, Check, Plus } from "lucide-react";
import Image from "next/image";

export function ProjectsTimeline() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-xl font-bold text-zinc-900">Projects Timeline</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-zinc-200">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052cc] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Left Column - Floating Progress & Upcoming */}
        <div className="lg:col-span-3 flex flex-col justify-between relative z-10 space-y-6 lg:space-y-0">
          
          <div className="mb-4">
            <h3 className="text-3xl font-bold text-zinc-900">21</h3>
            <div className="flex items-center justify-between mt-1 text-zinc-500 font-medium text-sm">
              <span>Upcoming Tasks</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>

          <div className="bg-[#0066FF] rounded-[24px] p-6 text-white shadow-xl relative w-full lg:w-64">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Progress</h3>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white text-[#0066FF] px-4 py-1.5 rounded-full text-sm font-medium w-28 text-center">In Test</div>
                <div className="flex-1 h-8 rounded-full border border-dashed border-white/40"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white text-[#0066FF] px-4 py-1.5 rounded-full text-sm font-medium w-28 text-center">Reviewed</div>
                <div className="flex-1 h-8 rounded-full border border-dashed border-white/40"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white text-[#0066FF] px-4 py-1.5 rounded-full text-sm font-medium w-28 text-center">Complete</div>
                <div className="flex-1 h-8 rounded-full border border-dashed border-white/40"></div>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input type="radio" name="progress_status" className="w-3 h-3 accent-white" defaultChecked />
                <span>Done</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer opacity-80">
                <input type="radio" name="progress_status" className="w-3 h-3 accent-white border-white bg-transparent" />
                <span>In Progress</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline Chart */}
        <div className="lg:col-span-9 relative w-full h-[320px] overflow-hidden lg:pl-4">
          {/* Header row */}
          <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-6 pl-[5%]">
            {['2M', '3T', '4W', '5T', '6F', '7S', '8S', '9M', '10T', '11W', '12T', '13F'].map((day, i) => (
              <div key={day} className={`w-8 h-8 flex items-center justify-center rounded-full ${day === '6F' ? 'bg-[#0066FF] text-white shadow-md z-10' : ''}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Dotted Grid Background */}
          <div className="absolute top-[48px] left-0 right-0 bottom-0 z-0" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          {/* Vertical Line for Current Day */}
          <div className="absolute top-[40px] bottom-0 left-[41.5%] w-0.5 bg-[#0066FF]/20 z-0"></div>

          {/* Timeline Items */}
          <div className="relative z-10 w-full h-full mt-4">
            
            {/* Mobile App */}
            <div className="absolute top-[10px] left-[65%] flex items-center bg-white rounded-full p-1.5 pr-2 shadow-sm border border-dashed border-zinc-300">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" className="w-7 h-7 rounded-full bg-orange-100" />
              <div className="ml-2 mr-6">
                <div className="text-xs font-bold text-zinc-800">Mobile app</div>
                <div className="text-[10px] text-zinc-500 font-medium">5 hours</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                69%
              </div>
            </div>

            {/* Web Design */}
            <div className="absolute top-[80px] left-[25%] flex items-center bg-[#0066FF] text-white rounded-full p-1.5 pr-3 shadow-lg">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" className="w-7 h-7 rounded-full bg-white p-0.5" />
              <div className="ml-2 mr-8">
                <div className="text-xs font-bold">Web Design</div>
                <div className="text-[10px] text-white/80 font-medium">7 hours</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-white text-[#0066FF] flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Website Design */}
            <div className="absolute top-[150px] left-[55%] flex items-center bg-white rounded-full p-1.5 pr-2 shadow-sm border border-dashed border-zinc-300">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=C" className="w-7 h-7 rounded-full bg-purple-100" />
              <div className="ml-2 mr-6">
                <div className="text-xs font-bold text-zinc-800">Website Design</div>
                <div className="text-[10px] text-zinc-500 font-medium">5 hours</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                78%
              </div>
            </div>

            {/* UX Kit */}
            <div className="absolute top-[220px] left-[5%] flex items-center bg-white rounded-full p-1.5 pr-2 shadow-sm border border-dashed border-zinc-300">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=D" className="w-7 h-7 rounded-full bg-yellow-100" />
              <div className="ml-2 mr-6">
                <div className="text-xs font-bold text-zinc-800">UX Kit</div>
                <div className="text-[10px] text-zinc-500 font-medium">6 hours</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                57%
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
