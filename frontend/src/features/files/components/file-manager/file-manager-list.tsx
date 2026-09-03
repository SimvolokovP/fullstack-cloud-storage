import { FolderCard } from "../folder-card";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { IFileEntity } from "../../types/files.types";
import { FileActionWrapper } from "../file-actions-wrapper";

interface FileManagerListProps {
  items: IFileEntity[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  onFolderClick: (id: string) => void;
}

export function FileManagerList({
  items,
  isLoading,
  viewMode,
  onFolderClick,
}: FileManagerListProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          viewMode === "grid"
            ? "grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            : "space-y-2",
        )}
      >
        <Skeleton
          className={cn(
            viewMode === "grid" ? "h-28 rounded-xl" : "h-12 w-full rounded-md",
          )}
        />
        <Skeleton
          className={cn(
            viewMode === "grid" ? "h-28 rounded-xl" : "h-12 w-full rounded-md",
          )}
        />
        <Skeleton
          className={cn(
            viewMode === "grid" ? "h-28 rounded-xl" : "h-12 w-full rounded-md",
          )}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/10 backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">
          В этой директории пока нет объектов
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <FileActionWrapper key={item.id} item={item}>
            {({ dropdownTrigger }) => (
              <FolderCard
                item={item}
                onClick={
                  item.isFolder ? () => onFolderClick(item.id) : undefined
                }
                dropdownTrigger={dropdownTrigger}
              />
            )}
          </FileActionWrapper>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/40 backdrop-blur-xl divide-y divide-border/60">
      {items.map((item) => (
        <FileActionWrapper key={item.id} item={item}>
          {({ dropdownTrigger }) => (
            <div
              onClick={item.isFolder ? () => onFolderClick(item.id) : undefined}
              className={cn(
                "group flex items-center justify-between p-3 text-sm hover:bg-secondary/30 transition-colors",
                item.isFolder && "cursor-pointer",
              )}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <span className="font-medium truncate max-w-50 sm:max-w-xs">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {item.isFolder ? "Папка" : "Файл"}
                </span>
              </div>

              <div className="flex items-center shrink-0">
                {dropdownTrigger}
              </div>
            </div>
          )}
        </FileActionWrapper>
      ))}
    </div>
  );
}
