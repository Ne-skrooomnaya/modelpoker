const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 8080;

// Статическая папка 'web-app' находится на один уровень выше серверного main.js
// Этот middleware будет обрабатывать запросы к '/' и другим файлам в 'web-app'
app.use(express.static(path.join(__dirname, '..', 'web-app')));

// >>>>> УДАЛИТЕ ЭТОТ РОУТ <<<<<
// app.get('/', (req, res) => {
//     console.log('--- Received request on / (Health Check) ---');
//     res.status(200).send('Hello from Express server! All good.');
// });
// >>>>> УДАЛИТЕ ЭТОТ РОУТ <<<<<

// Роут для локального тестирования вашего мини-приложения
app.get('/test-webapp', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'web-app', 'index.html');

    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('Error reading index.html:', err);
            return res.status(500).send('Error loading web app for testing.');
        }

        const mockWebAppScript = `
            <script>
                if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
                    window.Telegram = {
                        WebApp: {
                            ready: () => console.log('[Mock] Telegram.WebApp.ready() called'),
                            expand: () => {
                                console.log('[Mock] Telegram.WebApp.expand() called');
                            },
                            close: () => console.log('[Mock] Telegram.WebApp.close() called'),
                            sendData: (data) => console.log('[Mock] Telegram.WebApp.sendData() called with:', data),
                            showAlert: (message) => alert('[Mock Alert] ' + message),
                            showConfirm: (message, callback) => callback(confirm('[Mock Confirm] ' + message)),
                            themeParams: {
                                bg_color: '#301934',
                                text_color: '#ffffff',
                                button_color: '#9F79EE',
                                button_text_color: '#ffffff',
                                hint_color: '#cccccc',
                                secondary_bg_color: '#4a284e'
                            },
                            initData: 'query_id=AAH42Q1MAAAAONk2Uj-A&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22MockUser%22%2C%22last_name%22%3A%22Test%22%2C%22username%22%3A%22mockuser%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%7D&auth_date=1678886400&hash=...',
                            version: '6.7',
                            isExpanded: true,
                            isClosingConfirmationEnabled: false,
                            headerColor: '#301934',
                            backgroundColor: '#301934',
                        }
                    }
                    console.warn('Telegram.WebApp API is MOCKED for local testing!');
                }
            </script>
        `;

        const modifiedHtml = htmlData.replace('<body>', `<body>${mockWebAppScript}`);
        console.log(`Sending modified HTML from: ${indexPath}`);
        res.send(modifiedHtml);
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Minimal Express server is running on port ${PORT}`);
    console.log(`Для проверки работоспособности сервера: http://localhost:${PORT}/`);
    console.log(`Для локального тестирования мини-приложения: http://localhost:${PORT}/test-webapp`);
    console.log(`(Примечание: На Render или другом хостинге вместо localhost будет ваш домен)`);
});
