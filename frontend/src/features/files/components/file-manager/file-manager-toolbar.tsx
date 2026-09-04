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
  isInTrash: boolean;
  onUploadClick: () => void;
  isUploadPending: boolean;
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
  onUploadClick,
  isUploadPending,
}: FileManagerToolbarProps) {
  const renderActions = (isMobileView: boolean) => {
    if (isInTrash) return isMobileView ? null : <div className="h-9" />;

    return (
      <div
        className={cn(
          "flex items-center gap-2",
          isMobileView ? "flex-col w-full" : "flex-wrap",
        )}
      >
        <div className={cn("relative inline-flex", isMobileView && "w-full")}>
          <button
            type="button"
            onClick={onUploadClick}
            disabled={isUploadPending}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-l-md bg-foreground font-medium text-background transition-colors hover:bg-foreground/90 border-r border-background/20 disabled:opacity-50",
              isMobileView ? "h-10 flex-1 text-sm" : "h-9 px-4 text-xs",
            )}
          >
            <Upload className={isMobileView ? "size-4" : "size-3.5"} />
            {isUploadPending ? "Загрузка файлов..." : "Загрузить файлы"}
          </button>
          <button
            type="button"
            disabled={isUploadPending}
            className={cn(
              "inline-flex items-center justify-center bg-foreground font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50",
              isMobileView
                ? "h-10 px-3 text-sm rounded-r-md"
                : "h-9 px-2 text-xs rounded-r-md",
            )}
          >
            <ChevronDown className={isMobileView ? "size-4" : "size-3.5"} />
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateFolderClick}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background font-medium transition-colors hover:bg-muted",
            isMobileView ? "h-10 text-sm w-full" : "h-9 px-4 text-xs",
          )}
        >
          <FolderPlus className={isMobileView ? "size-4" : "size-3.5"} />
          Новая папка
        </button>
      </div>
    );
  };

  const renderDisplaySettings = (isMobileView: boolean) => (
    <div
      className={cn(
        "flex items-center gap-3",
        isMobileView
          ? "flex-col items-stretch w-full space-y-4"
          : "self-end sm:self-auto",
      )}
    >
      <div className={cn("flex flex-col space-y-2", !isMobileView && "hidden")}>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Вид отображения
        </label>
      </div>
      <div
        className={cn(
          "flex items-center rounded-md border border-border p-1 bg-background",
          isMobileView && "w-full",
        )}
      >
        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          className={cn(
            "rounded-sm transition-colors inline-flex justify-center items-center gap-2",
            isMobileView ? "flex-1 py-2 px-3 text-sm" : "p-1.5",
            viewMode === "grid"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Grid className={isMobileView ? "size-4" : "size-3.5"} />
          {isMobileView && "Сетка"}
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("list")}
          className={cn(
            "rounded-sm transition-colors inline-flex justify-center items-center gap-2",
            isMobileView ? "flex-1 py-2 px-3 text-sm" : "p-1.5",
            viewMode === "list"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <List className={isMobileView ? "size-4" : "size-3.5"} />
          {isMobileView && "Список"}
        </button>
      </div>

      <div
        className={cn(
          "flex flex-col space-y-2",
          isMobileView ? "w-full" : "min-w-35",
        )}
      >
        {isMobileView && (
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Сортировка
          </label>
        )}
        <div
          className={cn(
            isMobileView && "w-full [&>button]:w-full [&>button]:h-10",
          )}
        >
          <SortDropdown value={sortBy} onChange={onSortByChange} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 border-b border-border/60 pb-5">
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
          {renderActions(false)}
          {renderDisplaySettings(false)}
        </div>
      )}
    </div>
  );
}
