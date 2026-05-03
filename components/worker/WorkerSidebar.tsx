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
} from "@/components/ui/sidebar";

export function WorkerSidebar() {
  const { activeTab, setActiveTab } = useAdminStore();

  return (
    <Sidebar collapsible="none" className="border-r border-white/10 bg-black w-64 min-h-screen">
      <SidebarContent className="bg-black">
        {/* Panel heading */}
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-sidebar-title font-bold text-aerospace text-white tracking-[var(--tracking-aerospace)]">
            EMPLOYEE PANEL
          </h2>
        </div>

        <SidebarGroup className="pt-1">
          <SidebarGroupLabel className="text-aerospace text-white/40 text-label px-3 mb-1">
            OVERVIEW
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "payment"}
                  onClick={() => setActiveTab("payment")}
                  className={`text-aerospace-nav text-body hover:bg-white/10 hover:text-white transition-colors ${
                    activeTab === "payment" ? "bg-white/10 text-white" : "text-white/70"
                  }`}
                >
                  PAYMENT
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "details"}
                  onClick={() => setActiveTab("details")}
                  className={`text-aerospace-nav text-body hover:bg-white/10 hover:text-white transition-colors ${
                    activeTab === "details" ? "bg-white/10 text-white" : "text-white/70"
                  }`}
                >
                  DETAILS
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "worker_company_details"}
                  onClick={() => setActiveTab("worker_company_details")}
                  className={`text-aerospace-nav text-body hover:bg-white/10 hover:text-white transition-colors ${
                    activeTab === "worker_company_details" ? "bg-white/10 text-white" : "text-white/70"
                  }`}
                >
                  COMPANY DETAILS
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
