import { useQuery } from "@tanstack/react-query";
import { ITariffPlan } from "../types/tariffs.types";
import { tariffsService } from "../services/tariffs.service";

export const useGetTariffs = () => {
  return useQuery<ITariffPlan[]>({
    queryKey: ["tariff-plans"],
    queryFn: () => tariffsService.getAll(),

    staleTime: 5 * 60 * 1000,
  });
};
