import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Удаление данных в правильном порядке (с учетом foreign key constraints)
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.eventImage.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.town.deleteMany();
  await prisma.status.deleteMany();

  // Создаем статусы событий
  await prisma.status.createMany({
    data: [
      { name: "Предстоящее" },
      { name: "В процессе" },
      { name: "Завершенное" },
      { name: "Отмененное" },
    ],
  });

  // Создаем категории
  await prisma.category.createMany({
    data: [
      { name: "Концерт" },
      { name: "Выставка" },
      { name: "Фестиваль" },
      { name: "Спорт" },
      { name: "Театр" },
      { name: "Кино" },
      { name: "Образование" },
      { name: "Еда и напитки" },
    ],
  });

  // Создаем города
  await prisma.town.createMany({
    data: [
      { name: "Москва" },
      { name: "Санкт-Петербург" },
      { name: "Новосибирск" },
      { name: "Екатеринбург" },
      { name: "Казань" },
    ],
  });

  // Создаем тестовых пользователей
  const [admin, organizer, user] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Администратор",
        email: "admin@example.com",
        password: "$2a$10$X8L9.3XvJzZrF.5jZ5W4E.XxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
        role: "ADMIN",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Организатор",
        email: "organizer@example.com",
        password: "$2a$10$X8L9.3XvJzZrF.5jZ5W4E.XxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
        role: "ORGANIZER",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Пользователь",
        email: "user@example.com",
        password: "$2a$10$X8L9.3XvJzZrF.5jZ5W4E.XxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
        role: "USER",
        emailVerified: new Date(),
      },
    }),
  ]);

  // Создаем тестовые события
  const [upcomingStatus, concertCategory, moscowTown] = await Promise.all([
    prisma.status.findFirstOrThrow({ where: { name: "Предстоящее" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Концерт" } }),
    prisma.town.findFirstOrThrow({ where: { name: "Москва" } }),
  ]);

  await prisma.event.createMany({
    data: [
      {
        title: "Рок концерт",
        description: "Большой рок концерт с участием известных групп",
        startDate: new Date("2023-12-15"),
        startTime: "19:00",
        duration: 180,
        place: "Стадион Лужники",
        createdById: organizer.id,
        categoryId: concertCategory.id,
        townId: moscowTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Джазовый вечер",
        description: "Вечер джазовой музыки в уютной атмосфере",
        startDate: new Date("2023-12-20"),
        startTime: "20:00",
        duration: 120,
        place: "Джаз кафе",
        createdById: organizer.id,
        categoryId: concertCategory.id,
        townId: moscowTown.id,
        statusId: upcomingStatus.id,
      },
    ],
  });

  // Добавляем изображения к событиям
  const events = await prisma.event.findMany();
  await prisma.eventImage.createMany({
    data: [
      {
        imageUrl: "https://example.com/rock-concert1.jpg",
        eventId: events[0].id,
      },
      {
        imageUrl: "https://example.com/rock-concert2.jpg",
        eventId: events[0].id,
      },
      { imageUrl: "https://example.com/jazz-night.jpg", eventId: events[1].id },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
