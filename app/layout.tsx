//app\layout.tsx
import './globals.css'
import { Sidebar } from '@/components/sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          {/* Permanent Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 bg-gray-50 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
