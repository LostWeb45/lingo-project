"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    duration: 60,
    price: "",
    place: "",
    age: 0,
    categoryId: "",
    townId: "7", // Санкт-Петербург — id = 7
    participantsCount: 0, // Новое поле для количества участников
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls: string[] = [];

      if (images) {
        const uploads = Array.from(images).map(async (image) => {
          const imgForm = new FormData();
          imgForm.append("eventImage", image);

          const res = await fetch("http://localhost:4000/upload/event", {
            method: "POST",
            body: imgForm,
          });

          if (!res.ok) throw new Error("Ошибка загрузки картинки");

          const data = await res.json();
          imageUrls.push(data.url);
        });

        await Promise.all(uploads);
      }

      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrls }),
      });

      if (res.ok) {
        router.push("/events");
      } else {
        alert("Ошибка при создании события");
      }
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при создании события");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Создать событие</h1>

      <input
        name="title"
        onChange={handleChange}
        placeholder="Название"
        required
        className="w-full border p-2"
      />
      <textarea
        name="description"
        onChange={handleChange}
        placeholder="Описание"
        required
        className="w-full border p-2"
      />
      <input
        type="date"
        name="startDate"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        type="time"
        name="startTime"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        type="number"
        name="duration"
        onChange={handleChange}
        placeholder="Продолжительность (мин)"
        required
        className="w-full border p-2"
      />
      <input
        type="number"
        name="price"
        onChange={handleChange}
        placeholder="Цена"
        className="w-full border p-2"
      />
      <input
        name="place"
        onChange={handleChange}
        placeholder="Место проведения"
        required
        className="w-full border p-2"
      />
      <input
        type="number"
        name="age"
        onChange={handleChange}
        placeholder="Возрастное ограничение"
        className="w-full border p-2"
      />
      <input
        type="number"
        name="participantsCount"
        onChange={handleChange}
        placeholder="Количество участников"
        required
        className="w-full border p-2"
      />

      <select
        name="categoryId"
        onChange={handleChange}
        required
        className="w-full border p-2"
      >
        <option value="">Выбрать категорию</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        name="townId"
        onChange={handleChange}
        required
        className="w-full border p-2"
        value={form.townId} // Значение выбирается из состояния
        disabled
      >
        <option value="7">Санкт-Петербург</option>
      </select>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
      />

      <button
        disabled={loading}
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Создание..." : "Создать"}
      </button>
    </form>
  );
}
