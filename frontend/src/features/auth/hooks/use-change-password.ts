import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { IChangePasswordCredentials } from "../types/auth.types";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseChangePasswordProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useChangePassword = ({
  onError,
  onSuccess,
}: UseChangePasswordProps = {}) => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: IChangePasswordCredentials;
    }) => authService.changePassword(id, data),
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
