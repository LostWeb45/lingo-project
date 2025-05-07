import { useSearchParams } from "next/navigation";
import React from "react";
import { Event, EventImage, User } from "@prisma/client";

interface EventWithInfo {
  event: Event & {
    images: EventImage[];
    createdBy: User;
    participants: User[];
  };
}

export const useEvents = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = React.useState<EventWithInfo[]>([]);

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

  return { events, isLoading, error };
};
