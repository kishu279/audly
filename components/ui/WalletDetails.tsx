"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/stores/useWalletStore";

export function WalletDetails() {
  const { publicKey, wallet, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { balance, network } = useWalletStore();

  if (!connected || !publicKey) {
    return (
      <Button
        variant="link_spacex"
        size="none"
        onClick={() => setVisible(true)}
      >
        WALLET DETAILS
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-[1.17px] text-white/50">
        {network.toUpperCase()}
      </span>
      <span className="text-white/30">·</span>
      <Button variant="link_spacex" size="none" onClick={() => setVisible(true)}>
        {balance !== null ? `${balance.toFixed(4)} SOL` : "WALLET DETAILS"}
      </Button>
    </div>
  );
}
