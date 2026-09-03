import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export type SortOption = "name" | "date" | "size";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);

  const labels: Record<SortOption, string> = {
    name: "Имя",
    date: "Дата",
    size: "Размер",
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <div className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted">
          <ArrowUpDown className="size-3.5 text-muted-foreground" />
          Сортировка: {labels[value]}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36 bg-background border border-border rounded-md p-1 shadow-md z-50"
      >
        <DropdownMenuItem
          onClick={() => onChange("name")}
          className="cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted"
        >
          По имени
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange("date")}
          className="cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted"
        >
          По дате
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange("size")}
          className="cursor-pointer rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-muted"
        >
          По размеру
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
