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

export function DashboardSidebar() {
  const { activeTab, setActiveTab } = useAdminStore();
  const [updatePaymentOpen, setUpdatePaymentOpen] = useState(false);

  return (
    <Sidebar collapsible="none" className="border-r border-white/10 bg-black w-64 min-h-screen">
      <SidebarContent className="bg-black">
        {/* Panel heading */}
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-sidebar-title font-bold text-aerospace text-white tracking-[var(--tracking-aerospace)]">
            ADMIN PANEL
          </h2>
        </div>

        <SidebarGroup className="pt-1">
          <SidebarGroupLabel className="text-aerospace text-white/40 text-label px-3 mb-1">
            MANAGEMENT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "company_details"}
                  onClick={() => setActiveTab("company_details")}
                  className={`text-aerospace-nav text-body hover:bg-white/10 hover:text-white transition-colors ${
                    activeTab === "company_details" ? "bg-white/10 text-white" : "text-white/70"
                  }`}
                >
                  ADD COMPANY DETAILS
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setUpdatePaymentOpen(!updatePaymentOpen)}
                  className="text-aerospace-nav text-body text-white/70 hover:bg-white/10 hover:text-white transition-colors justify-between w-full flex"
                >
                  <span>UPDATE PAYMENT DETAILS</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${updatePaymentOpen ? "rotate-90" : ""}`}
                  />
                </SidebarMenuButton>
                {updatePaymentOpen && (
                  <SidebarMenuSub className="border-l border-white/20 ml-3">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeTab === "add_workers"}
                        onClick={() => setActiveTab("add_workers")}
                        className={`text-aerospace-nav text-sublabel hover:bg-white/10 hover:text-white transition-colors ${
                          activeTab === "add_workers" ? "bg-white/10 text-white" : "text-white/50"
                        }`}
                      >
                        ADD WORKERS
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeTab === "update_worker_details"}
                        onClick={() => setActiveTab("update_worker_details")}
                        className={`text-aerospace-nav text-sublabel hover:bg-white/10 hover:text-white transition-colors ${
                          activeTab === "update_worker_details" ? "bg-white/10 text-white" : "text-white/50"
                        }`}
                      >
                        UPDATE WORKER DETAILS
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "salary_status"}
                  onClick={() => setActiveTab("salary_status")}
                  className={`text-aerospace-nav text-body hover:bg-white/10 hover:text-white transition-colors ${
                    activeTab === "salary_status" ? "bg-white/10 text-white" : "text-white/70"
                  }`}
                >
                  SALARY STATUS
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-3">
          <SidebarGroupLabel className="text-aerospace text-white/40 text-label px-3 mb-1">
            TRANSACTIONS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "payment_status"}
                  onClick={() => setActiveTab("payment_status")}
                  className={`text-aerospace-nav text-body hover:bg-white/10 hover:text-white transition-colors ${
                    activeTab === "payment_status" ? "bg-white/10 text-white" : "text-white/70"
                  }`}
                >
                  PAYMENT STATUS
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "cancel_payment"}
                  onClick={() => setActiveTab("cancel_payment")}
                  className={`text-aerospace-nav text-body hover:bg-red-500/20 hover:text-red-400 transition-colors ${
                    activeTab === "cancel_payment" ? "bg-red-500/20 text-red-400" : "text-white/70"
                  }`}
                >
                  CANCEL PAYMENT
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
