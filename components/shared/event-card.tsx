import { Event } from "@prisma/client";
import { Button } from "../ui";

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div>
      <img src={"/images/no-image.png"} alt="" />
      <div>
        <div className="flex items-center justify-between">
          <div>Пользователь</div>
          <div>16+</div>
        </div>
        <h3>Название мероприятия</h3>
        <div className="flex flex-col">
          <div>Адрес:</div>
          <div>Дата и время:</div>
        </div>
        <div>
          <Button>{event.price ? `${event.price}₽` : "Вступить"}</Button>
        </div>
      </div>
    </div>

    // <div className="event-card p-4 border rounded-lg shadow-md">
    //   <h3 className="text-xl font-semibold">{event.title}</h3>
    //   <p className="text-gray-500">{event.description}</p>
    //   <p className="text-gray-700">
    //     Дата: {new Date(event.startDate).toLocaleDateString()}
    //   </p>
    //   <p className="text-gray-700">Место: {event.place}</p>
    //   <p className="text-gray-700">Категория: {event.category.name}</p>
    //   <p className="text-gray-700">Город: {event.town.name}</p>
    //   <p className="text-gray-700">
    //     Цена: {event.price ? `${event.price}₽` : "Бесплатно"}
    //   </p>
    //   {event.images.length > 0 && (
    //     <img
    //       src={event.images[0].imageUrl}
    //       alt={event.title}
    //       className="mt-2 w-full h-40 object-cover rounded-lg"
    //     />
    //   )}
    // </div>
  );
};
