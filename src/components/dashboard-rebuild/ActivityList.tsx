import { MoreVertical, FileText, CheckCircle2 } from "lucide-react";

export function ActivityList() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#393E41]">Today's Activity List</h2>
        <button className="text-[#393E41]/40 hover:text-[#393E41]/60">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 space-y-6">
        
        {/* Item 1 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#393E41]/5 flex items-center justify-center shrink-0 mt-1">
            <FileText className="w-5 h-5 text-[#393E41]/50" />
          </div>
          <div>
            <h3 className="font-semibold text-[#393E41]">Review Tasks</h3>
            <p className="text-sm text-[#393E41]/60 mt-1">Check tasks and update progress status</p>
          </div>
        </div>

        {/* Item 2 - Active */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#E94F37] flex items-center justify-center shrink-0 mt-1 shadow-md shadow-[#E94F37]/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#393E41]">Team Sync Meeting</h3>
            <p className="text-sm text-[#393E41]/60 mt-1">Align team on priorities and daily goals</p>
          </div>
          <div className="shrink-0 mt-2">
            <div className="w-6 h-6 rounded-full bg-[#393E41] text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 border-none" />
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#393E41]/5 flex items-center justify-center shrink-0 mt-1">
            <FileText className="w-5 h-5 text-[#393E41]/50" />
          </div>
          <div>
            <h3 className="font-semibold text-[#393E41]">Client Communication</h3>
            <p className="text-sm text-[#393E41]/60 mt-1">Respond to client emails and messages</p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#393E41]/5 flex items-center justify-center shrink-0 mt-1">
            <FileText className="w-5 h-5 text-[#393E41]/50" />
          </div>
          <div>
            <h3 className="font-semibold text-[#393E41]">Project Updates</h3>
            <p className="text-sm text-[#393E41]/60 mt-1">Update timelines tasks and milestone</p>
          </div>
        </div>

      </div>
    </div>
  );
}
