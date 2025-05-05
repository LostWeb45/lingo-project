import { prisma } from "@/prisma/prisma-client";
import { Container, Title } from "@/components/shared";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/caruosel";
import { getFormattedDateTime } from "@/lib";

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
    <Container className="flex flex-col">
      {event.images.length > 0 && (
        <Carousel className="ml-[-1px] w-full">
          <CarouselContent>
            {event.images.map((img, i) => (
              <CarouselItem key={i}>
                <div className="relative overflow-hidden aspect-[16/9] mx-auto">
                  <img
                    src={`/images/upload/${img.imageUrl}`}
                    alt={`img-${i}`}
                    className="object-cover w-full h-full transition-all duration-300 transform hover:scale-105"
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
      <div className="flex justify-between gap-[30px]">
        <div className="flex flex-col gap-[15px] w-[65%]">
          <Title text={event.title} className="font-semibold" />
          <p className="font-bold text-[17px] opacity-50 text-[#1D3C6A]">
            {event.age}+
          </p>
          <hr className="w-[300px]" />
          <p>{event.description}</p>
        </div>

        <div className="w-[35%] mt-[15px]">
          <div>
            <p className="text-[22px] font-medium">Подробности</p>
            <div>
              <p>
                Дата и время:{" "}
                {getFormattedDateTime(
                  new Date(event.startDate),
                  event.startTime,
                  event.duration
                )}
              </p>
              <p>Цена: {event.price}₽</p>
              <p>Возраст: {event.age}+</p>
              <p>Категория: {event.category.name}</p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </Container>
  );
}
