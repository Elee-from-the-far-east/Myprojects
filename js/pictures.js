"use strict";
let check = (elem) => console.log(elem);
const numberOfObjects = 25;
const minLikes = 15;
const maxLikes = 200;

var DATA = {
    url: [],
    likes: [],
    comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра', 'В конце концов это просто непрофессионально', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше', 'Лица у людей на фотке перекошены, как будто их избивают', 'Как можно было поймать такой неудачный момент?!'],
    description: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье.', 'Цените тех, кто рядом с вами и отгоняйте все сомненья.', 'Не обижайте всех словами......', 'Вот это тачка!'],
};

(function () {
    for (let i = 1; i <= numberOfObjects; i++) {
        DATA.url.push(`photos/${i}.jpg`);
    }
})();
(function () {
    for (let i = minLikes; i <= maxLikes; i++) {
        DATA.likes.push(i);

    }
})();


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const photoData = [];

// obj[dataKey]=new Array(data[dataKey][randomNumber])}
function makePhotoDataObj(data, container, totalObj) {
    for (let i = 0; i < totalObj; i++) {
        let obj = {};
        for (let dataKey in data) {
            let randomNumber = getRandomInt(data[dataKey].length - 1);
            if (dataKey === 'url') {
                obj[dataKey] = data[dataKey][i];
            }
            if (dataKey === 'comments') {
                obj[dataKey] = [];
                for (let i = 0; i < 2; i++) {
                    obj[dataKey].push(data[dataKey][getRandomInt(data[dataKey].length - 1)]);
                }
            }
            if (dataKey !== 'urlNumbers' && dataKey !== 'likesNumbers' && dataKey !== 'url' && dataKey !== 'comments') {
                obj[dataKey] = data[dataKey][randomNumber];
            }
        }
        container.push(obj);
    }
}

makePhotoDataObj(DATA, photoData, numberOfObjects);


const pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

const picturesContainer = document.querySelector('.pictures');


function makePictureElement(data) {
    let newElement = pictureTemplate.cloneNode(true);
    newElement.querySelector('.picture__img').src = data.url;
    newElement.querySelector('.picture__likes').textContent = data.likes;
    newElement.querySelector('.picture__comments').textContent = data.comments;
    newElement.addEventListener('click', function (evt) {
        openElement(bigPicture);
        showBigPicture(data);
    });
    return newElement;
};

function showBigPicture(data) {
    bigPictureImg.src = data.url;
    likesCount.textContent = data.likes;
    photoDiscrition.textContent = data.description;
    for (let i = 0; i < commentText.length; i++) {
        commentText[i].textContent = data.comments[i];
    }
}


function renderPictureElements(data) {
    let fragment = document.createDocumentFragment();
    for (let item of data) {
        fragment.appendChild(makePictureElement(item));
    }
    picturesContainer.appendChild(fragment);
}

renderPictureElements(photoData);


const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const photoDiscrition = bigPicture.querySelector('.social__caption');
const commentList = bigPicture.querySelector('.social__comments');
const commentText = document.querySelectorAll('.social__text');

// Не понятно 5 из восьми комментариев
const commentsCount = bigPicture.querySelector('.comments-count');
commentsCount.textContent = DATA.comments.length;
//
const socialAvatar = bigPicture.querySelector('.social__picture');
socialAvatar.src = `img/avatar-${Math.ceil(Math.random() * 6)}.svg`;


const socialCommentblock = document.querySelector('.social__comment-count');
const uploadSocialButton = document.querySelector('.comments-loader');
socialCommentblock.classList.add('visually-hidden');
uploadSocialButton.classList.add('visually-hidden');


//____________________________________//

const uploadSection = document.querySelector('.img-upload');
const uploadButton = uploadSection.querySelector('#upload-file');
const form = uploadSection.querySelector('form');
const editForm = uploadSection.querySelector('.img-upload__overlay');
const editFormCloseButton = uploadSection.querySelector('.img-upload__cancel');
const previewPhoto = uploadSection.querySelector('.img-upload__preview');
const scaleControlMinus = uploadSection.querySelector('.scale__control--smaller');
const scaleControlPlus = uploadSection.querySelector('.scale__control--bigger');
const scaleControlInput = uploadSection.querySelector('.scale__control--value');
const effectElement = uploadSection.querySelector('.effect-level');
const effectValue = uploadSection.querySelector('.effect-level__value');
const effectsBlock = uploadSection.querySelector('.effects__list');
const checkedRadio = uploadSection.querySelector('input[checked]');
const effectDepth = uploadSection.querySelector('.effect-level__depth');
const pinLevelLine = document.querySelector('.effect-level__line');
const pin = uploadSection.querySelector('.effect-level__pin');

