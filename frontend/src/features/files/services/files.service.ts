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

  async deleteForever(id: string) {
    const response = await AUTH_API.delete<{ success: boolean }>(
      `/files/${id}/forever`,
    );
    return response.data;
  },

  async restore(id: string) {
    const response = await AUTH_API.patch<{ success: boolean }>(
      `/files/${id}/restore`,
    );
    return response.data;
  },

  async getBreadcrumbs(id: string) {
    const response = await AUTH_API.get<IFileEntity[]>(
      `/files/${id}/breadcrumbs`,
    );
    return response.data;
  },

  async uploadFile(file: File, parentId?: string) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await AUTH_API.post<IFileEntity>(
      "/files/upload",
      formData,
      {
        params: parentId ? { parentId } : {},
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async moveFile(id: string, targetParentId: string | null) {
    const response = await AUTH_API.patch<IFileEntity>(`/files/${id}/move`, {
      targetParentId,
    });
    return response.data;
  },
};
