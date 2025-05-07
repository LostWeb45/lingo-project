import { prisma } from "@/prisma/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Проверка, что метод запроса — POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Получаем сессию
  const session = await getSession({ req });
  if (!session || !session.user?.id) {
    console.error("Пользователь не авторизован");
    return res.status(401).json({ error: "Пользователь не авторизован" });
  }

  const { avatarUrl } = req.body;
  const userId = Number(session.user.id); // Получаем ID пользователя из сессии

  if (!avatarUrl) {
    console.error("URL изображения не предоставлен");
    return res.status(400).json({ error: "URL изображения не предоставлен" });
  }

  try {
    console.log("Обновляем пользователя с ID:", userId);
    console.log("URL аватара:", avatarUrl);

    // Обновляем запись пользователя в базе данных
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: avatarUrl }, // Сохраняем полный путь к изображению
    });

    console.log("Пользователь обновлен:", updatedUser);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    return res.status(500).json({ error: "Не удалось обновить аватар" });
  }
}
