"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";

export function AdminPubkeyInput() {
  const [adminPubkey, setAdminPubkey] = React.useState("");
  const [savedPubkey, setSavedPubkey] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const stored = localStorage.getItem("adminPubkey");
    if (stored) {
      setSavedPubkey(stored);
    }
  }, []);

  const handleSave = () => {
    setError("");
    
    if (!adminPubkey.trim()) {
      setError("Please enter an admin wallet address");
      return;
    }

    try {
      // Validate if it's a valid Solana public key
      new PublicKey(adminPubkey.trim());
      localStorage.setItem("adminPubkey", adminPubkey.trim());
      setSavedPubkey(adminPubkey.trim());
      setAdminPubkey("");
      setError("");
    } catch (err) {
      setError("Invalid wallet address format");
    }
  };

  const handleClear = () => {
    localStorage.removeItem("adminPubkey");
    setSavedPubkey(null);
    setAdminPubkey("");
    setError("");
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="border border-white/20 p-6 rounded-xl bg-white/5">
        <h2 className="text-aerospace text-white text-lg font-bold mb-4">
          ADMIN WALLET SETUP
        </h2>
        <p className="text-aerospace text-white/70 text-body mb-4">
          Enter your company admin's wallet address to view your payroll details.
        </p>

        {savedPubkey ? (
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-aerospace text-white/50 text-label">
                SAVED ADMIN WALLET
              </label>
              <p className="text-aerospace text-white text-md break-all bg-white/5 p-3 rounded-md">
                {savedPubkey}
              </p>
            </div>
            <button
              onClick={handleClear}
              className="text-body font-bold text-aerospace-nav text-white bg-red-600/20 border border-red-600/50 rounded-[32px] px-[18px] py-[11px] hover:bg-red-600/30 transition-all"
            >
              CHANGE ADMIN WALLET
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-aerospace text-white/70 text-body">
                ADMIN WALLET ADDRESS
              </label>
              <input
                value={adminPubkey}
                onChange={(e) => setAdminPubkey(e.target.value)}
                className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace text-body"
                placeholder="E.G. 5VuMUWoowHHFVwvnAPiS1nRd9vmdEFaVHwoy944b3KPC"
              />
              {error && (
                <p className="text-red-400 text-sm text-aerospace">{error}</p>
              )}
            </div>
            <button
              onClick={handleSave}
              className="text-body font-bold text-aerospace-nav text-white bg-ghost border border-ghost-border rounded-[32px] px-[18px] py-[11px] hover:bg-white/20 hover:text-white-100 transition-all"
            >
              SAVE ADMIN WALLET
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