const enterEventCode = 'Enter';
const escEventCode = 'Escape';

//Значения по умолчанию
effectValue.value = 0;
scaleControlInput.value = '100%';


let clickedClass;
let clickedNode;
let currentFilter;

const isEscPressed = evt => evt.code === escEventCode;
const isEnterPressed = evt => evt.code === enterEventCode;

const escPressHandler = (evt, element) => {
    if (isEscPressed(evt)) {
        closeElement(element);
        resetToDefault();
    }
};

const openElement = (element = editForm) => {
    element.classList.remove('hidden');
    document.addEventListener('keydown', function (evt) {
        escPressHandler(evt, element);
    }, {once: true});
};

const closeElement = (element = editForm) => {
    element.classList.add('hidden');

};

uploadButton.addEventListener('change', function (evt) {
    openElement();
});

editFormCloseButton.addEventListener('click', function (evt) {
    closeElement();
    resetToDefault();
});


//_Scale listeners//

const scaleMinusClickHandler = () => {
    let scaleStep = 25;
    let scaleValue = parseInt(scaleControlInput.value);
    if (scaleValue > scaleStep) scaleControlInput.value = (scaleValue - scaleStep) + '%';
    let cssScaleIndex = parseInt(scaleControlInput.value) / 100;
    previewPhoto.style.transform = `scale(${cssScaleIndex})`;

};

const scalePlusClickHandler = () => {
    let scaleStep = 25;
    let maxScale = 100;
    let scaleValue = parseInt(scaleControlInput.value);
    if (scaleValue < maxScale) scaleControlInput.value = (scaleValue + scaleStep) + '%';
    let cssScaleIndex = parseInt(scaleControlInput.value) / 100;
    previewPhoto.style.transform = `scale(${cssScaleIndex})`;
};

scaleControlPlus.addEventListener('click', scalePlusClickHandler);
scaleControlMinus.addEventListener('click', scaleMinusClickHandler);

//___________//


checkedRadio.addEventListener('click', function () {
    closeElement(effectElement);

});


//_______photoEdit_______//


closeElement(effectElement);

const resetToDefault = () => {
    if (clickedClass) previewPhoto.classList.remove(clickedClass);
    if (currentFilter) previewPhoto.style.filter = '';
    pin.style.filter = '';
    effectDepth.style.width = '100%';
    pin.style.left = '100%';
    previewPhoto.style.transform = 'scale(1)';
    scaleControlInput.value = '100%';
    effectValue.value = 100;
    if (clickedNode && clickedNode.value !== 'none') {
        effectElement.classList.remove('hidden');
    }

};

const effectChangeHandler = (evt) => {
    clickedNode = evt.target;
    resetToDefault();
    clickedClass = `effects__preview--${evt.target.value}`;
    currentFilter = clickedNode.dataset.filter;
    previewPhoto.classList.add(`effects__preview--${evt.target.value}`);

};


effectsBlock.addEventListener('change', effectChangeHandler);


// const radioButtons = uploadSection.querySelectorAll('.effects__preview');
// for (let radioButton of radioButtons) {
//     radioButton.addEventListener('click', function () {
//         for (var i = 0; i < radioButtons.length; i++) {
//             previewPhoto.classList.remove(radioButtons[i].dataset.filter)
//         }
//         previewPhoto.classList.add(radioButton.dataset.filter);
//     });
// }


// const radioButtons = uploadSection.querySelectorAll('.effects__preview');
// let clicked;
// for (let radioButton of radioButtons) {
//     radioButton.addEventListener('click', function () {
//        if(clicked) previewPhoto.classList.remove(clicked)
//         previewPhoto.classList.add(radioButton.dataset.filter);
//        clicked = radioButton.dataset.filter;
//     });
// }


// openElement(editForm);


