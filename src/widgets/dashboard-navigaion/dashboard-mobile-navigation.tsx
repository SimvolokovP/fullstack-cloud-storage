"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";

import { NAVIGATION } from "./navigation";

export function DashboardMobileNavigation() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const activeItem =
    NAVIGATION.find((item) => item.href === pathname) ?? NAVIGATION[0];

  const ActiveIcon = activeItem.icon;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden">
      <div
        className={cn(
          "flex items-center border border-border/70 bg-background/90 shadow-xl shadow-black/10 backdrop-blur-2xl transition-all duration-300 ease-out",
          isExpanded ? "h-14 rounded-full px-2" : "h-11 rounded-full px-1",
        )}
      >
        {isExpanded ? (
          <>
            <div className="flex items-center gap-1">
              {NAVIGATION.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.title}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full transition-all",
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon
                      className="size-4.5"
                      strokeWidth={isActive ? 2 : 1.8}
                    />
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="ml-1 flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Свернуть навигацию"
            >
              <ChevronDown className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex h-9 items-center gap-2 rounded-full px-2.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Развернуть навигацию"
          >
            <ActiveIcon className="size-4.25" strokeWidth={2} />

            <ChevronUp className="size-3.5" />
          </button>
        )}
      </div>
    </nav>
  );
}
