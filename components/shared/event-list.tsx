"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { EventCard } from "./event-card";

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  price: number;
  place: string;
  category: { name: string };
  town: { name: string };
  images: { imageUrl: string }[];
}

export const EventList: React.FC = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  return (
    <div className="event-list">
      {isLoading ? (
        <div>Загрузка...</div>
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
