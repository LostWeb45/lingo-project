"use client";

import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  category: { name: string };
  town: { name: string };
  images: { imageUrl: string }[];
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/user/participated-events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const handleLeave = (eventId: number) => {
    startTransition(async () => {
      const res = await fetch(`/api/events/${eventId}/leave`, {
        method: "POST",
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        toast.success("Вы вышли из события");
      } else {
        toast.error("Ошибка при выходе");
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Мои события</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">Вы ещё не участвуете в событиях</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <Link
                  href={`/events/${event.id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {event.title}
                </Link>
                <p className="text-sm text-gray-600">
                  {event.town.name} · {event.category.name}
                </p>
              </div>
              <button
                onClick={() => handleLeave(event.id)}
                disabled={isPending}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                Выйти
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
