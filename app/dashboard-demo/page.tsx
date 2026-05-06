import { Download, Plus } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { KPICard } from "@/components/dashboard/KPICard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ResourceTable } from "@/components/dashboard/ResourceTable";
import { kpiMetrics } from "@/components/dashboard/mockData";

export default function DashboardPage() {
  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* Right column: navbar + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* ── Page header ─────────────────────────────── */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h1
                className="text-[16px] leading-tight"
                style={{
                  color: "#e5e2e1",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Financial Overview
              </h1>
              <p
                className="text-[14px]"
                style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}
              >
                Real-time settlement and liquidity monitoring
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Export Report */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-sm border text-[12px] uppercase hover:bg-white/5 transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.10)",
                  color: "#e5e2e1",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Download
                  className="w-[9px] h-[9px]"
                  style={{ color: "#e5e2e1" }}
                />
                EXPORT REPORT
              </button>

              {/* New Split */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-[12px] uppercase text-white hover:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(107.77deg, #FF571A 0%, #FD25EA 100%)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Plus className="w-[8px] h-[8px]" />
                NEW SPLIT
              </button>
            </div>
          </div>

          {/* ── KPI Cards grid ──────────────────────────── */}
          <div className="grid grid-cols-4 gap-4">
            {kpiMetrics.map((metric) => (
              <KPICard key={metric.label} metric={metric} />
            ))}
          </div>

          {/* ── Analytics + Activity Feed ───────────────── */}
          {/* 
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <AnalyticsChart />
            </div>
            <div className="col-span-1">
              <ActivityFeed />
            </div>
          </div>
          */}

          {/* ── Resource Allocation Table ───────────────── */}
          <ResourceTable />
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:opacity-90 transition-opacity z-50"
        style={{
          background: "linear-gradient(135deg, #FF571A 0%, #FD25EA 100%)",
          boxShadow: "0 4px 20px rgba(253,37,234,0.4)",
        }}
        aria-label="New action"
      >
        <Plus className="w-5 h-5" />
      </button>
    </>
  );
}
