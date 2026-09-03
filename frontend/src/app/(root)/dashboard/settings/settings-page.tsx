"use client";

import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { ProfileForm } from "@/features/auth/components/profile-form";
import { Skeleton } from "@/shared/ui/skeleton";
import { ProfileSecurity } from "@/features/auth/components/profile-security";

export function SettingsPage() {
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="container space-y-8 py-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-75 rounded-xl" />
          <Skeleton className="h-75 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Настройки</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Управляйте параметрами вашего профиля и настройками безопасности
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1">
        <ProfileForm user={user} />

        {/* {user.method === "CREDENTIALS" ? (
          <PasswordForm user={user} />
        ) : (
          <div className="rounded-xl border border-border border-dashed bg-muted/10 p-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium">Управление паролем ограничено</p>
            <p className="text-xs text-muted-foreground max-w-60 mt-1">
              Вы авторизованы через {user.method}. Изменение пароля доступно
              только в настройках провайдера.
            </p>
          </div>
        )} */}
      </div>

      <ProfileSecurity />

      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/60 pt-4">
        <span>
          Аккаунт создан: {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
