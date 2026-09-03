import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFolderSchema, CreateFolderInput } from "../schemas/files.schema";
import { useCreateFolder } from "../hooks/use-create-folder";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";

interface CreateFolderDialogProps {
  parentId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFolderDialog({
  parentId,
  open,
  onOpenChange,
}: CreateFolderDialogProps) {
  const form = useForm<CreateFolderInput>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: { name: "" },
  });

  const { mutate: createFolder, isPending } = useCreateFolder({
    onSuccess: () => {
      toastMessageHandler("Папка успешно создана.", "success");
      form.reset();
      onOpenChange(false);
    },
    onError: (message) => {
      toastMessageHandler(message, "error");
    },
  });

  const onSubmit = (data: CreateFolderInput) => {
    createFolder({ name: data.name, parentId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создать папку</DialogTitle>
          <DialogDescription>
            Введите название для новой директории в вашем облачном хранилище.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название папки</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Новая папка"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
