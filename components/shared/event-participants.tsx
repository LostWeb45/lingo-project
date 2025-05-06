"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  eventId: number;
  initialParticipants: User[];
  className?: string;
}

export const EventParticipants: React.FC<Props> = ({
  eventId,
  initialParticipants,
  className,
}) => {
  const { data: session } = useSession();
  const currentUser = session?.user as User | undefined;
  const [participants, setParticipants] =
    React.useState<User[]>(initialParticipants);
  const [isPending, startTransition] = React.useTransition();

  if (!currentUser) {
    return (
      <p className="mt-4 text-[16px] text-gray-500">
        Только авторизованные пользователи могут вступать.
      </p>
    );
  }

  const isJoined = participants.some((p) => p.email === currentUser.email);

  const handleJoin = async () => {
    startTransition(async () => {
      const res = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setParticipants((prev) => [...prev, data.user]);
        toast.success("Вы успешно вступили в событие");
      } else if (res.status === 401) {
        toast.error("Необходимо войти в аккаунт");
      } else {
        toast.error(data.message || "Ошибка при вступлении");
      }
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-[20px] font-semibold mb-2">Участники события:</h3>

      <ul className="flex flex-col gap-2">
        {participants.length === 0 ? (
          <p className="text-[16px] text-gray-500">Пока никого нет</p>
        ) : (
          participants.map((user) => (
            <li
              key={user.id}
              className="text-[16px] text-[#1D3C6A] font-medium"
            >
              👤 {user.name}
            </li>
          ))
        )}
      </ul>

      {!isJoined ? (
        <button
          onClick={handleJoin}
          disabled={isPending}
          className="mt-4 px-4 py-2 rounded-md bg-[#1D3C6A] text-white hover:bg-opacity-90 transition disabled:opacity-60"
        >
          {isPending ? "Вступаю..." : "Вступить"}
        </button>
      ) : (
        <p className="mt-4 text-green-600 font-semibold">
          Вы участвуете в событии 🎉
        </p>
      )}
    </div>
  );
};
