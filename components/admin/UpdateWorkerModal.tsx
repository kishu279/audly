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
      employeeId: formData.get("employeeId") as string,
      employeeName: formData.get("employeeName") as string,
      eployeeSalary: Number(formData.get("eployeeSalary")),
      employeeWallet: formData.get("employeeWallet") as string,
      eployeeRole: formData.get("eployeeRole") as string,
      employeeDepartment: formData.get("employeeDepartment") as string,
      eployeePaymentFrequency: formData.get("eployeePaymentFrequency") as string,
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
            <FieldLabel htmlFor="employeeId">Employee ID *</FieldLabel>
            <Input
              id="employeeId"
              name="employeeId"
              required
              defaultValue={employee.employeeId}
              className="bg-transparent border-white/20 text-white"
              readOnly
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="employeeName">Employee Name *</FieldLabel>
            <Input
              id="employeeName"
              name="employeeName"
              required
              defaultValue={employee.employeeName}
              className="bg-transparent border-white/20 text-white"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="eployeeSalary">Salary *</FieldLabel>
            <Input
              id="eployeeSalary"
              name="eployeeSalary"
              type="number"
              required
              defaultValue={employee.eployeeSalary}
              className="bg-transparent border-white/20 text-white"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="employeeWallet">Wallet Address *</FieldLabel>
            <Input
              id="employeeWallet"
              name="employeeWallet"
              required
              defaultValue={employee.employeeWallet}
              className="bg-transparent border-white/20 text-white"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="eployeeRole">Role *</FieldLabel>
            <Input
              id="eployeeRole"
              name="eployeeRole"
              required
              defaultValue={employee.eployeeRole}
              className="bg-transparent border-white/20 text-white"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="employeeDepartment">Department *</FieldLabel>
            <Input
              id="employeeDepartment"
              name="employeeDepartment"
              required
              defaultValue={employee.employeeDepartment}
              className="bg-transparent border-white/20 text-white"
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
              defaultValue={employee.eployeePaymentFrequency}
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
