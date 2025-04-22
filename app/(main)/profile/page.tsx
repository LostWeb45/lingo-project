// app/(main)/profile/page.tsx
"use client";

import { Button } from "@/components/ui";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Ваш профиль</h1>

        {session && (
          <div className="mb-6 space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Имя:</span> {session.user?.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email:</span>{" "}
              {session.user?.email}
            </p>
            {/* <p className="text-lg">
              <span className="font-semibold">Телефон:</span>{" "}
              {session.user?.phone || "Не указан"}
            </p> */}
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
