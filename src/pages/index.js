'use strict';

import './index.css';
import {apiSettings, validationSettings} from "../utils/const.js"; /** Настройки */
import {Card} from "../components/Card.js";
import {FormValidator} from "../components/FormValidator.js";
import {Section} from '../components/Section.js'
import {PopupWithForm} from '../components/PopupWithForm.js';
import {PopupWithImage} from '../components/PopupWithImage.js';
import {PopupWithConfirmation} from '../components/PopupWithConfirmation.js';
import {UserInfo} from '../components/UserInfo.js';
import {Api} from '../components/Api';

const api = new Api(apiSettings);


let currentUser = '';


/** Параллельное получение данных пользователя и массива карточек */
Promise.all([api.getUserInfo(), api.getCards()])
  .then((res) => {
    currentUser = res[0]._id;
    console.log('ID пользователя:', currentUser); // Выводим ID в консоль
    /** Из результата 1 промиса получаем ИД пользователя, и данные профиля */
    profile.setUserInfo(res[0]);
    sectionPhotoCards.renderElements(res[1]); /** из результата второго - карточки */
  })
  .catch((err) => {
    console.log(err);
  });
const sectionPhotoCards = new Section({
  renderer: (item) => {
    sectionPhotoCards.addItem(copyCard(item, currentUser))
  }
}, '.photo-cards');

/** Профиль пользователя */

const formProfileEdit = document.querySelector(".popup_edit_profile " + validationSettings.formSelector);


const formAvatarEdit = document.querySelector(".popup_update-avatar " + validationSettings.formSelector);


const profileEditValidator = new FormValidator(validationSettings, formProfileEdit);


const avatarEditValidator = new FormValidator(validationSettings, formAvatarEdit);


const profileEditPopup = document.querySelector(".popup_edit_profile");


const popupTitleInput = profileEditPopup.querySelector('#profile_name');


const popupAboutInput = profileEditPopup.querySelector('#profile_about');


const profileEditButton = document.querySelector(".profile__button");

/** Экземпляр профиля пользователя */
const profile = new UserInfo(
  {
    profileTitle: ".profile__title",
    profileAbout: ".profile__about",
    profileAvatar: ".profile__avatar"
  }
);

/** Экземпляр формы редактирования профиля */
const profileForm = new PopupWithForm(
  ".popup_edit_profile",
  {
    handleSubmitForm: (inputValues) => {
      api.sendUserInfo(inputValues)
        .then((data) => {
          profile.setUserInfo(
            {name: data.name, about: data.about, avatar: data.avatar}
          );
          profileForm.close();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          profileForm.renderLoading(false);
        })
    }
  });

const setProfileInputs = (info) => {
  popupTitleInput.value = info.title;
  popupAboutInput.value = info.about;
};

const avatarEditButton = document.querySelector(".profile__edit-avatar-button");

avatarEditButton.addEventListener('click', () => {
  avatarForm.open();
  avatarEditValidator.validateInputs();
  avatarEditValidator.switchSubmitButton();
})

/** Экземпляр формы редактирования аватара */
const avatarForm = new PopupWithForm(
  ".popup_update-avatar",
  {
    handleSubmitForm: (inputValues) => {
      api.updateAvatar(inputValues.avatar)
        .then((res) => {
          profile.setUserInfo({avatar: res.avatar, name: res.name, about: res.about});
          avatarForm.close();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          avatarForm.renderLoading(false);
        })
    }
  })

/** Карточки изображений */


const formNewPlace = document.querySelector(".popup_new-place " + validationSettings.formSelector);

const newPlaceValidator = new FormValidator(validationSettings, formNewPlace);

/** Экземпляр всплывашки просмотра изображения */
const popupImage = new PopupWithImage('.popup_view_image');

/** Экземпляр всплывашки подтверждения удаления карточки */
const popupImageDelete = new PopupWithConfirmation(
  '.popup_delete-place',
  {
    handleSubmitDelete: (id, element) => {
      api.deleteCard(id)
        .then(() => {
          element.deleteCard();
          popupImageDelete.close();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
);

/** Кнопка Добавить место */
const buttonAddPlace = document.querySelector(".profile__add-button");


const copyCard = (item, currentUser) => {
  const card = new Card({
      item, currentUser,
      handleCardClick: () => {
        popupImage.open({title: item.name, src: item.link});
      },
      handleDeleteCard: (id, element) => {
        popupImageDelete.open(card);
        popupImageDelete.getCard(id, element)
      },
      handleLikeCard: {
        handleSetLike: (id) => {
          api.setLike(id)
            .then((res) => {
              card.updateLikes(res.likes, "setLike");
            })
            .catch((err) => {
              console.log(err);
            })
        },
        handleDeleteLike: (id) => {
          api.deleteLike(id)
            .then((res) => {
              card.updateLikes(res.likes, "deleteLike");
            })
            .catch((err) => {
              console.log(err);
            })

        }
      }
    },
    "#photo-card");
  return card.createCard();
}

/** Экземпляр формы добавления карточки */
const addPhotoForm = new PopupWithForm(
  ".popup_new-place",
  {
    handleSubmitForm: (inputValues) => {
      api.sendCard(inputValues)
        .then((data) => {
          sectionPhotoCards.addNewItem(copyCard(data, currentUser));
          addPhotoForm.close();
        })
        .finally(() => {
          addPhotoForm.renderLoading(false);
        })
    }
  });


/** Прослушиватель нажатия на кнопку редактирования профиля */
profileEditButton.addEventListener('click', function () {
  setProfileInputs(profile.getUserInfo());
  profileForm.open();
  profileEditValidator.validateInputs();
  profileEditValidator.switchSubmitButton();
})

/** Прослушиватель нажатия на кнопку Добавить место */
buttonAddPlace.addEventListener('click', function () {
  addPhotoForm.open();
  newPlaceValidator.validateInputs();
  /** Возможно, лишнее, но зато сразу понятно, какие поля не заполнены */
  newPlaceValidator.switchSubmitButton();
})

/** Ждем загрузки DOM */
document.addEventListener('DOMContentLoaded', function () {

  /** Включает валидацию */
  profileEditValidator.enableValidation();
  newPlaceValidator.enableValidation();
  avatarEditValidator.enableValidation()

  /** Вешает прослушиватели всплывашки изображения */
  popupImage.setEventListeners();

  /** Вешает прослушиватели всплывашки редактирования профиля */
  profileForm.setEventListeners();

  /** Вешает прослушиватели всплывашки удаления карточки */
  popupImageDelete.setEventListeners();

  /** Вешает прослушиватели всплывашки добавления карточки */
  addPhotoForm.setEventListeners();

  /** Вешает прослушиватели всплывашки редактирования аватара */
  avatarForm.setEventListeners();
});
