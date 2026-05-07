"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface FeatureComingSoonTooltipProps {
  children: React.ReactNode;
}

export function FeatureComingSoonTooltip({
  children,
}: FeatureComingSoonTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="bg-[#121212] border-[rgba(255,255,255,0.08)] text-[#e5e2e1] rounded-[2px] p-4 max-w-xs shadow-xl"
          sideOffset={5}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[2px] bg-[rgba(217,70,239,0.15)]">
              <Info className="w-4 h-4" style={{ color: "#d946ef" }} />
            </div>
            <div className="flex flex-col gap-1">
              <h4
                className="text-[14px] font-semibold uppercase tracking-[-0.4px]"
                style={{
                  color: "#d946ef",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                COMING SOON
              </h4>
              <p
                className="text-[12px] leading-relaxed"
                style={{
                  color: "#71717a",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                This feature is not available in v0.1. It will be included in
                the v1.0 release.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
