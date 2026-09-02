import Link from "next/link";

import { CloudUpload } from "lucide-react";

import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen h-dvh w-full overflow-hidden bg-background lg:grid-cols-[1fr_2fr]">
      <aside className="hidden bg-foreground lg:flex lg:flex-col lg:justify-between lg:p-8">
        <Link href={PAGES.MAIN} className="flex w-fit items-center gap-2 text-muted-foreground">
          <CloudUpload />

          <span className="text-sm text-muted-foreground font-semibold tracking-tight">
            {SITE_NAME}
          </span>
        </Link>

        <div>
          <p className="text-4xl text-muted-foreground font-semibold tracking-tight">
            Всё в одном месте.
          </p>

          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Храните, синхронизируйте и открывайте свои файлы с любого
            устройства.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Простое облачное хранилище
        </p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
