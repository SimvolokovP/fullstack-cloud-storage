"use client";

import { useState, useRef, ChangeEvent } from "react";
import { FileManagerToolbar } from "./file-manager-toolbar";
import { FileManagerList } from "./file-manager-list";
import { CreateFolderDialog } from "../create-folder-dialog";
import { Pagination } from "@/shared/ui/pagination";
import { SortOption, SortDropdown } from "./sort-dropdown";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import { cn } from "@/shared/lib/utils";
import { FolderPlus, Upload, Grid, List, ChevronDown } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { FilesBreadcrumbs } from "../files-breadcrumbs";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useFiles } from "../../hooks/use-files";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setPage(1);
  };

  const handleNavigate = (id?: string) => {
    if (isInTrash) return;
    setCurrentFolderId(id);
    setPage(1);
    setSearch("");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      e.target.value = "";
      setIsMobileMenuOpen(false);
    }
  };

  const handleCreateFolderClick = () => {
    setIsMobileMenuOpen(false);
    setIsCreateFolderOpen(true);
  };

  return (
    <div className="mt-8 space-y-6">
      <FileManagerToolbar
        search={search}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={handleSortChange}
        onCreateFolderClick={handleCreateFolderClick}
        isMobile={isMobile}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isInTrash={isInTrash}
      />

      <div className="flex flex-col gap-2">
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

      <Drawer
        open={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        showSwipeHandle={isMobile}
        swipeDirection={isMobile ? "down" : "right"}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Параметры и действия</DrawerTitle>
            <DrawerDescription>
              Управление отображением, сортировкой и просмотр параметров.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {!isInTrash && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />

                <div className="flex flex-col gap-2">
                  <div className="relative inline-flex w-full">
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-l-md bg-foreground text-sm font-medium text-background transition-colors hover:bg-foreground/90 border-r border-background/20"
                    >
                      <Upload className="size-4" />
                      Загрузить файлы
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center rounded-r-md bg-foreground px-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateFolderClick}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium transition-colors hover:bg-muted w-full"
                  >
                    <FolderPlus className="size-4" />
                    Новая папка
                  </button>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Вид отображения
              </label>
              <div className="flex items-center rounded-md border border-border p-1 bg-background w-full">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex-1 rounded-sm py-2 px-3 transition-colors inline-flex justify-center items-center gap-2 text-sm",
                    viewMode === "grid"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Grid className="size-4" />
                  Сетка
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex-1 rounded-sm py-2 px-3 transition-colors inline-flex justify-center items-center gap-2 text-sm",
                    viewMode === "list"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <List className="size-4" />
                  Список
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Сортировка
              </label>
              <div className="w-full [&>button]:w-full [&>button]:h-10">
                <SortDropdown value={sortBy} onChange={handleSortChange} />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
