"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { chartData, TimeFrame } from "./mockData";

const TIMEFRAMES: TimeFrame[] = ["1W", "1M", "1Y"];

const X_LABELS: Record<TimeFrame, string[]> = {
  "1M": ["01 MAY", "08 MAY", "15 MAY", "22 MAY", "31 MAY"],
  "1W": ["MON", "TUE", "WED", "THU", "FRI"],
  "1Y": ["JAN", "APR", "JUL", "OCT", "DEC"],
};

/** Catmull-Rom to cubic bezier — produces smooth SVG path */
function buildSmoothPath(
  points: { x: number; y: number }[],
  w: number,
  h: number,
  padding: number = 0
): string {
  if (points.length < 2) return "";
  const scaled = points.map((p) => ({
    x: p.x * (w - padding * 2) + padding,
    y: p.y * (h - padding * 2) + padding,
  }));

  let d = `M ${scaled[0].x.toFixed(2)} ${scaled[0].y.toFixed(2)}`;

  for (let i = 0; i < scaled.length - 1; i++) {
    const p0 = scaled[Math.max(0, i - 1)];
    const p1 = scaled[i];
    const p2 = scaled[i + 1];
    const p3 = scaled[Math.min(scaled.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}

function buildFillPath(
  points: { x: number; y: number }[],
  w: number,
  h: number,
  padding: number = 0
): string {
  const linePath = buildSmoothPath(points, w, h, padding);
  const scaled = points.map((p) => ({
    x: p.x * (w - padding * 2) + padding,
    y: p.y * (h - padding * 2) + padding,
  }));
  const last = scaled[scaled.length - 1];
  const first = scaled[0];
  return `${linePath} L ${last.x.toFixed(2)} ${h} L ${first.x.toFixed(2)} ${h} Z`;
}

export function AnalyticsChart() {
  const [activeFrame, setActiveFrame] = useState<TimeFrame>("1M");

  const W = 600;
  const H = 200;

  const data = chartData[activeFrame];
  const linePath = useMemo(() => buildSmoothPath(data, W, H, 4), [data]);
  const fillPath = useMemo(() => buildFillPath(data, W, H, 4), [data]);

  return (
    <div
      className="flex flex-col gap-8 p-6 rounded-sm border h-full"
      style={{ background: "#121212", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span
            className="text-[16px] leading-tight"
            style={{ color: "#e5e2e1", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Payment Analytics
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.1em]"
            style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}
          >
            SPENDING TRENDS // 30 DAY WINDOW
          </span>
        </div>

        {/* Timeframe toggles */}
        <div className="flex items-center gap-4">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveFrame(tf)}
              className="text-[10px] transition-colors"
              style={{
                color: activeFrame === tf ? "#e879f9" : "#a1a1aa",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="flex flex-col gap-3">
        <div className="w-full" style={{ height: 220 }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "100%", display: "block" }}
          >
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d946ef" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Fill area */}
            <path d={fillPath} fill="url(#chartFill)" />

            {/* Curve stroke */}
            <path
              d={linePath}
              fill="none"
              stroke="#d946ef"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between">
          {X_LABELS[activeFrame].map((label) => (
            <span
              key={label}
              className="text-[10px] uppercase"
              style={{ color: "#52525b", fontFamily: "'Courier New', monospace" }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
