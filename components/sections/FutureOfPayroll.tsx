"use client";

import {
  AlertTriangle,
  ShieldX,
  Droplets,
  EyeOff,
  MoveRight,
} from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    Icon: AlertTriangle,
    label: "ADMINISTRATIVE BURDEN",
    oldWay: "Manual monthly transfers & spreadsheet tracking",
    solution: "One-time master vault funding & automated splits",
  },
  {
    Icon: ShieldX,
    label: "COUNTERPARTY RISK",
    oldWay: "Trusting employers with custody of earned wages",
    solution: "Transparent, verifiable smart contract guarantees",
  },
  {
    Icon: Droplets,
    label: "LIQUIDITY PROTECTION",
    oldWay: "Risk of prepayments and clawback complications",
    solution: "Mathematical vesting logic tied to time",
  },
  {
    Icon: EyeOff,
    label: "GLOBAL SETTLEMENTS",
    oldWay: "Slow international wires & high conversion fees",
    solution: "Instant Solana sub-second finality anywhere",
  },
];

export function FutureOfPayroll() {
  return (
    <section id="security" className="w-full bg-[#0a0a0a] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#111114] rounded-2xl px-8 md:px-14 py-14 md:py-16 border border-white/5"
        >
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Future of <span className="text-purple-400">Payroll</span>
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
              Solving traditional channel creation with web3 primitives.
            </p>
          </div>

          {/* 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {problems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-5"
              >
                {/* Red icon box */}
                <div className="shrink-0 w-12 h-12 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                  <item.Icon size={20} className="text-red-400" />
                </div>

                {/* Text content */}
                <div className="flex flex-col gap-2">
                  <span className="text-white/30 text-xs font-semibold tracking-widest uppercase">
                    {item.label}
                  </span>
                  <p className="text-white/25 text-sm line-through leading-relaxed">
                    {item.oldWay}
                  </p>
                  <div className="flex items-start gap-2">
                    <MoveRight
                      size={14}
                      className="text-cyan-400 mt-0.5 shrink-0"
                    />
                    <p className="text-cyan-300 text-sm leading-relaxed">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
