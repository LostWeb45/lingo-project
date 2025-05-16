import { authOptions } from "@/constants/auth-options";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: { eventId: string; imageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { eventId, imageId } = context.params;

    if (!eventId || !imageId) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const image = await prisma.eventImage.findUnique({
      where: { id: parseInt(imageId) },
      include: { event: true },
    });

    if (!image || image.event.id !== parseInt(eventId)) {
      return NextResponse.json(
        { error: "Image not found or doesn't belong to event" },
        { status: 404 }
      );
    }

    await prisma.eventImage.delete({
      where: { id: image.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Ошибка удаления изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении изображения", details: error.message },
      { status: 500 }
    );
  }
}
