"use strict";
//----Константы----//
const numberOfObjects = 25;
const minLikes = 15;
const maxLikes = 200;
const photoData = [];

//----Мок данные----//
const DATA = {
    url: [],
    likes: [],
    comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра', 'В конце концов это просто непрофессионально', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше', 'Лица у людей на фотке перекошены, как будто их избивают', 'Как можно было поймать такой неудачный момент?!'],
    description: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье.', 'Цените тех, кто рядом с вами и отгоняйте все сомненья.', 'Не обижайте всех словами......', 'Вот это тачка!'],
};

//----Заполняем массивы DATA.url & likes----//
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







//----На основании data массива помищаем необходимое кол-во (totalObj) фотографий со случайно сгенерированными данными из data в новый массив----//
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


export {photoData};
