"use client";

import { Bot, ShieldCheck, Wallet, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    Icon: Bot,
    iconColor: "text-cyan-400",
    title: "Automated Smart Contract Payroll",
    description:
      "Deploy master vaults that enforce rigid payout schedules without manual intervention.",
  },
  {
    Icon: ShieldCheck,
    iconColor: "text-purple-400",
    title: "Trustless Vesting Engine",
    description:
      "Eligibility is calculated via unalterable on-chain mathematics, guaranteeing fair distribution.",
  },
  {
    Icon: Wallet,
    iconColor: "text-cyan-400",
    title: "Direct-to-Wallet Claims",
    description:
      "A secure pull-based payment model where users claim earned funds directly to self-custody.",
  },
  {
    Icon: EyeOff,
    iconColor: "text-purple-400",
    title: "ATA Abstraction",
    description:
      "Invisible Associated Token Account initialization for a seamless, frictionless user experience.",
  },
];

export function Features() {
  return (
    <section id="ecosystem" className="w-full bg-[#0a0a0a] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-100">Built for Scale, </span>
            <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
              Secured by Solana
            </span>
          </h2>
          <p className="text-gray-300 text-base max-w-lg mx-auto leading-relaxed">
            Enterprise-grade architecture for trustless, automated channel
            operations.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#111114] rounded-xl p-6 flex flex-col gap-5 border border-white/5 hover:border-white/10 hover:scale-[1.02] transition-all duration-300 group cursor-default"
            >
              <div
                className={`${f.iconColor} group-hover:scale-110 transition-transform duration-200`}
              >
                <f.Icon size={28} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-3 leading-snug">
                  {f.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
