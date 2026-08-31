import Link from "next/link";
import { CloudUpload } from "lucide-react";
import { SITE_NAME } from "@/shared/constants/seo.constants";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container">
        <div className="flex flex-col gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground font-unbounded"
          >
            <CloudUpload size={18} />
            <span className="font-medium">{SITE_NAME}</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link href="#" className="transition-colors hover:text-foreground">
              Конфиденциальность
            </Link>

            <Link href="#" className="transition-colors hover:text-foreground">
              Условия
            </Link>

            <span className="hidden sm:inline">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
