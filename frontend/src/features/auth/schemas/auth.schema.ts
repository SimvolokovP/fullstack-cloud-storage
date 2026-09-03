import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Некорректный email" }),
  password: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" }),
  code: z.string().optional(),
  recaptcha: z.string().optional(),
});

export const registerSchema = z
  .object({
    email: z.string().email({ message: "Некорректный email" }),
    password: z
      .string()
      .min(6, { message: "Пароль должен быть не менее 6 символов" }),
    passwordRepeat: z.string().min(6),
    name: z.string().min(2, { message: "Имя должно быть не менее 2 символов" }),
    recaptcha: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Некорректный email" }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Пароль должен быть не менее 6 символов" }),
    passwordRepeat: z.string().min(6),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, { message: "Имя должно быть не менее 2 символов" }),
  isTwoFactorEnabled: z.boolean(),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" }),
  newPassword: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  newEmail: z.string().email({ message: "Некорректный email" }),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
