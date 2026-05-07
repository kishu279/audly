"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Menu, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageCarouselModal } from "@/components/admin/ImageCarouselModal";

const NAV_LINKS = ["Solutions", "Ecosystem", "Security"];

export function Navbar() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const router = useRouter();

  const handleWalletClick = () => {
    if (connected) disconnect();
    else setVisible(true);
  };

  const walletLabel =
    connected && publicKey
      ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
      : "Connect Wallet";

  return (
    <nav className="w-full bg-black sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-white tracking-widest">
          AUDLY
        </div>

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
          <button
            onClick={() => router.push("/dashboard")}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
          >
            Dashboard
          </button>

          <button
            onClick={() => setShowCarousel(true)}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
          >
            <ImageIcon size={16} />
            Overview - how to use
          </button>
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
            onClick={() => {
              router.push("/dashboard");
              setMobileOpen(false);
            }}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors text-left"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setShowCarousel(true);
              setMobileOpen(false);
            }}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors text-left flex items-center gap-2"
          >
            <ImageIcon size={16} />
            Gallery
          </button>
          <button
            onClick={handleWalletClick}
            className="border border-cyan-400 text-cyan-400 px-5 py-2 text-sm font-medium rounded-sm hover:bg-cyan-400/10 transition-all duration-200 mt-2 w-full"
          >
            {walletLabel}
          </button>
        </div>
      )}

      <ImageCarouselModal
        open={showCarousel}
        onOpenChange={setShowCarousel}
        modalTitle="AUDLY GALLERY"
        modalDescription="Explore our platform features"
      />
    </nav>
  );
}
