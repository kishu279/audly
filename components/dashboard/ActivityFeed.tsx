import { CreditCard, RefreshCw, UserPlus, Shield } from "lucide-react";

const activityItems = [
  {
    id: "1",
    icon: CreditCard,
    iconBg: "#e879f9",
    textParts: [
      { text: "Worker #084 was paid ", style: "pink" as const },
      { text: "$2,450.00", style: "amount" as const },
    ],
    meta: "2 MINS AGO // TXID: 0X93...A1",
  },
  {
    id: "2",
    icon: RefreshCw,
    iconBg: "#ffb59e",
    textParts: [
      { text: "System budget updated to ", style: "normal" as const },
      { text: "$1.2M", style: "amount" as const },
    ],
    meta: "45 MINS AGO // ADMIN: 0X01",
  },
  {
    id: "3",
    icon: UserPlus,
    iconBg: "#d0cc00",
    textParts: [
      { text: "New worker ", style: "normal" as const },
      { text: "Alex Rivera", style: "highlight" as const },
      { text: " onboarded", style: "normal" as const },
    ],
    meta: "3 HOURS AGO // ROLE: DEV",
  },
  {
    id: "4",
    icon: Shield,
    iconBg: "#3f3f46",
    textParts: [
      { text: "Governance vote passed: Split Logic v2.1", style: "normal" as const },
    ],
    meta: "YESTERDAY // QUORUM: 88%",
  },
];

const textPartStyle: Record<string, React.CSSProperties> = {
  pink: {
    color: "#e879f9",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
  },
  amount: {
    color: "#d4d4d8",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
  },
  normal: {
    color: "#d4d4d8",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
  },
  highlight: {
    color: "#e879f9",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
  },
};

export function ActivityFeed() {
  return (
    <div
      className="flex flex-col p-6 rounded-sm border h-full"
      style={{ background: "#121212", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <span
        className="text-[16px] leading-tight mb-6"
        style={{ color: "#e5e2e1", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Recent Activity
      </span>

      {/* Activity items */}
      <div className="flex flex-col gap-6 flex-1">
        {activityItems.map(({ id, icon: Icon, iconBg, textParts, meta }) => (
          <div key={id} className="flex items-start gap-4">
            {/* Icon badge */}
            <div
              className="w-8 h-8 shrink-0 rounded-sm flex items-center justify-center"
              style={{ background: `${iconBg}22` }}
            >
              <Icon className="w-3 h-3" style={{ color: iconBg }} />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 min-w-0">
              <p className="leading-snug" style={{ fontSize: 12 }}>
                {textParts.map((part, i) => (
                  <span key={i} style={textPartStyle[part.style]}>
                    {part.text}
                  </span>
                ))}
              </p>
              <span
                className="text-[10px] uppercase"
                style={{ color: "#52525b", fontFamily: "'Courier New', monospace" }}
              >
                {meta}
              </span>
            </div>
          </div>
        ))}

        {/* View full audit log */}
        <div className="pt-2 mt-auto flex justify-center">
          <button
            className="text-[10px] uppercase tracking-[0.1em] hover:text-zinc-300 transition-colors"
            style={{ color: "#71717a", fontFamily: "'Inter', sans-serif" }}
          >
            VIEW FULL AUDIT LOG
          </button>
        </div>
      </div>
    </div>
  );
}
