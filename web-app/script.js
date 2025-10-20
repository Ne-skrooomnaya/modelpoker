// Проверяем, доступен ли Telegram WebApp API
if (window.Telegram && Telegram.WebApp) {
  // Инициализация WebApp
  Telegram.WebApp.ready();
  Telegram.WebApp.expand(); // Расширяем на весь экран

  console.log('Telegram WebApp инициализирован.');

  // Получение данных пользователя (с значениями по умолчанию)
  const userId = Telegram.WebApp.initDataUnsafe?.user?.id ?? 'Неизвестный ID';
  const userName = Telegram.WebApp.initDataUnsafe?.user?.username ?? 'Неизвестный';
  const userFirstName = Telegram.WebApp.initDataUnsafe?.user?.first_name ?? 'Неизвестный';

  console.log('ID пользователя:', userId);
  console.log('Имя пользователя:', userName);
  console.log('Имя:', userFirstName);

  // Получаем элементы формы
  const betInput = document.getElementById('betInput');
  const sendBetButton = document.getElementById('sendBetButton');
  const statusMessage = document.getElementById('statusMessage');

  // Обработка ошибки, если элементы не найдены
  if (!betInput || !sendBetButton) {
    const errorMessage = 'Ошибка: Не удалось загрузить элементы формы.';
    console.error(errorMessage);
    statusMessage ? statusMessage.textContent = errorMessage : document.body.innerHTML += `<p style="color: red;">${errorMessage}</p>`;
    throw new Error(errorMessage); // Прерываем выполнение скрипта
  }

  // Обработчик события "Сделать ставку"
  sendBetButton.addEventListener('click', () => {
    const betAmount = parseInt(betInput.value.trim(), 10);

    if (isNaN(betAmount) || betAmount <= 0) {
      Telegram.WebApp.showAlert('Пожалуйста, введите корректную ставку (число больше 0).');
      return statusMessage ? statusMessage.textContent = 'Ошибка: Некорректная ставка.' : null;
    }

    // Отправка данных боту
    try {
      Telegram.WebApp.sendData(JSON.stringify({
        type: 'bet_selected',
        amount: betAmount,
        user_id: userId
      }));
      console.log(`Ставка ${betAmount} отправлена.`);
      statusMessage ? statusMessage.textContent = `Ставка ${betAmount} отправлена!` : null;
      // Telegram.WebApp.close(); // Автоматическое закрытие
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      Telegram.WebApp.showAlert('Произошла ошибка при отправке ставки. Попробуйте снова.');
      statusMessage ? statusMessage.textContent = 'Ошибка при отправке ставки.' : null;
    }
  });

} else {
  // API Telegram WebApp недоступен
  console.error('Telegram WebApp API не найден. Запустите в Telegram.');

  const displayErrorMessage = () => {
    document.body.innerHTML = `
      <div style="font-family: sans-serif; padding: 20px; text-align: center; color: #cc0000;">
        <h1>Ошибка:</h1>
        <p>Мини-приложение для покера должно быть запущено внутри Telegram.</p>
        <p>Пожалуйста, откройте это приложение через Telegram.</p>
      </div>
    `;
  };

  document.body ? displayErrorMessage() : document.addEventListener('DOMContentLoaded', displayErrorMessage);
}
