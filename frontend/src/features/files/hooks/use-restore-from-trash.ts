import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "../services/files.service";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseRestoreFromTrashOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useRestoreFromTrash({
  onSuccess,
  onError,
}: UseRestoreFromTrashOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => filesService.restore(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["files"],
      });
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
}
