import { toast } from "sonner";

type ToastType = "success" | "error";

export function toastMessageHandler(
  message: string | null | undefined,
  type: ToastType = "error",
) {
  const defaultMessage =
    type === "success"
      ? "Операция успешно завершена."
      : "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.";

  const safeMessage = message || defaultMessage;
  const firstDotIndex = safeMessage.indexOf(".");
  const toastFn = type === "success" ? toast.success : toast.error;

  if (firstDotIndex !== -1) {
    toastFn(safeMessage.slice(0, firstDotIndex), {
      description: safeMessage.slice(firstDotIndex + 1),
    });
  } else {
    toastFn(safeMessage);
  }
}
