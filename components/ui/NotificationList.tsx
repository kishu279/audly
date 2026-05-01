"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const iconMap = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const colorMap = {
  success: "border-green-500/40 bg-green-500/10 text-green-400",
  error: "border-red-500/40 bg-red-500/10 text-red-400",
  info: "border-white/20 bg-white/5 text-white/80",
};

export function NotificationList() {
  const { notifications, dismiss } = useNotificationStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={cn(
            "flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm",
            "animate-in slide-in-from-right-5 fade-in duration-300",
            colorMap[n.type]
          )}
        >
          <span className="text-lg font-bold mt-0.5 shrink-0">{iconMap[n.type]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold uppercase tracking-[1.17px] leading-tight">
              {n.message}
            </p>
            {n.description && (
              <p className="text-[11px] uppercase tracking-[0.96px] mt-1 opacity-70">
                {n.description}
              </p>
            )}
          </div>
          <button
            onClick={() => dismiss(n.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
