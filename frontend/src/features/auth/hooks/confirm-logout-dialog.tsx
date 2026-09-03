import { useRouter } from "next/navigation";
import { PAGES } from "@/shared/config/pages-url.config";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useLogout } from "./use-logout";

interface ConfirmLogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmLogoutDialog({
  open,
  onOpenChange,
}: ConfirmLogoutDialogProps) {
  const router = useRouter();

  const { mutate: logout, isPending } = useLogout({
    onSuccess: () => {
      toast.success("Вы успешно вышли из аккаунта.");
      router.push(PAGES.LOGIN || "/auth/login");
    },
    onError: (message) => {
      toastMessageHandler(message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Выход из аккаунта
          </DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите завершить текущую сессию? Вам потребуется
            повторная авторизация.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={() => logout()}
            disabled={isPending}
          >
            {isPending ? "Выход..." : "Выйти"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
