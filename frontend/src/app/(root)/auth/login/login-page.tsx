"use client";

import Link from "next/link";
import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { LoginForm } from "@/features/auth/components/login-form";
import { YandexAuthButton } from "@/features/auth/components/yandex-auth-button";

export function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            С возвращением
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Войдите в свой аккаунт {SITE_NAME}
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Или
            </span>
          </div>
        </div>

        <YandexAuthButton />

        <Link
          href={PAGES.FORGOT_PASSWORD || "/auth/forgot-password"}
          className="block w-full text-center mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Забыли пароль?
        </Link>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link
            href={PAGES.REGISTER}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
