import { Check, FileLock, KeyRound, ShieldCheck } from "lucide-react";

const securityFeatures = [
  {
    title: "Шифрование данных",
    description: "Ваши файлы защищены во время передачи и хранения.",
    icon: FileLock,
  },
  {
    title: "Контроль доступа",
    description:
      "Вы сами определяете, кто может получить доступ к вашим файлам.",
    icon: KeyRound,
  },
  {
    title: "Защита аккаунта",
    description:
      "Современные механизмы авторизации помогают защитить ваш аккаунт.",
    icon: ShieldCheck,
  },
];

export function Security() {
  return (
    <section id="security">
      <div className="container py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-muted-foreground">
              Безопасность
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Ваши данные
              <br />
              <span className="text-muted-foreground">под защитой</span>
            </h2>

            <p className="mt-5 text-sm leading-6 text-muted-foreground sm:text-base">
              Мы создаём CloudBox с приоритетом на безопасность. Ваши файлы и
              личные данные защищены на каждом этапе работы с сервисом.
            </p>

            <div className="mt-8 space-y-5">
              {securityFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                      <Icon
                        className="size-4 text-muted-foreground"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">{feature.title}</h3>

                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-background">
                    <ShieldCheck className="size-4" strokeWidth={1.8} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Защита CloudBox</p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Все системы работают
                    </p>
                  </div>
                </div>

                <div className="flex size-2 items-center justify-center rounded-full bg-foreground" />
              </div>

              <div className="divide-y divide-border">
                <SecurityStatus title="Шифрование" value="Активно" />

                <SecurityStatus title="Защита аккаунта" value="Активно" />

                <SecurityStatus title="Контроль доступа" value="Активно" />

                <SecurityStatus title="Резервное копирование" value="Активно" />
              </div>

              <div className="border-t border-border bg-muted/20 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Check className="size-4" />

                  <span className="text-xs text-muted-foreground">
                    Все системы работают в штатном режиме
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityStatus({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="size-1.5 rounded-full bg-foreground" />

        <span className="text-sm text-muted-foreground">{title}</span>
      </div>

      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
