"use client";

import React from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { RoleSelectionModal } from "@/components/admin/RoleSelectionModal";
import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { WorkerSidebar } from "@/components/worker/WorkerSidebar";
import { WorkerContent } from "@/components/worker/WorkerContent";
import { Navbar } from "@/components/sections/Navbar";
import Papa from "papaparse";
import { CompanyDetails, Employee, Frequency } from "@/lib/types";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { contractInteraction } from "@/lib/contract-interaction";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { PublicKey } from "@solana/web3.js";
import idl from "@/contract/auddly.json";

export default function DashboardPage() {
  const wallet = useAnchorWallet();
  const { role, setCompanyDetails } = useAdminStore();
  const { notify } = useNotificationStore();
  const [file, setFile] = React.useState<File | null>(null);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [employeeDetails, setEmployeeDetails] = React.useState<any>(null);
  const [fetchedCompanyDetails, setFetchedCompanyDetails] = React.useState<any>(null);
  const [isLoadingEmployeeDetails, setIsLoadingEmployeeDetails] = React.useState(false);
  const [isLoadingCompanyDetails, setIsLoadingCompanyDetails] = React.useState(false);
  const [claimEligibility, setClaimEligibility] = React.useState<any>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = React.useState(false);

  // Helper function to parse and format error messages
  const formatErrorMessage = React.useCallback((error: string): { title: string; message: string } => {
    // Check for insufficient funds error
    if (error.includes("no record of a prior credit") || error.includes("Attempt to debit an account")) {
      return {
        title: "Insufficient Funds",
        message: "The payroll vault doesn't have enough funds. Please ask admin to deposit funds first."
      };
    }
    
    // Check for simulation failed errors
    if (error.includes("Simulation failed")) {
      const messageMatch = error.match(/Message: ([^.]+)/);
      if (messageMatch) {
        return {
          title: "Transaction Failed",
          message: messageMatch[1].trim()
        };
      }
    }
    
    // Default error
    return {
      title: "Failed to claim payment",
      message: error
    };
  }, []);

  // SAVING THE COMPANY DETAILS AND INITIALIZING THE PAYROLL ON THE SOLANA BLOCKCHAIN
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
        // Convert frequency string to enum
        const frequencyEnum = details.frequency.toLowerCase() === 'weekly' ? Frequency.Weekly : Frequency.Monthly;
        
        const result = await contractInteraction.initializePayroll(
          wallet,
          details.totalAmount,
          details.mintAddress,
          frequencyEnum,
        );

        console.log("Initialize Payroll Result:", result);

        if (result.success) {
          localStorage.setItem("companyDetails", JSON.stringify(details));
          notify(
            "success",
            "Company details saved",
            `${result.message || "Payroll initialized successfully"}${result.data?.txSignature ? ` | TX: ${result.data.txSignature}` : ""}`,
          );
        } else {
          console.error("Payroll initialization failed:", result.error);
          notify(
            "error",
            "Failed to initialize payroll",
            result.error || "Unknown error occurred",
          );
        }
      } catch (error) {
        console.error("Exception in handleSaveCompanyDetails:", error);
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

  // SAVING THE WORKER DETAILS AND ADDING THE WORKER TO THE PAYROLL ON THE SOLANA BLOCKCHAIN
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

      // Check if company details exist (payroll initialized)
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

          console.log(`Add Employee ${emp.employeeAddress} Result:`, result);

          if (result.success) {
            notify(
              "success",
              `Employee ${emp.employeeAddress} added`,
              `${result.message || "Employee added successfully"}${result.data?.txSignature ? ` | TX: ${result.data.txSignature}` : ""}`,
            );
          } else {
            console.error(
              `Failed to add employee ${emp.employeeAddress}:`,
              result.error,
            );
            notify(
              "error",
              `Failed to add employee ${emp.employeeAddress}`,
              result.error || "Unknown error occurred",
            );
          }
        }
      } catch (error) {
        console.error("Exception in handleAddWorkerToPayroll:", error);
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

  // DEPOSIT FUNDS TO PAYROLL VAULT
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

      // Check if company details exist (payroll initialized)
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

        console.log("Deposit Result:", result);

        if (result.success) {
          notify(
            "success",
            "Deposit successful",
            `${result.message || "Funds deposited successfully"}${result.data?.response ? ` | TX: ${result.data.response}` : ""}`,
          );
        } else {
          console.error("Deposit failed:", result.error);
          notify(
            "error",
            "Failed to deposit funds",
            result.error || "Unknown error occurred",
          );
        }
      } catch (error) {
        console.error("Exception in handleDeposit:", error);
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

  // START PAYROLL
  const handleStartPayroll = React.useCallback(
    async () => {
      if (!wallet) {
        notify(
          "error",
          "Wallet not connected",
          "Please connect your wallet to continue",
        );
        return;
      }

      // Check if company details exist (payroll initialized)
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

        console.log("Start Payroll Result:", result);

        if (result.success) {
          notify(
            "success",
            "Payroll started",
            `${result.message || "Payroll started successfully"}${result.data?.response ? ` | TX: ${result.data.response}` : ""}`,
          );
        } else {
          console.error("Start payroll failed:", result.error);
          notify(
            "error",
            "Failed to start payroll",
            result.error || "Unknown error occurred",
          );
        }
      } catch (error) {
        console.error("Exception in handleStartPayroll:", error);
        notify(
          "error",
          "Failed to start payroll",
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, notify],
  );

  // DEBUG ADMIN STATE
  const handleDebugAdminState = React.useCallback(
    async () => {
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
        console.error("Exception in handleDebugAdminState:", error);
        notify(
          "error",
          "Debug failed",
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, notify],
  );

  // GET EMPLOYEE DETAILS
  const handleGetEmployeeDetails = React.useCallback(
    async () => {
      if (!wallet) {
        console.log("[Employee Details] Wallet not connected");
        return;
      }

      const adminPubkey = localStorage.getItem("adminPubkey");
      if (!adminPubkey) {
        console.log("[Employee Details] Admin pubkey not found in localStorage");
        notify(
          "error",
          "Admin wallet not set",
          "Please enter admin wallet address first",
        );
        return;
      }

      console.log("[Employee Details] Starting fetch...");
      console.log("[Employee Details] Employee Wallet:", wallet.publicKey.toBase58());
      console.log("[Employee Details] Admin Pubkey:", adminPubkey);

      setIsLoadingEmployeeDetails(true);
      try {
        const result = await contractInteraction.getEmployeeDetails(wallet, adminPubkey);

        console.log("[Employee Details] Result:", result);

        if (result.success) {
          console.log("[Employee Details] ✅ Success - Data:", result.data);
          setEmployeeDetails(result.data);
        } else {
          console.log("[Employee Details] ❌ Failed:", result.error);
          setEmployeeDetails(null);
        }
      } catch (error) {
        console.error("[Employee Details] Exception:", error);
        setEmployeeDetails(null);
      } finally {
        setIsLoadingEmployeeDetails(false);
      }
    },
    [wallet, notify],
  );

  // GET COMPANY DETAILS
  const handleGetCompanyDetails = React.useCallback(
    async () => {
      if (!wallet) {
        console.log("[Company Details] Wallet not connected");
        return;
      }

      const adminPubkey = localStorage.getItem("adminPubkey");
      if (!adminPubkey) {
        console.log("[Company Details] Admin pubkey not found in localStorage");
        notify(
          "error",
          "Admin wallet not set",
          "Please enter admin wallet address first",
        );
        return;
      }

      console.log("[Company Details] Starting fetch...");
      console.log("[Company Details] Admin Pubkey:", adminPubkey);

      setIsLoadingCompanyDetails(true);
      try {
        const result = await contractInteraction.getCompanyDetails(wallet, adminPubkey);

        console.log("[Company Details] Result:", result);

        if (result.success) {
          console.log("[Company Details] ✅ Success - Data:", result.data);
          setFetchedCompanyDetails(result.data);
        } else {
          console.log("[Company Details] ❌ Failed:", result.error);
          setFetchedCompanyDetails(null);
        }
      } catch (error) {
        console.error("[Company Details] Exception:", error);
        setFetchedCompanyDetails(null);
      } finally {
        setIsLoadingCompanyDetails(false);
      }
    },
    [wallet, notify],
  );

  // CHECK CLAIM ELIGIBILITY
  const handleCheckClaimEligibility = React.useCallback(
    async () => {
      if (!wallet) {
        console.log("[Claim Eligibility] Wallet not connected");
        return;
      }

      const adminPubkey = localStorage.getItem("adminPubkey");
      if (!adminPubkey) {
        console.log("[Claim Eligibility] Admin pubkey not found in localStorage");
        notify(
          "error",
          "Admin wallet not set",
          "Please enter admin wallet address first",
        );
        return;
      }

      console.log("[Claim Eligibility] Starting check...");
      console.log("[Claim Eligibility] Employee Wallet:", wallet.publicKey.toBase58());
      console.log("[Claim Eligibility] Admin Pubkey:", adminPubkey);

      setIsCheckingEligibility(true);
      try {
        const result = await contractInteraction.checkClaimEligibility(wallet, adminPubkey);

        console.log("[Claim Eligibility] Result:", result);

        if (result.success && result.data) {
          console.log("[Claim Eligibility] ✅ Success - Data:", result.data);
          console.log("[Claim Eligibility] Eligible:", result.data.eligible);
          console.log("[Claim Eligibility] Next Claim Date:", result.data.nextClaimDate);
          setClaimEligibility(result.data);
        } else {
          console.log("[Claim Eligibility] ❌ Failed:", result.error);
          setClaimEligibility(null);
        }
      } catch (error) {
        console.error("[Claim Eligibility] Exception:", error);
        setClaimEligibility(null);
      } finally {
        setIsCheckingEligibility(false);
      }
    },
    [wallet, notify],
  );

  // CLAIM PAYMENT
  const handleClaimPayment = React.useCallback(
    async () => {
      if (!wallet) {
        console.log("[Claim Payment] Wallet not connected");
        notify(
          "error",
          "Wallet not connected",
          "Please connect your wallet to continue",
        );
        return;
      }

      const adminPubkey = localStorage.getItem("adminPubkey");
      if (!adminPubkey) {
        console.log("[Claim Payment] Admin pubkey not found in localStorage");
        notify(
          "error",
          "Admin wallet not set",
          "Please enter admin wallet address first",
        );
        return;
      }

      console.log("\n========== CLAIM PAYMENT STARTED ==========");
      console.log("[Claim Payment] Employee Wallet:", wallet.publicKey.toBase58());
      console.log("[Claim Payment] Admin Pubkey:", adminPubkey);
      console.log("[Claim Payment] Current Eligibility:", claimEligibility);

      setIsLoading(true);
      try {
        console.log("[Claim Payment] Calling contractInteraction.claimAmount...");
        const result = await contractInteraction.claimAmount(wallet, adminPubkey);

        console.log("[Claim Payment] Result:", result);

        if (result.success) {
          console.log("[Claim Payment] ✅ SUCCESS!");
          console.log("[Claim Payment] Transaction:", result.data?.response);
          notify(
            "success",
            "Payment claimed successfully",
            `${result.message || "Funds transferred to your wallet"}${result.data?.response ? ` | TX: ${result.data.response}` : ""}`,
          );
          
          console.log("[Claim Payment] Refreshing employee details and eligibility...");
          // Refresh employee details and eligibility after claim
          await handleGetEmployeeDetails();
          await handleCheckClaimEligibility();
          console.log("[Claim Payment] Refresh complete");
        } else {
          console.error("[Claim Payment] ❌ FAILED:", result.error);
          const { title, message } = formatErrorMessage(result.error || "Unknown error occurred");
          notify(
            "error",
            title,
            message,
          );
        }
      } catch (error) {
        console.error("[Claim Payment] ❌ EXCEPTION:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        const { title, message } = formatErrorMessage(errorMessage);
        notify(
          "error",
          title,
          message,
        );
      } finally {
        setIsLoading(false);
        console.log("========== CLAIM PAYMENT ENDED ==========\n");
      }
    },
    [wallet, notify, handleGetEmployeeDetails, handleCheckClaimEligibility, claimEligibility],
  );

  // handler to change the file
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
    // if only file is present
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // data is logging properly
          console.log("Parsed CSV Data:", results.data);
          setEmployees(results.data as Employee[]);
          /// Fix: storing on the localstorage for now, we can change this to a more secure storage later
          localStorage.setItem("employees", JSON.stringify(results.data));
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else {
      setEmployees([]);
      console.log("No file selected");
    }
  }, [file]);

  React.useEffect(() => {
    if (localStorage.getItem("employees") != null) {
      setEmployees(JSON.parse(localStorage.getItem("employees") || "[]"));
    }
  }, []);

  // Load company details from localStorage and derive payroll PDA
  React.useEffect(() => {
    const loadedCompanyDetails = localStorage.getItem("companyDetails");
    
    if (loadedCompanyDetails && role === "admin") {
      try {
        const details = JSON.parse(loadedCompanyDetails);
        setCompanyDetails(details);
        
        // Derive payroll PDA if wallet is connected
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
      {/* Keeping Navbar for wallet connection */}
      <Navbar />

      <main className="flex w-full pt-20 bg-black min-h-screen">
        <RoleSelectionModal />

        {role === "admin" && (
          <div className="flex w-full">
            <DashboardSidebar />
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
          </div>
        )}

        {role === "worker" && (
          <div className="flex w-full">
            <WorkerSidebar />
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
        )}
      </main>
    </>
  );
}
