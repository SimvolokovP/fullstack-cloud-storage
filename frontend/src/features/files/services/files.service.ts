import { AUTH_API } from "@/shared/api/api.config";
import { CreateFolderDto, IFileEntity, IFilesQueryParams, IPaginatedFiles } from "../types/files.types";

export const filesService = {
  async getFiles(queryParams?: IFilesQueryParams) {
    const response = await AUTH_API.get<IPaginatedFiles>("/files", {
      params: queryParams,
    });
    return response.data;
  },

  async createFolder(data: CreateFolderDto) {
    const response = await AUTH_API.post<IFileEntity>("/files/folder", data);
    return response.data;
  },
};
