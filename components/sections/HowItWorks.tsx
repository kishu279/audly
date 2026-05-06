"use client";

import {
  LayoutGrid,
  UserPlus,
  ArrowDownToLine,
  Timer,
  LogIn,
  BarChart2,
  ClipboardCheck,
  Wallet,
  Lock,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

const adminSteps = [
  {
    number: "1.",
    title: "Initialize Payroll",
    description:
      "Admin connects Solana wallet, sets total amount, token, and frequency.",
    Icon: LayoutGrid,
  },
  {
    number: "2.",
    title: "Add Employees",
    description: "Admin enters wallet addresses and salary amounts.",
    Icon: UserPlus,
  },
  {
    number: "3.",
    title: "Deposit Funds",
    description: "Tokens are moved into the secure smart contract Vault.",
    Icon: ArrowDownToLine,
  },
  {
    number: "4.",
    title: "Start Payroll",
    description: "Admin initiates the timer for vesting calculations.",
    Icon: Timer,
  },
];

const employeeSteps = [
  {
    number: "1.",
    title: "Connect & View",
    description: "Employee connects wallet and enters Admin public key.",
    Icon: LogIn,
  },
  {
    number: "2.",
    title: "Check Details",
    description: "Fetches on-chain salary, frequency, and token data.",
    Icon: BarChart2,
  },
  {
    number: "3.",
    title: "Verify Eligibility",
    description: "System compares current time vs. startTime and frequency.",
    Icon: ClipboardCheck,
  },
  {
    number: "4.",
    title: "Claim Payment",
    description: "Employee claims vested tokens directly to their wallet.",
    Icon: Wallet,
  },
];

export function HowItWorks() {
  return (
    <section
      id="solutions"
      className="relative w-full bg-[#0a0a0a] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-100">The Audly Flow: </span>
            <span className="text-purple-500">How it Works</span>
          </h2>
          <p className="text-gray-300 text-base max-w-lg mx-auto leading-relaxed">
            Seamlessly configure payroll on-chain and empower employees with
            instant access to vested funds.
          </p>
        </motion.div>

        {/* Phase labels */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between mb-6 px-4"
        >
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
            <Lock size={14} />
            <span>Phase 1: Admin Setup</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
            <span>Phase 2: Employee Experience</span>
            <User size={14} />
          </div>
        </motion.div>

        {/* Two-column steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {/* Admin column */}
          <div className="flex flex-col gap-4">
            {adminSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-stretch"
              >
                {/* Cyan dot marker */}
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400/70 shadow-[0_0_8px_2px_rgba(34,211,238,0.4)] hidden md:block" />
                <div className="flex-1 bg-[#111114] rounded-xl p-5 flex items-start gap-4 border border-white/5 hover:border-cyan-400/20 transition-all duration-300 hover:scale-[1.01] group">
                  <div className="mt-0.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <step.Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {step.number} {step.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Employee column */}
          <div className="flex flex-col gap-4">
            {employeeSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-stretch"
              >
                <div className="flex-1 bg-[#111114] rounded-xl p-5 flex flex-col border border-white/5 hover:border-purple-400/20 transition-all duration-300 hover:scale-[1.01] group">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm">
                      {step.number} {step.title}
                    </h3>
                    <div className="text-purple-400 group-hover:scale-110 transition-transform duration-200">
                      <step.Icon size={18} />
                    </div>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>
                {/* Purple dot marker */}
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-400/70 shadow-[0_0_8px_2px_rgba(168,85,247,0.4)] hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
