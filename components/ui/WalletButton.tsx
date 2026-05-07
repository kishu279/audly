"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useCallback } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useWalletStore } from "@/stores/useWalletStore";

export function WalletButton() {
  const { publicKey, wallet, disconnect, connected, connecting } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const { notify } = useNotificationStore();
  const { balance, setBalance } = useWalletStore();

  // Fetch balance whenever wallet connects
  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (e) {
      console.error("Failed to fetch balance", e);
    }
  }, [publicKey, connection, setBalance]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      notify("success", "Wallet connected", publicKey.toBase58().slice(0, 8) + "...");
    }
  }, [connected, publicKey]);

  const handleDisconnect = async () => {
    await disconnect();
    setBalance(null);
    notify("info", "Wallet disconnected");
  };

  if (!connected) {
    return (
      <Button
        variant="ghost"
        onClick={() => setVisible(true)}
        disabled={connecting}
        className="h-auto px-4 py-2"
      >
        {connecting ? "CONNECTING..." : "CONNECT WALLET"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {balance !== null && (
        <span
          className="text-[11px] font-bold text-white/70 uppercase tracking-[1.17px] hidden sm:block"
        >
          {balance.toFixed(4)} SOL
        </span>
      )}
      <Button
        variant="ghost"
        onClick={handleDisconnect}
        title={publicKey?.toBase58()}
        className="h-auto px-4 py-2"
      >
        {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
      </Button>
    </div>
  );
}
