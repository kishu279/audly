"use client";

import { Bell, Monitor, Settings, Search } from "lucide-react";

export function TopNavbar() {
  return (
    <header
      className="w-full flex items-center justify-between px-8 h-[87px] shrink-0 sticky top-0 z-40 border-b border-white/10"
      style={{ background: "rgba(9, 9, 11, 0.80)", backdropFilter: "blur(12px)" }}
    >
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-6">
        <span
          className="text-[20px] font-bold uppercase tracking-[-0.05em] select-none"
          style={{ color: "#d946ef", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          SPLIT_PROTOCOL
        </span>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-sm border border-white/[0.05]"
          style={{ background: "rgba(255,255,255,0.05)", minWidth: 244 }}
        >
          <Search className="w-[10px] h-[10px] shrink-0" style={{ color: "#71717a" }} />
          <span
            className="text-[10px] tracking-[0.12em] uppercase"
            style={{ color: "#52525b", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SEARCH_SYSTEM...
          </span>
        </div>
      </div>

      {/* Right: icons + connect button */}
      <div className="flex items-center gap-6">
        <button
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
        </button>
        <button
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Display"
        >
          <Monitor className="w-[20px] h-[16px]" />
        </button>
        <button
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-[20px] h-[20px]" />
        </button>

        <button
          className="px-4 py-[7px] rounded-full text-white text-[10px] tracking-[0.05em] uppercase font-normal border border-[#d946ef] hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Inter', sans-serif" }}
          aria-label="Connect wallet"
        >
          CONNECT
        </button>
      </div>
    </header>
  );
}
