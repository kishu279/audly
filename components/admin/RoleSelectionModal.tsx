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
import { PublicKey } from "@solana/web3.js";

export function RoleSelectionModal() {
  const { role, setRole } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminWallet, setAdminWallet] = useState("");
  const [error, setError] = useState("");

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

  const handleWorkerSelection = () => {
    setShowAdminInput(true);
  };

  const handleAdminWalletSubmit = () => {
    setError("");
    
    if (!adminWallet.trim()) {
      setError("Please enter admin wallet address");
      return;
    }

    try {
      new PublicKey(adminWallet.trim());
      localStorage.setItem("adminPubkey", adminWallet.trim());
      setRole("worker");
      setShowAdminInput(false);
      setAdminWallet("");
    } catch (err) {
      setError("Invalid Solana wallet address");
    }
  };

  const handleBack = () => {
    setShowAdminInput(false);
    setAdminWallet("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-black border border-white/20 rounded-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-aerospace text-white text-2xl font-bold mb-2">
            {showAdminInput ? "ENTER ADMIN WALLET" : "IDENTIFY YOUR ROLE"}
          </DialogTitle>
          <DialogDescription className="text-aerospace text-white/70 text-sm">
            {showAdminInput 
              ? "PLEASE ENTER YOUR COMPANY ADMIN'S WALLET ADDRESS TO ACCESS YOUR PAYROLL DATA."
              : "PLEASE SELECT YOUR ROLE TO CONTINUE TO THE DASHBOARD. THIS ACTION WILL DETERMINE YOUR AVAILABLE FEATURES."
            }
          </DialogDescription>
        </DialogHeader>
        
        {!showAdminInput ? (
          <div className="flex flex-col gap-4 mt-6">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-center"
              onClick={() => setRole("admin")}
            >
              I AM A COMPANY OWNER (ADMIN)
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-center opacity-70 hover:opacity-100"
              onClick={handleWorkerSelection}
            >
              I AM A WORKER
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-2">
              <label className="text-aerospace text-white/70 text-sm">
                ADMIN WALLET ADDRESS
              </label>
              <input
                type="text"
                value={adminWallet}
                onChange={(e) => setAdminWallet(e.target.value)}
                placeholder="E.G. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace text-sm"
              />
              {error && (
                <p className="text-red-400 text-xs text-aerospace">{error}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="lg"
                className="flex-1 justify-center opacity-70 hover:opacity-100"
                onClick={handleBack}
              >
                BACK
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="flex-1 justify-center"
                onClick={handleAdminWalletSubmit}
              >
                CONTINUE
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
