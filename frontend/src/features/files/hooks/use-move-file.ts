import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "../services/files.service";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseMoveFileOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

interface MoveFileVariables {
  id: string;
  targetParentId: string | null;
}

export function useMoveFile({ onSuccess, onError }: UseMoveFileOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, targetParentId }: MoveFileVariables) =>
      filesService.moveFile(id, targetParentId),
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
