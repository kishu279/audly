"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Employee } from "@/lib/types";

interface AddWorkerModalProps {
  onAddWorker: (employee: Employee) => void;
}

export function AddWorkerModal({ onAddWorker }: AddWorkerModalProps) {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newEmployee: Employee = {
      employeeAddress: formData.get("employeeAddress") as string,
      amount: Number(formData.get("amount")),
    };

    onAddWorker(newEmployee);
    setOpen(false);
    e.currentTarget.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="px-4 py-2 rounded-[2px] text-[12px] uppercase text-[#e5e2e1] hover:bg-[rgba(255,255,255,0.08)] transition-colors border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ADD WORKER MANUALLY
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#121212] border-[rgba(255,255,255,0.08)] rounded-[2px] text-[#e5e2e1] max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            className="text-[20px] uppercase tracking-[-0.4px] text-[#e5e2e1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ADD NEW WORKER
          </DialogTitle>
          <DialogDescription
            className="text-[14px] text-[#71717a]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Fill in all the required fields to add a new worker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="employeeAddress"
              className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Employee Address *
            </label>
            <input
              id="employeeAddress"
              name="employeeAddress"
              required
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
              placeholder="E.G. 5VuMUWoowHHFVwvnAPiS1nRd9vmdEFaVHwoy944b3KPC"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="amount"
              className="text-[10px] text-[#71717a] uppercase tracking-[0.1em]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Amount (UI Format) *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="any"
              required
              min="0.000001"
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[2px] px-4 py-3 text-white focus:outline-none focus:border-[#d946ef] text-[14px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
              placeholder="E.G. 500 (NOT LAMPORTS)"
            />
            <p
              className="text-[10px] text-[#71717a] uppercase tracking-[0.05em]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              ENTER AMOUNT IN UI FORMAT (E.G. 500 FOR 500 TOKENS, NOT LAMPORTS)
            </p>
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
            ADD WORKER
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
