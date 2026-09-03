import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, MoreVertical } from "lucide-react";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
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
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/ui/form";
import { IFileEntity } from "../types/files.types";
import { RenameFileInput, renameFileSchema } from "../schemas/files.schema";
import { useRenameFile } from "../hooks/use-rename-file";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { useMoveToTrash } from "../hooks/use-move-to-trash";

interface FileActionWrapperProps {
  item: IFileEntity;
  children: (props: { dropdownTrigger: React.ReactNode }) => React.ReactNode;
}

export function FileActionWrapper({ item, children }: FileActionWrapperProps) {
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

  const onRenameSubmit = (data: RenameFileInput) => {
    renameFile({ id: item.id, name: data.name });
  };

  const handleMoveToTrash = () => {
    moveToTrash(item.id);
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
        className="w-40 bg-background border border-border rounded-md p-1 shadow-md z-50"
        onClick={(e) => e.stopPropagation()}
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
  );

  return (
    <>
      {children({ dropdownTrigger })}

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
