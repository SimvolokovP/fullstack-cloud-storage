import Link from "next/link";

import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";

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

        <div className="mt-8">форма</div>

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
