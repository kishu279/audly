"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Employee } from "@/lib/types";

interface UpdateWorkerModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateWorker: (employee: Employee) => void;
}

export function UpdateWorkerModal({
  employee,
  open,
  onOpenChange,
  onUpdateWorker,
}: UpdateWorkerModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedEmployee: Employee = {
      employeeAddress: formData.get("employeeAddress") as string,
      amount: Number(formData.get("amount")),
    };

    onUpdateWorker(updatedEmployee);
    onOpenChange(false);
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#121212] border-[rgba(255,255,255,0.08)] rounded-[2px] text-[#e5e2e1] max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            className="text-[20px] uppercase tracking-[-0.4px] text-[#e5e2e1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            UPDATE WORKER DETAILS
          </DialogTitle>
          <DialogDescription
            className="text-[14px] text-[#71717a]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Modify the worker details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="employeeAddress"
              className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Employee Address
            </label>
            <input
              id="employeeAddress"
              name="employeeAddress"
              required
              defaultValue={employee.employeeAddress}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none opacity-50 cursor-not-allowed text-[14px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="amount"
              className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="any"
              required
              defaultValue={employee.amount}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <button
            type="submit"
            className="mt-3 px-4 py-2 rounded-[2px] text-[12px] uppercase text-white hover:opacity-90 transition-opacity self-start"
            style={{
              background:
                "linear-gradient(107.77deg, #FF571A 0%, #FD25EA 100%)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            UPDATE WORKER
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
