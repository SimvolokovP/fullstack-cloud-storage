import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages.map((page, idx) => {
      if (page === "ellipsis") {
        return (
          <div
            key={`ellipsis-${idx}`}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="size-4" />
          </div>
        );
      }

      return (
        <button
          key={`page-${page}`}
          type="button"
          onClick={() => onPageChange(page as number)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md text-xs font-medium transition-colors",
            currentPage === page
              ? "bg-foreground text-background font-semibold"
              : "border border-border bg-background hover:bg-muted text-foreground",
          )}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-1.5 pt-4", className)}
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-background"
      >
        <ChevronLeft className="size-4" />
      </button>

      {renderPages()}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-background"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
