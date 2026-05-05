export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#050505" }}>
      {children}
    </div>
  );
}
