'use strict';

import * as utils from './utils.js';
import {ajaxGetRequest} from './backend.js';
import {clearPictures, renderPictureElements} from './bigpicture.js';


const defaultFilter = document.querySelector('#filter-default');
const filterRandom = document.querySelector('#filter-random');
const filterDisscussed = document.querySelector('#filter-discussed');
const picturesContainer = document.querySelector('.pictures');
const picture = picturesContainer.querySelectorAll('.pictures');
const filterButtons = document.querySelectorAll('.img-filters__button');// ----Перемная текущего фильтра изображений др пользавателей, экспорт в filters----//


export let clickedFIlter = 'filter-default';
export const filterIdToData = {
    'filter-default': [],
};

function getServerData(data) {
    return filterIdToData['filter-default'] = data;
}

function sortByPopularity(data = filterIdToData['filter-default']) {
    const dataCopy = data.slice();
    const newArr = dataCopy.sort(
        (a, b) => b.comments.length - a.comments.length);
    return filterIdToData['filter-discussed'] = newArr;
}

function sortByRandom(data = filterIdToData['filter-default']) {
    const randomNumbers = [];
    while (randomNumbers.length < 10) {
        const random = utils.getRandomInt(25);
        if (!randomNumbers.some((item) => item === random)) {
            randomNumbers.push(random);
        }
    }
    const randomArray = randomNumbers.map((item) => data[item]);
    return filterIdToData['filter-random'] = randomArray;
}


// ----Обработчики фильтров изображений др пользавателей----//
filterDisscussed.addEventListener('click', function(e) {
    clickedFIlter = e.target.id;
    clearPictures();
    utils.classToggler(filterButtons, filterDisscussed);
    renderPictureElements(sortByPopularity());
});

defaultFilter.addEventListener('click', function(e) {
    clickedFIlter = e.target.id;
    clearPictures();
    utils.classToggler(filterButtons, defaultFilter);
    renderPictureElements(filterIdToData['filter-default']);
});

const debounceFunction = utils.debounce(function(e) {
    clickedFIlter = e.target.id;
    clearPictures();
    utils.classToggler(filterButtons, filterRandom);
    renderPictureElements(sortByRandom());
}, 300);

filterRandom.addEventListener('click', debounceFunction);

ajaxGetRequest(getServerData);

