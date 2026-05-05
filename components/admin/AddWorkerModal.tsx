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
            <FieldLabel htmlFor="employeeAddress">Employee Address *</FieldLabel>
            <Input
              id="employeeAddress"
              name="employeeAddress"
              required
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. 5VuMUWoowHHFVwvnAPiS1nRd9vmdEFaVHwoy944b3KPC"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="amount">Amount (UI Format) *</FieldLabel>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="any"
              required
              min="0.000001"
              className="bg-transparent border-white/20 text-white"
              placeholder="e.g. 500 (not lamports)"
            />
            <p className="text-xs text-white/50 mt-1">
              Enter amount in UI format (e.g. 500 for 500 tokens, not lamports)
            </p>
          </Field>

          <Button type="submit" variant="ghost_spacex" size="spacex" className="mt-3">
            ADD WORKER
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
