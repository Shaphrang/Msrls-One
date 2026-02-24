"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search SHG / VO / CLF..."
            className="pl-9 pr-4 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-slate-100">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="hidden lg:block text-right">
          <p className="text-sm font-medium text-slate-800">Administrator</p>
          <p className="text-xs text-slate-500">MSRLS State Office</p>
        </div>
      </div>
    </header>
  );
}
