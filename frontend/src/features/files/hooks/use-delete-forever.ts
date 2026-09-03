import { useState } from "react";

interface UseDeleteForeverOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useDeleteForever({
  onSuccess,
  onError,
}: UseDeleteForeverOptions = {}) {
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
