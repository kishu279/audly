"use client";

import { useAdminStore } from "@/stores/useAdminStore";
import { FileInputSection } from "../sections/FileInputSection";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CompanyDetails, Employee } from "@/lib/types";
import { AddWorkerModal } from "./AddWorkerModal";
import { UpdateWorkerModal } from "./UpdateWorkerModal";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import React from "react";

interface AdminContentProps {
  onFileChange: (file: File | null) => void;
  employees: Employee[];
  onAddWorker: (employee: Employee) => void;
  onUpdateWorker: (employee: Employee) => void;
  onHandleSaveCompanyDetails: (details: CompanyDetails) => void;
  onHandleAddWorker: (employee: Employee[]) => void;
  isLoading: boolean;
}

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employeeAddress",
    header: "Employee Address",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

const updateColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employeeAddress",
    header: "Employee Address",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

export function AdminContent({
  onFileChange,
  employees,
  onAddWorker,
  onUpdateWorker,
  onHandleSaveCompanyDetails,
  onHandleAddWorker,
  isLoading,
}: AdminContentProps) {
  const { activeTab, companyDetails, setCompanyDetails } = useAdminStore();
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = React.useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "company_details":
        if (companyDetails) {
          return (
            <div className="flex flex-col gap-6">
              <h1
                className="text-section-heading font-bold text-aerospace text-white"
                style={{ lineHeight: "var(--leading-tight)" }}
              >
                COMPANY DETAILS
              </h1>
              <div className="border border-white/20 p-6 rounded-xl bg-white/5">
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
                      TOTAL AMOUNT
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {companyDetails.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      TOKEN SYMBOL
                    </label>
                    <p className="text-aerospace text-white text-md">
                      {companyDetails.symbol}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-aerospace text-white/50 text-label">
                      MINT ADDRESS
                    </label>
                    <p className="text-aerospace text-white text-md break-all">
                      {companyDetails.mintAddress}
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
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-6 max-w-xl">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              ADD COMPANY DETAILS
            </h1>
            <p className="text-aerospace text-white/70 text-md">
              PLEASE ENTER YOUR COMPANY DETAILS TO PROCEED WITH PAYROLL SETUP.
            </p>

            <form
              className="flex flex-col gap-4 mt-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const details: CompanyDetails = {
                  name: formData.get("name") as string,
                  registrationNumber: formData.get("regNumber") as string,
                  totalAmount: Number(formData.get("totalAmount")),
                  symbol: formData.get("symbol") as string,
                  mintAddress: formData.get("mintAddress") as string,
                  frequency: formData.get("frequency") as string,
                };

                await onHandleSaveCompanyDetails(details);
                setCompanyDetails(details);
              }}
            >
              <div className="flex flex-col gap-2">
                <label className="text-aerospace text-white/70 text-body">
                  COMPANY NAME
                </label>
                <input
                  name="name"
                  required
                  className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace text-body"
                  placeholder="E.G. SPACEX"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-aerospace text-white/70 text-body">
                  REGISTRATION NUMBER
                </label>
                <input
                  name="regNumber"
                  required
                  className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace text-body"
                  placeholder="E.G. 123456789"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-aerospace text-white/70 text-body">
                  TOTAL AMOUNT
                </label>
                <input
                  name="totalAmount"
                  type="number"
                  required
                  className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace text-body"
                  placeholder="E.G. 1000000"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-aerospace text-white/70 text-body">
                  TOKEN SYMBOL
                </label>
                <input
                  name="symbol"
                  required
                  className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace text-body"
                  placeholder="E.G. USDC"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-aerospace text-white/70 text-body">
                  MINT ADDRESS
                </label>
                <input
                  name="mintAddress"
                  required
                  className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace text-body"
                  placeholder="E.G. EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-aerospace text-white/70 text-body">
                  PAYMENT FREQUENCY
                </label>
                <select
                  name="frequency"
                  required
                  className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace text-body"
                >
                  <option value="" disabled selected className="bg-black">
                    SELECT FREQUENCY
                  </option>
                  <option value="Weekly" className="bg-black">
                    WEEKLY
                  </option>
                  <option value="Monthly" className="bg-black">
                    MONTHLY
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 text-body font-bold text-aerospace-nav text-white bg-ghost border border-ghost-border rounded-[32px] px-[18px] py-[11px] hover:bg-white/20 hover:text-white-100 transition-all self-start disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "SAVING..." : "SAVE DETAILS"}
              </button>
            </form>
          </div>
        );

      case "add_workers":
        console.log("Employees data:", employees);
        console.log("Columns:", columns);
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              ADD WORKERS
            </h1>
            <div className="flex gap-4 items-center">
              <FileInputSection onFileChange={onFileChange} />
              <AddWorkerModal onAddWorker={onAddWorker} />
            </div>
            <DataTable columns={columns} data={employees} />
            {employees.length > 0 && (
              <button
                onClick={() => {
                  console.log("Saving employees to blockchain:", employees);
                  onHandleAddWorker(employees);
                  // TODO: Add blockchain save logic here
                }}
                className="text-body font-bold text-aerospace-nav text-white bg-ghost border border-ghost-border rounded-[32px] px-[18px] py-[11px] hover:bg-white/20 hover:text-white-100 transition-all self-start"
              >
                SAVE WORKERS
              </button>
            )}
          </div>
        );

      case "update_worker_details":
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              UPDATE WORKER DETAILS
            </h1>
            <div className="rounded-md border border-white/20">
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-black z-10 border-b border-white/20">
                    <tr>
                      <th className="text-left p-4 text-white/70 text-sm font-medium">
                        Employee Address
                      </th>
                      <th className="text-left p-4 text-white/70 text-sm font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <HoverCard key={employee.employeeAddress} openDelay={200}>
                        <HoverCardTrigger asChild>
                          <tr className="border-b border-white/10 hover:bg-white/5 cursor-pointer">
                            <td className="p-4 text-white text-sm">
                              {employee.employeeAddress}
                            </td>
                            <td className="p-4 text-white text-sm">
                              {employee.amount}
                            </td>
                          </tr>
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-black border-white/20 text-white w-80">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-aerospace">
                              Update Worker Details
                            </h4>
                            <p className="text-xs text-white/70">
                              Click the button below to modify amount for{" "}
                              {employee.employeeAddress}.
                            </p>
                            <Button
                              variant="ghost_spacex"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setUpdateModalOpen(true);
                              }}
                            >
                              UPDATE
                            </Button>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <UpdateWorkerModal
              employee={selectedEmployee}
              open={updateModalOpen}
              onOpenChange={setUpdateModalOpen}
              onUpdateWorker={onUpdateWorker}
            />
          </div>
        );

      case "salary_status":
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              SALARY STATUS
            </h1>
            <p className="text-aerospace text-white/70 text-md">
              [ SALARY STATUS PLACEHOLDER ]
            </p>
          </div>
        );

      case "payment_status":
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              PAYMENT STATUS
            </h1>
            <p className="text-aerospace text-white/70 text-md">
              [ TRANSACTIONS STATUS PLACEHOLDER ]
            </p>
          </div>
        );

      case "cancel_payment":
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-red-500"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              CANCEL PAYMENT
            </h1>
            <p className="text-aerospace text-red-400/70 text-md">
              [ CANCEL PENDING PAYMENTS PLACEHOLDER ]
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 px-8 py-8 min-h-screen relative">
      {renderContent()}

      {/* Debug button to clear localStorage */}
      <button
        onClick={() => {
          localStorage.removeItem("employees");
          localStorage.removeItem("companyDetails");
          window.location.reload();
        }}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-md transition-all"
      >
        CLEAR DATA
      </button>
    </div>
  );
}
