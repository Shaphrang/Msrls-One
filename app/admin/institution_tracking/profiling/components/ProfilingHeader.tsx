"use client";

type Props = {
  activeTab: "migrated" | "new";
  setActiveTab: (val: "migrated" | "new") => void;
};

export default function ProfilingHeader({
  activeTab,
  setActiveTab
}: Props) {
  return (
    <div className="relative overflow-hidden border-b border-slate-300">

      {/* Stronger Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-indigo-50 to-violet-100"></div>

      {/* Subtle Radial Highlight */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-200 opacity-20 rounded-full blur-3xl"></div>

      <div className="relative px-6 lg:px-10 py-10">

        <div className="flex items-center justify-between flex-wrap gap-8">

          {/* Title Section */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight">
              SHG Profiling Dashboard
            </h1>

            <p className="text-slate-600 text-sm mt-2">
              Migrated & Newly Registered Performance Analytics
            </p>
          </div>

          {/* Tabs Container */}
          <div className="relative flex bg-white border border-slate-300 rounded-xl p-1 shadow-md">

            {/* Active Sliding Background */}
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 shadow transition-all duration-300 ${
                activeTab === "migrated"
                  ? "left-1"
                  : "left-1/2"
              }`}
            />

            <Tab
              label="Migrated"
              active={activeTab === "migrated"}
              onClick={() => setActiveTab("migrated")}
            />

            <Tab
              label="Newly"
              active={activeTab === "new"}
              onClick={() => setActiveTab("new")}
            />

          </div>

        </div>
      </div>
    </div>
  );
}

/* ============================ */
/* Tab Button */
/* ============================ */

function Tab({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative z-10 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
        active
          ? "text-white"
          : "text-slate-700 hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );
}
