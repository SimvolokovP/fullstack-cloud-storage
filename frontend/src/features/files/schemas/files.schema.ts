import { z } from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Название папки не может быть пустым" })
    .max(50, { message: "Название папки не должно превышать 50 символов" }),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const createRenameFileSchema = (
  originalName: string,
  isFolder: boolean,
) => {
  return z.object({
    name: z
      .string()
      .min(1, { message: "Название не может быть пустым" })
      .max(100)
      .refine(
        (newName) => {
          if (isFolder) return true;
          const originalExt = originalName.includes(".")
            ? originalName.split(".").pop()
            : "";
          const newExt = newName.includes(".") ? newName.split(".").pop() : "";
          return originalExt === newExt;
        },
        { message: "Запрещено изменять расширение файла" },
      ),
  });
};

export const renameFileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Название не может быть пустым" })
    .max(100),
});

export type RenameFileInput = z.infer<typeof renameFileSchema>;
