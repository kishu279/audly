"use client";

import { Bell, Monitor, Settings, Search } from "lucide-react";
import { motion } from "framer-motion";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { FeatureComingSoonTooltip } from "@/components/ui/FeatureComingSoonTooltip";
import { contractInteraction } from "@/lib/contract-interaction";
import { useState, useEffect } from "react";

export function TopNavbar() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [currentCluster, setCurrentCluster] = useState<string>("localnet");

  useEffect(() => {
    const checkCluster = () => {
      const clusterUrl = contractInteraction.getCurrentClusterUrl();
      if (clusterUrl.includes("127.0.0.1") || clusterUrl.includes("localhost")) {
        setCurrentCluster("localnet");
      } else if (clusterUrl.includes("devnet")) {
        setCurrentCluster("devnet");
      }
    };
    
    checkCluster();
    const interval = setInterval(checkCluster, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex items-center justify-between px-8 h-[87px] shrink-0 sticky top-0 z-40 border-b border-white/10"
      style={{
        background: "rgba(9, 9, 11, 0.80)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-6">
        <span
          className="text-[20px] font-bold uppercase tracking-[-0.05em] select-none"
          style={{
            color: "#d946ef",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          AUDDLY
        </span>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-sm border border-white/[0.05]"
          style={{ background: "rgba(255,255,255,0.05)", minWidth: 244 }}
        >
          <Search
            className="w-[14px] h-[14px] shrink-0"
            style={{ color: "#71717a" }}
          />
          <span
            className="text-[11px] tracking-[0.12em] uppercase"
            style={{
              color: "#52525b",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            SEARCH_SYSTEM...
          </span>
        </div>
      </div>

      {/* Right: icons + connect button */}
      <div className="flex items-center gap-6">
        {/* Cluster Indicator */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] border"
          style={{
            background:
              currentCluster === "devnet"
                ? "rgba(217,70,239,0.1)"
                : "rgba(255,255,255,0.05)",
            borderColor:
              currentCluster === "devnet"
                ? "rgba(217,70,239,0.3)"
                : "rgba(255,255,255,0.1)",
          }}
        >
          <span className="text-[16px]">🌐</span>
          <span
            className="text-[10px] uppercase tracking-[0.1em]"
            style={{
              color: currentCluster === "devnet" ? "#d946ef" : "#71717a",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {currentCluster}
          </span>
        </div>

        {/* <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="text-zinc-500 hover:text-zinc-200 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[22px] h-[22px]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="text-zinc-500 hover:text-zinc-200 transition-colors"
          aria-label="Display"
        >
          <Monitor className="w-[22px] h-[22px]" />
        </motion.button> */}

        <FeatureComingSoonTooltip>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 30 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
            aria-label="Settings"
            disabled
          >
            <Settings className="w-[22px] h-[22px]" />
          </motion.button>
        </FeatureComingSoonTooltip>

        <div
          className="flex items-center px-4 py-[7px] rounded-full text-white text-[10px] tracking-[0.05em] uppercase font-normal border border-[#d946ef] hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Inter', sans-serif" }}
          aria-label="Connect wallet"
        >
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
              variant="ghost"
              onClick={() => setVisible(true)}
              className="p-0 h-auto hover:bg-transparent"
            >
              CONNECT WALLET
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
