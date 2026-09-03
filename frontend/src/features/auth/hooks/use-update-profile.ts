import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { IUser, IUpdateProfileCredentials } from "../types/auth.types";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseUpdateProfileProps {
  onSuccess?: (data: IUser) => void;
  onError?: (message: string) => void;
}

export const useUpdateProfile = ({
  onError,
  onSuccess,
}: UseUpdateProfileProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: IUpdateProfileCredentials;
    }) => authService.updateProfile(id, data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
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
