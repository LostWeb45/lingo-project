"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formRegisterSchema,
  TFormLoginValues,
} from "./modals/auth-modal/forms/schemas";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Container } from "./container";
import { Title } from "./title";
import { FormInput } from "./form/form-input";
import { Button } from "../ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: data.name,
      email: data.email,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      await updateUserInfo({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      toast.success("Данные успешно обновлены", { icon: "✅" });
    } catch (error) {
      return toast.error("Что-то пошло не так", { icon: "❌" });
    }
  };

  const onClickSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getFirstName = (name: string | null) =>
    name ? name.split(" ")[0] : "Пользователь";

  return (
    <Container className="flex justify-center">
      <div className="w-full max-w-lg bg-white shadow-sm rounded-[3px] p-8 border border-gray-100">
        <div className="text-center mb-6">
          <Title text="Ваши данные" className="font-medium text-[26px]" />
          <div className="w-[240px] h-[3px] bg-gray-300 mx-auto mt-3 rounded-full" />
        </div>
        <div className="flex flex-col items-center mb-2">
          <Avatar className="w-[90px] h-[90px] mb-2">
            <AvatarImage src={data.image ?? undefined} />
            <AvatarFallback>
              {getFirstName(data.name)?.charAt(0).toUpperCase() ?? "П"}
            </AvatarFallback>
          </Avatar>
        </div>

        <FormProvider {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormInput
              name="email"
              label="E-Mail"
              required
              className="text-[17px]"
            />
            <FormInput
              name="fullName"
              label="Полное имя"
              className="text-[17px]"
              required
            />

            <FormInput
              type="password"
              name="password"
              label="Новый пароль"
              className="text-[17px]"
              required
            />
            <FormInput
              type="password"
              name="confirmPassword"
              label="Повторите пароль"
              className="text-[17px]"
              required
            />

            <Button
              disabled={form.formState.isSubmitting}
              className="text-base mt-3 h-[50px]"
              type="submit"
            >
              Сохранить
            </Button>

            <Button
              onClick={onClickSignOut}
              variant="secondary"
              disabled={form.formState.isSubmitting}
              className="text-base text-[#667198] h-[50px]"
              type="button"
            >
              Выйти
            </Button>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
};
