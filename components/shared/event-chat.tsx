"use client";

import { User } from "@prisma/client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

interface ChatMessage {
  id: number;
  eventId?: number;
  senderId: number;
  message: string;
  createdAt: string;
}

export function EventChat({
  eventId,
  userId,
  participants,
}: {
  eventId: number;
  userId: number;
  participants: User[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<typeof Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isParticipant = participants.some((p) => p.id === userId);

  useEffect(() => {
    if (!isParticipant) return;

    fetch(`http://localhost:5000/events/${eventId}/messages`)
      .then((res) => res.json())
      .then((data: ChatMessage[]) => setMessages(data));

    socketRef.current = io("http://localhost:5001", {
      query: { eventId: eventId.toString(), userId: userId.toString() },
    });

    socketRef.current.on("message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [eventId, userId, isParticipant]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("message", input);
      setInput("");
    }
  };

  if (!isParticipant) {
    return (
      <div className="p-4 mt-2 w-full h-[350px] flex items-center justify-center bg-gray-100 text-gray-600 text-center rounded">
        Только участники могут пользоваться чатом
      </div>
    );
  }

  return (
    <div className="p-4 mt-6 w-full h-[300px] flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto mb-2 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.senderId === userId ? "text-right" : "text-left"
            }`}
          >
            <span className="font-semibold">
              {msg.senderId === userId
                ? "Вы"
                : participants.find((p) => p.id === msg.senderId)?.name ||
                  `Пользователь ${msg.senderId}`}
              :{" "}
            </span>
            <span>{msg.message}</span>
            <br />
            <small className="text-xs text-gray-400">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Напишите сообщение..."
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={sendMessage}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
