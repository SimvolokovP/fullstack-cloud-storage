import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { Skeleton } from "@/shared/ui/skeleton";

export function DashboardGreeting() {
  const { data, isPending } = useGetMe();

  return (
    <div className="max-w-2xl mb-3 md:mb-6">
      <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-4xl flex gap-1">
        С возвращением,{" "}
        <div>
          {isPending ? <Skeleton className="w-40 h-6 md:h-10 md:w-50" /> : data?.displayName}
        </div>
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
        Вот что сегодня происходит с вашими файлами.
      </p>
    </div>
  );
}
