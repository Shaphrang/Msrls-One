//components\sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MODULES = [
  {
    title: 'Institution Tracking',
    basePath: '/institution_tracking',
    items: [
      { label: 'Upload Data', path: '/uploads', icon: '📥' },
      { label: 'Dashboard', path: '/dashboard', icon: '📊' },
      { label: 'Analytics', path: '/analytics', icon: '📈' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <h1 className="font-semibold text-slate-900 text-lg">
          MSRLS - One
        </h1>
        <p className="text-sm text-slate-500">
          Central Data System
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6">
        {MODULES.map(module => (
          <div key={module.basePath}>
            <p className="px-3 text-xs uppercase tracking-wide text-slate-400 mb-2">
              {module.title}
            </p>

            <div className="space-y-1">
              {module.items.map(item => {
                const fullPath = `${module.basePath}${item.path}`
                const active = pathname.startsWith(fullPath)

                return (
                  <Link
                    key={fullPath}
                    href={fullPath}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                      ${
                        active
                          ? 'bg-slate-100 text-slate-900 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
