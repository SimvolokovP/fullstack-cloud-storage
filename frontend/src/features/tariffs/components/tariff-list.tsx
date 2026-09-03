"use client";

import { useGetTariffs } from "../hooks/use-get-tariffs";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { Skeleton } from "@/shared/ui/skeleton";
import { TariffCard } from "./tariff-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";

export function TariffList() {
  const { data: tariffs = [], isLoading: isTariffsLoading } = useGetTariffs();
  const { data: user, isLoading: isUserLoading } = useGetMe();

  if (isTariffsLoading || isUserLoading) {
    return (
      <section className="w-full py-8 md:py-16 border-b border-border bg-background">
        <div className="container space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-7 w-56 bg-card" />
            <Skeleton className="h-4 w-80 bg-card" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-105 w-full bg-card rounded-2xl" />
            <Skeleton className="h-105 w-full bg-card rounded-2xl" />
            <Skeleton className="h-105 w-full bg-card rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!tariffs || tariffs.length === 0) return null;

  const hasMoreOneTariff = tariffs.length > 1;

  return (
    <section className="w-full py-3 md:py-5 bg-background overflow-hidden">
      <div className="container">
        <div className="flex items-end justify-end mb-6 md:mb-8">
          {hasMoreOneTariff && (
            <div className="flex items-center gap-2">
              <button className="tariff-prev-btn flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-30">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button className="tariff-next-btn flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-30">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            prevEl: ".tariff-prev-btn",
            nextEl: ".tariff-next-btn",
          }}
          modules={[Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="w-full max-w-full"
        >
          {tariffs.map((tariffItem) => (
            <SwiperSlide key={tariffItem.id} className="w-full h-auto!">
              <div className="w-full h-full border-0">
                <TariffCard tariff={tariffItem} user={user} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
