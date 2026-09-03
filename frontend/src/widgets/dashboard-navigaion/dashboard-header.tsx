"use client";

import Link from "next/link";
import { PAGES } from "@/shared/config/pages-url.config";
import { ThemeToggle } from "@/widgets/theme-toggle";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { Skeleton } from "@/shared/ui/skeleton";

export function DashboardHeader() {
  const { data: userProfile, isLoading } = useGetMe();

  return (
    <header className="w-full">
      <div className="container flex h-14 items-center justify-end gap-6 md:h-16">
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-32" />
              </>
            ) : (
              userProfile && (
                <Link
                  href={PAGES.DASHBOARD_SETTINGS}
                  className="bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted rounded-lg border"
                >
                  {userProfile.displayName}
                </Link>
              )
            )}
          </div>

          <div className="block md:hidden">
            {isLoading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              userProfile && (
                <Link
                  href={PAGES.DASHBOARD_SETTINGS}
                  className="bg-background rounded-lg border px-3 py-2 text-sm font-medium text-foreground transition-colors"
                >
                  {userProfile.displayName}
                </Link>
              )
            )}
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
