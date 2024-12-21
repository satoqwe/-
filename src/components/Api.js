export class Api {
  constructor(options) {
    this._headers = options.headers; // Сохраняет заголовки для всех запросов в свойстве класса.
    this._serverURL = options.serverURL; // Сохраняет базовый URL сервера для формирования запросов.
    /** возвращает ответ / ошибку после выполнения промиса */
    this._handlePromiseReturn = ((res) => { 
      // Метод обрабатывает результат промиса: если ответ успешен, возвращает JSON; иначе - отклоняет промис с текстом ошибки.
      if (res.ok) {
        return res.json(); // Преобразует ответ в JSON, если статус успешный.
      }
      return Promise.reject(`Ошибка: ${res.status}`); // Возвращает ошибку с кодом статуса.
    });
  }

  getUserInfo() {
    return fetch(`${this._serverURL}/users/me`, { // Выполняет GET-запрос к API для получения информации о текущем пользователе.
      headers: this._headers // Передает сохраненные заголовки запроса.
    })
      .then((res) => this._handlePromiseReturn(res)); // Обрабатывает ответ через вспомогательный метод.
  }

  sendUserInfo(data) {
    return fetch(`${this._serverURL}/users/me`, { // Выполняет PATCH-запрос для обновления данных пользователя.
      method: 'PATCH', // Указывает метод HTTP для изменения данных.
      headers: this._headers, // Передает сохраненные заголовки запроса.
      body: JSON.stringify({ // Преобразует переданные данные в формат JSON для отправки.
        name: data.name, // Поле имени пользователя.
        about: data.about // Поле описания пользователя.
      })
    })
      .then((res) => this._handlePromiseReturn(res)); // Обрабатывает результат через вспомогательный метод.
  }

  updateAvatar(avatar) {
    return fetch(`${this._serverURL}/users/me/avatar`, { // Выполняет PATCH-запрос для обновления аватара.
      method: 'PATCH', // Указывает метод HTTP.
      headers: this._headers, // Передает сохраненные заголовки.
      body: JSON.stringify({ // Преобразует аватар в JSON для отправки.
        avatar: avatar // URL аватара.
      })
    })
      .then((res) => this._handlePromiseReturn(res)); // Обрабатывает результат через метод.
  }

  /** Работа с карточками */
  getCards() {
    return fetch(`${this._serverURL}/cards`, { // Выполняет GET-запрос для получения массива карточек.
      headers: this._headers // Передает заголовки запроса.
    })
      .then((res) => this._handlePromiseReturn(res)); // Обрабатывает результат запроса.
  }

  sendCard(data) {
    return fetch(`${this._serverURL}/cards`, { // Выполняет POST-запрос для добавления новой карточки.
      method: 'POST', // Указывает метод HTTP.
      headers: this._headers, // Передает заголовки запроса.
      body: JSON.stringify({ // Преобразует данные карточки в JSON для отправки.
        name: data.name, // Название карточки.
        link: data.link // Ссылка на изображение карточки.
      })
    })
      .then((res) => this._handlePromiseReturn(res)); // Обрабатывает результат запроса.
  }

  deleteCard(cardID) {
    return fetch(`${this._serverURL}/cards/${cardID}`, { // Выполняет DELETE-запрос для удаления карточки по ID.
      method: 'DELETE', // Указывает метод HTTP.
      headers: this._headers // Передает заголовки запроса.
    });
  }

  setLike(cardID) {
    return fetch(`${this._serverURL}/cards/${cardID}/likes`, { // Выполняет PUT-запрос для добавления лайка карточке.
      method: 'PUT', // Указывает метод HTTP.
      headers: this._headers // Передает заголовки запроса.
    })
      .then((res) => this._handlePromiseReturn(res)); // Обрабатывает результат запроса.
  }

  deleteLike(cardID) {
    return fetch(`${this._serverURL}/cards/${cardID}/likes`, { // Выполняет DELETE-запрос для удаления лайка карточки.
      method: 'DELETE', // Указывает метод HTTP.
      headers: this._headers // Передает заголовки запроса.
    })
      .then((res) => this._handlePromiseReturn(res)); // Обрабатывает результат запроса.
  }
}
