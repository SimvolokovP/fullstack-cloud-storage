import { FileEntity } from '../entities/file.entity';

export interface PaginatedFilesResponse {
  items: FileEntity[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
