import { useState } from "react";

interface UseRestoreFromTrashOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useRestoreFromTrash({
  onSuccess,
  onError,
}: UseRestoreFromTrashOptions = {}) {
  const [isPending, setIsPending] = useState(false);

  const mutate = (id: string) => {
    setIsPending(true);

    setTimeout(() => {
      setIsPending(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  };

  return { mutate, isPending };
}
