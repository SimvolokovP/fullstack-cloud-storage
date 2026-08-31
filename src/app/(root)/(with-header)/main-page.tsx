import { Features } from "@/features/landing/components/features";
import { Hero } from "@/features/landing/components/hero";
import { Security } from "@/features/landing/components/security";

export function MainPage() {
  return (
    <>
      <Hero />
      <Features />
      <Security />
    </>
  );
}
