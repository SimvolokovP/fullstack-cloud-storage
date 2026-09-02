import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from "../schemas/auth.schema";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { toastMessageHandler } from "@/shared/utils/toast-message-handler";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useForgotPassword({
    onSuccess: () => {
      toast.success(
        "Инструкции отправлены. Проверьте вашу почту для сброса пароля.",
      );
      form.reset();
    },
    onError: (message) => {
      toastMessageHandler(message);
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    mutate(data.email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Отправка..." : "Сбросить пароль"}
        </Button>
      </form>
    </Form>
  );
}
