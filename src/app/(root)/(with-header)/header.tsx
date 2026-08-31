"use client";

import { LogIn, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { PAGES } from "@/shared/config/pages-url.config";
import { SITE_NAME } from "@/shared/constants/seo.constants";
import { ThemeToggle } from "@/widgets/theme-toggle";

export function Header() {
  return (
    <header className="static md:sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container h-12 md:h-16 flex items-center justify-between gap-6">
        <Link href={PAGES.MAIN}>
          <h1 className="font-unbounded text-pink font-medium">{SITE_NAME}</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href={PAGES.MAIN}
            className="px-3 py-2 text-sm font-medium text-foreground"
          >
            Главная
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
