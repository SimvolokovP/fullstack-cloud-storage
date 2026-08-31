"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import { NAVIGATION } from "./navigation";
export function DashboardMobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-xl md:hidden">
      <div className="grid h-16 grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {NAVIGATION.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors",
                isActive && "text-foreground",
              )}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2 : 1.8} />

              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
