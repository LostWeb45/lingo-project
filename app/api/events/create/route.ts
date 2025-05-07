import { prisma } from "@/prisma/prisma-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { imageUrl } = req.body;

  try {
    // 💡 Создаем событие с минимальными данными
    const event = await prisma.event.create({
      data: {
        title: "Тестовое событие",
        description: "Просто тест",
        startDate: new Date(),
        startTime: "12:00",
        duration: 60,
        place: "Где-то",
        createdById: 1, // ⚠️ временно: ID пользователя-заглушка
        categoryId: 1, // ⚠️ временно
        townId: 1, // ⚠️ временно
        statusId: 1, // ⚠️ временно
        images: {
          create: [{ imageUrl }],
        },
      },
    });

    res.status(200).json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при создании события" });
  }
}
