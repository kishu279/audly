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

export function UpdateWorkerModal({ employee, open, onOpenChange, onUpdateWorker }: UpdateWorkerModalProps) {
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
      <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-aerospace text-white text-xl">
            UPDATE WORKER DETAILS
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Modify the worker details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Field>
            <FieldLabel htmlFor="employeeAddress">Employee Address *</FieldLabel>
            <Input
              id="employeeAddress"
              name="employeeAddress"
              required
              defaultValue={employee.employeeAddress}
              className="bg-transparent border-white/20 text-white"
              readOnly
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="amount">Amount *</FieldLabel>
            <Input
              id="amount"
              name="amount"
              type="number"
              required
              defaultValue={employee.amount}
              className="bg-transparent border-white/20 text-white"
            />
          </Field>

          <Button type="submit" variant="ghost_spacex" size="spacex" className="mt-3">
            UPDATE WORKER
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
