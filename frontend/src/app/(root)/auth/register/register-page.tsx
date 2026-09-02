"use client";

import Link from "next/link";

import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { RegisterForm } from "@/features/auth/components/register-form";

export function RegisterPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Регистрация</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Создайте свой аккаунт для входа в {SITE_NAME}
          </p>
        </div>

        <div className="mt-8">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
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
