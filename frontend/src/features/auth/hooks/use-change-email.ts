import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { IChangeEmailCredentials } from "../types/auth.types";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseChangeEmailProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useChangeEmail = ({
  onError,
  onSuccess,
}: UseChangeEmailProps = {}) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IChangeEmailCredentials }) =>
      authService.changeEmail(id, data),
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
