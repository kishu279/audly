"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <nav className="fixed top-0 w-full z-50 py-6 px-8 backdrop:blur-md bg-black/30 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-aerospace-nav text-white">
          Audly
        </div>

        <div className="flex items-center">
          {connected && publicKey ? (
            <button
              onClick={() => disconnect()}
              className="text-[13px] font-bold text-aerospace-nav text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Click to disconnect"
            >
              {publicKey.toBase58().slice(0, 4)}...
              {publicKey.toBase58().slice(-4)}
            </button>
          ) : (
            <Button
              variant="ghost_spacex"
              size="spacex"
              onClick={() => setVisible(true)}
            >
              CONNECT WALLET
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
