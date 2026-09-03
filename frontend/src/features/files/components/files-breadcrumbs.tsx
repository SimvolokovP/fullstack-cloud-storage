import { ChevronRight } from "lucide-react";
import { IFileEntity } from "../types/files.types";
import { useFilesBreadcrumbs } from "../hooks/use-files-breadcrumbs";
import { Skeleton } from "@/shared/ui/skeleton";

interface FilesBreadcrumbsProps {
  currentId?: string;
  onNavigate: (id?: string) => void;
}

export function FilesBreadcrumbs({
  currentId,
  onNavigate,
}: FilesBreadcrumbsProps) {
  const { data: parents = [], isLoading } = useFilesBreadcrumbs(currentId);

  if (isLoading && currentId) {
    return (
      <div className="flex items-center gap-1.5 h-5">
        <Skeleton className="h-3.5 w-12" />
        <ChevronRight className="size-3.5 text-border" />
        <Skeleton className="h-3.5 w-16" />
        <ChevronRight className="size-3.5 text-border" />
        <Skeleton className="h-3.5 w-20" />
      </div>
    );
  }

  return (
    <nav className="flex items-center flex-wrap gap-1.5 font-medium text-muted-foreground">
      <button
        type="button"
        onClick={() => onNavigate(undefined)}
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <span>Облако</span>
      </button>

      {parents.map((folder: IFileEntity) => (
        <div key={folder.id} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5 shrink-0 text-border" />
          <button
            type="button"
            onClick={() => onNavigate(folder.id)}
            className="transition-colors hover:text-foreground max-w-30 truncate"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
