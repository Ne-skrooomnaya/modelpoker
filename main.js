const TelegramBot = require('node-telegram-bot-api');
const express = require('express'); // Импортируем Express
const path = require('path');     // Для работы с путями к файлам

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 8080;

if (!token) {
    console.error('Ошибка: Токен Telegram бота не найден в переменных окружения. Установите BOT_TOKEN.');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// --- Настройка Express сервера для хостинга мини-приложения ---
const app = express();

// Указываем Express, что статические файлы (HTML, CSS, JS) для мини-приложения
// находятся в папке 'web-app' и доступны по корневому URL сервера.
app.use(express.static(path.join(__dirname, 'web-app')));

// Опциональный корневой маршрут для проверки, что сервер работает
app.get('/', (req, res) => {
    res.send('Telegram Bot with Web App is running!');
});

// Запускаем Express сервер
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express сервер для мини-приложения запущен на порту ${PORT}`);
    console.log('Бот готов к работе!');
});

// --- Логика Telegram Бота ---

console.log('Бот запущен и ожидает сообщений...');

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'друг';

    // Создаем inline-клавиатуру с кнопкой, которая открывает WebApp
    // ВАЖНО: URL должен быть РЕАЛЬНЫМ публичным адресом твоего сервиса на Amvera!
    // Пример: https://modelpoker-abcd12.amvera.ru/
    // Amvera автоматически предоставит тебе такой URL после деплоя.
    // Пока можешь использовать заглушку, но для работы нужно будет обновить.
    const webAppUrl = process.env.WEB_APP_URL || `https://your-project-name.amvera.ru/`; // Замени на свой URL

    bot.sendMessage(chatId, `Привет, ${userName}! Выбери действие:`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🎮 Открыть Mini App',
                        web_app: { url: webAppUrl }
                    }
                ]
            ]
        }
    });
});

// Обработка любых текстовых сообщений (если они не команды)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text && !msg.text.startsWith('/')) { // Игнорируем команды
        bot.sendMessage(chatId, `Ты сказал: "${msg.text}". Нажми кнопку "Открыть Mini App" для взаимодействия.`);
    }
});

// --- Обработка данных, приходящих из Mini App ---
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const data = msg.web_app_data.data; // Получаем строку данных из Mini App

    try {
        const parsedData = JSON.parse(data); // Пытаемся распарсить JSON

        if (parsedData.type === 'bet_selected') {
            const betAmount = parsedData.amount;
            bot.sendMessage(chatId, `🎉 Пользователь ${msg.from.first_name} выбрал ставку: ${betAmount}!`);
            console.log(`[${userId}] выбрал ставку: ${betAmount}`);
            // Здесь можно добавить логику сохранения ставки в базу данных,
            // начало игры и т.д.
        } else {
            bot.sendMessage(chatId, `Получены неизвестные данные из Mini App: ${data}`);
            console.warn(`[${userId}] Получены неизвестные данные: ${data}`);
        }
    } catch (e) {
        bot.sendMessage(chatId, `Ошибка парсинга данных из Mini App: ${data}`);
        console.error(`[${userId}] Ошибка парсинга JSON из Mini App: ${data}`, e);
    }
});

// Обработка ошибок polling'а
bot.on('polling_error', (error) => {
    console.error('Ошибка polling_error:', error.code, error.message);
});
