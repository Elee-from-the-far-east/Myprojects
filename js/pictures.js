'use strict';

import * as utils from './utils.js';
import {bigPictureClickHandler} from './bigpicture.js';

//----Дом элементы----//
const bigPicture = document.querySelector('.big-picture');
const picturesContainer = document.querySelector('.pictures');
const filters = document.querySelector('.img-filters');
const pictureTemplate = document.querySelector('#picture').
    content.
    querySelector('.picture');


export function clearPictures () {
    while (picturesContainer.querySelectorAll('.picture')[0]) {
        picturesContainer.querySelectorAll('.picture')[0].remove();
    }
}

//----Создает дом элемент с заданными даннами из data----//
function makePictureElement(data) {
    let newElement = pictureTemplate.cloneNode(true);
    newElement.querySelector('.picture__img').src = data.url;
    newElement.querySelector('.picture__likes').textContent = data.likes;
    newElement.querySelector(
        '.picture__comments').textContent = data.comments.length;
    newElement.addEventListener('click', function(evt) {
        utils.openElement(bigPicture);
        document.body.classList.add('modal-open');
        bigPictureClickHandler(evt, data);

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
    filters.classList.remove('img-filters--inactive');
}

export {renderPictureElements};

















