import { create } from "zustand";
import { Role, CompanyDetails, AdminStore } from "@/lib/types";

export const useAdminStore = create<AdminStore>((set) => ({
  role: null,
  companyDetails: null,
  activeTab: "company_details",
  setRole: (role) => set({ role }),
  setCompanyDetails: (details) => set({ companyDetails: details }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
