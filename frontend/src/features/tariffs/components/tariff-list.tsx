"use client";

import { useGetTariffs } from "../hooks/use-get-tariffs";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { Skeleton } from "@/shared/ui/skeleton";
import { TariffCard } from "./tariff-card";
import { useEffect } from "react";

export function TariffList() {
  const { data: tariffs, isLoading: isTariffsLoading } = useGetTariffs();
  const { data: user, isLoading: isUserLoading } = useGetMe();

  useEffect(() => {
    console.log(tariffs);
  }, [tariffs]);

  if (isTariffsLoading || isUserLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Skeleton className="h-105 rounded-2xl" />
        <Skeleton className="h-105 rounded-2xl" />
        <Skeleton className="h-105 rounded-2xl" />
      </div>
    );
  }

  if (!tariffs || tariffs.length === 0) return null;

  return (
    <div className="w-full py-4">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {tariffs.map((tariff) => (
          <TariffCard key={tariff.id} tariff={tariff} user={user} />
        ))}
      </div>
    </div>
  );
}
