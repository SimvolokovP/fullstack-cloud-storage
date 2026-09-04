"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { FolderCard } from "../folder-card";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { IFileEntity } from "../../types/files.types";
import { FileActionWrapper } from "../file-actions/file-actions-wrapper";
import { useMoveFile } from "../../hooks/use-move-file";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { FileDropZoneUp } from "./file-drop-zone-up";
import { FilePreviewDialog } from "./file-preview-dialog";

interface FileManagerListProps {
  items: IFileEntity[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  onFolderClick?: (id?: string) => void;
  currentFolderParentId?: string | null;
}

export function FileManagerList({
  items,
  isLoading,
  viewMode,
  onFolderClick,
  currentFolderParentId,
}: FileManagerListProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [previewItem, setPreviewItem] = useState<IFileEntity | null>(null);

  const { mutate: moveFile } = useMoveFile({
    onSuccess: () => {
      toastMessageHandler("Объект успешно перемещен.", "success");
    },
    onError: (message) => toastMessageHandler(message, "error"),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.data?.current?.id;
    const targetParentId = over.data?.current?.id;

    if (draggedId && draggedId !== targetParentId) {
      moveFile({ id: draggedId, targetParentId: targetParentId || null });
    }
  };

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

  if (items.length === 0 && !isDragging) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/10 backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">
          В этой директории пока нет объектов
        </p>
      </div>
    );
  }

  const renderContent = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <FileActionWrapper
              key={item.id}
              item={item}
              parentFolderParentId={currentFolderParentId}
              onPreviewClick={setPreviewItem}
            >
              {({ dropdownTrigger, isDragOver }) => (
                <FolderCard
                  item={item}
                  onClick={
                    item.isFolder && onFolderClick
                      ? () => onFolderClick(item.id)
                      : undefined
                  }
                  dropdownTrigger={dropdownTrigger}
                  isDragOver={isDragOver}
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
          <FileActionWrapper
            key={item.id}
            item={item}
            parentFolderParentId={currentFolderParentId}
            onPreviewClick={setPreviewItem}
          >
            {({ dropdownTrigger, isDragOver }) => (
              <div
                onClick={
                  item.isFolder && onFolderClick
                    ? () => onFolderClick(item.id)
                    : undefined
                }
                className={cn(
                  "group flex items-center justify-between p-3 text-sm hover:bg-secondary/30 transition-all",
                  item.isFolder && onFolderClick && "cursor-pointer",
                  isDragOver &&
                    "bg-primary/10 hover:bg-primary/10 ring-2 ring-primary ring-inset z-10",
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
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4 w-full">
        {isDragging && currentFolderParentId !== undefined && (
          <FileDropZoneUp parentId={currentFolderParentId} />
        )}
        {renderContent()}
      </div>

      <FilePreviewDialog
        item={previewItem}
        open={previewItem !== null}
        onOpenChange={(open) => !open && setPreviewItem(null)}
      />
    </DndContext>
  );
}
