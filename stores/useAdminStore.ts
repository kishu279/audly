import { create } from "zustand";

export type Role = "admin" | "worker" | null;

export interface CompanyDetails {
  name: string;
  registrationNumber: string;
}

interface AdminStore {
  role: Role;
  companyDetails: CompanyDetails | null;
  activeTab: string;
  setRole: (role: Role) => void;
  setCompanyDetails: (details: CompanyDetails | null) => void;
  setActiveTab: (tab: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  role: null,
  companyDetails: null,
  activeTab: "company_details",
  setRole: (role) => set({ role }),
  setCompanyDetails: (details) => set({ companyDetails: details }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
