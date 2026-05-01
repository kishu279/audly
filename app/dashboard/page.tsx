"use client";

import React from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { RoleSelectionModal } from "@/components/admin/RoleSelectionModal";
import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { Navbar } from "@/components/sections/Navbar";
import Papa from "papaparse";
import { Employee } from "@/lib/types";

export default function DashboardPage() {
  const { role } = useAdminStore();
  const [file, setFile] = React.useState<File | null>(null);
  const [employees, setEmployees] = React.useState<Employee[]>([]);

  // handler to change the file
  const handleFileChange = React.useCallback((file: File | null) => {
    setFile(file);
  }, []);

  const handleAddWorker = React.useCallback((employee: Employee) => {
    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  }, [employees]);

  const handleUpdateWorker = React.useCallback((updatedEmployee: Employee) => {
    const updatedEmployees = employees.map((emp) => 
      emp.employeeId === updatedEmployee.employeeId ? updatedEmployee : emp
    );
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  }, [employees]);

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
              onFileChange={handleFileChange}
              employees={employees}
              onAddWorker={handleAddWorker}
              onUpdateWorker={handleUpdateWorker}
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
