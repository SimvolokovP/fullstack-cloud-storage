import { TariffList } from "@/features/tariffs/components/tariff-list";

export function Tariffs() {
  return (
    <section id="pricing" className="border-b border-border/60 w-full">
      <div className="container w-full">
        <TariffList />
      </div>
    </section>
  );
}
