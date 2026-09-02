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
