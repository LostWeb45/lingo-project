"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formRegisterSchema, TFormRegisterValues } from "./schemas";
import { FormInput } from "@/components/shared/form/form-input";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { DialogTitle } from "@/components/ui/dialog";

interface Props {
  className?: string;
  onClose: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose, className }) => {
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      // Например, создаем пользователя в базе данных

      toast.success("Вы успешно зарегистрированы", { icon: "✅" });

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result?.ok) {
        throw new Error("Ошибка регистрации");
      }

      toast.success("Вы успешно вошли в аккаунт", { icon: "✅" });

      onClose?.();
    } catch (error) {
      toast.error("Ошибка при регистрации", { icon: "❌" });
    } finally {
      form.reset();
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className={`flex flex-col gap-5 ${className || ""}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <DialogTitle className="text-[26px]">Регистрация</DialogTitle>
            <p className="text-gray-400">Введите свои данные для регистрации</p>
          </div>
          <img
            src="/images/phone-icon.png"
            alt="phone"
            width={60}
            height={60}
          />
        </div>

        <FormInput
          className="text-[17px]"
          name="name"
          label="Имя"
          type="text"
          required
        />

        <FormInput
          className="text-[17px]"
          name="email"
          label="E-Mail"
          type="email"
          required
        />

        <FormInput
          className="text-[17px]"
          name="password"
          label="Пароль"
          type="password"
          required
        />

        <FormInput
          className="text-[17px]"
          name="confirmPassword"
          label="Подтверждение пароля"
          type="password"
          required
        />

        <Button
          className="h-[50px]"
          loading={form.formState.isSubmitting}
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Зарегистрироваться
        </Button>
      </form>
    </FormProvider>
  );
};
