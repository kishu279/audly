import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
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
