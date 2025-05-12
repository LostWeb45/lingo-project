import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      startDate,
      startTime,
      duration,
      price,
      place,
      age,
      categoryId,
      townId,
      imageUrls,
    } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        startTime,
        duration: Number(duration),
        price: Number(price) || 0,
        place,
        age: Number(age),
        categoryId: Number(categoryId),
        townId: Number(townId),
        createdById: 11, // TODO: заменить на ID авторизованного пользователя
        statusId: 5, // "На проверке" или как в seed
      },
    });

    if (Array.isArray(imageUrls)) {
      await prisma.eventImage.createMany({
        data: imageUrls.map((url: string) => ({
          imageUrl: url,
          eventId: event.id,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Ошибка создания события:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
