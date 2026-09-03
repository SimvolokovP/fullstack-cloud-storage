import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesService } from "../services/files.service";
import { CreateFolderDto, IFileEntity } from "../types/files.types";
import { AxiosError } from "axios";
import { BackendErrorData, errorCatch } from "@/shared/api/api.config";

interface UseCreateFolderProps {
  onSuccess?: (data: IFileEntity) => void;
  onError?: (message: string) => void;
}

export const useCreateFolder = ({
  onError,
  onSuccess,
}: UseCreateFolderProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFolderDto) => filesService.createFolder(data),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["files", variables.parentId || "root"],
      });

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
