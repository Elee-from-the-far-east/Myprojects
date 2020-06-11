'use strict';

// import {data} from './data.js';
import * as backend from './backend.js';
import {clearPictures, renderPictureElements} from './bigpicture.js';
import * as utils from './utils.js';
import * as filters from './filters.js';
import './picture-effects.js';
import './form-validation.js';

const defaultFilter = document.querySelector('#filter-default');
const filterRandom = document.querySelector('#filter-random');
const filterDisscussed = document.querySelector('#filter-discussed');
const picturesContainer = document.querySelector('.pictures');
const picture = picturesContainer.querySelectorAll('.pictures');
const filterButtons = document.querySelectorAll('.img-filters__button');

//----Перемная текущего фильтра изображений др пользавателей, экспорт в filters----//
export let clickedFIlter = 'filter-default';

//----Обработчики фильтров изображений др пользавателей----//
filterDisscussed.addEventListener('click', function(e) {
    clickedFIlter = e.target.id;
    clearPictures();
    utils.classToggler(filterButtons, filterDisscussed);
    renderPictureElements(filters.sortByPopularity());
});

defaultFilter.addEventListener('click', function(e) {
    clickedFIlter = e.target.id;
    clearPictures();
    utils.classToggler(filterButtons, defaultFilter);
    renderPictureElements(filters.filterIdToData['filter-default']);
});

const debounceFunction = utils.debounce(function(e) {
    clickedFIlter = e.target.id;
    clearPictures();
    utils.classToggler(filterButtons, filterRandom);
    renderPictureElements(filters.sortByRandom());
}, 300, true);

filterRandom.addEventListener('click', debounceFunction);

backend.ajaxGetRequest(renderPictureElements);
backend.ajaxGetRequest(filters.getServerData);

//renderPictureElements(data); Если не работает сервер




