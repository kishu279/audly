"use client";

import { useAdminStore } from "@/stores/useAdminStore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const itemVariants = {
  hidden: { x: -14, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.06, duration: 0.35, ease: EASE },
  }),
};

export function DashboardDemo1Sidebar() {
  const { activeTab, setActiveTab } = useAdminStore();
  const [updatePaymentOpen, setUpdatePaymentOpen] = useState(false);

  return (
    <motion.div
      initial={{ x: -32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Sidebar
        collapsible="none"
        className="border-r border-[rgba(255,255,255,0.08)] bg-[#000000] w-64 min-h-screen"
      >
        <SidebarContent className="bg-[#000000]">
          {/* Panel heading */}
          <div className="px-5 pt-6 pb-4">
            <h2
              className="text-[20px] font-bold text-[#d946ef] uppercase tracking-[-0.05em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ADMIN PANEL
            </h2>
          </div>

          <SidebarGroup className="pt-1">
            <SidebarGroupLabel
              className="text-[#71717a] text-[10px] uppercase tracking-[0.1em] px-3 mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              MANAGEMENT
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[
                  { label: "VIEW", tab: "view" },
                  { label: "COMPANY DETAILS", tab: "company_details" },
                  { label: "DEPOSIT", tab: "deposit" },
                ].map(({ label, tab }, i) => (
                  <motion.div
                    key={tab}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`text-[12px] uppercase transition-colors rounded-[2px] ${
                          activeTab === tab
                            ? "bg-[rgba(255,255,255,0.05)] text-[#d946ef]"
                            : "text-[#d4d4d8] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#d4d4d8]"
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}

                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setUpdatePaymentOpen(!updatePaymentOpen)}
                      className="text-[12px] uppercase text-[#d4d4d8] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#d4d4d8] transition-colors justify-between w-full flex rounded-[2px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <span>UPDATE PAYMENT DETAILS</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${updatePaymentOpen ? "rotate-90" : ""}`}
                      />
                    </SidebarMenuButton>
                    {updatePaymentOpen && (
                      <SidebarMenuSub className="border-l border-[rgba(255,255,255,0.08)] ml-3">
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            isActive={activeTab === "add_workers"}
                            onClick={() => setActiveTab("add_workers")}
                            className={`text-[11px] uppercase transition-colors rounded-[2px] mb-1 ${
                              activeTab === "add_workers"
                                ? "bg-[rgba(255,255,255,0.05)] text-[#d946ef]"
                                : "text-[#71717a] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#d4d4d8]"
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            ADD WORKERS
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            isActive={activeTab === "update_worker_details"}
                            onClick={() =>
                              setActiveTab("update_worker_details")
                            }
                            className={`text-[11px] uppercase transition-colors rounded-[2px] ${
                              activeTab === "update_worker_details"
                                ? "bg-[rgba(255,255,255,0.05)] text-[#d946ef]"
                                : "text-[#71717a] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#d4d4d8]"
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            UPDATE WORKER DETAILS
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="pt-3">
            <SidebarGroupLabel
              className="text-[#71717a] text-[10px] uppercase tracking-[0.1em] px-3 mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              TRANSACTIONS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[
                  {
                    label: "PAYMENT STATUS",
                    tab: "payment_status",
                    danger: false,
                  },
                  {
                    label: "CANCEL PAYMENT",
                    tab: "cancel_payment",
                    danger: true,
                  },
                ].map(({ label, tab, danger }, i) => (
                  <motion.div
                    key={tab}
                    custom={4 + i}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={
                          danger
                            ? `text-[12px] uppercase transition-colors rounded-[2px] ${
                                activeTab === tab
                                  ? "bg-[rgba(239,68,68,0.15)] text-[#ef4444]"
                                  : "text-[#f87171] hover:bg-[rgba(239,68,68,0.1)]"
                              }`
                            : `text-[12px] uppercase transition-colors rounded-[2px] ${
                                activeTab === tab
                                  ? "bg-[rgba(255,255,255,0.05)] text-[#d946ef]"
                                  : "text-[#d4d4d8] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#d4d4d8]"
                              }`
                        }
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </motion.div>
  );
}
