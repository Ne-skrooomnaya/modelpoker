const express = require('express');
const path = require('path');
const app = express();
const port = 8080;  // ***Важно: Укажите порт 8080***

// Отдаем статические файлы из текущей директории (model)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Отдаем index.html
});

app.get('/api/message', (req, res) => {
  res.send('Привет, это сообщение с Node.js backend!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`); // Исправлены обратные кавычки
});
