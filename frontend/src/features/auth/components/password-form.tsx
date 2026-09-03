import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "../schemas/auth.schema";
import { useChangePassword } from "../hooks/use-change-password";
import { IUser } from "../types/auth.types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";

interface PasswordFormProps {
  user: IUser;
}

export function PasswordForm({ user }: PasswordFormProps) {
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const {
    formState: { isDirty },
  } = form;

  const { mutate: changePassword, isPending: isPasswordPending } =
    useChangePassword({
      onSuccess: () => {
        toast.success("Пароль успешно изменен.");
        form.reset();
      },
      onError: (message) => {
        toastMessageHandler(message);
      },
    });

  const onPasswordSubmit = (data: ChangePasswordInput) => {
    changePassword({ id: user.id, data });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border/60">
        <h2 className="text-lg font-medium">Безопасность</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Текущий пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isPasswordPending}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isPasswordPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isPasswordPending || !isDirty}
          >
            {isPasswordPending ? "Изменение..." : "Обновить пароль"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
