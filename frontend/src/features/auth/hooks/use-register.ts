import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { IRegisterResponse, IRegisterCredentials } from "../types/auth.types";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseRegisterProps {
  onSuccess?: (data: IRegisterResponse) => void;
  onError?: (message: string) => void;
}

export const useRegister = ({ onError, onSuccess }: UseRegisterProps = {}) => {
  return useMutation({
    mutationFn: (data: IRegisterCredentials) => authService.register(data),
    onSuccess: (data) => {
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
