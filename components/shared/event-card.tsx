import { Avatar, Button } from "../ui";
import { format, addMinutes, parse } from "date-fns";
import { ru } from "date-fns/locale";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Event, User } from "@prisma/client";

interface EventCardProps {
  event: Event;
  createdBy: User;
  images: string[];
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
  console.log(event);

  return (
    <div className="transition-shadow duration-300 hover:shadow-lg">
      <div className="h-[200px] overflow-hidden">
        <img
          src={
            event.images?.length > 0
              ? `/images/upload/${event.images[0]?.imageUrl}`
              : "/images/no-image.png"
          }
          alt="event image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col gap-[10px] bg-[#F5F6FA] p-[10px]">
        <div className="flex items-center justify-between">
          <Link className="flex justify-center items-center gap-3" href={"/"}>
            <Avatar className="cursor-pointer  w-[30px] h-[30px] hover:opacity-90 transition-opacity">
              <AvatarImage src={event.createdBy?.image ?? undefined} />
              <AvatarFallback className="bg-[white]">
                {event.createdBy.name?.charAt(0) ?? "П"}
              </AvatarFallback>
            </Avatar>
            <p className="text-[#2E1A1A] text-[13px] hover:text-[#3A5F9D] transition-colors">
              {event.createdBy.name?.split(" ")[0]}
            </p>
          </Link>

          <div>{event.age}+</div>
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
