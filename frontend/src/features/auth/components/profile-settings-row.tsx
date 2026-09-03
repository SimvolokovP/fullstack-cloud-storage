import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface ProfileSettingsRowProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
  destructive?: boolean;
  last?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function ProfileSettingsRow({
  icon: Icon,
  title,
  description,
  action,
  destructive,
  last,
  disabled,
  onClick,
}: ProfileSettingsRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between",
        !last && "border-b border-border/60",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background",
            destructive && "border-destructive/20 bg-destructive/5",
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4 text-muted-foreground",
              destructive && "text-destructive",
            )}
          />
        </div>

        <div>
          <p
            className={cn(
              "text-sm font-bold",
              destructive && "text-destructive",
            )}
          >
            {title}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "h-9 gap-2 self-start px-3 text-xs font-bold sm:self-auto",
          destructive &&
            "text-destructive hover:bg-destructive/10 hover:text-destructive",
        )}
      >
        {action}
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
