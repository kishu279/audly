import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-end pb-32">
      <div className="absolute inset-0 z-0">
        <Image
          src="/space-cta.png"
          alt="Mars surface landscape"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 w-full px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-[48px] font-bold leading-none text-aerospace text-white mb-6">
          READY TO EXPLORE
        </h2>
        <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
          GET STARTED
        </Button>
      </div>
    </section>
  );
}
