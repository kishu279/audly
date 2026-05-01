"use client";

import { useAdminStore } from "@/stores/useAdminStore";
import { FileInputSection } from "../sections/FileInputSection";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Employee } from "@/lib/types";
import { AddWorkerModal } from "./AddWorkerModal";
import { UpdateWorkerModal } from "./UpdateWorkerModal";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import React from "react";

interface AdminContentProps {
  onFileChange: (file: File | null) => void;
  employees: Employee[];
  onAddWorker: (employee: Employee) => void;
  onUpdateWorker: (employee: Employee) => void;
}

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "employeeName",
    header: "Name",
  },
  {
    accessorKey: "eployeeSalary",
    header: "Salary",
  },
  {
    accessorKey: "employeeWallet",
    header: "Wallet Address",
  },
  {
    accessorKey: "eployeeRole",
    header: "Role",
  },
  {
    accessorKey: "employeeDepartment",
    header: "Department",
  },
  {
    accessorKey: "eployeePaymentFrequency",
    header: "Payment Frequency",
  },
];

const updateColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "employeeName",
    header: "Name",
  },
  {
    accessorKey: "eployeeSalary",
    header: "Salary",
  },
  {
    accessorKey: "employeeWallet",
    header: "Wallet Address",
  },
  {
    accessorKey: "eployeeRole",
    header: "Role",
  },
  {
    accessorKey: "employeeDepartment",
    header: "Department",
  },
  {
    accessorKey: "eployeePaymentFrequency",
    header: "Payment Frequency",
  },
];

export function AdminContent({ onFileChange, employees, onAddWorker, onUpdateWorker }: AdminContentProps) {
  const { activeTab, companyDetails, setCompanyDetails } = useAdminStore();
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
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
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setCompanyDetails({
                  name: formData.get("name") as string,
                  registrationNumber: formData.get("regNumber") as string,
                });
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

              <button
                type="submit"
                className="mt-3 text-body font-bold text-aerospace-nav text-white bg-ghost border border-ghost-border rounded-[32px] px-[18px] py-[11px] hover:bg-white/20 hover:text-white-100 transition-all self-start"
              >
                SAVE DETAILS
              </button>
            </form>
          </div>
        );

      case "add_workers":
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
                      {updateColumns.map((column) => (
                        <th key={column.id || (column.accessorKey as string)} className="text-left p-4 text-white/70 text-sm font-medium">
                          {column.header as string}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <HoverCard key={employee.employeeId} openDelay={200}>
                        <HoverCardTrigger asChild>
                          <tr className="border-b border-white/10 hover:bg-white/5 cursor-pointer">
                            <td className="p-4 text-white text-sm">{employee.employeeId}</td>
                            <td className="p-4 text-white text-sm">{employee.employeeName}</td>
                            <td className="p-4 text-white text-sm">{employee.eployeeSalary}</td>
                            <td className="p-4 text-white text-sm">{employee.employeeWallet}</td>
                            <td className="p-4 text-white text-sm">{employee.eployeeRole}</td>
                            <td className="p-4 text-white text-sm">{employee.employeeDepartment}</td>
                            <td className="p-4 text-white text-sm">{employee.eployeePaymentFrequency}</td>
                          </tr>
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-black border-white/20 text-white w-80">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-aerospace">Update Worker Details</h4>
                            <p className="text-xs text-white/70">
                              Click the button below to modify salary, role, department, or payment frequency for {employee.employeeName}.
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

  return <div className="flex-1 px-8 py-8 min-h-screen">{renderContent()}</div>;
}
