"use client";

import { useAdminStore } from "@/stores/useAdminStore";

export function AdminContent() {
  const { activeTab, companyDetails, setCompanyDetails } = useAdminStore();

  const renderContent = () => {
    switch (activeTab) {
      case "company_details":
        if (companyDetails) {
          return (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold text-aerospace text-white">
                COMPANY DETAILS
              </h1>
              <div className="border border-white/20 p-6 rounded-xl bg-white/5">
                <div className="grid gap-4">
                  <div>
                    <label className="text-aerospace text-white/50 text-[11px]">COMPANY NAME</label>
                    <p className="text-aerospace text-white text-lg">{companyDetails.name}</p>
                  </div>
                  <div>
                    <label className="text-aerospace text-white/50 text-[11px]">REGISTRATION NUMBER</label>
                    <p className="text-aerospace text-white text-lg">{companyDetails.registrationNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-6 max-w-xl">
            <h1 className="text-3xl font-bold text-aerospace text-white">
              ADD COMPANY DETAILS
            </h1>
            <p className="text-aerospace text-white/70">
              PLEASE ENTER YOUR COMPANY DETAILS TO PROCEED WITH PAYROLL SETUP.
            </p>
            
            <form 
              className="flex flex-col gap-4 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setCompanyDetails({
                  name: formData.get("name") as string,
                  registrationNumber: formData.get("regNumber") as string,
                });
              }}
            >
              <div className="flex flex-col gap-2">
                <label className="text-aerospace text-white/70 text-[13px]">COMPANY NAME</label>
                <input 
                  name="name"
                  required
                  className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace"
                  placeholder="E.G. SPACEX"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-aerospace text-white/70 text-[13px]">REGISTRATION NUMBER</label>
                <input 
                  name="regNumber"
                  required
                  className="bg-transparent border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white/50 text-aerospace"
                  placeholder="E.G. 123456789"
                />
              </div>
              
              <button 
                type="submit"
                className="mt-4 text-[13px] font-bold text-aerospace-nav text-white bg-ghost border border-ghost-border rounded-[32px] px-[18px] py-4 hover:bg-white/20 hover:text-white-100 transition-all self-start"
              >
                SAVE DETAILS
              </button>
            </form>
          </div>
        );

      case "add_workers":
        return (
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-aerospace text-white">ADD WORKERS</h1>
            <p className="text-aerospace text-white/70">[ ADD WORKER FORM PLACEHOLDER ]</p>
          </div>
        );

      case "update_worker_details":
        return (
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-aerospace text-white">UPDATE WORKER DETAILS</h1>
            <p className="text-aerospace text-white/70">[ UPDATE WORKER LIST PLACEHOLDER ]</p>
          </div>
        );

      case "view_employees":
        return (
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-aerospace text-white">EMPLOYEE DIRECTORY</h1>
            <p className="text-aerospace text-white/70">[ EMPLOYEE LIST PLACEHOLDER ]</p>
          </div>
        );

      case "payment_status":
        return (
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-aerospace text-white">PAYMENT STATUS</h1>
            <p className="text-aerospace text-white/70">[ TRANSACTIONS STATUS PLACEHOLDER ]</p>
          </div>
        );

      case "cancel_payment":
        return (
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-red-500">CANCEL PAYMENT</h1>
            <p className="text-aerospace text-red-400/70">[ CANCEL PENDING PAYMENTS PLACEHOLDER ]</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-12 min-h-screen">
      {renderContent()}
    </div>
  );
}
