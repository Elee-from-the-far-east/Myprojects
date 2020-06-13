'use strict';

const enterEventCode = 'Enter';
const escEventCode = 'Escape';

const isEscPressed = (evt) => evt.code === escEventCode;
const isEnterPressed = (evt) => evt.code === enterEventCode;
const check = (elem) => console.log(elem);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function escPressHandler(element, evt) {
    if (isEscPressed(evt)) {
        closeElement(element);

    }
}

function openElement(element) {
    element.classList.remove('hidden');
    document.addEventListener('keydown', escPressHandler.bind(this, element));
}

function closeElement(element) {
    element.classList.add('hidden');
    document.removeEventListener('keydown', escPressHandler);
    document.body.classList.remove('modal-open');
}

function classToggler(arrToclear, element) {
    arrToclear.forEach(
        (item) => item.classList.remove('img-filters__button--active'));
    element.classList.add('img-filters__button--active');
}

function debounce(func, wait) {
    let timeout;
    return (e) => {
        function later() {
            timeout = null;
        }

        const callNow = !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func(e);
        }
    };
}



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

