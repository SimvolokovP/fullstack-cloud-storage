import { z } from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Название папки не может быть пустым" })
    .max(50, { message: "Название папки не должно превышать 50 символов" }),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const renameFileSchema = z.object({
  name: z.string().min(1, { message: "Название не может быть пустым" }).max(100),
});

export type RenameFileInput = z.infer<typeof renameFileSchema>;
