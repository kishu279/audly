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
    <Sidebar collapsible="none" className="border-r border-[rgba(255,255,255,0.08)] bg-[#000000] w-64 min-h-screen">
      <SidebarContent className="bg-[#000000]">
        {/* Panel heading */}
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-[20px] font-bold text-[#d946ef] uppercase tracking-[-0.05em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            EMPLOYEE PANEL
          </h2>
        </div>

        <SidebarGroup className="pt-1">
          <SidebarGroupLabel className="text-[#71717a] text-[10px] uppercase tracking-[0.1em] px-3 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            OVERVIEW
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "payment"}
                  onClick={() => setActiveTab("payment")}
                  className={`text-[12px] uppercase transition-colors rounded-[2px] ${
                    activeTab === "payment" ? "bg-[rgba(255,255,255,0.05)] text-[#d946ef]" : "text-[#d4d4d8] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#d4d4d8]"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  PAYMENT
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "details"}
                  onClick={() => setActiveTab("details")}
                  className={`text-[12px] uppercase transition-colors rounded-[2px] ${
                    activeTab === "details" ? "bg-[rgba(255,255,255,0.05)] text-[#d946ef]" : "text-[#d4d4d8] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#d4d4d8]"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  DETAILS
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "worker_company_details"}
                  onClick={() => setActiveTab("worker_company_details")}
                  className={`text-[12px] uppercase transition-colors rounded-[2px] ${
                    activeTab === "worker_company_details" ? "bg-[rgba(255,255,255,0.05)] text-[#d946ef]" : "text-[#d4d4d8] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#d4d4d8]"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
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
