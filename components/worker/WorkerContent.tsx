"use client";

import { useAdminStore } from "@/stores/useAdminStore";
import { AdminPubkeyInput } from "./AdminPubkeyInput";
import React from "react";

interface WorkerContentProps {
  isLoading: boolean;
  employeeDetails: any;
  fetchedCompanyDetails: any;
  isLoadingEmployeeDetails: boolean;
  isLoadingCompanyDetails: boolean;
  claimEligibility: any;
  isCheckingEligibility: boolean;
  onGetEmployeeDetails: () => void;
  onGetCompanyDetails: () => void;
  onCheckClaimEligibility: () => void;
  onClaimPayment: () => void;
}

export function WorkerContent({ 
  isLoading,
  employeeDetails,
  fetchedCompanyDetails,
  isLoadingEmployeeDetails,
  isLoadingCompanyDetails,
  claimEligibility,
  isCheckingEligibility,
  onGetEmployeeDetails,
  onGetCompanyDetails,
  onCheckClaimEligibility,
  onClaimPayment,
}: WorkerContentProps) {
  const { activeTab } = useAdminStore();
  const [adminPubkey, setAdminPubkey] = React.useState<string | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem("adminPubkey");
    setAdminPubkey(stored);
    
    const interval = setInterval(() => {
      const current = localStorage.getItem("adminPubkey");
      if (current !== adminPubkey) {
        setAdminPubkey(current);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [adminPubkey]);

  React.useEffect(() => {
    if (activeTab === "details" && adminPubkey) {
      onGetEmployeeDetails();
    }
  }, [activeTab, adminPubkey, onGetEmployeeDetails]);

  React.useEffect(() => {
    if (activeTab === "worker_company_details" && adminPubkey) {
      onGetCompanyDetails();
    }
  }, [activeTab, adminPubkey, onGetCompanyDetails]);

  React.useEffect(() => {
    if (activeTab === "payment" && adminPubkey) {
      onCheckClaimEligibility();
    }
  }, [activeTab, adminPubkey, onCheckClaimEligibility]);

  const renderContent = () => {
    switch (activeTab) {
      case "payment":
        if (!adminPubkey) {
          return (
            <div className="flex flex-col gap-6">
              <h1
                className="text-section-heading font-bold text-aerospace text-white"
                style={{ lineHeight: "var(--leading-tight)" }}
              >
                PAYMENT
              </h1>
              <AdminPubkeyInput />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              PAYMENT
            </h1>
            
            {isCheckingEligibility ? (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <p className="text-aerospace text-white/70 text-md">
                  Checking claim eligibility...
                </p>
              </div>
            ) : claimEligibility ? (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <div className="grid gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      CLAIM STATUS
                    </label>
                    <p className={`text-aerospace text-md font-bold ${
                      claimEligibility.eligible ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {claimEligibility.eligible ? "ELIGIBLE TO CLAIM" : "NOT YET ELIGIBLE"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      NEXT CLAIM TIME
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {claimEligibility.nextClaimDate}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <p className="text-aerospace text-white/70 text-md">
                  Unable to check claim eligibility. Please ensure you are added to the payroll.
                </p>
              </div>
            )}

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
              onClick={onClaimPayment}
              disabled={isLoading || !claimEligibility?.eligible}
              className="mt-3 text-body font-bold text-aerospace-nav text-white bg-ghost border border-ghost-border rounded-[32px] px-[18px] py-[11px] hover:bg-white/20 hover:text-white-100 transition-all self-start disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "CLAIMING..." : "CLAIM PAYMENT"}
            </button>
          </div>
        );

      case "details":
        if (!adminPubkey) {
          return (
            <div className="flex flex-col gap-6">
              <h1
                className="text-section-heading font-bold text-aerospace text-white"
                style={{ lineHeight: "var(--leading-tight)" }}
              >
                EMPLOYEE DETAILS
              </h1>
              <AdminPubkeyInput />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              EMPLOYEE DETAILS
            </h1>
            
            {isLoadingEmployeeDetails ? (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <p className="text-aerospace text-white/70 text-md">
                  Loading employee details...
                </p>
              </div>
            ) : employeeDetails ? (
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
                      SALARY AMOUNT
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {employeeDetails.amount}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      LAST CLAIMED
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {employeeDetails.lastClaimed}
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
                </div>
              </div>
            ) : (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <p className="text-aerospace text-white/70 text-md">
                  No active employee record found. Please contact your administrator.
                </p>
              </div>
            )}
          </div>
        );

      case "worker_company_details":
        if (!adminPubkey) {
          return (
            <div className="flex flex-col gap-6">
              <h1
                className="text-section-heading font-bold text-aerospace text-white"
                style={{ lineHeight: "var(--leading-tight)" }}
              >
                COMPANY DETAILS
              </h1>
              <AdminPubkeyInput />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              COMPANY DETAILS
            </h1>
            
            {isLoadingCompanyDetails ? (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <p className="text-aerospace text-white/70 text-md">
                  Loading company details...
                </p>
              </div>
            ) : fetchedCompanyDetails ? (
              <div className="border border-white/20 p-6 rounded-xl bg-white/5 max-w-2xl">
                <div className="grid gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      TOTAL AMOUNT
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {fetchedCompanyDetails.totalAmount}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      MINT ADDRESS
                    </label>
                    <p className="text-aerospace text-white text-md break-all">
                      {fetchedCompanyDetails.mint}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      PAYMENT FREQUENCY
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {JSON.stringify(fetchedCompanyDetails.frequency)}
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
      
      {/* Clear employee data button */}
      <button
        onClick={() => {
          localStorage.removeItem("adminPubkey");
          window.location.reload();
        }}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-md transition-all"
      >
        CLEAR EMPLOYEE DATA
      </button>
    </div>
  );
}
