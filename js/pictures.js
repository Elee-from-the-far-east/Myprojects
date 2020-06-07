"use strict";

import * as utils from './utils.js'

//----Дом элементы----//
const uploadSocialButton = document.querySelector('.comments-loader');
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel')
const likesCount = bigPicture.querySelector('.likes-count');
const photoDiscrition = bigPicture.querySelector('.social__caption');
const commentsCount = bigPicture.querySelector('.comments-count');
const commentText = document.querySelectorAll('.social__text');
const socialCommentblock = document.querySelector('.social__comment-count');
const socialAvatar = bigPicture.querySelector('.social__picture');
const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');


//----Навешивает данные на полноэкранное изображение----//
function renderDataToBigPicture(data) {
    bigPictureImg.src = data.url;
    likesCount.textContent = data.likes;
    photoDiscrition.textContent = data.description;
    for (let i = 0; i < commentText.length; i++) {
        commentText[i].textContent = data.comments[utils.getRandomInt(data.comments.length)].message;
    }
}

//----Создает дом элемент с заданными даннами из data----//
function makePictureElement(data) {
    let newElement = pictureTemplate.cloneNode(true);
    newElement.querySelector('.picture__img').src = data.url;
    newElement.querySelector('.picture__likes').textContent = data.likes;
    newElement.querySelector('.picture__comments').textContent = data.comments;
    newElement.addEventListener('click', function (evt) {
        utils.openElement(bigPicture);
        renderDataToBigPicture(data);
        bigPicture.classList.remove('hidden')
    });
    return newElement;
};

//----Рендерит элементы на страницу с данными из массива data с мапами----//
function renderPictureElements(data) {

    let fragment = document.createDocumentFragment();
    for (let item of data) {
        fragment.appendChild(makePictureElement(item));
    }
    picturesContainer.appendChild(fragment);
}

//----Вешаем обработчик закрытия полноэкранного изображения----//
bigPictureCloseButton.addEventListener('click', function () {
    utils.closeElement(bigPicture)
})


socialAvatar.src = `img/avatar-${Math.ceil(Math.random() * 6)}.svg`;
socialCommentblock.classList.add('visually-hidden');
uploadSocialButton.classList.add('visually-hidden');
// // Не понятно 5 из восьми комментариев
// commentsCount.textContent = photoData.comments.length;




export {renderPictureElements}

















