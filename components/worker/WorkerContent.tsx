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
                className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                PAYMENT
              </h1>
              <AdminPubkeyInput />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <h1
              className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              PAYMENT
            </h1>
            
            {isCheckingEligibility ? (
              <div className="flex flex-col gap-4 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <p className="text-[14px]" style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}>
                  Checking claim eligibility...
                </p>
              </div>
            ) : claimEligibility ? (
              <div className="flex flex-col gap-6 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <div className="grid gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      CLAIM STATUS
                    </label>
                    <p 
                      className={`text-[16px] tracking-[-0.4px] uppercase ${
                        claimEligibility.eligible ? "text-[#10b981]" : "text-[#f59e0b]"
                      }`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {claimEligibility.eligible ? "ELIGIBLE TO CLAIM" : "NOT YET ELIGIBLE"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      NEXT CLAIM TIME
                    </label>
                    <p className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {claimEligibility.nextClaimDate}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <p className="text-[14px]" style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}>
                  Unable to check claim eligibility. Please ensure you are added to the payroll.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
              <h2 className="text-[16px] tracking-[-0.4px] text-[#e5e2e1] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                PAYMENT POLICY
              </h2>
              <div className="space-y-3 text-[14px] text-[#71717a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p>• Payments are processed automatically based on the payroll frequency set by your employer.</p>
                <p>• You can claim your accumulated salary at any time using the CLAIM button below.</p>
                <p>• Claimed amounts will be transferred directly to your connected wallet.</p>
                <p>• Payment history and transaction details are available in your wallet.</p>
              </div>
            </div>

            <button
              onClick={onClaimPayment}
              disabled={isLoading || !claimEligibility?.eligible}
              className="mt-3 px-4 py-2 rounded-[2px] text-[12px] uppercase text-white hover:opacity-90 transition-opacity self-start disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(107.77deg, #FF571A 0%, #FD25EA 100%)",
                fontFamily: "'Inter', sans-serif",
              }}
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
                className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                EMPLOYEE DETAILS
              </h1>
              <AdminPubkeyInput />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <h1
              className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              EMPLOYEE DETAILS
            </h1>
            
            {isLoadingEmployeeDetails ? (
              <div className="flex flex-col gap-4 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <p className="text-[14px]" style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}>
                  Loading employee details...
                </p>
              </div>
            ) : employeeDetails ? (
              <div className="flex flex-col gap-6 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <div className="grid gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      EMPLOYEE TYPE
                    </label>
                    <p className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Full-Time Employee
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      SALARY AMOUNT
                    </label>
                    <p className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {employeeDetails.amount}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      LAST CLAIMED
                    </label>
                    <p className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {employeeDetails.lastClaimed}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      STATUS
                    </label>
                    <p className="text-[16px] tracking-[-0.4px] text-[#10b981]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Active
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <p className="text-[14px]" style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}>
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
                className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                COMPANY DETAILS
              </h1>
              <AdminPubkeyInput />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <h1
              className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              COMPANY DETAILS
            </h1>
            
            {isLoadingCompanyDetails ? (
              <div className="flex flex-col gap-4 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <p className="text-[14px]" style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}>
                  Loading company details...
                </p>
              </div>
            ) : fetchedCompanyDetails ? (
              <div className="flex flex-col gap-6 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <div className="grid gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      TOTAL AMOUNT
                    </label>
                    <p className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {fetchedCompanyDetails.totalAmount}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      MINT ADDRESS
                    </label>
                    <p className="text-[16px] tracking-[-0.4px] text-[#e5e2e1] break-all" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {fetchedCompanyDetails.mint}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      PAYMENT FREQUENCY
                    </label>
                    <p className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {JSON.stringify(fetchedCompanyDetails.frequency)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <p className="text-[14px]" style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}>
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
    <div className="flex-1 px-8 py-8 min-h-screen relative bg-[#000000]">
      {renderContent()}
      
      {/* Clear employee data button */}
      <button
        onClick={() => {
          localStorage.removeItem("adminPubkey");
          window.location.reload();
        }}
        className="fixed bottom-6 right-6 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e5e2e1] text-[12px] uppercase px-4 py-2 rounded-[2px] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        CLEAR EMPLOYEE DATA
      </button>
    </div>
  );
}
