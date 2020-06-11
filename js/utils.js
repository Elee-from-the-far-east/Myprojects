'use strict';

const enterEventCode = 'Enter';
const escEventCode = 'Escape';

const isEscPressed = evt => evt.code === escEventCode;
const isEnterPressed = evt => evt.code === enterEventCode;
let check = (elem) => console.log(elem);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function escPressHandler(element, evt) {
    if (isEscPressed(evt)) {
        closeElement(element);

    }
};

function openElement(element) {
    element.classList.remove('hidden');
    document.addEventListener('keydown', escPressHandler.bind(this, element));
};

function closeElement(element) {
    element.classList.add('hidden');
    document.removeEventListener('keydown', escPressHandler);
    document.body.classList.remove('modal-open');
};

function classToggler(arrToclear, element) {
    arrToclear.forEach(
        item => item.classList.remove('img-filters__button--active'));
    element.classList.add('img-filters__button--active');
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
};

export {
    debounce,
    classToggler,
    openElement,
    closeElement,
    check,
    escPressHandler,
    isEscPressed,
    isEnterPressed,
    getRandomInt,
};

