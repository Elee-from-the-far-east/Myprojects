"use strict";

import * as utils from './utils.js'
import {appendDataToBigPicture} from './bigpicture.js'

//----Дом элементы----//
const bigPicture = document.querySelector('.big-picture');
const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');




//----Создает дом элемент с заданными даннами из data----//
function makePictureElement(data) {
    let newElement = pictureTemplate.cloneNode(true);
    newElement.querySelector('.picture__img').src = data.url;
    newElement.querySelector('.picture__likes').textContent = data.likes;
    newElement.querySelector('.picture__comments').textContent = data.comments.length;
    newElement.addEventListener('click', function (evt) {
        utils.openElement(bigPicture);
        appendDataToBigPicture(data);

    });
    return newElement;
};

//----Рендерит элементы на страницу с данными из массива data с мапами----//
function renderPictureElements(data) {
utils.check(data)
    let fragment = document.createDocumentFragment();
    for (let item of data) {
        fragment.appendChild(makePictureElement(item));
    }
    picturesContainer.appendChild(fragment);
}







export {renderPictureElements}

















