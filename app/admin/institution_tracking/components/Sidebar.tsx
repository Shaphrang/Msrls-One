"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  CalendarDays,
  Briefcase,
  Wallet,
  Landmark,
  Activity,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [openSector, setOpenSector] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const sectors = [
    {
      name: "Monitoring",
      icon: Activity,
      items: [
        { name: "Profiling", icon: Users, href: "/admin/institution_tracking/profiling" },
        { name: "Saturation Drive", icon: BarChart3, href: "/admin" },
        { name: "CLF transaction", icon: FileText, href: "/admin" },
        { name: "VO transaction", icon: FileText, href: "/admin" },
        { name: "Activities and Programmes", icon: CalendarDays, href: "/admin" },
        { name: "CLF & VO Meetings", icon: BarChart3, href: "/admin/institution_tracking/meetings_dashboard" },
        { name: "AAP Assessment", icon: FileText, href: "/admin" },
        { name: "FUNDS", icon: CalendarDays, href: "/admin" },
        { name: "Member ID-Card", icon: FileText, href: "/admin" },        
      ],
    },
    {
      name: "Livelihood",
      icon: Briefcase,
      items: [
        { name: "Farm", icon: Users, href: "/admin" },
        { name: "Non-Farm", icon: BarChart3, href: "/admin" },
        { name: "Lakhpati", icon: FileText, href: "/admin" },
        { name: "LSC", icon: CalendarDays, href: "/admin" },
      ],
    },
    { name: "IBCB", icon: Landmark, items: [] },
    { name: "SISD", icon: Activity, items: [] },
    { name: "FI", icon: Wallet, items: [] },
    { name: "Accounts", icon: FileText, items: [] },
  ];

  const toggleSector = (sectorName: string) => {
    setOpenSector(openSector === sectorName ? null : sectorName);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-800 text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
  className={`
    fixed lg:static top-0 left-0 h-screen w-72
    bg-gradient-to-b from-slate-900 to-slate-800
    text-white shadow-2xl z-40
    transform transition-transform duration-300
    flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        {/* Header */}
  <div className="p-6 border-b border-white/10">
    <h1 className="text-xl font-semibold tracking-wide">MSRLS-One</h1>
    <p className="text-xs text-slate-400">Admin Portal</p>
  </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">

          {/* Dashboard */}
          <Link
            href="/admin/institution_tracking"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-md transition-all group
              ${
                pathname === "/admin/institution_tracking"
                  ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500"
                  : "text-slate-300 hover:bg-white/5"
              }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {/* Sectors */}
          {sectors.map((sector) => {
            const SectorIcon = sector.icon;

            return (
              <div key={sector.name}>
                {/* Sector Button */}
                <button
                  onClick={() => toggleSector(sector.name)}
                  className="w-full flex items-center justify-between px-4 py-3 text-md rounded-lg text-slate-300 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <SectorIcon size={18} className="text-slate-400" />
                    {sector.name}
                  </div>
                  {openSector === sector.name ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {/* Submenu */}
                {openSector === sector.name && sector.items.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1 border-l border-white/10 pl-4">
                    {sector.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
                            ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                          <Icon size={15} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

  <div className="p-4 border-t border-white/10 text-sm text-slate-500">
    © {new Date().getFullYear()} MSRLS
  </div>
      </aside>
    </>
  );
}