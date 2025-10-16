    const express = require('express');
    const path = require('path');

    const app = express();
    const PORT = process.env.PORT || 8080;

    app.use(express.static(path.join(__dirname, 'web-app')));

    app.get('/', (req, res) => {
        console.log('--- Received request on / (Health Check) ---'); // <--- ДОБАВЬ ЭТУ СТРОКУ
        res.status(200).send('Hello from Amvera Express server! All good.');
    });

    app.get('/test-webapp', (req, res) => {
        res.sendFile(path.join(__dirname, 'web-app', 'index.html'));
    });

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Minimal Express server is running on port ${PORT}`);
        console.log(`Try accessing: https://model-linfaiz.amvera.io/`);
        console.log(`Or Web App test: https://model-linfaiz.amvera.io/test-webapp`);
    });
