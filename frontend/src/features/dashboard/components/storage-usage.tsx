import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { formatBytes } from "@/features/tariffs/utils/format-bites";
import { HardDrive } from "lucide-react";

export function StorageUsage() {
  const { data: user } = useGetMe();

  if (!user) return null;

  const used = Number(user.usedSpace);
  const allocated = Number(user.allocatedSpace);
  const percentage =
    allocated > 0 ? Math.min(100, Math.round((used / allocated) * 100)) : 0;

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
          <HardDrive className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            Использование хранилища
          </p>
          <p className="mt-0.5 text-sm font-medium">
            {formatBytes(used)} из {formatBytes(allocated)} использовано (
            {percentage}%)
          </p>
        </div>
        <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
          Управление
        </button>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
