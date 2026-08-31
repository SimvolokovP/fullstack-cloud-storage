import {
  Cloud,
  Download,
  Lock,
  RefreshCw,
  Share2,
  Smartphone,
} from "lucide-react";

const features = [
  {
    title: "Надёжное хранение",
    description:
      "Ваши файлы хранятся в защищённом облаке и доступны только вам.",
    icon: Cloud,
  },
  {
    title: "Безопасность",
    description:
      "Защищаем данные современными технологиями шифрования и контроля доступа.",
    icon: Lock,
  },
  {
    title: "Синхронизация",
    description:
      "Все изменения автоматически синхронизируются между вашими устройствами.",
    icon: RefreshCw,
  },
  {
    title: "Общий доступ",
    description:
      "Делитесь файлами и папками с другими пользователями за несколько секунд.",
    icon: Share2,
  },
  {
    title: "Доступ с любого устройства",
    description: "Работайте с файлами на компьютере, планшете или смартфоне.",
    icon: Smartphone,
  },
  {
    title: "Быстрая загрузка",
    description:
      "Загружайте большие файлы быстро и продолжайте работу без ожидания.",
    icon: Download,
  },
];

export function Features() {
  return (
    <section id="features" className="border-b border-border/60">
      <div className="container py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">
            Возможности
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Всё необходимое
            <br />
            <span className="text-muted-foreground">для ваших файлов</span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            CloudBox помогает хранить, организовывать и передавать файлы без
            лишних сложностей.
          </p>
        </div>

        <div className="mt-12 grid border-l border-t border-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group min-h-52 border-b border-r border-border/60 p-6 transition-colors hover:bg-muted/30 md:p-8"
              >
                <div className="flex size-9 items-center justify-center rounded-md border border-border bg-background">
                  <Icon
                    className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="mt-6 text-sm font-medium">{feature.title}</h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
