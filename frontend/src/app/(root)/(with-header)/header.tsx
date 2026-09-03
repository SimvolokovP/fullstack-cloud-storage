"use client";

import Link from "next/link";
import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { ThemeToggle } from "@/widgets/theme-toggle";
import { CloudUpload } from "lucide-react";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { Skeleton } from "@/shared/ui/skeleton";

const navigation = [
  {
    title: "Главная",
    href: PAGES.MAIN_HERO,
  },
  {
    title: "Возможности",
    href: PAGES.MAIN_FEATURES,
  },
  {
    title: "Тарифы",
    href: PAGES.MAIN_PRICING,
  },
  {
    title: "Безопасность",
    href: PAGES.MAIN_SECURITY,
  },
];

export function Header() {
  const { data: userProfile, isLoading } = useGetMe();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-6 md:h-16">
        <Link href={PAGES.MAIN} className="flex items-center gap-2">
          <CloudUpload />
          <span className="text-sm font-semibold tracking-tight">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-32" />
              </>
            ) : userProfile ? (
              <Link
                href={PAGES.DASHBOARD || "/dashboard"}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Панель управления ({userProfile.displayName})
              </Link>
            ) : (
              <>
                <Link
                  href={PAGES.LOGIN}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Войти
                </Link>
                <Link
                  href={PAGES.REGISTER}
                  className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  Начать бесплатно
                </Link>
              </>
            )}
          </div>

          <div className="block md:hidden">
            {isLoading ? (
              <Skeleton className="h-9 w-16" />
            ) : userProfile ? (
              <Link
                href={PAGES.DASHBOARD}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors"
              >
                Кабинет
              </Link>
            ) : (
              <Link
                href={PAGES.LOGIN}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Войти
              </Link>
            )}
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
