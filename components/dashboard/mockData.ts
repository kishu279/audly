export type WorkerStatus = "PAID" | "PENDING";
export type TimeFrame = "1W" | "1M" | "1Y";

export interface KPIMetric {
  label: string;
  iconType: "wallet" | "clock" | "landmark" | "users";
  value: string;
  valueStyle: "pink" | "peach" | "gradient" | "yellow";
  change: string;
  changeColor: string;
  changeIcon: "trending-up" | "target" | "clock" | "check";
}

export interface WorkerNode {
  initials: string;
  initialsColor: string;
  name: string;
  address: string;
  role: string;
  allocation: string;
  status: WorkerStatus;
}

export interface ChartPoint {
  x: number;
  y: number;
}

export const kpiMetrics: KPIMetric[] = [
  {
    label: "TOTAL BUDGET",
    iconType: "wallet",
    value: "$842.0k",
    valueStyle: "pink",
    change: "+12.4% VS PREV",
    changeColor: "#e879f9",
    changeIcon: "trending-up",
  },
  {
    label: "TOTAL SPENT",
    iconType: "clock",
    value: "$291.5k",
    valueStyle: "peach",
    change: "ON TARGET",
    changeColor: "#ffb59e",
    changeIcon: "target",
  },
  {
    label: "REMAINING BALANCE",
    iconType: "landmark",
    value: "$550.5k",
    valueStyle: "gradient",
    change: "REPLENISH IN 12D",
    changeColor: "#a1a1aa",
    changeIcon: "clock",
  },
  {
    label: "ACTIVE WORKERS",
    iconType: "users",
    value: "128",
    valueStyle: "yellow",
    change: "ALL VERIFIED",
    changeColor: "#d0cc00",
    changeIcon: "check",
  },
];

export const workerNodes: WorkerNode[] = [
  {
    initials: "SR",
    initialsColor: "#5c4a6e",
    name: "Sarah Reed",
    address: "ID: 0x932...45",
    role: "LEAD DEV",
    allocation: "$12,500.00",
    status: "PAID",
  },
  {
    initials: "MK",
    initialsColor: "#4a3d28",
    name: "Marcus King",
    address: "ID: 0x122...09",
    role: "UX ARCHITECT",
    allocation: "$8,200.00",
    status: "PENDING",
  },
  {
    initials: "EB",
    initialsColor: "#2a3a4a",
    name: "Elena Belova",
    address: "ID: 0x444...ef",
    role: "SECURITY ENG",
    allocation: "$15,000.00",
    status: "PAID",
  },
];

// Chart data: x ∈ [0,1], y ∈ [0,1] where 0=top, 1=bottom
export const chartData: Record<TimeFrame, ChartPoint[]> = {
  "1M": [
    { x: 0, y: 0.73 },
    { x: 0.12, y: 0.62 },
    { x: 0.26, y: 0.46 },
    { x: 0.44, y: 0.7 },
    { x: 0.58, y: 0.32 },
    { x: 0.68, y: 0.07 },
    { x: 0.76, y: 0.12 },
    { x: 0.87, y: 0.43 },
    { x: 1.0, y: 0.54 },
  ],
  "1W": [
    { x: 0, y: 0.6 },
    { x: 0.15, y: 0.45 },
    { x: 0.3, y: 0.55 },
    { x: 0.5, y: 0.3 },
    { x: 0.65, y: 0.15 },
    { x: 0.8, y: 0.35 },
    { x: 1.0, y: 0.45 },
  ],
  "1Y": [
    { x: 0, y: 0.85 },
    { x: 0.18, y: 0.72 },
    { x: 0.35, y: 0.55 },
    { x: 0.5, y: 0.78 },
    { x: 0.65, y: 0.28 },
    { x: 0.78, y: 0.1 },
    { x: 0.88, y: 0.3 },
    { x: 1.0, y: 0.6 },
  ],
};
