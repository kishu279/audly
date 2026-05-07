"use client";

import React from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { RoleSelectionModal } from "@/components/admin/RoleSelectionModal";
import { DashboardDemo1Sidebar } from "@/components/admin/DashboardDemo1Sidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { WorkerSidebar } from "@/components/worker/WorkerSidebar";
import { WorkerContent } from "@/components/worker/WorkerContent";
import { FinancialOverviewView } from "@/components/admin/FinancialOverviewView";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import Papa from "papaparse";
import { CompanyDetails, Employee, Frequency } from "@/lib/types";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { contractInteraction } from "@/lib/contract-interaction";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { PublicKey } from "@solana/web3.js";
import idl from "@/contract/auddly.json";

export default function DashboardDemo1Page() {
  const wallet = useAnchorWallet();
  const { role, activeTab, setCompanyDetails } = useAdminStore();
  const { notify } = useNotificationStore();
  const [file, setFile] = React.useState<File | null>(null);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [employeeDetails, setEmployeeDetails] = React.useState<any>(null);
  const [fetchedCompanyDetails, setFetchedCompanyDetails] =
    React.useState<any>(null);
  const [isLoadingEmployeeDetails, setIsLoadingEmployeeDetails] =
    React.useState(false);
  const [isLoadingCompanyDetails, setIsLoadingCompanyDetails] =
    React.useState(false);
  const [claimEligibility, setClaimEligibility] = React.useState<any>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] =
    React.useState(false);

  // Helper function to parse and format error messages
  const formatErrorMessage = React.useCallback(
    (error: string): { title: string; message: string } => {
      if (
        error.includes("no record of a prior credit") ||
        error.includes("Attempt to debit an account")
      ) {
        return {
          title: "Insufficient Funds",
          message:
            "The payroll vault doesn't have enough funds. Please ask admin to deposit funds first.",
        };
      }

      if (error.includes("Simulation failed")) {
        const messageMatch = error.match(/Message: ([^.]+)/);
        if (messageMatch) {
          return {
            title: "Transaction Failed",
            message: messageMatch[1].trim(),
          };
        }
      }

      return {
        title: "Failed to claim payment",
        message: error,
      };
    },
    [],
  );

  const handleSaveCompanyDetails = React.useCallback(
    async (details: CompanyDetails) => {
      if (!wallet) {
        notify(
          "error",
          "Wallet not connected",
          "Please connect your wallet to continue",
        );
        return;
      }

      setIsLoading(true);
      try {
        const frequencyEnum =
          details.frequency.toLowerCase() === "weekly"
            ? Frequency.Weekly
            : Frequency.Monthly;
        const result = await contractInteraction.initializePayroll(
          wallet,
          details.totalAmount,
          details.mintAddress,
          frequencyEnum,
        );

        if (result.success) {
          localStorage.setItem("companyDetails", JSON.stringify(details));
          notify(
            "success",
            "Company details saved",
            `${result.message || "Payroll initialized successfully"}${result.data?.txSignature ? ` | TX: ${result.data.txSignature}` : ""}`,
          );
        } else {
          notify(
            "error",
            "Failed to initialize payroll",
            result.error || "Unknown error occurred",
          );
        }
      } catch (error) {
        notify(
          "error",
          "Failed to save company details",
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, notify],
  );

  const handleAddWorkerToPayroll = React.useCallback(
    async (employee: Employee[]) => {
      if (!wallet) {
        notify(
          "error",
          "Wallet not connected",
          "Please connect your wallet to continue",
        );
        return;
      }

      const companyDetails = localStorage.getItem("companyDetails");
      if (!companyDetails) {
        notify(
          "error",
          "Payroll not initialized",
          "Please initialize payroll in Company Details first",
        );
        return;
      }

      setIsLoading(true);
      try {
        for (const emp of employee) {
          const result = await contractInteraction.addEmployeeFunction(
            wallet,
            emp.employeeAddress,
            emp.amount,
          );
          if (result.success) {
            notify(
              "success",
              `Employee ${emp.employeeAddress} added`,
              `${result.message || "Employee added successfully"}${result.data?.txSignature ? ` | TX: ${result.data.txSignature}` : ""}`,
            );
          } else {
            notify(
              "error",
              `Failed to add employee ${emp.employeeAddress}`,
              result.error || "Unknown error occurred",
            );
          }
        }
      } catch (error) {
        notify(
          "error",
          "Failed to add employees",
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, notify],
  );

  const handleDeposit = React.useCallback(
    async (amount: number) => {
      if (!wallet) {
        notify(
          "error",
          "Wallet not connected",
          "Please connect your wallet to continue",
        );
        return;
      }

      const companyDetails = localStorage.getItem("companyDetails");
      if (!companyDetails) {
        notify(
          "error",
          "Payroll not initialized",
          "Please initialize payroll in Company Details first",
        );
        return;
      }

      setIsLoading(true);
      try {
        const result = await contractInteraction.depositAmount(wallet, amount);
        if (result.success) {
          notify(
            "success",
            "Deposit successful",
            `${result.message || "Funds deposited successfully"}${result.data?.response ? ` | TX: ${result.data.response}` : ""}`,
          );
        } else {
          notify(
            "error",
            "Failed to deposit funds",
            result.error || "Unknown error occurred",
          );
        }
      } catch (error) {
        notify(
          "error",
          "Failed to deposit funds",
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, notify],
  );

  const handleStartPayroll = React.useCallback(async () => {
    if (!wallet) {
      notify(
        "error",
        "Wallet not connected",
        "Please connect your wallet to continue",
      );
      return;
    }

    const companyDetails = localStorage.getItem("companyDetails");
    if (!companyDetails) {
      notify(
        "error",
        "Payroll not initialized",
        "Please initialize payroll in Company Details first",
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await contractInteraction.startPayroll(wallet);
      if (result.success) {
        notify(
          "success",
          "Payroll started",
          `${result.message || "Payroll started successfully"}${result.data?.response ? ` | TX: ${result.data.response}` : ""}`,
        );
      } else {
        notify(
          "error",
          "Failed to start payroll",
          result.error || "Unknown error occurred",
        );
      }
    } catch (error) {
      notify(
        "error",
        "Failed to start payroll",
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, [wallet, notify]);

  const handleDebugAdminState = React.useCallback(async () => {
    if (!wallet) {
      notify(
        "error",
        "Wallet not connected",
        "Please connect your wallet to continue",
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await contractInteraction.debugAdminState(wallet);
      if (result.success) {
        notify(
          "success",
          "Debug complete",
          "Check console for blockchain state details",
        );
      } else {
        notify(
          "error",
          "Debug failed",
          result.error || "Unknown error occurred",
        );
      }
    } catch (error) {
      notify(
        "error",
        "Debug failed",
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, [wallet, notify]);

  const handleGetEmployeeDetails = React.useCallback(async () => {
    if (!wallet) return;

    const adminPubkey = localStorage.getItem("adminPubkey");
    if (!adminPubkey) {
      notify(
        "error",
        "Admin wallet not set",
        "Please enter admin wallet address first",
      );
      return;
    }

    setIsLoadingEmployeeDetails(true);
    try {
      const result = await contractInteraction.getEmployeeDetails(
        wallet,
        adminPubkey,
      );
      if (result.success) {
        setEmployeeDetails(result.data);
      } else {
        setEmployeeDetails(null);
      }
    } catch (error) {
      setEmployeeDetails(null);
    } finally {
      setIsLoadingEmployeeDetails(false);
    }
  }, [wallet, notify]);

  const handleGetCompanyDetails = React.useCallback(async () => {
    if (!wallet) return;

    const adminPubkey = localStorage.getItem("adminPubkey");
    if (!adminPubkey) {
      notify(
        "error",
        "Admin wallet not set",
        "Please enter admin wallet address first",
      );
      return;
    }

    setIsLoadingCompanyDetails(true);
    try {
      const result = await contractInteraction.getCompanyDetails(
        wallet,
        adminPubkey,
      );
      if (result.success) {
        setFetchedCompanyDetails(result.data);
      } else {
        setFetchedCompanyDetails(null);
      }
    } catch (error) {
      setFetchedCompanyDetails(null);
    } finally {
      setIsLoadingCompanyDetails(false);
    }
  }, [wallet, notify]);

  const handleCheckClaimEligibility = React.useCallback(async () => {
    if (!wallet) return;

    const adminPubkey = localStorage.getItem("adminPubkey");
    if (!adminPubkey) {
      notify(
        "error",
        "Admin wallet not set",
        "Please enter admin wallet address first",
      );
      return;
    }

    setIsCheckingEligibility(true);
    try {
      const result = await contractInteraction.checkClaimEligibility(
        wallet,
        adminPubkey,
      );
      if (result.success && result.data) {
        setClaimEligibility(result.data);
      } else {
        setClaimEligibility(null);
      }
    } catch (error) {
      setClaimEligibility(null);
    } finally {
      setIsCheckingEligibility(false);
    }
  }, [wallet, notify]);

  const handleClaimPayment = React.useCallback(async () => {
    if (!wallet) {
      notify(
        "error",
        "Wallet not connected",
        "Please connect your wallet to continue",
      );
      return;
    }

    const adminPubkey = localStorage.getItem("adminPubkey");
    if (!adminPubkey) {
      notify(
        "error",
        "Admin wallet not set",
        "Please enter admin wallet address first",
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await contractInteraction.claimAmount(wallet, adminPubkey);
      if (result.success) {
        notify(
          "success",
          "Payment claimed successfully",
          `${result.message || "Funds transferred to your wallet"}${result.data?.response ? ` | TX: ${result.data.response}` : ""}`,
        );
        await handleGetEmployeeDetails();
        await handleCheckClaimEligibility();
      } else {
        const { title, message } = formatErrorMessage(
          result.error || "Unknown error occurred",
        );
        notify("error", title, message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      const { title, message } = formatErrorMessage(errorMessage);
      notify("error", title, message);
    } finally {
      setIsLoading(false);
    }
  }, [
    wallet,
    notify,
    handleGetEmployeeDetails,
    handleCheckClaimEligibility,
    formatErrorMessage,
  ]);

  const handleFileChange = React.useCallback((file: File | null) => {
    setFile(file);
  }, []);

  const handleAddWorker = React.useCallback(
    (employee: Employee) => {
      const updatedEmployees = [...employees, employee];
      setEmployees(updatedEmployees);
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    },
    [employees],
  );

  const handleUpdateWorker = React.useCallback(
    (updatedEmployee: Employee) => {
      const updatedEmployees = employees.map((emp) =>
        emp.employeeAddress === updatedEmployee.employeeAddress
          ? updatedEmployee
          : emp,
      );
      setEmployees(updatedEmployees);
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    },
    [employees],
  );

  React.useEffect(() => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setEmployees(results.data as Employee[]);
          localStorage.setItem("employees", JSON.stringify(results.data));
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else {
      setEmployees([]);
    }
  }, [file]);

  React.useEffect(() => {
    if (localStorage.getItem("employees") != null) {
      setEmployees(JSON.parse(localStorage.getItem("employees") || "[]"));
    }
  }, []);

  React.useEffect(() => {
    const loadedCompanyDetails = localStorage.getItem("companyDetails");
    if (loadedCompanyDetails && role === "admin") {
      try {
        const details = JSON.parse(loadedCompanyDetails);
        setCompanyDetails(details);
        if (wallet?.publicKey) {
          const programId = new PublicKey(idl.address);
          const [payrollPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
            programId,
          );
          notify(
            "success",
            "Company details loaded",
            `Payroll PDA: ${payrollPda.toBase58()}`,
          );
        }
      } catch (error) {
        console.error("Error loading company details:", error);
      }
    }
  }, [wallet, role, setCompanyDetails, notify]);

  return (
    <>
      <main className="flex flex-col w-full bg-black min-h-screen">
        <RoleSelectionModal />

        {role === "admin" && (
          <div className="flex w-full">
            <DashboardDemo1Sidebar />
            {activeTab === "view" ? (
              <FinancialOverviewView />
            ) : (
              <AdminContent
                onHandleAddWorker={handleAddWorkerToPayroll}
                onHandleSaveCompanyDetails={handleSaveCompanyDetails}
                onHandleDeposit={handleDeposit}
                onHandleStartPayroll={handleStartPayroll}
                onHandleDebugState={handleDebugAdminState}
                onFileChange={handleFileChange}
                employees={employees}
                onAddWorker={handleAddWorker}
                onUpdateWorker={handleUpdateWorker}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

        {role === "worker" && (
          <div className="flex w-full min-h-screen">
            <WorkerSidebar />
            <div className="flex flex-col flex-1 w-full bg-[#000000]">
              <TopNavbar />
              <WorkerContent
                isLoading={isLoading}
                employeeDetails={employeeDetails}
                fetchedCompanyDetails={fetchedCompanyDetails}
                isLoadingEmployeeDetails={isLoadingEmployeeDetails}
                isLoadingCompanyDetails={isLoadingCompanyDetails}
                claimEligibility={claimEligibility}
                isCheckingEligibility={isCheckingEligibility}
                onGetEmployeeDetails={handleGetEmployeeDetails}
                onGetCompanyDetails={handleGetCompanyDetails}
                onCheckClaimEligibility={handleCheckClaimEligibility}
                onClaimPayment={handleClaimPayment}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
