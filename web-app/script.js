// Проверяем, что Telegram WebApp API доступен
if (Telegram.WebApp) {
    // Инициализируем WebApp
    Telegram.WebApp.ready();
    // Расширяем мини-приложение на весь экран (по желанию)
    Telegram.WebApp.expand();

    console.log('Telegram WebApp инициализирован.');
    console.log('Пользователь:', Telegram.WebApp.initDataUnsafe.user?.first_name || 'Неизвестный');

    // Получаем элементы из HTML
    const betInput = document.getElementById('betInput');
    const sendBetButton = document.getElementById('sendBetButton');

    // Добавляем обработчик события для кнопки "Сделать ставку"
    sendBetButton.addEventListener('click', () => {
        const betAmount = parseInt(betInput.value, 10); // Получаем значение ставки
        if (isNaN(betAmount) || betAmount <= 0) {
            Telegram.WebApp.showAlert('Пожалуйста, введите корректную ставку.');
            return;
        }

        // Отправляем данные боту
        // Telegram.WebApp.sendData() отправляет строку данных обратно боту.
        // Бот получит эти данные в событии 'web_app_data'.
        // Мы отправляем JSON-строку, чтобы бот мог легко ее распарсить.
        Telegram.WebApp.sendData(JSON.stringify({
            type: 'bet_selected',
            amount: betAmount,
            user_id: Telegram.WebApp.initDataUnsafe.user?.id // Отправляем ID пользователя
        }));

        // Закрываем мини-приложение после отправки данных
        Telegram.WebApp.close();
    });

    // Можно использовать MainButton Telegram для подтверждения
    // Telegram.WebApp.MainButton.setText('Сделать ставку');
    // Telegram.WebApp.MainButton.show();
    // Telegram.WebApp.MainButton.onClick(() => {
    //     sendBetButton.click(); // Или скопировать логику из sendBetButton.addEventListener
    // });

} else {
    console.error('Telegram WebApp API не найден. Убедитесь, что приложение запущено в Telegram.');
    document.body.innerHTML = '<h1>Ошибка: Запустите это приложение из Telegram.</h1>';
}
