import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseVerifyEmailProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useVerifyEmail = ({
  onError,
  onSuccess,
}: UseVerifyEmailProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      console.log(data);

      if (onSuccess) {
        onSuccess();
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
