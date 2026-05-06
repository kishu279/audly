import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { FutureOfPayroll } from "@/components/sections/FutureOfPayroll";
import { DualDashboard } from "@/components/sections/DualDashboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <FutureOfPayroll />
      <DualDashboard />
    </div>
  );
}