pin.addEventListener('mousedown', function (event) {
    event.preventDefault();
    let shiftX = event.clientX - pin.getBoundingClientRect().left;


    const mouseMoveHandler = (event) => {
        event.preventDefault();
        let newLeft = event.clientX - shiftX - pinLevelLine.getBoundingClientRect().left;

        if (newLeft < 0) {
            newLeft = 0;
        }
        let rightEdge = pinLevelLine.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }

        pin.style.left = newLeft + 'px';
        effectDepth.style.width = newLeft + 'px';


        let cssIndex = newLeft / pinLevelLine.offsetWidth;
        let cssIndexPx = newLeft * 3 / pinLevelLine.offsetWidth + 'px';
        let cssIndex100 = newLeft / pinLevelLine.offsetWidth * 100 + '%';
        let cssIndexBright = 1 + (2 * newLeft / pinLevelLine.offsetWidth);
        let inputValueOfEfLevel = newLeft / pinLevelLine.offsetWidth * 100;
        effectValue.value = inputValueOfEfLevel;

        if (currentFilter && currentFilter === "sepia" || currentFilter === "grayscale") {
            previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;

        }
        if (currentFilter && currentFilter === "invert") {
            previewPhoto.style.filter = `${currentFilter}(${cssIndex100})`;

        }
        if (currentFilter && currentFilter === "blur") {
            previewPhoto.style.filter = `${currentFilter}(${cssIndexPx})`;

        }
        if (currentFilter && currentFilter === "brightness") {
            previewPhoto.style.filter = `${currentFilter}(${cssIndexBright})`;
        }
    };


    const mouseUpHandler = () => {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);

    };


    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    pin.ondragstart = function () {
        return false;
    };

});

function validate() {

}


const hashTag = uploadSection.querySelector('.text__hashtags');
hashTag.addEventListener('change', function (evt) {
        let regExp = /(#\w{1,19} ?){1,5}/;
        let str = hashTag.value;
        let arr = str.match(regExp);
        let isTrue = (regExp, str) => regExp.test(str);

        check(/(#(?!\w))|((?<=\s)#(?!\w))/.test(str));
        if (isTrue(/(#(?!\w))/, str)) {
            hashTag.setCustomValidity('Хеш-тег не может состоять только из одной решётки');
            hashTag.reportValidity();

        }


        if (arr) {
            let result = arr[0].toLowerCase().split(' ');
            for (let item of result) {
                let similiar = 0;
                for (let i = 0; i < result.length; i++) {
                    if (item === result[i]) similiar++;
                }
                if (similiar > 1) {
                    hashTag.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
                    hashTag.reportValidity();

                } else if (isTrue(/(#\w{1,19}#){1,5}/, str)) {
                    hashTag.setCustomValidity('Хэш-теги разделяются пробелами');
                    hashTag.reportValidity();

                } else if (isTrue(/((?<=\s)#(?!\w))/, str)) {
                    console.log('ssd');
                    hashTag.setCustomValidity('Хеш-тег не может состоять только из одной решётки;');
                    hashTag.reportValidity();

                } else if (item.length > 19) {
                    hashTag.setCustomValidity('Максимальная длина одного хэш-тега 20 символов, включая решётку');
                    hashTag.reportValidity();

                } else if (isTrue(/((?<!#)\w{1,19} ?){1,5}/, str)) {
                    hashTag.setCustomValidity('Хеш-тег начинается решетшки');
                    hashTag.reportValidity();
                } else if (result.length > 5) {
                    hashTag.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
                    hashTag.reportValidity();

                } else {
                    hashTag.setCustomValidity('');
                    hashTag.reportValidity();
                }
            }
        }
        document.addEventListener('keydown', escPressHandler, {once: true});
    }
);


openElement(editForm);


// if (isTrue(/#(?!\w)/, str)) {
//     console.log('ssd');
//     hashTag.setCustomValidity('Хэш-тег начинается с символа # (решётка);');
//     hashTag.reportValidity();
// }
// if (isTrue(/(?<=\s)#(?!\w)/, str)) {
//     console.log('ПРивет');
//     hashTag.setCustomValidity('Хэш-тег начинается с символа # (решётка);');
//     hashTag.reportValidity();
// }
//
// if (isTrue(/#(?!\w)/, str) || isTrue(/(?<=\s)#(?!\w)/, str)) {
//     console.log('ssd');
//     hashTag.setCustomValidity('Хэш-тег начинается с символа # (решётка);');
//     hashTag.reportValidity();
// }
