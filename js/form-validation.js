"use strict";

import * as utils from './utils.js'

const uploadSection = document.querySelector('.img-upload');
const hashTag = uploadSection.querySelector('.text__hashtags');
const textArea = uploadSection.querySelector('.text__description');
const submitButton = uploadSection.querySelector('.img-upload__submit');

const hashTagValidateHandler = (element) => {

    let regExp = /(#[^#\s]{1,19})/g;
    let str = element.value;
    let arr = str.match(regExp);
    let isTrue = (regExp, str) => regExp.test(str);

    if (isTrue(/(?<!\w)#(?!\w)/, str)) {
        element.setCustomValidity('Хеш-тег не может состоять только из одной решётки');
        element.reportValidity();
        element.style.outline = '3px solid red';


    } else if (isTrue(/[^#\w\s]{1,}(?=.*)|((?<!#)(\b\w{1,19}\b ?){1,5})/, str)) {
        element.setCustomValidity('Хеш-тег начинается c решетшки');
        element.reportValidity();
        element.style.outline = '3px solid red';

    } else if (isTrue(/(#\w{1,19}#\w*){1,5}/, str)) {
        element.setCustomValidity('Хэш-теги разделяются пробелами');
        element.reportValidity();
        element.style.outline = '3px solid red';
    } else if (isTrue(/((?<=\s)#(?!\w))/, str)) {
        console.log('ssd');
        element.setCustomValidity('Хеш-тег не может состоять только из одной решётки;');
        element.reportValidity();
        element.style.outline = '3px solid red';
    } else if (isTrue(/(#[^#\s]{1,19} ?){6,}/, str)) {
        element.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
        element.reportValidity();
        element.style.outline = '3px solid red';
    } else if (isTrue(/(#[^#\s]{20,} ?)/, str)) {
        element.setCustomValidity('Максимальная длина одного хэш-тега может быть 20 символов, включая решётку');
        element.reportValidity();
        element.style.outline = '3px solid red';
    } else {
        element.setCustomValidity('');
        element.reportValidity();
        element.style.outline = '';


    }
    if (arr) {
        let result = arr.toString().toLowerCase().split(',');
        for (let item of result) {
            let similiar = 0;
            for (let i = 0; i < result.length; i++) {
                if (item === result[i]) {
                    similiar++;
                }
            }

            if (similiar > 1) {
                element.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
                element.reportValidity();
                element.style.outline = '3px solid red';

            }
        }
    }


};


const textAreaValidateHandler = (element) => {
    if (element.validity.tooLong) {
        element.setCustomValidity('длина комментария не может составлять больше 140 символов');
        element.style.outline = '3px solid red';
    } else {
        element.setCustomValidity('');
        element.style.outline = '';
    }

};

submitButton.addEventListener('click', function () {
    hashTagValidateHandler(hashTag);
    textAreaValidateHandler(textArea);
});

hashTag.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
})

textArea.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
})

