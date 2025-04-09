import { prisma } from "@/prisma/prisma-client";

export default async function Home() {
  // Временно, потом переделат в апи и добавить скелетоны
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: "asc",
    },
    include: {
      images: {
        select: {
          imageUrl: true,
        },
      },
    },
  });
  console.log(events);

  return <h1>Главная страница</h1>;
}
