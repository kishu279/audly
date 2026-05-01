"use client";

import { useAdminStore } from "@/stores/useAdminStore";
import { RoleSelectionModal } from "@/components/admin/RoleSelectionModal";
import { DashboardSidebar } from "@/components/admin/DashboardSidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { Navbar } from "@/components/sections/Navbar";

export default function DashboardPage() {
  const { role } = useAdminStore();

  return (
    <>
      {/* Keeping Navbar for wallet connection */}
      <Navbar />

      <main className="flex w-full pt-20 bg-black min-h-screen">
        <RoleSelectionModal />

        {role === "admin" && (
          <div className="flex w-full">
            <DashboardSidebar />
            <AdminContent />
          </div>
        )}

        {role === "worker" && (
          <div className="flex flex-col items-center justify-center w-full min-h-[80vh] text-center gap-6 px-4">
            <h1 className="text-[48px] font-bold leading-none text-aerospace text-white">
              GOOD LUCK!
            </h1>
            <p className="text-[16px] text-aerospace text-white/70 max-w-xl leading-relaxed">
              THIS DASHBOARD IS CURRENTLY ONLY FOR COMPANY OWNERS AND ADMINS TO SET UP PAYROLL. WORKER FEATURES WILL BE AVAILABLE SOON.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
