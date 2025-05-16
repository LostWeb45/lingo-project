import { prisma } from "@/prisma/prisma-client";
import Link from "next/link";
import { Container, Title } from "@/components/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/auth-options";
import { redirect } from "next/navigation";

export default async function PendingEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const pendingEvents = await prisma.event.findMany({
    where: {
      status: {
        name: "На проверке",
      },
    },
    include: {
      town: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Container className="space-y-6">
      <Title text="События на проверке" />
      {pendingEvents.length === 0 ? (
        <p>Нет событий на проверке.</p>
      ) : (
        <ul className="space-y-4">
          {pendingEvents.map((event) => (
            <li key={event.id} className="border p-4 rounded">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p>
                {event.category.name} — {event.town.name}
              </p>
              <div className="flex gap-4 mt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="text-blue-600 underline"
                >
                  Посмотреть
                </Link>
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="text-yellow-600 underline"
                >
                  Редактировать
                </Link>
              </div>
              <div className="flex gap-4 mt-6">
                <form action={`/api/events/${event.id}/approve`} method="POST">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                  >
                    Принять
                  </button>
                </form>
                <form action={`/api/events/${event.id}/reject`} method="POST">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
                  >
                    Отклонить
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
