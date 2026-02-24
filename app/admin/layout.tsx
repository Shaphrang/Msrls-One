// app/admin/institution_tracking/layout.tsx
import Sidebar from "./institution_tracking/components/Sidebar";
import Header from "./institution_tracking/components/Header";

export default function InstitutionTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
