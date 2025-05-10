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

const PAGE_SIZE = 9;

export const useEvents = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = React.useState<EventWithInfo[]>([]);
  const [offset, setOffset] = React.useState<number>(0);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEvents = async (reset = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(searchParams.toString());
      query.set("limit", PAGE_SIZE.toString());
      query.set("offset", reset ? "0" : offset.toString());
      query.set("availableOnly", "true");

      const response = await fetch(`/api/events/search?${query.toString()}`);
      if (!response.ok) throw new Error("Ошибка загрузки событий");

      const data = await response.json();
      if (reset) {
        setEvents(data);
        setOffset(PAGE_SIZE);
      } else {
        setEvents((prev) => [...prev, ...data]);
        setOffset((prev) => prev + PAGE_SIZE);
      }

      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch (error) {
      setError("Произошла ошибка при загрузке событий");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchEvents(true);
  }, [searchParams]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchEvents();
    }
  };

  return { events, isLoading, error, loadMore, hasMore };
};
