// app/events/[id]/page.tsx
import { notFound } from "next/navigation";
import { Container } from "@/components/shared";
import Image from "next/image";

// Тип данных события — можешь адаптировать под свою структуру
interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  location: string;
  price: number;
  ageLimit?: number;
}

interface Props {
  params: { id: string };
}

export default async function EventPage({ params }: Props) {
  const eventId = params.id;

  // Получаем данные по API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${eventId}`,
    {
      cache: "no-store", // отключаем кэш для свежих данных
    }
  );

  if (!res.ok) return notFound();

  const event: Event = await res.json();

  return (
    <Container className="py-10 space-y-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>

      <Image
        src={event.imageUrl || "/images/default.jpg"}
        alt={event.title}
        width={800}
        height={400}
        className="rounded-xl object-cover"
      />

      <div className="text-gray-600">
        <p>
          <strong>Дата:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Место:</strong> {event.location}
        </p>
        <p>
          <strong>Цена:</strong> {event.price} ₽
        </p>
        {event.ageLimit && (
          <p>
            <strong>Возраст:</strong> {event.ageLimit}+
          </p>
        )}
      </div>

      <p className="whitespace-pre-wrap text-gray-800">{event.description}</p>
    </Container>
  );
}
