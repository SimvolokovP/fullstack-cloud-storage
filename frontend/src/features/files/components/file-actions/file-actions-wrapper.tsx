"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  Pencil,
  Trash2,
  MoreVertical,
  RefreshCw,
  Download,
  FolderUp,
  Eye,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { IFileEntity } from "../../types/files.types";
import { RenameFileInput, renameFileSchema } from "../../schemas/files.schema";
import { useRenameFile } from "../../hooks/use-rename-file";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { useMoveToTrash } from "../../hooks/use-move-to-trash";
import { useRestoreFromTrash } from "../../hooks/use-restore-from-trash";
import { useDeleteForever } from "../../hooks/use-delete-forever";
import { RenameDialog } from "./rename-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { useMoveFile } from "../../hooks/use-move-file";

interface FileActionWrapperProps {
  item: IFileEntity;
  parentFolderParentId?: string | null;
  onFolderClick?: (id?: string) => void;
  onPreviewClick?: (item: IFileEntity) => void;
  children: (props: {
    dropdownTrigger: React.ReactNode;
    dragHandleProps: {
      ref: (node: HTMLElement | null) => void;
      style: React.CSSProperties;
      [key: string]: unknown;
    };
    isDragOver: boolean;
  }) => React.ReactNode;
}

export function FileActionWrapper({
  item,
  children,
  parentFolderParentId,
  onFolderClick,
  onPreviewClick,
}: FileActionWrapperProps) {
  const [activeModal, setActiveModal] = useState<
    "rename" | "trash" | "restore" | "deleteForever" | null
  >(null);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `drag-${item.id}`,
    disabled: item.isInTrash,
    data: { id: item.id },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `drop-${item.id}`,
    disabled: !item.isFolder || item.isInTrash,
    data: { id: item.id },
  });

  const form = useForm<RenameFileInput>({
    resolver: zodResolver(renameFileSchema),
    defaultValues: { name: item.name },
  });

  const { mutate: renameFile, isPending: isRenamePending } = useRenameFile({
    parentId: item.parentId || undefined,
    onSuccess: () => {
      toastMessageHandler("Успешно переименовано.", "success");
      setActiveModal(null);
    },
    onError: (message) => toastMessageHandler(message, "error"),
  });

  const { mutate: moveToTrash, isPending: isTrashPending } = useMoveToTrash({
    parentId: item.parentId || undefined,
    onSuccess: () => {
      toastMessageHandler("Объект перемещен в корзину.", "success");
      setActiveModal(null);
    },
    onError: (message) => toastMessageHandler(message, "error"),
  });

  const { mutate: restoreFromTrash, isPending: isRestorePending } =
    useRestoreFromTrash({
      onSuccess: () => {
        toastMessageHandler("Объект успешно восстановлен.", "success");
        setActiveModal(null);
      },
      onError: (message) => toastMessageHandler(message, "error"),
    });

  const { mutate: deleteForever, isPending: isDeleteForeverPending } =
    useDeleteForever({
      onSuccess: () => {
        toastMessageHandler("Объект удален навсегда.", "success");
        setActiveModal(null);
      },
      onError: (message) => toastMessageHandler(message, "error"),
    });

  const { mutate: moveFile, isPending: isMovePending } = useMoveFile({
    onSuccess: () => {
      toastMessageHandler("Объект успешно перемещен.", "success");
    },
    onError: (message) => toastMessageHandler(message, "error"),
  });

  const onRenameSubmit = (data: RenameFileInput) => {
    renameFile({ id: item.id, name: data.name });
  };

  const handleMoveToTrash = () => {
    moveToTrash(item.id);
  };

  const handleRestore = () => {
    restoreFromTrash(item.id);
  };

  const handleDeleteForever = () => {
    deleteForever(item.id);
  };

  const handleMoveUp = () => {
    moveFile({
      id: item.id,
      targetParentId: parentFolderParentId || null,
    });
  };

  const handleDownload = () => {
    if (!item.s3Key) {
      toastMessageHandler("Файл недоступен для скачивания.", "error");
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const downloadUrl = `${baseUrl}/api/files/download/${item.id}`;
    window.open(downloadUrl, "_blank");
  };

  const handlePreview = () => {
    if (item.isFolder) {
      if (onFolderClick) onFolderClick(item.id);
    } else {
      if (onPreviewClick) onPreviewClick(item);
    }
  };

  const dropdownTrigger = (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
        <div className="rounded-md p-1 text-muted-foreground transition-opacity hover:bg-muted opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <MoreVertical className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 bg-background border border-border rounded-md p-1 shadow-md z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {item.isInTrash ? (
          <>
            <DropdownMenuItem
              onClick={() => setActiveModal("restore")}
              className="flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted"
            >
              <RefreshCw className="size-3.5" />
              Восстановить
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveModal("deleteForever")}
              className="flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              Удалить навсегда
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={handlePreview}
              className="flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted"
            >
              <Eye className="size-3.5" />
              {item.isFolder ? "Открыть папку" : "Посмотреть"}
            </DropdownMenuItem>
            {!item.isFolder && (
              <DropdownMenuItem
                onClick={handleDownload}
                className="flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted"
              >
                <Download className="size-3.5" />
                Скачать файл
              </DropdownMenuItem>
            )}
            {item.parentId && (
              <DropdownMenuItem
                onClick={handleMoveUp}
                disabled={isMovePending}
                className="flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted disabled:opacity-50"
              >
                <FolderUp className="size-3.5" />
                На уровень вверх
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setActiveModal("rename")}
              className="flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted"
            >
              <Pencil className="size-3.5" />
              Переименовать
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveModal("trash")}
              className="flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />В корзину
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.4 : undefined,
    touchAction: "pan-y",
  };

  const dragHandleProps = {
    ref: setActivatorNodeRef,
    style: { touchAction: "pan-y" } as React.CSSProperties,
    ...listeners,
    ...attributes,
  };

  return (
    <div
      ref={(node) => {
        setDraggableRef(node);
        setDroppableRef(node);
      }}
      style={style}
      className="w-full h-full select-none"
    >
      {children({ dropdownTrigger, dragHandleProps, isDragOver: isOver })}

      <RenameDialog
        open={activeModal === "rename"}
        onOpenChange={() => setActiveModal(null)}
        form={form}
        onSubmit={onRenameSubmit}
        isPending={isRenamePending}
      />

      <ConfirmDialog
        open={activeModal === "trash"}
        onOpenChange={() => setActiveModal(null)}
        title="Переместить в корзину?"
        description={`Вы уверены, что хотите удалить «${item.name}»? Объект будет перемещен в раздел корзины.`}
        confirmLabel={isTrashPending ? "Удаление..." : "Удалить"}
        onConfirm={handleMoveToTrash}
        isPending={isTrashPending}
        destructive
      />

      <ConfirmDialog
        open={activeModal === "restore"}
        onOpenChange={() => setActiveModal(null)}
        title="Восстановить объект?"
        description={`«${item.name}» вернется в свое исходное расположение.`}
        confirmLabel={isRestorePending ? "Восстановление..." : "Восстановить"}
        onConfirm={handleRestore}
        isPending={isRestorePending}
      />

      <ConfirmDialog
        open={activeModal === "deleteForever"}
        onOpenChange={() => setActiveModal(null)}
        title="Удалить окончательно?"
        description={`Вы уверены, что хотите навсегда удалить «${item.name}»? Это действие нельзя отменить.`}
        confirmLabel={
          isDeleteForeverPending ? "Удаление..." : "Удалить навсегда"
        }
        onConfirm={handleDeleteForever}
        isPending={isDeleteForeverPending}
        destructive
      />
    </div>
  );
}
