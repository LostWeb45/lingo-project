// app/privacy/page.tsx или pages/privacy.tsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">
        Условия обработки персональных данных
      </h1>

      <p className="mb-4">
        Настоящие Условия обработки персональных данных (далее —{" "}
        <strong>Условия</strong>) регулируют порядок обработки и защиты
        персональных данных пользователей веб-приложения <strong>LinGo</strong>{" "}
        (далее — <strong>Сервис</strong>).
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Общие положения</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>
          Используя Сервис, пользователь выражает согласие с настоящими
          Условиями.
        </li>
        <li>
          Оператором персональных данных является владелец Сервиса:
          konstintinp@gmail.com.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        2. Состав обрабатываемых персональных данных
      </h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Имя и фамилия (если указаны)</li>
        <li>Email</li>
        <li>Telegram ID или username</li>
        <li>Данные из чатов и созданных событий</li>
        <li>Технические данные (IP, cookies, тип устройства и др.)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Цели обработки</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Регистрация и идентификация</li>
        <li>Обеспечение работы Сервиса</li>
        <li>Обратная связь через Telegram-бота</li>
        <li>Модерация мероприятий</li>
        <li>Уведомления и улучшение качества сервиса</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        4. Правовые основания
      </h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Согласие пользователя</li>
        <li>Исполнение пользовательского соглашения</li>
        <li>Законодательство РФ (ФЗ №152-ФЗ)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Условия хранения</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Хранение — пока пользователь пользуется Сервисом</li>
        <li>Удаление — по запросу или отзыву согласия</li>
        <li>Данные защищены техническими и организационными мерами</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        6. Передача третьим лицам
      </h2>
      <p className="mb-4">
        Данные не передаются третьим лицам без согласия пользователя, за
        исключением случаев, предусмотренных законом.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        7. Права пользователя
      </h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>Запрос на доступ, изменение или удаление данных</li>
        <li>Отзыв согласия на обработку</li>
        <li>Обращение в уполномоченные органы или суд</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Контакты</h2>
      <p className="mb-2">
        По вопросам обработки персональных данных вы можете связаться с нами по
        адресу:{" "}
        <a
          href="mailto:konstintinp@gmail.com"
          className="text-blue-600 underline"
        >
          konstintinp@gmail.com
        </a>
      </p>

      <p className="text-sm text-gray-600 mt-6">
        Используя наш Сервис, вы подтверждаете, что ознакомлены с настоящими
        Условиями и принимаете их добровольно.
      </p>
    </main>
  );
}
