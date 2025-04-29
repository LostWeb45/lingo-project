import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
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
  const categories = await prisma.category.createMany({
    data: [
      { name: "Концерт" },
      { name: "Выставка" },
      { name: "Фестиваль" },
      { name: "Спорт" },
      { name: "Театр" },
      { name: "Кино" },
      { name: "Образование" },
      { name: "Еда и напитки" },
      { name: "Кулинария" },
      { name: "Туризм" },
      { name: "Мода" },
      { name: "Бизнес" },
    ],
  });

  // Создаем города
  const towns = await prisma.town.createMany({
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
        password: hashSync("admin11", 10),
        role: "ADMIN",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Организатор",
        email: "organizer@example.com",
        password: hashSync("pols11", 10),
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

  // Создаем события
  const [
    upcomingStatus,
    concertCategory,
    exhibitionCategory,
    festivalCategory,
    sportsCategory,
    theaterCategory,
    cinemaCategory,
    foodCategory,
    educationCategory,
    culinaryCategory,
    tourismCategory,
    fashionCategory,
    businessCategory,
    moscowTown,
    spbTown,
  ] = await Promise.all([
    prisma.status.findFirstOrThrow({ where: { name: "Предстоящее" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Концерт" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Выставка" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Фестиваль" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Спорт" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Театр" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Кино" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Еда и напитки" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Образование" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Кулинария" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Туризм" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Мода" } }),
    prisma.category.findFirstOrThrow({ where: { name: "Бизнес" } }),
    prisma.town.findFirstOrThrow({ where: { name: "Москва" } }),
    prisma.town.findFirstOrThrow({ where: { name: "Санкт-Петербург" } }),
  ]);

  await prisma.event.createMany({
    data: [
      // Концерты
      {
        title: "Рок концерт",
        description: "Большой рок концерт с участием известных групп",
        startDate: new Date("2023-12-15"),
        startTime: "19:00",
        duration: 180,
        age: 16,
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
        age: 18,
        place: "Джаз кафе",
        createdById: organizer.id,
        categoryId: concertCategory.id,
        townId: moscowTown.id,
        statusId: upcomingStatus.id,
      },

      // Выставки
      {
        title: "Международная выставка искусства",
        description:
          "Выставка современного искусства с участием художников со всего мира.",
        startDate: new Date("2023-12-25"),
        startTime: "10:00",
        duration: 240,
        age: 0,
        place: "Московский выставочный центр",
        createdById: organizer.id,
        categoryId: exhibitionCategory.id,
        townId: moscowTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Фотовыставка",
        description:
          "Выставка фотографий профессиональных и начинающих фотографов.",
        startDate: new Date("2024-01-10"),
        startTime: "11:00",
        duration: 180,
        age: 0,
        place: "Центральный выставочный зал",
        createdById: organizer.id,
        categoryId: exhibitionCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },

      // Фестивали
      {
        title: "Фестиваль уличной еды",
        description: "Фестиваль с участием лучших уличных поваров.",
        startDate: new Date("2024-01-05"),
        startTime: "12:00",
        duration: 180,
        age: 0,
        place: "Центральный парк",
        createdById: organizer.id,
        categoryId: festivalCategory.id,
        townId: moscowTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Фестиваль музыки и танцев",
        description: "Танцевальные и музыкальные номера на улице.",
        startDate: new Date("2024-01-12"),
        startTime: "14:00",
        duration: 150,
        age: 0,
        place: "Открытая площадка в парке",
        createdById: organizer.id,
        categoryId: festivalCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },

      // Спортивные события
      {
        title: "Матч по футболу",
        description: "Матч чемпионата страны по футболу.",
        startDate: new Date("2024-01-20"),
        startTime: "19:00",
        duration: 120,
        age: 0,
        place: "Стадион Спартак",
        createdById: organizer.id,
        categoryId: sportsCategory.id,
        townId: moscowTown.id,
        statusId: upcomingStatus.id,
      },
      {
        title: "Марафон",
        description: "Городской марафон для всех желающих.",
        startDate: new Date("2024-01-25"),
        startTime: "09:00",
        duration: 240,
        age: 0,
        place: "Центр города",
        createdById: organizer.id,
        categoryId: sportsCategory.id,
        townId: spbTown.id,
        statusId: upcomingStatus.id,
      },

      // Другие события...
    ],
  });

  // Добавляем изображения к событиям
  const events = await prisma.event.findMany();

  await prisma.eventImage.createMany({
    data: [
      {
        imageUrl: "/images/events/rock-concert1.jpg",
        eventId: events[0].id,
      },
      {
        imageUrl: "/images/events/rock-concert2.jpg",
        eventId: events[0].id,
      },
      {
        imageUrl: "/images/events/jazz-night.jpg",
        eventId: events[1].id,
      },
      {
        imageUrl: "/images/events/exhibition-art.jpg",
        eventId: events[2].id,
      },
      {
        imageUrl: "/images/events/food-festival.jpg",
        eventId: events[3].id,
      },
      {
        imageUrl: "/images/events/football-match.jpg",
        eventId: events[4].id,
      },
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
