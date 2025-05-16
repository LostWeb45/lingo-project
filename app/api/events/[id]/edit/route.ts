import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const eventId = parseInt(params.id);
  const body = await req.json();

  try {
    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        startTime: body.startTime,
        duration: body.duration,
        price: body.price ?? null,
        age: body.age,
        place: body.place,
        categoryId: body.categoryId,
        townId: body.townId,
        statusId: body.statusId,
        participantsCount: body.participantsCount,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Ошибка обновления события:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении события" },
      { status: 500 }
    );
  }
}
