"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = ["Solutions", "Ecosystem", "Security"];

export function Navbar() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleWalletClick = () => {
    if (connected) disconnect();
    else setVisible(true);
  };

  const walletLabel = connected && publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "Connect Wallet";

  return (
    <nav className="w-full bg-black sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-white tracking-widest">AUDLY</div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleWalletClick}
            className="border border-cyan-400 text-cyan-400 px-5 py-2 text-sm font-medium rounded-sm hover:bg-cyan-400/10 transition-all duration-200 cursor-pointer"
            aria-label={walletLabel}
          >
            {walletLabel}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/80 hover:text-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 pb-6 pt-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <button
            onClick={handleWalletClick}
            className="border border-cyan-400 text-cyan-400 px-5 py-2 text-sm font-medium rounded-sm hover:bg-cyan-400/10 transition-all duration-200 mt-2 w-full"
          >
            {walletLabel}
          </button>
        </div>
      )}
    </nav>
  );
}
