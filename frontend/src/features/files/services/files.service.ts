import { AUTH_API } from "@/shared/api/api.config";
import {
  CreateFolderDto,
  IFileEntity,
  IFilesQueryParams,
  IPaginatedFiles,
} from "../types/files.types";

export const filesService = {
  async getFiles(queryParams?: IFilesQueryParams) {
    const response = await AUTH_API.get<IPaginatedFiles>("/files", {
      params: queryParams,
    });
    return response.data;
  },

  async getTrash(queryParams?: IFilesQueryParams) {
    const response = await AUTH_API.get<IPaginatedFiles>("/files/trash", {
      params: queryParams,
    });
    return response.data;
  },

  async createFolder(data: CreateFolderDto) {
    const response = await AUTH_API.post<IFileEntity>("/files/folder", data);
    return response.data;
  },

  async renameFile(id: string, name: string) {
    const response = await AUTH_API.patch<IFileEntity>(`/files/${id}/rename`, {
      name,
    });
    return response.data;
  },

  async moveToTrash(id: string) {
    const response = await AUTH_API.patch<{ success: boolean }>(
      `/files/${id}/trash`,
    );
    return response.data;
  },

  async getBreadcrumbs(id: string) {
    const response = await AUTH_API.get<IFileEntity[]>(
      `/files/${id}/breadcrumbs`,
    );
    return response.data;
  },
};
