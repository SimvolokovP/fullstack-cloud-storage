import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema } from "../schemas/auth.schema";
import { useRegister } from "../hooks/use-register";
import { PAGES } from "@/shared/config/pages-url.config";
import { IRegisterCredentials } from "../types/auth.types";
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
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<IRegisterCredentials>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordRepeat: "",
    },
  });

  const { mutate, isPending } = useRegister({
    onSuccess: (response) => {
      toastMessageHandler(response.message);
      router.push(PAGES.LOGIN || "/auth/login");
    },
    onError: (message) => {
      toastMessageHandler(message);
    },
  });

  const onSubmit = (data: IRegisterCredentials) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Иван"
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

        <FormField
          control={form.control}
          name="passwordRepeat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтверждение пароля</FormLabel>
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
          {isPending ? "Регистрация..." : "Создать аккаунт"}
        </Button>
      </form>
    </Form>
  );
}
