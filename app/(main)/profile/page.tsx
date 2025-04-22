"use client";

import { Button } from "@/components/ui";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          {session?.user?.image && (
            <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
              <img
                src={session.user.image}
                alt="avatar"
                className="object-fill"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-center">Ваш профиль</h1>
          {session?.user?.name && (
            <p className="text-gray-600 mt-1">@{session.user.name}</p>
          )}
        </div>

        {session && (
          <div className="mb-6 space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{session.user?.email}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="font-medium">
                {session.user?.phone || "Не указан"}
              </p>
            </div>

            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h2 className="font-bold text-sm mb-2 text-gray-600">
                Данные сессии (для отладки):
              </h2>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <Button
          className="gap-2 h-12 w-full"
          variant={"outline"}
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="mr-2"
          >
            <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z" />
          </svg>
          Выйти
        </Button>
      </div>
    </div>
  );
}
