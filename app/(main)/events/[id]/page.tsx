import { prisma } from "@/prisma/prisma-client";
import { Container, Title } from "@/components/shared";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      createdBy: true,
      category: true,
      town: true,
      status: true,
      images: true,
    },
  });

  if (!event) return <Container>Событие не найдено</Container>;

  return (
    <Container className="space-y-6">
      <Title text={event.title} />
      <p>{event.description}</p>
      <p>Дата: {new Date(event.startDate).toLocaleString()}</p>
      <p>Цена: {event.price}₽</p>
      <p>Категория: {event.category.name}</p>
      <p>Город: {event.town.name}</p>
      <p>Статус: {event.status.name}</p>
      <p>Организатор: {event.createdBy.name}</p>
      {event.images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {event.images.map((img, i) => (
            <img
              key={i}
              src={`/images/upload/${img.imageUrl}`}
              alt={`img-${i}`}
              className="rounded-xl"
            />
          ))}
        </div>
      )}
    </Container>
  );
}
