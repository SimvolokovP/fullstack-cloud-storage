import { API } from "@/shared/api/api.config";
import { ITariffPlan } from "../types/tariffs.types";

export const tariffsService = {
  async getAll() {
    const response = await API.get<ITariffPlan[]>("/tariffs");
    return response.data;
  },
};
