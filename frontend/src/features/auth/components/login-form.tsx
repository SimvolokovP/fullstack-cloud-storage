import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-login";
import { PAGES } from "@/shared/config/pages-url.config";
import {
  ILoginCredentials,
  IAuthResponse,
  LoginResponse,
  IUser,
} from "../types/auth.types";
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

export function LoginForm() {
  const router = useRouter();
  const [isTwoFactorRequired, setIsTwoFactorRequired] =
    useState<boolean>(false);

  const form = useForm<ILoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const { mutate: loginMutate, isPending: isLoginPending } = useLogin({
    onSuccess: (data: LoginResponse) => {
      const isAuthResponse = (obj: LoginResponse): obj is IAuthResponse => {
        return typeof obj === "object" && obj !== null && "user" in obj;
      };

      const isUserDirect = (obj: LoginResponse): obj is IUser => {
        return typeof obj === "object" && obj !== null && "id" in obj;
      };

      if (isAuthResponse(data)) {
        toastMessageHandler(
          `Успешный вход. Рады видеть вас снова, ${data.displayName}!`,
          "success",
        );
        router.push(PAGES.DASHBOARD);
      } else if (isUserDirect(data)) {
        toastMessageHandler(
          `Успешный вход. Рады видеть вас снова, ${data.displayName}!`,
          "success",
        );
        router.push(PAGES.DASHBOARD);
      } else {
        toastMessageHandler(data.message, "success");
        setIsTwoFactorRequired(true);
      }
    },
    onError: (message) => {
      toastMessageHandler(message, "error");
    },
  });

  const onSubmit = (data: ILoginCredentials) => {
    loginMutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isTwoFactorRequired ? (
          <>
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
                      disabled={isLoginPending}
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
                      disabled={isLoginPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Код подтверждения</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="123456"
                    disabled={isLoginPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoginPending}>
          {isLoginPending
            ? "Проверка..."
            : isTwoFactorRequired
              ? "Подтвердить код"
              : "Войти"}
        </Button>
      </form>
    </Form>
  );
}
