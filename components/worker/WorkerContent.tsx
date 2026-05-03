"use client";

import { useAdminStore } from "@/stores/useAdminStore";
import React from "react";

interface WorkerContentProps {
  isLoading: boolean;
}

export function WorkerContent({ isLoading }: WorkerContentProps) {
  const { activeTab, companyDetails } = useAdminStore();

  const renderContent = () => {
    switch (activeTab) {
      case "payment":
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              PAYMENT
            </h1>
            
            <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
              <h2 className="text-aerospace text-white text-lg font-bold mb-4">
                PAYMENT POLICY
              </h2>
              <div className="space-y-3 text-aerospace text-white/70 text-body">
                <p>
                  • Payments are processed automatically based on the payroll frequency set by your employer.
                </p>
                <p>
                  • You can claim your accumulated salary at any time using the CLAIM button below.
                </p>
                <p>
                  • Claimed amounts will be transferred directly to your connected wallet.
                </p>
                <p>
                  • Payment history and transaction details are available in your wallet.
                </p>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="mt-3 text-body font-bold text-aerospace-nav text-white bg-ghost border border-ghost-border rounded-[32px] px-[18px] py-[11px] hover:bg-white/20 hover:text-white-100 transition-all self-start disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "CLAIMING..." : "CLAIM PAYMENT"}
            </button>
          </div>
        );

      case "details":
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              EMPLOYEE DETAILS
            </h1>
            
            <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
              <div className="grid gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-aerospace text-white/50 text-label">
                    EMPLOYEE TYPE
                  </label>
                  <p className="text-aerospace text-white text-md">
                    Full-Time Employee
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-aerospace text-white/50 text-label">
                    STATUS
                  </label>
                  <p className="text-aerospace text-white text-md">
                    Active
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-aerospace text-white/50 text-label">
                    PAYMENT FREQUENCY
                  </label>
                  <p className="text-aerospace text-white text-md">
                    {companyDetails?.frequency || "Not Set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "worker_company_details":
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              COMPANY DETAILS
            </h1>
            
            {companyDetails ? (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <div className="grid gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      COMPANY NAME
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {companyDetails.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      REGISTRATION NUMBER
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {companyDetails.registrationNumber}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      PAYMENT FREQUENCY
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {companyDetails.frequency}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <p className="text-aerospace text-white/70 text-md">
                  No company details available. Please contact your administrator.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 px-8 py-8 min-h-screen relative">
      {renderContent()}
    </div>
  );
}
