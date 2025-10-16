// Импортируем библиотеку для работы с Telegram Bot API
const TelegramBot = require('node-telegram-bot-api');
// Импортируем модуль для работы с HTTP-сервером (чтобы Amvera не закрыла контейнер)
const http = require('http');

// --- НАСТРОЙКА БОТА ---

// Получаем токен бота из переменной окружения
// ВАЖНО: Никогда не хардкодь токен в коде!
const token = process.env.BOT_TOKEN;

// Проверяем, что токен существует
if (!token) {
    console.error('Ошибка: Токен Telegram бота не найден в переменных окружения. Установите BOT_TOKEN.');
    process.exit(1); // Выходим из процесса, так как без токена бот не запустится
}

// Создаем экземпляр бота
// 'polling: true' означает, что бот будет использовать long-polling для получения обновлений.
// Это самый простой способ для старта, не требующий настройки вебхуков.
const bot = new TelegramBot(token, { polling: true });

console.log('Бот запущен и ожидает сообщений...');

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет! Я простой тестовый бот. Напиши мне что-нибудь.');
});

// Обработка любых текстовых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // Игнорируем команду /start, чтобы не отвечать на нее дважды
    if (msg.text && msg.text.startsWith('/start')) {
        return;
    }
    // Отправляем обратно то же сообщение, которое пришло
    bot.sendMessage(chatId, `Ты сказал: "${msg.text}"`);
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('Ошибка polling_error:', error.code, error.message);
});

// --- ДЛЯ AMVERA.RU: ЗАПУСК ПРОСТОГО HTTP СЕРВЕРА ---
// Это нужно для того, чтобы контейнер на Amvera не завершался,
// так как Amvera ожидает, что ваше приложение будет слушать какой-то порт.
// Даже если бот работает по long-polling и не использует HTTP для коммуникации с Telegram.

const PORT = process.env.PORT || 8080; // Amvera предоставляет PORT через переменную окружения

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Telegram Bot is running! (Long-polling mode)');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP сервер запущен на порту ${PORT}`);
    console.log('Бот готов к работе!');
});
