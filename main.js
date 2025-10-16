    console.log("Приложение запускается...");
    const express = require('express');
    console.log("Express подключен...");
    const path = require('path');
    const app = express();
    const port = 8080;
    console.log("Порт установлен на 8080...");

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

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
