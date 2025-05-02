import { Event } from "@prisma/client";
import { Button } from "../ui";
import { format, addMinutes, parse } from "date-fns";
import { ru } from "date-fns/locale";

interface EventCardProps {
  event: Event;
}

const getFormattedDateTime = (date: Date, time: string, duration: number) => {
  const start = parse(time, "HH:mm", date);
  const end = addMinutes(start, duration);

  const datePart = format(start, "d MMMM", { locale: ru });
  const startTime = format(start, "HH:mm");
  const endTime = format(end, "HH:mm");

  return `${datePart} ${startTime}—${endTime}`;
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div>
      <div className="h-[200px] overflow-hidden">
        <img
          src={
            event.images.length > 0
              ? `${event.images[0].imageUrl}`
              : "/images/no-image.png"
          }
          alt="event image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col gap-[10px] bg-[#F5F6FA] p-[10px]">
        <div className="flex items-center justify-between">
          <div>Пользователь</div>
          <div>16+</div>
        </div>
        <h3 className="text-[19px] font-semibold">{event.title}</h3>
        <div className="flex flex-col">
          <div>
            Адрес: <span>{event.place}</span>
          </div>
          <div>
            Дата и время:{" "}
            {getFormattedDateTime(
              new Date(event.startDate),
              event.startTime,
              event.duration
            )}
          </div>
        </div>
        <div>
          <Button className="w-[150px] h-[42px] text-[14px]">
            {event.price ? `${event.price}₽` : "Вступить"}
          </Button>
        </div>
      </div>
    </div>
  );
};
