"use client";

import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Hero() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleGetStarted = () => {
    if (connected) {
      router.push("/dashboard");
    } else {
      setShowModal(true);
    }
  };

  const handleConnectWallet = () => {
    setShowModal(false);
    setVisible(true);
  };
  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] bg-gradient-to-br from-neutral-200 via-neutral-100 to-slate-200 overflow-hidden">
      {/* Subtle tint blobs */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-purple-200/30 via-blue-100/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-tr from-cyan-200/20 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-8 min-h-[calc(100vh-64px)]">
        {/* Left: text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center max-w-xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            <span className="text-neutral-500">Automate</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-500 to-cyan-400 bg-clip-text text-transparent">
              Revenue
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Distribution
            </span>
          </h1>

          <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-10 max-w-md">
            Programmable payroll and instant product splits on-chain. Build
            transparent, immutable channel flows for your decentralized
            organization.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleGetStarted}
              className="px-7 py-3 text-sm font-semibold text-white rounded-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/30 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </motion.div>

        {/* Right: 3D cube image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center md:justify-end items-center w-full md:w-auto"
        >
          <div className="relative w-full max-w-[580px] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10">
            <img
              src="https://images.unsplash.com/photo-1684395646154-19832d6265b3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHwzRCUyMGlzb21ldHJpYyUyMGJsb2NrY2hhaW4lMjBjdWJlJTIwbmV0d29yayUyMGdsb3dpbmclMjBjeWFuJTIwcHVycGxlJTIwbm9kZXMlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwwfDJ8fHwxNzc4MDcyMDYxfDA&ixlib=rb-4.1.0&q=85"
              alt="3D blockchain network visualization — LekoArts on Unsplash"
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient overlay to blend with page */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/10 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Connect Wallet Required</DialogTitle>
            <DialogDescription>
              Please connect your wallet to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-neutral-700 rounded-sm border border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConnectWallet}
              className="px-4 py-2 text-sm font-semibold text-white rounded-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Connect Wallet
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
