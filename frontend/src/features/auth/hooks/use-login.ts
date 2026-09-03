import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginResponse, ILoginCredentials } from "../types/auth.types";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseLoginProps {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (message: string) => void;
}

export const useLogin = ({ onError, onSuccess }: UseLoginProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ILoginCredentials) => authService.login(data),
    onSuccess: async (data) => {
      if ("user" in data) {
        await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      }

      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: AxiosError<BackendErrorData>) => {
      const message = errorCatch(error);

      if (onError) {
        onError(message);
      }
    },
  });
};
