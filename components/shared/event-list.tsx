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

export const EventList: React.FC<Props> = ({ className }) => {
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

  return (
    <div className={cn("mt-[30px] w-full", className)}>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-6  w-2/5" />
              <Skeleton className="h-8  w-5/6" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
              <Skeleton className="h-10  w-[150px]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
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
