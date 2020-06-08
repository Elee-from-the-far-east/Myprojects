"use strict";

import {resetToDefault, form, deleteBlobImage} from './picture-effects.js'


const enterEventCode = 'Enter';
const escEventCode = 'Escape';
let elementToClose;

const isEscPressed = evt => evt.code === escEventCode;
const isEnterPressed = evt => evt.code === enterEventCode;
let check = (elem) => console.log(elem);


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


const escPressHandler = (evt) => {
    if (isEscPressed(evt)) {
        closeElement(elementToClose);

    }
};

const openElement = (element) => {
    element.classList.remove('hidden');
    elementToClose = element;
    document.addEventListener('keydown', escPressHandler);
};

const closeElement = (element) => {
    element.classList.add('hidden');
    document.removeEventListener('keydown', escPressHandler);
    document.body.classList.remove('modal-open')
    resetToDefault()
    form.reset();
    deleteBlobImage();

};



export {
    openElement,
    closeElement,
    check,
    escPressHandler,
    isEscPressed,
    isEnterPressed,
    getRandomInt
};

