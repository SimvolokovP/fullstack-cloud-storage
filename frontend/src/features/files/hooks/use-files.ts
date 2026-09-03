import { useQuery } from "@tanstack/react-query";
import { filesService } from "../services/files.service";
import { IFilesQueryParams, IPaginatedFiles } from "../types/files.types";

export const useFiles = (queryParams?: IFilesQueryParams) => {
  return useQuery<IPaginatedFiles>({
    queryKey: [
      "files",
      queryParams?.parentId || "root",
      queryParams?.search || "",
      queryParams?.sortBy || "name",
      queryParams?.order || "ASC",
      queryParams?.page || 1,
      queryParams?.limit || 20,
      queryParams?.isInTrash ?? false,
    ],
    queryFn: () => filesService.getFiles(queryParams),
  });
};
