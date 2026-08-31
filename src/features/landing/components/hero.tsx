import Link from "next/link";
import { ArrowRight, Check, Cloud, File, Folder } from "lucide-react";

import { PAGES } from "@/shared/config/pages-url.config";

const benefits = [
  "Надёжное хранение",
  "Доступ с любого устройства",
  "Простая синхронизация",
];

const files = [
  {
    name: "Документы",
    type: "folder",
  },
  {
    name: "Изображения",
    type: "folder",
  },
  {
    name: "presentation.pdf",
    type: "file",
  },
];

export function Hero() {
  return (
    <section id="hero" className="border-b border-border/60">
      <div className="container">
        <div className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-foreground" />
              Облачное хранилище нового поколения
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Все ваши файлы
              <br />
              <span className="text-muted-foreground">в одном месте</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Надёжное облачное хранилище для ваших файлов. Загружайте,
              синхронизируйте и делитесь ими с любого устройства.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={PAGES.REGISTER}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Начать бесплатно
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href={PAGES.LOGIN}
                className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Войти
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <Check className="size-3.5 text-foreground" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-border bg-card p-2 shadow-2xl">
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="flex h-12 items-center justify-between border-b border-border px-4">
                  <div className="flex items-center gap-2">
                    <Cloud className="size-4" />

                    <span className="text-sm font-medium">Мои файлы</span>
                  </div>

                  <div className="size-2 rounded-full bg-foreground" />
                </div>

                <div className="p-4">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Хранилище</p>

                      <p className="mt-1 text-sm font-medium">
                        24.8 GB из 100 GB
                      </p>
                    </div>

                    <span className="text-xs text-muted-foreground">24%</span>
                  </div>

                  <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[24%] rounded-full bg-foreground" />
                  </div>

                  <div className="space-y-1">
                    {files.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                      >
                        {file.type === "folder" ? (
                          <Folder className="size-5 text-muted-foreground" />
                        ) : (
                          <File className="size-5 text-muted-foreground" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {file.name}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {file.type === "folder" ? "Папка" : "PDF · 2.4 MB"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-lg border border-border bg-background px-4 py-3 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-md border border-border">
                  <Check className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-medium">Синхронизация завершена</p>

                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Все файлы актуальны
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
