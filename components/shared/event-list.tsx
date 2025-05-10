"use client";

import React from "react";
import { EventCard } from "./event-card";
import { Skeleton } from "../ui";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";

interface Props {
  className?: string;
}

export const EventList: React.FC<Props> = ({ className }) => {
  const { events, isLoading, error, hasMore, fetchEvents } = useEvents();

  return (
    <div className={cn("mt-[30px] w-full", className)}>
      {isLoading && events.length === 0 ? (
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
        <div className="text-red-500">{error}</div>
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                participants={event.participants}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchEvents(false)}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Показать ещё
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-500 text-center mt-6">
          Нет событий по выбранным фильтрам.
        </div>
      )}
    </div>
  );
};
