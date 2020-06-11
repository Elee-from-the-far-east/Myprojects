'use strict';

import {ajaxPostRequest} from './backend.js';
import * as utils from './utils.js';

//----Дом элементы----//
const uploadSection = document.querySelector('.img-upload');
const uploadButton = uploadSection.querySelector('#upload-file');
export const form = uploadSection.querySelector('form');
const editForm = uploadSection.querySelector('.img-upload__overlay');
export const imageInput = uploadSection.querySelector('.img-upload__input');
const editFormCloseButton = uploadSection.querySelector('.img-upload__cancel');
const previewPhoto = uploadSection.querySelector('.img-upload__preview');
const previewPhotoImg = uploadSection.querySelector('.img-upload__preview img');
const scaleControlMinus = uploadSection.querySelector(
    '.scale__control--smaller');
const scaleControlPlus = uploadSection.querySelector('.scale__control--bigger');
const scaleControlInput = uploadSection.querySelector('.scale__control--value');
const effectPreviewImg = uploadSection.querySelectorAll('.effects__preview');
const effectElement = uploadSection.querySelector('.effect-level');
const effectValue = uploadSection.querySelector('.effect-level__value');
const effectsBlock = uploadSection.querySelector('.effects__list');
const checkedRadio = uploadSection.querySelector('input[checked]');
const effectDepth = uploadSection.querySelector('.effect-level__depth');
const pinLevelLine = document.querySelector('.effect-level__line');
const pin = uploadSection.querySelector('.effect-level__pin');
const hashTag = uploadSection.querySelector('.text__hashtags');

const effectValueToClassName = {
    chrome: `effects__preview--chrome`,
    sepia: `effects__preview--sepia`,
    marvin: `effects__preview--marvin`,
    phobos: `effects__preview--phobos`,
    heat: `effects__preview--heat`,
};

const effectValueToFilterName = {
    chrome: `grayscale`,
    sepia: `sepia`,
    marvin: `invert`,
    phobos: `blur`,
    heat: `brightness`,
};

const effectValueTofilterCallback = {
    chrome: (index) => {
        let cssIndex = index / pinLevelLine.offsetWidth;
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
    },
    sepia: (index) => {
        let cssIndex = index / pinLevelLine.offsetWidth;
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
    },
    marvin: (index) => {
        let cssIndex = index / pinLevelLine.offsetWidth * 100 + '%';
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
    },
    phobos: (index) => {
        let cssIndex = index * 3 / pinLevelLine.offsetWidth + 'px';
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;

    },
    heat: (index) => {
        let cssIndex = 1 + (2 * index / pinLevelLine.offsetWidth);
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
    },

};

const transformToCallback = {
    scale: (index) => {
        let cssIndex = parseInt(index) / 100;
        previewPhoto.style.transform = `scale(${cssIndex})`;
    },
};

//----Переменные для обработчиков событий----//
let clickedClass;
let clickedNode;
let currentFilter;
let filterCallback;

//----Сброс значений по умолчанию----//
function resetToDefault() {
    if (clickedClass) previewPhoto.classList.remove(clickedClass);
    if (clickedNode && clickedNode.value !== 'none') {
        effectElement.classList.remove('hidden');
        effectValue.value = 100;
    } else {
        effectElement.classList.add('hidden');
        effectValue.value = 0;
    }
    pin.style.left = '100%';
    effectDepth.style.width = '100%';
    previewPhoto.style.filter = '';
    previewPhoto.style.transform = 'scale(1)';
    scaleControlInput.value = '100%';
    hashTag.style.outline = '';
};

//----Обработчик нажатия на +----//
function scaleMinusClickHandler(callback) {
    let scaleStep = 25;
    let scaleValue = parseInt(scaleControlInput.value);
    if (scaleValue > scaleStep) scaleControlInput.value = (scaleValue -
        scaleStep) + '%';
    callback(scaleControlInput.value);

};

//----Обработчик нажатия на - ----//
function scalePlusClickHandler(callback) {
    let scaleStep = 25;
    let maxScale = 100;
    let scaleValue = parseInt(scaleControlInput.value);
    if (scaleValue < maxScale) scaleControlInput.value = (scaleValue +
        scaleStep) + '%';
    callback(scaleControlInput.value);

};

//----Обработчик смены фильтра----//
function effectChangeHandler(evt) {
    clickedNode = evt.target;
    resetToDefault();
    currentFilter = effectValueToFilterName[evt.target.value];
    filterCallback = effectValueTofilterCallback[evt.target.value];
    clickedClass = effectValueToClassName[evt.target.value];
    if (clickedClass) previewPhoto.classList.add(clickedClass);
};

//----Обработчик Драг анд Дроп на ползунке смены уровня эффекта----//
function pinMouseDownHandler(event, callback) {
    event.preventDefault();
    let shiftX = event.clientX - pin.getBoundingClientRect().left;

    function mouseMoveHandler(event) {
        event.preventDefault();
        let newLeft = event.clientX - shiftX -
            pinLevelLine.getBoundingClientRect().left;

        if (newLeft < 0) {
            newLeft = 0;
        }

        let rightEdge = pinLevelLine.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }

        pin.style.left = newLeft + 'px';
        effectDepth.style.width = newLeft + 'px';
        let inputValueOfEfLevel = newLeft / pinLevelLine.offsetWidth * 100;
        effectValue.value = Math.round(inputValueOfEfLevel);
        if (callback) callback(newLeft);

    };

    function mouseUpHandler() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    pin.ondragstart = function() {
        return false;
    };

};

//----Показазть загруженную фотку на экране редактирования фото и вариантах фильтра----//
function showBlobImg() {
    const blobImage = imageInput.files[0];
    previewPhotoImg.src = URL.createObjectURL(blobImage);
    for (let item of effectPreviewImg) {
        item.style.backgroundImage = `url('${URL.createObjectURL(
            blobImage)}')`;
    }

};

//----Удалить загруженную фотку на экране редактирования фото и вариантах фильтра----//
export function deleteBlobImage() {
    const blobImage = imageInput.files[0];
    for (let item of effectPreviewImg) {
        item.style.backgroundImage = `url('${URL.revokeObjectURL(
            blobImage)}')`;
    }
};

//----Навешиваем обработчики выбора фильта, глубины эффекта, открытия и закрытия формы редактирования----//
scaleControlPlus.addEventListener('click', function() {
    scalePlusClickHandler(transformToCallback.scale);
});
scaleControlMinus.addEventListener('click', function() {
    ;
    scaleMinusClickHandler(transformToCallback.scale);

});
effectsBlock.addEventListener('change', effectChangeHandler);

uploadButton.addEventListener('change', function() {
    resetToDefault();
    utils.openElement(editForm);
    showBlobImg();
});
editFormCloseButton.addEventListener('click', function() {
    utils.closeElement(editForm);
    deleteBlobImage();
});

pin.addEventListener('mousedown', function(event) {
    pinMouseDownHandler(event, filterCallback);

});
form.addEventListener('submit', function(e) {
    e.preventDefault();
    ajaxPostRequest(new FormData(form), function() {
        utils.closeElement(editForm);
        resetToDefault();
        form.reset();
    });
});

//----Значения по умолчанию----//
effectValue.setAttribute('value', 0);
scaleControlInput.setAttribute('value', '100');
utils.closeElement(effectElement);

export {resetToDefault};
