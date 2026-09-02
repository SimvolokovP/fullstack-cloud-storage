import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseResetPasswordProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

export const useResetPassword = ({
  onError,
  onSuccess,
}: UseResetPasswordProps = {}) => {
  return useMutation({
    mutationFn: ({ token, password }: ResetPasswordPayload) =>
      authService.resetPassword(token, password),
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
