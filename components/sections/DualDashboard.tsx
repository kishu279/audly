import { Shield, User, CheckCircle2 } from "lucide-react";

const adminFeatures = [
  {
    title: "Worker Tracking",
    description:
      "Manage entire rosters, update salaries, and monitor organizational payroll health.",
  },
  {
    title: "Vault Funding",
    description:
      "Securely deposit and allocate treasury funds into protocol-managed smart contracts.",
  },
  {
    title: "Timer Controls",
    description:
      "Precise granular control over vesting schedules and epoch initializations.",
  },
];

const workerFeatures = [
  {
    title: "Salary Status",
    description:
      "Real-time visibility into total compensation, vested amounts, and pending streams.",
  },
  {
    title: "Eligibility Tracking",
    description:
      "Mathematical certainty on exactly when the next claim cycle unlocks.",
  },
  {
    title: "One-Click Claims",
    description:
      "Frictionless withdrawal of available funds directly to self-custodial wallets.",
  },
];

/* ─── Mini bar chart (decorative) ─── */
function BarChartMock() {
  const bars = [
    { h: 30, color: "#374151" },
    { h: 45, color: "#4b5563" },
    { h: 65, color: "#60a5fa" },
    { h: 80, color: "#93c5fd" },
    { h: 100, color: "#22d3ee" },
  ];
  return (
    <div className="w-full h-28 flex items-end gap-3 px-4 pb-2">
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-300"
          style={{ height: `${b.h}%`, backgroundColor: b.color }}
        />
      ))}
    </div>
  );
}

/* ─── Donut / ring chart (decorative) ─── */
function DonutChart({ percent = 75 }: { percent?: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center justify-center w-full py-2">
      <div className="relative w-36 h-36">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
          aria-label={`${percent}% vested`}
        >
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#9333ea"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-2xl font-bold leading-none">{percent}%</span>
          <span className="text-white/40 text-xs tracking-widest mt-1">VESTED</span>
        </div>
      </div>
    </div>
  );
}

export function DualDashboard() {
  return (
    <section id="docs" className="w-full bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-300">Transparent </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dual-Dashboard
            </span>
          </h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed">
            Purpose-built interfaces for both organizational management and
            individual empowerment.
          </p>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Dashboard */}
          <div className="bg-[#0d1020] rounded-2xl border border-cyan-400/20 overflow-hidden flex flex-col shadow-lg shadow-cyan-500/5 hover:border-cyan-400/35 transition-all duration-300">
            {/* Header */}
            <div className="px-7 pt-7 pb-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-cyan-400">
                  <Shield size={22} />
                </div>
                <h3 className="text-white text-xl font-bold">Admin Dashboard</h3>
              </div>

              {/* Feature list */}
              <div className="flex flex-col gap-5">
                {adminFeatures.map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-semibold">{f.title}</p>
                      <p className="text-white/40 text-xs leading-relaxed mt-0.5">
                        {f.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart area */}
            <div className="mt-auto mx-5 mb-5 bg-black/40 rounded-xl border border-white/5 pt-4">
              <BarChartMock />
            </div>
          </div>

          {/* Worker Dashboard */}
          <div className="bg-[#0d1020] rounded-2xl border border-purple-500/20 overflow-hidden flex flex-col shadow-lg shadow-purple-500/5 hover:border-purple-500/35 transition-all duration-300">
            {/* Header */}
            <div className="px-7 pt-7 pb-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-purple-400">
                  <User size={22} />
                </div>
                <h3 className="text-white text-xl font-bold">Worker Dashboard</h3>
              </div>

              {/* Feature list */}
              <div className="flex flex-col gap-5">
                {workerFeatures.map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-semibold">{f.title}</p>
                      <p className="text-white/40 text-xs leading-relaxed mt-0.5">
                        {f.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut chart area */}
            <div className="mt-auto mx-5 mb-5 bg-black/40 rounded-xl border border-white/5 py-4 flex items-center justify-center">
              <DonutChart percent={75} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
