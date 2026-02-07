'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Data Operations', path: '/upload', icon: '📥' },
  { label: 'Dashboards', path: '/dashboards', icon: '📊' },
  { label: 'Analytics', path: '/analytics', icon: '📈' },
  { label: 'AI / Models', path: '/ai', icon: '🧠' },
  { label: 'Applications', path: '/applications', icon: '📦' },
  { label: 'Reports', path: '/reports', icon: '⬇️' },
  { label: 'Administration', path: '/admin', icon: '👤' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h1 className="font-semibold text-slate-900 text-lg">
          MSRLS - One
        </h1>
        <p className="text-sm text-slate-500">
          Central Data System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.path)

          return (
<Link
  key={item.path}
  href={item.path}
  className={`
    flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
    ${
      active
        ? `
          bg-slate-200
          text-slate-900
          font-semibold
          border-l-4 border-slate-900
        `
        : `
          text-slate-600
          hover:bg-slate-100
          hover:text-slate-900
        `
    }
  `}
>
  <span className="text-base">{item.icon}</span>
  <span>{item.label}</span>
</Link>

          )
        })}
      </nav>
    </aside>
  )
}
