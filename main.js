require('dotenv').config();

console.log("Приложение запускается..."); // Это должно быть первым, что мы увидим
const express = require('express');
console.log("Express подключен...");
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
console.log("TelegramBot API подключен."); // Новая строка лога

const app = express();
const port = process.env.PORT || 8080;
console.log(`Порт установлен: ${port}`); // Новая строка лога

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("Токен Telegram Bot не найден в переменных окружения! Бот не будет работать с Telegram.");
} else {
  console.log("Токен Telegram Bot успешно получен (длина: " + token.length + ")."); // Новая строка лога, показывающая, что токен не пустой
}

// Потенциальная точка отказа: создание экземпляра бота с пустым токеном
// Если токен пуст, то new TelegramBot(undefined) может вызвать ошибку.
// Обернем это в try-catch
let bot;
try {
  bot = new TelegramBot(token); // <-- Если token === undefined, это может быть проблемой
  console.log("Экземпляр TelegramBot создан."); // Новая строка лога
} catch (error) {
  console.error("Ошибка при создании экземпляра TelegramBot:", error);
  // Здесь можно было бы сделать process.exit(1), но пока оставим без него,
  // чтобы Express все равно попытался запуститься.
}


// Устанавливаем вебхук - ЭТО ТОЖЕ МОЖЕТ БЫТЬ ПРОБЛЕМОЙ, если бот не инициализирован
// Нужно проверять, что bot существует, прежде чем вызывать setWebHook
if (bot) { // Добавляем проверку на существование bot
  const webhookUrl = `https://model-linfaiz.amvera.io/webhook`;
  bot.setWebHook(webhookUrl)
    .then(() => {
      console.log("Вебхук установлен:", webhookUrl);
    })
    .catch((error) => {
      console.error("Ошибка при установке вебхука:", error);
    });
} else {
  console.warn("Бот не инициализирован, вебхук не будет установлен.");
}


app.use(express.json());
console.log("Middleware для JSON настроен."); // Новая строка лога

app.use(express.static(__dirname));
console.log("Статические файлы настроены.");

app.get('/', (req, res) => {
  console.log("Получен запрос на /");
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/message', (req, res) => {
  console.log("Получен запрос на /api/message");
  res.send('Привет, это сообщение с Node.js backend!');
});

// Обработчик вебхука от Telegram
if (bot) { // Добавляем проверку на существование bot
  app.post('/webhook', (req, res) => {
    try {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.error("Ошибка при обработке вебхука:", error);
      res.sendStatus(500);
    }
  });
} else {
  console.warn("Бот не инициализирован, обработчик вебхуков не будет работать.");
}


// Обработчик сообщений от Telegram (внутри express)
if (bot) { // Добавляем проверку на существование bot
  bot.on('message', (msg) => {
    try {
      const chatId = msg.chat.id;
      console.log(`Получено сообщение от ${chatId}: ${msg.text}`);
      bot.sendMessage(chatId, 'Привет от бота!');
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  });
} else {
  console.warn("Бот не инициализирован, обработчик сообщений не будет работать.");
}


app.listen(port, () => {
  console.log(`Сервер слушает на порту ${port}`);
});

process.on('uncaughtException', (err) => {
  console.error("Неперехваченное исключение:", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Необработанный отказ:", reason);
});