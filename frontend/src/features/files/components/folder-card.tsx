import {
  Folder,
  MoreVertical,
  FileText,
  FileImage,
  FileCode,
  FileSpreadsheet,
  File as FileIcon,
} from "lucide-react";
import { IFileEntity } from "../types/files.types";
import { formatBytes } from "@/features/tariffs/utils/format-bites";

interface FolderCardProps {
  item: IFileEntity;
  onClick?: () => void;
}

function getFileIcon(mimeType: string | null, name: string) {
  const extension = name.split(".").pop()?.toLowerCase();

  if (
    mimeType?.startsWith("image/") ||
    ["png", "jpg", "jpeg", "webp", "gif"].includes(extension || "")
  ) {
    return <FileImage className="h-6 w-6 text-blue-500 fill-blue-500/10" />;
  }
  if (mimeType === "application/pdf" || extension === "pdf") {
    return <FileText className="h-6 w-6 text-red-500 fill-red-500/10" />;
  }
  if (["xls", "xlsx", "csv"].includes(extension || "")) {
    return (
      <FileSpreadsheet className="h-6 w-6 text-green-500 fill-green-500/10" />
    );
  }
  if (["ppt", "pptx"].includes(extension || "")) {
    return <FileText className="h-6 w-6 text-orange-500 fill-orange-500/10" />;
  }
  if (["js", "ts", "tsx", "html", "css", "json"].includes(extension || "")) {
    return <FileCode className="h-6 w-6 text-yellow-500 fill-yellow-500/10" />;
  }
  return <FileIcon className="h-6 w-6 text-muted-foreground" />;
}

export function FolderCard({ item, onClick }: FolderCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm backdrop-blur-xl transition-colors hover:bg-card/80 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
          {item.isFolder ? (
            <Folder className="h-6 w-6 text-muted-foreground fill-muted-foreground/10" />
          ) : (
            getFileIcon(item.mimeType, item.name)
          )}
        </div>
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-6 min-w-0">
        <p className="truncate text-sm font-medium tracking-tight">
          {item.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {item.isFolder ? "Папка" : formatBytes(Number(item.size))}
        </p>
      </div>
    </div>
  );
}
