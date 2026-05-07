"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ImageCarouselData {
  title: string;
  location: string;
  description: string;
}

interface ImageCarouselModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images?: ImageCarouselData[];
  modalTitle?: string;
  modalDescription?: string;
}

const defaultImages: ImageCarouselData[] = [
  {
    title: "wallet-connect",
    location: "/assets/wallet-connec.png",
    description: "Connect your wallet to get started with the platform",
  },
  {
    title: "getstarted",
    location: "/assets/get-started.png",
    description: "Begin your journey by setting up your account",
  },
  {
    title: "rolechoose",
    location: "/assets/role-choose.png",
    description: "Select your role to access the appropriate features",
  },
  {
    title: "clicktooltip",
    location: "/assets/click-toop-tip.png",
    description: "Click on tooltips for helpful information and guidance",
  },
  {
    title: "changetolocalnet",
    location: "/assets/change-to-localnet.png",
    description: "Switch to localnet for local development and testing",
  },
  {
    title: "instruction-mint",
    location: "/assets/instruction-mint.png",
    description: "Follow the instructions to mint your tokens",
  },
  {
    title: "fill-company-details",
    location: "/assets/fill-companydetails.png",
    description: "Complete your company information to proceed",
  },
  {
    title: "deposit-vault",
    location: "/assets/deposit-vault.png",
    description: "Deposit funds into the vault for payroll distribution",
  },
  {
    title: "fill-details-manual-entry",
    location: "/assets/fill-details-manual-entry.png",
    description: "Manually enter employee details one by one",
  },
  {
    title: "csv-file-upload",
    location: "/assets/csv-file-upload.png",
    description: "Upload employee data in bulk using CSV file",
  },
  {
    title: "save-workers",
    location: "/assets/save-workers.png",
    description: "Save the worker information to the system",
  },
  {
    title: "start-payroll",
    location: "/assets/start-payroll.png",
    description: "Initiate the payroll process for your employees",
  },
  {
    title: "worker-instruction",
    location: "/assets/worker-instruction.png",
    description: "Instructions for workers to access their payroll",
  },
  {
    title: "payroll-admin-address",
    location: "/assets/payroll-admin-address.png",
    description: "Enter the admin wallet address for payroll management",
  },
  {
    title: "eligible-for-payment",
    location: "/assets/eligible-for-payment.png",
    description: "View employees eligible for payment this cycle",
  },
  {
    title: "employee-details",
    location: "/assets/employee-details.png",
    description: "View detailed information about each employee",
  },
  {
    title: "eligible-to-claim",
    location: "/assets/eligible-to-claim.png",
    description: "Employees can claim their available payments",
  },
  {
    title: "another-payment",
    location: "/assets/another-payment.png",
    description: "Process another payment cycle for employees",
  },
];

export function ImageCarouselModal({
  open,
  onOpenChange,
  images = defaultImages,
  modalTitle = "Overview",
  modalDescription = "Get a quick overview of the platform with these helpful images and descriptions",
}: ImageCarouselModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#121212] border-[rgba(255,255,255,0.08)] rounded-[2px] text-[#e5e2e1] max-w-4xl max-h-[90vh] overflow-hidden"
        style={{ zIndex: 10000 }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-[20px] uppercase tracking-[-0.4px] text-[#e5e2e1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {modalTitle}
          </DialogTitle>
          <DialogDescription
            className="text-[14px] text-[#71717a]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {modalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {images.length === 0 ? (
            <div className="text-center text-[#71717a] py-8">
              No images available
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="space-y-3">
                      <div className="relative w-full h-[60vh] bg-[rgba(255,255,255,0.02)] rounded-[2px] border border-[rgba(255,255,255,0.05)] overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.location}
                          alt={image.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="px-2">
                        <h3
                          className="text-[14px] uppercase text-[#e5e2e1] mb-1"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {image.title}
                        </h3>
                        <p
                          className="text-[12px] text-[#a1a1aa]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {image.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e5e2e1] hover:bg-[rgba(255,255,255,0.08)]" />
              <CarouselNext className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e5e2e1] hover:bg-[rgba(255,255,255,0.08)]" />
            </Carousel>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
