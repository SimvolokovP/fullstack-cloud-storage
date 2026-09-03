import { Features } from "@/features/landing/components/features";
import { Hero } from "@/features/landing/components/hero";
import { Security } from "@/features/landing/components/security";
import { Tariffs } from "@/features/landing/components/tariffs";

export function MainPage() {
  return (
    <>
      <Hero />
      <Features />
      <Tariffs />
      <Security />
    </>
  );
}
