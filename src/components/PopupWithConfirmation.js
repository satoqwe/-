import {Popup} from "./Popup.js";

export class PopupWithConfirmation extends Popup {

  constructor(popupSelector, {handleSubmitDelete}) {
    super(popupSelector);
    this._handleSubmitDelete = handleSubmitDelete;
    this._form = this._popup.querySelector('.popup__form');
  }

  /** Установка прослушивателя отправки формы */
  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._handleSubmitDelete(this._idCard, this._card);
    })
  }

  getCard(id, element) {
    this._clear();
    this._idCard = id;
    this._cardElement = element;
  }

  open(card) {
    this._card = card;
    super.open();
  }

  _clear() {
    this._idCard = '';
    this._cardElement = '';
  }

}
