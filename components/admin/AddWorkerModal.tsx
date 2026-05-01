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
      employeeId: formData.get("employeeId") as string,
      employeeName: formData.get("employeeName") as string,
      eployeeSalary: Number(formData.get("eployeeSalary")),
      employeeWallet: formData.get("employeeWallet") as string,
      eployeeRole: formData.get("eployeeRole") as string,
      employeeDepartment: formData.get("employeeDepartment") as string,
      eployeePaymentFrequency: formData.get("eployeePaymentFrequency") as string,
    };

    onAddWorker(newEmployee);
    setOpen(false);
    e.currentTarget.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost_spacex" size="spacex">
          ADD WORKER MANUALLY
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-aerospace text-white text-xl">
            ADD NEW WORKER
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Fill in all the required fields to add a new worker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Field>
            <FieldLabel htmlFor="employeeId">Employee ID *</FieldLabel>
            <Input
              id="employeeId"
              name="employeeId"
              required
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. EMP001"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="employeeName">Employee Name *</FieldLabel>
            <Input
              id="employeeName"
              name="employeeName"
              required
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. John Doe"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="eployeeSalary">Salary *</FieldLabel>
            <Input
              id="eployeeSalary"
              name="eployeeSalary"
              type="number"
              required
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. 75000"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="employeeWallet">Wallet Address *</FieldLabel>
            <Input
              id="employeeWallet"
              name="employeeWallet"
              required
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. 0x1234567890abcdef..."
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="eployeeRole">Role *</FieldLabel>
            <Input
              id="eployeeRole"
              name="eployeeRole"
              required
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. Senior Developer"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="employeeDepartment">Department *</FieldLabel>
            <Input
              id="employeeDepartment"
              name="employeeDepartment"
              required
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. Engineering"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="eployeePaymentFrequency">
              Payment Frequency *
            </FieldLabel>
            <Input
              id="eployeePaymentFrequency"
              name="eployeePaymentFrequency"
              required
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. Monthly"
            />
          </Field>

          <Button type="submit" variant="ghost_spacex" size="spacex" className="mt-3">
            ADD WORKER
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
