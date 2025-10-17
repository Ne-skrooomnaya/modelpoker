// Проверяем, что Telegram WebApp API доступен
// Используем опциональную цепочку ?. для безопасного доступа
if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    // Инициализируем WebApp
    Telegram.WebApp.ready();
    // Расширяем мини-приложение на весь экран (по желанию)
    Telegram.WebApp.expand();

    console.log('Telegram WebApp инициализирован.');

    // Попытка получить данные пользователя из initDataUnsafe
    let userId = 'Неизвестный ID';
    let userName = 'Неизвестный';
    let userFirstName = 'Неизвестный';

    if (Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
        userId = Telegram.WebApp.initDataUnsafe.user.id || userId;
        userName = Telegram.WebApp.initDataUnsafe.user.username || userName;
        userFirstName = Telegram.WebApp.initDataUnsafe.user.first_name || userFirstName;
    } else {
        console.warn(`Telegram.WebApp.initDataUnsafe.user не найден. Данные пользователя будут 'Неизвестный'.`);
    }

    console.log('ID пользователя:', userId);
    console.log('Имя пользователя:', userName);
    console.log('Имя:', userFirstName);

    // Получаем элементы из HTML
    const betInput = document.getElementById('betInput');
    const sendBetButton = document.getElementById('sendBetButton');
    const statusMessage = document.getElementById('statusMessage'); // Добавим элемент для вывода сообщений

    // Проверяем, найдены ли все необходимые элементы
    if (!betInput || !sendBetButton) {
        console.error('Не удалось найти элементы #betInput или #sendBetButton.');
        if (statusMessage) {
            statusMessage.textContent = 'Ошибка: Не удалось загрузить элементы формы.';
        } else {
            document.body.innerHTML += '<p style="color: red;">Ошибка: Не удалось загрузить элементы формы.</p>';
        }
        return; // Прекращаем выполнение, если элементы не найдены
    }

    // Добавляем обработчик события для кнопки "Сделать ставку"
    sendBetButton.addEventListener('click', () => {
        const betAmountString = betInput.value.trim(); // Убираем пробелы по краям
        const betAmount = parseInt(betAmountString, 10); // Получаем значение ставки

        if (isNaN(betAmount) || betAmount <= 0) {
            Telegram.WebApp.showAlert('Пожалуйста, введите корректную ставку (число больше 0).');
            if (statusMessage) statusMessage.textContent = 'Ошибка: Некорректная ставка.';
            return;
        }

        // Отправляем данные боту
        // Telegram.WebApp.sendData() отправляет строку данных обратно боту.
        // Бот получит эти данные в событии 'web_app_data'.
        // Мы отправляем JSON-строку, чтобы бот мог легко ее распарсить.
        try {
            Telegram.WebApp.sendData(JSON.stringify({
                type: 'bet_selected',
                amount: betAmount,
                user_id: userId // Используем полученный userId
            }));

            console.log('Ставка отправлена:', betAmount);
            if (statusMessage) statusMessage.textContent = `Ставка ${betAmount} отправлена!`;

            // Закрываем мини-приложение после отправки данных
            // Telegram.WebApp.close(); // Можно раскомментировать, если нужно автоматически закрывать
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            Telegram.WebApp.showAlert('Произошла ошибка при отправке ставки. Попробуйте снова.');
            if (statusMessage) statusMessage.textContent = 'Ошибка при отправке ставки.';
        }
    });

    // --- Опциональные элементы, которые вы закомментировали ---
    // Можно использовать MainButton Telegram для подтверждения
    // Telegram.WebApp.MainButton.setText('Сделать ставку');
    // Telegram.WebApp.MainButton.show();
    // Telegram.WebApp.MainButton.onClick(() => {
    //     // Проверяем, что кнопка ставки существует, прежде чем кликать
    //     if (sendBetButton) {
    //         sendBetButton.click(); // Или скопировать логику из sendBetButton.addEventListener
    //     } else {
    //         console.error('MainButton: Кнопка "Сделать ставку" не найдена.');
    //     }
    // });

} else {
    // Это сообщение увидит пользователь, если запустит HTML файл напрямую или если API не доступен
    console.error('Telegram WebApp API не найден. Убедитесь, что приложение запущено в Telegram.');
    // Отображаем пользователю понятное сообщение
    // Убедимся, что document.body существует перед попыткой изменить его содержимое
    if (document.body) {
        // Очищаем тело документа и вставляем сообщение об ошибке
        document.body.innerHTML = `
            <div style="font-family: sans-serif; padding: 20px; text-align: center; color: #cc0000;">
                <h1>Ошибка:</h1>
                <p>Мини-приложение для покера должно быть запущено внутри Telegram.</p>
                <p>Пожалуйста, откройте это приложение через Telegram.</p>
            </div>
        `;
    } else {
        // Если document.body еще не готов (например, скрипт выполняется до полной загрузки DOM)
        // можно добавить обработчик, который выполнится после загрузки DOM
        document.addEventListener('DOMContentLoaded', () => {
            document.body.innerHTML = `
                <div style="font-family: sans-serif; padding: 20px; text-align: center; color: #cc0000;">
                    <h1>Ошибка:</h1>
                    <p>Мини-приложение для покера должно быть запущено внутри Telegram.</p>
                    <p>Пожалуйста, откройте это приложение через Telegram.</p>
                </div>
            `;
        });
    }
}