"use client";

import React from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Crown, Plus } from "lucide-react";

interface Event {
  id: number;
  title: string;
  category: { name: string };
  town: { name: string };
  images: { imageUrl: string }[];
  status: { name: string };
  createdById: string;
}

export default function MyEventsPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      fetch("/api/user/participated-events")
        .then((res) => res.json())
        .then((data) => setEvents(data));
    }
  }, [status, session, router]);

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

  const upcomingEvents = events.filter(
    (event) => event.status?.name === "Предстоящее"
  );
  const pendingEvents = events.filter(
    (event) => event.status?.name === "На проверке"
  );

  const renderEventItem = (event: Event) => {
    const isCreator = event.createdById == session?.user?.id;

    return (
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
        {isCreator ? (
          <Crown className="text-yellow-400" />
        ) : (
          <button
            onClick={() => handleLeave(event.id)}
            disabled={isPending}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            Выйти
          </button>
        )}
      </li>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Мои события</h1>
        <button
          onClick={() => redirect("/events/create")}
          className="flex justify-center items-center relative gap-2 border font-semibold border-[#aebdf3] rounded-[2px] cursor-pointer px-[15px] py-[6px] duration-200 hover:bg-[#e6e6f4]"
        >
          <p className="text-[#3A5F9D] text-[16px]">Создать событие</p>
          <Plus className="text-[#3A5F9D]" width={20} />
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">Вы ещё не участвуете в событиях</p>
      ) : (
        <>
          {upcomingEvents.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">Предстоящие</h2>
              <ul className="space-y-4">
                {upcomingEvents.map(renderEventItem)}
              </ul>
            </>
          )}
          {pendingEvents.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">На проверке</h2>
              <ul className="space-y-4">
                {pendingEvents.map(renderEventItem)}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
