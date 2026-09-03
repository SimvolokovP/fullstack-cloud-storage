import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "../services/files.service";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface RenamePayload {
  id: string;
  name: string;
}

interface UseRenameFileProps {
  parentId?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useRenameFile = ({
  parentId,
  onError,
  onSuccess,
}: UseRenameFileProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: RenamePayload) =>
      filesService.renameFile(id, name),
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
