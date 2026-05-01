import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-end pb-32">
      <div className="absolute inset-0 z-0">
        <Image
          src="/space-hero.png"
          alt="SpaceX inspired rocket in orbit"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 w-full px-8 max-w-7xl mx-auto">
        <h1 className="text-[48px] font-bold leading-none text-aerospace text-white mb-6">
          AUDLY
        </h1>
        <p className="text-[16px] text-aerospace text-white max-w-2xl leading-relaxed mb-8">
          LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS.
        </p>
        <Button variant="ghost_spacex" size="spacex_large">
          LEARN MORE
        </Button>
      </div>
    </section>
  );
}
