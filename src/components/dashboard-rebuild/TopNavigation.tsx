import { Settings, Bell } from "lucide-react";
import Link from "next/link";

export function TopNavigation() {
  return (
    <nav className="flex items-center justify-between w-full pb-6 border-b border-zinc-100 bg-transparent pt-6">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center justify-center w-10 h-10 bg-zinc-900 rounded-full text-white shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M12 11v8" />
            <path d="m8 15 4-4 4 4" />
            <path d="m8 19 4-4 4 4" />
          </svg>
        </div>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="#"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-full shadow-sm"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Teams
          </Link>
          <Link
            href="#"
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            All Projects
          </Link>
          <Link
            href="#"
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Schedule
          </Link>
          <Link
            href="#"
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Chat
          </Link>
          <Link
            href="#"
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Team Project
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-zinc-500 hover:text-zinc-800 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="relative text-zinc-500 hover:text-zinc-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block text-sm">
            <div className="font-bold text-zinc-900">John Smith</div>
            <div className="text-zinc-500 text-xs font-medium">Admin</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
