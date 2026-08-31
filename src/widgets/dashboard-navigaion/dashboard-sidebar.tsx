"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  HardDrive,
  Settings,
} from "lucide-react";
import { useState } from "react";

import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { cn } from "@/shared/lib/utils";
import { NAVIGATION } from "./navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative hidden h-full shrink-0 border-r border-border/60 bg-card transition-[width] duration-200 md:flex md:flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-border/60",
          collapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <Link
          href={PAGES.DASHBOARD}
          className="flex min-w-0 items-center gap-2"
        >
          <CloudUpload />

          {!collapsed && (
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
                title={collapsed ? item.title : undefined}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md text-sm transition-colors",
                  collapsed ? "justify-center px-2" : "px-3",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon
                  className="size-4 shrink-0"
                  strokeWidth={isActive ? 2 : 1.8}
                />

                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border/60 p-2">
        <Link
          href={PAGES.DASHBOARD_SETTINGS}
          title={collapsed ? "Настройки" : undefined}
          className={cn(
            "flex h-10 items-center gap-3 rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
            collapsed ? "justify-center px-2" : "px-3",
          )}
        >
          <Settings className="size-4 shrink-0" strokeWidth={1.8} />

          {!collapsed && <span>Настройки</span>}
        </Link>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className={cn(
            "mt-1 flex h-10 w-full items-center gap-3 rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
            collapsed ? "justify-center px-2" : "px-3",
          )}
        >
          {collapsed ? (
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
