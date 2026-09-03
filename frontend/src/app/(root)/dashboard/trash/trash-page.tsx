"use client";

import { FileManager } from "@/features/files/components/file-manager/file-manager";

export function TrashPage() {
  return (
    <section>
      <div className="container">
        <div className="max-w-2xl mb-3 md:mb-6">
          <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-4xl flex gap-1">
            Корзина
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Файлы, отправленные на удаление.
          </p>
        </div>

        <FileManager isInTrash={true} showBreadcrumbs={false} />
      </div>
    </section>
  );
}
