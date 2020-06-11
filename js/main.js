'use strict';


import {resetToDefault} from './picture-effects.js';
// import {data} from './data.js';
import {data} from './backend.js'
import * as backend from './backend.js';
import {renderPictureElements, clearPictures} from './pictures.js';
import './form-validation.js';
import * as utils from './utils.js'
import * as filters from './filters.js';


const defaultFilter = document.querySelector('#filter-default');
const filterRandom = document.querySelector('#filter-random');
const filterDisscussed = document.querySelector('#filter-discussed');
const picturesContainer = document.querySelector('.pictures');
const picture = picturesContainer.querySelectorAll('.pictures')
const filterButtons = document.querySelectorAll('.img-filters__button')


//----Перемная текущего фильтра изображений др пользавателей, экспорт в filters----//
export let clickedFIlter= 'filter-default';


//----Обработчики фильтров изображений др пользавателей----//
filterDisscussed.addEventListener('click', function(e) {
    clickedFIlter=e.target.id;
    clearPictures();
    utils.classToggler(filterButtons,filterDisscussed)
    renderPictureElements(filters.sortByPopularity(data));
});

defaultFilter.addEventListener('click', function(e) {
    clickedFIlter=e.target.id;
    clearPictures();
    utils.classToggler(filterButtons,defaultFilter)
    renderPictureElements(data);
});

filterRandom.addEventListener('click', function(e) {
    clickedFIlter=e.target.id;
    clearPictures();
    utils.classToggler(filterButtons,filterRandom)
    renderPictureElements(filters.sortByRandom(data));
});

//renderPictureElements(data); Если не работает сервер

backend.ajaxGetRequest(renderPictureElements);


