"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";
import { YandexLogo } from "@/shared/ui/icons/yandex-logo-icon";

export function YandexAuthButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleYandexLogin = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      setIsLoading(true);
      window.location.href = `${backendUrl}/api/auth/oauth/connect/yandex`;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full relative flex items-center justify-center gap-2"
      disabled={isLoading}
      onClick={handleYandexLogin}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <YandexLogo className="text-[#E31E24]" />
      )}
      Войти через Яндекс
    </Button>
  );
}
