"use client";

import Link from "next/link";
import { PAGES } from "@/shared/config/pages-url.config";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export function ForgotPasswordPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Восстановление пароля
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Введите ваш email, и мы отправим ссылку для смены пароля
          </p>
        </div>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Вспомнили пароль?{" "}
          <Link
            href={PAGES.LOGIN}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
