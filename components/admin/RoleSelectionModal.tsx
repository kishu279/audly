"use client";

import { useAdminStore } from "@/stores/useAdminStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function RoleSelectionModal() {
  const { role, setRole } = useAdminStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (role === null) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [role]);

  // Prevent closing the modal by clicking outside
  const handleOpenChange = (newOpen: boolean) => {
    if (role !== null) {
      setOpen(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-black border border-white/20 rounded-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-aerospace text-white text-2xl font-bold mb-2">
            IDENTIFY YOUR ROLE
          </DialogTitle>
          <DialogDescription className="text-aerospace text-white/70 text-sm">
            PLEASE SELECT YOUR ROLE TO CONTINUE TO THE DASHBOARD. THIS ACTION WILL DETERMINE YOUR AVAILABLE FEATURES.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 mt-6">
          <Button
            variant="ghost_spacex"
            size="spacex_large"
            className="w-full justify-center"
            onClick={() => setRole("admin")}
          >
            I AM A COMPANY OWNER (ADMIN)
          </Button>
          <Button
            variant="ghost_spacex"
            size="spacex_large"
            className="w-full justify-center opacity-70 hover:opacity-100"
            onClick={() => setRole("worker")}
          >
            I AM A WORKER
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
