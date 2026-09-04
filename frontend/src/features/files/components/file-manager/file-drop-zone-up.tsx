"use client";

import { useDroppable } from "@dnd-kit/core";
import { CornerLeftUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FileDropZoneUpProps {
  parentId: string | null;
}

export function FileDropZoneUp({ parentId }: FileDropZoneUpProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-folder-up",
    data: { id: parentId },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-sm font-medium transition-all text-muted-foreground bg-card/20 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200",
        isOver
          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary scale-[1.01]"
          : "border-border hover:bg-card/40"
      )}
    >
      <CornerLeftUp className={cn("h-4 w-4", isOver && "animate-bounce")} />
      <span>Перетащите сюда, чтобы переместить на уровень вверх</span>
    </div>
  );
}
