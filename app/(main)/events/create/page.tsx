"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label, Separator } from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ru } from "date-fns/locale"; // Импортируем русскую локализацию для даты
import { cn } from "@/lib/utils";

type Category = { id: number; name: string };
type Town = { id: number; name: string };

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
    townId: "",
    participantsCount: 0,
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [towns, setTowns] = useState<Town[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
    fetch("/api/towns")
      .then((res) => res.json())
      .then(setTowns);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold">Создать событие</h1>
      <Separator />

      <div className="space-y-2">
        <Label htmlFor="title">Название</Label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Дата начала</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.startDate
                  ? format(new Date(form.startDate), "PPP", { locale: ru }) // Форматирование даты с русской локализацией
                  : "Выберите дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.startDate ? new Date(form.startDate) : undefined}
                onSelect={(date) =>
                  setForm((prev) => ({
                    ...prev,
                    startDate: date ? format(date, "yyyy-MM-dd") : "", // Форматирование даты при выборе
                  }))
                }
                locale={ru} // Использование русской локализации
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Время начала</Label>
          <Input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Продолжительность (мин)</Label>
          <Input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Цена</Label>
          <Input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="place">Место проведения</Label>
        <Input
          name="place"
          value={form.place}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Возрастное ограничение</Label>
          <Input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="participantsCount">Кол-во участников</Label>
          <Input
            type="number"
            name="participantsCount"
            value={form.participantsCount}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Категория</Label>
        <Select
          onValueChange={(value) => handleSelectChange("categoryId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выбрать категорию" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Город</Label>
        <Select onValueChange={(value) => handleSelectChange("townId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Выбрать город" />
          </SelectTrigger>
          <SelectContent>
            {towns.map((town) => (
              <SelectItem key={town.id} value={String(town.id)}>
                {town.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Изображения</Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Создание..." : "Создать"}
      </Button>
    </form>
  );
}
