"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email";
import { PAGES } from "@/shared/config/pages-url.config";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isFirstRender = useRef(true);

  const { mutate } = useVerifyEmail({
    onSuccess: () => {
      toast.success(
        "Почта успешно подтверждена. Теперь вы можете войти в систему.",
      );
      router.push(PAGES.LOGIN);
    },
    onError: (message) => {
      toastMessageHandler(message);
      router.push(PAGES.LOGIN);
    },
  });

  useEffect(() => {
    if (!isFirstRender.current) return;
    isFirstRender.current = false;

    if (!token) {
      toast.error("Токен верификации отсутствует.");
      router.push(PAGES.LOGIN);
      return;
    }

    mutate(token);
  }, [token, mutate, router]);

  return (
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">
        Подтверждаем ваш адрес электронной почты...
      </p>
    </div>
  );
}

export function NewVerificationPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">
        <Suspense
          fallback={
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            </div>
          }
        >
          <VerificationContent />
        </Suspense>
      </div>
    </div>
  );
}
