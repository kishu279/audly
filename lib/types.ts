// Employee/Worker Types
export interface Employee {
  employeeAddress: string;
  amount: number;
}

// Component Props Types
export interface FileInputSectionProps {
  onFileChange: (file: File | null) => void;
}

// Store Types
export type Role = "admin" | "worker" | null;

export interface CompanyDetails {
  name: string;
  registrationNumber: string;
  totalAmount: number;
  mintAddress: string;
  frequency: string;
}

export interface WalletStore {
  balance: number | null;
  network: string;
  setBalance: (balance: number | null) => void;
  setNetwork: (network: string) => void;
}

export interface AdminStore {
  role: Role;
  companyDetails: CompanyDetails | null;
  activeTab: string;
  setRole: (role: Role) => void;
  setCompanyDetails: (details: CompanyDetails | null) => void;
  setActiveTab: (tab: string) => void;
}

// Notification Types
export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  description?: string;
}

export interface NotificationStore {
  notifications: Notification[];
  notify: (type: NotificationType, message: string, description?: string) => void;
  dismiss: (id: string) => void;
}

export enum Frequency {
  Weekly = "weekly",
  Monthly = "monthly",
}