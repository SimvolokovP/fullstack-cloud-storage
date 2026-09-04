"use client";

import { useState, useRef } from "react";
import { FileManagerToolbar } from "./file-manager-toolbar";
import { FileManagerList } from "./file-manager-list";
import { CreateFolderDialog } from "../create-folder-dialog";
import { Pagination } from "@/shared/ui/pagination";
import { SortOption } from "./sort-dropdown";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useFiles } from "../../hooks/use-files";
import { FilesBreadcrumbs } from "../files-breadcrumbs";
import { FileUploader, FileUploaderRef } from "./file-uploader";
import { useFilesBreadcrumbs } from "../../hooks/use-files-breadcrumbs";

interface FileManagerProps {
  initialParentId?: string;
  isInTrash?: boolean;
  showBreadcrumbs?: boolean;
}

export function FileManager({
  initialParentId,
  isInTrash = false,
  showBreadcrumbs = true,
}: FileManagerProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(
    initialParentId,
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<boolean>(false);
  const [isUploadPending, setIsUploadPending] = useState<boolean>(false);

  const uploaderRef = useRef<FileUploaderRef>(null);
  const debouncedSearch = useDebounce(search, 400);

  const serverSortByMap: Record<SortOption, "name" | "createdAt" | "size"> = {
    name: "name",
    date: "createdAt",
    size: "size",
  };

  const { data, isLoading } = useFiles({
    parentId: isInTrash ? undefined : currentFolderId,
    search: debouncedSearch,
    sortBy: serverSortByMap[sortBy],
    order: sortBy === "date" ? "DESC" : "ASC",
    page,
    limit: 18,
    isInTrash,
  });

  const { data: breadcrumbs } = useFilesBreadcrumbs(currentFolderId);

  const currentFolderParentId =
    breadcrumbs && breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 2].id
      : null;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setPage(1);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleNavigate = (id?: string) => {
    if (isInTrash) return;
    setCurrentFolderId(id);
    setPage(1);
    setSearch("");
  };

  const handleCreateFolderClick = () => {
    setIsCreateFolderOpen(true);
  };

  const handleUploadClick = () => {
    uploaderRef.current?.triggerUpload();
  };

  return (
    <div className="mt-8 space-y-6">
      <FileUploader
        ref={uploaderRef}
        currentFolderId={currentFolderId}
        onLoadingChange={setIsUploadPending}
      />

      <FileManagerToolbar
        search={search}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        sortBy={sortBy}
        onSortByChange={handleSortChange}
        onCreateFolderClick={handleCreateFolderClick}
        isInTrash={isInTrash}
        onUploadClick={handleUploadClick}
        isUploadPending={isUploadPending}
      />

      <div className="flex flex-col gap-4">
        {showBreadcrumbs && !isInTrash && (
          <FilesBreadcrumbs
            currentId={currentFolderId}
            onNavigate={handleNavigate}
          />
        )}

        <FileManagerList
          items={data?.items || []}
          isLoading={isLoading}
          viewMode={viewMode}
          onFolderClick={handleNavigate}
          currentFolderParentId={currentFolderParentId}
        />
      </div>

      {data?.meta && (
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {!isInTrash && (
        <CreateFolderDialog
          parentId={currentFolderId}
          open={isCreateFolderOpen}
          onOpenChange={setIsCreateFolderOpen}
        />
      )}
    </div>
  );
}
