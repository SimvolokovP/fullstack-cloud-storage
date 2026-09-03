import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeEmailSchema, ChangeEmailInput } from "../schemas/auth.schema";
import { useChangeEmail } from "../hooks/use-change-email";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
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

interface ChangeEmailDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeEmailDialog({
  userId,
  open,
  onOpenChange,
}: ChangeEmailDialogProps) {
  const form = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "" },
  });

  const {
    formState: { isDirty },
  } = form;

  const { mutate: changeEmail, isPending } = useChangeEmail({
    onSuccess: () => {
      toast.success(
        "Email успешно изменен. Проверьте новую почту для верификации.",
      );
      form.reset();
      onOpenChange(false);
    },
    onError: (message) => {
      toastMessageHandler(message);
    },
  });

  const onSubmit = (data: ChangeEmailInput) => {
    changeEmail({ id: userId, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Изменение Email</DialogTitle>
          <DialogDescription>
            Введите новый адрес почты. Текущая верификация сбросится до
            подтверждения новой почты.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый Email адрес</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
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
              <Button type="submit" disabled={isPending || !isDirty}>
                {isPending ? "Сохранение..." : "Изменить Email"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
