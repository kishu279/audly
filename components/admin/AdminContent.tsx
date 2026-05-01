"use client";

import { useAdminStore } from "@/stores/useAdminStore";
import { FileInputSection } from "../sections/FileInputSection";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Employee } from "@/lib/types";

interface AdminContentProps {
  onFileChange: (file: File | null) => void;
  employees: Employee[];
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

export function AdminContent({ onFileChange, employees }: AdminContentProps) {
  const { activeTab, companyDetails, setCompanyDetails } = useAdminStore();

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
            <p className="text-aerospace text-white/70 text-md">
              [ ADD WORKER FORM PLACEHOLDER ]
            </p>
            <FileInputSection onFileChange={onFileChange} />
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
            <p className="text-aerospace text-white/70 text-md">
              [ UPDATE WORKER LIST PLACEHOLDER ]
            </p>
          </div>
        );

      case "view_employees":
        return (
          <div className="flex flex-col gap-6">
            <h1
              className="text-section-heading font-bold text-aerospace text-white"
              style={{ lineHeight: "var(--leading-tight)" }}
            >
              EMPLOYEE DIRECTORY
            </h1>
            <p className="text-aerospace text-white/70 text-md">
              [ EMPLOYEE LIST PLACEHOLDER ]
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
