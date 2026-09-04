"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { IFileEntity } from "../../types/files.types";
import { formatBytes } from "@/features/tariffs/utils/format-bites";
import { FileIcon } from "lucide-react";

interface FilePreviewDialogProps {
  item: IFileEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilePreviewDialog({
  item,
  open,
  onOpenChange,
}: FilePreviewDialogProps) {
  if (!item) return null;

  const extension = item.name.split(".").pop()?.toLowerCase();

  const isImage =
    item.mimeType?.startsWith("image/") ||
    ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(extension || "");

  const isVideo =
    item.mimeType?.startsWith("video/") ||
    ["mp4", "webm", "ogg", "mov"].includes(extension || "");

  const isPdf = item.mimeType === "application/pdf" || extension === "pdf";

  const isOfficeDoc = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
    extension || "",
  );

  const isText =
    item.mimeType?.startsWith("text/") ||
    ["txt", "md", "json", "js", "ts"].includes(extension || "");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const fileUrl = `${baseUrl}/api/files/download/${item.id}`;

  const googleDocsViewerUrl = `https://google.com{encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col p-6 bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-xl">
        <DialogHeader className="border-b border-border/50 pb-3">
          <DialogTitle className="truncate text-base font-semibold tracking-tight pr-6">
            {item.name}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Размер: {formatBytes(Number(item.size))} • Изменен:{" "}
            {new Date(item.updatedAt).toLocaleDateString()}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-auto flex items-center justify-center bg-muted/30 rounded-lg border border-border/40 my-4 p-4 relative">
          {isImage ? (
            <div className="relative w-full h-30 md:h-62.5">
              <Image
                src={fileUrl}
                alt={item.name}
                fill
                unoptimized
                className="object-contain rounded-md"
              />
            </div>
          ) : isVideo ? (
            <video
              src={fileUrl}
              controls
              autoPlay
              className="max-w-full max-h-[55vh] rounded-md shadow-sm bg-black"
            />
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              className="w-full h-[55vh] border-0 bg-background rounded-md shadow-sm"
              title={item.name}
            />
          ) : isOfficeDoc ? (
            <iframe
              src={googleDocsViewerUrl}
              className="w-full h-[55vh] border-0 bg-background rounded-md shadow-sm"
              title={item.name}
            />
          ) : isText ? (
            <iframe
              src={fileUrl}
              className="w-full h-[55vh] border-0 bg-background rounded-md font-mono text-sm p-2"
              title={item.name}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center p-8">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-muted border border-border">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Предварительный просмотр недоступен
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Вы можете скачать этот файл для просмотра на своем устройстве.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
