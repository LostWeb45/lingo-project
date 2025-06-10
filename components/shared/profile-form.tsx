"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formUpdateSchema,
  TFormUpdateValues,
} from "./modals/auth-modal/forms/schemas";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { Container } from "./container";
import { Title } from "./title";
import { FormInput } from "./form/form-input";
import { Button } from "../ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { requestEmailVerification, updateUserInfo } from "@/app/actions";

interface Props {
  data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
  const { data: session } = useSession();
  const [isYandexProvider, setIsYandexProvider] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(data.image || "");

  // Новый стейт для telegramId
  const [telegramId, setTelegramId] = React.useState(data.telegramId || "");

  React.useEffect(() => {
    if (session?.user?.email) {
      setIsYandexProvider(session.user.provider === "yandex");
    }
  }, [session]);

  const form = useForm<TFormUpdateValues>({
    resolver: zodResolver(formUpdateSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      password: "",
      confirmPassword: "",
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://localhost:4000/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка при загрузке изображения");
      }

      const result = await response.json();
      const newUrl = `http://localhost:4000${result.url}`;
      setImageUrl(newUrl);

      const updateRes = await fetch("/api/user/update-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: newUrl }),
      });

      if (updateRes.ok) {
        toast.success("Аватар обновлён!");
      } else {
        toast.error("Ошибка обновления аватара в базе.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при загрузке аватара.");
    }
  };

  const handleSendVerification = async () => {
    try {
      await requestEmailVerification();
      toast.success("Код отправлен на почту", { icon: "📩" });
    } catch {
      toast.error("Не удалось отправить код", { icon: "❌" });
    }
  };

  const onSubmit = async (formData: TFormUpdateValues) => {
    try {
      await updateUserInfo({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      toast.success("Данные успешно обновлены", { icon: "✅" });
    } catch {
      toast.error("Что-то пошло не так", { icon: "❌" });
    }
  };

  // Функция для сохранения telegramId
  const handleTelegramIdSave = async () => {
    try {
      const res = await fetch("/api/set-telegram-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId }),
      });

      if (res.ok) {
        toast.success("Telegram ID сохранён");
      } else {
        toast.error("Ошибка сохранения Telegram ID");
      }
    } catch (error) {
      toast.error("Ошибка при сохранении Telegram ID");
    }
  };

  const getFirstName = (name: string | null) =>
    name?.split(" ")[0] ?? "Пользователь";

  return (
    <Container className="flex justify-center gap-10">
      <div className="w-full max-w-lg bg-white shadow-sm rounded-[3px] p-8 border border-gray-100">
        <div className="text-center mb-6">
          <Title text="Ваши данные" className="font-medium text-[26px]" />
          <div className="w-[240px] h-[3px] bg-gray-300 mx-auto mt-3 rounded-full" />
        </div>

        <div className="flex flex-col items-center mb-4">
          <Avatar
            className="w-[90px] h-[90px] mb-2 cursor-pointer"
            onClick={() => document.getElementById("avatarInput")?.click()}
          >
            <AvatarImage
              src={imageUrl}
              className="object-cover w-full h-full rounded-full"
            />
            <AvatarFallback className="text-[28px]">
              {getFirstName(data.name)?.charAt(0).toUpperCase() ?? "П"}
            </AvatarFallback>
          </Avatar>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            className="text-[#667198]"
            variant="ghost"
            onClick={() => document.getElementById("avatarInput")?.click()}
          >
            Изменить фото
          </Button>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              name="email"
              label="E-Mail"
              required
              disabled={isYandexProvider}
              disablesDel={isYandexProvider}
              className="text-[17px]"
            />

            {!data.emailVerified && (
              <Button
                type="button"
                variant="ghost"
                className="h-[50px] text-[16px] text-[#1d3c6a]"
                onClick={handleSendVerification}
              >
                Подтвердить
              </Button>
            )}

            <FormInput
              name="name"
              label="Полное имя"
              required
              className="text-[17px]"
            />

            <FormInput
              type="password"
              name="password"
              label="Новый пароль"
              className="text-[17px]"
              disabled={isYandexProvider}
            />

            <FormInput
              type="password"
              name="confirmPassword"
              label="Повторите пароль"
              className="text-[17px]"
              disabled={isYandexProvider}
            />

            <Button
              type="submit"
              className="text-[18px] mt-3 h-[50px]"
              disabled={form.formState.isSubmitting}
            >
              Сохранить
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-[18px] text-[#667198] h-[50px]"
              disabled={form.formState.isSubmitting}
            >
              Выйти
            </Button>
          </form>
        </FormProvider>
      </div>

      {/* Новая секция для Telegram ID и ссылки на бота */}
      <div className="w-full max-w-sm bg-white shadow-sm rounded-[3px] p-6 border border-gray-100 flex flex-col items-center">
        <Title
          text="Telegram Уведомления"
          className="font-medium text-[24px] mb-4"
        />
        <input
          type="text"
          placeholder="Введите ваш Telegram ID"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-[16px]"
        />
        <Button onClick={handleTelegramIdSave} className="w-full mb-4 h-[44px]">
          Сохранить Telegram ID
        </Button>

        <a
          href="https://t.me/your_bot_username"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Перейти к боту
        </a>
      </div>
    </Container>
  );
};
