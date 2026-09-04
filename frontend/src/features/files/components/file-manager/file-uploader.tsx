import { useRef, ChangeEvent, forwardRef, useImperativeHandle } from "react";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { toast } from "sonner";
import { useUploadFile } from "../../hooks/use-upload-file";

interface FileUploaderProps {
  currentFolderId?: string;
  onUploadStart?: () => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export interface FileUploaderRef {
  triggerUpload: () => void;
}

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
  ({ currentFolderId, onUploadStart, onLoadingChange }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutateAsync: uploadFile } = useUploadFile({
      parentId: currentFolderId,
      onError: (message) => {
        toastMessageHandler(message, "error");
      },
    });

    useImperativeHandle(ref, () => ({
      triggerUpload: () => fileInputRef.current?.click(),
    }));

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      if (onUploadStart) {
        onUploadStart();
      }
      if (onLoadingChange) {
        onLoadingChange(true);
      }

      const uploadPromises = Array.from(selectedFiles).map((file) =>
        uploadFile({ file, parentId: currentFolderId }),
      );

      toast.promise(Promise.all(uploadPromises), {
        loading: "Загрузка файлов в облако...",
        success: "Все файлы успешно загружены.",
        error: "Некоторые файлы не удалось загрузить.",
      });

      try {
        await Promise.all(uploadPromises);
      } catch (error) {
        console.error(error);
      } finally {
        if (onLoadingChange) {
          onLoadingChange(false);
        }
      }

      e.target.value = "";
    };

    return (
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
    );
  },
);

FileUploader.displayName = "FileUploader";
