"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { PAGES } from "@/shared/config/pages-url.config";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Токен сброса пароля отсутствует или недействителен.");
      router.push(PAGES.LOGIN || "/auth/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return <ResetPasswordForm token={token} />;
}

export function NewPasswordPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Установка нового пароля
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Придумайте и подтвердите ваш новый пароль для доступа к аккаунту
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
