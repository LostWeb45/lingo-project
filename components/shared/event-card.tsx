import { Event } from "@prisma/client";

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="event-card p-4 border rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">{event.title}</h3>
      <p className="text-gray-500">{event.description}</p>
      <p className="text-gray-700">
        Дата: {new Date(event.startDate).toLocaleDateString()}
      </p>
      <p className="text-gray-700">Место: {event.place}</p>
      <p className="text-gray-700">Категория: {event.category.name}</p>
      <p className="text-gray-700">Город: {event.town.name}</p>
      <p className="text-gray-700">
        Цена: {event.price ? `${event.price}₽` : "Бесплатно"}
      </p>
      {event.images.length > 0 && (
        <img
          src={event.images[0].imageUrl}
          alt={event.title}
          className="mt-2 w-full h-40 object-cover rounded-lg"
        />
      )}
    </div>
  );
};
