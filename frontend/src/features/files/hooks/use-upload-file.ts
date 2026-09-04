import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "../services/files.service";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UploadPayload {
  file: File;
  parentId?: string;
}

interface UseUploadFileProps {
  parentId?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useUploadFile = ({
  parentId,
  onError,
  onSuccess,
}: UseUploadFileProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, parentId }: UploadPayload) =>
      filesService.uploadFile(file, parentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["files", parentId || "root"],
      });
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });

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
