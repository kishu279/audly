// Employee/Worker Types
export interface Employee {
  employeeId: string;
  employeeName: string;
  eployeeSalary: number;
  employeeWallet: string;
  eployeeRole: string;
  employeeDepartment: string;
  eployeePaymentFrequency: string;
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
