"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Avatar } from "../ui";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Crown } from "lucide-react";

interface Props {
  eventId: number;
  initialParticipants: User[];
  createdBy: User;
  className?: string;
}

export const EventParticipants: React.FC<Props> = ({
  eventId,
  initialParticipants,
  className,
  createdBy,
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
    <div className={cn("mt-4", className)}>
      <h3 className="text-[20px] font-semibold mb-2">Участники:</h3>

      <ul className="flex flex-col gap-2">
        {participants.length === 0 ? (
          <p className="text-[16px] text-gray-500">Пока никого нет</p>
        ) : (
          participants.map((user) => {
            const isCreator = user.id === createdBy.id;

            return (
              <div
                className="w-full h-[80px] bg-[#f5f6fa] px-[19px] rounded-[2px] gap-4 flex items-center justify-between"
                key={user.id}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="cursor-pointer w-[50px] h-[50px] hover:opacity-90 transition-opacity">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback className="bg-white">
                      {user.name?.charAt(0) ?? "П"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-[#2E1A1A] text-[19px] hover:text-[#3A5F9D] transition-colors">
                      {user.name}
                    </p>
                  </div>
                </div>
                {isCreator && <Crown className="text-yellow-400" />}
              </div>
            );
          })
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
