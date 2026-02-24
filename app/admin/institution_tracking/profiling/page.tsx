"use client";

import { useEffect, useState, useMemo } from "react";

import ProfilingHeader from "./components/ProfilingHeader";
import KpiSection from "./components/ProfilingKpiSection";
import AnalyticsChart from "./components/AnalyticsChart";
import DistrictTable from "./components/DistrictTable";
import BlockGrowthSection from "./components/BlockGrowthSection";

type ProfilingMode = "migrated" | "new";
type EntityMode = "shg" | "member";

export default function AdminProfilingDashboard() {

  const [activeTab, setActiveTab] =
    useState<ProfilingMode>("migrated");

  const [migratedData, setMigratedData] = useState<any>(null);
  const [newData, setNewData] = useState<any>(null);

  const [entityMode, setEntityMode] =
    useState<EntityMode>("shg");

  const [growthData, setGrowthData] = useState<any[]>([]);

  /* ============================= */
  /* FETCH SNAPSHOT DATA (ONCE) */
  /* ============================= */

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        const [migratedRes, newRes] = await Promise.all([
          fetch(`/api/institution_tracking/profiling/migrated`),
          fetch(`/api/institution_tracking/profiling/new`)
        ]);

        if (!migratedRes.ok || !newRes.ok) {
          throw new Error("Snapshot fetch failed");
        }

        const migrated = await migratedRes.json();
        const newly = await newRes.json();

        setMigratedData(migrated);
        setNewData(newly);

      } catch (err) {
        console.error("SNAPSHOT FETCH ERROR:", err);
      }
    };

    fetchSnapshot();
  }, []);

  /* ============================= */
  /* FETCH BLOCK GROWTH DATA */
  /* ============================= */

  useEffect(() => {
    const fetchGrowth = async () => {
      try {

        const res = await fetch(
          `/api/institution_tracking/profiling/block-growth?profile=${activeTab}&entity=${entityMode}`
        );

        if (!res.ok) {
          throw new Error("Growth fetch failed");
        }

        const json = await res.json();
        setGrowthData(json);

      } catch (err) {
        console.error("GROWTH FETCH ERROR:", err);
      }
    };

    fetchGrowth();
  }, [activeTab, entityMode]);

  /* ============================= */
  /* CURRENT TAB DATA */
  /* ============================= */

  const currentData = useMemo(() => {
    return activeTab === "migrated"
      ? migratedData
      : newData;
  }, [activeTab, migratedData, newData]);

  /* ============================= */
  /* LOADING STATE */
  /* ============================= */

  if (!currentData || !currentData.summary) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading profiling data...
      </div>
    );
  }

  /* ============================= */
  /* RENDER */
  /* ============================= */

  return (
    <div className="min-h-screen bg-slate-50">

      <ProfilingHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="p-6 lg:p-10 space-y-10">

        <KpiSection summary={currentData.summary} />

        <AnalyticsChart districts={currentData.districts} />

        <DistrictTable districts={currentData.districts} />

        <BlockGrowthSection
          data={growthData}
          mode={entityMode}
          setMode={setEntityMode}
        />

      </div>
    </div>
  );
}
