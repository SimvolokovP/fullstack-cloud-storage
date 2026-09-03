import { IUser } from "@/features/auth/types/auth.types";

export interface IFileEntity {
  id: string;
  name: string;
  s3Key: string | null;
  size: number;
  mimeType: string | null;
  isFolder: boolean;
  parentId: string | null;
  isInTrash: boolean;
  owner?: IUser;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateFolderDto {
  name: string;
  parentId?: string;
}

export interface IFilesMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface IPaginatedFiles {
  items: IFileEntity[];
  meta: IFilesMeta;
}

export interface IFilesQueryParams {
  parentId?: string;
  search?: string;
  sortBy?: "name" | "createdAt" | "size";
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
  isInTrash?: boolean;
}
