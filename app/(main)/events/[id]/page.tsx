import { prisma } from "@/prisma/prisma-client";
import { Container, Title } from "@/components/shared";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/caruosel";

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

  const hasMultipleImages = event.images.length > 1;

  return (
    <Container className="flex justify-between gap-[30px]">
      <div className="w-[65%]">
        {event.images.length > 0 && (
          <Carousel>
            <CarouselContent>
              {event.images.map((img, i) => (
                <CarouselItem key={i}>
                  <div className="carousel-image-container relative overflow-hidden">
                    <img
                      src={`/images/upload/${img.imageUrl}`}
                      alt={`img-${i}`}
                      className="carousel-image object-cover w-full h-full transition-all duration-300 transform hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {hasMultipleImages && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black rounded-full p-2 hover:bg-opacity-50 z-10" />
                <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black rounded-full p-2 hover:bg-opacity-50 z-10" />
              </>
            )}
          </Carousel>
        )}

        <Title text={event.title} />
      </div>

      <div className="w-[35%]">
        <p>{event.description}</p>
        <p>Дата: {new Date(event.startDate).toLocaleString()}</p>
        <p>Цена: {event.price}₽</p>
        <p>Категория: {event.category.name}</p>
        <p>Город: {event.town.name}</p>
        <p>Статус: {event.status.name}</p>
        <p>Организатор: {event.createdBy.name}</p>
      </div>
    </Container>
  );
}
