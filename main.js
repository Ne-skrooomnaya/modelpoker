console.log("Hello from Node.js on Amvera!");

// Этот простой сервер будет слушать порт и отвечать "Hello",
// чтобы Amvera видел, что приложение запущено и активно.
const http = require('http');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello Amvera!\n');
});

server.listen(port, host, () => {
  console.log(`Minimal server running at http://${host}:${port}/`);
});

// Добавим обработку ошибок, чтобы видеть их, если они будут.
process.on('uncaughtException', (err) => {
  console.error("Uncaught exception:", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled rejection:", reason);
});
