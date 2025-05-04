import { prisma } from "@/prisma/prisma-client";

export async function getEvents(req, res) {
  try {
    const events = await prisma.event.findMany({
      where: { ...req.query },
    });

    const totalEvents = await prisma.event.count({
      where: { ...req.query },
    });

    res.json({ data: events, total: totalEvents });
  } catch (error) {
    res.status(500).json({ error: "Произошла ошибка на сервере" });
  }
}
