import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "../services/files.service";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseMoveToTrashProps {
  parentId?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useMoveToTrash = ({
  parentId,
  onError,
  onSuccess,
}: UseMoveToTrashProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => filesService.moveToTrash(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["files", parentId || "root"],
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
};
