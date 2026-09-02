import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-login";
import { PAGES } from "@/shared/config/pages-url.config";
import { ILoginCredentials } from "../types/auth.types";

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

export function LoginForm() {
  const router = useRouter();

  const form = useForm<ILoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const { mutate, isPending } = useLogin({
    onSuccess: (user) => {
      toast.success(
        `Успешный вход. Рады видеть вас снова, ${user.displayName}!`,
      );
      router.push(PAGES.DASHBOARD);
    },
    onError: (message) => {
      toastMessageHandler(message);
    },
  });

  const onSubmit = (data: ILoginCredentials) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Вход..." : "Войти"}
        </Button>
      </form>
    </Form>
  );
}
