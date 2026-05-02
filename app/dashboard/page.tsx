"use client";

import React from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { RoleSelectionModal } from "@/components/admin/RoleSelectionModal";
import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { Navbar } from "@/components/sections/Navbar";
import Papa from "papaparse";
import { CompanyDetails, Employee, Frequency } from "@/lib/types";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { contractInteraction } from "@/lib/contract-interaction";
import { useNotificationStore } from "@/stores/useNotificationStore";

export default function DashboardPage() {
  const wallet = useAnchorWallet();
  const { role } = useAdminStore();
  const { notify } = useNotificationStore();
  const [file, setFile] = React.useState<File | null>(null);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

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
        const result = await contractInteraction.initializePayroll(
          wallet,
          details.totalAmount,
          details.symbol,
          details.mintAddress,
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
          // Convert frequency string to enum
          const frequencyEnum = emp.frequency.toLowerCase() === 'weekly' ? Frequency.Weekly : Frequency.Monthly;
          
          const result = await contractInteraction.addEmployeeFunction(
            wallet,
            emp.employeeAddress,
            emp.amount,
            frequencyEnum,
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
              onFileChange={handleFileChange}
              employees={employees}
              onAddWorker={handleAddWorker}
              onUpdateWorker={handleUpdateWorker}
              isLoading={isLoading}
            />
          </div>
        )}

        {role === "worker" && (
          <div className="flex flex-col items-center justify-center w-full min-h-[80vh] text-center gap-6 px-4">
            <h1 className="text-[48px] font-bold leading-none text-aerospace text-white">
              GOOD LUCK!
            </h1>
            <p className="text-[16px] text-aerospace text-white/70 max-w-xl leading-relaxed">
              THIS DASHBOARD IS CURRENTLY ONLY FOR COMPANY OWNERS AND ADMINS TO
              SET UP PAYROLL. WORKER FEATURES WILL BE AVAILABLE SOON.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
