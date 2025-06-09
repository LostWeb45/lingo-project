"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "@/components/shared/form/form-input";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";

const formForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Введите корректную почту" }),
});

type TFormForgotPasswordValues = z.infer<typeof formForgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const form = useForm<TFormForgotPasswordValues>({
    resolver: zodResolver(formForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: TFormForgotPasswordValues) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Ошибка при отправке кода восстановления");
        return;
      }

      toast.success("Код отправлен на почту", { icon: "📩" });
      form.reset();
    } catch (error) {
      toast.error("Ошибка сервера");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormInput
          name="email"
          label="Введите ваш E-Mail"
          type="email"
          required
        />
        <Button
          type="submit"
          className="h-[50px]"
          loading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Получить код восстановления
        </Button>
      </form>
    </FormProvider>
  );
};
