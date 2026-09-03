import { useQuery } from "@tanstack/react-query";
import { filesService } from "../services/files.service";
import { IFileEntity } from "../types/files.types";

export const useFilesBreadcrumbs = (id?: string) => {
  return useQuery<IFileEntity[]>({
    queryKey: ["breadcrumbs", id || "root"],
    queryFn: () => filesService.getBreadcrumbs(id!),
    enabled: !!id,
  });
};
