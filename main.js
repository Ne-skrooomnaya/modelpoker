const express = require('express');
const path = require('path'); // Для работы с путями к файлам

const app = express();
const port = process.env.PORT || 80; // Используем порт 80 как в Python-примере, но также проверяем переменную окружения Amvera
const host = '0.0.0.0'; // Разрешаем доступ со всех сетевых интерфейсов

// Если у вас есть статические файлы (CSS, JS, картинки), которые находятся
// в той же директории, что и index.html, или в подпапке (например, `static`),
// вам нужно настроить Express для их отдачи.
// Если index.html ссылается на `bot.png` просто как `bot.png`,
// то Express должен знать, где его искать.
// Для простоты, если все статические файлы в корне, можно использовать:
app.use(express.static(__dirname)); // Обслуживает статические файлы из текущей директории

// Маршрут для корневого URL ("/")
// Соответствует @app.route("/") в Flask
app.get('/', (req, res) => {
    // Отправляем файл index.html из текущей директории
    // Соответствует return render_template('index.html') в Flask
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
// Соответствует app.run(debug=True, host="0.0.0.0", port='80') в Flask
app.listen(port, host, () => {
    console.log(`Сервер запущен на http://${host}:${port}`);
    console.log(`Чтобы открыть сайт, перейдите по адресу http://localhost:${port} (локально)`);
});

// Для целей Amvera и стабильности, полезно добавить обработку необработанных исключений
process.on('uncaughtException', (err) => {
    console.error("Неперехваченное исключение:", err);
    // process.exit(1); // Можно завершить процесс, но для отладки лучше пока просто логировать
});

process.on('unhandledRejection', (reason, promise) => {
    console.error("Необработанный отказ:", reason);
});
