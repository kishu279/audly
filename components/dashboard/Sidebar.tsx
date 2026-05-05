"use client";

import { useState } from "react";
import { Terminal, LayoutGrid, GitBranch, Landmark, Building2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "projects", label: "Projects", icon: LayoutGrid },
  { id: "split_logic", label: "Split_Logic", icon: GitBranch },
  { id: "treasury", label: "Treasury", icon: Landmark },
  { id: "governance", label: "Governance", icon: Building2 },
];

export function Sidebar() {
  const [active, setActive] = useState("terminal");

  return (
    <aside
      className="w-64 shrink-0 flex flex-col h-full border-r"
      style={{ background: "#09090b", borderColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Header: Dashboard label + session */}
      <div className="px-6 pt-6 pb-5 flex flex-col gap-1">
        <span
          className="text-[18px] font-black tracking-[-0.35px] leading-tight"
          style={{ color: "#d946ef", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          DASHBOARD_V1
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.1em]"
          style={{ color: "#52525b", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ACTIVE SESSION: 0X29...F3
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-[13px] rounded-sm text-left transition-colors",
                isActive
                  ? "border-l-2 border-[#d946ef]"
                  : "border-l-2 border-transparent hover:bg-white/5"
              )}
              style={
                isActive
                  ? { background: "rgba(217,70,239,0.05)" }
                  : {}
              }
            >
              <Icon
                className="w-[18px] h-[18px] shrink-0"
                style={{ color: isActive ? "#d946ef" : "#71717a" }}
              />
              <span
                className="text-[14px] tracking-[-0.35px]"
                style={{
                  color: isActive ? "#d946ef" : "#71717a",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Node status box at bottom */}
      <div className="mx-6 mb-6 p-3 rounded-sm border border-dashed border-[#27272a] flex flex-col gap-2">
        <span
          className="text-[10px] uppercase tracking-[-0.35px]"
          style={{ color: "#71717a", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          NODE STATUS
        </span>
        <div className="flex items-center gap-2">
          <span
            className="w-[6px] h-[6px] rounded-full shrink-0"
            style={{
              background: "#d946ef",
              boxShadow: "0px 0px 8px rgba(253, 37, 234, 0.60)",
            }}
          />
          <span
            className="text-[12px] tracking-[-0.60px]"
            style={{ color: "#d4d4d8", fontFamily: "'Courier New', monospace" }}
          >
            CONNECTED // US-EAST-1
          </span>
        </div>
      </div>
    </aside>
  );
}
