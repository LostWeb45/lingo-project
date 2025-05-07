"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateEventPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Выберите изображение");
      return;
    }

    setLoading(true);

    try {
      // 1. Загружаем картинку на микросервис
      const formData = new FormData();
      formData.append("eventImage", file);

      const uploadRes = await fetch("http://localhost:4000/upload/event", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url; // Пример: "/images/12345.png"

      // 2. Отправляем данные в наш API
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      if (res.ok) {
        toast.success("Событие создано");
        router.push("/events"); // или куда хочешь
      } else {
        toast.error("Ошибка при создании");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Создать тестовое событие"}
        </button>
      </form>
    </div>
  );
}
