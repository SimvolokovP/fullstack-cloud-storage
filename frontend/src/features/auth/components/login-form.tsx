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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/ui/input-otp";
import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "next-themes";

export function LoginForm() {
  const { theme } = useTheme();

  const router = useRouter();
  const [isTwoFactorRequired, setIsTwoFactorRequired] =
    useState<boolean>(false);

  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

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
              <FormItem className="flex flex-col items-center justify-center text-center">
                <FormLabel className="mb-2">Код подтверждения 2FA</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    disabled={isLoginPending}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-center">
          {/* <ReCAPTCHA
            sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string || "6LfMsqQtAAAAACe3KMj7z9b-jV3Ace15GffPNfZo"}
            onChange={setRecaptchaValue}
            theme={theme === "light" ? "light" : "dark"}
          /> */}
        </div>

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
