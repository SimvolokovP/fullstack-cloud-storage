import { useRef, ChangeEvent } from "react";
import {
  FolderPlus,
  Upload,
  Grid,
  List,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { SortDropdown, SortOption } from "./sort-dropdown";
import { cn } from "@/shared/lib/utils";
import { FileSearchInput } from "./file-search-input";

interface FileManagerToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  onCreateFolderClick: () => void;
  isMobile: boolean;
  onOpenMobileMenu: () => void;
}

interface FileManagerToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  onCreateFolderClick: () => void;
  isMobile: boolean;
  onOpenMobileMenu: () => void;
  isInTrash?: boolean;
}

export function FileManagerToolbar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  onCreateFolderClick,
  isMobile,
  onOpenMobileMenu,
  isInTrash = false,
}: FileManagerToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4 border-b border-border/60 pb-5">
      {!isInTrash && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <FileSearchInput onSearchChange={onSearchChange} search={search} />
        </div>

        {isMobile && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted shrink-0"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        )}
      </div>

      {!isMobile && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex flex-wrap items-center gap-2">
            {!isInTrash ? (
              <>
                <div className="relative inline-flex">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-l-md bg-foreground px-4 text-xs font-medium text-background transition-colors hover:bg-foreground/90 border-r border-background/20"
                  >
                    <Upload className="size-3.5" />
                    Загрузить
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-r-md bg-foreground px-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    <ChevronDown className="size-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onCreateFolderClick}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <FolderPlus className="size-3.5" />
                  Новая папка
                </button>
              </>
            ) : (
              <div className="h-9" />
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center rounded-md border border-border p-1 bg-background">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "rounded-sm p-1.5 transition-colors",
                  viewMode === "grid"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Grid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "rounded-sm p-1.5 transition-colors",
                  viewMode === "list"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="size-3.5" />
              </button>
            </div>

            <SortDropdown value={sortBy} onChange={onSortByChange} />
          </div>
        </div>
      )}
    </div>
  );
}
