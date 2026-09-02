import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseForgotPasswordProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useForgotPassword = ({
  onError,
  onSuccess,
}: UseForgotPasswordProps = {}) => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
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
