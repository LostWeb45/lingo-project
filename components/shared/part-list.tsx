import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@prisma/client";

interface ParticipantsListProps {
  participants: User[];
  maxParticipants: number;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  maxParticipants,
}) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: maxParticipants }).map((_, index) => {
        const participant = participants[index];

        return (
          <Avatar
            key={index}
            className="cursor-pointer w-[50px] h-[50px] hover:opacity-90 transition-opacity border border-gray-300"
          >
            <AvatarImage
              src={participant?.image ?? undefined}
              className="w-full h-full object-cover rounded-full"
            />
            <AvatarFallback>
              {participant?.name?.charAt(0).toUpperCase() ?? "+"}
            </AvatarFallback>
          </Avatar>
        );
      })}
    </div>
  );
};
