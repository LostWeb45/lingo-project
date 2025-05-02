"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { EventCard } from "./event-card";
import { Skeleton } from "../ui";
import { cn } from "@/lib/utils";
import { Event } from "@prisma/client";

interface Props {
  className?: string;
}

export const EventList: React.FC<Props> = (className) => {
  const searchParams = useSearchParams();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(
        searchParams.toString()
      ).toString();
      const response = await fetch(`/api/events/search?${queryParams}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки событий");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      setError("Произошла ошибка при загрузке событий");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, [searchParams]);
  console.log(events);

  return (
    <div className={cn("mt-[30px] event-list", className)}>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="event-skeleton">
              <Skeleton className="h-40 w-full rounded-md" />{" "}
              {/* Скелетон для изображения */}
              <Skeleton className="h-6 mt-4 w-3/4 rounded-md" />{" "}
              {/* Скелетон для заголовка */}
              <Skeleton className="h-4 mt-2 w-5/6 rounded-md" />{" "}
              {/* Скелетон для текста */}
              <Skeleton className="h-4 mt-2 w-1/2 rounded-md" />{" "}
              {/* Скелетон для текста */}
            </div>
          ))}
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div>Нет событий по выбранным фильтрам.</div>
      )}
    </div>
  );
};
