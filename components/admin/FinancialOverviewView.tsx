"use client";

import { Download, Plus } from "lucide-react";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { KPICard } from "@/components/dashboard/KPICard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ResourceTable } from "@/components/dashboard/ResourceTable";
import { KPIMetric } from "@/components/dashboard/mockData";
import { useAdminStore } from "@/stores/useAdminStore";
import { useWalletStore } from "@/stores/useWalletStore";
import React, { useEffect, useState } from "react";
import { Employee } from "@/lib/types";
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { contractInteraction } from "@/lib/contract-interaction";

interface PayrollState {
  totalBudget: string | number;
  frequency: any;
  startTime: string | number;
  employeeCount: string;
  vaultBalance: number | null;
}

export function FinancialOverviewView() {
  const { companyDetails } = useAdminStore();
  const { balance } = useWalletStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const wallet = useAnchorWallet();
  const [payrollState, setPayrollState] = useState<PayrollState | null>(null);

  useEffect(() => {
    if (localStorage.getItem("employees") != null) {
      setEmployees(JSON.parse(localStorage.getItem("employees") || "[]"));
    }
  }, []);

  const totalBudget = payrollState?.totalBudget
    ? parseFloat(payrollState.totalBudget.toString())
    : companyDetails?.totalAmount || 0;
  const totalSpent = employees.reduce((sum, emp) => sum + emp.amount, 0);
  const remainingBalance = payrollState?.vaultBalance || balance || 0;
  const activeWorkers = payrollState?.employeeCount
    ? parseInt(payrollState.employeeCount)
    : employees.length;
  const paymentFrequency =
    payrollState?.frequency || companyDetails?.frequency || null;
  const startTime = payrollState?.startTime
    ? new Date(parseInt(payrollState.startTime.toString()) * 1000).toLocaleString()
    : null;

  const kpiMetrics: KPIMetric[] = [
    {
      label: "TOTAL BUDGET",
      iconType: "wallet",
      value: `${totalBudget.toFixed(2)} SOL`,
      valueStyle: "pink",
      change: payrollState || companyDetails ? "CONFIGURED" : "NOT SET",
      changeColor: "#e879f9",
      changeIcon: "trending-up",
    },
    {
      label: "PAYMENT FREQUENCY",
      iconType: "clock",
      value: paymentFrequency
        ? typeof paymentFrequency === "object"
          ? Object.keys(paymentFrequency)[0].toUpperCase()
          : paymentFrequency.toUpperCase()
        : "NOT SET",
      valueStyle: "peach",
      change: paymentFrequency ? "CONFIGURED" : "NOT CONFIGURED",
      changeColor: "#ffb59e",
      changeIcon: "target",
    },
    {
      label: "VAULT BALANCE",
      iconType: "landmark",
      value: `${remainingBalance.toFixed(2)} SOL`,
      valueStyle: "gradient",
      change: remainingBalance > 0 ? "AVAILABLE" : "EMPTY",
      changeColor: "#a1a1aa",
      changeIcon: "clock",
    },
    {
      label: "ACTIVE WORKERS",
      iconType: "users",
      value: `${activeWorkers}`,
      valueStyle: "yellow",
      change: activeWorkers > 0 ? "REGISTERED" : "NONE",
      changeColor: "#d0cc00",
      changeIcon: "check",
    },
    {
      label: "START TIME",
      iconType: "clock",
      value: startTime || "NOT STARTED",
      valueStyle: "gradient",
      change: startTime ? "ACTIVE" : "PENDING",
      changeColor: "#a1a1aa",
      changeIcon: "clock",
    },
  ];

  const handleGetPayrollState = React.useCallback(async () => {
    const adminPubkey = localStorage.getItem("adminPubkey");
    if (!adminPubkey) {
      console.log("Admin public key not found in localStorage");
      return;
    }
    const result = await contractInteraction.getPayrollState(
      wallet as AnchorWallet,
      adminPubkey,
    );

    if (result.success && 'data' in result) {
      setPayrollState(result.data);
    }
    console.log("Payroll State:", { result });
  }, [wallet]);

  React.useEffect(() => {
    if (wallet) {
      handleGetPayrollState();
    }
  }, [wallet]);

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <TopNavbar />

      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1
              className="text-[32px] leading-tight"
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

        {/* KPI Cards grid */}
        <div className="grid grid-cols-5 gap-4">
          {kpiMetrics.map((metric) => (
            <KPICard key={metric.label} metric={metric} />
          ))}
        </div>

        {/* Analytics + Activity Feed */}
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

        {/* Resource Allocation Table */}
        <ResourceTable />

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
      </main>
    </div>
  );
}
