"use client";

import Link from "next/link";
import { LayoutDashboard, BarChart3, Users, FileText, CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/institution_tracking" },
    { name: "Profiling", icon: Users, href: "/admin/institution_tracking/profiling" },
    { name: "Saturation Drive", icon: BarChart3, href: "#" },
    { name: "VO transaction/Ebk status", icon: FileText, href: "#" },
    { name: "Meetings Management", icon: CalendarDays, href: "#" },
    { name: "File Tracking", icon: Users, href: "#" },
    { name: "M&E Assessment", icon: BarChart3, href: "#" },
    { name: "Funds Management Status", icon: FileText, href: "#" },
    { name: "SHG member ID Card", icon: CalendarDays, href: "#" },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">MSRLS-One</h1>
        <p className="text-xs text-slate-400">Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 text-xs text-slate-400">
        © {new Date().getFullYear()} MSRLS
      </div>
    </aside>
  );
}
