import { FolderPlus, Upload, Grid, List, ChevronDown } from "lucide-react";
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
  isInTrash = false,
  onUploadClick,
  isUploadPending,
}: FileManagerToolbarProps) {
  const renderActions = () => {
    if (isInTrash) return <div className="h-9" />;

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={onUploadClick}
            disabled={isUploadPending}
            className="inline-flex items-center justify-center gap-2 rounded-l-md bg-foreground font-medium text-background transition-colors hover:bg-foreground/90 border-r border-background/20 disabled:opacity-50 h-9 px-4 text-xs"
          >
            <Upload className="size-3.5" />
            {isUploadPending ? "Загрузка файлов..." : "Загрузить файлы"}
          </button>
          <button
            type="button"
            disabled={isUploadPending}
            className="inline-flex items-center justify-center bg-foreground font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 h-9 px-2 text-xs rounded-r-md"
          >
            <ChevronDown className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateFolderClick}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background font-medium transition-colors hover:bg-muted h-9 px-4 text-xs"
        >
          <FolderPlus className="size-3.5" />
          Новая папка
        </button>
      </div>
    );
  };

  const renderDisplaySettings = () => (
    <div className="flex items-center gap-3 self-end sm:self-auto">
      <div className="flex items-center rounded-md border border-border p-1 bg-background">
        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          className={cn(
            "rounded-sm transition-colors inline-flex justify-center items-center gap-2 p-1.5",
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
            "rounded-sm transition-colors inline-flex justify-center items-center gap-2 p-1.5",
            viewMode === "list"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <List className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-col space-y-2 min-w-35">
        <div>
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
      </div>

      <div className="flex flex-col gap-4 sm:flex-row items-center justify-center md:justify-end w-full">
        {renderActions()}
        {renderDisplaySettings()}
      </div>
    </div>
  );
}
