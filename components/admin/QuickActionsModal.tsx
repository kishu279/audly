"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { contractInteraction } from "@/lib/contract-interaction";
import { useState, useEffect } from "react";

interface QuickActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickActionsModal({
  open,
  onOpenChange,
}: QuickActionsModalProps) {
  const [currentCluster, setCurrentCluster] = useState<string>("localnet");

  useEffect(() => {
    const clusterUrl = contractInteraction.getCurrentClusterUrl();
    if (clusterUrl.includes("127.0.0.1") || clusterUrl.includes("localhost")) {
      setCurrentCluster("localnet");
    } else if (clusterUrl.includes("devnet")) {
      setCurrentCluster("devnet");
    }
  }, [open]);

  const handleClusterSwitch = async () => {
    const newCluster = currentCluster === "localnet" ? "devnet" : "localnet";
    const newUrl =
      newCluster === "localnet"
        ? "http://127.0.0.1:8899"
        : "https://api.devnet.solana.com";

    await contractInteraction.changeClusterUrl(newUrl);
    setCurrentCluster(newCluster);
  };

  console.log("QuickActionsModal render - open:", open);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-[#121212] border-[rgba(255,255,255,0.08)] rounded-[2px] text-[#e5e2e1] max-w-xl"
        style={{ zIndex: 10000 }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-[20px] uppercase tracking-[-0.4px] text-[#e5e2e1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            DEBUGGER
          </DialogTitle>
          <DialogDescription
            className="text-[14px] text-[#71717a]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Select an action to perform on your payroll system.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleClusterSwitch}
            className="w-full px-4 py-3 rounded-[2px] text-[12px] uppercase bg-[rgba(217,70,239,0.1)] border border-[rgba(217,70,239,0.3)] text-[#d946ef] hover:bg-[rgba(217,70,239,0.15)] transition-colors text-left flex items-center justify-between"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[16px]">🌐</span>
              SWITCH CLUSTER
            </div>
            <span className="text-[10px] px-2 py-1 rounded-[2px] bg-[rgba(217,70,239,0.2)] border border-[rgba(217,70,239,0.4)]">
              {currentCluster.toUpperCase()}
            </span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("employees");
              localStorage.removeItem("companyDetails");
              window.location.reload();
            }}
            className="w-full px-4 py-3 rounded-[2px] text-[12px] uppercase bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#f87171] hover:bg-[rgba(239,68,68,0.15)] transition-colors text-left flex items-center gap-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span className="text-[16px]">🗑️</span>
            CLEAR DATA
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
