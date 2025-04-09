import { Container, Filters, Title } from "@/components/shared/";
import { Button } from "@/components/ui/button";
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

  return (
    <>
      <Container>
        <Title text="Все события" size="lg" url="./" />
        <Filters />
      </Container>
    </>
  );
}
