import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardDemo1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden" style={{ background: "#050505" }}>
        {children}
      </div>
    </SidebarProvider>
  );
}
