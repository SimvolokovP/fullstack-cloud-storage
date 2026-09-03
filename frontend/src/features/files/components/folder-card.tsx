import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRenameFile } from "../hooks/use-rename-file";
import { useMoveToTrash } from "../hooks/use-move-to-trash";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { formatBytes } from "@/features/tariffs/utils/format-bites";
import { IFileEntity } from "../types/files.types";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Folder,
  MoreVertical,
  FileText,
  FileImage,
  FileCode,
  FileSpreadsheet,
  File as FileIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { RenameFileInput, renameFileSchema } from "../schemas/files.schema";

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
  const [activeModal, setActiveModal] = useState<"rename" | "trash" | null>(
    null,
  );

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
    onError: (message) => {
      toastMessageHandler(message, "error");
    },
  });

  const { mutate: moveToTrash, isPending: isTrashPending } = useMoveToTrash({
    parentId: item.parentId || undefined,
    onSuccess: () => {
      toastMessageHandler("Объект перемещен в корзину.", "success");
      setActiveModal(null);
    },
    onError: (message) => {
      toastMessageHandler(message, "error");
    },
  });

  const onRenameSubmit = (data: RenameFileInput) => {
    renameFile({ id: item.id, name: data.name });
  };

  const handleMoveToTrash = () => {
    moveToTrash(item.id);
  };

  return (
    <>
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

          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
              <div className="rounded-md p-1 text-muted-foreground transition-opacity hover:bg-muted opacity-100 md:opacity-0 md:group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-background border border-border rounded-md p-1 shadow-md z-50"
            >
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
            </DropdownMenuContent>
          </DropdownMenu>
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

      <Dialog
        open={activeModal === "rename"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Переименовать</DialogTitle>
            <DialogDescription>
              Укажите новое имя для выбранного объекта хранилища.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onRenameSubmit)}
              className="space-y-4 mt-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={isRenamePending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setActiveModal(null)}
                  disabled={isRenamePending}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isRenamePending}>
                  {isRenamePending ? "Сохранение..." : "Сохранить"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeModal === "trash"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Переместить в корзину?
            </DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить «{item.name}»? Объект будет
              перемещен в раздел корзины.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setActiveModal(null)}
              disabled={isTrashPending}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleMoveToTrash}
              disabled={isTrashPending}
            >
              {isTrashPending ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
