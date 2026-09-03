"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, CloudUpload } from "lucide-react";

import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { cn } from "@/shared/lib/utils";
import { NAVIGATION } from "./navigation";
import { useSidebarStore } from "./sidebar.store";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "relative hidden h-full shrink-0 border-r border-border/60 bg-background/90 transition-[width] duration-200 md:flex md:flex-col",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-border/60",
          isCollapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <Link href={PAGES.MAIN} className="flex min-w-0 items-center gap-2">
          <CloudUpload />

          {!isCollapsed && (
            <span className="truncate text-sm font-semibold tracking-tight">
              {SITE_NAME}
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <nav className="space-y-1">
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === PAGES.DASHBOARD && pathname === PAGES.DASHBOARD);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.title : undefined}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md text-sm transition-colors",
                  isCollapsed ? "justify-center px-2" : "px-3",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon
                  className="size-4 shrink-0"
                  strokeWidth={isActive ? 2 : 1.8}
                />

                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border/60 p-2">
        <button
          type="button"
          onClick={() => toggle()}
          className={cn(
            "mt-1 flex h-10 w-full items-center gap-3 rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
            isCollapsed ? "justify-center px-2" : "px-3",
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" strokeWidth={1.8} />
          ) : (
            <>
              <ChevronLeft className="size-4" strokeWidth={1.8} />

              <span>Свернуть</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
