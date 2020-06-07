'use strict';

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

//----Переменные----//
let clickedClass;
let clickedNode;
let currentFilter;
let filterCallback;

//----Значение по умолчанию----//
effectValue.value = 100;
scaleControlInput.value = '100%';
utils.closeElement(effectElement);

//----Обработчик нажатия на +----//
const scaleMinusClickHandler = () => {
    let scaleStep = 25;
    let scaleValue = parseInt(scaleControlInput.value);
    if (scaleValue > scaleStep) scaleControlInput.value = (scaleValue -
        scaleStep) + '%';
    let cssScaleIndex = parseInt(scaleControlInput.value) / 100;
    previewPhoto.style.transform = `scale(${cssScaleIndex})`;

};

//----Обработчик нажатия на - ----//
const scalePlusClickHandler = () => {
    let scaleStep = 25;
    let maxScale = 100;
    let scaleValue = parseInt(scaleControlInput.value);
    if (scaleValue < maxScale) scaleControlInput.value = (scaleValue +
        scaleStep) + '%';
    let cssScaleIndex = parseInt(scaleControlInput.value) / 100;
    previewPhoto.style.transform = `scale(${cssScaleIndex})`;
};

//----Обработчик смены фильтра----//
const effectChangeHandler = (evt) => {
    clickedNode = evt.target;
    resetToDefault();
    currentFilter = clickedNode.dataset.filter;
    if (currentFilter) {
        filterCallback = eval(`apply${clickedNode.dataset.filter.split(
            '')[0].toUpperCase()}${clickedNode.dataset.filter.slice(1)}`);
    }
    clickedClass = `effects__preview--${evt.target.value}`;
    previewPhoto.classList.add(`effects__preview--${evt.target.value}`);
};

//----Сброс значений по умолчанию----//
const resetToDefault = () => {
    if (clickedClass) previewPhoto.classList.remove(clickedClass);
    if (currentFilter) previewPhoto.style.filter = '';
    if (clickedNode && clickedNode.value !== 'none') {
        effectElement.classList.remove('hidden');
    }
    pin.style.left = '100%';
    effectDepth.style.width = '100%';
    effectValue.value = 100;
    previewPhoto.style.transform = 'scale(1)';
    scaleControlInput.value = '100%';
    hashTag.style.outline = '';
};

const applySepia = (index) => {
    let cssIndex = index / pinLevelLine.offsetWidth;
    previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
};

const applyGrayscale = (index) => {
    let cssIndex = index / pinLevelLine.offsetWidth;
    previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
};

const applyInvert = (index) => {
    let cssIndex = index / pinLevelLine.offsetWidth * 100 + '%';
    previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
};

const applyBlur = (index) => {
    let cssIndex = index * 3 / pinLevelLine.offsetWidth + 'px';
    previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;

};

const applyBrightness = (index) => {
    let cssIndex = 1 + (2 * index / pinLevelLine.offsetWidth);
    previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
};

//----Обработчик Драг анд Дроп на ползунке смены уровня эффекта----//
const pinMouseDownHandler = (event, callback) => {
    event.preventDefault();
    let shiftX = event.clientX - pin.getBoundingClientRect().left;

    const mouseMoveHandler = (event) => {
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

        callback(newLeft);

    };

    const mouseUpHandler = () => {
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
const showBlobImg = () => {
    const blobImage = imageInput.files[0];
    previewPhotoImg.src = URL.createObjectURL(blobImage);
    for (let item of effectPreviewImg) {
        item.style.backgroundImage = `url('${URL.createObjectURL(
            blobImage)}')`;
    }

};

//----Удалить загруженную фотку на экране редактирования фото и вариантах фильтра----//
export const deleteBlobImage = () => {
    const blobImage = imageInput.files[0];
    for (let item of effectPreviewImg) {
        item.style.backgroundImage = `url('${URL.revokeObjectURL(
            blobImage)}')`;
    }
};

//----Навешиваем обработчики выбора фильта, глубины эффекта, открытия и закрытия формы редактирования----//
scaleControlPlus.addEventListener('click', scalePlusClickHandler);
scaleControlMinus.addEventListener('click', scaleMinusClickHandler);
effectsBlock.addEventListener('change', effectChangeHandler);
checkedRadio.addEventListener('click', function() {
    utils.closeElement(effectElement);
});
uploadButton.addEventListener('change', function() {
    utils.openElement(editForm);
    showBlobImg();
});
editFormCloseButton.addEventListener('click', function() {
    utils.closeElement(editForm);
    resetToDefault();
    deleteBlobImage();
});

pin.addEventListener('mousedown', function(event) {
    pinMouseDownHandler(event, filterCallback);

});

export {resetToDefault};
