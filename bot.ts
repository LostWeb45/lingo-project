import { Context, Telegraf } from "telegraf";
import axios from "axios";
import { parse } from "node-html-parser";
import "dotenv/config";

const BOT_TOKEN = process.env.BOT_TOKEN as string;
const bot = new Telegraf(BOT_TOKEN);

// Функция безопасного ответа на сообщение
async function safeReply(ctx: Context, text: string): Promise<void> {
  try {
    await ctx.reply(text);
  } catch (err: any) {
    if (
      err.response?.statusCode === 403 ||
      err.description?.includes("bot was kicked")
    ) {
      console.warn("Бот был удалён из группы.");
    } else {
      console.error("Ошибка при отправке сообщения:", err);
    }
  }
}

// Функция для очистки HTML-форматирования из описания события
function formatDescription(rawHtml: string) {
  const root = parse(rawHtml);
  return root.text.trim();
}

// Обработчик события добавления бота в группу
bot.on("my_chat_member", async (ctx) => {
  const chat = ctx.chat;
  if (!chat || chat.type === "private") return;

  const chatId = chat.id;
  const title = chat.title;

  console.log(`Бот добавлен в группу: ${title}, ID: ${chatId}`);

  try {
    await axios.post("http://localhost:3000/api/telegram/group", {
      chatId,
      title,
    });
    await safeReply(ctx, "Группа успешно связана с событием 🎉");
  } catch (err) {
    console.error("Ошибка при отправке chat_id:", err);
    await safeReply(ctx, "Ошибка при сохранении группы 😞");
  }
});

// Команда для получения информации о событии
bot.command("event", async (ctx) => {
  const chatId = ctx.chat?.id;
  if (!chatId) {
    return safeReply(ctx, "Эта команда работает только в группах.");
  }

  try {
    // Получение eventId по chatId
    const eventIdResp = await axios.post(
      "http://localhost:3000/api/telegram/event-byid",
      { chatId }
    );
    if (!eventIdResp.data.eventId) {
      return safeReply(ctx, "Событие для этой группы не найдено.");
    }
    const BASE_URL = "https://localhost:4000";
    const eventId = eventIdResp.data.eventId;

    // Получение данных события по eventId
    const eventResp = await axios.get(
      `http://localhost:3000/api/events?id=${eventId}`
    );
    if (!eventResp.data) {
      return safeReply(ctx, "Ошибка при получении информации о событии.");
    }

    const event = eventResp.data;
    const formattedDescription = formatDescription(
      event.description || "Отсутствует"
    );

    const message = `
    📢 *Информация о событии*

    *📌 Название:* ${event.title}
    *📍 Место проведения:* ${event.place}
    *📅 Дата:* ${new Date(event.startDate).toLocaleDateString()}
    *⏰ Время начала:* ${event.startTime}
    *⌛ Продолжительность:* ${event.duration} мин.
    *💰 Стоимость:* ${event.price > 0 ? `${event.price} ₽` : "Бесплатно"}
    *🔞 Возрастное ограничение:* ${event.age}+

    *📝 Описание:*
    ${formattedDescription}

    🏷️ *Категория:* ${event.category?.name || "Не указана"}
    `;
    // Отправка изображения события, если оно есть
    // if (event.images && event.images.length > 0) {
    //   for (const image of event.images) {
    //     const imageUrl = image.imageUrl.startsWith("http")
    //       ? image.imageUrl
    //       : `${BASE_URL}${image.imageUrl}`;
    //     await ctx.replyWithPhoto(imageUrl);
    //   }
    // }
    await safeReply(ctx, message);
  } catch (err) {
    console.error("Ошибка при получении события:", err);
    await safeReply(ctx, "Ошибка при получении информации о событии.");
  }
});

// Команда для получения ID группы
bot.command("id", (ctx) => {
  const chat = ctx.chat;
  if (chat) {
    safeReply(ctx, `ID этой группы: ${chat.id}`);
  }
});

// bot.command("hello-blin", (ctx) => {
//   safeReply(ctx, `Иди на хуй <3`);
// });

bot.command("start", (ctx) => {
  safeReply(ctx, "Привет, я бот для событий! Добавьте меня в группу ✨");
});

// Запуск бота
bot.launch();
console.log("Бот запущен");
