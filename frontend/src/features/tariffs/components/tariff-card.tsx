import Link from "next/link";
import { ArrowRight, Check, FileSpreadsheet, HardDrive } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PAGES } from "@/shared/config/pages-url.config";
import { IUser } from "@/features/auth/types/auth.types";
import { ITariffPlan } from "../types/tariffs.types";
import { formatBytes } from "../utils/format-bites";

interface TariffCardProps {
  tariff: ITariffPlan;
  user?: IUser;
}

export function TariffCard({ tariff, user }: TariffCardProps) {
  const currentTariffId = user?.tariffPlan?.id;
  const isCurrent =
    currentTariffId === tariff.id ||
    (!currentTariffId && tariff.name === "Free" && user);
  const priceNumber =
    typeof tariff.price === "string" ? parseFloat(tariff.price) : tariff.price;

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-card/60 p-6 shadow-xl backdrop-blur-xl transition-colors hover:bg-card/90 border-border/60`}
    >
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
          Текущий тариф
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-xl font-bold tracking-tight">{tariff.name}</h3>
        <p className="mt-2 min-h-10 text-xs text-muted-foreground leading-normal">
          {tariff.description || "Дополнительное для ваших нужд"}
        </p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight">
            {priceNumber === 0 ? "Бесплатно" : `${priceNumber} ₽`}
          </span>
          {priceNumber > 0 && (
            <span className="text-xs text-muted-foreground">/ мес</span>
          )}
        </div>
      </div>

      <div className="space-y-3 border-t border-border/60 pt-5 text-sm flex-1">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <HardDrive className="size-4 shrink-0 text-foreground" />
          <span className="text-xs">
            Доступно пространства:{" "}
            <strong className="text-foreground">
              {formatBytes(tariff.maxSpace)}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <FileSpreadsheet className="size-4 shrink-0 text-foreground" />
          <span className="text-xs">
            Макс. размер файла:{" "}
            <strong className="text-foreground">
              {formatBytes(tariff.maxFileSize)}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2.5 pt-2 text-xs text-muted-foreground">
          <Check className="size-3.5 shrink-0 text-foreground" />
          <span>Высокая скорость загрузки</span>
        </div>
      </div>

      <div className="mt-8 pt-2">
        {!user ? (
          <Link
            href={PAGES.LOGIN || "/auth/login"}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border px-4 text-xs font-medium transition-colors hover:bg-muted"
          >
            Войти для выбора
            <ArrowRight className="size-3.5" />
          </Link>
        ) : isCurrent ? (
          <Button
            className="w-full h-10 text-xs font-medium"
            variant="secondary"
            disabled
          >
            Активен
          </Button>
        ) : (
          <Button
            className="w-full h-10 text-xs font-medium"
            variant={priceNumber > 0 ? "default" : "outline"}
          >
            {priceNumber > 0 ? "Перейти" : "Выбрать"}
          </Button>
        )}
      </div>
    </div>
  );
}
