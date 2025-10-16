console.log("Приложение запускается...");
const express = require('express');
console.log("Express подключен...");
const path = require('path');
const TelegramBot = require('node-telegram-bot-api'); // Добавляем Telegram Bot API

const app = express();
const port = process.env.PORT || 8080; // Используем переменную окружения PORT

const token = process.env.TELEGRAM_BOT_TOKEN; // Токен из переменной окружения
if (!token) {
  console.error("Токен Telegram Bot не найден в переменных окружения!");
  process.exit(1); // Завершаем процесс, если токен не найден
}


const bot = new TelegramBot(token);

// Устанавливаем вебхук
const webhookUrl = 'https://model-linfaiz.amvera.io/'; // Замените на URL вашего приложения Amvera
bot.setWebHook(webhookUrl)
  .then(() => {
    console.log("Вебхук установлен:", webhookUrl);
  })
  .catch((error) => {
    console.error("Ошибка при установке вебхука:", error);
  });

app.use(express.json()); // Добавляем middleware для разбора JSON

app.use(express.static(__dirname));
console.log("Статические файлы настроены...");

app.get('/', (req, res) => {
  console.log("Получен запрос на /");
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/message', (req, res) => {
  console.log("Получен запрос на /api/message");
  res.send('Привет, это сообщение с Node.js backend!');
});

// Обработчик вебхука от Telegram
app.post('/webhook', (req, res) => {
  try {
    bot.processUpdate(req.body);
    res.sendStatus(200); // Отправляем OK
  } catch (error) {
    console.error("Ошибка при обработке вебхука:", error);
    res.sendStatus(500); // Отправляем ошибку
  }
});

// Обработчик сообщений от Telegram (внутри express)
bot.on('message', (msg) => {
  try {
    const chatId = msg.chat.id;
    console.log(`Получено сообщение от ${chatId}: ${msg.text}`);
    bot.sendMessage(chatId, 'Привет от бота!');
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
  }
});

app.listen(port, () => {
  console.log(`Сервер слушает на порту ${port}`);
});

// Обработка ошибок (важно для стабильности)
process.on('uncaughtException', (err) => {
  console.error("Неперехваченное исключение:", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Необработанный отказ:", reason);
});
