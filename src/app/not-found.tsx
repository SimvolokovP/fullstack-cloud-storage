import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <span className="mt-8 text-7xl font-semibold tracking-tighter sm:text-8xl">
            404
          </span>

          <h1 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
            Страница не найдена
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Возможно, страница была удалена, перемещена или указан неправильный
            адрес.
          </p>

          <div className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href={PAGES.MAIN}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <Home className="size-4" />
              На главную
            </Link>

            <Link
              href={PAGES.MAIN}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
              Вернуться назад
            </Link>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">{SITE_NAME}</p>
        </div>
      </div>
    </main>
  );
}
