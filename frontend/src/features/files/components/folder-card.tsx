import { formatBytes } from "@/features/tariffs/utils/format-bites";
import { IFileEntity } from "../types/files.types";
import { cn } from "@/shared/lib/utils";

import {
  Folder,
  FileText,
  FileImage,
  FileCode,
  FileSpreadsheet,
  File as FileIcon,
} from "lucide-react";

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

interface FolderCardProps {
  item: IFileEntity;
  onClick?: () => void;
  dropdownTrigger: React.ReactNode;
  dragHandleProps: {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    [key: string]: unknown;
  };
  isDragOver?: boolean;
}

export function FolderCard({
  item,
  onClick,
  dropdownTrigger,
  dragHandleProps,
  isDragOver,
}: FolderCardProps) {
  return (
    <div
      {...dragHandleProps}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm backdrop-blur-xl transition-all cursor-grab active:cursor-grabbing hover:bg-card/80",
        isDragOver &&
          "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/5 hover:bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
          {item.isFolder ? (
            <Folder className="h-6 w-6 text-muted-foreground fill-muted-foreground/10" />
          ) : (
            getFileIcon(item.mimeType, item.name)
          )}
        </div>

        {dropdownTrigger}
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
