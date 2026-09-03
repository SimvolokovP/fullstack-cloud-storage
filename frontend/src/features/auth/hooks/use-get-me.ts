import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useGetMe = () => {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
