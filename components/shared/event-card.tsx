"use client";

import React from "react";
import { Avatar, Button } from "../ui";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Event, EventImage, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { getFormattedDateTime } from "@/lib";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface EventCardProps {
  event: Event & {
    images: EventImage[];
    createdBy: User;
    participants: User[];
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [joining, startTransition] = React.useTransition();
  const [joined, setJoined] = React.useState(false);
  const { data: session } = useSession();
  const participantsCount = event.participants ? event.participants.length : 0;
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/events/${event.id}`);
  };
  console.log(event);

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) {
      toast.error("Сначала войдите в аккаунт");
      return;
    }

    startTransition(async () => {
      const res = await fetch(`/api/events/${event.id}/join`, {
        method: "POST",
      });

      if (res.ok) {
        setJoined(true);
        toast.success("Вы успешно вступили");
      } else {
        const err = await res.json();
        toast.error(err?.error || "Ошибка при вступлении");
      }
    });
  };

  return (
    <div
      className="transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
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
          <div className="flex justify-center items-center gap-3">
            <Avatar className="cursor-pointer w-[30px] h-[30px] hover:opacity-90 transition-opacity">
              <AvatarImage src={event.createdBy?.image ?? undefined} />
              <AvatarFallback className="bg-[white]">
                {event.createdBy.name?.charAt(0) ?? "П"}
              </AvatarFallback>
            </Avatar>
            <p className="text-[#2E1A1A] text-[13px] hover:text-[#3A5F9D] transition-colors">
              {event.createdBy.name?.split(" ")[0]}
            </p>
          </div>
          <div>{event.age}+</div>
        </div>

        <h3 className="text-[19px] font-semibold">{event.title}</h3>
        <div className="flex flex-col text-sm">
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

        {participantsCount >= event.participantsCount ? (
          <Button
            className="w-[150px] h-[42px] text-[14px] opacity-50 cursor-not-allowed"
            disabled
          >
            Места кончились
          </Button>
        ) : (
          <Button
            className={`w-[150px] h-[42px] text-[14px] ${
              joined ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleJoin}
            disabled={joined || joining}
            loading={joining}
          >
            {event.price
              ? `${event.price}₽`
              : joined
              ? "Вы участвуете"
              : "Вступить"}
          </Button>
        )}
      </div>
    </div>
  );
};
