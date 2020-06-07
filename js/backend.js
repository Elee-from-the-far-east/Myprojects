'use strict';

import * as utils from './utils.js';
import {renderPictureElements} from './pictures.js'

const xhr = new XMLHttpRequest();
const url = 'https://javascript.pages.academy/kekstagram/data';

xhr.open('GET', url);
let photoData;

xhr.addEventListener('load', function() {
    if (xhr.status === 200)
    photoData= JSON.parse(xhr.responseText);
    renderPictureElements(photoData)

});

xhr.addEventListener('error', function() {


});


xhr.send();




