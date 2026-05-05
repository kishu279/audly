import { Wallet, Clock, Landmark, Users, TrendingUp, Target, BadgeCheck } from "lucide-react";
import { KPIMetric } from "./mockData";

const iconMap = {
  wallet: Wallet,
  clock: Clock,
  landmark: Landmark,
  users: Users,
};

const changeIconMap = {
  "trending-up": TrendingUp,
  target: Target,
  clock: Clock,
  check: BadgeCheck,
};

const valueStyles: Record<KPIMetric["valueStyle"], React.CSSProperties> = {
  pink: { color: "#ffd7f2", fontFamily: "'Space Grotesk', sans-serif" },
  peach: { color: "#ffb59e", fontFamily: "'Space Grotesk', sans-serif" },
  yellow: { color: "#ede900", fontFamily: "'Space Grotesk', sans-serif" },
  gradient: {
    background: "linear-gradient(97.68deg, #FF571A 0.13%, #FD25EA 100.11%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontFamily: "'Space Grotesk', sans-serif",
  },
};

interface KPICardProps {
  metric: KPIMetric;
}

export function KPICard({ metric }: KPICardProps) {
  const KpiIcon = iconMap[metric.iconType];
  const ChangeIcon = changeIconMap[metric.changeIcon];

  return (
    <div
      className="flex flex-col gap-4 p-6 rounded-sm border"
      style={{ background: "#121212", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {/* Label row */}
      <div className="flex items-start justify-between">
        <span
          className="text-[10px] uppercase tracking-[0.1em] leading-none"
          style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}
        >
          {metric.label}
        </span>
        <KpiIcon
          className="w-[18px] h-[16px] shrink-0"
          style={{ color: "#3f3f46" }}
        />
      </div>

      {/* Value + change */}
      <div className="flex flex-col gap-1">
        <span className="text-[16px] tracking-[-0.40px] leading-none" style={valueStyles[metric.valueStyle]}>
          {metric.value}
        </span>

        <div className="flex items-center gap-1.5 mt-1">
          <ChangeIcon
            className="w-[10px] h-[10px] shrink-0"
            style={{ color: metric.changeColor }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.05em]"
            style={{
              color: metric.changeColor,
              fontFamily: "'Courier New', monospace",
            }}
          >
            {metric.change}
          </span>
        </div>
      </div>
    </div>
  );
}
