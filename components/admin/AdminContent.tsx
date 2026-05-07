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
import { motion, AnimatePresence } from "framer-motion";

import { TopNavbar } from "@/components/dashboard/TopNavbar";

interface AdminContentProps {
  onFileChange: (file: File | null) => void;
  employees: Employee[];
  onAddWorker: (employee: Employee) => void;
  onUpdateWorker: (employee: Employee) => void;
  onHandleSaveCompanyDetails: (details: CompanyDetails) => void;
  onHandleAddWorker: (employee: Employee[]) => void;
  onHandleDeposit: (amount: number) => void;
  onHandleStartPayroll: () => void;
  onHandleDebugState: () => void;
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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export function AdminContent({
  onFileChange,
  employees,
  onAddWorker,
  onUpdateWorker,
  onHandleSaveCompanyDetails,
  onHandleAddWorker,
  onHandleDeposit,
  onHandleStartPayroll,
  onHandleDebugState,
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
            <div className="flex flex-col gap-6 w-full max-w-2xl">
              <h1
                className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                COMPANY DETAILS
              </h1>
              <div className="flex flex-col gap-6 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
                <div className="grid gap-5">
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      COMPANY NAME
                    </label>
                    <p
                      className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {companyDetails.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      REGISTRATION NUMBER
                    </label>
                    <p
                      className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {companyDetails.registrationNumber}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      TOTAL AMOUNT
                    </label>
                    <p
                      className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {companyDetails.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      MINT ADDRESS
                    </label>
                    <p
                      className="text-[16px] tracking-[-0.4px] text-[#e5e2e1] break-all"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {companyDetails.mintAddress}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      PAYMENT FREQUENCY
                    </label>
                    <p
                      className="text-[16px] tracking-[-0.4px] text-[#e5e2e1]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {companyDetails.frequency}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onHandleStartPayroll}
                disabled={isLoading}
                className="mt-3 px-4 py-2 rounded-[2px] text-[12px] uppercase text-white hover:opacity-90 transition-opacity self-start disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(107.77deg, #FF571A 0%, #FD25EA 100%)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {isLoading ? "STARTING..." : "START PAYROLL"}
              </button>
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
            <p
              className="text-[14px] text-[#71717a]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
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
                  mintAddress: formData.get("mintAddress") as string,
                  frequency: formData.get("frequency") as string,
                };

                await onHandleSaveCompanyDetails(details);
                setCompanyDetails(details);
              }}
            >
              <div className="flex flex-col gap-2">
                <label
                  className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  COMPANY NAME
                </label>
                <input
                  name="name"
                  required
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  placeholder="E.G. SPACEX"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  REGISTRATION NUMBER
                </label>
                <input
                  name="regNumber"
                  required
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  placeholder="E.G. 123456789"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  TOTAL AMOUNT
                </label>
                <input
                  name="totalAmount"
                  type="number"
                  step="any"
                  required
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  placeholder="E.G. 1000 (UI FORMAT)"
                />
                <p
                  className="text-[10px] text-[#71717a] uppercase tracking-[0.05em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  ENTER AMOUNT IN UI FORMAT (E.G. 1000 FOR 1000 TOKENS, NOT
                  LAMPORTS)
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  MINT ADDRESS
                </label>
                <input
                  name="mintAddress"
                  required
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  placeholder="E.G. EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  PAYMENT FREQUENCY
                </label>
                <select
                  name="frequency"
                  required
                  defaultValue=""
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="" disabled className="bg-black">
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
                className="mt-3 px-4 py-2 rounded-[2px] text-[12px] uppercase text-white hover:opacity-90 transition-opacity self-start disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(107.77deg, #FF571A 0%, #FD25EA 100%)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {isLoading ? "SAVING..." : "SAVE DETAILS"}
              </button>
            </form>
          </div>
        );

      case "add_workers":
        return (
          <div className="flex flex-col gap-6 w-full max-w-4xl">
            <h1
              className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ADD WORKERS
            </h1>
            <div className="flex gap-4 items-center">
              <FileInputSection onFileChange={onFileChange} />
              <AddWorkerModal onAddWorker={onAddWorker} />
            </div>

            <div className="rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212] overflow-hidden">
              <DataTable columns={columns} data={employees} />
            </div>

            {employees.length > 0 && (
              <button
                onClick={() => {
                  onHandleAddWorker(employees);
                }}
                className="mt-3 px-4 py-2 rounded-[2px] text-[12px] uppercase text-white hover:opacity-90 transition-opacity self-start"
                style={{
                  background:
                    "linear-gradient(107.77deg, #FF571A 0%, #FD25EA 100%)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                SAVE WORKERS
              </button>
            )}
          </div>
        );

      case "update_worker_details":
        return (
          <div className="flex flex-col gap-6 w-full max-w-4xl">
            <h1
              className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              UPDATE WORKER DETAILS
            </h1>
            <div className="rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#121212] z-10 border-b border-[rgba(255,255,255,0.08)]">
                    <tr>
                      <th
                        className="p-4 text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Employee Address
                      </th>
                      <th
                        className="p-4 text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <HoverCard key={employee.employeeAddress} openDelay={200}>
                        <HoverCardTrigger asChild>
                          <tr className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors">
                            <td
                              className="p-4 text-[14px] text-[#d4d4d8]"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {employee.employeeAddress}
                            </td>
                            <td
                              className="p-4 text-[14px] text-[#d4d4d8]"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {employee.amount}
                            </td>
                          </tr>
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-[#121212] border-[rgba(255,255,255,0.08)] text-[#e5e2e1] w-80 rounded-[2px] p-4 shadow-xl">
                          <div className="space-y-3">
                            <h4
                              className="text-[16px] text-[#e5e2e1] uppercase tracking-[-0.4px]"
                              style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                              }}
                            >
                              Update Worker Details
                            </h4>
                            <p
                              className="text-[12px] text-[#71717a]"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              Click the button below to modify amount for{" "}
                              <span className="text-[#d946ef] break-all block mt-1">
                                {employee.employeeAddress}
                              </span>
                            </p>
                            <Button
                              variant="ghost_spacex"
                              size="sm"
                              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e5e2e1] hover:bg-[rgba(255,255,255,0.08)] text-[10px] uppercase tracking-[0.1em] rounded-[2px] h-8"
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

      case "deposit":
        return (
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <h1
              className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              DEPOSIT
            </h1>
            <p
              className="text-[14px] text-[#71717a]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              DEPOSIT FUNDS TO THE PAYROLL VAULT TO PAY YOUR EMPLOYEES.
            </p>

            <form
              className="flex flex-col gap-4 mt-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const amount = Number(formData.get("depositAmount"));
                const form = e.currentTarget;
                await onHandleDeposit(amount);
                form.reset();
              }}
            >
              <div className="flex flex-col gap-2">
                <label
                  className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  DEPOSIT AMOUNT
                </label>
                <input
                  name="depositAmount"
                  type="number"
                  step="any"
                  required
                  min="0.000001"
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  placeholder="E.G. 500 (UI FORMAT)"
                />
                <p
                  className="text-[10px] text-[#71717a] uppercase tracking-[0.05em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  ENTER AMOUNT IN UI FORMAT (E.G. 500 FOR 500 TOKENS, NOT
                  LAMPORTS)
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 px-4 py-2 rounded-[2px] text-[12px] uppercase text-white hover:opacity-90 transition-opacity self-start disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(107.77deg, #FF571A 0%, #FD25EA 100%)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {isLoading ? "DEPOSITING..." : "DEPOSIT FUNDS"}
              </button>
            </form>
          </div>
        );

      case "payment_status":
        return (
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <h1
              className="text-[32px] leading-tight text-[#e5e2e1] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              PAYMENT STATUS
            </h1>
            <div className="flex flex-col gap-6 p-6 rounded-[2px] border border-[rgba(255,255,255,0.08)] bg-[#121212]">
              <p
                className="text-[14px] text-[#71717a]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                [ TRANSACTIONS STATUS PLACEHOLDER ]
              </p>
            </div>
            <button
              onClick={onHandleDebugState}
              disabled={isLoading}
              className="mt-3 px-4 py-2 rounded-[2px] text-[12px] uppercase text-[#e5e2e1] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] transition-colors self-start disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {isLoading ? "DEBUGGING..." : "DEBUG BLOCKCHAIN STATE"}
            </button>
          </div>
        );

      case "cancel_payment":
        return (
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <h1
              className="text-[32px] leading-tight text-[#ef4444] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              CANCEL PAYMENT
            </h1>
            <div className="flex flex-col gap-6 p-6 rounded-[2px] border border-[rgba(239,68,68,0.2)] bg-[#121212]">
              <p
                className="text-[14px] text-[#f87171]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                [ CANCEL PENDING PAYMENTS PLACEHOLDER ]
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-[#000000]">
      <TopNavbar />
      <div className="flex-1 px-8 py-8 min-h-screen relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Debug button to clear localStorage */}
        <button
          onClick={() => {
            localStorage.removeItem("employees");
            localStorage.removeItem("companyDetails");
            window.location.reload();
          }}
          className="fixed bottom-6 right-6 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e5e2e1] text-[12px] uppercase px-4 py-2 rounded-[2px] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          CLEAR DATA
        </button>
      </div>
    </div>
  );
}
