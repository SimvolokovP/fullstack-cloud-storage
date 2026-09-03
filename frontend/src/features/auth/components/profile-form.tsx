import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  updateProfileSchema,
  UpdateProfileInput,
} from "../schemas/auth.schema";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { IUser } from "../types/auth.types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";

interface ProfileFormProps {
  user: IUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.displayName,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    },
  });

  const {
    formState: { isDirty },
  } = form;

  useEffect(() => {
    form.reset({
      name: user.displayName,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    });
  }, [user, form]);

  const { mutate: updateProfile, isPending: isUpdatePending } =
    useUpdateProfile({
      onSuccess: () => {
        toast.success("Профиль успешно обновлен.");
      },
      onError: (message) => {
        toastMessageHandler(message);
      },
    });

  const onProfileSubmit = (data: UpdateProfileInput) => {
    updateProfile({ id: user.id, data });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border/60">
        <h2 className="text-lg font-medium">Личные данные</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onProfileSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Email:</span>
              <span className="font-medium text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span>Тип аккаунта:</span>
              <span className="font-medium text-foreground">{user.method}</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Отображаемое имя</FormLabel>
                <FormControl>
                  <Input disabled={isUpdatePending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm flex items-center gap-1.5">
                    Двухфакторная защита
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Требовать код при каждом входе
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isUpdatePending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isUpdatePending || !isDirty}
          >
            {isUpdatePending ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
